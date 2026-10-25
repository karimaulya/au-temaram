// ---------- DATA (hasil convert.py) ----------
export interface Msg {
  id: string;            // unik: "<chunkId>:msg-N"
  sender: string;
  isSelf: boolean;
  text: string;
  kind: 'text' | 'location' | 'file' | 'link';
  time?: string;         // "04:17"
  dateLabel?: string;    // "Kamis, 5 Agustus" (pesan lama)
  cue?: string;          // catatan suara dari sheet, mis. "suara nangis"
}
export interface Chunk { id: string; chatId: string; sheet: string; messages: Msg[] }
export interface ChatMeta { id: string; title: string; isGroup: boolean }
export interface ChatData { chats: ChatMeta[]; chunks: Chunk[] }

// ---------- SKRIP CERITA ----------
export type ScriptLine = { sender: string; text: string; delay?: number };

export type Effect =
  | { k: 'clock'; time: string }                                     // paksa jam status bar
  | { k: 'notify'; chatId: string; sender: string; text: string; chunkId?: string }
  | { k: 'sfx'; name: string; loop?: boolean }
  | { k: 'vibrate' }
  | { k: 'fx'; name: 'blackout' | 'shake' | 'crack' | 'knock' }
  | { k: 'call'; who: string; mode: 'audio' | 'video'; script?: ScriptLine[]; answerSfx?: string; autoEndMs?: number; video?: string }
  | { k: 'alarm'; label: string }
  | { k: 'unlockChunk'; chunkId: string }                            // chunk boleh dibuka/dimainkan
  | { k: 'wipe'; keepChats: string[] };                              // step 25

export type Gate =
  | { on: 'openChat'; chatId: string }
  | { on: 'chunkDone'; chunkId: string }
  | { on: 'callEnd' }
  | { on: 'tap'; id: string }                                         // tap elemen tertentu (link, dst)
  | { on: 'unlock' };

export interface Step {
  id: string;
  note?: string;       // nomor di doc AU kamu, buat debugging
  delay?: number;      // ms sebelum efek dijalankan
  do: Effect[];
  gate?: Gate;         // kalau ada, cerita berhenti sampai kondisi ini terpenuhi
}
