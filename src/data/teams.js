// 各クラブの本拠地(スタジアム所在地)に対応するAgodaの都市ページスラッグ。
// チーム名の都市とスタジアム所在地が異なる場合があるため、個別に確認済み
// (例: 名古屋グランパス→豊田スタジアムは豊田市、G大阪→吹田市 等)。
const AGODA_CITY_SLUGS = {
  kashima: 'kamisu-jp', // 鹿島市に専用ページなし、隣接の神栖市で代用
  mito: 'mito-jp',
  urawa: 'saitama-jp',
  chiba: 'chiba-jp',
  kashiwa: 'kashiwa-jp',
  fctokyo: 'tokyo-jp',
  verdy: 'tokyo-jp',
  machida: 'machida-jp',
  kawasaki: 'kawasaki-jp',
  ynmarinos: 'yokohama-jp',
  shimizu: 'shizuoka-jp', // 清水区は静岡市の一部として扱われる
  nagoya: 'toyota-jp', // 豊田スタジアムは豊田市
  kyoto: 'kyoto-jp', // サンガスタジアム(亀岡市)は京都の一部として扱われる
  gamba: 'suita-jp', // パナソニックスタジアムは吹田市
  cerezo: 'osaka-jp',
  kobe: 'kobe-jp',
  okayama: 'okayama-jp',
  hiroshima: 'hiroshima-jp',
  fukuoka: 'fukuoka-jp',
  nagasaki: 'nagasaki-jp',
};

// A8.net経由でAgodaの都市ページへ誘導するアフィリエイトリンクを組み立てる
export function buildAgodaAffiliateUrl(teamId) {
  const slug = AGODA_CITY_SLUGS[teamId] || 'tokyo-jp';
  const target = `https://www.agoda.com/ja-jp/city/${slug}.html`;
  return `https://px.a8.net/svt/ejp?a8mat=4B83CZ+2EXB3M+4X1W+BW8O2&a8ejpredirect=${encodeURIComponent(target)}`;
}

export const TEAMS = [
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
