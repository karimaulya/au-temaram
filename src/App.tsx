import { useState, useEffect } from 'react';
import type { AppScreen } from './types';
import LockScreen from './components/LockScreen';
import HomeScreen from './components/HomeScreen';
import IMessage from './components/IMessage';
import Gallery from './components/Gallery';
import Instagram from './components/Instagram';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<AppScreen>('lockscreen');
  
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, 
  });

  const isLightScreen = activeScreen === 'imessage' || activeScreen === 'gallery' || activeScreen === 'instagram';
  const isInApp = activeScreen !== 'lockscreen' && activeScreen !== 'homescreen';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1a1a1f] overflow-hidden select-none">
      
      <div 
        id="phone"
        className="relative flex flex-col overflow-hidden bg-black shrink-0 shadow-[0_0_0_2px_#3b3b40,0_0_0_3px_#18181a,0_35px_80px_rgba(0,0,0,0.85)]"
        style={{
          width: '393px',
          height: '852px',
          borderRadius: '54px',
          border: '10px solid #121214',
          transform: 'scale(0.80)',
          transformOrigin: 'center'
        }}
      >
        
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
              <span className="text-[15px] font-semibold tracking-tight">
                {formattedTime}
              </span>
            )}
          </div>
          
          <div className="flex items-center">
            <img 
              src={isLightScreen ? "/icons/Right Side Dark.svg" : "/icons/Right Side Light.svg"} 
              alt="Status Icons" 
              className="h-[13px] w-auto opacity-90" 
            />
          </div>

        </div>

        {/* Area Render Layar */}
        <div className="relative h-full w-full bg-white overflow-hidden">
          {activeScreen === 'lockscreen' && <LockScreen onUnlock={() => setActiveScreen('homescreen')} />}
          {activeScreen === 'homescreen' && <HomeScreen onOpenApp={setActiveScreen} />}
          {activeScreen === 'imessage' && <IMessage />}
          {activeScreen === 'gallery' && <Gallery />}
          {activeScreen === 'instagram' && <Instagram />}
        </div>

        {/* Home Indicator iOS */}
        {isInApp && (
          <div 
            id="hb"
            onClick={() => setActiveScreen('homescreen')}
            className="absolute bottom-0 left-0 right-0 z-[85] h-[34px] flex items-end justify-center pb-[8px] cursor-pointer touch-none select-none group"
            title="Kembali ke Home"
          >
            <i 
              className={`w-[139px] h-[5px] rounded-[3px] transition-all duration-200 group-hover:scale-x-105 active:scale-x-95 ${
                isLightScreen ? 'bg-black' : 'bg-white'
              }`}
            />
          </div>
        )}
      </div>
    </div>
  );
}