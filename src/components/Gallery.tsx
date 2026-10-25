import { useState, useRef, useLayoutEffect, useMemo } from 'react';

export interface GalleryPhoto {
  id: string;
  url: string;
  date: string;
  title: string;
  location: string;
  isFavorite: boolean;
}

// Sembunyikan scrollbar tapi tetap bisa di-scroll
const NO_SB = 'no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

type RawPhoto = Omit<GalleryPhoto, 'id' | 'isFavorite'> & { fav?: boolean };

// Foto-foto SEBELUM kecelakaan (2025), urut dari yang terbaru.
const RAW_SECTIONS: { title: string; photos: RawPhoto[] }[] = [
  {
    title: 'Agustus 2025',
    photos: [
      { url: '/gallery/Agustus/1.jpg', date: '6 Aug 2025 18:20', title: 'Golden Hour', location: 'Panglima Polim', fav: true },
      { url: '/gallery/Agustus/2.jpg', date: '6 Aug 2025 14:00', title: 'Campus Rooftop', location: 'Depok' },
      { url: '/gallery/Agustus/3.jpeg', date: '5 Aug 2025 10:15', title: 'Morning Coffee', location: 'Kuningan' },
      { url: '/gallery/Agustus/4.jpeg', date: '5 Aug 2025 08:30', title: 'City Lights', location: 'Jakarta', fav: true },
      { url: '/gallery/Agustus/5.jpeg', date: '4 Aug 2025 07:45', title: 'Sunrise View', location: 'Bandung' },
      { url: '/gallery/Agustus/6.jpeg', date: '4 Aug 2025 06:50', title: 'Rainy Day', location: 'Bogor' },
      { url: '/gallery/Agustus/7.jpeg', date: '3 Aug 2025 05:30', title: 'Night Sky', location: 'Jakarta', fav: true },
      { url: '/gallery/Agustus/8.jpeg', date: '3 Aug 2025 04:15', title: 'Street Art', location: 'Depok' },
      { url: '/gallery/Agustus/9.jpeg', date: '2 Aug 2025 03:00', title: 'Mountain Hike', location: 'Puncak' },
      { url: '/gallery/Agustus/10.jpeg', date: '2 Aug 2025 02:45', title: 'Ocean Waves', location: 'Bali', fav: true },
      { url: '/gallery/Agustus/11.jpeg', date: '1 Aug 2025 01:30', title: 'Desert Dunes', location: 'Riyadh' },
    ],
  },
  {
    title: 'Juli 2025',
    photos: [
      { url: '/gallery/Juli/1.jpeg', date: '30 Jul 2025 16:10', title: 'Cafe Vibes', location: 'Kemang' },
      { url: '/gallery/Juli/2.jpeg', date: '28 Jul 2025 11:30', title: 'Weekend Roadtrip', location: 'Puncak', fav: true },
      { url: '/gallery/Juli/3.jpeg', date: '25 Jul 2025 20:05', title: 'Abstract Light', location: 'Studio' },
      { url: '/gallery/Juli/4.jpeg', date: '22 Jul 2025 22:40', title: 'After Hours', location: 'Blok M' },
      { url: '/gallery/Juli/5.jpeg', date: '18 Jul 2025 15:20', title: 'Rainy Season', location: 'Jakarta' },
      { url: '/gallery/Juli/6.jpeg', date: '15 Jul 2025 19:00', title: 'Aesthetic Mood', location: 'Bintaro', fav: true },
      { url: '/gallery/Juli/7.jpeg', date: '12 Jul 2025 09:25', title: 'Coffee Break', location: 'Dago' },
      { url: '/gallery/Juli/8.jpeg', date: '10 Jul 2025 17:45', title: 'Autumn Sky', location: 'Bandung' },
    ],
  },
];

// ID unik global ("sectionIndex-photoIndex"). Sebelumnya id 1..N berulang di tiap seksi,
// sehingga foto yang dibuka / favorit / slider bisa nyasar ke seksi lain.
const BASE_SECTIONS = RAW_SECTIONS.map((sec, si) => ({
  title: sec.title,
  photos: sec.photos.map((p, pi) => ({ ...p, id: `${si}-${pi}` })),
}));

interface GalleryProps {
  /** Opsional: dipanggil oleh tombol ‹ di Library untuk keluar dari app Galeri. */
  onBack?: () => void;
}

