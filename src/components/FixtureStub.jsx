import { useState, useEffect } from 'react';
import { Calendar, MapPin, ExternalLink, CalendarPlus, Check, Users, LocateFixed } from 'lucide-react';
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
import { CHECK_IN_THRESHOLD_KM, isGeolocationSupported, getCurrentCoords, distanceToStadiumKm } from '../utils/geo';
import TravelPromo from './TravelPromo';

export default function FixtureStub({ fixture, team }) {
  const { opponent, isHome, host, matchDate, kickoff, stadium, stadiumCoords, saleDate, status } = fixture;
  const onSale = status === 'onsale';
  const isPast = matchDate < TODAY_DATE_ONLY;
  const isToday = matchDate.getTime() === TODAY_DATE_ONLY.getTime();
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

  // 'idle' | 'checking' | 'far' | 'error'
  const [checkInStatus, setCheckInStatus] = useState('idle');
  const [checkInMessage, setCheckInMessage] = useState('');

  const handleLocationCheckIn = async () => {
    if (!isGeolocationSupported()) {
      setCheckInStatus('error');
      setCheckInMessage('この端末では位置情報を利用できません');
      return;
    }
    setCheckInStatus('checking');
    setCheckInMessage('');
    try {
      const userCoords = await getCurrentCoords();
      const distanceKm = distanceToStadiumKm(userCoords, stadiumCoords || host.coords);
      if (distanceKm <= CHECK_IN_THRESHOLD_KM) {
        if (!isVisited) handleToggleVisited();
        setCheckInStatus('idle');
        setCheckInMessage('');
      } else {
        setCheckInStatus('far');
        setCheckInMessage(`スタジアムから約${distanceKm.toFixed(1)}km離れています`);
      }
    } catch (e) {
      setCheckInStatus('error');
      setCheckInMessage(
        e && e.code === 1 ? '位置情報の利用が許可されていません' : '位置情報を取得できませんでした'
      );
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
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
                }}
              >
                終了
              </span>
            )}
            {isToday && (
              <span
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: 1,
                  padding: '2px 7px',
                  borderRadius: 4,
                  background: '#fff4d6',
                  color: '#a86b00',
                }}
              >
                本日開催
              </span>
            )}
            {!isPast && isFirebaseConfigured && (
              <button
                onClick={handleToggleGoing}
                title={isGoing ? '行く予定を取り消す' : '行く予定にする'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: goingCount ? '3px 8px 3px 6px' : '3px 6px',
                  borderRadius: 999,
                  cursor: 'pointer',
                  border: isGoing ? 'none' : '1px solid #d2d2d7',
                  background: isGoing ? '#0071e3' : 'transparent',
                  color: isGoing ? '#ffffff' : '#6e6e73',
                }}
              >
                <Users size={11} />
                {goingCount !== null && goingCount > 0 && (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700 }}>
                    {goingCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {(isPast || isToday) && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={handleToggleVisited}
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
                  border: isVisited ? 'none' : '1px solid #d2d2d7',
                  background: isVisited ? '#34c759' : 'transparent',
                  color: isVisited ? '#ffffff' : '#6e6e73',
                }}
              >
                {isVisited ? '✓ 行った!' : 'この試合に行った?'}
              </button>

              {isToday && !isVisited && (
                <button
                  onClick={handleLocationCheckIn}
                  disabled={checkInStatus === 'checking'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 10px',
                    borderRadius: 999,
                    cursor: checkInStatus === 'checking' ? 'default' : 'pointer',
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    border: '1px solid #0071e3',
                    background: 'transparent',
                    color: '#0071e3',
                    opacity: checkInStatus === 'checking' ? 0.6 : 1,
                  }}
                >
                  <LocateFixed size={12} />
                  {checkInStatus === 'checking' ? '現在地を確認中…' : '現在地からチェックイン'}
                </button>
              )}
            </div>
            {checkInMessage && (
              <div style={{ fontSize: 10, color: '#86868b', marginTop: 6 }}>※ {checkInMessage}</div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', margin: '10px 0 12px', fontSize: 12.5, color: '#48484d' }}>
          <Calendar size={12} color="#6e6e73" style={{ flexShrink: 0 }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: '#1d1d1f' }}>
            {formatDate(matchDate)}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#6e6e73' }}>{kickoff}</span>
          <span style={{ color: '#c7c7cc' }}>・</span>
          <MapPin size={12} color="#6e6e73" style={{ flexShrink: 0 }} />
          <span style={{ color: '#6e6e73' }}>{stadium}</span>
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
                  padding: '6px 10px',
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
                  padding: '6px 10px',
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
                    padding: '6px 10px',
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
                padding: '6px 10px',
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
