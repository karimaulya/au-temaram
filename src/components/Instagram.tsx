import { useRef, useState } from 'react';
import type { ImgHTMLAttributes } from 'react';
import { useAfter, fmtID, parseISO } from '../story/dates';

// ====== DATA (dari doc AU: Asahi @asahi__) ======
// Foto: taruh di /public/photos/instagram/ (nama file di bawah). Kalau file belum ada, tampil kotak gelap bertuliskan keterangan.
// Foto profil: /public/Avatar/Asahi.jpeg
const PROFILE = {
  username: 'asahi__',
  displayName: 'Asahi',
  bio: 'A dan S di nama gue stands for arsitektur harga mati.',
  followers: 568,
  following: 876,
  avatar: '/IG/Foto Profil.jpeg',
};

const HIGHLIGHTS = [
  { id: 'new', title: 'New', isAdd: true },
  { id: 'h1', title: 'Ujang Kedu', img: `/IG/hl-ujang-kedu.jpeg` },
  { id: 'h2', title: 'Ar(shit)', img: `/IG/hl-arshit.jpeg` },
  { id: 'h3', title: '🛖', img: `/IG/hl-gubuk.jpeg` },
  { id: 'h4', title: '⚽', img: `/IG/hl-bole.jpeg` },
];

interface Post {
  id: number;
  type: 'photo' | 'video' | 'carousel';
  images: string[];          // carousel = lebih dari 1 gambar
  caption: string;
  likes: number;
  at: string;                // tanggal ISO; tampilannya diatur story/dates.ts
  label?: string;            // teks di atas thumbnail grid
}
// Urutan array = urutan grid (kiri-atas = terbaru). Di doc dihitung dari bawah: Satu = paling lama.
const POSTS: Post[] = [
  { id: 6, type: 'photo', images: [`/IG/post-6.jpeg`], caption: 'To many more destinations, bray.', likes: 61, at: '2025-08-06' },
  { id: 5, type: 'photo', images: [`/IG/post-5.jpeg`], caption: 'Takut (komdis)', likes: 47, at: '2025-07-20' },
  { id: 4, type: 'photo', images: [`/IG/post-4.jpeg`], caption: 'Hari kelahiran pancasila', likes: 52, at: '2025-06-01' },
  { id: 3, type: 'photo', images: [`/IG/post-3.jpeg`], caption: 'Satu ditambah satu sama dengan gila', likes: 58, at: '2025-04-17' },
  { id: 2, type: 'photo', images: [`/IG/post-2.jpeg`], caption: 'Gober (godin bersama)', likes: 44, at: '2025-03-15' },
  { id: 1, type: 'photo', images: [`/IG/post-1.jpeg`], caption: 'Selalu ingin kembali ke Yogyarkarta.', likes: 39, at: '2024-12-24' },
];

// Gambar dengan cadangan: kalau file belum ada, tampil kotak gelap + teks (bukan ikon rusak)
function Pic({ src, alt = '', fallback, className = '', ...rest }:
  { src: string; alt?: string; fallback?: string; className?: string } & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'className'>) {
  const [bad, setBad] = useState(false);
  if (bad) return (
    <div className={`flex items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-950 p-1 text-center text-[11px] leading-tight text-zinc-500 ${className}`}>{fallback}</div>
  );
  return <img src={src} alt={alt} onError={() => setBad(true)} className={`object-cover ${className}`} {...rest} />;
}

