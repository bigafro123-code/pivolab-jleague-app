import React, { useState, useMemo } from 'react';
import { Calendar, MapPin, Ticket, ExternalLink, CalendarPlus, Check } from 'lucide-react';

// ---- モックデータ ----------------------------------------------------

const TEAMS = [
  { id: 'urawa',    name: '浦和レッズ',       short: '浦和',   color: '#C8102E', stadium: '埼玉スタジアム2002',       coords: { lat: 35.9040, lng: 139.7194 }, ticketSystem: { name: 'クラブ公式チケット', url: 'https://ticket.urawa-reds.example.jp' } },
  { id: 'kashiwa',  name: '柏レイソル',       short: '柏',     color: '#F5A623', stadium: '三協フロンテア柏スタジアム', coords: { lat: 35.9007, lng: 139.9264 }, ticketSystem: { name: 'イープラス',       url: 'https://eplus.example.jp/kashiwa' } },
  { id: 'gamba',    name: 'ガンバ大阪',       short: 'G大阪',  color: '#0057A8', stadium: 'パナソニックスタジアム吹田', coords: { lat: 34.7815, lng: 135.5225 }, ticketSystem: { name: 'チケットぴあ',     url: 'https://t.pia.example.jp/gamba' } },
  { id: 'kawasaki', name: '川崎フロンターレ', short: '川崎F',  color: '#1D2088', stadium: '等々力陸上競技場',           coords: { lat: 35.5701, lng: 139.6573 }, ticketSystem: { name: 'Jリーグチケット',   url: 'https://www.jleague-ticket.example.jp/kawasaki' } },
  { id: 'ynmarinos',name: '横浜F・マリノス', short: '横浜FM', color: '#0A2F6B', stadium: '日産スタジアム',             coords: { lat: 35.5089, lng: 139.6047 }, ticketSystem: { name: 'クラブ公式チケット', url: 'https://ticket.f-marinos.example.jp' } },
  { id: 'kobe',     name: 'ヴィッセル神戸',   short: '神戸',   color: '#7B0028', stadium: 'ノエビアスタジアム神戸',     coords: { lat: 34.6621, lng: 135.1758 }, ticketSystem: { name: 'チケットぴあ',     url: 'https://t.pia.example.jp/vissel' } },
  { id: 'hiroshima',name: 'サンフレッチェ広島', short: '広島', color: '#5B2A86', stadium: 'エディオンピースウイング広島', coords: { lat: 34.3963, lng: 132.4596 }, ticketSystem: { name: 'サンフレチケット', url: 'https://ticket.sanfrecce.co.jp/' } },
  { id: 'nagoya',   name: '名古屋グランパス', short: '名古屋', color: '#D2001C', stadium: '豊田スタジアム',             coords: { lat: 35.0637, lng: 137.1567 }, travelOrigin: { label: '名古屋駅', coords: { lat: 35.1709, lng: 136.8815 } }, ticketSystem: { name: 'クラブ公式チケット', url: 'https://ticket.grampus.example.jp' } },
  { id: 'fctokyo',  name: 'FC東京',          short: 'FC東京', color: '#1B4A9C', stadium: '味の素スタジアム',           coords: { lat: 35.6653, lng: 139.5384 }, ticketSystem: { name: 'Jリーグチケット',   url: 'https://www.jleague-ticket.example.jp/fctokyo' } },
  { id: 'verdy',    name: '東京ヴェルディ',   short: 'ヴェルディ', color: '#2E9E4C', stadium: '味の素スタジアム',       coords: { lat: 35.6653, lng: 139.5384 }, ticketSystem: { name: 'チケットぴあ',     url: 'https://t.pia.example.jp/verdy' } },
];

const TODAY = new Date(2026, 6, 11); // 2026-07-11 (土)

