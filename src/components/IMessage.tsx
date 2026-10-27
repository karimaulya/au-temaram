import { useEffect, useRef } from 'react';
import { useStory, useChatPlayback, STORY_DATA } from '../story/StoryProvider';
import Keyboard from './Keyboard';
import { separatorFor } from '../story/chatTime';
import { useAfter, labelToShort } from '../story/dates';

// Nama tampilan per chat (judul sheet bukan selalu nama yang diinginkan).
const LABELS: Record<string, string> = {
  group: 'Ujang Kedu💙', jae: 'Jae berisik', owner: 'Temaram Guest House', ucuk: 'Bang Ucuk', jeo: 'Jeo', mia: 'Mia (sepupu)', prev: 'Ujang Kedu💙',
};
// Foto profil: isi dengan path di /public, mis. 'Jae berisik': '/avatars/jae.jpg'. Kosong -> inisial berwarna.
const AVATARS: Record<string, string> = {
  'Jae berisik': '/Avatar/Jae berisik.jpeg',
  'Ujang Kedu💙': '/Avatar/Ujang Kedu.jpg',
  'Bang Ucuk': '/Avatar/Bang Ucuk.jpeg',
  'Jeo': '/Avatar/Jeo.jpeg',
  'Bang Ajun': '/Avatar/Bang Ajun.jpeg',
  'Bang Ji': '/Avatar/Bang Ji.jpeg',
  'Bang Ochi': '/Avatar/Bang Ochi.jpeg',
  'Doyie': '/Avatar/Doyie.jpeg',
  'Haruto': '/Avatar/Haruto.jpeg',
  'Junghwan': '/Avatar/Junghwan.jpeg',

};

// Chat di luar xlsx (tetap ada setelah chat dihapus, step 25). TODO: isi chat grup H-1 kecelakaan.
const EXTRA_CHATS = [{ id: 'prev', title: 'Ujang Kedu💙', isGroup: true }];

function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  const src = AVATARS[name];
  // ukuran dikunci (width/height/min/max + flex) supaya tidak gepeng & tidak menggeser bubble
  const box = { width: size, height: size, minWidth: size, maxWidth: 'none', flex: `0 0 ${size}px` } as const;
  if (src) return <img src={encodeURI(src)} alt={name} style={box} className="aspect-square rounded-full object-cover" />;
  let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  return (
    <div style={{ ...box, background: `hsl(${h} 45% 55%)`, fontSize: size * 0.4 }}
      className="flex items-center justify-center rounded-full font-semibold text-white">
      {name.replace(/^(Bang|Abang)\s+/i, '').slice(0, 1).toUpperCase()}
    </div>
  );
}

