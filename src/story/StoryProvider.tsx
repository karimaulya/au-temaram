import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import raw from './chats.generated.json';
import extra from './extra.generated.json';   // chat 'mia' + 'prev' (dibuat build_extra.py)
import { STEPS } from './script';
import { clearContinueFlag } from './bgm';
import type { ChatData, Chunk, Effect, Gate, Msg, ScriptLine } from './types';

// Gabungkan data utama + extra. Chat/chunk yang id-nya ada di extra menggantikan versi lama,
// dan chunk berakhiran tahun (mis. "group-2025", salah baca dari judul sheet) dibuang.
const BASE = raw as ChatData;
const EXTRA = extra as unknown as ChatData;
const extraChats = new Set(EXTRA.chats.map(c => c.id));
const DATA: ChatData = {
  ...BASE,
  chats: [...BASE.chats.filter(c => !extraChats.has(c.id)), ...EXTRA.chats],
  chunks: [...BASE.chunks.filter(k => !extraChats.has(k.chatId) && !/-20\d\d$/.test(k.id)), ...EXTRA.chunks],
};
export const STORY_DATA = DATA;
const CHUNKS = new Map(DATA.chunks.map(c => [c.id, c]));
const SAVE_KEY = 'au-temaram-save-v2';

// Catatan suara dari sheet (kolom F) -> nama suara. Pencocokan toleran (huruf besar/kecil, tanda kurung, kata kunci).
// Format nama: "a,b@3000" = putar a, lalu b setelah 3000 ms. Awalan "-" = hentikan suara yang sedang loop.
function cueSfx(cue?: string, chatId?: string): string | undefined {
  const c = (cue ?? '').toLowerCase();
  if (!c) return undefined;
  if (/berhenti/.test(c)) return '-knock-hard,knockout';
  if (/geser/.test(c)) return 'drag';
  if (/nangis/.test(c)) return chatId === 'jeo' ? 'junghwan-cry' : 'crying';       // di chat Jeo yang menangis = Junghwan
  if (/tawa/.test(c)) return 'laugh-ajun';
  if (/langkah/.test(c)) return chatId === 'jeo' ? 'junghwan-steps,steps-near@4000' : 'steps-far,steps-near@3000';
  return undefined;
}
// Suara untuk pesan tertentu yang tidak punya kolom cue di sheet (dicocokkan lewat isi pesan).
const TEXT_CUES: { chat: string; re: RegExp; sfx: string }[] = [
  { chat: 'group', re: /anjrti/i, sfx: 'chase-end' },                                   // grup 06.04: Asahi dikejar Jae
  { chat: 'jeo', re: /ngedeket|makin deket|balik pintu/i, sfx: 'junghwan-steps' },      // Junghwan makin dekat
];
// Suara yang DIULANG acak selama satu adegan chat (biar terasa creepy / bertumpuk).
// from = pesan pemicu, until = pesan penutup (opsional; kalau kosong berhenti saat chunk selesai).
interface Layer { sounds: string[]; every: [number, number]; delay?: number; vol?: [number, number] }
const AMBIENT: Record<string, { from: RegExp; until?: RegExp; layers: Layer[] }> = {
  'jae-3': { from: /geser/i, until: /keluar sekarang juga/i, layers: [        // Bang Ji geser kursi, teriak, Bang Ajun ketawa
    { sounds: ['drag', 'drag-2'], every: [6000, 11000], vol: [0.5, 1] },
    { sounds: ['scream'], every: [16000, 26000], delay: 7000, vol: [0.5, 0.9] },
    { sounds: ['laugh-ajun'], every: [18000, 30000], delay: 12000, vol: [0.4, 0.8] },
  ] },
  'jae-4': { from: /./, layers: [                                                 // Jae menyuruh keluar
    { sounds: ['laugh-jae', 'laugh-2'], every: [9000, 16000], delay: 3000, vol: [0.5, 1] },
  ] },
  'jeo-1': { from: /lagi makan/i, until: /suaranya ilang/i, layers: [          // Junghwan mendekat
    { sounds: ['junghwan-steps', 'steps-near'], every: [8000, 13000], vol: [0.6, 1] },
    { sounds: ['junghwan-cry'], every: [14000, 22000], delay: 9000, vol: [0.5, 0.9] },
  ] },
};
// Chunk yang pesan-pesan awalnya (sampai sebelum pesan Asahi pertama) dianggap sudah ada sebelum chat dibuka.
const PRESEEN = new Set(['group-1']);
const MSG_SFX = 'message';   // suara kirim/terima pesan (message.mp3 / message.m4a)

