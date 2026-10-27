import { useState } from 'react';
import type { AppScreen } from '../types';
import { useStory } from '../story/StoryProvider';
import { Page, BackCircle, BottomSearch, NO_SB } from './AppShell';

// Foto avatar: taruh di public/avatars/ (persegi, mis. 256x256). Kalau file tidak ada, otomatis pakai inisial.
// chatId diisi kalau kontak punya room chat di cerita (tombol "message" aktif).
const CONTACTS: { name: string; phone: string; chatId?: string; photo?: string }[] = [
  { name: 'Bang Ajun', phone: '0812-1111-0001', photo: '/Avatar/Bang Ajun.jpeg' },
  { name: 'Bang Ji', phone: '0812-1111-0002', photo: '/Avatar/Bang Ji.jpeg' },
  { name: 'Bang Ochi', phone: '0812-1111-0003', photo: '/Avatar/Bang Ochi.jpeg' },
  { name: 'Bang Ucuk', phone: '0812-1111-0004', chatId: 'ucuk', photo: '/Avatar/Bang Ucuk.jpeg' },
  { name: 'Doyie', phone: '0812-1111-0005', photo: '/Avatar/Doyie.jpeg' },
  { name: 'Haruto', phone: '0812-1111-0006', photo: '/Avatar/Haruto.jpeg' },
  { name: 'Jae berisik', phone: '0812-1111-0007', chatId: 'jae', photo: '/Avatar/Jae berisik.jpeg' },
  { name: 'Jeo', phone: '0812-1111-0008', chatId: 'jeo', photo: '/Avatar/Jeo.jpeg' },
  { name: 'Junghwan', phone: '0812-1111-0009', photo: '/Avatar/Junghwan.jpeg' },
  { name: 'Mia (sepupu)', phone: '0812-1111-0010', chatId: 'mia', photo: '/Avatar/Mia (sepupu).jpeg' },
  { name: 'Temaram Guest House', phone: '0812-1111-0011', chatId: 'owner', photo: '/Avatar/Temaram Guest House.jpeg' },
];
const ASAHI_PHOTO = '/Avatar/Asahi.jpeg';

const initials = (n: string) => { const w = n.replace(/\(.*\)/, '').trim().split(/\s+/); return (w.length > 1 ? w[0][0] + w[1][0] : w[0].slice(0, 1)).toUpperCase(); };
const Avatar = ({ name, photo, size = 56 }: { name: string; photo?: string; size?: number }) => {
  const [failed, setFailed] = useState(false);
  if (photo && !failed) return (
    <img src={photo} alt={name} onError={() => setFailed(true)} draggable={false}
      style={{ width: size, height: size }} className="shrink-0 rounded-full object-cover" />
  );
  return (
    <span style={{ width: size, height: size, fontSize: size * 0.4 }} className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#8a96d6] to-[#5560ad] font-semibold text-white">{initials(name)}</span>
  );
};
const LETTERS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '#'];

export default function Contacts({ onOpenApp, embedded = false }: { onOpenApp: (s: AppScreen) => void; embedded?: boolean }) {
  const { state, openChat } = useStory();
  const [sel, setSel] = useState<string | null>(null);
  const c = CONTACTS.find(x => x.name === sel);
  const canMsg = (id?: string) => !!id && (state.wipedKeep ? state.wipedKeep.includes(id) : state.unlockedChunks.some(k => k.startsWith(id + '-')));

  if (c) return (
    <Page bare={embedded}>
      <div className="px-4 pt-2"><BackCircle onBack={() => setSel(null)} /></div>
      <div className="flex flex-col items-center pt-4">
        <Avatar name={c.name} photo={c.photo} size={104} />
        <h2 className="mt-3 text-[28px] font-semibold">{c.name}</h2>
        <button disabled={!canMsg(c.chatId)} onClick={() => { openChat(c.chatId!); onOpenApp('imessage'); }}
          className="mt-4 rounded-full bg-zinc-900 px-9 py-2.5 text-[15px] text-[#0a84ff] active:opacity-60 disabled:text-zinc-600">message</button>
        <div className="mt-5 w-[calc(100%-32px)] rounded-[24px] bg-zinc-900 px-5 py-3">
          <div className="text-[13px] text-zinc-400">mobile</div><div className="text-[18px] text-[#0a84ff]">{c.phone}</div>
        </div>
      </div>
    </Page>
  );

  const sorted = [...CONTACTS].sort((a, b) => a.name.localeCompare(b.name));
  const sections = LETTERS.filter(l => sorted.some(x => (/[A-Z]/i.test(x.name[0]) ? x.name[0].toUpperCase() : '#') === l));
  return (
    <Page bare={embedded}>
      {!embedded && (
        <div className="flex items-center justify-between px-4 pt-2">
          <BackCircle onBack={() => onOpenApp('homescreen')} />
          <h1 className="absolute inset-x-0 text-center text-[19px] font-semibold">Contacts</h1>
          <span className="w-[44px]" />
        </div>
      )}
      <div className={`relative min-h-0 flex-1 overflow-y-auto pb-36 pl-4 pr-9 ${embedded ? 'pt-14' : 'pt-4'} ${NO_SB}`}>
        <div className="flex items-center gap-4 pb-3"><Avatar name="Asahi" photo={ASAHI_PHOTO} /><div><div className="text-[19px] font-medium">Asahi</div><div className="text-[15px] text-zinc-400">My Card</div></div></div>
        {sections.map(l => (
          <div key={l}>
            <div className="border-b border-zinc-800 pb-1 pt-3 text-[15px] text-zinc-400">{l}</div>
            {sorted.filter(x => (/[A-Z]/i.test(x.name[0]) ? x.name[0].toUpperCase() : '#') === l).map(x => (
              <button key={x.name} onClick={() => setSel(x.name)} className="flex w-full items-center gap-4 py-2.5 text-left active:opacity-60">
                <Avatar name={x.name} photo={x.photo} /><span className="flex-1 border-b border-zinc-800 py-4 text-[19px] font-medium">{x.name}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute right-1.5 top-[130px] flex flex-col items-center text-[12px] font-semibold leading-[17px] text-[#0a84ff]">{LETTERS.map(l => <span key={l}>{l}</span>)}</div>
      {!embedded && <BottomSearch action={<span className="text-[30px] font-light leading-none">+</span>} />}
    </Page>
  );
}
