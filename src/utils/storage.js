// ---- 初期表示チームの設定(端末に保存) -----------------------------------
// localStorageが使えない環境(プレビュー等)でも落ちないようtry/catchで安全に扱う。
const DEFAULT_TEAM_STORAGE_KEY = 'pivolab-jleague-default-team';

export function getStoredDefaultTeamId() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage.getItem(DEFAULT_TEAM_STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

export function setStoredDefaultTeamId(id) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(DEFAULT_TEAM_STORAGE_KEY, id);
  } catch (e) {
    // 保存できなくても致命的ではないので無視する
  }
}

// ---- 遠征記録(スタンプラリー)の保存/読込 ---------------------------------
// 「行った試合」を端末内(localStorage)に記録する。サーバーには送信しない。
const VISITED_LOG_STORAGE_KEY = 'pivolab-jleague-visited-log';

export function getVisitedLog() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(VISITED_LOG_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function setVisitedLog(log) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(VISITED_LOG_STORAGE_KEY, JSON.stringify(log));
  } catch (e) {
    // 保存できなくても致命的ではないので無視する
  }
}

export function makeVisitedKey(team, fixture) {
  const dateStr = fixture.matchDate.toISOString().slice(0, 10);
  return `${team.id}_${fixture.opponent.id}_${dateStr}`;
}

// ---- みんなの行く予定(Firestoreでの匿名集計) ------------------------------
// 同じ試合はホーム/アウェイ両クラブの視点で別々のfixtureとして存在するため、
// チームIDをソートした組み合わせ+日付で「試合そのもの」を一意に特定するキーを作る。
// これによりどちらのクラブページから見ても同じ集計を共有できる。
export function makeGlobalMatchKey(team, fixture) {
  const dateStr = fixture.matchDate.toISOString().slice(0, 10);
  const ids = [team.id, fixture.opponent.id].sort();
  return `${ids[0]}_${ids[1]}_${dateStr}`;
}

// 「行く予定にした」試合を端末内(localStorage)に記録する。
// ログイン機能が無いため、集計自体はFirestore側のcountで持つが、
// この端末で既に押したかどうかの判定はローカルに保存して代用する。
const GOING_LOG_STORAGE_KEY = 'pivolab-jleague-going-log';

export function getGoingLog() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(GOING_LOG_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function setGoingLog(log) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(GOING_LOG_STORAGE_KEY, JSON.stringify(log));
  } catch (e) {
    // 保存できなくても致命的ではないので無視する
  }
}