// ---------------- STATE ----------------
export interface Notif { id: string; chatId: string; chunkId?: string; sender: string; text: string }
export interface SeenNotif { id: string; chatId: string; chunkId?: string; sender: string; text: string }
export interface CallState {
  who: string; mode: 'audio' | 'video'; script?: ScriptLine[];
  answerSfx?: string; autoEndMs?: number; video?: string;
}

// Cocokkan isi notif dengan isi bubble (toleran: beda huruf besar, spasi, atau notif terpotong "...")
const norm = (t: string) => t.toLowerCase().replace(/\s+/g, ' ').replace(/[….]+$/, '').trim();
const sameRaw = (a: string, b: string) => {
  const x = norm(a), y = norm(b);
  return x === y || (Math.min(x.length, y.length) >= 6 && (x.startsWith(y) || y.startsWith(x)));
};
// notif grup berawalan nama ("Haruto: Siapa yang ...") -> awalan dibuang saat dicocokkan dengan bubble
const sameMsg = (notifText: string, msgText: string) =>
  sameRaw(notifText, msgText) || sameRaw(notifText.replace(/^[^:\n]{1,30}:\s+/, ''), msgText);
interface State {
  step: number;                 // step aktif
  ranStep: number;              // step terakhir yang efeknya sudah dijalankan
  unlockedChunks: string[];
  progress: Record<string, number>;
  doneChunks: string[];
  openedChats: string[];
  taps: string[];
  phoneUnlocked: boolean;
  callEnds: number;             // naik tiap panggilan berakhir (dipakai gate callEnd)
  callEndsAtStepStart: number;
  notifs: Notif[];
  clock: string;
  openChat: string | null;
  call: CallState | null;
  fx: { name: string; nonce: number } | null;
  page: 'home' | 'news';
  wipedKeep: string[] | null;
  alarm: string | null;
  notifiedChunks: string[];     // chunk yang sudah pernah punya notif -> notif berikutnya untuk chunk itu diabaikan
  notifSeen: SeenNotif[];       // notif yang sudah pernah muncul -> bubble-nya langsung tampil di chat tanpa animasi ketik
}
const initial: State = {
  step: 0, ranStep: -1, unlockedChunks: [], progress: {}, doneChunks: [], openedChats: [], taps: [],
  phoneUnlocked: false, callEnds: 0, callEndsAtStepStart: 0, notifs: [], clock: '04:17',
  openChat: null, call: null, fx: null, page: 'home', wipedKeep: null, alarm: null, notifSeen: [], notifiedChunks: [],
};

type Action =
  | { t: 'RAN'; step: number }
  | { t: 'ADVANCE' }
  | { t: 'EFFECT'; e: Effect; nonce: number; notifId?: string }
  | { t: 'UNLOCK_PHONE' }
  | { t: 'OPEN_CHAT'; chatId: string | null }
  | { t: 'REVEAL'; chunkId: string; to: number; time?: string; consume?: string }
  | { t: 'CHUNK_DONE'; chunkId: string }
  | { t: 'END_CALL' }
  | { t: 'TAP'; id: string }
  | { t: 'DISMISS_NOTIF'; id: string }
  | { t: 'OPEN_PAGE'; page: 'news' };

