import type { Msg } from './types';

// "04:17" / "04.17" -> menit sejak tengah malam
export const toMin = (t?: string): number | null => {
  const m = t?.match(/(\d{1,2})[:.](\d{2})/);
  return m ? +m[1] * 60 + +m[2] : null;
};

export const GAP_MIN = 15; // jeda >= 15 menit -> muncul timestamp baru di tengah (gaya iMessage)

/** Teks timestamp yang ditaruh di tengah room chat sebelum pesan ini (atau null kalau tidak perlu). */
export function separatorFor(msg: Msg, prev?: Msg): string | null {
  const join = (a?: string, b?: string) => [a, b].filter(Boolean).join(' ');
  if (msg.dateLabel) {
    // pesan lama: "Selasa, 5 Agustus" (+ jam kalau ada), sekali per hari
    return prev?.dateLabel === msg.dateLabel ? null : join(msg.dateLabel, msg.time);
  }
  if (!prev || prev.dateLabel) return join('Hari ini', msg.time);   // pesan live pertama
  const a = toMin(prev.time), b = toMin(msg.time);
  if (a !== null && b !== null && b - a >= GAP_MIN) return join('Hari ini', msg.time);
  return null;
}
