import React, { useState, useMemo } from 'react';
import { Ticket, Star, MessageCircle } from 'lucide-react';
import { TEAMS } from './data/teams';
import { REAL_SCHEDULES } from './data/schedules';
import { TODAY_DATE_ONLY, formatDate } from './utils/date';
import { getStoredDefaultTeamId, setStoredDefaultTeamId } from './utils/storage';
import { buildFixturesFromRealSchedule, buildFixtures } from './utils/fixtures';
import BannerAd from './components/BannerAd';
import FixtureStub from './components/FixtureStub';
import TravelRecords from './components/TravelRecords';

export default function JLeagueTicketApp() {
  const [view, setView] = useState('fixtures'); // 'fixtures' | 'records'
  const [selectedId, setSelectedId] = useState(() => {
    const stored = getStoredDefaultTeamId();
    return stored && TEAMS.some((t) => t.id === stored) ? stored : TEAMS[0].id;
  });
  const [defaultTeamId, setDefaultTeamId] = useState(() => getStoredDefaultTeamId());
  const [defaultSaved, setDefaultSaved] = useState(false);
  const selectedTeam = TEAMS.find((t) => t.id === selectedId);
  const isDefaultTeam = defaultTeamId === selectedId;

  const handleSetDefault = () => {
    setStoredDefaultTeamId(selectedId);
    setDefaultTeamId(selectedId);
    setDefaultSaved(true);
    setTimeout(() => setDefaultSaved(false), 2000);
  };

  const fixtures = useMemo(() => {
    if (REAL_SCHEDULES[selectedTeam.id]) return buildFixturesFromRealSchedule(selectedTeam, REAL_SCHEDULES[selectedTeam.id]);
    return buildFixtures(selectedTeam);
  }, [selectedId]);

  const [homeAwayFilter, setHomeAwayFilter] = useState('all'); // 'all' | 'home' | 'away'
  const [showPastMatches, setShowPastMatches] = useState(false);

  const visibleFixtures = useMemo(() => {
    return fixtures.filter((f) => {
      if (homeAwayFilter === 'home' && !f.isHome) return false;
      if (homeAwayFilter === 'away' && f.isHome) return false;
      if (!showPastMatches && f.matchDate < TODAY_DATE_ONLY) return false;
      return true;
    });
  }, [fixtures, homeAwayFilter, showPastMatches]);

  const upcomingFixtures = fixtures.filter((f) => f.matchDate >= TODAY_DATE_ONLY);
  const pastMatchCount = fixtures.length - upcomingFixtures.length;
  const lastCoveredLabel =
    fixtures.length > 0 ? formatDate(fixtures[fixtures.length - 1].matchDate) : 'データ';

  return (
    <div style={{ fontFamily: "'Noto Sans JP', sans-serif", background: '#fbfbfd', minHeight: '100vh', color: '#1d1d1f' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Noto+Sans+JP:wght@400;500;700&family=JetBrains+Mono:wght@500;700&display=swap');
        * { box-sizing: border-box; }
        a:focus-visible, button:focus-visible { outline: 2px solid #0071e3; outline-offset: 2px; }
        summary::-webkit-details-marker { display: none; }
        details[open] > summary .travel-promo-chevron { transform: rotate(180deg); }
      `}</style>

      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {/* ヘッダー */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: '#ffffff',
            borderBottom: '1px solid #d2d2d7',
            padding: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Ticket size={18} color="#0071e3" />
              <span
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: 2,
                  color: '#6e6e73',
                  textTransform: 'uppercase',
                }}
              >
                Matchday Ticket Tracker
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <button
                onClick={() => setView(view === 'records' ? 'fixtures' : 'records')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#0071e3',
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  padding: 0,
                }}
              >
                🏟️ 遠征記録
              </button>
              <a
                href="https://forms.gle/C37UmeQzK3DCSeWv9"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  flexShrink: 0,
                  color: '#0071e3',
                  textDecoration: 'none',
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                }}
              >
                <MessageCircle size={14} />
                ご意見
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 36, borderRadius: 2, background: selectedTeam.color, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 22, lineHeight: 1.1 }}>
                {selectedTeam.name}
              </div>
            </div>
            {REAL_SCHEDULES[selectedTeam.id] && (
              <span
                style={{
                  flexShrink: 0,
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: '#1d1d1f',
                  border: '1px solid #d2d2d7',
                  borderRadius: 4,
                  padding: '3px 6px',
                  alignSelf: 'flex-start',
                  textAlign: 'right',
                  lineHeight: 1.3,
                }}
              >
                対戦カードは実データ
                <br />
                発売日は判明分のみ反映
              </span>
            )}
          </div>

          <button
            onClick={handleSetDefault}
            disabled={isDefaultTeam}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 10,
              padding: '4px 0',
              background: 'transparent',
              border: 'none',
              cursor: isDefaultTeam ? 'default' : 'pointer',
              fontFamily: "'Oswald', sans-serif",
              fontSize: 11,
              letterSpacing: 0.5,
              color: isDefaultTeam ? '#ffcc00' : '#86868b',
            }}
          >
            <Star size={13} fill={isDefaultTeam ? '#ffcc00' : 'none'} />
            {defaultSaved
              ? '初期表示に設定しました'
              : isDefaultTeam
              ? 'このチームを初期表示中'
              : 'このチームを初期表示に設定'}
          </button>

          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginTop: 14, paddingBottom: 4 }}>
            {TEAMS.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                style={{
                  flexShrink: 0,
                  padding: '6px 12px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'Oswald', sans-serif",
                  letterSpacing: 0.5,
                  cursor: 'pointer',
                  border: t.id === selectedId ? `2px solid ${t.color}` : '1px solid #d2d2d7',
                  background: t.id === selectedId ? 'rgba(0,113,227,0.08)' : 'transparent',
                  color: t.id === selectedId ? '#1d1d1f' : '#6e6e73',
                  whiteSpace: 'nowrap',
                }}
              >
                {t.short}
              </button>
            ))}
          </div>
        </div>

        {view === 'records' ? (
          <TravelRecords onBack={() => setView('fixtures')} />
        ) : (
          <>
        {/* 絞り込み */}
        <div style={{ padding: '0 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { key: 'all', label: 'すべて' },
              { key: 'home', label: 'ホーム' },
              { key: 'away', label: 'アウェイ' },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setHomeAwayFilter(opt.key)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'Oswald', sans-serif",
                  cursor: 'pointer',
                  border: homeAwayFilter === opt.key ? '1px solid #0071e3' : '1px solid #d2d2d7',
                  background: homeAwayFilter === opt.key ? '#0071e3' : 'transparent',
                  color: homeAwayFilter === opt.key ? '#ffffff' : '#6e6e73',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {pastMatchCount > 0 && (
            <button
              onClick={() => setShowPastMatches((v) => !v)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: 11,
                color: '#6e6e73',
                textDecoration: 'underline',
              }}
            >
              {showPastMatches ? '終了した試合を隠す' : `終了した試合を表示(${pastMatchCount})`}
            </button>
          )}
        </div>

        {upcomingFixtures.length > 0 && (
          <div style={{ padding: '0 16px 12px', fontSize: 11, color: '#86868b' }}>
            {lastCoveredLabel}の試合まで掲載しています。それ以降は順次追加予定です。
          </div>
        )}

        {/* 試合一覧 */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {visibleFixtures.length === 0 && (
            <div style={{ textAlign: 'center', color: '#6e6e73', fontSize: 13, padding: '32px 0', lineHeight: 1.7 }}>
              {upcomingFixtures.length === 0 ? (
                <>
                  現在掲載しているデータは{lastCoveredLabel}分までです。
                  <br />
                  今後の対戦カードは順次追加予定です。
                </>
              ) : (
                <>この条件に当てはまる試合はありません。</>
              )}
            </div>
          )}
          {visibleFixtures.map((f, i) => (
            <React.Fragment key={f.id}>
              <FixtureStub fixture={f} team={selectedTeam} />
              {(i + 1) % 3 === 0 && i !== visibleFixtures.length - 1 && <BannerAd />}
            </React.Fragment>
          ))}
        </div>
          </>
        )}

        <div style={{ padding: '8px 16px 32px', fontSize: 11, color: '#86868b', textAlign: 'center', lineHeight: 1.6 }}>
          ※ 対戦カードは全クラブ公式発表にもとづく実データです。チケット発売日は判明分のみ反映しており、未発表の試合は「発売日未定」と表示しています。運賃・移動時間は実データが確認できた区間以外、概算である旨を明記しています。実際のご購入・観戦計画にあたっては、必ず各クラブの公式発表をあわせてご確認ください。
          <br />
          ※「リマインダー」ボタンはカレンダーイベント(.ics)をダウンロードします。iPhoneのReminders(リマインダー)アプリへの直接登録はWebアプリの技術的制約上できないため、ネイティブアプリ化時に対応予定です。
          <div style={{ marginTop: 12 }}>
            <a href="/about.html" style={{ color: '#6e6e73' }}>このサイトについて</a>
            <span style={{ margin: '0 8px' }}>|</span>
            <a href="/faq.html" style={{ color: '#6e6e73' }}>よくあるご質問</a>
            <span style={{ margin: '0 8px' }}>|</span>
            <a href="/privacy.html" style={{ color: '#6e6e73' }}>プライバシーポリシー</a>
            <span style={{ margin: '0 8px' }}>|</span>
            <a href="/terms.html" style={{ color: '#6e6e73' }}>利用規約</a>
          </div>
        </div>
      </div>
    </div>
  );
}
