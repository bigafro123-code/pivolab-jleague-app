// ---- 位置情報チェックイン ------------------------------------------------
// アプリを開いている間(フォアグラウンド)だけ、現在地とスタジアムの距離を計算して
// チェックインを提案する。バックグラウンドでの自動検知(ジオフェンシング)は
// Web技術の制約上実現できない(特にiOS Safari)ため、ユーザーがボタンを押した
// タイミングで毎回位置情報を取得する方式にしている。
import { haversineKm } from './travel';

export const CHECK_IN_THRESHOLD_KM = 1;

export function isGeolocationSupported() {
  return typeof navigator !== 'undefined' && !!navigator.geolocation;
}

export function getCurrentCoords() {
  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) {
      reject(new Error('unsupported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

export function distanceToStadiumKm(userCoords, stadiumCoords) {
  return haversineKm(userCoords, stadiumCoords);
}
