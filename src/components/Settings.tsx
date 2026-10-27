import { useState } from 'react';
import { Page, Toggle, BottomSearch, NO_SB } from './AppShell';
import { useStory } from '../story/StoryProvider';
import { STEPS } from '../story/script';

const IC: Record<string, string> = {
  plane: 'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z',
  wifi: 'M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01',
  bt: 'm7 7 10 10-5 5V2l5 5L7 17',
  cell: 'M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0',
  vol: 'M11 5 6 9H2v6h4l5 4zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14',
  moon: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z',
  hour: 'M5 22h14M5 2h14M17 22v-4.17a2 2 0 0 0-.59-1.42L12 12l-4.41 4.41A2 2 0 0 0 7 17.83V22M7 2v4.17a2 2 0 0 0 .59 1.42L12 12l4.41-4.41A2 2 0 0 0 17 6.17V2',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41',
  batt: 'M4 7h13a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zM22 11v2',
  hand: 'M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15',
};
const GROUPS: { label: string; icon: string; color: string; toggle?: boolean; value?: string }[][] = [
  [{ label: 'Airplane Mode', icon: 'plane', color: 'bg-orange-500', toggle: true }, { label: 'Wi-Fi', icon: 'wifi', color: 'bg-blue-500', value: 'Not Connected' }, { label: 'Bluetooth', icon: 'bt', color: 'bg-blue-500', value: 'On' }, { label: 'Cellular', icon: 'cell', color: 'bg-green-500' }],
  [{ label: 'Notifications', icon: 'bell', color: 'bg-red-500' }, { label: 'Sounds & Haptics', icon: 'vol', color: 'bg-pink-500' }, { label: 'Focus', icon: 'moon', color: 'bg-indigo-500' }, { label: 'Screen Time', icon: 'hour', color: 'bg-indigo-500' }],
  [{ label: 'General', icon: 'gear', color: 'bg-gray-500' }, { label: 'Display & Brightness', icon: 'sun', color: 'bg-blue-500' }, { label: 'Battery', icon: 'batt', color: 'bg-green-500', value: '98%' }, { label: 'Privacy & Security', icon: 'hand', color: 'bg-blue-500' }],
];
const Chev = () => <svg width="9" height="15" viewBox="0 0 9 15" fill="none" stroke="#636366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m1.5 1.5 6 6-6 6" /></svg>;

export default function Settings() {
  const { state, reset } = useStory();
  const [on, setOn] = useState<Record<string, boolean>>({});
  const finished = state.step >= STEPS.length;   // cerita selesai -> tombol reset muncul
  return (
    <Page>
      <div className={`min-h-0 flex-1 overflow-y-auto px-4 pb-32 ${NO_SB}`}>
        <h1 className="px-1 pb-4 pt-12 text-[38px] font-bold tracking-tight">Settings</h1>
        <div className="mb-5 flex items-center gap-4 rounded-[28px] bg-zinc-900 p-4">
          <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gradient-to-br from-zinc-500 to-zinc-700 text-[28px] font-semibold">A</div>
          <div className="flex-1"><div className="text-[22px] font-semibold">Asahi</div><div className="text-[14px] leading-tight text-zinc-400">Apple ID, iCloud, Media & Purchases</div></div>
          <Chev />
        </div>
        {GROUPS.map((g, gi) => (
          <div key={gi} className="mb-5 overflow-hidden rounded-[28px] bg-zinc-900 pl-4">
            {g.map((r, ri) => (
              <div key={r.label} className="flex items-center gap-4 pr-4">
                <span className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] ${r.color}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={IC[r.icon]} /></svg>
                </span>
                <div className={`flex flex-1 items-center gap-2 py-[13px] ${ri ? 'border-t border-zinc-800' : ''}`}>
                  <span className="flex-1 text-[17px]">{r.label}</span>
                  {r.toggle ? <Toggle on={!!on[r.label]} onChange={v => setOn(s => ({ ...s, [r.label]: v }))} /> : <>{r.value && <span className="text-[16px] text-zinc-400">{r.value}</span>}<Chev /></>}
                </div>
              </div>
            ))}
          </div>
        ))}
        {finished && (
          <button onClick={reset} className="mb-5 w-full rounded-[28px] bg-zinc-900 py-3.5 text-[17px] text-red-500 active:bg-zinc-800">Reset Cerita</button>
        )}
      </div>
      <BottomSearch />
    </Page>
  );
}