// 実データ(名古屋グランパスの発売スケジュール)に登場するが、
// チーム選択チップには出さない対戦相手クラブの最小情報。
const EXTRA_CLUBS = {
  shimizu: { name: '清水エスパルス', short: '清水', coords: { lat: 34.9752, lng: 138.3436 } },
  okayama: { name: 'ファジアーノ岡山', short: '岡山', coords: { lat: 34.6553, lng: 133.9195 } },
  machida: { name: 'FC町田ゼルビア', short: '町田', coords: { lat: 35.5433, lng: 139.4467 } },
  kashima: {
    name: '鹿島アントラーズ',
    short: '鹿島',
    coords: { lat: 35.9862, lng: 140.6412 },
    ticketSystem: { name: '鹿島アントラーズ公式(鹿チケ)', url: 'https://www.antlers.co.jp/news/ticket_info/' },
  },
  nagasaki: {
    name: 'V・ファーレン長崎',
    short: '長崎',
    coords: { lat: 32.7460, lng: 129.8730 },
    // 長崎はWebサイトではなく専用アプリ経由でしか販売しないため、Webからの購入導線自体が無い
    ticketSystem: { name: '長崎スタジアムシティアプリ(要アプリDL)', url: 'https://www.v-varen.com/tickets_new' },
  },
};

// team_id / 短縮名のどちらからでもクラブ情報を解決する
function resolveClub(ref) {
  const byId = TEAMS.find((t) => t.id === ref);
  if (byId) return byId;
  if (EXTRA_CLUBS[ref]) return EXTRA_CLUBS[ref];
  const byShort = TEAMS.find((t) => t.short === ref);
  if (byShort) return byShort;
  const extraByShort = Object.values(EXTRA_CLUBS).find((c) => c.short === ref);
  if (extraByShort) return extraByShort;
  return { name: ref, short: ref, coords: null };
}

// ---- 実データ ----------------------------------------------------------
// 取得元:
//  ・ホーム戦: https://nagoya-grampus.jp/ticket/schedule/ (構造化テーブル、scheduled)
//  ・アウェイ戦: 対戦相手クラブのチケットページ/ニュースを個別調査
//      鹿島 → https://www.antlers.co.jp/news/ticket_info/ (告知未公開 = unknown)
//      広島 → https://www.sanfrecce.co.jp/tickets/schedule (受付中だが、正確な開始時刻は
//              画像として掲載されており文字情報からは取得不可。「受付中」であることのみ確認できた)
//      長崎 → https://www.v-varen.com/tickets_new (告知未公開。かつ販売は自社アプリ経由のみでWeb購入導線が無い)
//      FC東京 → https://www.fctokyo.co.jp/faq/ (公式によれば発売は「試合日の4〜6週間前」が通例。
//              7/11時点ではまだ先のため未公開)
// 取得日時: 2026-07-11
//
// status の意味:
//   'scheduled' … 将来の発売日時が判明している(発売前)
//   'onsale'    … 現在購入可能(sale_datetimeがnullの場合は「正確な開始時刻は不明だが受付中」)
//   'unknown'   … 告知自体がまだ無い
const REAL_NAGOYA_EVENTS = [
  { fixture_id: 'nagoya-20260808-清水', team_perspective: 'home', opponent: '清水', venue: '豊田ス', match_datetime: '2026-08-08T19:00:00+09:00', sale_datetime: '2026-07-18T10:00:00+09:00', source_url: 'https://nagoya-grampus.jp/ticket/schedule/', status: 'scheduled' },
  { fixture_id: 'nagoya-20260815-kashima', team_perspective: 'away', host_team_id: 'kashima', venue: 'メルカリスタジアム', match_datetime: '2026-08-15T18:00:00+09:00', sale_datetime: null, source_url: 'https://www.antlers.co.jp/news/ticket_info/', status: 'unknown' },
  { fixture_id: 'nagoya-20260822-G大阪', team_perspective: 'home', opponent: 'G大阪', venue: '豊田ス', match_datetime: '2026-08-22T19:00:00+09:00', sale_datetime: '2026-07-25T10:00:00+09:00', source_url: 'https://nagoya-grampus.jp/ticket/schedule/', status: 'scheduled' },
  { fixture_id: 'nagoya-20260829-岡山', team_perspective: 'home', opponent: '岡山', venue: '豊田ス', match_datetime: '2026-08-29T19:00:00+09:00', sale_datetime: '2026-07-25T10:00:00+09:00', source_url: 'https://nagoya-grampus.jp/ticket/schedule/', status: 'scheduled' },
  { fixture_id: 'nagoya-20260902-hiroshima', team_perspective: 'away', host_team_id: 'hiroshima', venue: 'エディオンピースウイング広島', match_datetime: '2026-09-02T19:00:00+09:00', sale_datetime: null, source_url: 'https://www.sanfrecce.co.jp/tickets/schedule', status: 'onsale', note: '発売状況は画像で公開されており、正確な開始時刻はテキストからは取得できませんでした。「受付中」であることは確認済みです。' },
  { fixture_id: 'nagoya-20260906-町田', team_perspective: 'home', opponent: '町田', venue: '豊田ス', match_datetime: '2026-09-06T18:00:00+09:00', sale_datetime: '2026-08-01T10:00:00+09:00', source_url: 'https://nagoya-grampus.jp/ticket/schedule/', status: 'scheduled' },
  { fixture_id: 'nagoya-20260912-nagasaki', team_perspective: 'away', host_team_id: 'nagasaki', venue: 'ピーススタジアム', match_datetime: '2026-09-12T19:00:00+09:00', sale_datetime: null, source_url: 'https://www.v-varen.com/tickets_new', status: 'unknown', note: '長崎は自社アプリ経由でのみ販売するため、発売後もWebからは購入できない見込みです。' },
  { fixture_id: 'nagoya-20260919-fctokyo', team_perspective: 'away', host_team_id: 'fctokyo', venue: '国立競技場(特別開催)', match_datetime: '2026-09-19T00:00:00+09:00', sale_datetime: null, source_url: 'https://www.fctokyo.co.jp/faq/', status: 'unknown', note: 'FC東京は通例「試合日の4〜6週間前」に発売するため、7/11時点ではまだ告知前です。' },
];

