import { useEffect, useState } from 'react';

// Keyboard iOS tiruan. Bukan untuk diketik user: dipakai supaya terlihat Asahi sedang mengetik.
// Tiap huruf baru -> tombolnya menyala sebentar + muncul pop-up khas iOS.

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

interface Props {
  lastChar: string | null;   // huruf terakhir yang diketik
  tick: number;              // jumlah huruf yang sudah diketik (berubah tiap huruf, termasuk huruf kembar)
  canSend: boolean;          // true = selesai diketik, tombol return jadi biru
  onSend: () => void;
}

const keyIdOf = (c: string) => (/[a-z]/i.test(c) ? c.toLowerCase() : c === ' ' ? 'space' : 'sym');

export default function Keyboard({ lastChar, tick, canSend, onSend }: Props) {
  const [pressed, setPressed] = useState<{ id: string; label: string } | null>(null);

  useEffect(() => {
    if (!lastChar || tick === 0) { setPressed(null); return; }
    setPressed({ id: keyIdOf(lastChar), label: lastChar });
    const t = window.setTimeout(() => setPressed(null), 100);
    return () => clearTimeout(t);
  }, [tick, lastChar]);

  const shiftOn = !!pressed && /[A-Z]/.test(pressed.label);
  const base = 'flex h-[42px] w-full items-center justify-center rounded-[5px] text-[22px] shadow-[0_1px_0_rgba(0,0,0,0.3)] transition-colors duration-75';

  const pop = (label: string) => (
    <div className="absolute -top-[50px] left-1/2 z-10 flex h-[56px] w-[150%] -translate-x-1/2 items-center justify-center rounded-[10px] bg-white text-[32px] shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
      {label}
    </div>
  );

  return (
    <div className="kb-up relative z-10 shrink-0 select-none bg-[#d2d4da] px-[3px] pb-[34px] pt-[8px] text-black">
      <style>{`@keyframes kbup{from{transform:translateY(40%);opacity:.4}to{transform:none;opacity:1}}.kb-up{animation:kbup .22s ease-out}`}</style>

      <div className="flex">
        {ROWS[0].split('').map(ch => (
          <div key={ch} className="relative flex-1 px-[3px] pb-[11px]">
            {pressed?.id === ch && pop(pressed.label)}
            <div className={`${base} ${pressed?.id === ch ? 'bg-gray-300' : 'bg-white'}`}>{ch}</div>
          </div>
        ))}
      </div>

      <div className="flex px-[18px]">
        {ROWS[1].split('').map(ch => (
          <div key={ch} className="relative flex-1 px-[3px] pb-[11px]">
            {pressed?.id === ch && pop(pressed.label)}
            <div className={`${base} ${pressed?.id === ch ? 'bg-gray-300' : 'bg-white'}`}>{ch}</div>
          </div>
        ))}
      </div>

      <div className="flex">
        <div className="w-[44px] shrink-0 px-[3px] pb-[11px]">
          <div className={`${base} ${shiftOn ? 'bg-white' : 'bg-[#aeb3bd]'}`}>⇧</div>
        </div>
        <div className="flex flex-1 px-[4px]">
          {ROWS[2].split('').map(ch => (
            <div key={ch} className="relative flex-1 px-[3px] pb-[11px]">
              {pressed?.id === ch && pop(pressed.label)}
              <div className={`${base} ${pressed?.id === ch ? 'bg-gray-300' : 'bg-white'}`}>{ch}</div>
            </div>
          ))}
        </div>
        <div className="w-[44px] shrink-0 px-[3px] pb-[11px]">
          <div className={`${base} bg-[#aeb3bd] text-[18px]`}>⌫</div>
        </div>
      </div>

      <div className="flex">
        <div className="relative w-[84px] shrink-0 px-[3px]">
          {pressed?.id === 'sym' && pop(pressed.label)}
          <div className={`${base} text-[16px] ${pressed?.id === 'sym' ? 'bg-white' : 'bg-[#aeb3bd]'}`}>123</div>
        </div>
        <div className="flex-1 px-[3px]">
          <div className={`${base} text-[15px] ${pressed?.id === 'space' ? 'bg-gray-300' : 'bg-white'}`}>space</div>
        </div>
        <div className="w-[100px] shrink-0 px-[3px]">
          <button
            onClick={onSend}
            disabled={!canSend}
            className={`${base} text-[16px] ${canSend ? 'bg-[#007aff] font-medium text-white active:opacity-70' : 'bg-[#aeb3bd] text-black/60'}`}
          >
            return
          </button>
        </div>
      </div>
    </div>
  );
}
