import { useStory } from './StoryProvider';

/**
 * Satu-satunya tempat aturan tanggal.
 *  - SEBELUM kecelakaan: "hari ini" = 7 Agustus 2025. Tahun 2025 tidak ditampilkan (terasa seperti hari itu).
 *  - SESUDAH kecelakaan (efek wipe saat Mia chat): "hari ini" = 7 Agustus 2026. Tahun SELALU tampil.
 *  - Tahun 2024 dan sebelumnya selalu tampil di kedua fase.
 */
export const useAfter = () => !!useStory().state.wipedKeep;

export const TODAY_BEFORE = new Date(2025, 7, 7);
export const TODAY_AFTER = new Date(2026, 7, 7);
export const todayOf = (after: boolean) => (after ? TODAY_AFTER : TODAY_BEFORE);

export const MON_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const MONTH_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const MON_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
export const DAY_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** "2025-08-06" -> Date lokal (tanpa geser zona waktu) */
export const parseISO = (s: string) => { const [y, m, d] = s.slice(0, 10).split('-').map(Number); return new Date(y, m - 1, d); };

export const showYear = (d: Date, after: boolean) => after || d.getFullYear() !== 2025;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
export const dayDiff = (d: Date, after: boolean) => Math.round((startOfDay(todayOf(after)) - startOfDay(d)) / 86400000);

/** "Aug 6" / "Aug 6, 2025" */
export const fmtEN = (d: Date, after: boolean) => `${MON_EN[d.getMonth()]} ${d.getDate()}${showYear(d, after) ? ', ' + d.getFullYear() : ''}`;
/** "6 Agustus" / "6 Agustus 2025" */
export const fmtID = (d: Date, after: boolean) => `${d.getDate()} ${MON_ID[d.getMonth()]}${showYear(d, after) ? ' ' + d.getFullYear() : ''}`;

/** Riwayat panggilan / daftar: sebelum = Today, Yesterday, nama hari, atau tanggal; sesudah = tanggal lengkap. */
export function recentLabel(d: Date, after: boolean) {
  if (after) return fmtEN(d, true);
  const n = dayDiff(d, false);
  if (n === 0) return 'Today';
  if (n === 1) return 'Yesterday';
  if (n > 1 && n < 7) return DAY_EN[d.getDay()];
  return fmtEN(d, false);
}

/** Judul kelompok hari (Safari): "Today" / "Yesterday" / "Monday, August 4" (+ tahun sesudah kecelakaan). */
export function dayHeader(d: Date, after: boolean) {
  if (!after) {
    const n = dayDiff(d, false);
    if (n === 0) return 'Today';
    if (n === 1) return 'Yesterday';
  }
  return `${DAY_EN[d.getDay()]}, ${MONTH_EN[d.getMonth()]} ${d.getDate()}${showYear(d, after) ? ', ' + d.getFullYear() : ''}`;
}

/** label hari dari sheet ("Kamis, 7 Agustus") -> "7/8/2025" (untuk daftar chat setelah kecelakaan) */
export function labelToShort(label: string) {
  const m = label.match(/(\d{1,2})\s+([A-Za-z]+)/);
  const mi = m ? MON_ID.findIndex(x => x.toLowerCase() === m[2].toLowerCase()) : -1;
  if (!m || mi < 0) return '';
  const y = label.match(/\d{4}/)?.[0] ?? '2025';
  return `${m[1]}/${mi + 1}/${y}`;
}
