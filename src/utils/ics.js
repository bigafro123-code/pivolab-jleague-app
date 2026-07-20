import { pad, formatDate } from './date';

function toICSDateTime(d, hour, minute) {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(hour)}${pad(minute)}00`;
}

function escapeICS(text) {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

// iOSのReminders(リマインダー)アプリにはWebアプリから直接書き込むAPIが無いため、
// 代わりに .ics(カレンダーイベント)ファイルを生成してダウンロードさせる方式で代替する。
// ユーザーが開くとiPhoneの「カレンダー」に発売日イベント+通知が登録される。
function buildICS(fixture, team) {
  const dtStart = toICSDateTime(fixture.saleDate, 10, 0);
  const dtEnd = toICSDateTime(fixture.saleDate, 11, 0);
  const now = new Date();
  const dtStamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}T${pad(now.getHours())}${pad(
    now.getMinutes()
  )}${pad(now.getSeconds())}`;
  const summary = escapeICS(`【${team.short}】vs ${fixture.opponent.name} チケット発売`);
  const description = escapeICS(
    `${fixture.host.ticketSystem.name}で発売開始\n購入サイト: ${fixture.host.ticketSystem.url}\n試合日: ${formatDate(
      fixture.matchDate
    )} ${fixture.kickoff}\n会場: ${fixture.stadium}`
  );
  const uid = `${fixture.id}@jleague-ticket-tracker`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//JLeagueTicketTracker//JP',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    'DESCRIPTION:チケット発売30分前です',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadICS(fixture, team) {
  const ics = buildICS(fixture, team);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ticket-${fixture.id}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
