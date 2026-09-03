// scripts/check-tickets.js
//
// 常設の「チケット発売スケジュール」ページを持つクラブを定期的に巡回し、
// まだ判明していない試合の発売日が新たに公開されていないかを確認する。
// 見つかった場合は src/data/schedules.js のREAL_SCHEDULES内に直接 saleDate を追記する。
//
// 対象は「表形式で常に最新の情報が同じURLに載っているクラブ」に限定している
// (個別記事形式・画像形式のクラブは対象外。誤読を防ぐため、日付の整合性が
// 取れないものは書き込まない)。

const fs = require('fs');
const cheerio = require('cheerio');

// 注意: App.jsxをdata/utils/componentsに分割した際にパスを追従させる必要がある。
// (2026-07-20: REAL_SCHEDULESの移設に伴いsrc/App.jsx→src/data/schedules.jsへ修正)
const SCHEDULES_PATH = 'src/data/schedules.js';

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
  // kawasakiは対象外: frontale.co.jp/tickets/はJavaScriptで動的に描画される
  // ページで、生HTMLの取得(fetch+cheerio)には試合情報が一切含まれないため、
  // このスクリプトの方式では原理的に自動チェックできない。手動確認が必要。
  { teamId: 'kobe', url: 'https://www.vissel-kobe.co.jp/ticket/schedule/' },
  // format: 'slash' = 「一般」の文字列が日付の近くになく、表の列位置(最後の日時)で
  // 一般販売を判定する必要があるページ
  { teamId: 'ynmarinos', url: 'https://www.f-marinos.com/ticket/schedule', format: 'slash' },
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
// (「一般」の文字列が日付の近くに書かれている、多くのクラブのページ向け)
function findSaleDateKanjiFormat(text, opponentHints) {
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

// 対戦相手名から「詳細はこちら」までの1試合分のブロックを切り出し、その中に
// 並ぶ「M/D(曜)HH:MM」形式の日時のうち最後(=一次→二次→三次→一般の並び順で
// 一番最後に出てくる一般販売)を採用する。「一般」という文字列が日付の近くに
// 繰り返し書かれておらず、表の列位置だけで種別が分かるページ向け
// (例: 横浜F・マリノス公式サイト)。
function findSaleDateSlashFormat(text, opponentHints) {
  for (const hint of opponentHints) {
    const idx = text.indexOf(hint);
    if (idx === -1) continue;
    const blockEnd = text.indexOf('詳細は', idx);
    if (blockEnd === -1) continue;
    const windowText = text.slice(idx, blockEnd);

    const matches = [...windowText.matchAll(/(\d{1,2})\/(\d{1,2})\([^)]{1}\)\s*(\d{1,2}):(\d{2})/g)];
    if (matches.length === 0) continue;
    const [, month, day, hour, minute] = matches[matches.length - 1];
    return { month: Number(month), day: Number(day), hour: Number(hour), minute: Number(minute) };
  }
  return null;
}

// 「M/D(曜)HH:MM」ではなく、各段階の日付に時刻が付かず「M/D(曜)」だけが
// 並ぶページ向け(発売時間はページ内に「各発売日の10:00〜」のように一括で
// 記載されているため10:00固定とする)。試合日自体は全角括弧「（）」で
// 書かれていることが多く、半角括弧の日付のみを拾うことで誤検出を避ける
// (例: 川崎フロンターレ公式サイト)。ブロックの終端は各行の末尾に必ず
// 現れる「開催内容」で区切る。
function findSaleDateSlashNoTimeFormat(text, opponentHints) {
  for (const hint of opponentHints) {
    const idx = text.indexOf(hint);
    if (idx === -1) continue;
    const blockEnd = text.indexOf('開催内容', idx);
    if (blockEnd === -1) continue;
    const windowText = text.slice(idx, blockEnd);

    const matches = [...windowText.matchAll(/(\d{1,2})\/(\d{1,2})\([^)]{1}\)/g)];
    if (matches.length === 0) continue;
    const [, month, day] = matches[matches.length - 1];
    return { month: Number(month), day: Number(day), hour: 10, minute: 0 };
  }
  return null;
}

