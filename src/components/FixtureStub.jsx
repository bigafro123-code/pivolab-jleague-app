import { useState, useEffect } from 'react';
import { Calendar, MapPin, ExternalLink, CalendarPlus, Check, Users } from 'lucide-react';
import { doc, onSnapshot, setDoc, increment } from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from '../firebase';
import { TODAY_DATE_ONLY, formatDate } from '../utils/date';
import {
  getVisitedLog,
  setVisitedLog,
  makeVisitedKey,
  getGoingLog,
  setGoingLog,
  makeGlobalMatchKey,
} from '../utils/storage';
import { downloadICS } from '../utils/ics';
import TravelPromo from './TravelPromo';

export default function FixtureStub({ fixture, team }) {
  const { opponent, isHome, host, matchDate, kickoff, stadium, saleDate, status } = fixture;
  const onSale = status === 'onsale';
  const isPast = matchDate < TODAY_DATE_ONLY;
  const [added, setAdded] = useState(false);
  const visitedKey = makeVisitedKey(team, fixture);
  const [isVisited, setIsVisited] = useState(() => getVisitedLog().some((r) => r.key === visitedKey));

  const handleAddToCalendar = () => {
    downloadICS(fixture, team);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleToggleVisited = () => {
    const log = getVisitedLog();
    if (isVisited) {
      setVisitedLog(log.filter((r) => r.key !== visitedKey));
      setIsVisited(false);
    } else {
      const record = {
        key: visitedKey,
        teamId: team.id,
        stadiumName: stadium,
        opponentName: opponent.name,
        isHome,
        date: matchDate.toISOString().slice(0, 10),
      };
      setVisitedLog([...log, record]);
      setIsVisited(true);
    }
  };

  const globalMatchKey = makeGlobalMatchKey(team, fixture);
  const [goingCount, setGoingCount] = useState(null); // null = 未取得/未設定
  const [isGoing, setIsGoing] = useState(() => getGoingLog().includes(globalMatchKey));

  useEffect(() => {
    if (isPast || !isFirebaseConfigured) return;
    const db = getDb();
    if (!db) return;
    const ref = doc(db, 'attendance', globalMatchKey);
    const unsubscribe = onSnapshot(
      ref,
      (snap) => setGoingCount(snap.exists() ? snap.data().count || 0 : 0),
      () => setGoingCount(null)
    );
    return unsubscribe;
  }, [globalMatchKey, isPast]);

  const handleToggleGoing = async () => {
    const db = getDb();
    if (!db) return;
    const log = getGoingLog();
    const ref = doc(db, 'attendance', globalMatchKey);
    try {
      if (isGoing) {
        await setDoc(ref, { count: increment(-1) }, { merge: true });
        setGoingLog(log.filter((k) => k !== globalMatchKey));
        setIsGoing(false);
      } else {
        await setDoc(ref, { count: increment(1) }, { merge: true });
        setGoingLog([...log, globalMatchKey]);
        setIsGoing(true);
      }
    } catch (e) {
      // ネットワークエラー等は静かに諦める(致命的ではないため)
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        borderRadius: 14,
        overflow: 'hidden',
        background: '#ffffff',
        border: '1px solid #d2d2d7',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        opacity: isPast && !isVisited ? 0.55 : 1,
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
              background: isHome ? team.color : '#e8e8ed',
              color: isHome ? '#0F1F16' : '#1d1d1f',
            }}
          >
            {isHome ? 'HOME' : 'AWAY'}
          </span>
          <span style={{ fontSize: 12, color: '#6e6e73' }}>vs {opponent.name}</span>
          {isPast && (
            <span
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: 1,
                padding: '2px 7px',
                borderRadius: 4,
                background: '#f5f5f7',
                color: '#86868b',
                marginLeft: 'auto',
              }}
            >
              終了
            </span>
          )}
        </div>

        {isPast && (
          <button
            onClick={handleToggleVisited}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 10,
              padding: '5px 10px',
              borderRadius: 999,
              cursor: 'pointer',
              fontFamily: "'Oswald', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.5,
              border: isVisited ? 'none' : '1px solid #d2d2d7',
              background: isVisited ? '#34c759' : 'transparent',
              color: isVisited ? '#ffffff' : '#6e6e73',
            }}
          >
            {isVisited ? '✓ 行った!' : 'この試合に行った?'}
          </button>
        )}

        {!isPast && isFirebaseConfigured && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <button
              onClick={handleToggleGoing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 10px',
                borderRadius: 999,
                cursor: 'pointer',
                fontFamily: "'Oswald', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.5,
                border: isGoing ? 'none' : '1px solid #d2d2d7',
                background: isGoing ? '#0071e3' : 'transparent',
                color: isGoing ? '#ffffff' : '#6e6e73',
              }}
            >
              <Users size={12} />
              {isGoing ? '行く予定にした!' : '行く予定にする'}
            </button>
            {goingCount !== null && goingCount > 0 && (
              <span style={{ fontSize: 11, color: '#6e6e73' }}>
                🙋 {goingCount}人が行く予定
              </span>
            )}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <Calendar size={14} color="#0071e3" style={{ flexShrink: 0 }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 700 }}>
            {formatDate(matchDate)}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#1d1d1f' }}>
            {kickoff} キックオフ
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontSize: 12, color: '#6e6e73' }}>
          <MapPin size={13} style={{ flexShrink: 0 }} />
          <span>{stadium}</span>
        </div>

        <div style={{ borderTop: '1px dashed #d2d2d7', paddingTop: 12 }}>
          {status === 'unknown' ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#86868b', marginBottom: 2 }}>チケット発売日</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: '#6e6e73' }}>
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
                    border: '2px dashed #86868b',
                    color: '#86868b',
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
                  background: '#f5f5f7',
                  color: '#6e6e73',
                }}
              >
                {host.name}の発表を確認 <ExternalLink size={14} />
              </a>
              <div style={{ fontSize: 10, color: '#86868b', marginTop: 8, lineHeight: 1.5 }}>
                ※ {fixture.note || `${host.name}側の発売告知がまだ出ていません。監視を継続し、告知が出次第自動的に反映します。`}
              </div>
            </>
          ) : status === 'onsale' && !saleDate ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#86868b', marginBottom: 2 }}>
                    チケット発売日({host.ticketSystem.name})
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: '#6e6e73' }}>
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
                    background: '#34c759',
                    color: '#ffffff',
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
                  background: '#34c759',
                  color: '#ffffff',
                }}
              >
                {host.ticketSystem.name}で購入 <ExternalLink size={14} />
              </a>
              {fixture.note && (
                <div style={{ fontSize: 10, color: '#86868b', marginTop: 8, lineHeight: 1.5 }}>※ {fixture.note}</div>
              )}
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#86868b', marginBottom: 2 }}>
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
                    background: onSale ? '#34c759' : 'transparent',
                    border: onSale ? 'none' : '2px solid #0071e3',
                    color: onSale ? '#ffffff' : '#0071e3',
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
                    background: onSale ? '#34c759' : '#f5f5f7',
                    color: onSale ? '#ffffff' : '#6e6e73',
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
                border: '1px solid #d2d2d7',
                cursor: 'pointer',
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: 0.5,
                background: added ? '#e8f8ec' : 'transparent',
                color: added ? '#1a7431' : '#1d1d1f',
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
          background: '#f5f5f7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: 0, height: '100%', borderLeft: '2px dashed #d2d2d7' }} />
        <div style={{ position: 'absolute', top: -8, left: -8, width: 16, height: 16, borderRadius: '50%', background: '#fbfbfd' }} />
        <div style={{ position: 'absolute', bottom: -8, left: -8, width: 16, height: 16, borderRadius: '50%', background: '#fbfbfd' }} />
        <span
          style={{
            writingMode: 'vertical-rl',
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: 2,
            color: '#86868b',
          }}
        >
          J1 LEAGUE
        </span>
      </div>
    </div>
  );
}
