import React, { useState, useMemo } from 'react';
import { Calendar, MapPin, Ticket, ExternalLink, CalendarPlus, Check, Star, MessageCircle } from 'lucide-react';

// ---- モックデータ ----------------------------------------------------

const TEAMS = [
  { id: 'kashima',  name: '鹿島アントラーズ',   short: '鹿島',   color: '#A6093D', stadium: 'メルカリスタジアム',           coords: { lat: 35.9862, lng: 140.6412 }, travelOrigin: { label: '鹿島神宮駅', coords: { lat: 35.9646, lng: 140.6296 } }, ticketSystem: { name: 'Jリーグチケット', url: 'https://www.jleague-ticket.jp/club/ka/' } },
  { id: 'mito',     name: '水戸ホーリーホック', short: '水戸',   color: '#1E3A8A', stadium: 'ケーズデンキスタジアム水戸',   coords: { lat: 36.3745, lng: 140.4479 }, travelOrigin: { label: '水戸駅', coords: { lat: 36.3691, lng: 140.4767 } }, ticketSystem: { name: 'Jリーグチケット(クラブ一覧)', url: 'http://club.jleague-ticket.jp/schedule/index.html' } },
  { id: 'urawa',    name: '浦和レッズ',       short: '浦和',   color: '#C8102E', stadium: '埼玉スタジアム2002',       coords: { lat: 35.9040, lng: 139.7194 }, travelOrigin: { label: '大宮駅', coords: { lat: 35.9066, lng: 139.6236 } }, ticketSystem: { name: 'Jリーグチケット', url: 'https://www.jleague-ticket.jp/club/ur/' } },
  { id: 'chiba',    name: 'ジェフユナイテッド千葉', short: '千葉', color: '#002664', stadium: 'フクダ電子アリーナ',         coords: { lat: 35.6086, lng: 140.1235 }, travelOrigin: { label: '千葉駅', coords: { lat: 35.6073, lng: 140.1233 } }, ticketSystem: { name: 'Jリーグチケット', url: 'https://www.jleague-ticket.jp/club/je/' } },
  { id: 'kashiwa',  name: '柏レイソル',       short: '柏',     color: '#F5A623', stadium: '三協フロンテア柏スタジアム', coords: { lat: 35.9007, lng: 139.9264 }, travelOrigin: { label: '柏駅', coords: { lat: 35.8676, lng: 139.9700 } }, ticketSystem: { name: 'Jリーグチケット', url: 'https://www.jleague-ticket.jp/club/kr/' } },
  { id: 'fctokyo',  name: 'FC東京',          short: 'FC東京', color: '#1B4A9C', stadium: '味の素スタジアム',           coords: { lat: 35.6653, lng: 139.5384 }, travelOrigin: { label: '新宿駅', coords: { lat: 35.6896, lng: 139.7006 } }, ticketSystem: { name: 'チケットFC東京(Jリーグチケット)', url: 'https://www.jleague-ticket.jp/club/to/' } },
  { id: 'verdy',    name: '東京ヴェルディ',   short: '東京V', color: '#2E9E4C', stadium: '味の素スタジアム',       coords: { lat: 35.6653, lng: 139.5384 }, travelOrigin: { label: '新宿駅', coords: { lat: 35.6896, lng: 139.7006 } }, ticketSystem: { name: 'ヴェルディチケット(Jリーグチケット)', url: 'https://www.jleague-ticket.jp/club/vn/' } },
  { id: 'machida',  name: 'FC町田ゼルビア',   short: '町田',   color: '#14213D', stadium: '町田GIONスタジアム',         coords: { lat: 35.5433, lng: 139.4467 }, travelOrigin: { label: '町田駅', coords: { lat: 35.5423, lng: 139.4467 } }, ticketSystem: { name: 'Jリーグチケット(クラブ一覧)', url: 'http://club.jleague-ticket.jp/schedule/index.html' } },
  { id: 'kawasaki', name: '川崎フロンターレ', short: '川崎F',  color: '#1D2088', stadium: '等々力陸上競技場',           coords: { lat: 35.5701, lng: 139.6573 }, travelOrigin: { label: '武蔵小杉駅', coords: { lat: 35.5769, lng: 139.6577 } }, ticketSystem: { name: 'Jリーグチケット', url: 'https://www.jleague-ticket.jp/club/kf/' } },
  { id: 'ynmarinos',name: '横浜F・マリノス', short: '横浜FM', color: '#0A2F6B', stadium: '日産スタジアム',             coords: { lat: 35.5089, lng: 139.6047 }, travelOrigin: { label: '新横浜駅', coords: { lat: 35.5079, lng: 139.6172 } }, ticketSystem: { name: 'チケットF・マリノス(Jリーグチケット)', url: 'https://www.jleague-ticket.jp/club/ym/' } },
  { id: 'shimizu',  name: '清水エスパルス',   short: '清水',   color: '#F58220', stadium: 'IAIスタジアム日本平',        coords: { lat: 34.9752, lng: 138.3436 }, travelOrigin: { label: '静岡駅', coords: { lat: 34.9756, lng: 138.3877 } }, ticketSystem: { name: 'クラブ公式(パルチケ)', url: 'https://www.s-pulse.co.jp/tickets/schedule' } },
  { id: 'nagoya',   name: '名古屋グランパス', short: '名古屋', color: '#D2001C', stadium: '豊田スタジアム',             coords: { lat: 35.0637, lng: 137.1567 }, travelOrigin: { label: '名古屋駅', coords: { lat: 35.1709, lng: 136.8815 } }, ticketSystem: { name: 'Jリーグチケット', url: 'https://www.jleague-ticket.jp/club/ng/' } },
  { id: 'kyoto',    name: '京都サンガF.C.',  short: '京都',   color: '#8B1A2B', stadium: 'サンガスタジアム by KYOCERA', coords: { lat: 35.0122, lng: 135.5757 }, travelOrigin: { label: '京都駅', coords: { lat: 34.9858, lng: 135.7581 } }, ticketSystem: { name: 'クラブ公式チケット', url: 'https://www.sanga-fc.jp/ticket' } },
  { id: 'gamba',    name: 'ガンバ大阪',       short: 'G大阪',  color: '#0057A8', stadium: 'パナソニックスタジアム吹田', coords: { lat: 34.7815, lng: 135.5225 }, travelOrigin: { label: '新大阪駅', coords: { lat: 34.7338, lng: 135.5000 } }, ticketSystem: { name: 'Jリーグチケット', url: 'https://www.jleague-ticket.jp/club/go/' } },
  { id: 'cerezo',   name: 'セレッソ大阪',     short: 'C大阪',  color: '#E4007F', stadium: 'YANMAR HANASAKA STADIUM',   coords: { lat: 34.6108, lng: 135.5228 }, travelOrigin: { label: '新大阪駅', coords: { lat: 34.7338, lng: 135.5000 } }, ticketSystem: { name: 'Jリーグチケット(クラブ一覧)', url: 'http://club.jleague-ticket.jp/schedule/index.html' } },
  { id: 'kobe',     name: 'ヴィッセル神戸',   short: '神戸',   color: '#7B0028', stadium: 'ノエビアスタジアム神戸',     coords: { lat: 34.6621, lng: 135.1758 }, travelOrigin: { label: '新神戸駅', coords: { lat: 34.7024, lng: 135.1957 } }, ticketSystem: { name: '楽天チケット(クラブ公式)', url: 'https://vissel.tstar.jp/' } },
  { id: 'okayama',  name: 'ファジアーノ岡山', short: '岡山',   color: '#002B5C', stadium: 'Cityライトスタジアム',       coords: { lat: 34.6553, lng: 133.9195 }, travelOrigin: { label: '岡山駅', coords: { lat: 34.6664, lng: 133.9186 } }, ticketSystem: { name: 'Jリーグチケット(クラブ一覧)', url: 'http://club.jleague-ticket.jp/schedule/index.html' } },
  { id: 'hiroshima',name: 'サンフレッチェ広島', short: '広島', color: '#5B2A86', stadium: 'エディオンピースウイング広島', coords: { lat: 34.3963, lng: 132.4596 }, travelOrigin: { label: '広島駅', coords: { lat: 34.3979, lng: 132.4754 } }, ticketSystem: { name: 'サンフレチケット', url: 'https://ticket.sanfrecce.co.jp/' } },
  { id: 'fukuoka',  name: 'アビスパ福岡',     short: '福岡',   color: '#E8B800', stadium: 'ベスト電器スタジアム',       coords: { lat: 33.5544, lng: 130.4227 }, travelOrigin: { label: '博多駅', coords: { lat: 33.5904, lng: 130.4207 } }, ticketSystem: { name: 'Jリーグチケット(クラブ一覧)', url: 'http://club.jleague-ticket.jp/schedule/index.html' } },
  { id: 'nagasaki', name: 'V・ファーレン長崎', short: '長崎',   color: '#0072BC', stadium: 'PEACE STADIUM Connected by SoftBank', coords: { lat: 32.7460, lng: 129.8730 }, travelOrigin: { label: '長崎駅', coords: { lat: 32.7503, lng: 129.8654 } }, ticketSystem: { name: '長崎スタジアムシティアプリ(要アプリDL)', url: 'https://www.v-varen.com/tickets_new' } },
];

