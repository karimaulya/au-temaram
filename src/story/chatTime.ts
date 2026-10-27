import type { Msg } from './types';

// "04:17" / "04.17" -> menit sejak tengah malam
export const toMin = (t?: string): number | null => {
  const m = t?.match(/(\d{1,2})[:.](\d{2})/);
  return m ? +m[1] * 60 + +m[2] : null;
};

export const GAP_MIN = 15; // jeda >= 15 menit -> muncul timestamp baru di tengah (gaya iMessage)

/**
 * Teks timestamp yang ditaruh di tengah room chat sebelum pesan ini (atau null kalau tidak perlu).
 * after = HP sudah sesudah kecelakaan -> label hari lama ("Rabu, 6 Agustus") ditambah tahunnya.
 */
export function separatorFor(msg: Msg, prev?: Msg, after = false): string | null {
  const join = (a?: string, b?: string) => [a, b].filter(Boolean).join(' ');
  if (msg.dateLabel) {
    // pesan lama: "Selasa, 5 Agustus" (+ jam kalau ada), sekali per hari
    if (prev?.dateLabel === msg.dateLabel) return null;
    const label = after && !/\d{4}/.test(msg.dateLabel) ? `${msg.dateLabel} 2025` : msg.dateLabel;
    return join(label, msg.time);
  }
  if (!prev || prev.dateLabel) return join('Hari ini', msg.time);   // pesan live pertama
  const a = toMin(prev.time), b = toMin(msg.time);
  if (a !== null && b !== null && b - a >= GAP_MIN) return join('Hari ini', msg.time);
  return null;
}