function reducer(s: State, a: Action): State {
  switch (a.t) {
    case 'RAN': return { ...s, ranStep: a.step, callEndsAtStepStart: s.callEnds };
    case 'ADVANCE': return { ...s, step: s.step + 1 };
    case 'UNLOCK_PHONE': return { ...s, phoneUnlocked: true };
    case 'OPEN_CHAT': return { ...s, openChat: a.chatId,
      openedChats: a.chatId && !s.openedChats.includes(a.chatId) ? [...s.openedChats, a.chatId] : s.openedChats,
      notifs: a.chatId ? s.notifs.filter(n => n.chatId !== a.chatId) : s.notifs };
    case 'REVEAL': {
      let seen = s.notifSeen ?? [];
      if (a.consume) seen = seen.filter(n => n.id !== a.consume);
      return { ...s, progress: { ...s.progress, [a.chunkId]: a.to }, clock: a.time ?? s.clock, notifSeen: seen };
    }
    case 'CHUNK_DONE': return s.doneChunks.includes(a.chunkId) ? s : { ...s, doneChunks: [...s.doneChunks, a.chunkId] };
    case 'END_CALL': return { ...s, call: null, callEnds: s.callEnds + 1 };
    case 'TAP': return { ...s, taps: [...s.taps, a.id],
      page: a.id === 'news-back' ? 'home' : s.page, alarm: a.id === 'alarm-dismiss' ? null : s.alarm };
    case 'OPEN_PAGE': return { ...s, page: a.page };
    case 'DISMISS_NOTIF': return { ...s, notifs: s.notifs.filter(n => n.id !== a.id) };
    case 'EFFECT': {
      const e = a.e;
      switch (e.k) {
        case 'clock': return { ...s, clock: e.time };
        case 'notify': {
          if (s.notifs.some(n => n.id === a.notifId)) return s;
          const done = s.notifiedChunks ?? [];
          const key = `${e.chunkId ?? ''}|${e.text}`;
          if (e.chunkId && done.includes(key)) return s;               // notif identik untuk chunk yang sama diabaikan
          const n: Notif = { id: a.notifId!, chatId: e.chatId, chunkId: e.chunkId, sender: e.sender, text: e.text };
          return { ...s, notifs: [...s.notifs, n],
            notifiedChunks: e.chunkId ? [...done, key] : done,
            notifSeen: e.chatId === 'calendar' ? (s.notifSeen ?? []) : [...(s.notifSeen ?? []), n] };
        }
        case 'fx': return { ...s, fx: { name: e.name, nonce: a.nonce } };
        case 'call': return { ...s, call: { who: e.who, mode: e.mode, script: e.script, answerSfx: e.answerSfx, autoEndMs: e.autoEndMs, video: e.video } };
        case 'unlockChunk': return s.unlockedChunks.includes(e.chunkId) ? s : { ...s, unlockedChunks: [...s.unlockedChunks, e.chunkId] };
        case 'alarm': return { ...s, alarm: e.label };
        case 'wipe': {
          const fresh = DATA.chunks.filter(k => e.keepChats.includes(k.chatId) && !s.unlockedChunks.includes(k.id) && k.messages.every(m => m.dateLabel));
          return { ...s, wipedKeep: e.keepChats, page: 'home', openChat: null, notifs: [], notifSeen: [],
            unlockedChunks: [...fresh.map(k => k.id), ...s.unlockedChunks],   // di depan -> urutan inbox di bawah Mia
            doneChunks: [...s.doneChunks, ...fresh.map(k => k.id)],
            progress: { ...s.progress, ...Object.fromEntries(fresh.map(k => [k.id, k.messages.length])) } };
        }
        default: return s; // sfx & vibrate = side-effect murni, ditangani di provider
      }
    }
  }
}

function gateMet(g: Gate | undefined, s: State): boolean {
  if (!g) return true;
  switch (g.on) {
    case 'unlock': return s.phoneUnlocked;
    case 'openChat': return s.openedChats.includes(g.chatId);
    case 'chunkDone': return s.doneChunks.includes(g.chunkId);
    case 'callEnd': return s.callEnds > s.callEndsAtStepStart;
    case 'tap': return s.taps.includes(g.id);
  }
}

