import { Page, Title, NO_SB } from './AppShell';

const RECENTS = [
  { name: 'Bang Ucuk', kind: 'Video · Tidak terjawab', time: 'Yesterday', red: true },
  { name: 'Jae berisik', kind: 'Audio', time: 'Wednesday', red: false },
  { name: 'Mia (sepupu)', kind: 'Video', time: 'Aug 1', red: false },
];

export default function FaceTime() {
  return (
    <Page bg="bg-black">
      <Title>FaceTime</Title>
      <div className="mx-4 mb-3 flex gap-2">
        <button className="flex-1 rounded-xl bg-zinc-900 py-2.5 text-[15px] font-semibold text-[#007aff]">New FaceTime</button>
        <button className="flex-1 rounded-xl bg-zinc-900 py-2.5 text-[15px] font-semibold text-[#007aff]">Create Link</button>
      </div>
      <div className={`min-h-0 flex-1 overflow-y-auto ${NO_SB}`}>
        {RECENTS.map(r => (
          <div key={r.name} className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
            <div><div className={`text-[17px] font-semibold ${r.red ? 'text-red-500' : ''}`}>{r.name}</div><div className="text-[13px] text-zinc-400">{r.kind}</div></div>
            <span className="text-[14px] text-zinc-500">{r.time}</span>
          </div>
        ))}
      </div>
    </Page>
  );
}
