export const TODAY = new Date(); // 実際の現在日時を使用(発売日の判定は常に「今」を基準にする)
export const TODAY_DATE_ONLY = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()); // 日付のみ(0時)に正規化。モックの試合日程生成に使う

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function hashOffset(id, min, span) {
  let h = 0;
  for (const c of id) h += c.charCodeAt(0);
  return min + (h % span);
}

export function formatDate(d) {
  const w = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
  return `${d.getMonth() + 1}/${d.getDate()}(${w})`;
}

export function pad(n) {
  return n.toString().padStart(2, '0');
}
