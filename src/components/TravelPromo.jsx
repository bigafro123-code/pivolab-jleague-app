import { ChevronDown } from 'lucide-react';
import { buildAgodaAffiliateUrl } from '../data/teams';
import { computeTravelEstimate, formatHours, formatYen } from '../utils/travel';

export default function TravelPromo({ fixture, team }) {
  const { origin, estimate } = computeTravelEstimate(team, fixture);

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

  const modeLabel = estimate.train.isLocalHop ? '🚃' : '🚄';
  const noteText = estimate.train.isOfficial
    ? estimate.train.note
    : estimate.train.isLocalHop
    ? '近距離のため新幹線を使わない在来線移動として概算しています。実際の経路・料金とは異なる場合があります。'
    : '移動時間・費用は直線距離をもとにした概算です(実運賃2点で校正済み)。実際の経路・料金とは異なる場合があります。';

  return (
    <details style={{ marginTop: 8 }}>
      <summary
        style={{
          listStyle: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          width: '100%',
          padding: '10px 12px',
          borderRadius: 10,
          background: '#f5f5f7',
          border: '1px solid #d2d2d7',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#48484d', minWidth: 0, flex: 1 }}>
          <span style={{ flexShrink: 0 }}>{modeLabel}</span>
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              minWidth: 0,
            }}
          >
            {origin.label}から 約{formatHours(estimate.train.oneWayHours)}
          </span>
          <span
            style={{
              flexShrink: 0,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              color: '#0071e3',
              whiteSpace: 'nowrap',
            }}
          >
            {formatYen(estimate.train.total)}(往復)
          </span>
        </div>
        <ChevronDown size={14} color="#86868b" style={{ flexShrink: 0 }} className="travel-promo-chevron" />
      </summary>

      <div
        style={{
          padding: '10px 12px 12px',
          marginTop: -1,
          borderRadius: '0 0 10px 10px',
          background: '#f5f5f7',
          border: '1px solid #d2d2d7',
          borderTop: 'none',
        }}
      >
        {estimate.train.isOfficial && (
          <span
            style={{
              display: 'inline-block',
              fontFamily: "'Oswald', sans-serif",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 0.5,
              color: '#0F1F16',
              background: '#34c759',
              borderRadius: 4,
              padding: '2px 6px',
              marginBottom: 6,
            }}
          >
            正規運賃
          </span>
        )}
        {!estimate.train.isOfficial && !estimate.train.isLocalHop && (
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: '#6e6e73', lineHeight: 1.7, marginBottom: 6 }}>
            新幹線 {formatYen(estimate.train.shinkansen)}・在来線等 {formatYen(estimate.train.local)}
          </div>
        )}
        <div style={{ fontSize: 10, color: '#86868b', lineHeight: 1.5 }}>※ {noteText}</div>

        {!estimate.train.isLocalHop && (
          <>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: 8,
                    borderRadius: 8,
                    border: '1px solid #d2d2d7',
                    background: '#ffffff',
                    fontSize: 11.5,
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
      </div>
    </details>
  );
}
