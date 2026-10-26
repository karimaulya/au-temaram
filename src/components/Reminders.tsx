import { useState } from 'react';
import { Page, Title, NO_SB } from './AppShell';

const INIT = [
  { id: 1, text: 'Sarapan di Roti Gempol · 06.10', done: false },
  { id: 2, text: 'Beli bekal perjalanan', done: true },
  { id: 3, text: 'Isi bensin & cek tekanan ban', done: true },
  { id: 4, text: 'Bawa charger dan power bank', done: false },
  { id: 5, text: 'Kabarin owner penginapan', done: false },
];

export default function Reminders() {
  const [items, setItems] = useState(INIT);
  const toggle = (id: number) => setItems(l => l.map(i => i.id === id ? { ...i, done: !i.done } : i));
  return (
    <Page>
      <Title><span className="text-[#007aff]">Today</span></Title>
      <div className={`mx-4 min-h-0 overflow-y-auto rounded-xl bg-zinc-900 ${NO_SB}`}>
        {items.map(i => (
          <button key={i.id} onClick={() => toggle(i.id)} className="flex w-full items-center gap-3 border-b border-zinc-800 px-4 py-3 text-left">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-[13px] ${i.done ? 'border-[#007aff] bg-[#007aff] text-white' : 'border-zinc-700'}`}>{i.done ? '✓' : ''}</span>
            <span className={`text-[16px] ${i.done ? 'text-zinc-500 line-through' : ''}`}>{i.text}</span>
          </button>
        ))}
      </div>
    </Page>
  );
}
