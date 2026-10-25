import { useState } from 'react';

// Data Profil Pengguna (Sesuai Screenshot 2: @ownersahi)
const PROFILE = {
  username: 'ownersahi',
  displayName: 'oys',
  note: 'Obsessed with...',
  bio: 'love sunlight esp asahi',
  music: 'Voyager',
  artist: 'Xdinary Heroes',
  posts: 22,
  followers: 75,
  following: 499,
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop'
};

// Data Story Instagram (Sesuai Screenshot 1)
const STORIES = [
  { id: 'me', username: 'Your story', avatar: PROFILE.avatar, isUser: true, hasUnseen: false },
  { id: '1', username: 'vnreallife', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop', hasUnseen: true },
  { id: '2', username: 'lupiii16_', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop', hasUnseen: true },
  { id: '3', username: 'sideofr44_', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop', hasUnseen: true },
];

// Data Highlights Profil (Sesuai Screenshot 2)
const HIGHLIGHTS = [
  { id: 'new', title: 'New', isAdd: true },
  { id: 'h1', title: '250426 ❤️', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop' },
  { id: 'h2', title: 'kadik 💨', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop' },
  { id: 'h3', title: 'w/uni friends', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=200&auto=format&fit=crop' },
  { id: 'h4', title: '35 pt 2', img: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=200&auto=format&fit=crop' },
];

// Grid Postingan Profil (Sesuai Screenshot 2)
const PROFILE_POSTS = [
  { id: 1, type: 'video', img: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=400&auto=format&fit=crop', label: 'upside down' },
  { id: 2, type: 'carousel', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop' },
  { id: 3, type: 'carousel', img: 'https://images.unsplash.com/photo-1514315384763-ba401779410f?q=80&w=400&auto=format&fit=crop', label: 'ASAHI' },
  { id: 4, type: 'video', img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=400&auto=format&fit=crop' },
  { id: 5, type: 'video', img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=400&auto=format&fit=crop', label: 'Family Trip!' },
  { id: 6, type: 'carousel', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop' },
];

export default function Instagram() {
  const [currentTab, setCurrentTab] = useState<'feed' | 'profile'>('feed');
  const [profileSubTab, setProfileSubTab] = useState<'grid' | 'reels' | 'repost' | 'tagged'>('grid');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="relative flex h-full w-full flex-col bg-white text-black select-none overflow-hidden font-sans">
      
      {/* ======================================================== */}
      {/* TAMPILAN 1: BERANDA FEED (SESUAI SCREENSHOT 1) */}
      {/* ======================================================== */}
      {currentTab === 'feed' && (
        <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar pt-[44px] pb-[88px]">
          
          {/* Header Instagram Terbaru */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
            {/* Tombol Buat (+) */}
            <button className="text-black active:opacity-50">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>

            {/* Logo Instagram */}
            <span 
              className="text-[25px] font-bold tracking-tight text-gray-900 cursor-pointer"
              style={{ fontFamily: "'Grandista', 'Billabong', cursive, sans-serif" }}
            >
              Instagram
            </span>

            {/* Notifikasi Hati */}
            <button className="text-black active:opacity-50">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          {/* Stories Tray */}
          <div className="flex items-center gap-3.5 overflow-x-auto px-3.5 py-3 border-b border-gray-100 no-scrollbar">
            {STORIES.map((s) => (
              <div key={s.id} className="flex flex-col items-center shrink-0 cursor-pointer group active:opacity-80">
                <div className="relative">
                  <div className={`h-[72px] w-[72px] rounded-full p-[2.5px] ${
                    s.isUser ? '' : 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]'
                  }`}>
                    <img 
                      src={s.avatar} 
                      alt={s.username} 
                      className="h-full w-full rounded-full border-2 border-white object-cover" 
                    />
                  </div>
                  {/* Badge + pada Your Story */}
                  {s.isUser && (
                    <div className="absolute bottom-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white text-[13px] font-bold border-2 border-white">
                      +
                    </div>
                  )}
                </div>
                <span className="mt-1 text-[11.5px] font-normal text-gray-800 tracking-tight max-w-[70px] truncate text-center">
                  {s.username}
                </span>
              </div>
            ))}
          </div>

          {/* Feed Post: Official KVibes (Persis Screenshot 1) */}
          <div className="flex flex-col border-b border-gray-100 pb-3">
            
            {/* Header Postingan */}
            <div className="flex items-center justify-between px-3.5 py-2.5">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center text-white text-[8px] font-extrabold overflow-hidden">
                  <span className="scale-90 font-mono tracking-tighter">KVIBES</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[13px] font-bold text-black">officialkvibes</span>
                  {/* Verified Badge */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#0095f6">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m9 12 2 2 4-4" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
              </div>

              {/* Menu Kanan (Dua garis mendatar sesuai screenshot) */}
              <button className="text-gray-900 active:opacity-50">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="9" x2="20" y2="9"></line>
                  <line x1="4" y1="15" x2="20" y2="15"></line>
                </svg>
              </button>
            </div>

            {/* Gambar Postingan (KVIBES.ID - Idol Girl News Card) */}
            <div className="relative aspect-[4/5] w-full bg-zinc-900 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop" 
                alt="KVIBES Post" 
                className="h-full w-full object-cover" 
              />
              
              {/* Overlay Berita KVIBES.ID persis screenshot 1 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 p-4 flex flex-col justify-between text-white">
                {/* Logo Atas */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[18px] font-black tracking-tight drop-shadow-md">
                    KV<span className="text-orange-400">I</span>BES.ID
                  </span>
                </div>

                {/* Banner Teks Bawah */}
                <div className="flex flex-col gap-1 pb-1">
                  <div className="inline-flex items-center gap-1 self-start rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                    <span>!</span> NEWS
                  </div>
                  <h3 className="text-[17px] font-black tracking-tight leading-snug drop-shadow-md">
                    A20 LITE
                  </h3>
                  <p className="text-[13px] font-bold text-white leading-tight drop-shadow-md">
                    Fans China Tawarkan Pinjaman untuk Bantu Orang Tua Aijing A20 LITE Lunasi Hutang
                  </p>
                  <span className="text-[9px] text-gray-300 font-mono tracking-wider pt-1 self-end">
                    SOURCE : X.COM
                  </span>
                </div>
              </div>
            </div>

            {/* Tombol Action Postingan */}
            <div className="flex items-center justify-between px-3.5 pt-3 pb-1 text-black">
              <div className="flex items-center gap-4">
                {/* Love */}
                <button onClick={() => setIsLiked(!isLiked)} className="active:scale-125 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={isLiked ? "#ff3040" : "none"} stroke={isLiked ? "#ff3040" : "currentColor"} strokeWidth="1.9">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
                {/* Comment */}
                <button className="active:opacity-50">
                  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </button>
                {/* Share Paper Plane */}
                <button className="active:opacity-50">
                  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>

              {/* Bookmark Save */}
              <button onClick={() => setIsSaved(!isSaved)} className="active:scale-125 transition-transform">
                <svg width="23" height="23" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            </div>

            {/* Waktu Postingan */}
            <div className="px-3.5 text-[11px] text-gray-400 font-normal">
              3 hours ago
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAMPILAN 2: PROFIL @OWNERSAHI (SESUAI SCREENSHOT 2) */}
      {/* ======================================================== */}
      {currentTab === 'profile' && (
        <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar pt-[44px] pb-[88px]">
          
          {/* Header Profil */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
            {/* Create (+) */}
            <button className="text-black active:opacity-50">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>

            {/* Username dengan Icon Gembok & Chevron */}
            <div className="flex items-center gap-1.5 cursor-pointer active:opacity-60">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" strokeWidth="2"></path>
              </svg>
              <span className="text-[17px] font-bold text-black tracking-tight">{PROFILE.username}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            {/* Kanan: Threads Icon & Menu Hamburger */}
            <div className="flex items-center gap-4 text-black">
              {/* Threads Icon */}
              <button className="active:opacity-50">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a10 10 0 1 0 10 10c0-4.4-3.6-7-7-7s-6 2.5-6 6 2.5 5 5 5c2 0 3.5-.8 4.2-2"></path>
                  <circle cx="12" cy="12" r="2.5"></circle>
                </svg>
              </button>
              {/* Menu Hamburger */}
              <button className="active:opacity-50">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Area Profil Atas: Avatar + Note + Stats */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center justify-between">
              
              {/* Avatar dengan Note Bubble di Atasnya */}
              <div className="relative flex flex-col items-center">
                {/* Instagram Note Bubble: "Obsessed with..." */}
                <div className="absolute -top-7 left-0 z-10 flex items-center rounded-2xl bg-white px-2.5 py-1 text-[11px] font-medium text-gray-700 shadow-md border border-gray-100/90 whitespace-nowrap">
                  <span>{PROFILE.note}</span>
                  {/* Pointer segitiga bubble */}
                  <div className="absolute -bottom-1 left-4 h-2 w-2 rotate-45 bg-white border-b border-r border-gray-100"></div>
                </div>

                {/* Avatar Image */}
                <div className="relative mt-2">
                  <img 
                    src={PROFILE.avatar} 
                    alt={PROFILE.username} 
                    className="h-20 w-20 rounded-full border-2 border-white object-cover shadow-sm ring-1 ring-gray-200" 
                  />
                  {/* Plus Badge */}
                  <div className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white text-[14px] font-bold border-2 border-white">
                    +
                  </div>
                </div>
              </div>

              {/* Stats: Posts, Followers, Following */}
              <div className="flex flex-col ml-6 flex-1">
                <span className="text-[14px] font-bold text-black mb-1">{PROFILE.displayName}</span>
                <div className="flex justify-between text-center">
                  <div className="flex flex-col">
                    <span className="text-[16px] font-bold text-black">{PROFILE.posts}</span>
                    <span className="text-[13px] text-gray-500">posts</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[16px] font-bold text-black">{PROFILE.followers}</span>
                    <span className="text-[13px] text-gray-500">followers</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[16px] font-bold text-black">{PROFILE.following}</span>
                    <span className="text-[13px] text-gray-500">following</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bio */}
            <div className="mt-2 text-[13px] text-gray-900 leading-snug">
              <p>{PROFILE.bio}</p>
            </div>

            {/* Music Badge Khas IG */}
            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-[12px] font-semibold text-gray-800">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>{PROFILE.music}</span>
                <span className="text-gray-500 font-normal">{PROFILE.artist}</span>
              </div>
              <button className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[12px] font-semibold text-gray-800 active:opacity-60">
                <span>+</span> Add
              </button>
            </div>

            {/* Tombol Aksi: Edit profile, Share profile, Add contact */}
            <div className="mt-3.5 flex items-center gap-2">
              <button className="flex-1 rounded-[10px] bg-[#efefef] py-1.5 text-[13.5px] font-semibold text-black active:bg-gray-200 transition-colors">
                Edit profile
              </button>
              <button className="flex-1 rounded-[10px] bg-[#efefef] py-1.5 text-[13.5px] font-semibold text-black active:bg-gray-200 transition-colors">
                Share profile
              </button>
              <button className="rounded-[10px] bg-[#efefef] px-2.5 py-1.5 text-black active:bg-gray-200 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
              </button>
            </div>

            {/* Story Highlights */}
            <div className="mt-4 flex items-center gap-3.5 overflow-x-auto pb-1 no-scrollbar">
              {HIGHLIGHTS.map((h) => (
                <div key={h.id} className="flex flex-col items-center shrink-0 cursor-pointer group active:opacity-75">
                  {h.isAdd ? (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-300 bg-white">
                      <span className="text-[24px] font-light text-black">+</span>
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-full border border-gray-200 p-[2px] bg-white">
                      <img src={h.img} alt={h.title} className="h-full w-full rounded-full object-cover" />
                    </div>
                  )}
                  <span className="mt-1 text-[11px] text-gray-800 tracking-tight max-w-[64px] truncate text-center">
                    {h.title}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Tab Menu Profil: Grid, Reels, Repost, Tagged */}
          <div className="flex border-t border-gray-200 mt-2">
            <button 
              onClick={() => setProfileSubTab('grid')}
              className={`flex-1 flex justify-center py-2.5 ${profileSubTab === 'grid' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="3" y1="15" x2="21" y2="15"></line>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
              </svg>
            </button>
            <button 
              onClick={() => setProfileSubTab('reels')}
              className={`flex-1 flex justify-center py-2.5 ${profileSubTab === 'reels' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="4"></rect>
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"></polygon>
              </svg>
            </button>
            <button 
              onClick={() => setProfileSubTab('repost')}
              className={`flex-1 flex justify-center py-2.5 ${profileSubTab === 'repost' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 1l4 4-4 4"></path>
                <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                <path d="M7 23l-4-4 4-4"></path>
                <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
              </svg>
            </button>
            <button 
              onClick={() => setProfileSubTab('tagged')}
              className={`flex-1 flex justify-center py-2.5 ${profileSubTab === 'tagged' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          </div>

          {/* Grid Foto 3-Kolom Sesuai Screenshot 2 */}
          <div className="grid grid-cols-3 gap-[2px]">
            {PROFILE_POSTS.map((post) => (
              <div key={post.id} className="relative aspect-square bg-gray-100 cursor-pointer overflow-hidden group">
                <img src={post.img} alt="Post" className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
                
                {/* Badge Tipe di Sudut Kanan Atas */}
                <div className="absolute top-1.5 right-1.5 drop-shadow-md text-white">
                  {post.type === 'video' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6 3 20 12 6 21 6 3"></polygon>
                    </svg>
                  )}
                  {post.type === 'carousel' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="13" height="13" rx="2"></rect>
                      <path d="M8 21h10a2 2 0 0 0 2-2V9"></path>
                    </svg>
                  )}
                </div>

                {/* Teks Label Jika Ada (seperti Family Trip, ASAHI) */}
                {post.label && (
                  <div className="absolute inset-0 flex items-center justify-center p-1 text-center bg-black/25">
                    <span className="text-[11px] font-black uppercase tracking-wider text-white drop-shadow-md">
                      {post.label}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 3. FLOATING CAPSULE BOTTOM TAB BAR (PERSIS SCREENSHOT 1 & 2) */}
      {/* ======================================================== */}
      <div className="absolute bottom-4 left-4 right-4 z-40 flex items-center justify-between rounded-full bg-white/90 px-4 py-2 shadow-[0_6px_28px_rgba(0,0,0,0.18)] backdrop-blur-2xl border border-black/5 select-none">
        
        {/* Tab 1: Home (dengan soft pill background jika aktif) */}
        <button 
          onClick={() => setCurrentTab('feed')} 
          className={`flex items-center justify-center rounded-2xl px-3 py-1.5 transition-all ${
            currentTab === 'feed' ? 'bg-black/5 text-black' : 'text-gray-700 hover:text-black'
          }`}
          title="Home"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
          </svg>
        </button>

        {/* Tab 2: Reels */}
        <button 
          onClick={() => setCurrentTab('feed')} 
          className="flex items-center justify-center p-1.5 text-gray-700 hover:text-black active:scale-95 transition-all"
          title="Reels"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="4"></rect>
            <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"></polygon>
          </svg>
        </button>

        {/* Tab 3: Direct Message (dengan red badge 3!) */}
        <button 
          className="relative flex items-center justify-center p-1.5 text-gray-700 hover:text-black active:scale-95 transition-all"
          title="Messages"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          {/* Red Badge 3 Khas IG di Screenshot */}
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#ff3040] px-1 text-[10px] font-bold text-white shadow-sm">
            3
          </span>
        </button>

        {/* Tab 4: Search */}
        <button 
          className="flex items-center justify-center p-1.5 text-gray-700 hover:text-black active:scale-95 transition-all"
          title="Search"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>

        {/* Tab 5: Profile Avatar */}
        <button 
          onClick={() => setCurrentTab('profile')} 
          className={`flex items-center justify-center rounded-full p-0.5 transition-all active:scale-95 ${
            currentTab === 'profile' ? 'ring-2 ring-black' : ''
          }`}
          title="Profile"
        >
          <img 
            src={PROFILE.avatar} 
            alt="Profile" 
            className="h-7 w-7 rounded-full object-cover" 
          />
        </button>

      </div>

    </div>
  );
}