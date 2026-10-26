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
import { STEPS } from './story/script';
import { useStory } from './story/StoryProvider';
import { playSadSong } from './story/bgm';
import type { Notif } from './story/StoryProvider';

// Retakan layar (step 21). Ganti dengan gambar PNG transparan kalau mau lebih realistis.
function Crack() {
  return (
    <svg className="pointer-events-none absolute inset-0 z-[95]" viewBox="0 0 393 852" preserveAspectRatio="none">
      <g stroke="white" strokeOpacity="0.75" fill="none" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M260 310 L190 250 L150 170 L120 90 L100 0" />
        <path d="M260 310 L330 260 L360 190 L393 120" />
        <path d="M260 310 L300 380 L350 430 L393 520" />
        <path d="M260 310 L210 390 L160 450 L110 560 L60 680 L40 852" />
        <path d="M260 310 L250 420 L270 540 L240 660 L260 852" />
        <path d="M190 250 L130 260 L60 230 L0 250" />
        <path d="M210 390 L140 380 L70 410 L0 400" />
        <path d="M300 380 L320 470 L300 560" />
        <circle cx="260" cy="310" r="14" />
        <circle cx="260" cy="310" r="32" strokeOpacity="0.4" />
      </g>
    </svg>
  );
}

export default function App() {
  const { state, openChat, unlockPhone, dismissNotif, reset } = useStory();
  // kalau progres tersimpan dan HP sudah pernah di-unlock, langsung ke home
  const [activeScreen, setActiveScreen] = useState<AppScreen>(state.phoneUnlocked ? 'homescreen' : 'lockscreen');
  const [rumble, setRumble] = useState(false);
  const [cracked, setCracked] = useState(false);

  // cerita selesai (semua step sudah dilewati) -> tawarkan reset progres
  const finished = state.step >= STEPS.length;
  const [showEnd, setShowEnd] = useState(false);
  useEffect(() => {
    if (!finished) { setShowEnd(false); return; }
    const t = setTimeout(() => setShowEnd(true), 1500);
    return () => clearTimeout(t);
  }, [finished]);

  // lagu sedih penutup: kalau progres tersimpan sudah lewat halaman berita (mis. setelah reload), lanjutkan
  // lagunya (mulai di sentuhan pertama, karena browser memblokir autoplay)
  useEffect(() => { if (state.taps.includes('news-back')) playSadSong(0.8); }, [state.taps]);

  // efek layar dari skrip cerita
  useEffect(() => {
    if (!state.fx) return;
    if (state.fx.name === 'knock' || state.fx.name === 'shake' || state.fx.name === 'crack') {
      let rumbleTimeout: ReturnType<typeof setTimeout> | undefined;
      const startTimeout = setTimeout(() => {
        if (state.fx?.name === 'crack') setCracked(true);
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

  const unreadChats = state.notifs.filter(n => n.chatId !== 'calendar').length;
  const hasPendingChunk = state.unlockedChunks.some(id => !state.doneChunks.includes(id));

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

        {showEnd && (
          <div className="absolute inset-0 z-[97] flex items-center justify-center bg-black/70 px-8 backdrop-blur-sm">
            <div className="w-full rounded-[28px] border border-white/10 bg-zinc-900/95 p-6 text-center">
              <div className="text-[20px] font-semibold text-white">Cerita selesai</div>
              <p className="mt-1 text-[14px] text-zinc-400">Mau mengulang dari awal? Progres cerita akan dihapus.</p>
              <button onClick={reset} className="mt-5 w-full rounded-full bg-[#007aff] py-3 text-[16px] font-semibold text-white active:opacity-70">Mulai ulang cerita</button>
              <button onClick={() => setShowEnd(false)} className="mt-2 w-full py-2 text-[15px] text-zinc-400 active:opacity-60">Tutup</button>
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
