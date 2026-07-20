import { buildAgodaAffiliateUrl } from '../data/teams';
import { formatDate } from '../utils/date';
import { computeTravelEstimate, formatHours, formatYen } from '../utils/travel';

export default function TravelPromo({ fixture, team }) {
  const { origin, estimate } = computeTravelEstimate(team, fixture);
  const dateLabel = formatDate(fixture.matchDate);

  // A8.net経由のAgodaアフィリエイトリンク。行き先の都市を、対戦相手のスタジアム
  // 所在地(AGODA_CITY_SLUGS)に応じて動的に切り替える。都市名スラッグはASCIIの
  // ため、楽天の旧検索窓で起きた文字化け(EUC-JP問題)は発生しない。
  const agodaAffiliateUrl = buildAgodaAffiliateUrl(fixture.host.id);

  // Yahoo!路線情報は from=/to= パラメータで出発駅・到着駅を指定した検索結果へ
  // 直接リンクできる(公式ドキュメントはないが、長年安定して使われている形式)。
  // shin=1(新幹線)・ex=1(特急)を明示的に有効化し、遠距離移動でも新幹線ルートが
  // 確実に検討対象に入るようにしている。
  const departStation = origin.label || team.stadium;
  const arriveStation = fixture.host.travelOrigin ? fixture.host.travelOrigin.label : fixture.host.stadium;
  const transitSearchUrl = `https://transit.yahoo.co.jp/search/result?shin=1&ex=1&from=${encodeURIComponent(departStation)}&to=${encodeURIComponent(arriveStation)}`;

  const links = [
    {
      label: `${fixture.host.travelOrigin ? fixture.host.travelOrigin.label : fixture.host.short}周辺のホテルを探す(Agoda)`,
      url: agodaAffiliateUrl,
    },
    {
      label: `${departStation}→${arriveStation}の乗換・時刻を調べる`,
      // 正式なアフィリエイト提携は無いため報酬は発生しないが、Yahoo!路線情報の
      // 検索結果ページへ出発駅・到着駅を指定して直接遷移できる
      url: transitSearchUrl,
    },
  ];

  return (
    <div
      style={{
        marginTop: 10,
        borderRadius: 10,
        border: '1px solid #d2d2d7',
        background: '#f5f5f7',
        padding: 12,
      }}
    >
      <div style={{ fontSize: 11, color: '#6e6e73', marginBottom: 8 }}>
        {origin.label} から約 {estimate.distanceKm}km{estimate.train.isLocalHop ? '(近隣)' : '(概算)'}
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{ borderRadius: 8, background: '#ffffff', border: '1px solid #d2d2d7', padding: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#1d1d1f' }}>
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
                  background: '#34c759',
                  borderRadius: 4,
                  padding: '2px 6px',
                }}
              >
                正規運賃
              </span>
            )}
          </div>
          {estimate.train.isOfficial ? (
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#6e6e73', lineHeight: 1.7 }}>
              片道 約{formatHours(estimate.train.oneWayHours)}
              <br />
              <span style={{ color: '#0071e3', fontWeight: 700 }}>往復 {formatYen(estimate.train.total)}</span>
            </div>
          ) : estimate.train.isLocalHop ? (
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#6e6e73', lineHeight: 1.7 }}>
              片道 約{formatHours(estimate.train.oneWayHours)}
              <br />
              <span style={{ color: '#0071e3', fontWeight: 700 }}>合計 {formatYen(estimate.train.total)}</span>
            </div>
          ) : (
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#6e6e73', lineHeight: 1.7 }}>
              片道 約{formatHours(estimate.train.oneWayHours)}
              <br />
              新幹線 {formatYen(estimate.train.shinkansen)}
              <br />
              在来線等 {formatYen(estimate.train.local)}
              <br />
              <span style={{ color: '#0071e3', fontWeight: 700 }}>合計 {formatYen(estimate.train.total)}</span>
            </div>
          )}
          {estimate.train.isOfficial && (
            <div style={{ fontSize: 10, color: '#86868b', marginTop: 6, lineHeight: 1.5 }}>※ {estimate.train.note}</div>
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
                background: '#0071e3',
                borderRadius: 4,
                padding: '1px 6px',
              }}
            >
              PR
            </span>
            <span style={{ fontSize: 11, color: '#6e6e73' }}>{fixture.stadium}への遠征を計画する</span>
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
                  border: '1px solid #d2d2d7',
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: '#1d1d1f',
                }}
              >
                {l.label}
              </a>
            ))}
          </div>
          {/* A8.net計測用ピクセル(Agodaリンクの表示計測) */}
          <img
            border="0"
            width="1"
            height="1"
            src="https://www15.a8.net/0.gif?a8mat=4B83CZ+2EXB3M+4X1W+BW8O2"
            alt=""
            style={{ position: 'absolute', width: 1, height: 1 }}
          />
        </>
      )}
      {!estimate.train.isOfficial && (
        <div style={{ fontSize: 10, color: '#86868b', marginTop: 8, lineHeight: 1.5 }}>
          {estimate.train.isLocalHop
            ? '※ 近距離のため新幹線を使わない在来線移動として概算しています。実際の経路・料金とは異なる場合があります。'
            : '※ 移動時間・費用は直線距離をもとにした概算です(実運賃2点で校正済み)。実際の経路・料金とは異なる場合があります。'}
        </div>
      )}
    </div>
  );
}
