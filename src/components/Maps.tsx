import { useState } from 'react';
import { Page } from './AppShell';

const PINS = [
  { id: 'guest', x: 250, y: 190, name: 'Temaram Guest House', addr: 'Jl. Temaram No. 7, Lembang', color: '#ff3b30' },
  { id: 'roti', x: 120, y: 320, name: 'Roti Gempol', addr: 'Jl. Gempol Wetan, Bandung', color: '#ff9500' },
];

export default function Maps() {
  const [sel, setSel] = useState<string | null>('guest');
  const pin = PINS.find(p => p.id === sel);
  return (
    <Page bg="bg-[#1b1d21]">
      <svg viewBox="0 0 393 700" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" onClick={() => setSel(null)}>
        <rect width="393" height="700" fill="#1b1d21" />
        <path d="M0 520 Q120 470 200 520 T393 480 V700 H0Z" fill="#1f3347" />
        <rect x="290" y="60" width="90" height="90" rx="12" fill="#1f2d22" />
        <g stroke="#3a3d44" strokeWidth="14" fill="none" strokeLinecap="round"><path d="M-10 150 L400 230" /><path d="M120 -10 L190 720" /><path d="M-10 400 L400 330" /></g>
        <g stroke="#8a7440" strokeWidth="5" fill="none"><path d="M-10 150 L400 230" /></g>
        <path d="M250 190 L190 240 L170 330 L120 320" stroke="#007aff" strokeWidth="5" strokeDasharray="1 9" strokeLinecap="round" fill="none" />
        {PINS.map(p => (
          <g key={p.id} onClick={e => { e.stopPropagation(); setSel(p.id); }} className="cursor-pointer">
            <circle cx={p.x} cy={p.y} r="13" fill={p.color} stroke="#3a3d44" strokeWidth="3" />
            <circle cx={p.x} cy={p.y} r="4" fill="#fff" />
          </g>
        ))}
      </svg>
      <div className="relative z-10 mx-3 mt-1 flex items-center gap-2 rounded-xl bg-black/95 px-3 py-2.5 text-[15px] text-zinc-400 shadow-md">🔍 Search Maps</div>
      {pin && (
        <div className="relative z-10 mx-3 mt-auto mb-2 rounded-2xl bg-zinc-900 p-4 shadow-xl">
          <div className="text-[18px] font-bold">{pin.name}</div>
          <div className="text-[14px] text-zinc-400">{pin.addr}</div>
          <button className="mt-3 w-full rounded-xl bg-[#007aff] py-2 text-[15px] font-semibold text-white active:opacity-70">Directions</button>
        </div>
      )}
    </Page>
  );
}
