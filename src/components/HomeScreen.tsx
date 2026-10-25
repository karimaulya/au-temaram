import type { AppScreen } from '../types';

interface HomeScreenProps {
  onOpenApp: (screen: AppScreen) => void;
}

export default function HomeScreen({ onOpenApp }: HomeScreenProps) {
  return (
    <div className="flex h-full flex-col justify-between bg-[url('/photos/homescreen.jpg')] bg-cover bg-center px-5 pt-[64px] pb-3 select-none">
      
      {/* 
        Grid Aplikasi:
        Menggunakan aspect-square pada setiap tombol dan widget sehingga rasio selalu 1:1 presisi 
        dan ikon TIDAK AKAN PERNAH GEPENG dalam resolusi apapun.
      */}
      <div className="grid grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* ROW 1 & 2 */}
        {/* Clock Widget 2x2: aspect-square */}
        <div className="col-span-2 row-span-2 aspect-square rounded-[24px] bg-white/20 backdrop-blur-2xl border border-white/20 flex items-center justify-center overflow-hidden shadow-sm active:scale-95 transition-transform">
          <img src="/icons/Clock.svg" alt="Clock Widget" className="h-full w-full object-cover rounded-[24px]" />
        </div>

        <button onClick={() => onOpenApp('calendar')} className="w-full aspect-square rounded-[18px] bg-white flex flex-col items-center justify-center shadow-sm overflow-hidden active:scale-90 transition-transform">
          <img src="/icons/Calendar.svg" alt="Calendar" className="h-full w-full object-cover" />
        </button>
        
        <button onClick={() => onOpenApp('maps')} className="w-full aspect-square rounded-[18px] bg-white flex items-center justify-center shadow-sm overflow-hidden active:scale-90 transition-transform">
          <img src="/icons/Maps.svg" alt="Maps" className="h-full w-full object-cover" />
        </button>
        
        <button className="w-full aspect-square rounded-[18px] bg-blue-400 flex items-center justify-center shadow-sm overflow-hidden active:scale-90 transition-transform">
          <img src="/icons/App Store.svg" alt="App Store" className="h-full w-full object-cover" />
        </button>
        
        <button className="w-full aspect-square rounded-[18px] bg-green-500 flex items-center justify-center shadow-sm overflow-hidden active:scale-90 transition-transform">
          <img src="/icons/FaceTime.svg" alt="FaceTime" className="h-full w-full object-cover" />
        </button>

        {/* ROW 3 & 4 */}
        <button onClick={() => onOpenApp('notes')} className="w-full aspect-square rounded-[18px] bg-white flex items-center justify-center shadow-sm overflow-hidden active:scale-90 transition-transform">
          <img src="/icons/Notes.svg" alt="Notes" className="h-full w-full object-cover" />
        </button>
        
        <button onClick={() => onOpenApp('settings')} className="w-full aspect-square rounded-[18px] bg-white flex items-center justify-center shadow-sm overflow-hidden active:scale-90 transition-transform">
          <img src="/icons/Settings.svg" alt="Settings" className="h-full w-full object-cover" />
        </button>
        
        {/* Photo Widget 1: 2x2 aspect-square */}
        <div className="col-span-2 row-span-2 aspect-square rounded-[24px] bg-gray-300 overflow-hidden shadow-sm active:scale-95 transition-transform">
           <img src="/photos/homephoto1.jpg" className="w-full h-full object-cover" alt="Photo Widget 1" />
        </div>

        <button onClick={() => onOpenApp('contact')} className="w-full aspect-square rounded-[18px] bg-white flex items-center justify-center shadow-sm overflow-hidden active:scale-90 transition-transform">
          <img src="/icons/Contacts.svg" alt="Contact" className="h-full w-full object-cover" />
        </button>
        
        <button onClick={() => onOpenApp('email')} className="relative w-full aspect-square rounded-[18px] bg-white flex items-center justify-center shadow-sm overflow-hidden active:scale-90 transition-transform">
          <img src="/icons/Email.svg" alt="Email" className="h-full w-full object-cover" />
        </button>

        {/* ROW 5 & 6 */}
        {/* Photo Widget 2: 2x2 aspect-square */}
        <div className="col-span-2 row-span-2 aspect-square rounded-[24px] bg-zinc-900 overflow-hidden shadow-sm active:scale-95 transition-transform">
           <img src="/photos/homephoto2.jpg" className="w-full h-full object-cover opacity-80" alt="Photo Widget 2" />
        </div>

        <button onClick={() => onOpenApp('gallery')} className="w-full aspect-square rounded-[18px] bg-white flex items-center justify-center shadow-sm overflow-hidden active:scale-90 transition-transform">
          <img src="/icons/Photos.svg" alt="Photos" className="h-full w-full object-cover" />
        </button>
        
        <button onClick={() => onOpenApp('camera')} className="w-full aspect-square rounded-[18px] bg-white flex items-center justify-center shadow-sm overflow-hidden active:scale-90 transition-transform">
          <img src="/icons/Camera.svg" alt="Camera" className="h-full w-full object-cover" />
        </button>
        
        <button onClick={() => onOpenApp('reminders')} className="relative w-full aspect-square rounded-[18px] bg-white flex items-center justify-center shadow-sm overflow-hidden active:scale-90 transition-transform">
          <img src="/icons/Reminders.svg" alt="Reminders" className="h-full w-full object-cover" />
        </button>
        
        <button onClick={() => onOpenApp('instagram')} className="w-full aspect-square rounded-[18px] bg-white flex items-center justify-center shadow-sm overflow-hidden active:scale-90 transition-transform">
          <img src="/icons/Instagram.svg" alt="Instagram" className="h-full w-full object-cover" />
        </button>

      </div>

      {/* Dock Area Bawah */}
      <div className="mt-auto -mx-1.5 rounded-[36px] bg-white/25 py-[12px] backdrop-blur-2xl border border-white/20">
        <div className="grid grid-cols-4 gap-3.5 sm:gap-4 px-[12px]">
          
          <button onClick={() => onOpenApp('contact')} className="w-full aspect-square rounded-[18px] bg-transparent flex items-center justify-center shadow-sm overflow-hidden active:scale-90 transition-transform">
            <img src="/icons/Phone.svg" alt="Phone" className="h-full w-full object-cover" />
          </button>
          
          <button onClick={() => onOpenApp('homescreen')} className="w-full aspect-square rounded-[18px] bg-transparent flex items-center justify-center shadow-sm overflow-hidden active:scale-90 transition-transform">
            <img src="/icons/Safari.svg" alt="Safari" className="h-full w-full object-cover" />
          </button>
          
          <button onClick={() => onOpenApp('imessage')} className="relative w-full aspect-square rounded-[18px] bg-transparent flex items-center justify-center shadow-sm overflow-hidden active:scale-90 transition-transform">
            <img src="/icons/Messages.svg" alt="Messages" className="h-full w-full object-cover" />
          </button>
          
          <button onClick={() => onOpenApp('spotify')} className="w-full aspect-square rounded-[18px] bg-transparent flex items-center justify-center shadow-sm overflow-hidden active:scale-90 transition-transform">
            <img src="/icons/Music.svg" alt="Music" className="h-full w-full object-cover" />
          </button>

        </div>
      </div>
    </div>
  );
}