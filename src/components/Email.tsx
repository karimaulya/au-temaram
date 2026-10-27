import { useState } from 'react';
import { Page, BackCircle, NO_SB } from './AppShell';
import { useAfter, fmtEN, parseISO } from '../story/dates';

const MAILS = [
  { id: 1, from: 'Temaram Guest House', subject: 'Konfirmasi pemesanan 7–9 Agustus', at: '2025-08-01', body: 'Halo Kak Asahi,\n\nPemesanan kamar untuk 10 orang pada 7–9 Agustus sudah kami konfirmasi. Check-in mulai pukul 14.00.\n\nSalam,\nTemaram Guest House' },
  { id: 2, from: 'Tol Cipularang', subject: 'Info lalu lintas akhir pekan', at: '2025-08-04', body: 'Diperkirakan ramai lancar. Mohon periksa kondisi kendaraan sebelum berangkat.' },
  { id: 3, from: 'Kampus', subject: 'Pengingat: batas pengumpulan tugas', at: '2025-08-05', body: 'Pengumpulan tugas akhir semester diperpanjang sampai 15 Agustus.' },
];
const COLORS = ['bg-blue-600', 'bg-purple-600', 'bg-teal-600', 'bg-orange-600'];
const color = (s: string) => COLORS[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];
const Star = ({ on }: { on: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill={on ? '#f5c518' : 'none'} stroke={on ? '#f5c518' : '#8e8e93'} strokeWidth="1.6" strokeLinejoin="round"><polygon points="12 2.5 14.9 9 22 9.6 16.6 14.3 18.2 21.2 12 17.6 5.8 21.2 7.4 14.3 2 9.6 9.1 9" /></svg>
);

export default function Email() {
  const after = useAfter();
  const when = (at: string) => fmtEN(parseISO(at), after);
  const [open, setOpen] = useState<number | null>(null);
  const [starred, setStarred] = useState<number[]>([]);
  const m = MAILS.find(x => x.id === open);

  if (m) return (
    <Page>
      <div className="px-4 pt-2"><BackCircle onBack={() => setOpen(null)} /></div>
      <div className={`min-h-0 flex-1 overflow-y-auto px-5 pt-4 ${NO_SB}`}>
        <h2 className="text-[24px] font-bold leading-tight">{m.subject}</h2>
        <div className="mt-3 flex items-center gap-3">
          <span className={`flex h-10 w-10 items-center justify-center rounded-full text-[18px] font-medium ${color(m.from)}`}>{m.from[0]}</span>
          <div><div className="text-[16px] font-semibold">{m.from}</div><div className="text-[13px] text-zinc-400">{when(m.at)}</div></div>
        </div>
        <p className="mt-5 whitespace-pre-wrap text-[16px] leading-relaxed">{m.body}</p>
      </div>
    </Page>
  );

  return (
    <Page bg="bg-[#0b0d12]">
      <div className="mx-4 mt-2 flex h-[56px] items-center gap-4 rounded-full bg-zinc-900 px-5">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c4c7c5" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        <span className="flex-1 text-[17px] text-zinc-300">Search in mail</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-500 text-[16px] font-semibold ring-2 ring-[#4285f4] ring-offset-2 ring-offset-zinc-900">A</span>
      </div>
      <div className="px-5 pb-2 pt-5 text-[13px] tracking-[0.15em] text-zinc-400">All inboxes</div>
      <div className={`min-h-0 flex-1 space-y-2 overflow-y-auto px-2 pb-36 ${NO_SB}`}>
        {MAILS.map(x => (
          <div key={x.id} onClick={() => setOpen(x.id)} className="flex cursor-pointer items-center gap-3 rounded-[20px] bg-zinc-900 px-3 py-3 active:bg-zinc-800">
            <span className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full text-[22px] font-medium ${color(x.from)}`}>{x.from[0]}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <b className="truncate text-[17px]">{x.from}</b>
                <span className="flex shrink-0 items-center gap-2 text-[13px] text-zinc-300">{when(x.at)}<i className="h-2.5 w-2.5 rounded-full bg-[#4285f4]" /></span>
              </div>
              <div className="truncate text-[15px] font-semibold">{x.subject}</div>
              <div className="truncate text-[14px] text-zinc-400">{x.body.replace(/\n/g, ' ')}</div>
            </div>
            <button onClick={e => { e.stopPropagation(); setStarred(s => s.includes(x.id) ? s.filter(i => i !== x.id) : [...s, x.id]); }} className="shrink-0 active:scale-90"><Star on={starred.includes(x.id)} /></button>
          </div>
        ))}
      </div>
      <button className="absolute bottom-[104px] right-4 z-20 flex h-[58px] items-center gap-3 rounded-[18px] bg-[#1f3a5f] px-5 text-[16px] font-medium text-[#a8c7fa] shadow-xl active:scale-95">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>Compose
      </button>
      <div className="absolute inset-x-0 bottom-[34px] z-10 flex items-center justify-around bg-[#0b0d12]/95 px-10 pb-3 pt-2 backdrop-blur-xl">
        <span className="relative flex h-[40px] w-[64px] items-center justify-center rounded-full bg-[#1f3a5f]">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#a8c7fa"><path d="M3 5h18v14H3z" /><path d="m3 6 9 7 9-7" stroke="#0b0d12" strokeWidth="2" fill="none" /></svg>
          <b className="absolute -right-3 -top-2 rounded-full bg-red-500 px-1.5 text-[12px]">99+</b>
        </span>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#c4c7c5" strokeWidth="1.8" strokeLinejoin="round"><rect x="2" y="6" width="14" height="12" rx="2" /><path d="m16 10 6-3v10l-6-3" /></svg>
      </div>
    </Page>
  );
}
