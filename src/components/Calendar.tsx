import { useState } from 'react';
import { Page, NO_SB } from './AppShell';

// Agustus 2025: tanggal 1 jatuh di hari Jumat, jadi 7 Agustus = Kamis. Ubah EVENTS sesuai cerita.
const OFFSET = 5, DAYS = 31, TODAY = 7;
const EVENTS: Record<number, { time: string; title: string; color: string }[]> = {
  6: [{ time: '20.00', title: 'Packing buat besok', color: 'bg-orange-500' }],
  7: [
    { time: '06.10', title: 'Sarapan di Roti Gempol', color: 'bg-red-500' },
    { time: '14.00', title: 'Check-in Temaram Guest House', color: 'bg-blue-500' },
  ],
  8: [{ time: '09.00', title: 'Keliling Lembang', color: 'bg-green-500' }],
  9: [{ time: '10.00', title: 'Check-out & pulang', color: 'bg-purple-500' }],
  // --- tambahan dari doc AU: agenda setelah liburan (waktu tidak disebut di doc -> 'All-day') ---
  18: [{ time: 'All-day', title: 'Rapat Komdis', color: 'bg-indigo-500' }],
  20: [{ time: 'All-day', title: 'Debat kahim', color: 'bg-pink-500' }],
  22: [{ time: 'All-day', title: 'Note-taking untuk matkul baru', color: 'bg-teal-500' }],
  27: [
    { time: 'All-day', title: 'Anter Junghwan beli hp', color: 'bg-yellow-500' },
    { time: 'All-day', title: 'Anter Bang Ajun servis motor', color: 'bg-orange-500' },
  ],
  30: [{ time: 'All-day', title: 'Ke gramed sama doyie', color: 'bg-green-500' }],
};

export default function Calendar() {
  const [sel, setSel] = useState(TODAY);
  const cells = [...Array(OFFSET).fill(0), ...Array.from({ length: DAYS }, (_, i) => i + 1)];
  const evs = EVENTS[sel] ?? [];
  return (
    <Page bg="bg-black">
      <div className="flex items-end justify-between px-4 pb-1 pt-1">
        <h1 className="text-[28px] font-bold text-red-500">August <span className="text-white">2025</span></h1>
      </div>
      <div className="grid grid-cols-7 px-2 text-center text-[12px] font-semibold text-zinc-500">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1 border-b border-zinc-800 px-2 pb-3">
        {cells.map((d, i) => d === 0 ? <div key={i} /> : (
          <button key={i} onClick={() => setSel(d)} className="flex flex-col items-center py-0.5">
            <span className={`flex h-9 w-9 items-center justify-center rounded-full text-[18px] ${d === sel ? (d === TODAY ? 'bg-red-500 text-white' : 'bg-white text-black') : d === TODAY ? 'text-red-500' : ''}`}>{d}</span>
            <span className={`mt-0.5 h-1 w-1 rounded-full ${EVENTS[d] ? 'bg-gray-400' : ''}`} />
          </button>
        ))}
      </div>
      <div className={`min-h-0 flex-1 overflow-y-auto px-4 py-3 ${NO_SB}`}>
        <div className="mb-2 text-[13px] font-semibold uppercase text-zinc-500">Thursday 7 → {sel} Agustus</div>
        {evs.length === 0 && <p className="pt-6 text-center text-[14px] text-zinc-500">No Events</p>}
        {evs.map(e => (
          <div key={e.title} className="mb-2 flex items-center gap-3 rounded-xl bg-zinc-900 p-3">
            <span className={`h-9 w-1 rounded-full ${e.color}`} />
            <div><div className="text-[15px] font-semibold">{e.title}</div><div className="text-[13px] text-zinc-400">{e.time}</div></div>
          </div>
        ))}
      </div>
    </Page>
  );
}
