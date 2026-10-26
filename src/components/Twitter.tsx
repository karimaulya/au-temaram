import { useState } from 'react';

// ====== DATA (dari doc AU "Temaram (5)") ======
// Semua tweet harus berakhir di 2025 (Asahi koma sejak 7 Agustus 2025).
const ME = {
  name: 'Asahi',
  handle: 'asahihihi',
  bio: 'dump',
  // TODO: tidak ada di doc, isi/ubah sesuai keinginan (location kosong = disembunyikan)
  location: '',
  joined: 'Joined March 2021',
  following: 120,
  followers: 95,
  // TODO: taruh file di public/twitter/ (foto profil & header dari folder Drive di doc)
  avatar: '/twitter/avatar.jpg',
  banner: '/twitter/header.jpg',
};

interface Tweet {
  id: number;
  at: string;            // ISO lokal, dipakai untuk urutan & tanggal
  text: string;
  replies: number; reposts: number; likes: number; views: string;   // TODO: angka ini placeholder
  img?: string;          // TODO: taruh gambar di public/twitter/
  quoteId?: number;      // quote tweet: menampilkan tweet lain di dalamnya
  reply?: boolean;
  pinned?: boolean;
}

const TWEETS: Tweet[] = [
  { id: 1, at: '2025-08-07T03:30', text: 'Otw bandung bray', img: '/twitter/2025-08-07.jpg', replies: 3, reposts: 0, likes: 24, views: '312' },
  { id: 2, at: '2025-07-05T23:45', text: 'Kalau maket adalah orang, niscaya akan gue jodohin dia sama jaehyuk', replies: 2, reposts: 0, likes: 17, views: '241' },
  { id: 3, at: '2025-03-03T10:05', text: 'Bajak hp bang asa', img: '/twitter/2025-03-03.jpg', replies: 1, reposts: 0, likes: 19, views: '198' },
  { id: 4, at: '2025-02-25T18:30', text: 'Hujan-hujan, masih nugas di kampus, dibawain bajigur sama bang ucuk', replies: 2, reposts: 0, likes: 31, views: '356' },
  { id: 5, at: '2025-01-01T00:15', text: 'Bang Ji dan agendanya nemenin gue tiap tahun baru (bukan pacaran)', img: '/twitter/2025-01-01.jpg', replies: 3, reposts: 1, likes: 28, views: '402' },
  // Di doc tertulis "25 Desember 2025" me-retweet "23 Agustus 2025", tapi urutan doc & cerita (koma sejak 7 Agustus 2025)
  // menunjukkan maksudnya tahun 2024. Kalau memang 2025, ubah tahun di sini dan di tweet id 7.
  { id: 6, at: '2024-12-25T16:15', text: 'Oh, sekarang punya :)', quoteId: 7, replies: 1, reposts: 0, likes: 15, views: '177' },
  { id: 7, at: '2024-08-23T14:30', text: 'Enggak punya inspirasi buat desain rumah, karena temanya is family tapi i don’t even have a family', replies: 4, reposts: 2, likes: 46, views: '620' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// gaya X: tahun berjalan (2025 di dalam cerita) tanpa tahun, tahun lain pakai tahun
const fmtDate = (at: string) => {
  const d = new Date(at);
  const base = `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  return d.getFullYear() === 2025 ? base : `${base}, ${d.getFullYear()}`;
};
const fmt = (n: number) => (n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'K' : String(n));
const Ic = ({ d, s = 18 }: { d: string; s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

// gambar yang belum ada tidak merusak tampilan
function Photo({ src, className }: { src: string; className: string }) {
  const [bad, setBad] = useState(false);
  return bad ? <div className={`${className} bg-zinc-800`} /> : <img src={src} alt="" onError={() => setBad(true)} className={className} />;
}
function Avatar({ className }: { className: string }) {
  const [bad, setBad] = useState(false);
  return bad
    ? <div className={`${className} flex items-center justify-center bg-zinc-600 font-bold`}>{ME.name[0]}</div>
    : <img src={ME.avatar} alt={ME.handle} onError={() => setBad(true)} className={`${className} object-cover`} />;
}

export default function Twitter() {
  const [tab, setTab] = useState<'Posts' | 'Replies' | 'Media'>('Posts');
  const [liked, setLiked] = useState<number[]>([]);
  const list = TWEETS.filter(t => (tab === 'Posts' ? !t.reply : tab === 'Replies' ? t.reply : !!t.img))
    .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.at.localeCompare(a.at));

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-black font-sans text-white select-none">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain pb-8 no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* banner + avatar */}
        <div className="relative h-[120px] w-full bg-zinc-700">
          <Photo src={ME.banner} className="h-full w-full object-cover" />
        </div>
        <div className="relative px-4">
          <Avatar className="-mt-10 h-20 w-20 rounded-full border-4 border-black text-[32px]" />
          <button className="absolute right-4 top-3 rounded-full border border-zinc-700 px-4 py-1.5 text-[14px] font-bold">Edit profile</button>

          <div className="mt-2 text-[20px] font-extrabold leading-tight">{ME.name}</div>
          <div className="text-[15px] text-zinc-400">@{ME.handle}</div>
          <p className="mt-2 text-[15px] leading-snug">{ME.bio}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-zinc-400">
            {ME.location && <span className="flex items-center gap-1"><Ic d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" s={15} />{ME.location}</span>}
            <span className="flex items-center gap-1"><Ic d="M3 5h18v16H3zM16 3v4M8 3v4M3 11h18" s={15} />{ME.joined}</span>
          </div>
          <div className="mt-2 flex gap-4 text-[14px] text-zinc-400">
            <span><b className="text-white">{ME.following}</b> Following</span>
            <span><b className="text-white">{ME.followers}</b> Followers</span>
          </div>
        </div>

        {/* tabs */}
        <div className="mt-3 flex border-b border-zinc-800">
          {(['Posts', 'Replies', 'Media'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className="relative flex-1 py-3 text-[15px] active:bg-zinc-900">
              <span className={tab === t ? 'font-bold text-white' : 'text-zinc-400'}>{t}</span>
              {tab === t && <span className="absolute bottom-0 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-[#1d9bf0]" />}
            </button>
          ))}
        </div>

        {list.length === 0 && <p className="pt-10 text-center text-[14px] text-zinc-500">Belum ada posting</p>}
        {list.map(t => {
          const isLiked = liked.includes(t.id);
          const quoted = t.quoteId ? TWEETS.find(q => q.id === t.quoteId) : undefined;
          return (
            <div key={t.id} className="border-b border-zinc-800 px-4 py-3">
              {t.pinned && <div className="mb-1 ml-12 flex items-center gap-1.5 text-[12px] font-semibold text-zinc-400"><Ic d="M12 17v5M9 3h6l-1 7 3 3v2H7v-2l3-3z" s={13} />Pinned</div>}
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-[15px]">
                    <b className="truncate">{ME.name}</b>
                    <span className="truncate text-zinc-400">@{ME.handle} · {fmtDate(t.at)}</span>
                  </div>
                  <p className="mt-0.5 whitespace-pre-wrap text-[15px] leading-snug">{t.text}</p>
                  {t.img && <Photo src={t.img} className="mt-2 aspect-[4/3] w-full rounded-2xl border border-zinc-800 object-cover" />}

                  {quoted && (
                    <div className="mt-2 rounded-2xl border border-zinc-800 p-3">
                      <div className="flex items-center gap-1.5 text-[14px]">
                        <Avatar className="h-5 w-5 rounded-full text-[10px]" />
                        <b className="truncate">{ME.name}</b>
                        <span className="truncate text-zinc-400">@{ME.handle} · {fmtDate(quoted.at)}</span>
                      </div>
                      <p className="mt-1 text-[14px] leading-snug">{quoted.text}</p>
                    </div>
                  )}

                  <div className="mt-2.5 flex items-center justify-between pr-6 text-[13px] text-zinc-400">
                    <span className="flex items-center gap-1.5"><Ic d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.2A8.4 8.4 0 1 1 21 11.5z" />{fmt(t.replies)}</span>
                    <span className="flex items-center gap-1.5"><Ic d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" />{fmt(t.reposts)}</span>
                    <button onClick={() => setLiked(l => (isLiked ? l.filter(x => x !== t.id) : [...l, t.id]))} className={`flex items-center gap-1.5 active:scale-90 transition-transform ${isLiked ? 'text-[#f91880]' : ''}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                      {fmt(t.likes + (isLiked ? 1 : 0))}
                    </button>
                    <span className="flex items-center gap-1.5"><Ic d="M3 20V10M9 20V4M15 20v-8M21 20V8" />{t.views}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* header kecil melayang di atas banner */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[44px] bg-gradient-to-b from-black/35 to-transparent" />
    </div>
  );
}