function buildRealNagoyaFixtures(team) {
  const sorted = [...REAL_NAGOYA_EVENTS].sort(
    (a, b) => new Date(a.match_datetime) - new Date(b.match_datetime)
  );

  return sorted.map((event) => {
    const isHome = event.team_perspective === 'home';
    const opponent = isHome ? resolveClub(event.opponent) : resolveClub(event.host_team_id);
    const host = isHome ? team : opponent;
    const matchDate = new Date(event.match_datetime);
    const saleDate = event.sale_datetime ? new Date(event.sale_datetime) : null;
    const kickoffUnknown = event.match_datetime.endsWith('T00:00:00+09:00');
    const kickoff = kickoffUnknown
      ? '未定'
      : `${String(matchDate.getHours()).padStart(2, '0')}:${String(matchDate.getMinutes()).padStart(2, '0')}`;

    return {
      id: event.fixture_id,
      opponent,
      isHome,
      host,
      matchDate,
      kickoff,
      stadium: isHome ? team.stadium : event.venue,
      saleDate,
      status: event.status, // 'scheduled' | 'onsale' | 'unknown'
      sourceUrl: event.source_url,
      note: event.note || null,
      isRealData: true,
    };
  });
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function hashOffset(id, min, span) {
  let h = 0;
  for (const c of id) h += c.charCodeAt(0);
  return min + (h % span);
}

function formatDate(d) {
  const w = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
  return `${d.getMonth() + 1}/${d.getDate()}(${w})`;
}

// ---- 移動時間・費用の概算ロジック(電車のみ) -----------------------------
// 本番では ekispert API / NAVITIME乗換案内API / Yahoo!路線情報API などの
// 実運賃データに置き換える前提。ここでは直線距離から近似する簡易モデル。
// (車移動は需要が出てきたら別途対応するため、現時点では対象外)

const SHINKANSEN_BASE_FARE = 3000; // 円(基本料金の目安)
const SHINKANSEN_YEN_PER_KM = 18; // 円/km(近似)
const LOCAL_LINE_ROUNDTRIP_FLAT = 1500; // 円(往復・両都市の在来線/市内交通の目安)
const AVG_SHINKANSEN_SPEED_KMH = 200; // 停車込みの実効速度目安
const TRANSFER_BUFFER_HOURS = 0.7; // 乗換・待ち時間バッファ

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function haversineKm(a, b) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function roundTo(n, unit) {
  return Math.round(n / unit) * unit;
}

function formatHours(h) {
  const totalMin = Math.round(h * 60);
  const hh = Math.floor(totalMin / 60);
  const mm = totalMin % 60;
  return hh > 0 ? `${hh}時間${mm}分` : `${mm}分`;
}

function formatYen(n) {
  return `¥${n.toLocaleString()}`;
}

function estimateTravel(originCoords, destCoords) {
  const straightKm = haversineKm(originCoords, destCoords);

  const shinkansenOneWay = roundTo(SHINKANSEN_BASE_FARE + straightKm * SHINKANSEN_YEN_PER_KM, 10);
  const shinkansenRoundTrip = shinkansenOneWay * 2;
  const trainHoursOneWay = straightKm / AVG_SHINKANSEN_SPEED_KMH + TRANSFER_BUFFER_HOURS;

  return {
    distanceKm: Math.round(straightKm),
    train: {
      oneWayHours: trainHoursOneWay,
      shinkansen: shinkansenRoundTrip,
      local: LOCAL_LINE_ROUNDTRIP_FLAT,
      total: shinkansenRoundTrip + LOCAL_LINE_ROUNDTRIP_FLAT,
    },
  };
}

function pad(n) {
  return n.toString().padStart(2, '0');
}

function toICSDateTime(d, hour, minute) {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(hour)}${pad(minute)}00`;
}

function escapeICS(text) {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

// iOSのReminders(リマインダー)アプリにはWebアプリから直接書き込むAPIが無いため、
// 代わりに .ics(カレンダーイベント)ファイルを生成してダウンロードさせる方式で代替する。
// ユーザーが開くとiPhoneの「カレンダー」に発売日イベント+通知が登録される。
function buildICS(fixture, team) {
  const dtStart = toICSDateTime(fixture.saleDate, 10, 0);
  const dtEnd = toICSDateTime(fixture.saleDate, 11, 0);
  const now = new Date();
  const dtStamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}T${pad(now.getHours())}${pad(
    now.getMinutes()
  )}${pad(now.getSeconds())}`;
  const summary = escapeICS(`【${team.short}】vs ${fixture.opponent.name} チケット発売`);
  const description = escapeICS(
    `${fixture.host.ticketSystem.name}で発売開始\n購入サイト: ${fixture.host.ticketSystem.url}\n試合日: ${formatDate(
      fixture.matchDate
    )} ${fixture.kickoff}\n会場: ${fixture.stadium}`
  );
  const uid = `${fixture.id}@jleague-ticket-tracker`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//JLeagueTicketTracker//JP',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    'DESCRIPTION:チケット発売30分前です',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function downloadICS(fixture, team) {
  const ics = buildICS(fixture, team);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ticket-${fixture.id}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function buildFixtures(team) {
  const others = TEAMS.filter((t) => t.id !== team.id);
  const fixtures = [];
  for (let i = 0; i < 8; i++) {
    const opponent = others[i % others.length];
    const isHome = i % 2 === 0;
    const matchDate = addDays(TODAY, 7 * (i + 1));
    const host = isHome ? team : opponent;
    const saleOffset = hashOffset(host.id, 14, 15); // 14〜28日前
    const saleDate = addDays(matchDate, -saleOffset);
    const kickoff = i % 3 === 0 ? '19:00' : '15:00';
    fixtures.push({
      id: `${team.id}-${i}`,
      opponent,
      isHome,
      host,
      matchDate,
      kickoff,
      stadium: host.stadium,
      saleDate,
      status: TODAY >= saleDate ? 'onsale' : 'upcoming',
      isRealData: false,
    });
  }
  return fixtures;
}

// ---- UI ---------------------------------------------------------------

// ---- 広告枠(モック) ----------------------------------------------------
// 実際にはAdMob(ネイティブアプリ)やGoogle Ad Manager/AdSense(Web版)のSDKタグに置き換える。
// 「広告」ラベルは景品表示法・各広告ネットワーク規約上、必須表示。
function BannerAd() {
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 12,
        border: '1px dashed #3A5A44',
        background: '#132218',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 72,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 8,
          left: 10,
          fontFamily: "'Oswald', sans-serif",
          fontSize: 9,
          letterSpacing: 1,
          color: '#5C7A64',
          border: '1px solid #3A5A44',
          borderRadius: 4,
          padding: '1px 6px',
        }}
      >
        広告
      </span>
      <span style={{ fontSize: 12, color: '#5C7A64' }}>広告枠(AdMob / Ad Manager 差し込み予定)</span>
    </div>
  );
}

