import { useState, useEffect } from 'react';
import type { AppScreen } from './types';
import LockScreen from './components/LockScreen';
import HomeScreen from './components/HomeScreen';
import IMessage from './components/IMessage';
import Gallery from './components/Gallery';
import Instagram from './components/Instagram';
import CallScreen from './components/CallScreen';
import NotificationBanner from './components/NotificationBanner';
import AlarmOverlay from './components/AlarmOverlay';
import NewsPage from './components/NewsPage';
import Twitter from './components/Twitter';
import Calendar from './components/Calendar';
import Maps from './components/Maps';
import Notes from './components/Notes';
import Settings from './components/Settings';
import Contacts from './components/Contacts';
import Email from './components/Email';
import Camera from './components/Camera';
import Reminders from './components/Reminders';
import Safari from './components/Safari';
import Music from './components/Music';
import FaceTime from './components/FaceTime';
import Phone from './components/Phone';
import ResumePrompt from './components/ResumePrompt';
import { useStory } from './story/StoryProvider';
import { playSadSong, onSadSongEnd, continueSadSong } from './story/bgm';
import type { Notif } from './story/StoryProvider';

// Retakan layar (step 21): gambar PNG transparan di public/crack.png.
// Kalau PNG-nya berlatar hitam (bukan transparan), tambahkan mix-blend-screen di className.
function Crack() {
  return (
    <img src="/crack.png" alt="" draggable={false}
      className="pointer-events-none absolute inset-0 z-[95] h-full w-full select-none object-cover opacity-70" />
  );
}

