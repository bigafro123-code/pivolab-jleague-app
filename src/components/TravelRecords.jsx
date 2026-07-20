import { useState } from 'react';
import { getVisitedLog, setVisitedLog } from '../utils/storage';
import { ALL_STADIUM_NAMES } from '../data/schedules';

// ---- マイ遠征記録(スタンプラリー) ----------------------------------------
export default function TravelRecords({ onBack }) {
  const [log, setLog] = useState(() => getVisitedLog());

  const visitedStadiumNames = new Set(log.map((r) => r.stadiumName));
  const awayCount = log.filter((r) => !r.isHome).length;

  const handleRemove = (key) => {
    const newLog = log.filter((r) => r.key !== key);
    setVisitedLog(newLog);
    setLog(newLog);
  };

  const sortedLog = [...log].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div style={{ padding: 16 }}>
      <button
        onClick={onBack}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#0071e3',
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 16,
          padding: 0,
        }}
      >
        ← 試合一覧に戻る
      </button>

      <h2
        style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 4,
          color: '#1d1d1f',
        }}
      >
        マイ遠征記録
      </h2>
      <p style={{ fontSize: 12, color: '#6e6e73', marginBottom: 20 }}>
        「行った!」を押した試合が、この端末にだけ記録されます(他の人には見えません)。
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <div style={{ flex: 1, borderRadius: 12, border: '1px solid #d2d2d7', background: '#ffffff', padding: 14, textAlign: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 700, color: '#0071e3' }}>
            {visitedStadiumNames.size}
            <span style={{ fontSize: 14, color: '#86868b' }}>/{ALL_STADIUM_NAMES.length}</span>
          </div>
          <div style={{ fontSize: 11, color: '#6e6e73', marginTop: 2 }}>スタジアム制覇</div>
        </div>
        <div style={{ flex: 1, borderRadius: 12, border: '1px solid #d2d2d7', background: '#ffffff', padding: 14, textAlign: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 700, color: '#1d1d1f' }}>
            {awayCount}
          </div>
          <div style={{ fontSize: 11, color: '#6e6e73', marginTop: 2 }}>アウェイ遠征回数</div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 24,
        }}
      >
        {ALL_STADIUM_NAMES.map((name) => {
          const visited = visitedStadiumNames.has(name);
          return (
            <div
              key={name}
              style={{
                borderRadius: 10,
                border: visited ? 'none' : '1px solid #d2d2d7',
                background: visited ? '#0071e3' : '#f5f5f7',
                padding: '8px 10px',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: visited ? '#ffffff' : '#86868b',
                }}
              >
                {name}
              </div>
            </div>
          );
        })}
      </div>

      <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1d1d1f', marginBottom: 10 }}>記録一覧</h3>
      {sortedLog.length === 0 ? (
        <p style={{ fontSize: 12, color: '#86868b' }}>まだ記録がありません。終了した試合のカードから「行った!」を押すと、ここに追加されます。</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sortedLog.map((r) => (
            <div
              key={r.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 10,
                border: '1px solid #d2d2d7',
                background: '#ffffff',
                padding: '10px 12px',
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1d1d1f' }}>
                  {r.date} ・ {r.isHome ? 'HOME' : 'AWAY'} vs {r.opponentName}
                </div>
                <div style={{ fontSize: 11, color: '#6e6e73' }}>{r.stadiumName}</div>
              </div>
              <button
                onClick={() => handleRemove(r.key)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#86868b', fontSize: 11 }}
              >
                削除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
