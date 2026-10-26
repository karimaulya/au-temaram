import { useEffect, useState } from 'react';
import { Page, NO_SB } from './AppShell';

// Playlist perjalanan yang disiapkan Asahi. Tidak ada audio; hanya tampilan.
const TRACKS = [
  { title: 'Voyager', artist: 'Xdinary Heroes', from: 'from-sky-400', to: 'to-indigo-700' },
  { title: 'Sunlight', artist: 'Playlist Asahi', from: 'from-amber-300', to: 'to-orange-600' },
  { title: 'Road Trip', artist: 'Ujang Kedu', from: 'from-emerald-400', to: 'to-teal-700' },
  { title: 'Drive', artist: 'Day6', from: 'from-fuchsia-400', to: 'to-purple-700' },
  { title: 'Wake Up', artist: 'Xdinary Heroes', from: 'from-rose-400', to: 'to-red-700' },
];
const DUR = 180;
const mmss = (s: number) => `${Math.floor(s / 60)}.${String(Math.floor(s % 60)).padStart(2, '0')}`;
const Art = ({ i, size }: { i: number; size: number }) => (
  <span style={{ width: size, height: size, fontSize: size / 2.4 }} className={`flex shrink-0 items-center justify-center rounded-[8px] bg-gradient-to-br ${TRACKS[i].from} ${TRACKS[i].to} font-bold text-white/90`}>{TRACKS[i].title[0]}</span>
);
const Pill = ({ on, children }: { on?: boolean; children: React.ReactNode }) => (
  <span className={`flex h-[52px] flex-1 items-center justify-center rounded-full ${on ? 'bg-white text-black' : 'bg-white/15 text-white/40'}`}>{children}</span>
);

export default function Music() {
  const [cur, setCur] = useState(0);
  const [play, setPlay] = useState(false);
  const [pos, setPos] = useState(9);
  const [vol, setVol] = useState(0.55);
  useEffect(() => {
    if (!play) return;
    const t = window.setInterval(() => setPos(p => (p + 1 >= DUR ? 0 : p + 1)), 1000);
    return () => clearInterval(t);
  }, [play]);
  const pick = (i: number) => { setCur(i); setPos(0); setPlay(true); };
  const step = (d: number) => pick((cur + d + TRACKS.length) % TRACKS.length);
  const queue = TRACKS.map((_, i) => i).filter(i => i !== cur);

  return (
    <Page bg="bg-gradient-to-b from-[#4a4a50] via-[#323236] to-[#1b1b1e]">
      <div className="mx-auto mt-1 h-[5px] w-[56px] rounded-full bg-white/40" />
      <div className="flex items-center gap-4 px-5 pt-4">
        <Art i={cur} size={68} />
        <div className="min-w-0 flex-1"><div className="truncate text-[20px] font-semibold">{TRACKS[cur].title}</div><div className="truncate text-[17px] uppercase text-white/60">{TRACKS[cur].artist}</div></div>
        <span className="text-[26px] text-white/80">☆</span><span className="px-1 text-[22px] font-bold text-white/80">•••</span>
      </div>
      <div className="flex gap-3 px-5 pt-4">
        <Pill>⤮</Pill><Pill>⟲</Pill><Pill on>∞</Pill><Pill>◐</Pill>
      </div>
      <div className="px-5 pb-1 pt-5"><div className="text-[22px] font-bold">Continue Playing</div><div className="text-[16px] text-white/60">Roadtrip Ujang Kedu</div></div>
      <div className={`min-h-0 flex-1 overflow-y-auto px-5 ${NO_SB}`}>
        {queue.map(i => (
          <button key={i} onClick={() => pick(i)} className="flex w-full items-center gap-4 py-2 text-left active:opacity-60">
            <Art i={i} size={60} />
            <div className="min-w-0 flex-1"><div className="truncate text-[19px]">{TRACKS[i].title}</div><div className="truncate text-[16px] text-white/60">{TRACKS[i].artist}</div></div>
            <span className="text-[22px] text-white/40">≡</span>
          </button>
        ))}
      </div>
      <div className="px-5 pt-3">
        <div className="h-[8px] overflow-hidden rounded-full bg-white/25"><div className="h-full rounded-full bg-white/80" style={{ width: `${(pos / DUR) * 100}%` }} /></div>
        <div className="mt-1.5 flex justify-between text-[15px] text-white/50"><span>{mmss(pos)}</span><span>−{mmss(DUR - pos)}</span></div>
      </div>
      <div className="flex items-center justify-around px-10 py-3 text-white">
        <button onClick={() => step(-1)} className="text-[50px] leading-none active:scale-90">⏪</button>
        <button onClick={() => setPlay(p => !p)} className="text-[62px] leading-none active:scale-90">{play ? '⏸' : '▶'}</button>
        <button onClick={() => step(1)} className="text-[50px] leading-none active:scale-90">⏩</button>
      </div>
      <div className="flex items-center gap-4 px-5 pb-3 text-white/60">
        <span>🔈</span>
        <div className="h-[8px] flex-1 overflow-hidden rounded-full bg-white/25" onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setVol(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))); }}>
          <div className="h-full rounded-full bg-white/60" style={{ width: `${vol * 100}%` }} />
        </div>
        <span>🔊</span>
      </div>
      <div className="flex items-center justify-between px-12 pb-3 text-white/70">
        <span className="text-[26px]">❝</span><span className="text-[26px]">◉</span>
        <span className="flex h-[56px] w-[64px] items-center justify-center rounded-full bg-white/25 text-[24px] text-white">☰</span>
      </div>
    </Page>
  );
}
