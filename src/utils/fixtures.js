import { TEAMS } from '../data/teams';
import { REAL_SCHEDULES } from '../data/schedules';
import { TODAY, TODAY_DATE_ONLY, addDays, hashOffset } from './date';

// team_id / 短縮名からクラブ情報を解決する
export function resolveClub(ref) {
  const byId = TEAMS.find((t) => t.id === ref);
  if (byId) return byId;
  const byShort = TEAMS.find((t) => t.short === ref);
  if (byShort) return byShort;
  return { name: ref, short: ref, coords: null };
}

// 試合日程は実データ、発売日は判明分のみ実データ・それ以外は「未発表」として組み立てる汎用関数
export function buildFixturesFromRealSchedule(team, schedule) {
  return schedule.map((entry) => {
    const opponent = resolveClub(entry.opponentId);
    const host = entry.isHome ? team : opponent;
    const matchDate = new Date(`${entry.date}T00:00:00+09:00`);
    const kickoff = entry.kickoff || '未定';
    const stadium = entry.venueOverride || (entry.isHome ? team.stadium : opponent.stadium);

    if (entry.saleDate) {
      // 実際に告知されている発売日(クラブ公式のチケット発売スケジュール表より)
      const saleDate = new Date(entry.saleDate);
      return {
        id: `${team.id}-r${entry.matchday}`,
        opponent,
        isHome: entry.isHome,
        host,
        matchDate,
        kickoff,
        stadium,
        saleDate,
        status: TODAY >= saleDate ? 'onsale' : 'upcoming',
        isRealData: true, // 試合日程・発売日ともに実データ
        scheduleIsReal: true,
      };
    }

    // チケット発売日はまだ告知されていない(多くのクラブは試合の3〜4週間前まで発表しない)。
    // 実在しない日付を仮置きするのは誤解を招くため、正直に「未告知」の状態として扱う。
    return {
      id: `${team.id}-r${entry.matchday}`,
      opponent,
      isHome: entry.isHome,
      host,
      matchDate,
      kickoff,
      stadium,
      saleDate: null,
      status: 'unknown',
      sourceUrl: host.ticketSystem ? host.ticketSystem.url : null,
      isRealData: true, // 試合日程は実データ。発売日は「まだ無い」という実状をそのまま表している
      scheduleIsReal: true,
    };
  });
}

// ---- データ整合性チェック(開発用) ---------------------------------------
// REAL_SCHEDULESは各クラブの視点ごとに別々のエントリを持つ構造のため、
// 同じ試合の情報がチーム間で食い違ってしまう(例: 両者とも「自分がホーム」
// になっている等)ことがある。ブラウザのコンソールに警告を出すことで、
// データ更新時に気づけるようにする。ユーザーの画面表示には影響しない。
function validateScheduleConsistency() {
  const teamIds = Object.keys(REAL_SCHEDULES);
  teamIds.forEach((teamId) => {
    REAL_SCHEDULES[teamId].forEach((entry) => {
      const oppId = entry.opponentId;
      const oppSchedule = REAL_SCHEDULES[oppId];
      if (!oppSchedule) return; // 相手側にまだ実データが無いので突き合わせ不可

      const match = oppSchedule.find((e) => e.opponentId === teamId && e.date === entry.date);
      if (!match) {
        console.warn(
          `[試合データ整合性チェック] ${teamId} vs ${oppId} (${entry.date}): 相手側に対応する試合が見つかりません(日付のズレの可能性)`
        );
        return;
      }
      if (match.isHome === entry.isHome) {
        console.warn(
          `[試合データ整合性チェック] ${teamId} vs ${oppId} (${entry.date}): 両者とも isHome=${entry.isHome} になっています(どちらかが誤り)`
        );
      }
      if (entry.kickoff && match.kickoff && entry.kickoff !== match.kickoff) {
        console.warn(
          `[試合データ整合性チェック] ${teamId} vs ${oppId} (${entry.date}): キックオフ時刻が不一致です(${entry.kickoff} / ${match.kickoff})`
        );
      }
    });
  });
}
if (typeof window !== 'undefined') {
  validateScheduleConsistency();
}

export function buildFixtures(team) {
  const others = TEAMS.filter((t) => t.id !== team.id);
  const fixtures = [];
  for (let i = 0; i < 8; i++) {
    const opponent = others[i % others.length];
    const isHome = i % 2 === 0;
    const matchDate = addDays(TODAY_DATE_ONLY, 7 * (i + 1));
    const host = isHome ? team : opponent;
    const saleOffset = hashOffset(host.id, 14, 15); // 14〜28日前
    const saleDate = addDays(matchDate, -saleOffset);
    const kickoff = i % 3 === 0 ? '19:00' : '15:00';
    fixtures.push({
      id: `${team.id}-${i}`,
      opponent,
      isHome,
      host,
      matchDate,
      kickoff,
      stadium: host.stadium,
      saleDate,
      status: TODAY >= saleDate ? 'onsale' : 'upcoming',
      isRealData: false,
    });
  }
  return fixtures;
}