export default function Gallery({ onBack }: GalleryProps) {
  const [favorites, setFavorites] = useState<Set<string>>(
    () => new Set(BASE_SECTIONS.flatMap(s => s.photos.filter(p => p.fav).map(p => p.id)))
  );
  const [removed, setRemoved] = useState<Set<string>>(() => new Set());
  const [activeTab, setActiveTab] = useState<'years' | 'months' | 'all'>('all');
  const [viewerId, setViewerId] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const pendingScroll = useRef(false); // true = slider belum diposisikan ke foto terpilih

  const sections = useMemo(
    () =>
      BASE_SECTIONS.map(sec => ({
        title: sec.title,
        photos: sec.photos
          .filter(p => !removed.has(p.id))
          .map<GalleryPhoto>(p => ({ id: p.id, url: p.url, date: p.date, title: p.title, location: p.location, isFavorite: favorites.has(p.id) })),
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
    setIsScrolled(e.currentTarget.scrollTop > 38);
  };

  const changeTab = (tab: 'years' | 'months' | 'all') => {
    setActiveTab(tab);
    setIsScrolled(false);
  };

  const hideBroken = (e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.visibility = 'hidden'; };

  const heart = (filled: boolean, size = 22) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#007aff' : 'none'} stroke={filled ? '#007aff' : 'currentColor'} strokeWidth="1.8">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );

  const years = useMemo(() => {
    const map = new Map<string, GalleryPhoto[]>();
    for (const sec of sections) {
      const y = sec.title.split(' ').pop() ?? '';
      map.set(y, [...(map.get(y) ?? []), ...sec.photos]);
    }
    return [...map.entries()];
  }, [sections]);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-white text-black select-none">
      {selectedPhoto === null ? (
        // ============ LIBRARY ============
        <div className="relative flex h-full w-full flex-col">
          <div className={`absolute left-0 right-0 top-0 z-10 flex h-[88px] items-center justify-between px-4 pt-[46px] transition-colors duration-200 ${
            isScrolled ? 'border-b border-gray-200/60 bg-white/90 backdrop-blur-xl' : 'bg-transparent'
          }`}>
            {onBack ? (
              <button onClick={onBack} className="flex w-12 items-center text-[#007aff] active:opacity-50" title="Kembali">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
            ) : <span className="w-12"></span>}

            <div className={`text-[17px] font-semibold text-black transition-opacity duration-200 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
              Library
            </div>

            <div className="flex items-center gap-3 text-[#007aff]">
              <button className="active:opacity-60" title="Cari">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7"></circle>
                  <path d="m20 20-4-4"></path>
                </svg>
              </button>
              <button className="text-[16px] font-normal active:opacity-60">Select</button>
            </div>
          </div>

          <div onScroll={handleScroll} className={`min-h-0 flex-1 overflow-y-auto pb-[96px] pt-[88px] ${NO_SB}`}>
            <h1 className="px-4 text-[34px] font-bold leading-tight tracking-tight text-black">Library</h1>
            <div className="-mt-1 mb-3 px-4 text-[15px] text-[#8e8e93]">{allPhotos.length} Photos</div>

            {allPhotos.length === 0 && (
              <p className="pt-16 text-center text-[15px] text-gray-400">Tidak ada foto</p>
            )}

            {activeTab === 'all' && (
              <div className="flex flex-col">
                {sections.map(section => (
                  <div key={section.title} className="mb-2">
                    <div className="px-4 pb-2 pt-3 text-[22px] font-bold tracking-tight text-black">{section.title}</div>
                    <div className="grid grid-cols-3 gap-[2px] px-0.5">
                      {section.photos.map(photo => (
                        <button
                          key={photo.id}
                          onClick={() => openPhoto(photo.id)}
                          className="group relative aspect-square cursor-pointer overflow-hidden bg-[#eee] transition-opacity active:opacity-75"
                        >
                          <img src={photo.url} alt={photo.title} loading="lazy" onError={hideBroken} className="h-full w-full object-cover" />
                          {photo.isFavorite && (
                            <div className="absolute bottom-1 right-1 drop-shadow-sm">{heart(true, 12)}</div>
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
                  <div key={sec.title} onClick={() => openPhoto(sec.photos[0].id)} className="cursor-pointer overflow-hidden rounded-[20px] border border-gray-100 bg-gray-50 p-3 shadow-sm active:opacity-80">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[18px] font-bold text-black">{sec.title}</span>
                      <span className="text-[13px] text-[#007aff]">{sec.photos.length} Photos</span>
                    </div>
                    <div className="grid aspect-[4/3] grid-cols-2 gap-2 overflow-hidden rounded-[14px]">
                      {sec.photos.slice(0, 2).map(p => (
                        <img key={p.id} src={p.url} alt={p.title} onError={hideBroken} className="h-full w-full bg-[#eee] object-cover" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'years' && (
              <div className="flex flex-col gap-4 px-4 py-2">
                {years.map(([year, photos]) => (
                  <div key={year} onClick={() => openPhoto(photos[0].id)} className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-[22px] bg-[#eee] shadow-md transition-transform active:scale-[0.99]">
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

          <div className="absolute bottom-[36px] left-1/2 z-20 flex -translate-x-1/2 select-none items-center rounded-[22px] border border-black/5 bg-[#f0f0f0]/90 p-[3px] text-[13px] font-semibold text-gray-700 shadow-[0_4px_18px_rgba(0,0,0,0.12)] backdrop-blur-2xl">
            {([['years', 'Years'], ['months', 'Months'], ['all', 'All Photos']] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => changeTab(key)}
                className={`rounded-[19px] px-4 py-1.5 transition-all ${
                  activeTab === key ? 'bg-white text-black shadow-[0_1px_4px_rgba(0,0,0,0.12)]' : 'text-gray-600 active:opacity-60'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // ============ VIEWER ============
        <div className="absolute inset-0 z-50 flex flex-col bg-white text-black">
          {/* Slider paling bawah (z-0) supaya header/footer selalu bisa diklik */}
          <div
            ref={sliderRef}
            onScroll={handleSliderScroll}
            className={`absolute inset-0 z-0 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain bg-white touch-pan-x ${NO_SB}`}
          >
            {allPhotos.map(photo => (
              <div key={photo.id} className="flex h-full w-full flex-[0_0_100%] snap-center items-center justify-center">
                <img src={photo.url} alt={photo.title} onError={hideBroken} draggable={false} className="pointer-events-none h-full w-full select-none object-contain" />
              </div>
            ))}
          </div>

          <div className="relative z-30 flex w-full items-center justify-between border-b border-gray-100/90 bg-white/95 px-3 pb-2 pt-[48px] shadow-sm backdrop-blur-xl">
            <button
              onClick={closeViewer}
              className="relative z-10 flex items-center py-1 pr-3 text-[#007aff] active:opacity-50"
              title="Kembali ke Library"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span className="ml-0.5 text-[16px] font-normal">Library</span>
            </button>

            <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 flex-col items-center">
              <span className="text-[14px] font-semibold leading-snug tracking-tight text-black">{selectedPhoto.date}</span>
              <span className="text-[11px] font-normal text-gray-400">{selectedPhoto.location}</span>
            </div>

            <button className="pr-1 text-[16px] font-medium text-[#007aff] active:opacity-50">Edit</button>
          </div>

          <div className="pointer-events-none relative z-30 flex-1" />

          {showInfo && (
            <div className="absolute bottom-[78px] left-4 right-4 z-30 flex flex-col gap-1.5 rounded-[20px] border border-gray-200/90 bg-white p-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                <span className="text-[14px] font-bold text-gray-900">{selectedPhoto.title}</span>
                <span className="text-[12px] text-gray-400">iPhone 15</span>
              </div>
              <div className="flex justify-between pt-0.5 text-[11px] text-gray-500">
                <span>48 MP • 4032 × 3024</span>
                <span>ISO 50 • 24mm • f/1.78</span>
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-[12px] font-medium text-[#007aff]">
                <span>📍 {selectedPhoto.location}</span>
              </div>
            </div>
          )}

          <div className="relative z-30 flex w-full items-center justify-between border-t border-gray-200/70 bg-white/95 px-7 pb-8 pt-3 text-[#007aff] backdrop-blur-xl">
            <button className="active:opacity-50" title="Bagikan">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
            </button>

            <button onClick={() => toggleFavorite(selectedPhoto.id)} className="transition-transform active:scale-125" title="Favorit">
              {heart(selectedPhoto.isFavorite)}
            </button>

            <button
              onClick={() => setShowInfo(v => !v)}
              className={`rounded-full p-1 active:opacity-50 ${showInfo ? 'bg-blue-50 text-blue-700' : ''}`}
              title="Info Foto"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </button>

            <button onClick={deletePhoto} className="text-red-500 active:opacity-50" title="Hapus">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
