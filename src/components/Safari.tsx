import { Page, Title, NO_SB } from './AppShell';

// "hasil history web (nanti dimasukin)" -> isi sesuai narasi.
const HISTORY: { day: string; items: { title: string; url: string; time: string }[] }[] = [
  { day: 'Today', items: [
    { title: 'Roti Gempol Bandung - jam buka', url: 'google.com', time: '23.40' },
    { title: 'Penginapan murah Lembang untuk rombongan', url: 'traveloka.com', time: '22.15' },
  ]},
  { day: 'Yesterday', items: [
    { title: 'Sewa Hiace Jakarta - Bandung', url: 'sewahiace.id', time: '19.02' },
    { title: 'Temaram Guest House - ulasan', url: 'maps.google.com', time: '16.30' },
    { title: 'Cara cek kondisi tol Cipularang', url: 'jasamarga.com', time: '11.47' },
  ]},
];

export default function Safari() {
  return (
    <Page bg="bg-black">
      <Title>History</Title>
      <div className="mx-4 mb-2 rounded-[10px] bg-zinc-900 px-3 py-1.5 text-[15px] text-zinc-400">Search History</div>
      <div className={`min-h-0 flex-1 overflow-y-auto ${NO_SB}`}>
        {HISTORY.map(g => (
          <div key={g.day}>
            <div className="bg-zinc-900 px-4 py-1 text-[13px] font-semibold text-zinc-400">{g.day}</div>
            {g.items.map(i => (
              <div key={i.title} className="flex items-center justify-between border-b border-zinc-800 px-4 py-2.5">
                <div className="min-w-0"><div className="truncate text-[15px]">{i.title}</div><div className="text-[13px] text-zinc-500">{i.url}</div></div>
                <span className="ml-3 text-[13px] text-zinc-500">{i.time}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Page>
  );
}
