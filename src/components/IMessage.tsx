import { useState, useRef, useEffect } from 'react';

// Data avatar profil anggota grup sesuai screenshot AU
const GROUP_MEMBERS = [
  { id: 'm1', name: 'Gama', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop' },
  { id: 'm2', name: 'Juan', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=200&auto=format&fit=crop' },
  { id: 'm3', name: 'Ryul', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
  { id: 'm4', name: 'Jihoon', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop' },
  { id: 'm5', name: 'Nadhif', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200&auto=format&fit=crop' },
  { id: 'm6', name: 'Adilla', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop' },
  { id: 'm7', name: 'Junyoung', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop' },
];

const getSenderAvatar = (senderName: string) => {
  const member = GROUP_MEMBERS.find(m => m.name.toLowerCase() === senderName.toLowerCase());
  return member?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop';
};

// Foto profil grup utama (aesthetic group portrait AU)
const GROUP_PROFILE_PIC = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=200&auto=format&fit=crop';

const INITIAL_CHATS = [
  { 
    id: 3, 
    name: 'Menuju Tak Terbatas🚀', 
    message: 'Gama: Iya seenggaknya buat sekarang gue...', 
    time: '14:48', 
    unread: 2, 
    isGroup: true,
    groupAvatar: GROUP_PROFILE_PIC
  },
  { 
    id: 2, 
    name: 'abang junyoung', 
    message: 'hahahaha iyaa abaaang', 
    time: 'Yesterday', 
    unread: 0, 
    isGroup: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
  },
  { 
    id: 1, 
    name: 'Unknown', 
    message: 'Foto', 
    time: 'Tuesday', 
    unread: 0, 
    isGroup: false,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
  },
];

const INITIAL_MESSAGES: Record<number, { id: number; sender: string; text: string }[]> = {
  3: [
    { id: 1, sender: 'Juan', text: 'Weh santai' },
    { id: 2, sender: 'Juan', text: 'Gue malah takut lo kenapa2 jir gam' },
    { id: 3, sender: 'Gama', text: 'Biar gue urus sendiri ya' },
    { id: 4, sender: 'Gama', text: 'Sorry sorry' },
    { id: 5, sender: 'Gama', text: 'Ini di jalan' },
    { id: 6, sender: 'Gama', text: 'Boleh tolong hadepin ke belakang supaya abang2 gak tau?' },
    { id: 7, sender: 'Gama', text: 'Biar mereka kira itu karangan bunga biasa' },
    { id: 8, sender: 'me', text: 'Nanti mereka juga bakal tau kali gam' },
    { id: 9, sender: 'Gama', text: 'Iya seenggaknya buat sekarang gue gak mau bikin mereka khawatir' },
  ],
  2: [
    { id: 1, sender: 'abang junyoung', text: 'makan makan yuk abang sama bang jihoon? habis itu ke makam mama papa. aku ajak ryul juga' },
    { id: 2, sender: 'me', text: 'Boleh, adek. Nanti abang bilangin ke jihoon ya' },
    { id: 3, sender: 'abang junyoung', text: 'okayy' },
    { id: 4, sender: 'abang junyoung', text: 'tapi kalau misal aku ga pulang' },
    { id: 5, sender: 'abang junyoung', text: 'aku berharap abang bahagia selamanya' },
    { id: 6, sender: 'me', text: 'Kenapa gitu ngomongnya?' },
    { id: 7, sender: 'abang junyoung', text: 'gak tau. pengen ngomong gitu aja' },
    { id: 8, sender: 'me', text: 'Gak usah ngomong ngawur. Kamu pasti bakal pulang lah' },
    { id: 9, sender: 'abang junyoung', text: 'hahahaha iyaa abaaang' },
  ],
  1: [
    { id: 1, sender: 'Unknown', text: 'Tolong cek file yang saya kirim.' }
  ]
};

export default function IMessage() {
  const [activeChat, setActiveChat] = useState<number | null>(3);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const chatData = INITIAL_CHATS.find(c => c.id === activeChat);
  const currentMessages = activeChat ? messages[activeChat] || [] : [];

  useEffect(() => {
    if (activeChat) {
      const chatScroll = chatScrollRef.current;
      chatScroll?.scrollTo({ top: chatScroll.scrollHeight, behavior: 'smooth' });
    }
  }, [activeChat, messages]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeChat) return;
    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: inputText.trim()
    };
    setMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMsg]
    }));
    setInputText('');
  };

  return (
    <div className="flex h-full w-full flex-col bg-white">
      
      {!activeChat ? (
        // ==============================
        // TAMPILAN 1: DAFTAR PESAN (INBOX)
        // ==============================
        <div className="flex h-full flex-col text-black pt-[48px]">
          {/* Header */}
          <div className="flex justify-between px-4 pb-2 pt-1 text-[16px] font-normal text-[#007aff]">
            <button className="active:opacity-50">Edit</button>
            <button className="active:opacity-50">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
          </div>
          
          <h1 className="mb-2 px-4 text-[32px] font-bold tracking-tight">Messages</h1>
          
          {/* Search Bar */}
          <div className="mb-2 px-4">
            <div className="flex items-center gap-1.5 rounded-[10px] bg-gray-100 p-1.5 px-2 text-[15px] text-gray-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              Search
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto px-4 divide-y divide-gray-100">
            {INITIAL_CHATS.map((chat) => (
              <div 
                key={chat.id} 
                onClick={() => setActiveChat(chat.id)}
                className="flex items-center gap-3 py-3 cursor-pointer active:opacity-60 transition-opacity"
              >
                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  <img 
                    src={chat.isGroup ? chat.groupAvatar : chat.avatar} 
                    alt={chat.name} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[16px] font-semibold text-black truncate">{chat.name}</span>
                    <span className="text-[13px] text-gray-400">{chat.time}</span>
                  </div>
                  <p className="text-[14px] text-gray-500 truncate">{chat.message}</p>
                </div>
                {chat.unread > 0 && (
                  <span className="h-5 min-w-[20px] rounded-full bg-[#007aff] px-1.5 text-center text-[12px] font-bold text-white flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        // ==============================
        // TAMPILAN 2: RUANG OBROLAN (ROOMCHAT)
        // ==============================
        <div className="flex h-full flex-col bg-white">
          
          {/* Header Roomchat iOS: Satu Foto Profil Grup Saja */}
          <div className="z-20 flex items-center justify-between bg-white/95 px-3 pt-[44px] pb-2 border-b border-gray-100/80 backdrop-blur-md">
            
            {/* Tombol Back Chevron Biru */}
            <button 
              onClick={() => setActiveChat(null)} 
              className="flex items-center text-[#007aff] active:opacity-60 -ml-1 py-1 pr-2"
              title="Kembali"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {/* Bagian Tengah Header: Satu Foto Profil Grup + Nama Grup */}
            <div className="flex flex-1 flex-col items-center justify-center -ml-2">
              <div className="h-10 w-10 rounded-full overflow-hidden border border-white shadow-sm ring-1 ring-black/10">
                <img 
                  src={chatData?.isGroup ? chatData?.groupAvatar : chatData?.avatar} 
                  alt={chatData?.name} 
                  className="h-full w-full object-cover" 
                />
              </div>
              <div className="flex items-center gap-1 mt-1 text-[12px] font-semibold text-black leading-tight cursor-pointer active:opacity-60">
                <span>{chatData?.name}</span>
                <span className="text-[11px] text-gray-400 font-normal">›</span>
              </div>
            </div>

            {/* Penyeimbang Kanan */}
            <div className="w-7"></div>
          </div>
          
          {/* Area Chat Bubbles */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col gap-[3px]">
            {currentMessages.map((msg, index) => {
              const isMe = msg.sender === 'me';
              const isNextSame = currentMessages[index + 1]?.sender === msg.sender;
              const isPrevSame = currentMessages[index - 1]?.sender === msg.sender;
              
              const showSenderName = chatData?.isGroup && !isMe && !isPrevSame;
              const showAvatar = chatData?.isGroup && !isMe && !isNextSame;
              const senderAvatar = getSenderAvatar(msg.sender);

              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${!isNextSame ? 'mb-2.5' : ''}`}>
                  
                  {/* Nama Pengirim di Grup Chat */}
                  {showSenderName && (
                    <span className="text-[11px] text-gray-400 ml-9 mb-1 font-normal tracking-tight">
                      {msg.sender}
                    </span>
                  )}

                  <div className="flex items-end gap-1.5 max-w-[82%]">
                    {/* Avatar Pengirim (hanya di bubble terakhir rentetan pesan) */}
                    {chatData?.isGroup && !isMe && (
                      <div className="h-7 w-7 rounded-full overflow-hidden bg-gray-200 shrink-0 mb-0.5">
                        {showAvatar ? (
                          <img src={senderAvatar} alt={msg.sender} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full"></div>
                        )}
                      </div>
                    )}

                    {/* Bubble Pesan */}
                    <div 
                      className={`relative px-3.5 py-2 text-[15px] leading-snug break-words ${
                        isMe 
                          ? 'bg-[#007aff] text-white rounded-[18px] rounded-br-[4px]' 
                          : 'bg-[#e9e9eb] text-black rounded-[18px] rounded-bl-[4px]'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Area Input Pesan di Bawah */}
          <div className="p-2.5 pb-6 border-t border-gray-100 flex items-center gap-2 bg-white">
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600 active:scale-95">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
            
            <div className="relative flex-1 flex items-center">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="iMessage"
                className="w-full rounded-full border border-gray-300 px-4 py-1.5 text-[15px] text-black outline-none focus:border-[#007aff]"
              />
              {inputText.trim() ? (
                <button 
                  onClick={handleSendMessage}
                  className="absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#007aff] text-white active:scale-90 transition-transform"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                </button>
              ) : (
                <button className="absolute right-2.5 text-gray-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                </button>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