const TODAY = new Date(2026, 6, 11); // 2026-07-11 (土)

// ---- 初期表示チームの設定(端末に保存) -----------------------------------
// localStorageが使えない環境(プレビュー等)でも落ちないようtry/catchで安全に扱う。
const DEFAULT_TEAM_STORAGE_KEY = 'pivolab-jleague-default-team';

function getStoredDefaultTeamId() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage.getItem(DEFAULT_TEAM_STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

function setStoredDefaultTeamId(id) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(DEFAULT_TEAM_STORAGE_KEY, id);
  } catch (e) {
    // 保存できなくても致命的ではないので無視する
  }
}

// team_id / 短縮名からクラブ情報を解決する
function resolveClub(ref) {
  const byId = TEAMS.find((t) => t.id === ref);
  if (byId) return byId;
  const byShort = TEAMS.find((t) => t.short === ref);
  if (byShort) return byShort;
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
  { fixture_id: 'nagoya-20260815-kashima', team_perspective: 'away', host_team_id: 'kashima', venue: 'メルカリスタジアム', match_datetime: '2026-08-15T18:00:00+09:00', sale_datetime: '2026-07-24T10:00:00+09:00', source_url: 'https://www.antlers.co.jp/news/ticket_info/', status: 'scheduled', note: '一般販売 7/24(金)10:00〜' },
  { fixture_id: 'nagoya-20260822-G大阪', team_perspective: 'home', opponent: 'G大阪', venue: '豊田ス', match_datetime: '2026-08-22T19:00:00+09:00', sale_datetime: '2026-07-25T10:00:00+09:00', source_url: 'https://nagoya-grampus.jp/ticket/schedule/', status: 'scheduled' },
  { fixture_id: 'nagoya-20260829-岡山', team_perspective: 'home', opponent: '岡山', venue: '豊田ス', match_datetime: '2026-08-29T19:00:00+09:00', sale_datetime: '2026-07-25T10:00:00+09:00', source_url: 'https://nagoya-grampus.jp/ticket/schedule/', status: 'scheduled' },
  { fixture_id: 'nagoya-20260902-hiroshima', team_perspective: 'away', host_team_id: 'hiroshima', venue: 'エディオンピースウイング広島', match_datetime: '2026-09-02T19:00:00+09:00', sale_datetime: '2026-07-10T12:00:00+09:00', source_url: 'https://www.sanfrecce.co.jp/tickets/schedule', status: 'onsale', note: '一般販売 7/10(金)12:00〜 発売開始済み' },
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
// 直線距離(Haversine)から運賃を近似する式。実際の乗車券+のぞみ指定席特急料金の
// 正規運賃2点で校正済み:
//   東京-新大阪(実キロ552.6km、実運賃¥14,720) / 東京-博多(実キロ1069.1km、実運賃¥22,220)
// ROUTE_FACTORは「直線距離→実際の鉄道キロ」への補正係数(新幹線本線沿いを想定)。
// この2点から回帰した係数:
//   運賃 ≒ 5,620円 + 15.5円 × 鉄道キロ(直線距離×ROUTE_FACTOR)
// 新幹線本線から外れる区間(鹿島・長崎など乗換が必要な区間)は誤差が大きくなるため、
// 個別に実運賃を調査した区間はREAL_TRAIN_FARESで上書きしている。
const ROUTE_FACTOR = 1.1; // 直線距離→鉄道キロの補正係数
const SHINKANSEN_BASE_FARE = 5620; // 円(実データ回帰による切片)
const SHINKANSEN_YEN_PER_KM = 15.5; // 円/km(実データ回帰による傾き)
const LOCAL_LINE_ROUNDTRIP_FLAT = 1500; // 円(往復・両都市の在来線/市内交通の目安)
const AVG_SHINKANSEN_SPEED_KMH = 200; // 停車込みの実効速度目安
const TRANSFER_BUFFER_HOURS = 0.7; // 乗換・待ち時間バッファ

// 近距離(概ね関東圏内など)は新幹線を使わない在来線メインの移動になるため、
// 別の近似式を使う。新幹線の式をそのまま近距離にあてはめると大幅な過大評価になる。
const LOCAL_HOP_THRESHOLD_KM = 150; // これ未満の直線距離は「近距離」として扱う
const LOCAL_BASE_FARE = 500; // 円
const LOCAL_YEN_PER_KM = 20; // 円/km
const LOCAL_AVG_SPEED_KMH = 55; // 在来線の実効速度目安(乗換込み)
const LOCAL_BUFFER_HOURS = 0.4; // 乗換バッファ

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

  // 近距離: 新幹線を使わない在来線メインの移動として計算
  if (straightKm < LOCAL_HOP_THRESHOLD_KM) {
    const localFareOneWay = roundTo(LOCAL_BASE_FARE + straightKm * LOCAL_YEN_PER_KM, 50);
    const localHoursOneWay = straightKm / LOCAL_AVG_SPEED_KMH + LOCAL_BUFFER_HOURS;
    return {
      distanceKm: Math.round(straightKm),
      train: {
        oneWayHours: localHoursOneWay,
        shinkansen: localFareOneWay * 2,
        local: 0,
        total: localFareOneWay * 2,
        isLocalHop: true,
      },
    };
  }

  const railKm = straightKm * ROUTE_FACTOR;

  const shinkansenOneWay = roundTo(SHINKANSEN_BASE_FARE + railKm * SHINKANSEN_YEN_PER_KM, 10);
  const shinkansenRoundTrip = shinkansenOneWay * 2;
  const trainHoursOneWay = railKm / AVG_SHINKANSEN_SPEED_KMH + TRANSFER_BUFFER_HOURS;

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

// ---- 実際の対戦カード(試合日程は実データ、発売日は判明分のみ反映) -----------
// 各クラブ公式サイトで発表された「2026/27明治安田J1リーグ 各節対戦カード」を
// 転記したもの。チケット発売日は、公式に判明しているものは実データ(saleDate)
// として反映し、まだ告知されていないものは正直に「未発表」の状態として扱う
// (モックの仮日付は生成しない)。
// 取得日時: 2026-07-11 / 出典: 横浜F・マリノス公式サイト
const REAL_SCHEDULES = {
  // ホームゲームの発売日は公式発表(販売スケジュール、直近試合のみ順次公開)より実データを反映
  // 出典: https://www.f-marinos.com/ticket/schedule 取得日時: 2026-07-12
  ynmarinos: [
    { matchday: 1, isHome: true, opponentId: 'kashima', venueOverride: 'MUFG国立', date: '2026-08-07', kickoff: '19:25', saleDate: '2026-07-06T10:00:00+09:00' },
    { matchday: 2, isHome: false, opponentId: 'shimizu', date: '2026-08-15' },
    { matchday: 3, isHome: true, opponentId: 'kobe', date: '2026-08-22', kickoff: '19:30', saleDate: '2026-07-15T12:00:00+09:00' },
    { matchday: 4, isHome: false, opponentId: 'urawa', date: '2026-08-29' },
    { matchday: 5, isHome: true, opponentId: 'kyoto', date: '2026-09-02', kickoff: '19:00', saleDate: '2026-07-29T12:00:00+09:00' },
    { matchday: 6, isHome: false, opponentId: 'kashiwa', date: '2026-09-05' },
    { matchday: 7, isHome: false, opponentId: 'machida', venueOverride: 'MUFG国立', date: '2026-09-12', kickoff: '19:00', saleDate: '2026-08-21T12:00:00+09:00' },
    { matchday: 8, isHome: true, opponentId: 'mito', date: '2026-09-19' },
    { matchday: 9, isHome: false, opponentId: 'cerezo', date: '2026-10-10' },
    { matchday: 10, isHome: false, opponentId: 'chiba', date: '2026-10-17' },
    { matchday: 11, isHome: true, opponentId: 'verdy', venueOverride: 'MUFG国立', date: '2026-10-21' },
    { matchday: 12, isHome: false, opponentId: 'nagoya', date: '2026-10-24' },
    { matchday: 13, isHome: true, opponentId: 'kawasaki', date: '2026-10-31' },
    { matchday: 14, isHome: true, opponentId: 'okayama', date: '2026-11-07' },
    { matchday: 15, isHome: false, opponentId: 'hiroshima', date: '2026-11-21' },
    { matchday: 16, isHome: false, opponentId: 'fukuoka', date: '2026-11-25' },
    { matchday: 17, isHome: true, opponentId: 'fctokyo', date: '2026-11-28' },
    { matchday: 18, isHome: false, opponentId: 'gamba', date: '2026-12-06', kickoff: '15:00', saleDate: '2026-10-31T10:00:00+09:00' },
    { matchday: 19, isHome: true, opponentId: 'nagasaki', date: '2026-12-12' },
    { matchday: 20, isHome: false, opponentId: 'kobe', date: '2026-12-19' },
    { matchday: 21, isHome: false, opponentId: 'kyoto', date: '2027-02-13' },
    { matchday: 22, isHome: true, opponentId: 'machida', date: '2027-02-20' },
    { matchday: 23, isHome: true, opponentId: 'cerezo', date: '2027-02-27' },
    { matchday: 24, isHome: false, opponentId: 'verdy', venueOverride: 'MUFG国立', date: '2027-03-06' },
    { matchday: 25, isHome: false, opponentId: 'okayama', date: '2027-03-10' },
    { matchday: 26, isHome: true, opponentId: 'fukuoka', date: '2027-03-13' },
    { matchday: 27, isHome: true, opponentId: 'urawa', date: '2027-03-20' },
    { matchday: 28, isHome: false, opponentId: 'kashima', date: '2027-04-03' },
    { matchday: 29, isHome: true, opponentId: 'hiroshima', date: '2027-04-10' },
    { matchday: 30, isHome: true, opponentId: 'kashiwa', date: '2027-04-17' },
    { matchday: 31, isHome: false, opponentId: 'fctokyo', date: '2027-04-24' },
    { matchday: 32, isHome: true, opponentId: 'nagoya', date: '2027-04-29' },
    { matchday: 33, isHome: false, opponentId: 'nagasaki', date: '2027-05-03' },
    { matchday: 34, isHome: true, opponentId: 'gamba', date: '2027-05-09' },
    { matchday: 35, isHome: false, opponentId: 'kawasaki', date: '2027-05-15' },
    { matchday: 36, isHome: true, opponentId: 'shimizu', date: '2027-05-22' },
    { matchday: 37, isHome: true, opponentId: 'chiba', date: '2027-05-29' },
    { matchday: 38, isHome: false, opponentId: 'mito', date: '2027-06-06' },
  ],
  // 鹿島アントラーズ(8〜10月分、対戦カード出典: soccer.phew.homeip.net)
  // ホームゲームの発売日は公式発表(2026/27シーズン チケット販売スケジュールについて)より実データを反映
  // 出典: https://www.antlers.co.jp/blogs/news/260703cm5rd0 取得日時: 2026-07-12
  kashima: [
    { matchday: 1, isHome: false, opponentId: 'ynmarinos', venueOverride: 'MUFGスタジアム', date: '2026-08-07', kickoff: '19:25' },
    { matchday: 2, isHome: true, opponentId: 'nagoya', date: '2026-08-15', kickoff: '18:00', saleDate: '2026-07-24T10:00:00+09:00' },
    { matchday: 3, isHome: true, opponentId: 'fukuoka', date: '2026-08-22', kickoff: '18:00', saleDate: '2026-07-31T10:00:00+09:00' },
    { matchday: 4, isHome: false, opponentId: 'verdy', date: '2026-08-29', kickoff: '19:00' },
    { matchday: 5, isHome: false, opponentId: 'mito', date: '2026-09-02', kickoff: '19:00' },
    { matchday: 6, isHome: true, opponentId: 'urawa', date: '2026-09-06', kickoff: '18:00', saleDate: '2026-08-07T10:00:00+09:00' },
    { matchday: 7, isHome: false, opponentId: 'kobe', date: '2026-09-12' },
    { matchday: 8, isHome: false, opponentId: 'kawasaki', date: '2026-09-19' },
    { matchday: 9, isHome: true, opponentId: 'gamba', date: '2026-10-10', saleDate: '2026-09-11T10:00:00+09:00' },
    { matchday: 10, isHome: true, opponentId: 'nagasaki', date: '2026-10-17', kickoff: '15:00', saleDate: '2026-09-11T10:00:00+09:00' },
    { matchday: 11, isHome: false, opponentId: 'kyoto', date: '2026-10-21', kickoff: '19:00' },
    { matchday: 12, isHome: true, opponentId: 'kashiwa', date: '2026-10-24', kickoff: '15:00', saleDate: '2026-09-25T10:00:00+09:00' },
    { matchday: 13, isHome: true, opponentId: 'cerezo', date: '2026-10-31', kickoff: '15:00', saleDate: '2026-09-25T10:00:00+09:00' },
  ],
  // 浦和レッズ(8〜10月分)
  // ホームゲームの発売日は公式発表(チケット販売スケジュール)より実データを反映
  // 出典: https://www.urawa-reds.co.jp/ticket/saleperiod.php 取得日時: 2026-07-12
  urawa: [
    { matchday: 1, isHome: false, opponentId: 'gamba', date: '2026-08-07', kickoff: '19:30' },
    { matchday: 2, isHome: true, opponentId: 'hiroshima', date: '2026-08-15', kickoff: '19:00', saleDate: '2026-07-18T10:00:00+09:00' },
    { matchday: 3, isHome: false, opponentId: 'machida', venueOverride: 'MUFGスタジアム', date: '2026-08-23', kickoff: '19:30', saleDate: '2026-07-24T12:00:00+09:00' },
    { matchday: 4, isHome: true, opponentId: 'ynmarinos', date: '2026-08-29', kickoff: '19:00', saleDate: '2026-07-18T10:00:00+09:00' },
    { matchday: 5, isHome: false, opponentId: 'fukuoka', date: '2026-09-02', kickoff: '19:00' },
    { matchday: 6, isHome: false, opponentId: 'kashima', date: '2026-09-06', kickoff: '18:00' },
    { matchday: 7, isHome: true, opponentId: 'okayama', date: '2026-09-13', kickoff: '18:30', saleDate: '2026-08-01T10:00:00+09:00' },
    { matchday: 8, isHome: true, opponentId: 'verdy', date: '2026-09-19', kickoff: '18:30', saleDate: '2026-08-01T10:00:00+09:00' },
    { matchday: 9, isHome: false, opponentId: 'fctokyo', date: '2026-10-10', kickoff: '15:00' },
    { matchday: 10, isHome: false, opponentId: 'mito', date: '2026-10-17', kickoff: '16:00' },
    { matchday: 11, isHome: true, opponentId: 'chiba', date: '2026-10-21', kickoff: '19:30', saleDate: '2026-09-12T10:00:00+09:00' },
    { matchday: 12, isHome: true, opponentId: 'nagasaki', date: '2026-10-25', kickoff: '15:00', saleDate: '2026-09-12T10:00:00+09:00' },
    { matchday: 13, isHome: false, opponentId: 'kashiwa', date: '2026-10-31' },
  ],
  // 柏レイソル(8〜10月分)
  kashiwa: [
    { matchday: 1, isHome: true, opponentId: 'mito', date: '2026-08-08', kickoff: '19:00' },
    { matchday: 2, isHome: false, opponentId: 'verdy', venueOverride: 'MUFGスタジアム', date: '2026-08-14', kickoff: '19:00', saleDate: '2026-07-15T12:00:00+09:00' },
    { matchday: 3, isHome: true, opponentId: 'nagasaki', date: '2026-08-21', kickoff: '19:00' },
    { matchday: 4, isHome: false, opponentId: 'shimizu', date: '2026-08-29', kickoff: '18:30' },
    { matchday: 5, isHome: false, opponentId: 'cerezo', date: '2026-09-02', kickoff: '19:00' },
    { matchday: 6, isHome: true, opponentId: 'ynmarinos', date: '2026-09-06', kickoff: '19:00' },
    { matchday: 7, isHome: false, opponentId: 'kyoto', date: '2026-09-12' },
    { matchday: 8, isHome: false, opponentId: 'machida', date: '2026-09-20', kickoff: '17:00', saleDate: '2026-08-27T12:00:00+09:00' },
    { matchday: 9, isHome: true, opponentId: 'kobe', date: '2026-10-09', kickoff: '19:00' },
    { matchday: 10, isHome: true, opponentId: 'nagoya', date: '2026-10-17' },
    { matchday: 11, isHome: false, opponentId: 'fctokyo', date: '2026-10-21', kickoff: '19:00' },
    { matchday: 12, isHome: false, opponentId: 'kashima', date: '2026-10-24', kickoff: '15:00' },
    { matchday: 13, isHome: true, opponentId: 'urawa', date: '2026-10-31' },
  ],
  // ガンバ大阪(8〜10月分)
  // ホームゲームの発売日は公式発表(2026/27シーズン明治安田J1リーグチケット発売日のお知らせ)より実データを反映
  // 出典: https://www.gamba-osaka.net/news/index/no/20479/ 取得日時: 2026-07-12
  gamba: [
    { matchday: 1, isHome: true, opponentId: 'urawa', date: '2026-08-07', kickoff: '19:30', saleDate: '2026-07-18T10:00:00+09:00' },
    { matchday: 2, isHome: false, opponentId: 'mito', date: '2026-08-15', kickoff: '18:00' },
    { matchday: 3, isHome: true, opponentId: 'nagoya', date: '2026-08-22', kickoff: '19:00' },
    { matchday: 4, isHome: true, opponentId: 'hiroshima', date: '2026-08-29', kickoff: '18:00', saleDate: '2026-07-25T10:00:00+09:00' },
    { matchday: 5, isHome: false, opponentId: 'nagasaki', date: '2026-09-02', kickoff: '19:00' },
    { matchday: 6, isHome: false, opponentId: 'chiba', date: '2026-09-06', kickoff: '18:00' },
    { matchday: 7, isHome: true, opponentId: 'fctokyo', date: '2026-09-12', kickoff: '19:00', saleDate: '2026-08-08T10:00:00+09:00' },
    { matchday: 8, isHome: true, opponentId: 'kobe', date: '2026-09-20', kickoff: '17:00', saleDate: '2026-08-15T10:00:00+09:00' },
    { matchday: 9, isHome: false, opponentId: 'kashima', date: '2026-10-10' },
    { matchday: 10, isHome: false, opponentId: 'shimizu', date: '2026-10-17' },
    { matchday: 11, isHome: false, opponentId: 'fukuoka', date: '2026-10-21', kickoff: '19:00' },
    { matchday: 12, isHome: true, opponentId: 'kyoto', date: '2026-10-24', kickoff: '16:00', saleDate: '2026-09-19T10:00:00+09:00' },
    { matchday: 13, isHome: false, opponentId: 'machida', date: '2026-10-31', kickoff: '14:00', saleDate: '2026-10-09T12:00:00+09:00' },
  ],
  // 東京ヴェルディ(8〜10月分)
  verdy: [
    { matchday: 1, isHome: true, opponentId: 'kawasaki', date: '2026-08-09', kickoff: '18:00' },
    { matchday: 2, isHome: true, opponentId: 'kashiwa', venueOverride: 'MUFGスタジアム', date: '2026-08-14', kickoff: '19:00', saleDate: '2026-07-15T12:00:00+09:00' },
    { matchday: 3, isHome: false, opponentId: 'okayama', date: '2026-08-22', kickoff: '18:30' },
    { matchday: 4, isHome: true, opponentId: 'kashima', date: '2026-08-29', kickoff: '19:00' },
    { matchday: 5, isHome: true, opponentId: 'kobe', date: '2026-09-02', kickoff: '19:00' },
    { matchday: 6, isHome: false, opponentId: 'cerezo', date: '2026-09-06', kickoff: '19:00' },
    { matchday: 7, isHome: true, opponentId: 'chiba', date: '2026-09-13', kickoff: '18:00' },
    { matchday: 8, isHome: false, opponentId: 'urawa', date: '2026-09-19', kickoff: '18:30' },
    { matchday: 9, isHome: true, opponentId: 'hiroshima', date: '2026-10-11', kickoff: '15:00' },
    { matchday: 10, isHome: true, opponentId: 'fctokyo', date: '2026-10-17', kickoff: '14:00' },
    { matchday: 11, isHome: false, opponentId: 'ynmarinos', venueOverride: 'MUFGスタジアム', date: '2026-10-21', kickoff: '19:00' },
    { matchday: 12, isHome: true, opponentId: 'fukuoka', date: '2026-10-24', kickoff: '15:00' },
  ],
  // FC東京(8〜10月分)
  fctokyo: [
    { matchday: 1, isHome: true, opponentId: 'machida', date: '2026-08-08', kickoff: '19:00' },
    { matchday: 2, isHome: false, opponentId: 'kobe', date: '2026-08-15', kickoff: '19:00' },
    { matchday: 3, isHome: true, opponentId: 'chiba', venueOverride: 'MUFGスタジアム', date: '2026-08-21', kickoff: '19:30' },
    { matchday: 4, isHome: false, opponentId: 'nagasaki', date: '2026-08-29', kickoff: '18:30' },
    { matchday: 5, isHome: false, opponentId: 'shimizu', date: '2026-09-02', kickoff: '19:00' },
    { matchday: 6, isHome: true, opponentId: 'kyoto', date: '2026-09-06', kickoff: '19:30' },
    { matchday: 7, isHome: false, opponentId: 'gamba', date: '2026-09-12', kickoff: '19:00' },
    { matchday: 8, isHome: true, opponentId: 'nagoya', venueOverride: 'MUFGスタジアム', date: '2026-09-19', kickoff: '19:00' },
    { matchday: 9, isHome: true, opponentId: 'urawa', date: '2026-10-10', kickoff: '15:00' },
    { matchday: 10, isHome: false, opponentId: 'verdy', date: '2026-10-17', kickoff: '14:00' },
    { matchday: 11, isHome: true, opponentId: 'kashiwa', date: '2026-10-21', kickoff: '19:00' },
    { matchday: 12, isHome: true, opponentId: 'mito', date: '2026-10-25', kickoff: '16:00' },
    { matchday: 13, isHome: false, opponentId: 'okayama', date: '2026-10-31', kickoff: '14:00' },
  ],
  // FC町田ゼルビア(8〜10月分)
  // ホームゲームの発売日は公式発表より実データを反映
  // 出典: https://www.zelvia.co.jp/stadium-ticket/schedule/ 取得日時: 2026-07-12
  machida: [
    { matchday: 1, isHome: false, opponentId: 'fctokyo', date: '2026-08-08', kickoff: '19:00' },
    { matchday: 2, isHome: false, opponentId: 'chiba', date: '2026-08-15', kickoff: '19:00' },
    { matchday: 3, isHome: true, opponentId: 'urawa', venueOverride: 'MUFGスタジアム', date: '2026-08-23', kickoff: '19:30', saleDate: '2026-07-24T12:00:00+09:00' },
    { matchday: 4, isHome: false, opponentId: 'mito', date: '2026-08-29', kickoff: '18:00' },
    { matchday: 5, isHome: true, opponentId: 'kawasaki', date: '2026-09-02', kickoff: '19:00', saleDate: '2026-08-12T12:00:00+09:00' },
    { matchday: 6, isHome: false, opponentId: 'nagoya', date: '2026-09-06', kickoff: '18:00' },
    { matchday: 7, isHome: true, opponentId: 'ynmarinos', venueOverride: 'MUFGスタジアム', date: '2026-09-12', kickoff: '19:00', saleDate: '2026-08-21T12:00:00+09:00' },
    { matchday: 8, isHome: true, opponentId: 'kashiwa', date: '2026-09-20', kickoff: '17:00', saleDate: '2026-08-27T12:00:00+09:00' },
    { matchday: 9, isHome: false, opponentId: 'kyoto', date: '2026-10-10' },
    { matchday: 10, isHome: true, opponentId: 'fukuoka', date: '2026-10-17', kickoff: '14:00', saleDate: '2026-09-25T12:00:00+09:00' },
    { matchday: 11, isHome: false, opponentId: 'shimizu', date: '2026-10-21', kickoff: '19:00' },
    { matchday: 12, isHome: false, opponentId: 'kobe', date: '2026-10-24' },
    { matchday: 13, isHome: true, opponentId: 'gamba', date: '2026-10-31', kickoff: '14:00', saleDate: '2026-10-09T12:00:00+09:00' },
  ],
  // 水戸ホーリーホック(8〜10月分)
  mito: [
    { matchday: 1, isHome: false, opponentId: 'kashiwa', date: '2026-08-08', kickoff: '19:00' },
    { matchday: 2, isHome: true, opponentId: 'gamba', date: '2026-08-15', kickoff: '18:00' },
    { matchday: 3, isHome: false, opponentId: 'kyoto', date: '2026-08-22', kickoff: '19:00' },
    { matchday: 4, isHome: true, opponentId: 'machida', date: '2026-08-29', kickoff: '18:00' },
    { matchday: 5, isHome: true, opponentId: 'kashima', date: '2026-09-02', kickoff: '19:00' },
    { matchday: 6, isHome: false, opponentId: 'fukuoka', date: '2026-09-05', kickoff: '19:00' },
    { matchday: 7, isHome: true, opponentId: 'kawasaki', date: '2026-09-12', kickoff: '18:00' },
    { matchday: 8, isHome: false, opponentId: 'ynmarinos', date: '2026-09-19', kickoff: '19:30' },
    { matchday: 9, isHome: true, opponentId: 'shimizu', date: '2026-10-11', kickoff: '15:00' },
    { matchday: 10, isHome: true, opponentId: 'urawa', date: '2026-10-17', kickoff: '16:00' },
    { matchday: 11, isHome: false, opponentId: 'okayama', date: '2026-10-21', kickoff: '19:00' },
    { matchday: 12, isHome: false, opponentId: 'fctokyo', date: '2026-10-25', kickoff: '16:00' },
    { matchday: 13, isHome: true, opponentId: 'hiroshima', date: '2026-10-31', kickoff: '14:00' },
  ],
  // 川崎フロンターレ(8〜10月分)
  kawasaki: [
    { matchday: 1, isHome: false, opponentId: 'verdy', date: '2026-08-09', kickoff: '18:00' },
    { matchday: 2, isHome: true, opponentId: 'kyoto', date: '2026-08-15', kickoff: '19:00' },
    { matchday: 3, isHome: false, opponentId: 'hiroshima', date: '2026-08-22', kickoff: '19:15' },
    { matchday: 4, isHome: true, opponentId: 'chiba', date: '2026-08-29', kickoff: '19:00' },
    { matchday: 5, isHome: false, opponentId: 'machida', date: '2026-09-02', kickoff: '19:00' },
    { matchday: 6, isHome: true, opponentId: 'shimizu', venueOverride: 'MUFGスタジアム', date: '2026-09-06', kickoff: '19:00' },
    { matchday: 7, isHome: false, opponentId: 'mito', date: '2026-09-12', kickoff: '18:00' },
    { matchday: 8, isHome: true, opponentId: 'kashima', date: '2026-09-19' },
    { matchday: 9, isHome: true, opponentId: 'nagoya', date: '2026-10-11', kickoff: '16:00' },
    { matchday: 10, isHome: false, opponentId: 'cerezo', date: '2026-10-17', kickoff: '15:00' },
    { matchday: 11, isHome: true, opponentId: 'kobe', date: '2026-10-21', kickoff: '19:00' },
    { matchday: 12, isHome: true, opponentId: 'okayama', date: '2026-10-25', kickoff: '16:00' },
  ],
  // 清水エスパルス(8〜10月分)
  shimizu: [
    { matchday: 1, isHome: true, opponentId: 'nagoya', date: '2026-08-08', kickoff: '19:00' },
    { matchday: 2, isHome: true, opponentId: 'ynmarinos', date: '2026-08-15', kickoff: '18:30' },
    { matchday: 3, isHome: false, opponentId: 'cerezo', date: '2026-08-22', kickoff: '19:00' },
    { matchday: 4, isHome: true, opponentId: 'kashiwa', date: '2026-08-29', kickoff: '18:30' },
    { matchday: 5, isHome: true, opponentId: 'fctokyo', date: '2026-09-02', kickoff: '19:00' },
    { matchday: 6, isHome: false, opponentId: 'kawasaki', venueOverride: 'MUFGスタジアム', date: '2026-09-06', kickoff: '19:00' },
    { matchday: 7, isHome: true, opponentId: 'fukuoka', date: '2026-09-12', kickoff: '18:30' },
    { matchday: 8, isHome: true, opponentId: 'chiba', date: '2026-09-19', kickoff: '18:30' },
    { matchday: 9, isHome: false, opponentId: 'mito', date: '2026-10-11', kickoff: '15:00' },
    { matchday: 10, isHome: true, opponentId: 'gamba', date: '2026-10-17' },
    { matchday: 11, isHome: true, opponentId: 'machida', date: '2026-10-21', kickoff: '19:00' },
    { matchday: 12, isHome: false, opponentId: 'hiroshima', date: '2026-10-24', kickoff: '14:00' },
    { matchday: 13, isHome: false, opponentId: 'kyoto', date: '2026-10-31' },
  ],
  // 京都サンガF.C.(8〜10月分)
  kyoto: [
    { matchday: 1, isHome: false, opponentId: 'nagasaki', date: '2026-08-09', kickoff: '19:00' },
    { matchday: 2, isHome: false, opponentId: 'kawasaki', date: '2026-08-15', kickoff: '19:00' },
    { matchday: 3, isHome: true, opponentId: 'mito', date: '2026-08-22', kickoff: '19:00' },
    { matchday: 4, isHome: true, opponentId: 'fukuoka', date: '2026-08-29', kickoff: '19:00' },
    { matchday: 5, isHome: false, opponentId: 'ynmarinos', date: '2026-09-02', kickoff: '19:00' },
    { matchday: 6, isHome: false, opponentId: 'fctokyo', date: '2026-09-06', kickoff: '19:30' },
    { matchday: 7, isHome: true, opponentId: 'kashiwa', date: '2026-09-12' },
    { matchday: 8, isHome: false, opponentId: 'okayama', date: '2026-09-19', kickoff: '19:00' },
    { matchday: 9, isHome: true, opponentId: 'machida', date: '2026-10-10' },
    { matchday: 10, isHome: false, opponentId: 'hiroshima', date: '2026-10-17', kickoff: '14:00' },
    { matchday: 11, isHome: true, opponentId: 'kashima', date: '2026-10-21', kickoff: '19:00' },
    { matchday: 12, isHome: false, opponentId: 'gamba', date: '2026-10-24', kickoff: '16:00' },
    { matchday: 13, isHome: true, opponentId: 'shimizu', date: '2026-10-31' },
  ],
  // ヴィッセル神戸(8〜10月分)
  kobe: [
    { matchday: 1, isHome: false, opponentId: 'fukuoka', date: '2026-08-08', kickoff: '19:00' },
    { matchday: 2, isHome: true, opponentId: 'fctokyo', date: '2026-08-15', kickoff: '19:00' },
    { matchday: 3, isHome: false, opponentId: 'ynmarinos', date: '2026-08-22', kickoff: '19:30' },
    { matchday: 4, isHome: true, opponentId: 'cerezo', date: '2026-08-29', kickoff: '19:00' },
    { matchday: 5, isHome: false, opponentId: 'verdy', date: '2026-09-02', kickoff: '19:00' },
    { matchday: 6, isHome: true, opponentId: 'nagasaki', date: '2026-09-06', kickoff: '19:00' },
    { matchday: 7, isHome: true, opponentId: 'kashima', date: '2026-09-12' },
    { matchday: 8, isHome: false, opponentId: 'gamba', date: '2026-09-20', kickoff: '17:00' },
    { matchday: 9, isHome: false, opponentId: 'kashiwa', date: '2026-10-09', kickoff: '19:00' },
    { matchday: 10, isHome: false, opponentId: 'okayama', date: '2026-10-17' },
    { matchday: 11, isHome: false, opponentId: 'kawasaki', date: '2026-10-21', kickoff: '19:00' },
    { matchday: 12, isHome: true, opponentId: 'machida', date: '2026-10-24' },
    { matchday: 13, isHome: true, opponentId: 'nagoya', date: '2026-10-31' },
  ],
  // ジェフユナイテッド千葉(8〜10月分)
  // 発売日は公式に「決定次第お知らせ」と確認済みのため未設定
  chiba: [
    { matchday: 1, isHome: false, opponentId: 'hiroshima', date: '2026-08-08', kickoff: '19:15' },
    { matchday: 2, isHome: true, opponentId: 'machida', date: '2026-08-15', kickoff: '19:00' },
    { matchday: 3, isHome: false, opponentId: 'fctokyo', venueOverride: 'MUFGスタジアム', date: '2026-08-21', kickoff: '19:30' },
    { matchday: 4, isHome: false, opponentId: 'kawasaki', date: '2026-08-29', kickoff: '19:00' },
    { matchday: 5, isHome: true, opponentId: 'okayama', date: '2026-09-02', kickoff: '19:00' },
    { matchday: 6, isHome: true, opponentId: 'gamba', date: '2026-09-06', kickoff: '18:00' },
    { matchday: 7, isHome: false, opponentId: 'verdy', date: '2026-09-13', kickoff: '18:00' },
    { matchday: 8, isHome: false, opponentId: 'shimizu', date: '2026-09-19', kickoff: '18:30' },
    { matchday: 9, isHome: true, opponentId: 'nagasaki', date: '2026-10-11', kickoff: '14:00' },
    { matchday: 10, isHome: true, opponentId: 'ynmarinos', date: '2026-10-17', kickoff: '14:00' },
    { matchday: 11, isHome: false, opponentId: 'urawa', date: '2026-10-21', kickoff: '19:30' },
    { matchday: 12, isHome: false, opponentId: 'cerezo', date: '2026-10-25', kickoff: '15:00' },
  ],
  // セレッソ大阪(8〜10月分)
  // ホームゲームの発売日は公式発表より実データを反映
  // 出典: https://www.cerezo.jp/ticket/ 取得日時: 2026-07-12
  cerezo: [
    { matchday: 1, isHome: true, opponentId: 'okayama', date: '2026-08-08', kickoff: '19:00', saleDate: '2026-07-16T11:00:00+09:00' },
    { matchday: 2, isHome: false, opponentId: 'fukuoka', date: '2026-08-15', kickoff: '19:00' },
    { matchday: 3, isHome: true, opponentId: 'shimizu', date: '2026-08-22', kickoff: '19:00', saleDate: '2026-07-23T11:00:00+09:00' },
    { matchday: 4, isHome: false, opponentId: 'kobe', date: '2026-08-29', kickoff: '19:00' },
    { matchday: 5, isHome: true, opponentId: 'kashiwa', date: '2026-09-02', kickoff: '19:00', saleDate: '2026-07-30T11:00:00+09:00' },
    { matchday: 6, isHome: true, opponentId: 'verdy', date: '2026-09-06', kickoff: '19:00', saleDate: '2026-07-30T11:00:00+09:00' },
    { matchday: 7, isHome: false, opponentId: 'hiroshima', date: '2026-09-12', kickoff: '19:00' },
    { matchday: 8, isHome: false, opponentId: 'nagasaki', date: '2026-09-19', kickoff: '18:30' },
    { matchday: 9, isHome: true, opponentId: 'ynmarinos', date: '2026-10-10', kickoff: '14:00', saleDate: '2026-08-20T11:00:00+09:00' },
    { matchday: 10, isHome: true, opponentId: 'kawasaki', date: '2026-10-17', kickoff: '15:00', saleDate: '2026-08-27T11:00:00+09:00' },
    { matchday: 11, isHome: false, opponentId: 'nagoya', date: '2026-10-21', kickoff: '19:00' },
    { matchday: 12, isHome: true, opponentId: 'chiba', date: '2026-10-25', kickoff: '15:00', saleDate: '2026-09-03T11:00:00+09:00' },
    { matchday: 13, isHome: false, opponentId: 'kashima', date: '2026-10-31', kickoff: '15:00' },
  ],
  // ファジアーノ岡山(8〜10月分)
  // ホームゲームの発売日は公式発表(チケット販売スケジュール)より実データを反映
  // 出典: https://www.fagiano-okayama.com/ticket/ticket_schedule/ 取得日時: 2026-07-12
  okayama: [
    { matchday: 1, isHome: false, opponentId: 'cerezo', date: '2026-08-08', kickoff: '19:00' },
    { matchday: 2, isHome: true, opponentId: 'nagasaki', date: '2026-08-15', kickoff: '18:55', saleDate: '2026-07-17T12:00:00+09:00' },
    { matchday: 3, isHome: true, opponentId: 'verdy', date: '2026-08-22', kickoff: '18:30', saleDate: '2026-07-31T12:00:00+09:00' },
    { matchday: 4, isHome: false, opponentId: 'nagoya', date: '2026-08-29', kickoff: '19:00' },
    { matchday: 5, isHome: false, opponentId: 'chiba', date: '2026-09-02', kickoff: '19:00' },
    { matchday: 6, isHome: true, opponentId: 'hiroshima', date: '2026-09-06', kickoff: '18:00', saleDate: '2026-08-07T12:00:00+09:00' },
    { matchday: 7, isHome: false, opponentId: 'urawa', date: '2026-09-13', kickoff: '18:30' },
    { matchday: 8, isHome: true, opponentId: 'kyoto', date: '2026-09-19', kickoff: '19:00', saleDate: '2026-08-21T12:00:00+09:00' },
    { matchday: 9, isHome: false, opponentId: 'fukuoka', date: '2026-10-10', kickoff: '15:00' },
    { matchday: 10, isHome: true, opponentId: 'kobe', date: '2026-10-17', saleDate: '2026-09-11T12:00:00+09:00' },
    { matchday: 11, isHome: true, opponentId: 'mito', date: '2026-10-21', kickoff: '19:00', saleDate: '2026-09-18T12:00:00+09:00' },
    { matchday: 12, isHome: false, opponentId: 'kawasaki', date: '2026-10-25', kickoff: '16:00' },
    { matchday: 13, isHome: true, opponentId: 'fctokyo', date: '2026-10-31', kickoff: '14:00', saleDate: '2026-10-02T12:00:00+09:00' },
  ],
  // アビスパ福岡(8〜10月分)
  // ホームゲームの発売日は公式発表より実データを反映
  // 出典: ユーザー提供情報 取得日時: 2026-07-12
  fukuoka: [
    { matchday: 1, isHome: true, opponentId: 'kobe', date: '2026-08-08', kickoff: '19:00', saleDate: '2026-07-12T10:00:00+09:00' },
    { matchday: 2, isHome: true, opponentId: 'cerezo', date: '2026-08-15', kickoff: '19:00', saleDate: '2026-07-19T10:00:00+09:00' },
    { matchday: 3, isHome: false, opponentId: 'kashima', date: '2026-08-22', kickoff: '18:00' },
    { matchday: 4, isHome: false, opponentId: 'kyoto', date: '2026-08-29', kickoff: '19:00' },
    { matchday: 5, isHome: true, opponentId: 'urawa', date: '2026-09-02', kickoff: '19:00', saleDate: '2026-08-02T10:00:00+09:00' },
    { matchday: 6, isHome: true, opponentId: 'mito', date: '2026-09-05', kickoff: '19:00', saleDate: '2026-08-09T10:00:00+09:00' },
    { matchday: 7, isHome: false, opponentId: 'shimizu', date: '2026-09-12', kickoff: '18:30' },
    { matchday: 8, isHome: true, opponentId: 'hiroshima', date: '2026-09-19', kickoff: '18:00', saleDate: '2026-08-23T10:00:00+09:00' },
    { matchday: 9, isHome: true, opponentId: 'okayama', date: '2026-10-10', kickoff: '15:00', saleDate: '2026-09-13T10:00:00+09:00' },
    { matchday: 10, isHome: false, opponentId: 'machida', date: '2026-10-17', kickoff: '14:00' },
    { matchday: 11, isHome: true, opponentId: 'gamba', date: '2026-10-21', kickoff: '19:00', saleDate: '2026-09-27T10:00:00+09:00' },
    { matchday: 12, isHome: false, opponentId: 'verdy', date: '2026-10-24', kickoff: '15:00' },
  ],
  // V・ファーレン長崎(8〜10月分、発売日は第1節のみ判明)
  nagasaki: [
    { matchday: 1, isHome: true, opponentId: 'kyoto', date: '2026-08-09', kickoff: '19:00', saleDate: '2026-07-15T19:00:00+09:00' },
    { matchday: 2, isHome: false, opponentId: 'okayama', date: '2026-08-15', kickoff: '18:55' },
    { matchday: 3, isHome: false, opponentId: 'kashiwa', date: '2026-08-21', kickoff: '19:00' },
    { matchday: 4, isHome: true, opponentId: 'fctokyo', date: '2026-08-29', kickoff: '18:30' },
    { matchday: 5, isHome: true, opponentId: 'gamba', date: '2026-09-02', kickoff: '19:00' },
    { matchday: 6, isHome: false, opponentId: 'kobe', date: '2026-09-06', kickoff: '19:00' },
    { matchday: 7, isHome: true, opponentId: 'nagoya', date: '2026-09-12', kickoff: '19:00' },
    { matchday: 8, isHome: true, opponentId: 'cerezo', date: '2026-09-19', kickoff: '18:30' },
    { matchday: 9, isHome: false, opponentId: 'chiba', date: '2026-10-11', kickoff: '14:00' },
    { matchday: 10, isHome: false, opponentId: 'kashima', date: '2026-10-17', kickoff: '15:00' },
    { matchday: 11, isHome: true, opponentId: 'hiroshima', date: '2026-10-21', kickoff: '19:00' },
    { matchday: 12, isHome: false, opponentId: 'urawa', date: '2026-10-25', kickoff: '15:00' },
  ],
  // サンフレッチェ広島(8〜10月分)
  // 出典: https://www.sanfrecce.co.jp/tickets/schedule 取得日時: 2026-07-12
  // (節番号は公式サイト記載のホームゲーム分に準拠、アウェイ分は対戦相手側データと突き合わせて補完)
  hiroshima: [
    { matchday: 1, isHome: true, opponentId: 'chiba', date: '2026-08-08', kickoff: '19:15', saleDate: '2026-07-10T12:00:00+09:00' },
    { matchday: 2, isHome: false, opponentId: 'urawa', date: '2026-08-15', kickoff: '19:00' },
    { matchday: 3, isHome: true, opponentId: 'kawasaki', date: '2026-08-22', kickoff: '19:15' },
    { matchday: 4, isHome: false, opponentId: 'gamba', date: '2026-08-29', kickoff: '18:00' },
    { matchday: 5, isHome: true, opponentId: 'nagoya', date: '2026-09-02', kickoff: '19:00' },
    { matchday: 6, isHome: false, opponentId: 'okayama', date: '2026-09-06', kickoff: '18:00' },
    { matchday: 7, isHome: true, opponentId: 'cerezo', date: '2026-09-12', kickoff: '19:00', saleDate: '2026-08-07T12:00:00+09:00' },
    { matchday: 8, isHome: false, opponentId: 'fukuoka', date: '2026-09-19', kickoff: '18:00' },
    { matchday: 9, isHome: false, opponentId: 'verdy', date: '2026-10-11', kickoff: '15:00' },
    { matchday: 10, isHome: true, opponentId: 'kyoto', date: '2026-10-17', kickoff: '14:00', saleDate: '2026-09-11T12:00:00+09:00' },
    { matchday: 11, isHome: false, opponentId: 'nagasaki', date: '2026-10-21', kickoff: '19:00' },
    { matchday: 12, isHome: true, opponentId: 'shimizu', date: '2026-10-24', kickoff: '14:00' },
  ],
};

// 試合日程は実データ、発売日は判明分のみ実データ・それ以外は「未発表」として組み立てる汎用関数
function buildFixturesFromRealSchedule(team, schedule) {
  return schedule.map((entry) => {
    const opponent = resolveClub(entry.opponentId);
    const host = entry.isHome ? team : opponent;
    const matchDate = new Date(`${entry.date}T00:00:00+09:00`);
    const kickoff = entry.kickoff || '未定';
    const stadium = entry.venueOverride || (entry.isHome ? team.stadium : opponent.stadium);

    if (entry.saleDate) {
      // 実際に告知されている発売日(クラブ公式のチケット発売スケジュール表より)
      const saleDate = new Date(entry.saleDate);
      return {
        id: `${team.id}-r${entry.matchday}`,
        opponent,
        isHome: entry.isHome,
        host,
        matchDate,
        kickoff,
        stadium,
        saleDate,
        status: TODAY >= saleDate ? 'onsale' : 'upcoming',
        isRealData: true, // 試合日程・発売日ともに実データ
        scheduleIsReal: true,
      };
    }

    // チケット発売日はまだ告知されていない(多くのクラブは試合の3〜4週間前まで発表しない)。
    // 実在しない日付を仮置きするのは誤解を招くため、正直に「未告知」の状態として扱う。
    return {
      id: `${team.id}-r${entry.matchday}`,
      opponent,
      isHome: entry.isHome,
      host,
      matchDate,
      kickoff,
      stadium,
      saleDate: null,
      status: 'unknown',
      sourceUrl: host.ticketSystem ? host.ticketSystem.url : null,
      isRealData: true, // 試合日程は実データ。発売日は「まだ無い」という実状をそのまま表している
      scheduleIsReal: true,
    };
  });
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
// ---- 正規運賃(実データ) --------------------------------------------------
// 特定チーム×特定対戦相手の組み合わせについて、駅探・新幹線ネット等で確認した
// 正規の片道運賃・所要時間。近似式ではなく実際の公表運賃を使用する。
// キーは「出発チームID-対戦相手ID」の複合キー(同じ対戦相手でも出発地が違えば
// 運賃が全く異なるため、対戦相手だけをキーにしないよう注意)。
// 取得日時: 2026-07-11
const REAL_TRAIN_FARES = {
  // 名古屋グランパス
  'nagoya-kashima': { oneWayFare: 13400, oneWayHours: 4 + 10 / 60, note: '名古屋→東京(新幹線のぞみ)＋東京→鹿島神宮駅(在来線・バス)の合算・正規運賃' },
  'nagoya-hiroshima': { oneWayFare: 14810, oneWayHours: 2 + 11 / 60, note: '新幹線のぞみ普通車指定席の正規運賃(名古屋−広島)' },
  'nagoya-nagasaki': { oneWayFare: 23930, oneWayHours: 5 + 40 / 60, note: '新幹線のぞみ+特急かもめ(博多・武雄温泉乗継)の正規運賃・全区間指定席' },
  'nagoya-fctokyo': { oneWayFare: 11500, oneWayHours: 1 + 55 / 60, note: '新幹線のぞみ指定席(名古屋−東京)＋国立競技場最寄り駅までの在来線の合算' },
  // 東京ヴェルディ(拠点: 味の素スタジアム/調布)
  'verdy-okayama': { oneWayFare: 17650, oneWayHours: 3 + 30 / 60, note: '新幹線のぞみ指定席の正規運賃(東京−岡山)＋調布・スタジアム間の在来線' },
  'verdy-cerezo': { oneWayFare: 15020, oneWayHours: 2 + 45 / 60, note: '新幹線のぞみ指定席の正規運賃(東京−新大阪)＋調布・新大阪・スタジアム間の在来線' },
  'verdy-urawa': { oneWayFare: 900, oneWayHours: 1 + 10 / 60, note: '新幹線を使わない区間。JR在来線での正規運賃(調布−浦和)' },
  'verdy-ynmarinos': { oneWayFare: 400, oneWayHours: 45 / 60, note: 'この試合はMUFG国立(東京都内)で開催されるため新幹線は不要。都内在来線の正規運賃' },
  // 鹿島アントラーズ(新幹線が通っていないため、必ず東京経由になる区間)
  // 東京-鹿島神宮駅(実運賃¥2,100/約2時間15分)+ 東京-新大阪/京都(実運賃)を組み合わせて算出
  'kashima-kobe': { oneWayFare: 17520, oneWayHours: 2.25 + 2.35 + 0.3, note: '東京-鹿島神宮駅(実運賃)＋新幹線のぞみ(東京-新大阪)の実運賃＋神戸市内の在来線を合算' },
  'kashima-kyoto': { oneWayFare: 16570, oneWayHours: 2.25 + 2.25 + 0.2, note: '東京-鹿島神宮駅(実運賃)＋新幹線のぞみ(東京-京都)の実運賃相場＋亀岡市内の在来線を合算' },
  'gamba-kashima': { oneWayFare: 16820, oneWayHours: 2.35 + 2.25, note: '新幹線のぞみ(新大阪-東京)の実運賃＋東京-鹿島神宮駅(実運賃)を合算' },
  // 柏レイソル(柏駅は新幹線が通っていないため、東京経由の長距離区間を合算)
  'kashiwa-shimizu': { oneWayFare: 7270, oneWayHours: 0.5 + 1.0, note: '柏-東京間の在来線目安＋新幹線こだま(東京-静岡)の実運賃相場を合算' },
  'kashiwa-cerezo': { oneWayFare: 16220, oneWayHours: 0.5 + 2.35 + 0.3, note: '柏-東京間の在来線目安＋新幹線のぞみ(東京-新大阪)の実運賃＋大阪市内の在来線を合算' },
  'kashiwa-kyoto': { oneWayFare: 15270, oneWayHours: 0.5 + 2.25 + 0.2, note: '柏-東京間の在来線目安＋新幹線のぞみ(東京-京都)の実運賃相場＋亀岡市内の在来線を合算' },
  // ガンバ大阪(長崎・鹿島同様、新幹線本線から外れる関東の区間は東京経由で合算)
  'gamba-chiba': { oneWayFare: 15520, oneWayHours: 2.35 + 0.5, note: '新幹線のぞみ(新大阪-東京)の実運賃＋東京-千葉間の在来線目安を合算' },
  'gamba-machida': { oneWayFare: 15520, oneWayHours: 2.35 + 0.5, note: '新幹線のぞみ(新大阪-東京)の実運賃＋東京-町田間の在来線目安を合算' },
  'gamba-mito': { oneWayFare: 16720, oneWayHours: 2.35 + 1.3, note: '新幹線のぞみ(新大阪-東京)の実運賃＋東京-水戸間の在来線目安を合算' },
  'gamba-fukuoka': { oneWayFare: 16620, oneWayHours: 2.37 + 0.2, note: '新幹線のぞみ/みずほ指定席の実運賃(新大阪-博多)＋博多駅-スタジアム間の在来線目安を合算' },
};

function TravelPromo({ fixture, team }) {
  const origin = team.travelOrigin || { label: team.stadium, coords: team.coords };
  const dateLabel = formatDate(fixture.matchDate);
  const realFare = REAL_TRAIN_FARES[`${team.id}-${fixture.host.id}`];
  const estimate = realFare
    ? {
        distanceKm: Math.round(haversineKm(origin.coords, fixture.host.coords)),
        train: {
          oneWayHours: realFare.oneWayHours,
          total: realFare.oneWayFare * 2,
          isOfficial: true,
          note: realFare.note,
        },
      }
    : estimateTravel(origin.coords, fixture.host.coords);

  const links = [
    {
      label: 'ホテルを探す',
      // 楽天アフィリエイトで発行した実リンク(現状はトップページ誘導。エリア絞り込みは今後対応)
      url: 'https://hb.afl.rakuten.co.jp/hgc/55b1ae55.b3829984.55b1ae56.07fa8f71/_RTLink137897?pc=https%3A%2F%2Ftravel.rakuten.co.jp%2F&link_type=text&ut=eyJwYWdlIjoidXJsIiwidHlwZSI6InRleHQiLCJjb2wiOjF9',
    },
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
        {origin.label} から約 {estimate.distanceKm}km{estimate.train.isLocalHop ? '(近隣)' : '(概算)'}
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{ borderRadius: 8, background: '#0F1F16', padding: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#C7D6CB' }}>
              {estimate.train.isLocalHop ? '🚃 在来線(往復)' : '🚄 電車(往復)'}
            </div>
            {estimate.train.isOfficial && (
              <span
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  color: '#0F1F16',
                  background: '#7ED99B',
                  borderRadius: 4,
                  padding: '2px 6px',
                }}
              >
                正規運賃
              </span>
            )}
          </div>
          {estimate.train.isOfficial ? (
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#8FA893', lineHeight: 1.7 }}>
              片道 約{formatHours(estimate.train.oneWayHours)}
              <br />
              <span style={{ color: '#F4D35E', fontWeight: 700 }}>往復 {formatYen(estimate.train.total)}</span>
            </div>
          ) : estimate.train.isLocalHop ? (
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#8FA893', lineHeight: 1.7 }}>
              片道 約{formatHours(estimate.train.oneWayHours)}
              <br />
              <span style={{ color: '#F4D35E', fontWeight: 700 }}>合計 {formatYen(estimate.train.total)}</span>
            </div>
          ) : (
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#8FA893', lineHeight: 1.7 }}>
              片道 約{formatHours(estimate.train.oneWayHours)}
              <br />
              新幹線 {formatYen(estimate.train.shinkansen)}
              <br />
              在来線等 {formatYen(estimate.train.local)}
              <br />
              <span style={{ color: '#F4D35E', fontWeight: 700 }}>合計 {formatYen(estimate.train.total)}</span>
            </div>
          )}
          {estimate.train.isOfficial && (
            <div style={{ fontSize: 10, color: '#5C7A64', marginTop: 6, lineHeight: 1.5 }}>※ {estimate.train.note}</div>
          )}
        </div>
      </div>

      {!estimate.train.isLocalHop && (
        <>
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
        </>
      )}
      {!estimate.train.isOfficial && (
        <div style={{ fontSize: 10, color: '#5C7A64', marginTop: 8, lineHeight: 1.5 }}>
          {estimate.train.isLocalHop
            ? '※ 近距離のため新幹線を使わない在来線移動として概算しています。実際の経路・料金とは異なる場合があります。'
            : '※ 移動時間・費用は直線距離をもとにした概算です(実運賃2点で校正済み)。実際の経路・料金とは異なる場合があります。'}
        </div>
      )}
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
  const [selectedId, setSelectedId] = useState(() => {
    const stored = getStoredDefaultTeamId();
    return stored && TEAMS.some((t) => t.id === stored) ? stored : TEAMS[0].id;
  });
  const [defaultTeamId, setDefaultTeamId] = useState(() => getStoredDefaultTeamId());
  const [defaultSaved, setDefaultSaved] = useState(false);
  const selectedTeam = TEAMS.find((t) => t.id === selectedId);
  const isDefaultTeam = defaultTeamId === selectedId;

  const handleSetDefault = () => {
    setStoredDefaultTeamId(selectedId);
    setDefaultTeamId(selectedId);
    setDefaultSaved(true);
    setTimeout(() => setDefaultSaved(false), 2000);
  };

  const fixtures = useMemo(() => {
    if (selectedTeam.id === 'nagoya') return buildRealNagoyaFixtures(selectedTeam);
    if (REAL_SCHEDULES[selectedTeam.id]) return buildFixturesFromRealSchedule(selectedTeam, REAL_SCHEDULES[selectedTeam.id]);
    return buildFixtures(selectedTeam);
  }, [selectedId]);

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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
            <a
              href="https://forms.gle/C37UmeQzK3DCSeWv9"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                flexShrink: 0,
                color: '#F4D35E',
                textDecoration: 'none',
                fontFamily: "'Oswald', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              <MessageCircle size={14} />
              ご意見
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 36, borderRadius: 2, background: selectedTeam.color, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 22, lineHeight: 1.1 }}>
                {selectedTeam.name}
              </div>
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
            {selectedTeam.id !== 'nagoya' && REAL_SCHEDULES[selectedTeam.id] && (
              <span
                style={{
                  flexShrink: 0,
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: '#C7D6CB',
                  border: '1px solid #3A5A44',
                  borderRadius: 4,
                  padding: '3px 6px',
                  alignSelf: 'flex-start',
                  textAlign: 'right',
                  lineHeight: 1.3,
                }}
              >
                対戦カードは実データ
                <br />
                発売日は判明分のみ反映
              </span>
            )}
          </div>

          <button
            onClick={handleSetDefault}
            disabled={isDefaultTeam}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 10,
              padding: '4px 0',
              background: 'transparent',
              border: 'none',
              cursor: isDefaultTeam ? 'default' : 'pointer',
              fontFamily: "'Oswald', sans-serif",
              fontSize: 11,
              letterSpacing: 0.5,
              color: isDefaultTeam ? '#F4D35E' : '#5C7A64',
            }}
          >
            <Star size={13} fill={isDefaultTeam ? '#F4D35E' : 'none'} />
            {defaultSaved
              ? '初期表示に設定しました'
              : isDefaultTeam
              ? 'このチームを初期表示中'
              : 'このチームを初期表示に設定'}
          </button>

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
          <div style={{ marginTop: 12 }}>
            <a href="/privacy.html" style={{ color: '#8FA893' }}>プライバシーポリシー</a>
            <span style={{ margin: '0 8px' }}>|</span>
            <a href="/terms.html" style={{ color: '#8FA893' }}>利用規約</a>
          </div>
        </div>
      </div>
    </div>
  );
}