// ---------------- AUDIO ----------------
const loops = new Map<string, HTMLAudioElement>();
// Nama file asli dari Drive. Dipakai sebagai cadangan kalau file belum di-rename.
const SFX_ORIGINAL: Record<string, string> = {
  notif: '1. Notifikasi iphone.mp3', message: '2. Iphone terima dan kirim pesan.m4a', ringtone: '3. Ringtone telepon dan video call.mp3',
  'knock-soft': '5. Ketok pintu pelan.mp3', 'knock-hard': '6. Ketok pintu kenceng.mp3', 'door-open': '7. Pintu kebuka.mp3',
  drag: '8. Bang Ji geser geser barang.mp3', 'laugh-ajun': '9. Ketawa creepy bang ajun.mp3', 'laugh-jae': '9. Ketawa creepy juga.mp3',
  crying: '10. CREEPY CRYING.mp3', 'steps-far': '11. Langkah kaki creepy.mp3', 'steps-near': '12. Langkah kaki dekat.mp3',
  knockout: '13. KNOCK OUT.mp3', alarm: '14. Alarm iphone.mp3', run: '15. lari.mp3', fall: '16. Jatuh.mp3', icu: '17. Monitor ICU.mp3',
  'drag-2': '2. BANG JI GESER BARANG.mp3', scream: '3. Suara teriak pas bang ji.mp3', 'junghwan-steps': '4. Langkah kaki mendekat junghwan.mp3',
  'junghwan-cry': '5. junghwan nangis habis langkah kaki.mp3', 'chase-end': '6. Suara Asahi dikejar jae di akhir.mp3',
};
function makeAudio(name: string, loop: boolean, volume = 1) {
  const hasExt = /\.[a-z0-9]+$/i.test(name);
  const key = name.replace(/\.[a-z0-9]+$/i, '');
  const files = (hasExt ? [name] : [`${name}.mp3`, `${name}.m4a`]).concat(SFX_ORIGINAL[key] ? [SFX_ORIGINAL[key]] : []);
  let i = 0;
  const a = new Audio(); a.loop = loop; a.volume = Math.max(0, Math.min(1, volume));
  const load = () => { a.src = encodeURI(`/sfx/${files[i]}`); };
  a.onerror = () => {
    if (++i < files.length) { load(); void a.play().catch(() => {}); }
    else console.warn('[sfx] file tidak ditemukan di /public/sfx/:', files.join(' | '));
  };
  load();
  return a;
}
export const stopSfx = (name: string) => { loops.get(name)?.pause(); loops.delete(name); };
export const stopAllSfx = (keep: string[] = []) => { loops.forEach((a, n) => { if (!keep.includes(n)) { a.pause(); loops.delete(n); } }); };
/** "nama" | "nama@jeda_ms" | "a,b@3000" (beberapa suara) | "-nama" (hentikan loop) */
export function playSfx(spec: string, loop = false, volume = 1) {
  for (const part of spec.split(',')) {
    const [name, delay] = part.trim().split('@');
    const go = () => {
      if (name.startsWith('-')) { stopSfx(name.slice(1)); return; }
      try {
        if (loop && loops.has(name)) return;
        const a = makeAudio(name, loop, volume);
        void a.play().catch(() => {});
        if (loop) loops.set(name, a);
      } catch { /* abaikan */ }
    };
    if (delay) window.setTimeout(go, +delay); else go();
  }
}

// ---------------- PROVIDER ----------------
interface Ctx {
  state: State;
  unlockPhone(): void;
  openChat(chatId: string | null): void;
  endCall(): void;
  openPage(page: 'news'): void;
  tap(id: string): void;
  dismissNotif(id: string): void;
  reveal(chunkId: string, to: number, msg?: Msg, consumeNotifId?: string, silent?: boolean): void;
  finishChunk(chunkId: string): void;
  reset(): void;
}
const StoryCtx = createContext<Ctx | null>(null);

