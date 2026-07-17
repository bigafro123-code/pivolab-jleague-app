// scripts/check-tickets.js
//
// 常設の「チケット発売スケジュール」ページを持つクラブを定期的に巡回し、
// まだ判明していない試合の発売日が新たに公開されていないかを確認する。
// 見つかった場合は src/App.jsx のREAL_SCHEDULES内に直接 saleDate を追記する。
//
// 対象は「表形式で常に最新の情報が同じURLに載っているクラブ」に限定している
// (個別記事形式・画像形式のクラブは対象外。誤読を防ぐため、日付の整合性が
// 取れないものは書き込まない)。

const fs = require('fs');
const cheerio = require('cheerio');

const APP_JSX_PATH = 'src/App.jsx';

// 対象クラブ: 常設の発売スケジュールページ
const CLUBS = [
  { teamId: 'nagoya', url: 'https://nagoya-grampus.jp/ticket/schedule/' },
  { teamId: 'urawa', url: 'https://www.urawa-reds.co.jp/ticket/saleperiod.php' },
  { teamId: 'machida', url: 'https://www.zelvia.co.jp/stadium-ticket/schedule/' },
  { teamId: 'cerezo', url: 'https://www.cerezo.jp/ticket/' },
  { teamId: 'hiroshima', url: 'https://www.sanfrecce.co.jp/tickets/schedule' },
  { teamId: 'kashiwa', url: 'https://www.reysol.co.jp/ticket/tktscd.php' },
  { teamId: 'kashima', url: 'https://www.antlers.co.jp/pages/tickets' },
  { teamId: 'fctokyo', url: 'https://www.fctokyo.co.jp/ticket/price/' },
  { teamId: 'shimizu', url: 'https://www.s-pulse.co.jp/tickets/schedule' },
  { teamId: 'kyoto', url: 'https://www.sanga-fc.jp/ticket/schedule' },
  { teamId: 'gamba', url: 'https://www.gamba-osaka.net/ticket/schedule/' },
  { teamId: 'nagasaki', url: 'https://www.v-varen.com/tickets_new' },
  { teamId: 'verdy', url: 'https://www.verdy.co.jp/ticket/schedule/' },
];

// 対戦相手チームIDの表記ゆれ(ページ内テキストとの照合に使う)
const TEAM_NAME_HINTS = {
  kashima: ['鹿島'],
  mito: ['水戸'],
  urawa: ['浦和'],
  chiba: ['千葉'],
  kashiwa: ['柏'],
  fctokyo: ['FC東京', 'ＦＣ東京'],
  verdy: ['ヴェルディ', '東京Ｖ'],
  machida: ['町田'],
  kawasaki: ['川崎'],
  ynmarinos: ['横浜Ｆ', '横浜F', 'マリノス'],
  shimizu: ['清水'],
  nagoya: ['名古屋'],
  kyoto: ['京都'],
  gamba: ['ガンバ', 'Ｇ大阪', 'G大阪'],
  cerezo: ['セレッソ', 'Ｃ大阪', 'C大阪'],
  kobe: ['神戸'],
  okayama: ['岡山'],
  hiroshima: ['広島'],
  fukuoka: ['福岡'],
  nagasaki: ['長崎'],
};

async function fetchPageText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TicketCheckerBot/1.0)' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);
  $('script, style, noscript').remove();
  return $('body').text().replace(/\s+/g, ' ');
}

// テキストの中から「対戦相手名 ... 一般 ... M月D日 ... HH:MM」のパターンを探す
function findSaleDateInText(text, opponentHints) {
  for (const hint of opponentHints) {
    const idx = text.indexOf(hint);
    if (idx === -1) continue;
    const windowText = text.slice(Math.max(0, idx - 100), idx + 300);

    const withTime = windowText.match(/一般[^\d]{0,10}(\d{1,2})月(\d{1,2})日[^\d]{0,10}(\d{1,2}):(\d{2})/);
    if (withTime) {
      const [, month, day, hour, minute] = withTime;
      return { month: Number(month), day: Number(day), hour: Number(hour), minute: Number(minute) };
    }

    const withoutTime = windowText.match(/一般[^\d]{0,10}(\d{1,2})月(\d{1,2})日/);
    if (withoutTime) {
      const [, month, day] = withoutTime;
      return { month: Number(month), day: Number(day), hour: 10, minute: 0 }; // 時刻不明時は10:00と仮定
    }
  }
  return null;
}