const Icon = ({ d, size = 24, fill = 'none', sw = 2 }: { d: string; size?: number; fill?: string; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const HEART = 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z';

// ====== PRATINJAU POSTINGAN ======
function PostViewer({ post, onClose }: { post: Post; onClose: () => void }) {
  const after = useAfter();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [slide, setSlide] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const go = (i: number) => track.current?.scrollTo({ left: i * track.current.clientWidth, behavior: 'smooth' });

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-black pt-[44px]">
      <div className="flex items-center gap-3 border-b border-zinc-800 px-3 py-2">
        <button onClick={onClose} className="active:opacity-50" title="Kembali">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <div className="leading-tight">
          <div className="text-[11px] text-zinc-400">{PROFILE.username}</div>
          <div className="text-[16px] font-bold">Posts</div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <Pic src={PROFILE.avatar} fallback="A" className="h-8 w-8 rounded-full" />
          <span className="text-[13px] font-bold">{PROFILE.username}</span>
        </div>

        <div className="relative w-full bg-black">
          <div ref={track} onScroll={e => setSlide(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
            className="flex aspect-[4/5] w-full snap-x snap-mandatory overflow-x-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {post.images.map((src, i) => (
              <Pic key={i} src={src} fallback={post.caption} onDoubleClick={() => setLiked(true)} className="h-full w-full shrink-0 snap-center" />
            ))}
          </div>
          {post.type === 'video' && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/45 text-white"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="7 4 20 12 7 20" /></svg></div>
            </div>
          )}
          {post.images.length > 1 && <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-[12px] text-white">{slide + 1}/{post.images.length}</div>}
        </div>

        {post.images.length > 1 && (
          <div className="flex justify-center gap-1 pt-2.5">
            {post.images.map((_, i) => <button key={i} onClick={() => go(i)} className={`h-1.5 w-1.5 rounded-full ${i === slide ? 'bg-[#0095f6]' : 'bg-zinc-700'}`} />)}
          </div>
        )}

        <div className="flex items-center gap-4 px-3.5 pt-2.5">
          <button onClick={() => setLiked(l => !l)} className={`active:scale-90 transition-transform ${liked ? 'text-[#ff3040]' : 'text-white'}`}>
            <Icon d={HEART} size={26} fill={liked ? 'currentColor' : 'none'} />
          </button>
          <Icon d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.2A8.4 8.4 0 1 1 21 11.5z" size={25} />
          <Icon d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" size={25} />
          <button onClick={() => setSaved(s => !s)} className="ml-auto active:scale-90 transition-transform">
            <Icon d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" size={25} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="px-3.5 pb-8 pt-1.5 text-[13.5px] leading-snug">
          <div className="font-bold">{post.likes + (liked ? 1 : 0)} likes</div>
          {post.caption && <p className="mt-0.5"><b>{PROFILE.username}</b> {post.caption}</p>}
          <div className="mt-1.5 text-[11px] text-zinc-400">{fmtID(parseISO(post.at), after).toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
}

// ====== PROFIL ======
export default function Instagram() {
  const [subTab, setSubTab] = useState<'grid' | 'reels' | 'repost' | 'tagged'>('grid');
  const [open, setOpen] = useState<Post | null>(null);
  const tabs: [typeof subTab, string][] = [
    ['grid', 'M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18'],
    ['reels', 'M6 2h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4zM10 8l6 4-6 4z'],
    ['repost', 'M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3'],
    ['tagged', 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  ];
  const shown = subTab === 'grid' ? POSTS : subTab === 'reels' ? POSTS.filter(p => p.type === 'video') : [];

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-black font-sans text-white select-none">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain pb-6 pt-[44px] no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
          <Icon d="M12 5v14M5 12h14" />
          <div className="flex items-center gap-1.5">
            <span className="text-[17px] font-bold tracking-tight">{PROFILE.username}</span>
          </div>
          <Icon d="M3 6h18M3 12h18M3 18h18" size={22} />
        </div>

        <div className="px-4 pb-2 pt-3">
          <div className="flex items-center justify-between">
            <div className="relative mt-2">
              <Pic src={PROFILE.avatar} alt={PROFILE.username} fallback="A" className="h-20 w-20 rounded-full border-2 border-black text-[28px] shadow-sm ring-1 ring-zinc-800" />
            </div>
            <div className="ml-6 flex flex-1 flex-col">
              <span className="mb-1 text-[14px] font-bold">{PROFILE.displayName}</span>
              <div className="flex justify-between text-center">
                {[[POSTS.length, 'posts'], [PROFILE.followers, 'followers'], [PROFILE.following, 'following']].map(([n, l]) => (
                  <div key={l} className="flex flex-col"><span className="text-[16px] font-bold">{n}</span><span className="text-[13px] text-zinc-400">{l}</span></div>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-2 text-[13px] leading-snug">{PROFILE.bio}</p>
          <div className="mt-3.5 flex gap-2">
            <button className="flex-1 rounded-[10px] bg-zinc-800 py-1.5 text-[13.5px] font-semibold">Edit profile</button>
            <button className="flex-1 rounded-[10px] bg-zinc-800 py-1.5 text-[13.5px] font-semibold">Share profile</button>
          </div>

          <div className="mt-4 flex items-center gap-3.5 overflow-x-auto pb-1 no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {HIGHLIGHTS.map(h => (
              <div key={h.id} className="flex shrink-0 flex-col items-center">
                {'isAdd' in h && h.isAdd
                  ? <div className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-700 text-[24px] font-light">+</div>
                  : <div className="h-16 w-16 rounded-full border border-zinc-800 bg-black p-[2px]"><Pic src={h.img ?? ''} fallback={h.title} className="h-full w-full rounded-full text-[22px]" /></div>}
                <span className="mt-1 max-w-[64px] truncate text-[11px] text-zinc-200">{h.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 flex border-t border-zinc-800">
          {tabs.map(([id, d]) => (
            <button key={id} onClick={() => setSubTab(id)} className={`flex flex-1 justify-center py-2.5 ${subTab === id ? 'border-b-2 border-white text-white' : 'text-zinc-500'}`}>
              <Icon d={d} size={22} />
            </button>
          ))}
        </div>

        {shown.length === 0 && <p className="pt-10 text-center text-[13px] text-zinc-500">Belum ada postingan</p>}
        <div className="grid grid-cols-3 gap-[2px]">
          {shown.map(p => (
            <button key={p.id} onClick={() => setOpen(p)} className="relative aspect-square overflow-hidden bg-zinc-900 active:opacity-80">
              <Pic src={p.images[0]} fallback={p.caption} className="h-full w-full" />
              <div className="absolute right-1.5 top-1.5 text-white drop-shadow-md">
                {p.type === 'video' && <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21" /></svg>}
                {p.type === 'carousel' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="13" height="13" rx="2" /><path d="M8 21h10a2 2 0 0 0 2-2V9" /></svg>}
              </div>
              {p.label && <div className="absolute inset-0 flex items-center justify-center bg-black/25 p-1"><span className="text-center text-[11px] font-black uppercase tracking-wider text-white drop-shadow-md">{p.label}</span></div>}
            </button>
          ))}
        </div>
      </div>

      {open && <PostViewer key={open.id} post={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
