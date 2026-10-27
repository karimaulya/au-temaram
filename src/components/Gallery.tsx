import { useState, useRef, useLayoutEffect, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useAfter, dayDiff } from '../story/dates';

export interface GalleryPhoto {
  id: string;
  url: string;
  date: string;
  title: string;
  location: string;
  isFavorite: boolean;
  live?: boolean;
}

// Sembunyikan scrollbar tapi tetap bisa di-scroll
const NO_SB = 'no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';
// Tombol / pill kaca (dark mode)
const GLASS = 'border border-white/10 bg-white/10 backdrop-blur-2xl shadow-[0_2px_12px_rgba(0,0,0,0.35)]';
const CIRCLE = `flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-white active:opacity-60 ${GLASS}`;

type RawPhoto = Omit<GalleryPhoto, 'id' | 'isFavorite'> & { fav?: boolean };

// Foto-foto SEBELUM kecelakaan (2025), urut dari yang terbaru. live: true = tampil badge LIVE di viewer.
const RAW_SECTIONS: { title: string; photos: RawPhoto[] }[] = [
  {
    title: 'Agustus 2025',
    photos: [
      { url: '/gallery/Agustus/1.jpg', date: '6 Aug 2025 18:20', title: 'Golden Hour', location: 'Panglima Polim', fav: true, live: true },
      { url: '/gallery/Agustus/2.jpg', date: '6 Aug 2025 14:00', title: 'Campus Rooftop', location: 'Depok' },
      { url: '/gallery/Agustus/3.jpeg', date: '5 Aug 2025 10:15', title: 'Morning Coffee', location: 'Kuningan' },
      { url: '/gallery/Agustus/4.jpeg', date: '5 Aug 2025 08:30', title: 'Teman', location: 'Jakarta', fav: true, live: true },
      { url: '/gallery/Agustus/5.jpeg', date: '4 Aug 2025 07:45', title: 'On The Way', location: 'Bogor' },
      { url: '/gallery/Agustus/6.jpeg', date: '4 Aug 2025 06:50', title: 'Maket Gila', location: 'Depok' },
      { url: '/gallery/Agustus/7.jpeg', date: '3 Aug 2025 05:30', title: 'Keren', location: 'Jakarta', fav: true, live: true },
      { url: '/gallery/Agustus/8.jpeg', date: '3 Aug 2025 04:15', title: 'Gamtek', location: 'Depok' },
      { url: '/gallery/Agustus/9.jpeg', date: '2 Aug 2025 03:00', title: 'Mountain Hike', location: 'Puncak' },
      { url: '/gallery/Agustus/10.jpeg', date: '2 Aug 2025 02:45', title: 'Selfie', location: 'Depok', fav: true },
      { url: '/gallery/Agustus/11.jpeg', date: '1 Aug 2025 01:30', title: 'Kalap', location: 'Depok' },
    ],
  },
  {
    title: 'Juli 2025',
    photos: [
      { url: '/gallery/Juli/1.jpeg', date: '30 Jul 2025 16:10', title: 'Jalan Santai', location: 'Tanah Abang' },
      { url: '/gallery/Juli/2.jpeg', date: '28 Jul 2025 11:30', title: 'Mie Ramen', location: 'Blok M', fav: true, live: true },
      { url: '/gallery/Juli/3.jpeg', date: '25 Jul 2025 20:05', title: 'Teman', location: 'Depok' },
      { url: '/gallery/Juli/4.jpeg', date: '22 Jul 2025 22:40', title: 'Quotes Arsitek', location: 'Blok M' },
      { url: '/gallery/Juli/5.jpeg', date: '18 Jul 2025 15:20', title: 'Makan Besar', location: 'Jakarta' },
      { url: '/gallery/Juli/6.jpeg', date: '15 Jul 2025 19:00', title: 'Siblings', location: 'Depok', fav: true, live: true },
      { url: '/gallery/Juli/7.jpeg', date: '12 Jul 2025 09:25', title: 'Jalan-Jalan di Senayan Park', location: 'Jakarta' },
      { url: '/gallery/Juli/8.jpeg', date: '10 Jul 2025 17:45', title: 'Langit Sore', location: 'Yogyakarta' },
    ],
  },
];

