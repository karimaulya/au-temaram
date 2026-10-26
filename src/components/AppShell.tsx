import type { ReactNode } from 'react';

export const NO_SB = 'no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';
/** Efek kaca (liquid glass) versi gelap */
export const glass = 'border border-white/10 bg-white/10 backdrop-blur-2xl shadow-[0_4px_16px_rgba(0,0,0,0.45)]';

/** Kerangka halaman app: ruang status bar di atas + home indicator di bawah. bare = tanpa padding (untuk disematkan di app lain). */
export function Page({ children, bg, bare = false }: { children: ReactNode; dark?: boolean; bg?: string; bare?: boolean }) {
  return (
    <div className={`relative flex h-full w-full select-none flex-col overflow-hidden ${bare ? '' : 'pb-[34px] pt-[48px]'} ${bg ?? 'bg-black'} text-white`}>
      {children}
    </div>
  );
}

export const Title = ({ children, right }: { children: ReactNode; right?: ReactNode }) => (
  <div className="flex items-end justify-between px-4 pb-2 pt-1">
    <h1 className="text-[32px] font-bold tracking-tight">{children}</h1>
    {right && <div className="pb-1.5 text-[16px] text-[#007aff]">{right}</div>}
  </div>
);

export const BackBar = ({ label, onBack, right }: { label: string; onBack: () => void; right?: ReactNode }) => (
  <div className="flex items-center justify-between px-3 pb-2 pt-1 text-[#007aff]">
    <button onClick={onBack} className="flex items-center text-[16px] active:opacity-50">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>{label}
    </button>
    <div className="text-[16px]">{right}</div>
  </div>
);

export const Toggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
  <button onClick={() => onChange(!on)} className={`relative h-[30px] w-[50px] shrink-0 rounded-full transition-colors ${on ? 'bg-[#34c759]' : 'bg-zinc-700'}`}>
    <span className={`absolute top-[2px] h-[26px] w-[26px] rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-[2px]'}`} />
  </button>
);

// ---- komponen gaya iOS terbaru ----
export const CircleBtn = ({ children, onClick, className = '' }: { children: ReactNode; onClick?: () => void; className?: string }) => (
  <button onClick={onClick} className={`flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-white transition-transform active:scale-90 ${glass} ${className}`}>{children}</button>
);

export const BackCircle = ({ onBack }: { onBack?: () => void }) => (
  <CircleBtn onClick={onBack}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
  </CircleBtn>
);

export const SearchGlyph = ({ s = 22 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const MicGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v4" /></svg>
);
export const DotsGlyph = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" /></svg>
);

/** Pil pencarian mengambang di bawah + tombol bulat opsional di kanannya */
export function BottomSearch({ action, onAction }: { action?: ReactNode; onAction?: () => void }) {
  return (
    <div className="absolute inset-x-4 bottom-[46px] z-20 flex items-center gap-3">
      <div className={`flex h-[48px] flex-1 items-center gap-2 rounded-full px-4 text-[17px] text-zinc-400 ${glass}`}>
        <SearchGlyph /><span className="flex-1">Search</span><MicGlyph />
      </div>
      {action && <CircleBtn onClick={onAction} className="!h-[48px] !w-[48px]">{action}</CircleBtn>}
    </div>
  );
}