export function StoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial, init => {
    try {
      const v = localStorage.getItem(SAVE_KEY);
      if (v) { const saved = JSON.parse(v); return { ...init, ...saved, notifSeen: saved.notifSeen ?? [], ranStep: -1, call: null, fx: null }; }
    } catch { /* abaikan */ }
    return init;
  });
  const nonce = useRef(0);

  // simpan progres (tanpa state sementara)
  useEffect(() => {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, call: null, fx: null })); } catch { /* abaikan */ }
  }, [state]);

  // suara + getar tiap ada notif baru (notif duplikat yang ditolak reducer tidak berbunyi)
  const notifCount = useRef(state.notifs.length);
  useEffect(() => {
    if (state.notifs.length > notifCount.current) { navigator.vibrate?.(120); playSfx('notif'); }
    notifCount.current = state.notifs.length;
  }, [state.notifs]);

  // 1) JALANKAN EFEK step aktif (sekali per step).
  // Catatan: hanya t0 yang di-clear saat cleanup; timer notif beruntun sengaja dibiarkan jalan.
  useEffect(() => {
    const step = STEPS[state.step];
    if (!step || state.ranStep >= state.step) return;
    const t0 = window.setTimeout(() => {
      let burst = 0;
      const notifyCount = step.do.filter(x => x.k === 'notify').length;
      step.do.forEach((e, i) => {
        const run = () => {
          nonce.current++;
          dispatch({ t: 'EFFECT', e, nonce: nonce.current, notifId: `${step.id}-${i}` });
          if (e.k === 'sfx') playSfx(e.name, e.loop);
          if (e.k === 'wipe') stopAllSfx(['icu']);   // monitor ICU tetap berbunyi sampai akhir
          if (e.k === 'vibrate') navigator.vibrate?.([200, 80, 200]);
        };
        // notif beruntun diberi jeda supaya terasa "masuk satu-satu"
        if (e.k === 'notify' && notifyCount > 2) window.setTimeout(run, 600 * burst++);
        else run();
      });
      dispatch({ t: 'RAN', step: state.step });
    }, step.delay ?? 0);
    return () => clearTimeout(t0);
  }, [state.step, state.ranStep]);

  // 2) CEK GATE -> lanjut step
  useEffect(() => {
    const step = STEPS[state.step];
    if (step && state.ranStep === state.step && gateMet(step.gate, state)) dispatch({ t: 'ADVANCE' });
  }, [state]);

  // 3) chunk yang semua pesannya sudah tampil otomatis dianggap selesai
  // (supaya antrean tidak macet kalau user keluar dari chat tepat setelah pesan terakhir)
  useEffect(() => {
    for (const id of state.unlockedChunks) {
      const c = CHUNKS.get(id);
      if (c && !state.doneChunks.includes(id) && (state.progress[id] ?? 0) >= c.messages.length) dispatch({ t: 'CHUNK_DONE', chunkId: id });
    }
  }, [state.unlockedChunks, state.progress, state.doneChunks]);

  const value = useMemo<Ctx>(() => ({
    state,
    unlockPhone: () => dispatch({ t: 'UNLOCK_PHONE' }),
    openChat: chatId => dispatch({ t: 'OPEN_CHAT', chatId }),
    endCall: () => dispatch({ t: 'END_CALL' }),
    openPage: page => dispatch({ t: 'OPEN_PAGE', page }),
    tap: id => dispatch({ t: 'TAP', id }),
    dismissNotif: id => dispatch({ t: 'DISMISS_NOTIF', id }),
    reveal: (chunkId, to, msg, consumeNotifId, silent) => {
      dispatch({ t: 'REVEAL', chunkId, to, time: msg?.time, consume: consumeNotifId });
      if (msg && !msg.dateLabel && !consumeNotifId && !silent) playSfx(MSG_SFX);   // pesan baru masuk / terkirim
    },
    finishChunk: chunkId => dispatch({ t: 'CHUNK_DONE', chunkId }),
    reset: () => { clearContinueFlag(); localStorage.removeItem(SAVE_KEY); location.reload(); },
  }), [state]);

  return <StoryCtx.Provider value={value}>{children}</StoryCtx.Provider>;
}

