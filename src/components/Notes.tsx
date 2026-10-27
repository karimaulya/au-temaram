import { useState } from 'react';
import type { ReactNode } from 'react';
import { useAfter, parseISO, fmtID, DAY_EN } from '../story/dates';
import { Page, BackCircle, CircleBtn, BottomSearch, DotsGlyph, SearchGlyph, glass, NO_SB } from './AppShell';

// Isi catatan dari doc AU (cerita berlangsung 7 Agustus 2025, jadi catatan terbaru = 6 Agustus 2025).
// Format isi:  "☐ " = daftar centang · "• " = poin · "# " = sub judul · *miring* · baris kosong = jarak
interface Note {
  id: number;
  group: string;      // judul seksi di daftar (gaya Apple Notes)
  title: string;
  at: string;         // tanggal ISO; tampilan daftar & isi diatur story/dates.ts
  edited?: boolean;   // tambah "(edited)" di tanggal dalam catatan
  body: string;
}

const NOTES: Note[] = [
  {
    id: 1, group: 'Previous 7 Days', title: 'Itinerary Bandung (2D1N)', at: '2025-08-06', edited: true,
    body: [
      '# Day 1',
      '☐ 03.30 - 06.00 (maybe?) Perjalanan Jakarta-Bandung',
      '☐ 06.10 - 09.00 Sarapan di roti gempol',
      '☐ 09.00 - 11.00 Early check in & power nap @Temaram Guest House',
      '☐ 11.00 - 13.00 Maksi di Braga Permai',
      '☐ 13.00 - 15.00 Strolling around Braga',
      '☐ 15.00 - 17.30 Tahura, Dago (awas dikejar monyet)',
      '☐ 17.30 - 19.00 Makan di Punclut',
      '☐ 19.00 - 21.00 Board Game sambil ngadem',
      '☐ 21.00 - selesai Sate Bu Ngantuk',
      '',
      '# Day 2',
      '☐ 07.30 - 09.00 Sarapan di Warung Taru',
      '☐ 09.00 - 12.00 Kebun teh sukawarna',
      '☐ 12.00 - 14.00 Lawangwangi Creative Space (sambil maksi)',
      '☐ 14.00 - 15.00 Kartika Sari (beli oleh-oleh)',
      '☐ 15.00 OTW balik Jakarta',
    ].join('\n'),
  },
  {
    id: 2, group: 'Previous 7 Days', title: 'Sebuah tulisan yang gue tulis di malam hari', at: '2025-08-04',
    body: [
      'Tulisan ini gue buat pas ngerjain maket sambil stress berat soalnya besok responsi. Tapi gue inget kalau bentar lagi pergi liburan, jadi gue semangat (sambil nangis).',
      'Kalau esok hari bisa diskip, niscaya akan gue lakukan saat ini juga.',
      'STRESS',
    ].join('\n'),
  },
  {
    id: 3, group: 'Previous 7 Days', title: 'Ke supermarket, yang nitip:', at: '2025-08-03',
    body: [
      '• Bang Ucuk: sikat gigi kepala kecil',
      '• Bang Ji: singlet (katanya robek), sabun cuci muka Kahf, mie sambel ndower',
      '• Bang Ochi: hand sanitizer',
      '• Bang Ajun: baso kenzler keju 5 (buset mau ngewarung kah elu)',
      '• Doyie: piring plastik buat acara himpunan 2 lusin',
      '• Jae gila: tisu, sabun mandi, rapika, sabun cuci piring, samyang, shampo head n shoulder, sabun lifebuoy kuning, kaos kaki, sabun cuci muka (lo pindahin aja indomaret ke kamar lo dah)',
      '• Jeo: gue pulang dengan selamat',
      '• Haruto: Kopi kapal api yang gak ada gulanya',
      '• Junghwan: Roti tawar, kentang goreng, suki sukian, dimsum, teh pucuk, donat lusinan, ayam karage, ayam katsu',
    ].join('\n'),
  },
  {
    id: 4, group: 'Previous 30 Days', title: 'Gue bener-bener mau nyelesain kuliah ini dengan … serius.', at: '2025-07-30',
    body: [
      'Awalnya gue juga bingung sih kenapa dan untuk siapa gue pilih jurusan arsitektur, karena gue ngerasa enggak berbakat. Gue emang suka fotografi tapi kan beda (?). Gue pilih jurusan ini karena kemauan bibi dan Mia. Keluarga mereka yang ngurus gue, jadi gue enggak berniat bantah.',
      'Terus sekarang, gue jadi nemu the reasons why I must stay alive and remain sane until the end. Ya, karena akhirnya gue tahu apa yang gue mau. Seenggaknya, walaupun nanti gue enggak yang bergelimang harta, gue bisa bangun dan desain rumah gue sendiri, yang isinya mereka.',
      'Agak geli nyebutnya, tapi ya … siapa lagi kalau bukan mereka bersembilan yang udah nemenin masa kuliah gue? Gue juga tahu pasti masing-masing nanti akan berkeluarga, atau kerja yang jauh, tapi seenggaknya ada satu rumah tempat kita bisa ngumpul kalau kangen.',
      'Wahaha, diketawain Jae kalau dia tau gue nulis ini.',
      '(namanya juga drunk text)',
      '(tapi drunk nya karena MAKET)',
    ].join('\n'),
  },
  { id: 5, group: 'May', title: 'When yah lulus', at: '2025-05-28', body: '' },
  {
    id: 6, group: 'April', title: 'Pikiran liar di jam 2 pagi', at: '2025-04-14',
    body: 'Tiba-tiba pengen punya pacar',
  },
  {
    id: 7, group: 'April', title: 'Draft chat', at: '2025-04-10',
    body: [
      'Selamat pagi, Pak Arsa. Perkenalkan saya Asahi, mahasiswa semester 5 arsitektur kelas A.',
      'Berikut saya lampirkan foto gambar desain dan maket yang sudah saya buat.',
      '',
      '(BELUM ADA FOTONYA YA KARENA BLM BUAT WKWKWKWK)',
    ].join('\n'),
  },
  {
    id: 8, group: 'March', title: 'Gue enggak pernah berandai-andai tentang *rumah,* karena gue enggak pernah punya konseptualisasi soal rumah.', at: '2025-03-05',
    body: [
      'Gue enggak pernah berekspektasi tinggi tentang di mana dan dengan siapa gue tinggal. Bagi gue, gue bisa melewati hari ini pun udah bisa gue syukuri.',
      '',
      'Tapi, tiba-tiba gue jadi orang yang penuh cita-cita dan harapan waktu gue mulai tinggal di kontrakan ini. Nol ekspektasi gue berubah jadi sebuah ke-*picky-*an dalam memilih pertemanan (duh, diksi dari mana ini bray). Cukup gue yang tahu kalau sekarang, pas gue kenalan sama orang, gue pasti ngebandingin sama temen-temen kontrakan gue. Mereka sayang gue, *in a way nobody can explain it, including me.* Dan gue juga sayang mereka, sebagai kakak, teman, dan adik.',
      '',
      'Sehat-sehat deh pertemanan ini.',
      'Sukses buat pertemanan indonesia ini ke depannya',
      '(salam maket)',
    ].join('\n'),
  },
];

