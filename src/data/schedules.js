import { TEAMS } from './teams';
import { resolveVenueName } from './venues';

export const REAL_SCHEDULES = {
  // 名古屋グランパス(8〜10月分、他クラブとの整合を優先し他チーム基準を優先)
  // ホームゲームの発売日は公式サイトのチケット発売スケジュール表より実データを反映
  // 出典: https://nagoya-grampus.jp/ticket/schedule/ 取得日時: 2026-07-11
  // アウェイ戦の発売日は対戦相手クラブのページを個別調査(判明分のみ反映)
  // 9節以降(10月分)は対戦相手クラブ側データ(kawasaki/kashiwa/cerezo/ynmarinos/kobe)と突き合わせて補完。
  // 発売日は未確認のため反映せず「未発表」として扱う。
  nagoya: [
    { matchday: 1, isHome: true, opponentId: 'shimizu', date: '2026-08-08', kickoff: '19:00', saleDate: '2026-07-18T10:00:00+09:00' },
    { matchday: 2, isHome: false, opponentId: 'kashima', date: '2026-08-15', kickoff: '18:00', saleDate: '2026-07-24T10:00:00+09:00' },
    { matchday: 3, isHome: true, opponentId: 'gamba', date: '2026-08-22', kickoff: '19:00', saleDate: '2026-07-25T10:00:00+09:00' },
    { matchday: 4, isHome: true, opponentId: 'okayama', date: '2026-08-29', kickoff: '19:00', saleDate: '2026-07-25T10:00:00+09:00' },
    { matchday: 5, isHome: false, opponentId: 'hiroshima', date: '2026-09-02', kickoff: '19:00', saleDate: '2026-07-10T12:00:00+09:00' },
    { matchday: 6, isHome: true, opponentId: 'machida', date: '2026-09-06', kickoff: '18:00', saleDate: '2026-08-01T10:00:00+09:00' },
    { matchday: 7, isHome: false, opponentId: 'nagasaki', date: '2026-09-12' },
    { matchday: 8, isHome: false, opponentId: 'fctokyo', venueOverride: '国立競技場', date: '2026-09-19' },
    { matchday: 9, isHome: false, opponentId: 'kawasaki', date: '2026-10-11', kickoff: '16:00' },
    { matchday: 10, isHome: false, opponentId: 'kashiwa', date: '2026-10-17' },
    { matchday: 11, isHome: true, opponentId: 'cerezo', date: '2026-10-21', kickoff: '19:00' },
    { matchday: 12, isHome: true, opponentId: 'ynmarinos', date: '2026-10-24' },
    { matchday: 13, isHome: false, opponentId: 'kobe', date: '2026-10-31' },
  ],
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
  // ホームゲームの発売日は公式発表(販売日程)より実データを反映
  // 出典: https://www.reysol.co.jp/ticket/tktscd.php 取得日時: 2026-07-18
  kashiwa: [
    { matchday: 1, isHome: true, opponentId: 'mito', date: '2026-08-08', kickoff: '19:00', saleDate: '2026-07-26T12:00:00+09:00' },
    { matchday: 2, isHome: false, opponentId: 'verdy', venueOverride: 'MUFGスタジアム', date: '2026-08-14', kickoff: '19:00', saleDate: '2026-07-15T12:00:00+09:00' },
    { matchday: 3, isHome: true, opponentId: 'nagasaki', date: '2026-08-21', kickoff: '19:00', saleDate: '2026-08-09T12:00:00+09:00' },
    { matchday: 4, isHome: false, opponentId: 'shimizu', date: '2026-08-29', kickoff: '18:30' },
    { matchday: 5, isHome: false, opponentId: 'cerezo', date: '2026-09-02', kickoff: '19:00' },
    { matchday: 6, isHome: true, opponentId: 'ynmarinos', date: '2026-09-06', kickoff: '19:00', saleDate: '2026-08-22T12:00:00+09:00' },
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
    { matchday: 3, isHome: false, opponentId: 'nagoya', date: '2026-08-22', kickoff: '19:00' },
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
  // ホームゲームの発売日は公式発表より実データを反映
  // 出典: https://www.verdy.co.jp/news/15084 (8・9月分) / news/15017 (柏戦) 取得日時: 2026-07-17
  verdy: [
    { matchday: 1, isHome: true, opponentId: 'kawasaki', date: '2026-08-09', kickoff: '18:00', saleDate: '2026-07-24T12:00:00+09:00' },
    { matchday: 2, isHome: true, opponentId: 'kashiwa', venueOverride: 'MUFGスタジアム', date: '2026-08-14', kickoff: '19:00', saleDate: '2026-07-15T12:00:00+09:00' },
    { matchday: 3, isHome: false, opponentId: 'okayama', date: '2026-08-22', kickoff: '18:30' },
    { matchday: 4, isHome: true, opponentId: 'kashima', date: '2026-08-29', kickoff: '19:00', saleDate: '2026-08-12T12:00:00+09:00' },
    { matchday: 5, isHome: true, opponentId: 'kobe', date: '2026-09-02', kickoff: '19:00', saleDate: '2026-08-12T12:00:00+09:00' },
    { matchday: 6, isHome: false, opponentId: 'cerezo', date: '2026-09-06', kickoff: '19:00' },
    { matchday: 7, isHome: true, opponentId: 'chiba', date: '2026-09-13', kickoff: '18:00', saleDate: '2026-08-21T12:00:00+09:00' },
    { matchday: 8, isHome: false, opponentId: 'urawa', date: '2026-09-19', kickoff: '18:30' },
    { matchday: 9, isHome: true, opponentId: 'hiroshima', date: '2026-10-11', kickoff: '15:00' },
    { matchday: 10, isHome: true, opponentId: 'fctokyo', date: '2026-10-17', kickoff: '14:00' },
    { matchday: 11, isHome: false, opponentId: 'ynmarinos', venueOverride: 'MUFGスタジアム', date: '2026-10-21', kickoff: '19:00' },
    { matchday: 12, isHome: true, opponentId: 'fukuoka', date: '2026-10-24', kickoff: '15:00' },
  ],
  // FC東京(8〜10月分)
  // ホームゲームの発売日は公式発表(価格・席割図・発売日)より実データを反映
  // 出典: https://www.fctokyo.co.jp/ticket/price/ 取得日時: 2026-07-18
  fctokyo: [
    { matchday: 1, isHome: true, opponentId: 'machida', date: '2026-08-08', kickoff: '19:00', saleDate: '2026-07-13T10:00:00+09:00' },
    { matchday: 2, isHome: false, opponentId: 'kobe', date: '2026-08-15', kickoff: '19:00' },
    { matchday: 3, isHome: true, opponentId: 'chiba', venueOverride: 'MUFGスタジアム', date: '2026-08-21', kickoff: '19:30', saleDate: '2026-07-20T10:00:00+09:00' },
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
    { matchday: 2, isHome: true, opponentId: 'gamba', date: '2026-08-15', kickoff: '18:00', saleDate: '2026-07-31T12:00:00+09:00' },
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
  // ホームゲームの発売日は公式発表(チケット発売日と開催内容)より実データを反映
  // 出典: https://www.frontale.co.jp/tickets/ 取得日時: 2026-07-20
  kawasaki: [
    { matchday: 1, isHome: false, opponentId: 'verdy', date: '2026-08-09', kickoff: '18:00' },
    { matchday: 2, isHome: true, opponentId: 'kyoto', date: '2026-08-15', kickoff: '19:00', saleDate: '2026-08-01T10:00:00+09:00' },
    { matchday: 3, isHome: false, opponentId: 'hiroshima', date: '2026-08-22', kickoff: '19:15' },
    { matchday: 4, isHome: true, opponentId: 'chiba', date: '2026-08-29', kickoff: '19:00', saleDate: '2026-08-16T10:00:00+09:00' },
    { matchday: 5, isHome: false, opponentId: 'machida', date: '2026-09-02', kickoff: '19:00' },
    { matchday: 6, isHome: true, opponentId: 'shimizu', venueOverride: 'MUFGスタジアム', date: '2026-09-06', kickoff: '19:00', saleDate: '2026-08-23T10:00:00+09:00' },
    { matchday: 7, isHome: false, opponentId: 'mito', date: '2026-09-12', kickoff: '18:00' },
    { matchday: 8, isHome: true, opponentId: 'kashima', date: '2026-09-19' },
    { matchday: 9, isHome: true, opponentId: 'nagoya', date: '2026-10-11', kickoff: '16:00' },
    { matchday: 10, isHome: false, opponentId: 'cerezo', date: '2026-10-17', kickoff: '15:00' },
    { matchday: 11, isHome: true, opponentId: 'kobe', date: '2026-10-21', kickoff: '19:00' },
    { matchday: 12, isHome: true, opponentId: 'okayama', date: '2026-10-25', kickoff: '16:00' },
  ],
  // 清水エスパルス(8〜10月分)
  // ホームゲームの発売日は公式発表(販売スケジュール)より実データを反映
  // 出典: https://www.s-pulse.co.jp/tickets/schedule 取得日時: 2026-07-18
  shimizu: [
    { matchday: 1, isHome: false, opponentId: 'nagoya', date: '2026-08-08', kickoff: '19:00' },
    { matchday: 2, isHome: true, opponentId: 'ynmarinos', date: '2026-08-15', kickoff: '18:30', saleDate: '2026-07-30T10:00:00+09:00' },
    { matchday: 3, isHome: false, opponentId: 'cerezo', date: '2026-08-22', kickoff: '19:00' },
    { matchday: 4, isHome: true, opponentId: 'kashiwa', date: '2026-08-29', kickoff: '18:30', saleDate: '2026-08-05T10:00:00+09:00' },
    { matchday: 5, isHome: true, opponentId: 'fctokyo', date: '2026-09-02', kickoff: '19:00', saleDate: '2026-08-09T10:00:00+09:00' },
    { matchday: 6, isHome: false, opponentId: 'kawasaki', venueOverride: 'MUFGスタジアム', date: '2026-09-06', kickoff: '19:00' },
    { matchday: 7, isHome: true, opponentId: 'fukuoka', date: '2026-09-12', kickoff: '18:30', saleDate: '2026-08-13T10:00:00+09:00' },
    { matchday: 8, isHome: true, opponentId: 'chiba', date: '2026-09-19', kickoff: '18:30', saleDate: '2026-08-20T10:00:00+09:00' },
    { matchday: 9, isHome: false, opponentId: 'mito', date: '2026-10-11', kickoff: '15:00' },
    { matchday: 10, isHome: true, opponentId: 'gamba', date: '2026-10-17', saleDate: '2026-09-17T10:00:00+09:00' },
    { matchday: 11, isHome: true, opponentId: 'machida', date: '2026-10-21', kickoff: '19:00', saleDate: '2026-09-20T10:00:00+09:00' },
    { matchday: 12, isHome: false, opponentId: 'hiroshima', date: '2026-10-24', kickoff: '14:00' },
    { matchday: 13, isHome: false, opponentId: 'kyoto', date: '2026-10-31' },
  ],
  // 京都サンガF.C.(8〜10月分)
  // ホームゲームの発売日は公式発表(販売スケジュール)より実データを反映
  // 出典: https://www.sanga-fc.jp/ticket/schedule 取得日時: 2026-07-18
  kyoto: [
    { matchday: 1, isHome: false, opponentId: 'nagasaki', date: '2026-08-09', kickoff: '19:00' },
    { matchday: 2, isHome: false, opponentId: 'kawasaki', date: '2026-08-15', kickoff: '19:00' },
    { matchday: 3, isHome: true, opponentId: 'mito', date: '2026-08-22', kickoff: '19:00', saleDate: '2026-08-01T12:00:00+09:00' },
    { matchday: 4, isHome: true, opponentId: 'fukuoka', date: '2026-08-29', kickoff: '19:00', saleDate: '2026-08-08T12:00:00+09:00' },
    { matchday: 5, isHome: false, opponentId: 'ynmarinos', date: '2026-09-02', kickoff: '19:00' },
    { matchday: 6, isHome: false, opponentId: 'fctokyo', date: '2026-09-06', kickoff: '19:30' },
    { matchday: 7, isHome: true, opponentId: 'kashiwa', date: '2026-09-12' },
    { matchday: 8, isHome: false, opponentId: 'okayama', date: '2026-09-19', kickoff: '19:00' },
    { matchday: 9, isHome: true, opponentId: 'machida', date: '2026-10-10', saleDate: '2026-09-19T12:00:00+09:00' },
    { matchday: 10, isHome: false, opponentId: 'hiroshima', date: '2026-10-17', kickoff: '14:00' },
    { matchday: 11, isHome: true, opponentId: 'kashima', date: '2026-10-21', kickoff: '19:00', saleDate: '2026-10-03T12:00:00+09:00' },
    { matchday: 12, isHome: false, opponentId: 'gamba', date: '2026-10-24', kickoff: '16:00' },
    { matchday: 13, isHome: true, opponentId: 'shimizu', date: '2026-10-31', saleDate: '2026-10-10T12:00:00+09:00' },
  ],
  // ヴィッセル神戸(8〜10月分)
  // ホームゲームの発売日は公式発表(チケット発売スケジュール)より実データを反映
  // 出典: https://www.vissel-kobe.co.jp/ticket/schedule/ 取得日時: 2026-07-20
  kobe: [
    { matchday: 1, isHome: false, opponentId: 'fukuoka', date: '2026-08-08', kickoff: '19:00' },
    { matchday: 2, isHome: true, opponentId: 'fctokyo', date: '2026-08-15', kickoff: '19:00', saleDate: '2026-07-22T10:00:00+09:00' },
    { matchday: 3, isHome: false, opponentId: 'ynmarinos', date: '2026-08-22', kickoff: '19:30' },
    { matchday: 4, isHome: true, opponentId: 'cerezo', date: '2026-08-29', kickoff: '19:00', saleDate: '2026-07-22T10:00:00+09:00' },
    { matchday: 5, isHome: false, opponentId: 'verdy', date: '2026-09-02', kickoff: '19:00' },
    { matchday: 6, isHome: true, opponentId: 'nagasaki', date: '2026-09-06', kickoff: '19:00', saleDate: '2026-07-29T10:00:00+09:00' },
    { matchday: 7, isHome: true, opponentId: 'kashima', date: '2026-09-12' },
    { matchday: 8, isHome: false, opponentId: 'gamba', date: '2026-09-20', kickoff: '17:00' },
    { matchday: 9, isHome: false, opponentId: 'kashiwa', date: '2026-10-09', kickoff: '19:00' },
    { matchday: 10, isHome: false, opponentId: 'okayama', date: '2026-10-17' },
    { matchday: 11, isHome: false, opponentId: 'kawasaki', date: '2026-10-21', kickoff: '19:00' },
    { matchday: 12, isHome: true, opponentId: 'machida', date: '2026-10-24' },
    { matchday: 13, isHome: true, opponentId: 'nagoya', date: '2026-10-31' },
  ],
  // ジェフユナイテッド千葉(8〜10月分)
  // ホームゲームの発売日は公式発表より実データを反映(一般販売の開始時刻は
  // 記事に明記が無かったため、他クラブと同じ10:00と仮定して反映)
  // 出典: https://jefunited.co.jp/news/detail/5285 取得日時: 2026-07-20
  chiba: [
    { matchday: 1, isHome: false, opponentId: 'hiroshima', date: '2026-08-08', kickoff: '19:15' },
    { matchday: 2, isHome: true, opponentId: 'machida', date: '2026-08-15', kickoff: '19:00', saleDate: '2026-08-03T10:00:00+09:00' },
    { matchday: 3, isHome: false, opponentId: 'fctokyo', venueOverride: 'MUFGスタジアム', date: '2026-08-21', kickoff: '19:30' },
    { matchday: 4, isHome: false, opponentId: 'kawasaki', date: '2026-08-29', kickoff: '19:00' },
    { matchday: 5, isHome: true, opponentId: 'okayama', date: '2026-09-02', kickoff: '19:00', saleDate: '2026-08-10T10:00:00+09:00' },
    { matchday: 6, isHome: true, opponentId: 'gamba', date: '2026-09-06', kickoff: '18:00' },
    { matchday: 7, isHome: false, opponentId: 'verdy', date: '2026-09-13', kickoff: '18:00' },
    { matchday: 8, isHome: false, opponentId: 'shimizu', date: '2026-09-19', kickoff: '18:30' },
    { matchday: 9, isHome: true, opponentId: 'nagasaki', date: '2026-10-11', kickoff: '14:00', saleDate: '2026-09-14T10:00:00+09:00' },
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

// ---- 遠征記録(スタンプラリー)の対象スタジアム一覧 ------------------------
// 各クラブの本拠地に加え、venueOverride(国立競技場等の特別会場)で
// 実際に試合が行われるスタジアムも「制覇」対象に含める。
// 1チームの試合が複数のスタジアムに分かれるケース(本拠地+特別会場)があるため、
// チーム単位ではなく実際の開催スタジアム名で重複排除する。
// venueOverrideは表記ゆれ(MUFG国立/MUFGスタジアム等)があるためresolveVenueNameで
// 正規化してから重複排除する。
export const ALL_STADIUM_NAMES = Array.from(
  new Set([
    ...TEAMS.map((t) => t.stadium),
    ...Object.values(REAL_SCHEDULES)
      .flat()
      .map((e) => e.venueOverride)
      .filter(Boolean)
      .map(resolveVenueName),
  ])
);
