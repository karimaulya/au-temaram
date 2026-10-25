import { useState, useRef, useEffect } from 'react';

export interface GalleryPhoto {
  id: number;
  url: string;
  date: string;
  title: string;
  location: string;
  isFavorite: boolean;
}

// Data Foto Galeri - Disusun per seksi tanggal seperti wonbin-phone.pages.dev
const PHOTO_SECTIONS = [
  {
    title: 'Today',
    photos: [
      { id: 1, url: '/photos/homephoto1.jpg', date: 'Today 14:15', title: 'Senopati Chill', location: 'Jakarta Selatan', isFavorite: true },
      { id: 2, url: '/photos/homephoto2.jpg', date: 'Today 11:30', title: 'Night Walk', location: 'Bandung', isFavorite: false },
    ]
  },
  {
    title: 'Yesterday',
    photos: [
      { id: 3, url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop', date: 'Yesterday 18:20', title: 'Golden Hour', location: 'Panglima Polim', isFavorite: true },
      { id: 4, url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop', date: 'Yesterday 14:00', title: 'Campus Rooftop', location: 'Depok', isFavorite: false },
    ]
  },
  {
    title: 'October 2026',
    photos: [
      { id: 5, url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=600&auto=format&fit=crop', date: '22 Oct 2026', title: 'Cafe Vibes', location: 'Kemang', isFavorite: false },
      { id: 6, url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&auto=format&fit=crop', date: '21 Oct 2026', title: 'Weekend Roadtrip', location: 'Puncak', isFavorite: true },
      { id: 7, url: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=600&auto=format&fit=crop', date: '20 Oct 2026', title: 'Abstract Light', location: 'Studio', isFavorite: false },
      { id: 8, url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop', date: '19 Oct 2026', title: 'After Hours', location: 'Blok M', isFavorite: false },
      { id: 9, url: 'https://images.unsplash.com/photo-1514315384763-ba401779410f?q=80&w=600&auto=format&fit=crop', date: '18 Oct 2026', title: 'Rainy Season', location: 'Jakarta', isFavorite: false },
      { id: 10, url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop', date: '15 Oct 2026', title: 'Aesthetic Mood', location: 'Bintaro', isFavorite: true },
      { id: 11, url: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?q=80&w=600&auto=format&fit=crop', date: '12 Oct 2026', title: 'Coffee Break', location: 'Dago', isFavorite: false },
      { id: 12, url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=600&auto=format&fit=crop', date: '10 Oct 2026', title: 'Autumn Sky', location: 'Bandung', isFavorite: false },
    ]
  }
];

export default function Gallery() {
  const [sections, setSections] = useState(PHOTO_SECTIONS);
  const [activeTab, setActiveTab] = useState<'years' | 'months' | 'all'>('all');
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Daftar rata semua foto untuk carousel viewer
  const allPhotos = sections.flatMap(s => s.photos);
  const selectedPhoto = allPhotos.find(p => p.id === selectedPhotoId) || null;

  // Auto-scroll ke foto terpilih saat pratinjau pertama kali dibuka
  useEffect(() => {
    if (selectedPhotoId !== null && sliderRef.current) {
      const idx = allPhotos.findIndex(p => p.id === selectedPhotoId);
      if (idx !== -1) {
        sliderRef.current.scrollTo({
          left: idx * sliderRef.current.clientWidth,
          behavior: 'auto'
        });
      }
    }
  }, [selectedPhotoId]);

  const toggleFavorite = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSections(prev =>
      prev.map(sec => ({
        ...sec,
        photos: sec.photos.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)
      }))
    );
  };

  // Deteksi foto aktif saat user scroll / swipe horizontal
  const handleSliderScroll = () => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.clientWidth;
    if (width === 0) return;
    const index = Math.round(sliderRef.current.scrollLeft / width);
    if (allPhotos[index] && allPhotos[index].id !== selectedPhotoId) {
      setSelectedPhotoId(allPhotos[index].id);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 38);
  };

  return (
    <div className="relative flex h-full w-full flex-col bg-[#ffffff] text-black overflow-hidden select-none">
      
      {selectedPhotoId === null ? (
        // ==========================================
        // TAMPILAN 1: IOS PHOTOS LIBRARY (WONBIN-PHONE STYLE)
        // ==========================================
        <div className="relative flex h-full w-full flex-col">
          
          {/* Top Bar Khas wonbin-phone (.nav) */}
          <div className={`absolute top-0 left-0 right-0 z-10 flex h-[88px] pt-[46px] px-4 items-center justify-between transition-colors duration-200 ${
            isScrolled ? 'bg-white/90 backdrop-blur-xl border-b border-gray-200/60' : 'bg-transparent'
          }`}>
            <span className="w-12"></span>
            
            {/* Judul Library di tengah muncul saat scroll */}
            <div className={`text-[17px] font-semibold text-black transition-opacity duration-200 ${
              isScrolled ? 'opacity-100' : 'opacity-0'
            }`}>
              Library
            </div>

            {/* Tombol Search & Select kanan */}
            <div className="flex items-center gap-3 text-[#007aff]">
              <button className="active:opacity-60" title="Cari">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7"></circle>
                  <path d="m20 20-4-4"></path>
                </svg>
              </button>
              <button className="text-[16px] font-normal active:opacity-60">
                Select
              </button>
            </div>
          </div>

          {/* Area Scroll Foto (.scroll) */}
          <div 
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto pt-[88px] pb-[96px] no-scrollbar"
          >
            {/* Header Besar (.lt) */}
            <h1 className="text-[34px] font-bold tracking-tight text-black px-4 leading-tight">
              Library
            </h1>
            <div className="text-[15px] text-[#8e8e93] px-4 -mt-1 mb-3">
              {allPhotos.length} Photos
            </div>

            {/* TAB: ALL PHOTOS (Tampilan 3 Kolom Sesuai wonbin-phone) */}
            {activeTab === 'all' && (
              <div className="flex flex-col">
                {sections.map((section, sIdx) => (
                  <div key={sIdx} className="mb-2">
                    {/* Header Seksi (.ph-sec) */}
                    <div className="text-[22px] font-bold text-black px-4 pt-3 pb-2 tracking-tight">
                      {section.title}
                    </div>

                    {/* Grid Foto 3 Kolom (.ph-grid) */}
                    <div className="grid grid-cols-3 gap-[2px] px-0.5">
                      {section.photos.map((photo) => (
                        <button
                          key={photo.id}
                          onClick={() => { setSelectedPhotoId(photo.id); setShowInfo(false); }}
                          className="group relative aspect-square overflow-hidden bg-[#eee] cursor-pointer active:opacity-75 transition-opacity"
                        >
                          <img
                            src={photo.url}
                            alt={photo.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                          {photo.isFavorite && (
                            <div className="absolute bottom-1 right-1 drop-shadow-sm">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="#007aff" stroke="#007aff">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: MONTHS */}
            {activeTab === 'months' && (
              <div className="px-4 py-2 flex flex-col gap-4">
                <div className="rounded-[20px] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[18px] font-bold text-black">October 2026</span>
                    <span className="text-[13px] text-[#007aff]">Jakarta & Bandung</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 aspect-[4/3] rounded-[14px] overflow-hidden">
                    <img src={allPhotos[0].url} alt="Collage" className="h-full w-full object-cover" />
                    <img src={allPhotos[1].url} alt="Collage" className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: YEARS */}
            {activeTab === 'years' && (
              <div className="px-4 py-2 flex flex-col gap-4">
                <div className="relative rounded-[22px] overflow-hidden aspect-[4/3] shadow-md cursor-pointer active:scale-[0.99] transition-transform">
                  <img src={allPhotos[2].url} alt="2026 Highlight" className="h-full w-full object-cover brightness-95" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                    <span className="text-[32px] font-extrabold tracking-tight">2026</span>
                    <span className="text-[14px] opacity-90">{allPhotos.length} Photos • Alternative Universe</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Floating Pill Filter Tabs Khas wonbin-phone (.phtabs) */}
          <div className="absolute z-20 bottom-[36px] left-1/2 -translate-x-1/2 flex items-center bg-[#f0f0f0]/90 backdrop-blur-2xl rounded-[22px] p-[3px] text-[13px] font-semibold text-gray-700 shadow-[0_4px_18px_rgba(0,0,0,0.12)] border border-black/5 select-none">
            <button
              onClick={() => setActiveTab('years')}
              className={`rounded-[19px] px-4 py-1.5 transition-all ${
                activeTab === 'years'
                  ? 'bg-white text-black shadow-[0_1px_4px_rgba(0,0,0,0.12)]'
                  : 'text-gray-600 hover:text-black active:opacity-60'
              }`}
            >
              Years
            </button>
            <button
              onClick={() => setActiveTab('months')}
              className={`rounded-[19px] px-4 py-1.5 transition-all ${
                activeTab === 'months'
                  ? 'bg-white text-black shadow-[0_1px_4px_rgba(0,0,0,0.12)]'
                  : 'text-gray-600 hover:text-black active:opacity-60'
              }`}
            >
              Months
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`rounded-[19px] px-4 py-1.5 transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-black shadow-[0_1px_4px_rgba(0,0,0,0.12)]'
                  : 'text-gray-600 hover:text-black active:opacity-60'
              }`}
            >
              All Photos
            </button>
          </div>

        </div>
      ) : (
        // ==========================================
        // TAMPILAN 2: PRATINJAU FOTO LIGHT MODE (HORIZONTAL SCROLL / SWIPE BEBAS TANPA TOMBOL)
        // ==========================================
        <div className="absolute inset-0 z-50 flex flex-col bg-white text-black">
          
          {/* Header Light Mode */}
          <div className="absolute top-0 left-0 right-0 z-20 flex w-full items-center justify-between px-3 pt-[48px] pb-2 bg-white/95 backdrop-blur-xl border-b border-gray-100/90 shadow-sm">
            
            {/* Tombol Back Biru ke Library */}
            <button 
              onClick={() => { setSelectedPhotoId(null); setShowInfo(false); }}
              className="flex items-center text-[#007aff] active:opacity-50 py-1"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span className="text-[16px] font-normal ml-0.5">Library</span>
            </button>

            {/* Info Tanggal Foto di Tengah - Huruf Hitam Bersih */}
            <div className="flex flex-col items-center">
              <span className="text-[14px] font-semibold text-black tracking-tight leading-snug">
                {selectedPhoto?.date}
              </span>
              <span className="text-[11px] text-gray-400 font-normal">
                {selectedPhoto?.location}
              </span>
            </div>

            {/* Tombol Edit Biru */}
            <button className="text-[16px] font-medium text-[#007aff] active:opacity-50 pr-1">
              Edit
            </button>
          </div>

          {/* Area Slider Horizontal: Geser Kiri / Kanan Langsung Tanpa Tombol */}
          <div 
            ref={sliderRef}
            onScroll={handleSliderScroll}
            className="flex h-full w-full overflow-x-auto snap-x snap-mandatory pt-[88px] pb-[82px] no-scrollbar bg-[#fafafa] touch-pan-x"
          >
            {allPhotos.map((photo) => (
              <div 
                key={photo.id}
                className="flex h-full w-full flex-shrink-0 snap-center items-center justify-center px-4"
              >
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="max-h-[72vh] max-w-full rounded-[14px] object-contain shadow-md border border-gray-200/50 select-none" 
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Metadata Card Pop-up saat tombol (i) ditekan */}
          {showInfo && selectedPhoto && (
            <div className="absolute bottom-[78px] left-4 right-4 z-30 rounded-[20px] bg-white p-4 shadow-2xl border border-gray-200/90 flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="flex justify-between items-center pb-1.5 border-b border-gray-100">
                <span className="text-[14px] font-bold text-gray-900">{selectedPhoto.title}</span>
                <span className="text-[12px] text-gray-400">iPhone 15 Pro</span>
              </div>
              <div className="flex justify-between text-[11px] text-gray-500 pt-0.5">
                <span>48 MP • 4032 × 3024</span>
                <span>ISO 50 • 24mm • f/1.78</span>
              </div>
              <div className="text-[12px] text-[#007aff] font-medium flex items-center gap-1 mt-0.5">
                <span>📍 {selectedPhoto.location}</span>
              </div>
            </div>
          )}

          {/* Footer Action Bar Light Mode */}
          <div className="absolute bottom-0 left-0 right-0 z-20 flex w-full items-center justify-between px-7 pb-8 pt-3 bg-white/95 backdrop-blur-xl border-t border-gray-200/70 text-[#007aff]">
            
            {/* Share */}
            <button className="active:opacity-50" title="Bagikan">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
            </button>

            {/* Favorite (Love) */}
            <button 
              onClick={() => selectedPhoto && toggleFavorite(selectedPhoto.id)} 
              className="active:scale-125 transition-transform"
              title="Favorit"
            >
              {selectedPhoto?.isFavorite ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#007aff" stroke="#007aff" strokeWidth="1.8">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              )}
            </button>

            {/* Info (i) */}
            <button 
              onClick={() => setShowInfo(!showInfo)} 
              className={`rounded-full p-1 active:opacity-50 ${showInfo ? 'text-blue-700 bg-blue-50' : ''}`}
              title="Info Foto"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </button>

            {/* Delete / Trash */}
            <button className="active:opacity-50 text-red-500" title="Hapus">
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