export const useStory = () => { const c = useContext(StoryCtx); if (!c) throw new Error('Bungkus app dengan <StoryProvider>'); return c; };

// ---------------- PLAYBACK UNTUK SATU CHAT ----------------
// Pesan lawan bicara muncul otomatis (jeda -> "mengetik..." -> bubble), TAPI pelan.
// Pesan Asahi diketik pelan-pelan di keyboard layar, lalu user harus menekan kirim.
// Chat hanya jalan satu per satu sesuai urutan unlock: chat lain membeku sampai yang lebih awal selesai.
const FIRST_PAUSE_MS = 700;           // jeda sebelum balasan pertama setelah chat dibuka
const PAUSE_MS = 1300;                // jeda antar pesan sebelum indikator "mengetik" muncul
const typingMs = (t: string) => Math.min(6000, 2000 + t.length * 90);
const NOTIF_REVEAL_MS = 250;          // pesan yang notifnya sudah muncul: langsung tampil
const SELF_START_MS = 1000;           // jeda sebelum Asahi mulai mengetik
const keyDelay = (c: string, scale: number) =>
  (c === ' ' ? 120 : /[.,!?…]/.test(c) ? 220 : 70 + Math.random() * 80) * scale;

export function useChatPlayback(chatId: string) {
  const { state, reveal, finishChunk } = useStory();
  const [phase, setPhase] = useState<'wait' | 'typing'>('wait');   // untuk pesan lawan bicara
  const [typed, setTyped] = useState(0);                           // jumlah huruf yang sudah diketik Asahi

  const chunks = DATA.chunks.filter(c => c.chatId === chatId && state.unlockedChunks.includes(c.id));
  const firstOpen: Chunk | undefined = chunks.find(c => !state.doneChunks.includes(c.id));
  // antrean ketat: hanya chunk terdepan yang belum selesai yang boleh jalan
  const queueHead = state.unlockedChunks.find(id => !state.doneChunks.includes(id));
  const blockedBy = firstOpen && queueHead && firstOpen.id !== queueHead ? CHUNKS.get(queueHead)?.chatId ?? null : null;
  const active: Chunk | undefined = blockedBy ? undefined : firstOpen;

  const idx = active ? state.progress[active.id] ?? 0 : 0;
  const next = active?.messages[idx];
  const nextId = next?.id;
  const visible = chunks.flatMap(c => c.messages.slice(0, state.progress[c.id] ?? 0));
  // pesan yang dianggap sudah ada sebelum chat dibuka (sampai sebelum pesan Asahi pertama)
  const firstSelf = active ? active.messages.findIndex(m => m.isSelf) : -1;
  const pre = active && PRESEEN.has(active.id) && firstSelf > 0 ? firstSelf : 0;
  const isOld = !!next?.dateLabel || idx < pre;
  const cued = useRef(new Set<string>());
  const playCue = (m?: Msg) => {
    if (!m || m.dateLabel || cued.current.has(m.id)) return;
    cued.current.add(m.id);
    const s = cueSfx(m.cue, chatId) ?? TEXT_CUES.find(c => c.chat === chatId && c.re.test(m.text))?.sfx;
    if (s) playSfx(s);
  };

  // suara latar yang diulang acak selama adegan masih berlangsung
  const amb = active ? AMBIENT[active.id] : undefined;
  const ambFrom = amb && active ? active.messages.findIndex(m => amb.from.test(m.text)) : -1;
  const ambUntil = amb?.until && active ? active.messages.findIndex(m => amb.until!.test(m.text)) : -1;
  const ambOn = !!amb && ambFrom >= 0 && idx >= ambFrom && (ambUntil < 0 || idx < ambUntil);
  useEffect(() => {
    if (!ambOn || !amb) return;
    let alive = true;
    const timers: number[] = [];
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    amb.layers.forEach(l => {
      const fire = () => {
        if (!alive) return;
        playSfx(l.sounds[Math.floor(Math.random() * l.sounds.length)], false, rnd(l.vol?.[0] ?? 0.6, l.vol?.[1] ?? 1));
        timers.push(window.setTimeout(fire, rnd(l.every[0], l.every[1])));
      };
      timers.push(window.setTimeout(fire, l.delay ?? rnd(1500, 4000)));
    });
    return () => { alive = false; timers.forEach(clearTimeout); };
  }, [ambOn, active?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  // notif yang sudah muncul untuk pesan ini? Cocokkan lewat teks; kalau teks notif beda dari sheet,
  // notif ber-chunkId yang sama dianggap milik pesan pertama chunk itu.
  const seenNotifs = state.notifSeen ?? [];
  const entry = active && next && !next.isSelf && !isOld
    ? seenNotifs.find(n => n.chatId === chatId && norm(n.text) === norm(next.text))
      ?? seenNotifs.find(n => n.chatId === chatId && sameMsg(n.text, next.text))
      ?? (active.messages.slice(0, idx).every(m => m.dateLabel) ? seenNotifs.find(n => n.chunkId === active.id) : undefined)
    : undefined;
  const entryId = entry?.id;
  const notified = !!entry;

  // pesan lawan bicara / riwayat lama / pesan yang sudah ada notifnya
  useEffect(() => {
    setPhase('wait'); setTyped(0);
    if (!active) return;
    if (!next) { finishChunk(active.id); return; }
    if (isOld) { reveal(active.id, idx + 1, next, entryId, true); return; }   // riwayat lama / sudah ada: langsung tampil, tanpa suara
    playCue(next);                                                     // suara muncul tepat saat pesan ini mulai (sebelum diketik)
    if (next.isSelf) return;                                           // ditangani efek mengetik di bawah
    if (notified) {                                                    // notif sudah muncul -> tidak perlu diketik lagi
      const t = window.setTimeout(() => reveal(active.id, idx + 1, next, entryId), NOTIF_REVEAL_MS);
      return () => clearTimeout(t);
    }
    const prev = active.messages[idx - 1];
    const pause = !prev || prev.dateLabel ? FIRST_PAUSE_MS : PAUSE_MS;
    const t1 = window.setTimeout(() => setPhase('typing'), pause);
    const t2 = window.setTimeout(() => reveal(active.id, idx + 1, next, entryId), pause + typingMs(next.text));
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [active?.id, idx, nextId, notified]); // eslint-disable-line react-hooks/exhaustive-deps

  // Asahi mengetik huruf demi huruf di keyboard
  useEffect(() => {
    if (!active || !next || !next.isSelf || isOld) return;
    const text = next.text;
    const scale = Math.min(1, 6500 / (text.length * 100));   // teks panjang diketik lebih cepat supaya tidak membosankan
    let n = 0;
    let timer = 0;
    const step = () => {
      n++; setTyped(n);
      if (n < text.length) timer = window.setTimeout(step, keyDelay(text[n - 1], scale));
    };
    timer = window.setTimeout(step, SELF_START_MS);
    return () => clearTimeout(timer);
  }, [active?.id, idx, nextId]); // eslint-disable-line react-hooks/exhaustive-deps

  const myTurn = !!next?.isSelf && !isOld;
  const typingDone = myTurn && typed >= next!.text.length;

  return {
    messages: visible,
    typing: phase === 'typing' && !!next && !next.isSelf && !isOld && !notified,
    typingSender: next && !next.isSelf ? next.sender : null,
    composing: myTurn,                                          // giliran Asahi -> keyboard muncul
    composerText: myTurn ? next!.text.slice(0, typed) : '',
    lastTyped: myTurn && typed > 0 ? next!.text[typed - 1] : null,
    typedTick: typed,
    canSend: typingDone,                                        // baru bisa kirim setelah selesai diketik
    send: () => { if (active && next?.isSelf && typingDone) reveal(active.id, idx + 1, next, entryId); },
    blockedBy,                                                  // id chat yang harus diselesaikan dulu (atau null)
  };
}