// tanggal di daftar: sebelum kecelakaan 7 hari terakhir = nama hari, lainnya dd/mm (tanpa tahun 2025); sesudah = dd/mm/yy
const listDate = (n: Note, after: boolean) => {
  const d = parseISO(n.at);
  const dd = String(d.getDate()).padStart(2, '0'), mm = String(d.getMonth() + 1).padStart(2, '0'), yy = String(d.getFullYear()).slice(2);
  if (after) return `${dd}/${mm}/${yy}`;
  if (n.group === 'Previous 7 Days') return DAY_EN[d.getDay()];
  return `${dd}/${mm}${d.getFullYear() !== 2025 ? '/' + yy : ''}`;
};
const fullDate = (n: Note, after: boolean) => `${fmtID(parseISO(n.at), after)}${n.edited ? ' (edited)' : ''}`;
const plain = (s: string) => s.replace(/\*/g, '');
// *miring*
const fmt = (s: string): ReactNode[] =>
  s.split(/(\*[^*]+\*)/).map((p, i) => (p.length > 2 && p.startsWith('*') && p.endsWith('*') ? <em key={i}>{p.slice(1, -1)}</em> : p));

const ShareGlyph = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V3M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" /></svg>;

export default function Notes({ onBack }: { onBack?: () => void }) {
  const after = useAfter();
  // sesudah kecelakaan "hari ini" = Agustus 2026, jadi semua catatan 2025 dikelompokkan per tahun
  const groupOf = (n: Note) => (after ? String(parseISO(n.at).getFullYear()) : n.group);
  const GROUPS = NOTES.reduce<string[]>((g, n) => (g.includes(groupOf(n)) ? g : [...g, groupOf(n)]), []);
  const [open, setOpen] = useState<number | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const note = NOTES.find(n => n.id === open);

  if (note) return (
    <Page>
      <div className="flex items-center justify-between px-4 pt-2">
        <BackCircle onBack={() => setOpen(null)} />
        <div className={`flex h-[44px] items-center gap-5 rounded-full px-5 ${glass}`}><ShareGlyph /><DotsGlyph /><SearchGlyph /></div>
      </div>
      <div className={`min-h-0 flex-1 overflow-y-auto px-5 pb-28 pt-4 ${NO_SB}`}>
        <div className="text-center text-[13px] text-zinc-500">{fullDate(note, after)}</div>
        <h2 className="mt-3 text-[30px] font-bold leading-tight text-rose-300">{fmt(note.title)}</h2>
        <div className="mt-3 space-y-3">
          {note.body.split('\n').map((ln, i) => {
            if (ln.startsWith('☐ ')) {
              const k = `${note.id}-${i}`, on = !!done[k];
              return (
                <button key={i} onClick={() => setDone(d => ({ ...d, [k]: !d[k] }))} className="flex w-full items-start gap-3 text-left">
                  <span className={`mt-[1px] flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border-2 text-[13px] text-black ${on ? 'border-rose-300 bg-rose-300' : 'border-zinc-600'}`}>{on ? '✓' : ''}</span>
                  <span className={`text-[17px] leading-snug ${on ? 'text-zinc-500 line-through' : ''}`}>{ln.slice(2)}</span>
                </button>
              );
            }
            if (ln.startsWith('• ')) return (
              <div key={i} className="flex gap-3 text-[17px] leading-snug"><span className="text-zinc-500">•</span><span>{fmt(ln.slice(2))}</span></div>
            );
            if (ln.startsWith('# ')) return <p key={i} className="pt-1 text-[20px] font-bold">{ln.slice(2)}</p>;
            return <p key={i} className="text-[17px] leading-snug">{ln ? fmt(ln) : ' '}</p>;
          })}
        </div>
      </div>
      <button className="absolute bottom-[50px] right-5 flex h-[58px] w-[58px] items-center justify-center rounded-full border border-white/20 bg-rose-300/80 text-[30px] font-light text-black shadow-lg active:scale-90">+</button>
    </Page>
  );

  return (
    <Page>
      <div className="flex items-center justify-between px-4 pt-2">
        <BackCircle onBack={onBack} />
        <CircleBtn><DotsGlyph /></CircleBtn>
      </div>
      <div className={`min-h-0 flex-1 overflow-y-auto pb-32 ${NO_SB}`}>
        <h1 className="px-5 pt-5 text-[40px] font-bold tracking-tight">Notes</h1>
        <div className="px-5 text-[16px] text-zinc-400">{NOTES.length} Notes</div>
        {GROUPS.map(g => (
          <div key={g}>
            <div className="px-5 pb-2 pt-5 text-[20px] font-bold">{g}</div>
            <div className="mx-4 overflow-hidden rounded-[28px] bg-zinc-900">
              {NOTES.filter(n => groupOf(n) === g).map((n, i) => {
                const first = n.body.split('\n').find(l => l.trim()) ?? 'No additional text';
                return (
                  <button key={n.id} onClick={() => setOpen(n.id)} className={`block w-full px-5 py-3 text-left active:bg-zinc-800 ${i ? 'border-t border-zinc-800' : ''}`}>
                    <div className="truncate text-[18px] font-semibold">{plain(n.title)}</div>
                    <div className="truncate text-[15px] text-zinc-400">{listDate(n, after)}  {plain(first).replace(/^(☐|•|#) /, '')}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <BottomSearch action={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>} />
    </Page>
  );
}