// ---- 遠征送客枠(モック) ------------------------------------------------
// アウェイ戦のみ表示。ASP(楽天アフィリエイト/もしもアフィリエイト/バリューコマース等)経由の
// ホテル・新幹線検索リンクを想定。景品表示法(ステマ規制)対応で「PR」表示を必須にする。
function TravelPromo({ fixture, team }) {
  const origin = team.travelOrigin || { label: team.stadium, coords: team.coords };
  const stadiumQuery = encodeURIComponent(fixture.stadium);
  const dateLabel = formatDate(fixture.matchDate);
  const estimate = estimateTravel(origin.coords, fixture.host.coords);

  const links = [
    { label: 'ホテルを探す', url: `https://travel.example.jp/search?area=${stadiumQuery}` },
    { label: '新幹線を予約', url: `https://ekinet.example.jp/search?date=${dateLabel}` },
  ];

  return (
    <div
      style={{
        marginTop: 10,
        borderRadius: 10,
        border: '1px solid #2D5A3D',
        background: '#12241A',
        padding: 12,
      }}
    >
      <div style={{ fontSize: 11, color: '#8FA893', marginBottom: 8 }}>
        {origin.label} から約 {estimate.distanceKm}km(概算)
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{ borderRadius: 8, background: '#0F1F16', padding: 10 }}>
          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#C7D6CB', marginBottom: 6 }}>
            🚄 電車(往復)
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#8FA893', lineHeight: 1.7 }}>
            片道 約{formatHours(estimate.train.oneWayHours)}
            <br />
            新幹線 {formatYen(estimate.train.shinkansen)}
            <br />
            在来線等 {formatYen(estimate.train.local)}
            <br />
            <span style={{ color: '#F4D35E', fontWeight: 700 }}>合計 {formatYen(estimate.train.total)}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 9,
            letterSpacing: 1,
            color: '#0F1F16',
            background: '#F4D35E',
            borderRadius: 4,
            padding: '1px 6px',
          }}
        >
          PR
        </span>
        <span style={{ fontSize: 11, color: '#8FA893' }}>{fixture.stadium}への遠征を計画する</span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {links.map((l) => (
          <a
            key={l.label}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '8px',
              borderRadius: 8,
              border: '1px solid #3A5A44',
              fontSize: 12,
              fontWeight: 600,
              textDecoration: 'none',
              color: '#C7D6CB',
            }}
          >
            {l.label}
          </a>
        ))}
      </div>
      <div style={{ fontSize: 10, color: '#5C7A64', marginTop: 8, lineHeight: 1.5 }}>
        ※ 移動時間・費用は直線距離に基づく概算です。実際の経路・料金とは異なります。
      </div>
    </div>
  );
}

