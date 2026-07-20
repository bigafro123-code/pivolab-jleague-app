// ---- 特別会場(venueOverride)の名寄せマスタ --------------------------------
// カップ戦決勝などMUFG冠名の試合はいずれも国立競技場(東京)で開催されるが、
// データ出典によって「国立競技場」「MUFG国立」「MUFGスタジアム」と表記が
// 分かれている。実体は同一の会場のため、表示名・座標ともに正規化する。
export const VENUE_ALIASES = {
  MUFG国立: '国立競技場',
  MUFGスタジアム: '国立競技場',
};

export function resolveVenueName(name) {
  return VENUE_ALIASES[name] || name;
}

// 特別会場の座標(移動距離の概算・位置情報チェックインの判定に使用)
export const VENUE_COORDS = {
  国立競技場: { lat: 35.6779, lng: 139.7147 },
};