// ID unik global ("sectionIndex-photoIndex"). Sebelumnya id 1..N berulang di tiap seksi,
// sehingga foto yang dibuka / favorit / slider bisa nyasar ke seksi lain.
const BASE_SECTIONS = RAW_SECTIONS.map((sec, si) => ({
  title: sec.title,
  photos: sec.photos.map((p, pi) => ({ ...p, id: `${si}-${pi}` })),
}));

// ---------------- ICONS ----------------
const Svg = ({ size = 22, sw = 1.8, fill = 'none', children }: { size?: number; sw?: number; fill?: string; children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const IBack = () => <Svg size={22} sw={2.4}><path d="M15 5l-7 7 7 7" /></Svg>;
const IDots = () => (
  <Svg size={22} sw={0} fill="currentColor"><circle cx="5" cy="12" r="1.9" /><circle cx="12" cy="12" r="1.9" /><circle cx="19" cy="12" r="1.9" /></Svg>
);
const ISearch = () => <Svg size={20} sw={2.2}><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L20.5 20.5" /></Svg>;
const IShare = () => <Svg size={24} sw={1.8}><path d="M12 3v12" /><path d="M8 7l4-4 4 4" /><path d="M7 11H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1" /></Svg>;
const IHeart = ({ filled = false, size = 24 }: { filled?: boolean; size?: number }) => (
  <Svg size={size} sw={1.8} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20.8s-7.2-4.5-9.5-8.9C.8 8.6 2.5 4.6 6.3 4.6c2.2 0 3.7 1.1 5.7 3.3 2-2.2 3.5-3.3 5.7-3.3 3.8 0 5.5 4 3.8 7.3-2.3 4.4-9.5 8.9-9.5 8.9z" />
  </Svg>
);
// lingkaran "i" dengan kilau di pojok kiri atas
const IInfo = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="14.5" cy="14.5" r="8" />
    <path d="M14.5 14v4.2" /><circle cx="14.5" cy="10.9" r=".6" fill="currentColor" />
    <path d="M5.2 1.6l.9 2.7 2.7.9-2.7.9-.9 2.7-.9-2.7-2.7-.9 2.7-.9z" fill="currentColor" stroke="none" />
  </svg>
);
const ISliders = () => (
  <Svg size={24} sw={1.8}>
    <path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h11M19 17h1" />
    <circle cx="15" cy="7" r="2" /><circle cx="9" cy="12" r="2" /><circle cx="17" cy="17" r="2" />
  </Svg>
);
const ITrash = () => (
  <Svg size={24} sw={1.8}>
    <path d="M4 7h16" /><path d="M9 7V4.6A1.6 1.6 0 0 1 10.6 3h2.8A1.6 1.6 0 0 1 15 4.6V7" />
    <path d="M6 7l1 12.4A1.6 1.6 0 0 0 8.6 21h6.8a1.6 1.6 0 0 0 1.6-1.6L18 7" /><path d="M10 11v6M14 11v6" />
  </Svg>
);
const ILive = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9.5" strokeDasharray="1.6 2.3" strokeLinecap="round" />
    <circle cx="12" cy="12" r="5.3" /><circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
  </svg>
);
const IChevDown = () => <Svg size={14} sw={2.4}><path d="M6 9l6 6 6-6" /></Svg>;
const IChevRight = () => <Svg size={14} sw={2.4}><path d="M9 6l6 6-6 6" /></Svg>;
const ILookUp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="4.5" fill="currentColor" />
    <path d="M5.5 17l4.2-5.6 3 3.6 2-2.3 3.8 4.3z" fill="#000" /><circle cx="15.5" cy="8.6" r="1.7" fill="#000" />
  </svg>
);

interface GalleryProps {
  /** Opsional: dipanggil oleh tombol ‹ di Library untuk keluar dari app Galeri. */
  onBack?: () => void;
}

const MON_IDX: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