function FixtureStub({ fixture, team }) {
  const { opponent, isHome, host, matchDate, kickoff, stadium, saleDate, status } = fixture;
  const onSale = status === 'onsale';
  const [added, setAdded] = useState(false);

  const handleAddToCalendar = () => {
    downloadICS(fixture, team);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        borderRadius: 14,
        overflow: 'hidden',
        background: '#16281D',
        border: '1px solid #274430',
      }}
    >
      <div style={{ flex: 1, padding: 16, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: 1,
              padding: '3px 8px',
              borderRadius: 4,
              background: isHome ? team.color : '#3A4A40',
              color: isHome ? '#0F1F16' : '#C7D6CB',
            }}
          >
            {isHome ? 'HOME' : 'AWAY'}
          </span>
          <span style={{ fontSize: 12, color: '#8FA893' }}>vs {opponent.name}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <Calendar size={14} color="#F4D35E" style={{ flexShrink: 0 }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 700 }}>
            {formatDate(matchDate)}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#C7D6CB' }}>
            {kickoff} キックオフ
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontSize: 12, color: '#8FA893' }}>
          <MapPin size={13} style={{ flexShrink: 0 }} />
          <span>{stadium}</span>
        </div>

        <div style={{ borderTop: '1px dashed #2D5A3D', paddingTop: 12 }}>
          {status === 'unknown' ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#5C7A64', marginBottom: 2 }}>チケット発売日</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: '#8FA893' }}>
                    発売日未定
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1,
                    padding: '4px 10px',
                    borderRadius: 999,
                    transform: 'rotate(-4deg)',
                    border: '2px solid #5C7A64',
                    color: '#5C7A64',
                    whiteSpace: 'nowrap',
                  }}
                >
                  告知準備中
                </span>
              </div>
              <a
                href={fixture.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  width: '100%',
                  padding: '10px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: 0.5,
                  background: '#233830',
                  color: '#8FA893',
                }}
              >
                {host.name}の発表を確認 <ExternalLink size={14} />
              </a>
              <div style={{ fontSize: 10, color: '#5C7A64', marginTop: 8, lineHeight: 1.5 }}>
                ※ {fixture.note || `${host.name}側の発売告知がまだ出ていません。監視を継続し、告知が出次第自動的に反映します。`}
              </div>
            </>
          ) : status === 'onsale' && !saleDate ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#5C7A64', marginBottom: 2 }}>
                    チケット発売日({host.ticketSystem.name})
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: '#8FA893' }}>
                    開始時刻は非公開(受付中)
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1,
                    padding: '4px 10px',
                    borderRadius: 999,
                    transform: 'rotate(-4deg)',
                    border: '2px solid #F4D35E',
                    color: '#F4D35E',
                    whiteSpace: 'nowrap',
                  }}
                >
                  受付中
                </span>
              </div>
              <a
                href={host.ticketSystem.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  width: '100%',
                  padding: '10px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: 0.5,
                  background: '#F4D35E',
                  color: '#0F1F16',
                }}
              >
                {host.ticketSystem.name}で購入 <ExternalLink size={14} />
              </a>
              {fixture.note && (
                <div style={{ fontSize: 10, color: '#5C7A64', marginTop: 8, lineHeight: 1.5 }}>※ {fixture.note}</div>
              )}
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#5C7A64', marginBottom: 2 }}>
                    チケット発売日({host.ticketSystem.name})
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700 }}>
                    {formatDate(saleDate)} 10:00〜
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1,
                    padding: '4px 10px',
                    borderRadius: 999,
                    transform: 'rotate(-4deg)',
                    border: onSale ? '2px solid #F4D35E' : '2px solid #5C7A64',
                    color: onSale ? '#F4D35E' : '#5C7A64',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {onSale ? '受付中' : '発売前'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href={host.ticketSystem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '10px',
                    borderRadius: 8,
                    textDecoration: 'none',
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: 0.5,
                    background: onSale ? '#F4D35E' : '#233830',
                    color: onSale ? '#0F1F16' : '#8FA893',
                  }}
                >
                  {host.ticketSystem.name}で購入 <ExternalLink size={14} />
                </a>
                <button
                  onClick={handleAddToCalendar}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                padding: '10px',
                borderRadius: 8,
                border: '1px solid #3A5A44',
                cursor: 'pointer',
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: 0.5,
                background: added ? '#1F3A28' : 'transparent',
                color: added ? '#7ED99B' : '#C7D6CB',
              }}
            >
              {added ? (
                <>
                  追加済み <Check size={14} />
                </>
              ) : (
                <>
                  リマインダー <CalendarPlus size={14} />
                </>
              )}
            </button>
              </div>
            </>
          )}
        </div>

        {!isHome && <TravelPromo fixture={fixture} team={team} />}
      </div>

      <div
        style={{
          position: 'relative',
          width: 34,
          background: '#1C3226',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: 0, height: '100%', borderLeft: '2px dashed #2D5A3D' }} />
        <div style={{ position: 'absolute', top: -8, left: -8, width: 16, height: 16, borderRadius: '50%', background: '#0F1F16' }} />
        <div style={{ position: 'absolute', bottom: -8, left: -8, width: 16, height: 16, borderRadius: '50%', background: '#0F1F16' }} />
        <span
          style={{
            writingMode: 'vertical-rl',
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: 2,
            color: '#5C7A64',
          }}
        >
          J1 LEAGUE
        </span>
      </div>
    </div>
  );
}