function findSaleDateInText(text, opponentHints, format) {
  if (format === 'slash') return findSaleDateSlashFormat(text, opponentHints);
  if (format === 'slash-no-time') return findSaleDateSlashNoTimeFormat(text, opponentHints);
  return findSaleDateKanjiFormat(text, opponentHints);
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

// REAL_SCHEDULESは各クラブの視点ごとに別々のエントリを持つ構造のため、
// 同じ試合でもホーム側にしかsaleDateが反映されず、アウェイ側は「発売日未定」の
// ままになってしまう(このスクリプトはホームゲームしか巡回しないため)。
// 毎回の実行の最後に、片方に判明済みのsaleDateがあればもう片方のエントリにも
// ミラーリングし、常に両チーム分が一致した状態を保つ。
function mirrorSaleDatesAcrossTeams(src) {
  const REAL_SCHEDULES = eval('(' + src.slice(src.indexOf('{', src.indexOf('export const REAL_SCHEDULES')), src.lastIndexOf('};', src.indexOf('// ---- 遠征記録')) + 1) + ')');

  const updates = [];
  for (const [teamId, fixtures] of Object.entries(REAL_SCHEDULES)) {
    for (const f of fixtures) {
      if (f.saleDate) continue;
      const opp = REAL_SCHEDULES[f.opponentId];
      if (!opp) continue;
      const match = opp.find((e) => e.opponentId === teamId && e.date === f.date);
      if (!match || !match.saleDate) continue;
      updates.push({ teamId, matchday: f.matchday, opponentId: f.opponentId, date: f.date, saleDate: match.saleDate });
    }
  }

  let applied = 0;
  for (const u of updates) {
    const teamArrayRegex = new RegExp(`(${u.teamId}:\\s*\\[)([\\s\\S]*?)(\\n\\s*\\],)`);
    const teamMatch = src.match(teamArrayRegex);
    if (!teamMatch) continue;

    const teamBlock = teamMatch[2];
    const entryRegex = new RegExp(
      `\\{\\s*matchday:\\s*${u.matchday},\\s*isHome:\\s*(?:true|false),\\s*opponentId:\\s*'${u.opponentId}'[^}]*?date:\\s*'${u.date}'[^}]*?\\}`
    );
    const entryMatch = teamBlock.match(entryRegex);
    if (!entryMatch || entryMatch[0].includes('saleDate')) continue;

    const updatedEntry = entryMatch[0].replace(/\s*\}$/, `, saleDate: '${u.saleDate}' }`);
    const newTeamBlock = teamBlock.replace(entryMatch[0], updatedEntry);
    src = src.replace(teamMatch[0], teamMatch[1] + newTeamBlock + teamMatch[3]);
    applied++;
    console.log(`[mirror] ${u.teamId} vs ${u.opponentId} (${u.date}): ${u.opponentId}側の発売日を反映`);
  }

  return { src, applied };
}

async function main() {
  let src = fs.readFileSync(SCHEDULES_PATH, 'utf8');
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

      const found = findSaleDateInText(pageText, hints, club.format);
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

  const mirrored = mirrorSaleDatesAcrossTeams(src);
  src = mirrored.src;
  totalUpdates += mirrored.applied;

  if (totalUpdates > 0) {
    fs.writeFileSync(SCHEDULES_PATH, src, 'utf8');
    console.log(`合計 ${totalUpdates} 件の発売日を自動反映しました。`);
  } else {
    console.log('新しい発売日は見つかりませんでした。');
  }
}

main().catch((e) => {
  console.error('スクリプト実行中にエラーが発生しました:', e);
  process.exit(1);
});
