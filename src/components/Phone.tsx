import { useState } from 'react';
import type { AppScreen } from '../types';
import { Page, CircleBtn, SearchGlyph, glass, NO_SB } from './AppShell';
import Contacts from './Contacts';
import { useAfter, recentLabel, parseISO } from '../story/dates';

const KEYS: [string, string][] = [['1', ''], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'], ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'], ['*', ''], ['0', '+'], ['#', '']];
const CALLS = [
  { name: 'Bang Ucuk', kind: 'Video · Tidak terjawab', at: '2025-08-06', red: true },
  { name: 'Temaram Guest House', kind: 'mobile', at: '2025-08-05', red: false },
  { name: 'Jae berisik', kind: 'Audio', at: '2025-08-04', red: false },
];

export default function Phone({ onOpenApp }: { onOpenApp: (s: AppScreen) => void }) {
  const [tab, setTab] = useState<'calls' | 'contacts' | 'keypad'>('keypad');
  const [num, setNum] = useState('');
  const after = useAfter();
  const tabs = [
    { id: 'calls' as const, label: 'Calls', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="12" cy="12" r="9.5" /><path d="M12 7v5h-4" /></svg> },
    { id: 'contacts' as const, label: 'Contacts', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0z" /></svg> },
    { id: 'keypad' as const, label: 'Keypad', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">{[5, 12, 19].flatMap(y => [5, 12, 19].map(x => <circle key={`${x}${y}`} cx={x} cy={y} r="2" />))}</svg> },
  ];
  return (
    <Page>
      <div className={`min-h-0 flex-1 overflow-y-auto ${NO_SB}`}>
        {tab === 'keypad' && (
          <div className="flex h-full flex-col items-center pb-[120px]">
            <div className="flex h-[150px] w-full items-end justify-center pb-3 text-[40px] font-light tracking-wider">{num}</div>
            <div className="mt-auto grid grid-cols-[repeat(3,74px)] gap-x-6 gap-y-3.5">
              {KEYS.map(([n, l]) => (
                <button key={n} onClick={() => num.length < 15 && setNum(v => v + n)} className={`flex h-[74px] w-[74px] flex-col items-center justify-center rounded-full active:bg-white/25 ${glass}`}>
                  <span className={`${n === '*' ? 'pt-2 text-[40px]' : 'text-[34px]'} leading-none`}>{n}</span>
                  {l && <span className="mt-0.5 text-[10px] font-bold tracking-[2px]">{l}</span>}
                </button>
              ))}
              <span />
              <button className="flex h-[74px] w-[74px] items-center justify-center rounded-full bg-[#30d158] shadow-lg active:scale-90">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="white"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" /></svg>
              </button>
              <button onClick={() => setNum(v => v.slice(0, -1))} className={`flex h-[74px] w-[74px] items-center justify-center text-[26px] text-zinc-400 ${num ? '' : 'invisible'}`}>⌫</button>
            </div>
          </div>
        )}
        {tab === 'calls' && (
          <div className="px-4 pb-36">
            <h1 className="pb-3 pt-6 text-[38px] font-bold tracking-tight">Calls</h1>
            <div className="overflow-hidden rounded-[28px] bg-zinc-900">
              {CALLS.map((r, i) => (
                <div key={r.name + i} className={`flex items-center justify-between px-5 py-3.5 ${i ? 'border-t border-zinc-800' : ''}`}>
                  <div><div className={`text-[18px] font-semibold ${r.red ? 'text-red-500' : ''}`}>{r.name}</div><div className="text-[14px] text-zinc-400">{r.kind}</div></div>
                  <span className="text-[14px] text-zinc-400">{recentLabel(parseISO(r.at), after)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'contacts' && <div className="relative h-full"><Contacts onOpenApp={onOpenApp} embedded /></div>}
      </div>

      <div className="absolute inset-x-3 bottom-[44px] z-20 flex items-center gap-3">
        <div className={`flex h-[64px] flex-1 items-center rounded-full p-1.5 ${glass}`}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`relative flex h-full flex-1 flex-col items-center justify-center rounded-full text-[12px] font-semibold ${tab === t.id ? 'bg-white/15 text-[#0a84ff]' : 'text-white'}`}>
              {t.icon}{t.label}
              {t.id === 'calls' && <b className="absolute right-4 top-0 rounded-full bg-red-500 px-1.5 text-[13px] text-white">3</b>}
            </button>
          ))}
        </div>
        <CircleBtn className="!h-[64px] !w-[64px]"><SearchGlyph s={28} /></CircleBtn>
      </div>
    </Page>
  );
}