export default function JLeagueTicketApp() {
  const [selectedId, setSelectedId] = useState(TEAMS[0].id);
  const selectedTeam = TEAMS.find((t) => t.id === selectedId);
  const fixtures = useMemo(
    () => (selectedTeam.id === 'nagoya' ? buildRealNagoyaFixtures(selectedTeam) : buildFixtures(selectedTeam)),
    [selectedId]
  );

  return (
    <div style={{ fontFamily: "'Noto Sans JP', sans-serif", background: '#0F1F16', minHeight: '100vh', color: '#F7F5EF' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Noto+Sans+JP:wght@400;500;700&family=JetBrains+Mono:wght@500;700&display=swap');
        * { box-sizing: border-box; }
        a:focus-visible, button:focus-visible { outline: 2px solid #F4D35E; outline-offset: 2px; }
      `}</style>

      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {/* ヘッダー */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: '#0F1F16',
            borderBottom: '1px solid #2D5A3D',
            padding: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Ticket size={18} color="#F4D35E" />
            <span
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: 2,
                color: '#8FA893',
                textTransform: 'uppercase',
              }}
            >
              Matchday Ticket Tracker
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 36, borderRadius: 2, background: selectedTeam.color, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 22, lineHeight: 1.1 }}>
                {selectedTeam.name}
              </div>
              <div style={{ fontSize: 11, color: '#8FA893', marginTop: 2 }}>{selectedTeam.stadium} が本拠地</div>
            </div>
            {selectedTeam.id === 'nagoya' && (
              <span
                style={{
                  flexShrink: 0,
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: '#0F1F16',
                  background: '#F4D35E',
                  borderRadius: 4,
                  padding: '3px 6px',
                  alignSelf: 'flex-start',
                }}
              >
                実データ 7/11時点
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginTop: 14, paddingBottom: 4 }}>
            {TEAMS.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                style={{
                  flexShrink: 0,
                  padding: '6px 12px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'Oswald', sans-serif",
                  letterSpacing: 0.5,
                  cursor: 'pointer',
                  border: t.id === selectedId ? `2px solid ${t.color}` : '1px solid #2D5A3D',
                  background: t.id === selectedId ? 'rgba(244,211,94,0.08)' : 'transparent',
                  color: t.id === selectedId ? '#F7F5EF' : '#8FA893',
                  whiteSpace: 'nowrap',
                }}
              >
                {t.short}
              </button>
            ))}
          </div>
        </div>

        {/* 試合一覧 */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {fixtures.map((f, i) => (
            <React.Fragment key={f.id}>
              <FixtureStub fixture={f} team={selectedTeam} />
              {(i + 1) % 3 === 0 && i !== fixtures.length - 1 && <BannerAd />}
            </React.Fragment>
          ))}
        </div>

        <div style={{ padding: '8px 16px 32px', fontSize: 11, color: '#5C7A64', textAlign: 'center', lineHeight: 1.6 }}>
          ※ 表示データはすべてサンプルです。実際の発売日・購入サイトは各クラブの公式発表をご確認ください。
          <br />
          ※「リマインダー」ボタンはカレンダーイベント(.ics)をダウンロードします。iPhoneのReminders(リマインダー)アプリへの直接登録はWebアプリの技術的制約上できないため、ネイティブアプリ化時に対応予定です。
        </div>
      </div>
    </div>
  );
}