function Inbox() {
  const { state, openChat } = useStory();
  const after = useAfter();
  const allChats = [...STORY_DATA.chats, ...EXTRA_CHATS.filter(e => !STORY_DATA.chats.some(c => c.id === e.id))];

  const rows = allChats.map(meta => {
    const chunks = STORY_DATA.chunks.filter(k => k.chatId === meta.id && state.unlockedChunks.includes(k.id));
    const isExtra = EXTRA_CHATS.some(e => e.id === meta.id);
    const lastUnlock = Math.max(-1, ...chunks.map(k => state.unlockedChunks.indexOf(k.id)));
    const shown = chunks.flatMap(k => k.messages.slice(0, state.progress[k.id] ?? 0));
    const live = shown.filter(m => !m.dateLabel);
    const last = live[live.length - 1] ?? shown[shown.length - 1];   // chat lama (mis. grup 2025) tetap punya preview
    const notif = [...state.notifs].reverse().find(n => n.chatId === meta.id);
    const unread = state.notifs.filter(n => n.chatId === meta.id).length;
    return { meta, chunks, isExtra, lastUnlock, last, notif, unread };
  })
    .filter(r => (state.wipedKeep ? state.wipedKeep.includes(r.meta.id) : r.chunks.length > 0 && !r.isExtra) || (state.wipedKeep && r.isExtra && state.wipedKeep.includes(r.meta.id)))
    .sort((a, b) => b.lastUnlock - a.lastUnlock);

  return (
    <div className="flex h-full min-h-0 flex-col pt-[48px] text-white">
      <div className="flex justify-between px-4 pb-2 pt-1 text-[16px] text-[#007aff]">
        <span>Edit</span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
      </div>
      <h1 className="mb-2 px-4 text-[32px] font-bold tracking-tight">Messages</h1>
      <div className="mb-2 px-4">
        <div className="flex items-center gap-1.5 rounded-[10px] bg-zinc-900 p-1.5 px-2 text-[15px] text-zinc-400">Search</div>
      </div>
      <div className="min-h-0 flex-1 divide-y divide-zinc-800 overflow-y-auto px-4 no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {rows.length === 0 && <p className="pt-10 text-center text-[14px] text-zinc-500">Tidak ada pesan</p>}
        {rows.map(({ meta, last, notif, unread }) => {
          const label = LABELS[meta.id] ?? meta.title;
          const preview = last ? `${meta.isGroup && !last.isSelf ? last.sender + ': ' : ''}${last.text}` : notif ? notif.text : '';
          return (
            <div key={meta.id} onClick={() => openChat(meta.id)} className="flex cursor-pointer items-center gap-3 py-3 active:opacity-60 transition-opacity">
              <Avatar name={label} size={48} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="truncate text-[16px] font-semibold">{label}</span>
                  <span className="text-[13px] text-zinc-500">{after && last?.dateLabel ? labelToShort(last.dateLabel) : last?.time ?? ''}</span>
                </div>
                <p className="truncate text-[14px] text-zinc-400">{preview}</p>
              </div>
              {unread > 0 && <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#007aff] px-1.5 text-[12px] font-bold text-white">{unread}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChatRoom({ chatId }: { chatId: string }) {
  const { openChat, openPage } = useStory();
  const p = useChatPlayback(chatId);
  const after = useAfter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const meta = [...STORY_DATA.chats, ...EXTRA_CHATS].find(c => c.id === chatId);
  const label = LABELS[chatId] ?? meta?.title ?? '';
  const isGroup = !!meta?.isGroup;
  const msgs = p.messages;
  const seps = msgs.map((m, i) => separatorFor(m, msgs[i - 1], after));   // timestamp di tengah room chat

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs.length, p.typing, p.composing, p.composerText]);

  // teks yang diketik lebih dari 1 baris: kolom ketik membesar ke atas & selalu menampilkan baris terakhir
  useEffect(() => { composerRef.current?.scrollTo({ top: composerRef.current.scrollHeight }); }, [p.composerText]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-black">
      <div className="z-20 flex items-center justify-between border-b border-zinc-800 bg-black/95 px-3 pb-2 pt-[44px] backdrop-blur-md">
        <button onClick={() => openChat(null)} className="-ml-1 flex items-center py-1 pr-2 text-[#007aff] active:opacity-60" title="Kembali">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div className="-ml-2 flex flex-1 flex-col items-center justify-center">
          <Avatar name={label} size={40} />
          <div className="mt-1 flex items-center gap-1 text-[12px] font-semibold leading-tight text-white">
            <span>{label}</span><span className="text-[11px] font-normal text-zinc-500">›</span>
          </div>
        </div>
        <div className="w-7"></div>
      </div>

      <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-[3px] overflow-y-auto px-3.5 py-3 no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {msgs.map((msg, i) => {
          const isMe = msg.isSelf;
          const prev = msgs[i - 1], next = msgs[i + 1];
          const sep = seps[i];
          const isPrevSame = !!prev && !prev.dateLabel && prev.sender === msg.sender && !msg.dateLabel && !sep;
          const isNextSame = !!next && !next.dateLabel && next.sender === msg.sender && !seps[i + 1];
          const showName = isGroup && !isMe && !isPrevSame;
          const showAvatar = isGroup && !isMe && !isNextSame;
          const shape = isMe
            ? `${isPrevSame ? 'rounded-tr-[6px]' : ''} ${isNextSame ? 'rounded-br-[6px]' : 'rounded-br-[4px]'}`
            : `${isPrevSame ? 'rounded-tl-[6px]' : ''} ${isNextSame ? 'rounded-bl-[6px]' : 'rounded-bl-[4px]'}`;
          const isLink = msg.kind === 'link' || /^link berita$/i.test(msg.text);
          return (
            <div key={msg.id}>
              {sep && <div className="my-2 text-center text-[11px] font-medium text-zinc-500">{sep}</div>}
              <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${!isNextSame ? 'mb-2.5' : ''}`}>
                {showName && <span className="mb-1 ml-9 text-[11px] tracking-tight text-zinc-500">{msg.sender}</span>}
                <div className="flex max-w-[82%] items-end gap-1.5">
                  {isGroup && !isMe && (showAvatar ? <div className="mb-0.5 h-7 w-7 shrink-0"><Avatar name={msg.sender} /></div> : <div className="h-7 w-7 shrink-0" />)}
                  <div
                    onClick={isLink ? () => openPage('news') : undefined}
                    className={`relative break-words px-3.5 py-2 text-[15px] leading-snug rounded-[18px] ${shape} ${
                      isMe ? 'bg-[#007aff] text-white' : 'bg-[#26262a] text-white'
                    } ${isLink ? 'cursor-pointer underline' : ''}`}
                  >
                    <span>{msg.kind === 'location' ? '📍 Shared location' : msg.kind === 'file' ? `📎 ${msg.text}` : msg.text}</span>
                    {msg.time && (
                      <span className={`float-right ml-2.5 mt-[7px] select-none text-[10px] leading-none ${isMe ? 'text-white/70' : 'text-white/40'}`}>
                        {msg.time}
                      </span>
                    )}
                    {!isNextSame && (
                      <svg aria-hidden="true" className={`absolute bottom-0 h-4 w-4 ${isMe ? '-right-2 scale-x-[-1]' : '-left-2'}`} viewBox="0 0 16 16">
                        <path d="M16 0C15 6 12 10 5 13L0 16L8 15C13 13 16 9 16 4Z" fill={isMe ? '#007aff' : '#26262a'} />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {p.typing && p.typingSender && (
          <div className="flex items-end gap-1.5">
            {isGroup && <Avatar name={p.typingSender} />}
            <div className="flex gap-1 rounded-[18px] bg-[#26262a] px-4 py-3">
              {[0, 1, 2].map(i => <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
          </div>
        )}
      </div>

      {/* Kolom ketik: terisi otomatis dengan balasan Asahi berikutnya, user tinggal kirim */}
      {p.blockedBy && (
        <button
          onClick={() => openChat(p.blockedBy)}
          className="mx-3 mb-1 rounded-xl bg-zinc-900 px-3 py-2 text-center text-[12px] text-zinc-400 active:opacity-60"
        >
          Balas dulu chat <b>{LABELS[p.blockedBy] ?? p.blockedBy}</b> sebelum lanjut ke sini
        </button>
      )}
      <div className={`flex items-end gap-2 border-t border-zinc-800 bg-black p-2.5 ${p.composing ? 'pb-2' : 'pb-6'}`}>
        <div className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </div>
        <div className="relative flex-1">
          <div
            ref={composerRef}
            className="max-h-[112px] min-h-[34px] w-full overflow-y-auto whitespace-pre-wrap break-words rounded-[18px] border border-zinc-700 px-4 py-1.5 pr-10 text-[15px] leading-snug text-white no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {p.composerText || <span className="text-zinc-500">iMessage</span>}
          </div>
          {p.canSend && (
            <button onClick={p.send} className="absolute bottom-[3px] right-[3px] flex h-7 w-7 animate-pulse items-center justify-center rounded-full bg-[#007aff] text-white transition-transform active:scale-90">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
            </button>
          )}
        </div>
      </div>
      {p.composing && <Keyboard lastChar={p.lastTyped} tick={p.typedTick} canSend={p.canSend} onSend={p.send} />}
    </div>
  );
}

export default function IMessage() {
  const { state } = useStory();
  return (
    <div className="flex h-full w-full flex-col bg-black">
      {state.openChat ? <ChatRoom chatId={state.openChat} /> : <Inbox />}
    </div>
  );
}
