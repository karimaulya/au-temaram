import { useState, useRef, useEffect, useCallback } from 'react';
import { useStory } from '../story/StoryProvider';

interface LockScreenProps {
  onUnlock: (openChatId?: string) => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const { state } = useStory();
  const pendingChat = useRef<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'lock' | 'passcode'>('lock');
  const [passcode, setPasscode] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const startYRef = useRef<number | null>(null);

  // Transisi ke layar input passcode
  const goToPasscode = (chatId?: string) => {
    pendingChat.current = chatId;
    setViewMode('passcode');
    setDragOffset(0);
    setPasscode('');
  };

  // Pointer drag event pada lockscreen
  const handlePointerDown = (e: React.PointerEvent) => {
    if (viewMode !== 'lock') return;
    if ((e.target as HTMLElement).closest('button')) return;
    startYRef.current = e.clientY;
    isDraggingRef.current = true;
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || startYRef.current === null) return;
    const dy = e.clientY - startYRef.current;
    if (dy < 0) {
      setDragOffset(dy);
    }
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    startYRef.current = null;
    if (dragOffset < -60) {
      goToPasscode();
    } else {
      setDragOffset(0);
    }
  };

  // Mouse wheel scroll to unlock
  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode !== 'lock') return;
    if (e.deltaY > 20 || e.deltaY < -20) {
      goToPasscode();
    }
  };

  // Logika penekanan angka passcode (Target: 072001)
  const handleKeyPress = useCallback((num: string) => {
    if (passcode.length >= 6) return;
    const nextCode = passcode + num;
    setPasscode(nextCode);

    if (nextCode.length === 6) {
      if (nextCode === '082001') {
        setTimeout(() => {
          onUnlock(pendingChat.current);
        }, 120);
      } else {
        // Password salah: goyangkan titik-titik dan reset
        setTimeout(() => {
          setIsShaking(true);
          setTimeout(() => {
            setIsShaking(false);
            setPasscode('');
          }, 400);
        }, 100);
      }
    }
  }, [onUnlock, passcode]);

  const handleDelete = useCallback(() => {
    setPasscode(prev => prev.slice(0, -1));
  }, [setPasscode]);

  // Keyboard support (0-9, Backspace, Escape) saat di layar passcode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'passcode') return;
      if (/^[0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        setViewMode('lock');
        setPasscode('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, handleKeyPress, handleDelete]);

  return (
    <div className="relative h-full w-full select-none overflow-hidden text-white">
      
      {/* ======================================================== */}
      {/* 1. TAMPILAN LOCKSCREEN UTAMA (JAM, TANGGAL & NOTIFIKASI) */}
      {/* ======================================================== */}
      <div 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        style={{
          transform: viewMode === 'passcode' 
            ? 'translateY(-100%)' 
            : `translateY(${dragOffset}px)`,
          opacity: viewMode === 'passcode' ? 0 : Math.max(0.2, 1 + dragOffset / 450),
          transition: isDragging ? 'none' : 'transform 0.38s cubic-bezier(0.2, 1, 0.3, 1), opacity 0.38s ease',
        }}
        className="absolute inset-0 z-10 flex flex-col items-center bg-[url('/photos/lockscreen.jpg')] bg-cover bg-center touch-none cursor-grab active:cursor-grabbing"
      >
        {/* Overlay gradien halus */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35 pointer-events-none"></div>

        {/* Konten Jam & Tanggal Lockscreen */}
        <div className="z-10 flex h-full w-full flex-col items-center pt-[78px] pointer-events-none">
          
          <span className="text-[19px] font-medium tracking-wide drop-shadow-md opacity-95">
            Thu 7, 18°
          </span>
          
          <h1 
            className="text-[96px] font-extrabold tracking-tight leading-none drop-shadow-lg opacity-90 mt-1"
            style={{ fontFamily: '"SF Pro Rounded", ui-rounded, "SF Pro Display", sans-serif' }}
          >
            {state.clock.replace(':', '.')}
          </h1>

          {/* Notifikasi dari skrip cerita */}
          <div className="mt-auto mb-28 w-full px-4 flex flex-col gap-2 pointer-events-auto">
            {state.notifs.slice(-4).map(n => {
              const isCal = n.chatId === 'calendar';
              return (
                <div
                  key={n.id}
                  onClick={() => goToPasscode(isCal ? undefined : n.chatId)}
                  className="rounded-[20px] bg-white/20 backdrop-blur-xl border border-white/20 p-3.5 shadow-lg flex items-center gap-3 cursor-pointer active:scale-95 transition-transform"
                >
                  <img src={isCal ? '/icons/Calendar.svg' : '/icons/Messages.svg'} alt="" className="h-10 w-10 rounded-[10px] shrink-0 object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center text-[12px] font-semibold text-white/90">
                      <span>{isCal ? 'Calendar' : 'Messages'}</span>
                      <span className="text-white/60">now</span>
                    </div>
                    <p className="text-[13px] text-white/95 truncate">{isCal ? n.text : `${n.sender}: ${n.text}`}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tombol Flashlight & Camera Bawah */}
          <div className="absolute bottom-11 flex w-full justify-between px-10 pointer-events-auto">
            <button 
              onClick={(e) => { e.stopPropagation(); }}
              className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-black/35 backdrop-blur-xl border border-white/10 shadow-lg active:scale-110 active:bg-white/40 transition-all cursor-pointer"
            >
              <img src="/icons/Flashlight button.svg" alt="Flashlight" className="h-full w-full object-cover" />
            </button>
            
            <button 
              onClick={(e) => { e.stopPropagation(); }}
              className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-black/35 backdrop-blur-xl border border-white/10 shadow-lg active:scale-110 active:bg-white/40 transition-all cursor-pointer"
            >
              <img src="/icons/Camera button.svg" alt="Camera" className="h-full w-full object-cover" />
            </button>
          </div>
          
          {/* Teks Petunjuk Buka Geser ke Atas */}
          <div 
            onClick={() => goToPasscode()}
            className="absolute bottom-3 flex flex-col items-center gap-1 cursor-pointer pointer-events-auto active:opacity-60 transition-opacity"
          >
            <div className="h-[4.5px] w-[134px] rounded-full bg-white/90 shadow-sm mt-0.5"></div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TAMPILAN PASSCODE SCREEN (PASSWORD: 072001) */}
      {/* ======================================================== */}
      <div 
        style={{
          transform: viewMode === 'passcode' ? 'none' : 'translateY(100%)',
          opacity: viewMode === 'passcode' ? 1 : 0,
          transition: 'transform 0.38s cubic-bezier(0.2, 0.9, 0.25, 1), opacity 0.35s ease',
        }}
        className="absolute inset-0 z-20 flex flex-col items-center bg-[url('/photos/lockscreen.jpg')] bg-cover bg-center overflow-hidden"
      >
        {/* Backdrop Blur & Dimming Effect Khas iOS */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-3xl"></div>

        {/* Konten Keypad Passcode */}
        <div className="z-10 h-full w-full overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-h-full w-full flex-col items-center justify-between gap-6 pt-[96px] pb-10 px-6">
          
          {/* Header Title & Dots */}
          <div className="flex flex-col items-center">
            <h2 className="text-[20px] font-medium tracking-tight text-white drop-shadow-sm">
              Enter Passcode
            </h2>

            {/* 6 Dots Indicator */}
            <div className={`flex gap-4 mt-6 ${isShaking ? 'animate-shake' : ''}`}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span 
                  key={i}
                  className={`h-3 w-3 rounded-full border-[1.5px] border-white transition-all duration-150 ${
                    i < passcode.length ? 'bg-white' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Keypad Grid 3 Kolom Khas iOS */}
          <div className="grid grid-cols-3 gap-x-6 gap-y-4 my-auto">
            {[
              { num: '1', letters: '' },
              { num: '2', letters: 'A B C' },
              { num: '3', letters: 'D E F' },
              { num: '4', letters: 'G H I' },
              { num: '5', letters: 'J K L' },
              { num: '6', letters: 'M N O' },
              { num: '7', letters: 'P Q R S' },
              { num: '8', letters: 'T U V' },
              { num: '9', letters: 'W X Y Z' },
            ].map((k) => (
              <button
                key={k.num}
                onClick={() => handleKeyPress(k.num)}
                className="flex h-[74px] w-[74px] flex-col items-center justify-center rounded-full bg-white/20 backdrop-blur-md active:bg-white/45 transition-all active:scale-95 text-white"
              >
                <span className="text-[34px] font-light leading-none">{k.num}</span>
                {k.letters && (
                  <span className="text-[9px] font-bold tracking-[1.5px] opacity-90 mt-0.5">
                    {k.letters}
                  </span>
                )}
              </button>
            ))}

            {/* Baris Bawah: Kosong, 0, Kosong */}
            <div></div>
            <button
              onClick={() => handleKeyPress('0')}
              className="flex h-[74px] w-[74px] flex-col items-center justify-center rounded-full bg-white/20 backdrop-blur-md active:bg-white/45 transition-all active:scale-95 text-white"
            >
              <span className="text-[34px] font-light leading-none">0</span>
            </button>
            <div></div>
          </div>

          {/* Tombol Bawah: Emergency & Cancel / Delete */}
          <div className="flex w-full justify-between items-center px-4 text-[16px] font-medium text-white/90">
            <button 
              onClick={() => {}}
              className="active:opacity-50"
            >
              Emergency
            </button>
            <button 
              onClick={passcode ? handleDelete : () => { setViewMode('lock'); setPasscode(''); }}
              className="active:opacity-50"
            >
              {passcode ? 'Delete' : 'Cancel'}
            </button>
          </div>

        </div>
        </div>

      </div>

    </div>
  );
}