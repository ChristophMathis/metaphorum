// Shared helpers for the EmDash-driven conference pages.

/** Extract plain text from a Portable Text value (for excerpts/clamping). */
export function portableTextToPlainText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return '';
  return blocks
    .filter((b: any) => b?._type === 'block' && Array.isArray(b.children))
    .map((b: any) => b.children.map((c: any) => c?.text ?? '').join(''))
    .join(' ')
    .trim();
}

/**
 * Reference fields store the target's database ID. Build a lookup that
 * resolves either the database ID (`entry.data.id`) or the slug (`entry.id`).
 */
export function buildEntryLookup<T extends { id: string; data: { id: string } }>(
  entries: T[],
): Map<string, T> {
  const map = new Map<string, T>();
  for (const entry of entries) {
    map.set(entry.data.id, entry);
    map.set(entry.id, entry);
  }
  return map;
}

/** Normalize a reference field value (single or multiple) to an array of IDs. */
export function referenceIds(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
  if (typeof value === 'string') return [value];
  return [];
}

/** "2026-09-17" -> "Thursday, September 17" */
export function formatDay(day: string): string {
  const date = new Date(`${day}T00:00:00`);
  if (Number.isNaN(date.getTime())) return day;
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

/** "14:00" -> "2:00 PM" (matches the existing schedule page) */
export function formatTime(timeStr: string): string {
  const [hour, minute] = timeStr.split(':');
  const h = parseInt(hour, 10);
  if (Number.isNaN(h)) return timeStr;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minute ?? '00'} ${ampm}`;
}
