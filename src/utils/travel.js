import { REAL_TRAIN_FARES } from '../data/travelFares';

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

export function haversineKm(a, b) {
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

export function formatHours(h) {
  const totalMin = Math.round(h * 60);
  const hh = Math.floor(totalMin / 60);
  const mm = totalMin % 60;
  return hh > 0 ? `${hh}時間${mm}分` : `${mm}分`;
}

export function formatYen(n) {
  return `¥${n.toLocaleString()}`;
}

export function estimateTravel(originCoords, destCoords) {
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

// チームと試合から、往復の運賃見積もり(実データ優先)を計算する共通関数
export function computeTravelEstimate(team, fixture) {
  const origin = team.travelOrigin || { label: team.stadium, coords: team.coords };
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
  return { origin, estimate };
}
