import type { ReactNode } from 'react';
import type { AppScreen } from '../types';

interface HomeScreenProps {
  onOpenApp: (screen: AppScreen) => void;
  messageBadge?: number;
  pulseMessages?: boolean;
}

/*
  Ukuran ikon dikunci (68px) dan TIDAK ikut melebar ketika layar lebih lebar.
  Yang melebar hanya jarak antar ikon (justify-between).
  Ganti angka 68 di dua tempat di bawah kalau mau ikon lebih besar/kecil.
  Widget 2x2 mengisi area 2 kolom x 2 baris, jadi tingginya otomatis = 2 ikon + jarak baris.
*/
const GRID = 'grid grid-cols-[repeat(4,68px)] auto-rows-[68px] justify-between gap-y-3.5';
const NO_SB = 'no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

function AppIcon({ icon, label, onClick, bg = 'bg-white', className = '', children }: {
  icon: string; label: string; onClick?: () => void; bg?: string; className?: string; children?: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative h-[68px] w-[68px] overflow-hidden rounded-[18px] shadow-sm transition-transform active:scale-90 ${bg} ${className}`}
    >
      <img src={`/icons/${icon}.svg`} alt={label} className="h-full w-full object-cover" />
      {children}
    </button>
  );
}

export default function HomeScreen({ onOpenApp, messageBadge = 0, pulseMessages = false }: HomeScreenProps) {
  return (
    <div className="relative h-full w-full select-none">
      {/* Wallpaper tetap diam, konten di atasnya yang bisa di-scroll */}
      <div className="absolute inset-0 bg-[url('/photos/homescreen.jpg')] bg-cover bg-center" />

      <div className={`absolute inset-0 overflow-y-auto overscroll-contain ${NO_SB}`}>
        <div className="flex min-h-full flex-col justify-between gap-5 px-5 pb-3 pt-[64px]">

          <div className={GRID}>
            {/* Clock widget 2x2 */}
            <div className="col-span-2 row-span-2 overflow-hidden rounded-[24px] border border-white/20 bg-white/20 shadow-sm backdrop-blur-2xl transition-transform active:scale-95">
              <img src="/icons/Clock.svg" alt="Clock Widget" className="h-full w-full rounded-[24px] object-cover" />
            </div>

            <AppIcon icon="Calendar" label="Calendar" onClick={() => onOpenApp('calendar')} />
            <AppIcon icon="Maps" label="Maps" onClick={() => onOpenApp('maps')} />
            <AppIcon icon="X" label="X" onClick={() => onOpenApp('twitter')} />
            <AppIcon icon="FaceTime" label="FaceTime" bg="bg-green-500" onClick={() => onOpenApp('facetime')} />

            <AppIcon icon="Notes" label="Notes" onClick={() => onOpenApp('notes')} />
            <AppIcon icon="Settings" label="Settings" onClick={() => onOpenApp('settings')} />

            {/* Photo widget 1 */}
            <div className="col-span-2 row-span-2 overflow-hidden rounded-[24px] bg-gray-300 shadow-sm transition-transform active:scale-95">
              <img src="/photos/homephoto1.jpg" className="h-full w-full object-cover" alt="Photo Widget 1" />
            </div>

            <AppIcon icon="Contacts" label="Contact" onClick={() => onOpenApp('contact')} />
            <AppIcon icon="Email" label="Email" onClick={() => onOpenApp('email')} />

            {/* Photo widget 2 */}
            <div className="col-span-2 row-span-2 overflow-hidden rounded-[24px] bg-zinc-900 shadow-sm transition-transform active:scale-95">
              <img src="/photos/homephoto2.jpg" className="h-full w-full object-cover opacity-80" alt="Photo Widget 2" />
            </div>

            <AppIcon icon="Photos" label="Photos" onClick={() => onOpenApp('gallery')} />
            <AppIcon icon="Camera" label="Camera" onClick={() => onOpenApp('camera')} />
            <AppIcon icon="Reminders" label="Reminders" onClick={() => onOpenApp('reminders')} />
            <AppIcon icon="Instagram" label="Instagram" onClick={() => onOpenApp('instagram')} />
          </div>

          {/* Dock: padding 6px + -mx-1.5 supaya 4 ikon sejajar persis dengan kolom grid di atas */}
          <div className="-mx-1.5 rounded-[36px] border border-white/20 bg-white/25 px-1.5 py-[10px] backdrop-blur-2xl">
            <div className="grid grid-cols-[repeat(4,68px)] justify-between">
              <AppIcon icon="Phone" label="Phone" bg="bg-transparent" onClick={() => onOpenApp('phone')} />
              <AppIcon icon="Safari" label="Safari" bg="bg-transparent" onClick={() => onOpenApp('safari')} />

              <div className="relative h-[68px] w-[68px]">
                <AppIcon icon="Messages" label="Messages" bg="bg-transparent" onClick={() => onOpenApp('imessage')} className={pulseMessages ? 'animate-pulse' : ''} />
                {messageBadge > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[13px] font-semibold text-white shadow">
                    {messageBadge}
                  </span>
                )}
              </div>

              <AppIcon icon="Music" label="Music" bg="bg-transparent" onClick={() => onOpenApp('spotify')} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