export default function App() {
  const { state, openChat, unlockPhone, dismissNotif, reset } = useStory();
  // selalu mulai dari lockscreen (setelah refresh HP terkunci lagi), progres cerita tetap dilanjutkan dari simpanan
  const [activeScreen, setActiveScreen] = useState<AppScreen>('lockscreen');
  const [rumble, setRumble] = useState(false);
  const cracked = state.cracked;   // tersimpan di progres, jadi tetap retak setelah refresh
  useEffect(() => { new Image().src = '/crack.png'; }, []);   // preload supaya tidak berkedip

  // dialog akhir muncul HANYA setelah lagu penutup selesai diputar (lagu tidak loop sampai pembaca memilih lanjut)
  const [showEnd, setShowEnd] = useState(false);
  useEffect(() => onSadSongEnd(() => setShowEnd(true)), []);

  // lagu sedih penutup: kalau progres tersimpan sudah lewat halaman berita (mis. setelah reload), lanjutkan
  // lagunya (mulai di sentuhan pertama, karena browser memblokir autoplay)
  useEffect(() => { if (state.taps.includes('news-back')) playSadSong(0.8); }, [state.taps]);

  // efek layar dari skrip cerita
  useEffect(() => {
    if (!state.fx) return;
    if (state.fx.name === 'knock' || state.fx.name === 'shake' || state.fx.name === 'crack') {
      let rumbleTimeout: ReturnType<typeof setTimeout> | undefined;
      const startTimeout = setTimeout(() => {
        setRumble(true);
        rumbleTimeout = setTimeout(() => setRumble(false), 700);
      }, 0);
      return () => {
        clearTimeout(startTimeout);
        if (rumbleTimeout) clearTimeout(rumbleTimeout);
      };
    }
  }, [state.fx]);

  const isLightScreen = false;   // semua layar dark mode -> status bar & home indicator putih
  const isInApp = activeScreen !== 'lockscreen' && activeScreen !== 'homescreen';

  const handleUnlock = (chatId?: string) => {
    unlockPhone();
    if (chatId) { openChat(chatId); setActiveScreen('imessage'); }
    else setActiveScreen('homescreen');
  };

  const handleOpenNotif = (n: Notif) => {
    if (n.chatId === 'calendar') { dismissNotif(n.id); return; }
    openChat(n.chatId);
    setActiveScreen('imessage');
  };

  const unreadChats = state.notifs.filter((n: Notif) => n.chatId !== 'calendar').length;
  const hasPendingChunk = state.unlockedChunks.some((id: string) => !state.doneChunks.includes(id));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1a1a1f] overflow-hidden select-none">

      <div id="phone" className="phone-frame relative flex shrink-0 flex-col overflow-hidden bg-black">

        {/* Dynamic Island */}
        <div className="absolute top-[11px] left-1/2 z-[90] h-[34px] w-[124px] -translate-x-1/2 rounded-[20px] bg-black pointer-events-none"></div>

        {/* STATUS BAR */}
        <div className={`absolute top-0 z-[80] flex w-full items-center justify-between px-6 pt-[14px] pb-1 text-[15px] font-semibold pointer-events-none transition-colors duration-200 ${
          isLightScreen ? 'text-black' : 'text-white'
        }`}>
          <div className="flex items-center min-w-[70px]">
            {isInApp ? (
              <button
                onClick={() => setActiveScreen('homescreen')}
                className="pointer-events-auto flex items-center gap-1.5 text-[14px] font-semibold tracking-tight text-inherit active:opacity-40 transition-opacity cursor-pointer py-1"
                title="Kembali ke Home"
              >
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 1 1 6l5 5"/>
                </svg>
                <span>Home</span>
              </button>
            ) : (
              // jam mengikuti waktu cerita (04:17 -> 06:10), bukan jam asli
              <span className="text-[15px] font-semibold tracking-tight">{state.clock}</span>
            )}
          </div>
          <div className="flex items-center">
            <img
              src={isLightScreen ? "../icons/Right Side Dark.svg" : "../icons/Right Side Light.svg"}
              alt="Status Icons"
              className="h-[13px] w-auto opacity-90"
            />
          </div>
        </div>

        {/* Area Render Layar */}
        <div className={`relative h-full w-full bg-black overflow-hidden ${rumble ? 'animate-rumble' : ''}`}>
          {activeScreen === 'lockscreen' && <LockScreen onUnlock={handleUnlock} />}
          {activeScreen === 'homescreen' && (
            <HomeScreen onOpenApp={setActiveScreen} messageBadge={unreadChats} pulseMessages={unreadChats > 0 || hasPendingChunk} />
          )}
          {activeScreen === 'imessage' && <IMessage />}
          {activeScreen === 'gallery' && <Gallery />}
          {activeScreen === 'instagram' && <Instagram />}
          {activeScreen === 'twitter' && <Twitter />}
          {activeScreen === 'calendar' && <Calendar />}
          {activeScreen === 'maps' && <Maps />}
          {activeScreen === 'notes' && <Notes onBack={() => setActiveScreen('homescreen')} />}
          {activeScreen === 'settings' && <Settings />}
          {activeScreen === 'contact' && <Contacts onOpenApp={setActiveScreen} />}
          {activeScreen === 'email' && <Email />}
          {activeScreen === 'camera' && <Camera />}
          {activeScreen === 'reminders' && <Reminders />}
          {activeScreen === 'safari' && <Safari />}
          {activeScreen === 'spotify' && <Music />}
          {activeScreen === 'facetime' && <FaceTime />}
          {activeScreen === 'phone' && <Phone onOpenApp={setActiveScreen} />}

          {state.page === 'news' && <NewsPage />}
          <NotificationBanner
            enabled={activeScreen !== 'lockscreen' && !state.call}
            inChatId={activeScreen === 'imessage' ? state.openChat : null}
            onOpen={handleOpenNotif}
          />
          <CallScreen />
          <AlarmOverlay />
        </div>

        {cracked && <Crack />}

        <ResumePrompt />

        {showEnd && (
          <div className="absolute inset-0 z-[97] flex items-center justify-center bg-black/70 px-8 backdrop-blur-sm">
            <div className="w-full rounded-[28px] border border-white/10 bg-zinc-900/95 p-6 text-center">
              <div className="text-[20px] font-semibold text-white">Cerita selesai</div>
              <p className="mt-2 text-[16px] leading-relaxed text-zinc-400">
                <b className="text-zinc-200">Lanjut baca</b>, tetap di sini dan baca isi HP Asahi. 
                <br /> atau <br /> <b className="text-zinc-200">Mulai ulang</b> untuk kembali dari awal (progres dihapus).
              </p>
              <button
                onClick={() => { continueSadSong(); setShowEnd(false); }}
                className="mt-5 w-full rounded-full bg-[#007aff] py-3 text-[16px] font-semibold text-white active:opacity-70"
              >
                Lanjut baca
              </button>
              <button onClick={reset} className="mt-2 w-full py-2 text-[15px] text-red-400 active:opacity-60">
                Mulai ulang dari awal
              </button>
            </div>
          </div>
        )}

        {/* Home Indicator iOS */}
        {isInApp && (
          <div
            id="hb"
            onClick={() => setActiveScreen('homescreen')}
            className="absolute bottom-0 left-0 right-0 z-[85] h-[34px] flex items-end justify-center pb-[8px] cursor-pointer touch-none select-none group"
            title="Kembali ke Home"
          >
            <i className={`w-[139px] h-[5px] rounded-[3px] transition-all duration-200 group-hover:scale-x-105 active:scale-x-95 ${
              isLightScreen ? 'bg-black' : 'bg-white'
            }`} />
          </div>
        )}
      </div>
    </div>
  );
}
