import { useEffect, useRef, useState } from 'react';
import { useStory } from '../story/StoryProvider';
import type { Notif } from '../story/StoryProvider';

interface Props {
  enabled: boolean;               // false di lockscreen (notif tampil di daftar lockscreen)
  inChatId: string | null;        // chat yang sedang dibuka user (notifnya disembunyikan)
  onOpen: (n: Notif) => void;
}

export default function NotificationBanner({ enabled, inChatId, onOpen }: Props) {
  const { state, dismissNotif } = useStory();
  const [shown, setShown] = useState<Notif | null>(null);
  const seen = useRef(new Set<string>());
  const hideTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;
    const next = state.notifs.find(n => !seen.current.has(n.id));
    if (!next) return;
    seen.current.add(next.id);
    if (next.chatId === inChatId) { dismissNotif(next.id); return; } // user sedang membaca chat ini
    setShown(next);
    clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setShown(null), 4000);
  }, [state.notifs, enabled, inChatId, dismissNotif]);

  // kalau notif yang tampil sudah dibuka/dihapus, tutup banner
  useEffect(() => {
    if (shown && !state.notifs.some(n => n.id === shown.id)) setShown(null);
  }, [state.notifs, shown]);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  if (!shown || !enabled) return null;
  const isCal = shown.chatId === 'calendar';
  return (
    <div className="absolute left-3 right-3 top-[52px] z-[88] animate-banner">
      <div
        onClick={() => { setShown(null); onOpen(shown); }}
        className="flex items-center gap-3 rounded-[22px] bg-white/85 p-3 shadow-xl backdrop-blur-xl cursor-pointer active:scale-[0.98] transition-transform text-black"
      >
        <img src={isCal ? '/icons/Calendar.svg' : '/icons/Messages.svg'} alt="" className="h-9 w-9 rounded-[9px] object-cover shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex justify-between text-[12px] font-semibold">
            <span>{isCal ? 'Calendar' : shown.sender}</span>
            <span className="font-normal text-black/50">now</span>
          </div>
          <p className="truncate text-[13px] text-black/80">{shown.text}</p>
        </div>
      </div>
    </div>
  );
}
