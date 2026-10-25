import { useEffect } from 'react';
import { useStory, playSfx, stopSfx } from '../story/StoryProvider';

export default function AlarmOverlay() {
  const { state, tap } = useStory();
  const label = state.alarm;

  useEffect(() => {
    if (!label) return;
    playSfx('alarm', true);
    return () => stopSfx('alarm');
  }, [label]);

  if (!label) return null;
  return (
    <div className="absolute inset-0 z-[78] flex flex-col items-center overflow-y-auto bg-black/90 text-white backdrop-blur-xl no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="mt-[130px] text-[18px] text-white/60">Alarm</div>
      <div className="mt-2 text-[84px] font-light leading-none">{state.clock}</div>
      <div className="mt-3 text-[20px]">{label}</div>
      <div className="mt-auto mb-[90px] flex w-full flex-col gap-3 px-8">
        <button onClick={() => tap('alarm-dismiss')} className="rounded-full bg-orange-500 py-4 text-[20px] font-semibold active:opacity-70">Stop</button>
      </div>
    </div>
  );
}
