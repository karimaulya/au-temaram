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
import { useStory } from './story/StoryProvider';
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
  const { state, openChat, unlockPhone, dismissNotif } = useStory();
  // kalau progres tersimpan dan HP sudah pernah di-unlock, langsung ke home
  const [activeScreen, setActiveScreen] = useState<AppScreen>(state.phoneUnlocked ? 'homescreen' : 'lockscreen');
  const [rumble, setRumble] = useState(false);
  const [cracked, setCracked] = useState(false);

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

  const isLightScreen = activeScreen === 'imessage' || activeScreen === 'gallery' || activeScreen === 'instagram' || state.page === 'news';
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
        <div className={`relative h-full w-full bg-white overflow-hidden ${rumble ? 'animate-rumble' : ''}`}>
          {activeScreen === 'lockscreen' && <LockScreen onUnlock={handleUnlock} />}
          {activeScreen === 'homescreen' && (
            <HomeScreen onOpenApp={setActiveScreen} messageBadge={unreadChats} pulseMessages={unreadChats > 0 || hasPendingChunk} />
          )}
          {activeScreen === 'imessage' && <IMessage />}
          {activeScreen === 'gallery' && <Gallery />}
          {activeScreen === 'instagram' && <Instagram />}

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