export default function Gallery({ onBack }: GalleryProps) {
  const after = useAfter();
  // judul seksi "Agustus 2025": sebelum kecelakaan tanpa tahun 2025, sesudahnya dengan tahun
  const secTitle = (t: string) => (after ? t : t.replace(/ 2025$/, ''));
  const [favorites, setFavorites] = useState<Set<string>>(
    () => new Set(BASE_SECTIONS.flatMap(s => s.photos.filter(p => p.fav).map(p => p.id)))
  );
  const [removed, setRemoved] = useState<Set<string>>(() => new Set());
  const [activeTab, setActiveTab] = useState<'years' | 'months' | 'all'>('all');
  const [viewerId, setViewerId] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const pendingScroll = useRef(false); // true = slider belum diposisikan ke foto terpilih

  const sections = useMemo(
    () =>
      BASE_SECTIONS.map(sec => ({
        title: sec.title,
        photos: sec.photos
          .filter(p => !removed.has(p.id))
          .map<GalleryPhoto>(p => ({ id: p.id, url: p.url, date: p.date, title: p.title, location: p.location, live: p.live, isFavorite: favorites.has(p.id) })),
      })).filter(sec => sec.photos.length > 0),
    [favorites, removed]
  );
  const allPhotos = useMemo(() => sections.flatMap(s => s.photos), [sections]);
  const viewerIndex = viewerId === null ? -1 : allPhotos.findIndex(p => p.id === viewerId);
  const selectedPhoto = viewerIndex >= 0 ? allPhotos[viewerIndex] : null;

  // Posisikan slider ke foto terpilih SEBELUM browser menggambar (tanpa kedip / loncat).
  useLayoutEffect(() => {
    if (!pendingScroll.current || viewerIndex < 0 || !sliderRef.current) return;
    sliderRef.current.scrollLeft = viewerIndex * sliderRef.current.clientWidth;
    pendingScroll.current = false;
  }, [viewerId, viewerIndex]);

  // Strip thumbnail di bawah selalu menggeser foto aktif ke tengah.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const cur = strip.querySelector<HTMLElement>('[data-cur="1"]');
    if (cur) strip.scrollTo({ left: cur.offsetLeft - strip.clientWidth / 2 + cur.offsetWidth / 2, behavior: 'smooth' });
  }, [viewerId]);

  const openPhoto = (id: string) => {
    pendingScroll.current = true;
    setViewerId(id);
    setShowInfo(false);
  };

  const closeViewer = () => {
    pendingScroll.current = false;
    setViewerId(null);
    setShowInfo(false);
  };

  const jumpTo = (i: number) => {
    const el = sliderRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const deletePhoto = () => {
    if (!selectedPhoto) return;
    const next = allPhotos[viewerIndex + 1] ?? allPhotos[viewerIndex - 1] ?? null;
    setRemoved(prev => new Set(prev).add(selectedPhoto.id));
    setShowInfo(false);
    if (next) { pendingScroll.current = true; setViewerId(next.id); } else closeViewer();
  };

  // Foto aktif mengikuti swipe horizontal (diabaikan selama slider belum diposisikan)
  const handleSliderScroll = () => {
    const el = sliderRef.current;
    if (!el || pendingScroll.current || el.clientWidth === 0) return;
    const photo = allPhotos[Math.round(el.scrollLeft / el.clientWidth)];
    if (photo && photo.id !== viewerId) setViewerId(photo.id);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 40);
  };

  const changeTab = (tab: 'years' | 'months' | 'all') => {
    setActiveTab(tab);
    setIsScrolled(false);
  };

  const hideBroken = (e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.visibility = 'hidden'; };

  const years = useMemo(() => {
    const map = new Map<string, GalleryPhoto[]>();
    for (const sec of sections) {
      const y = sec.title.split(' ').pop() ?? '';
      map.set(y, [...(map.get(y) ?? []), ...sec.photos]);
    }
    return [...map.entries()];
  }, [sections]);

  // "6 Aug 2025 18:20": sebelum kecelakaan -> "Yesterday 18.20" / "5 Aug 10.15" (tanpa tahun 2025);
  // sesudah kecelakaan -> tanggal lengkap "6 Aug 2025 18.20". Jam memakai titik (format Indonesia).
  const dateLabel = (d: string) => {
    const m = d.match(/^(\d{1,2}) (\w{3}) (\d{4}) (\d{1,2}):(\d{2})$/);
    if (!m) return d.replace(/(\d{1,2}):(\d{2})$/, '$1.$2');
    const [, dd, mon, yy, hh, mm] = m;
    const t = `${hh}.${mm}`;
    if (after) return `${dd} ${mon} ${yy} ${t}`;
    const n = dayDiff(new Date(+yy, MON_IDX[mon], +dd), false);
    if (n === 0) return `Today ${t}`;
    if (n === 1) return `Yesterday ${t}`;
    return `${dd} ${mon}${+yy !== 2025 ? ' ' + yy : ''} ${t}`;
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-black text-white select-none">
      {selectedPhoto === null ? (
        // ============ LIBRARY ============
        <div className="relative flex h-full w-full flex-col">
          <div className={`absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 pb-2 pt-[58px] transition-colors duration-200 ${
            isScrolled ? 'bg-black/70 backdrop-blur-xl' : 'bg-transparent'
          }`}>
            {onBack ? (
              <button onClick={onBack} className={CIRCLE} title="Kembali"><IBack /></button>
            ) : <span className="h-[44px] w-[44px]"></span>}

            <div className={`pointer-events-none absolute bottom-[19px] left-1/2 -translate-x-1/2 text-[17px] font-semibold text-white transition-opacity duration-200 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
              Library
            </div>

            <div className="flex items-center gap-2">
              <button className={CIRCLE} title="Cari"><ISearch /></button>
              <button className={`flex h-[44px] items-center rounded-full px-4 text-[16px] font-medium text-white active:opacity-60 ${GLASS}`}>Select</button>
            </div>
          </div>

          <div onScroll={handleScroll} className={`min-h-0 flex-1 overflow-y-auto pb-[110px] pt-[112px] ${NO_SB}`}>
            <h1 className="px-4 text-[34px] font-bold leading-tight tracking-tight text-white">Library</h1>
            <div className="-mt-1 mb-3 px-4 text-[15px] text-[#8e8e93]">{allPhotos.length} Photos</div>

            {allPhotos.length === 0 && (
              <p className="pt-16 text-center text-[15px] text-zinc-500">Tidak ada foto</p>
            )}

            {activeTab === 'all' && (
              <div className="flex flex-col">
                {sections.map(section => (
                  <div key={section.title} className="mb-2">
                    <div className="px-4 pb-2 pt-3 text-[22px] font-bold tracking-tight text-white">{secTitle(section.title)}</div>
                    <div className="grid grid-cols-3 gap-[2px] px-0.5">
                      {section.photos.map(photo => (
                        <button
                          key={photo.id}
                          onClick={() => openPhoto(photo.id)}
                          className="group relative aspect-square cursor-pointer overflow-hidden bg-zinc-900 transition-opacity active:opacity-75"
                        >
                          <img src={photo.url} alt={photo.title} loading="lazy" onError={hideBroken} className="h-full w-full object-cover" />
                          {photo.isFavorite && (
                            <div className="absolute bottom-1 left-1 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"><IHeart filled size={13} /></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'months' && (
              <div className="flex flex-col gap-4 px-4 py-2">
                {sections.map(sec => (
                  <div key={sec.title} onClick={() => openPhoto(sec.photos[0].id)} className="cursor-pointer overflow-hidden rounded-[20px] border border-white/10 bg-zinc-900 p-3 shadow-sm active:opacity-80">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[18px] font-bold text-white">{secTitle(sec.title)}</span>
                      <span className="text-[13px] text-[#0a84ff]">{sec.photos.length} Photos</span>
                    </div>
                    <div className="grid aspect-[4/3] grid-cols-2 gap-2 overflow-hidden rounded-[14px]">
                      {sec.photos.slice(0, 2).map(p => (
                        <img key={p.id} src={p.url} alt={p.title} onError={hideBroken} className="h-full w-full bg-zinc-800 object-cover" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'years' && (
              <div className="flex flex-col gap-4 px-4 py-2">
                {years.map(([year, photos]) => (
                  <div key={year} onClick={() => openPhoto(photos[0].id)} className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-[22px] bg-zinc-900 shadow-md transition-transform active:scale-[0.99]">
                    <img src={photos[0].url} alt={`${year} Highlight`} onError={hideBroken} className="h-full w-full object-cover brightness-95" />
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 text-white">
                      <span className="text-[32px] font-extrabold tracking-tight">{year}</span>
                      <span className="text-[14px] opacity-90">{photos.length} Photos</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`absolute bottom-[34px] left-1/2 z-20 flex -translate-x-1/2 select-none items-center rounded-full p-[3px] text-[13px] font-semibold ${GLASS}`}>
            {([['years', 'Years'], ['months', 'Months'], ['all', 'All Photos']] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => changeTab(key)}
                className={`rounded-full px-4 py-2 transition-all ${
                  activeTab === key ? 'bg-white/20 text-white' : 'text-zinc-400 active:opacity-60'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // ============ VIEWER ============
        <div className="absolute inset-0 z-50 bg-black text-white">
          {/* Slider paling bawah (z-0). Padding atas/bawah supaya foto tidak tertutup tombol. */}
          <div
            ref={sliderRef}
            onScroll={handleSliderScroll}
            className={`absolute inset-0 z-0 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain bg-black touch-pan-x ${NO_SB}`}
          >
            {allPhotos.map(photo => (
              <div key={photo.id} className="flex h-full w-full flex-[0_0_100%] snap-center items-center justify-center pb-[130px] pt-[150px]">
                <img src={photo.url} alt={photo.title} onError={hideBroken} draggable={false} className="pointer-events-none h-full w-full select-none object-contain" />
              </div>
            ))}
          </div>

          {/* Header: kembali | lokasi + tanggal | menu */}
          <div className="absolute inset-x-0 top-0 z-30 flex items-start justify-between px-4 pt-[58px]">
            <button onClick={closeViewer} className={CIRCLE} title="Kembali ke Library"><IBack /></button>
            <div className={`flex min-w-[150px] max-w-[220px] flex-col items-center rounded-full px-6 py-1.5 text-center ${GLASS}`}>
              <span className="max-w-full truncate text-[15px] font-semibold leading-tight">{selectedPhoto.location}</span>
              <span className="text-[13px] leading-tight text-white/70">{dateLabel(selectedPhoto.date)}</span>
            </div>
            <button className={CIRCLE} title="Menu"><IDots /></button>
          </div>

          {/* Baris LIVE + Visual Look Up */}
          <div className="absolute inset-x-4 top-[118px] z-30 flex items-center justify-between">
            {selectedPhoto.live ? (
              <span className={`flex h-[30px] items-center gap-1.5 rounded-full px-3 text-[13px] font-medium ${GLASS}`}><ILive />LIVE<IChevDown /></span>
            ) : <span />}
            <span className={`flex h-[30px] items-center gap-1 rounded-full pl-2.5 pr-2 ${GLASS}`}><ILookUp /><IChevRight /></span>
          </div>

          {showInfo && (
            <div className="absolute inset-x-4 bottom-[172px] z-30 flex flex-col gap-1.5 rounded-[20px] border border-white/10 bg-zinc-900/90 p-4 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <span className="text-[14px] font-bold text-white">{selectedPhoto.title}</span>
                <span className="text-[12px] text-zinc-500">iPhone 15</span>
              </div>
              <div className="flex justify-between pt-0.5 text-[11px] text-zinc-400">
                <span>48 MP • 4032 × 3024</span>
                <span>ISO 50 • 24mm • f/1.78</span>
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-[12px] font-medium text-[#0a84ff]">
                <span>📍 {selectedPhoto.location}</span>
              </div>
            </div>
          )}

          {/* Bawah: strip thumbnail + toolbar */}
          <div className="absolute inset-x-0 bottom-0 z-30 pb-[28px]">
            <div ref={stripRef} className={`relative mb-3 flex h-[36px] items-center overflow-x-auto px-[170px] ${NO_SB}`}>
              {allPhotos.map((p, i) => {
                const cur = p.id === viewerId;
                return (
                  <button
                    key={p.id}
                    data-cur={cur ? '1' : undefined}
                    onClick={() => jumpTo(i)}
                    className={`h-[34px] shrink-0 overflow-hidden rounded-[3px] bg-zinc-800 transition-all duration-200 ${cur ? 'mx-1.5 w-[44px]' : 'mx-px w-[22px] opacity-80'}`}
                  >
                    <img src={p.url} alt="" onError={hideBroken} draggable={false} className="h-full w-full object-cover" />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between px-5">
              <button className={`${CIRCLE} !h-[52px] !w-[52px]`} title="Bagikan"><IShare /></button>

              <div className={`flex h-[52px] items-center gap-7 rounded-full px-6 text-white ${GLASS}`}>
                <button onClick={() => toggleFavorite(selectedPhoto.id)} className="transition-transform active:scale-125" title="Favorit">
                  <IHeart filled={selectedPhoto.isFavorite} />
                </button>
                <button onClick={() => setShowInfo(v => !v)} className={`transition-opacity active:opacity-50 ${showInfo ? 'text-[#0a84ff]' : ''}`} title="Info Foto"><IInfo /></button>
                <button className="active:opacity-50" title="Edit"><ISliders /></button>
              </div>

              <button onClick={deletePhoto} className={`${CIRCLE} !h-[52px] !w-[52px]`} title="Hapus"><ITrash /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