function resolveSaleYear(saleMonth, matchDateStr) {
  const matchDate = new Date(matchDateStr);
  const matchYear = matchDate.getFullYear();
  const matchMonth = matchDate.getMonth() + 1;
  // 発売月が試合月より後の数字なら、年をまたいでいる(前年の発売)とみなす
  return saleMonth > matchMonth ? matchYear - 1 : matchYear;
}

// 発売日が試合日より前で、かつ90日以内であることを確認する(誤読対策)
function buildSaneSaleDate(found, matchDateStr) {
  const year = resolveSaleYear(found.month, matchDateStr);
  const pad = (n) => String(n).padStart(2, '0');
  const jstIso = `${year}-${pad(found.month)}-${pad(found.day)}T${pad(found.hour)}:${pad(found.minute)}:00+09:00`;
  const saleDate = new Date(jstIso);
  const matchDate = new Date(`${matchDateStr}T00:00:00+09:00`);
  const diffDays = (matchDate - saleDate) / (1000 * 60 * 60 * 24);
  if (diffDays < 0 || diffDays > 90) return null;
  return jstIso;
}

async function main() {
  let src = fs.readFileSync(APP_JSX_PATH, 'utf8');
  let totalUpdates = 0;

  for (const club of CLUBS) {
    let pageText;
    try {
      pageText = await fetchPageText(club.url);
    } catch (e) {
      console.error(`[${club.teamId}] ページ取得失敗: ${e.message}`);
      continue;
    }

    const teamArrayRegex = new RegExp(`(${club.teamId}:\\s*\\[)([\\s\\S]*?)(\\n\\s*\\],)`);
    const teamMatch = src.match(teamArrayRegex);
    if (!teamMatch) {
      console.warn(`[${club.teamId}] REAL_SCHEDULES内に見つかりません(スキップ)`);
      continue;
    }

    const teamBlock = teamMatch[2];
    let newTeamBlock = teamBlock;
    const entryRegex = /\{\s*matchday:\s*(\d+),\s*isHome:\s*(true|false),\s*opponentId:\s*'([a-z]+)'[^}]*?date:\s*'([\d-]+)'[^}]*?\}/g;

    let entryMatchResult;
    while ((entryMatchResult = entryRegex.exec(teamBlock)) !== null) {
      const [fullEntry, , isHome, opponentId, dateStr] = entryMatchResult;
      if (isHome !== 'true') continue; // 発売日はホームゲームのみ対象
      if (fullEntry.includes('saleDate')) continue; // 既に判明済み

      const hints = TEAM_NAME_HINTS[opponentId];
      if (!hints) continue;

      const found = findSaleDateInText(pageText, hints);
      if (!found) continue;

      const jstIso = buildSaneSaleDate(found, dateStr);
      if (!jstIso) {
        console.warn(`[${club.teamId}] ${opponentId}戦: 発売日らしき記述はあったが日付の整合性チェックに失敗(見送り)`);
        continue;
      }

      const updatedEntry = fullEntry.replace(/\s*\}$/, `, saleDate: '${jstIso}' }`);
      newTeamBlock = newTeamBlock.replace(fullEntry, updatedEntry);
      totalUpdates++;
      console.log(`[${club.teamId}] ${opponentId}戦の発売日を追加: ${jstIso}`);
    }

    if (newTeamBlock !== teamBlock) {
      src = src.replace(teamMatch[0], teamMatch[1] + newTeamBlock + teamMatch[3]);
    }
  }

  if (totalUpdates > 0) {
    fs.writeFileSync(APP_JSX_PATH, src, 'utf8');
    console.log(`合計 ${totalUpdates} 件の発売日を自動反映しました。`);
  } else {
    console.log('新しい発売日は見つかりませんでした。');
  }
}

main().catch((e) => {
  console.error('スクリプト実行中にエラーが発生しました:', e);
  process.exit(1);
});
