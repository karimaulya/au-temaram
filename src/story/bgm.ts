// Lagu sedih penutup (public/sfx/sad-song.mp3).
//
// Sengaja dipisah dari playSfx/stopSfx: lagu ini TIDAK boleh ikut berhenti saat halaman berita
// ditutup (unmount) maupun saat stopAllSfx() dipanggil oleh efek "wipe". Audio-nya hidup di level
// modul.
//
// Alur:
//  1) Lagu diputar SEKALI (tanpa loop). Saat habis -> onSadSongEnd() dipanggil -> App menampilkan dialog.
//  2) Pembaca memilih "Lanjut baca" -> continueSadSong(): lagu diputar ulang dari awal dan sekarang LOOP.
//     Pilihan ini disimpan di localStorage, jadi kalau halaman di-reload lagunya langsung loop.
//  3) Pembaca memilih "Mulai ulang" -> reset() memanggil clearContinueFlag().

const SOURCES = ['/sfx/sad-song.mp3', '/sfx/sad-song.m4a', '/sfx/sad-song.ogg'];
const CONTINUE_KEY = 'au-temaram-continue-reading';
const SAVE_KEY = 'au-temaram-save-v2';   // sama dengan SAVE_KEY di StoryProvider

// Halaman dimuat ulang SETELAH selesai membaca berita: lagu ditahan sampai pembaca memilih di pop up
// (ResumePrompt). Sentuhan di pop up itu juga yang membuat browser mengizinkan suara diputar.
let held = (() => {
  try { return !!JSON.parse(localStorage.getItem(SAVE_KEY) ?? 'null')?.taps?.includes('news-back'); } catch { return false; }
})();
export function releaseSadSong(): void { held = false; }

let audio: HTMLAudioElement | null = null;
let nextSrc = 0;
let waitingForGesture = false;
let finishedPlaying = false;                 // lagu sudah habis -> jangan diputar ulang otomatis
const endListeners = new Set<() => void>();

const wantsLoop = (): boolean => {
  try { return localStorage.getItem(CONTINUE_KEY) === '1'; } catch { return false; }
};

function notifyEnd() {
  finishedPlaying = true;
  endListeners.forEach(fn => fn());
}

/** Dipanggil saat lagu penutup selesai (hanya jika tidak sedang loop). Mengembalikan fungsi unsubscribe. */
export function onSadSongEnd(cb: () => void): () => void {
  endListeners.add(cb);
  return () => { endListeners.delete(cb); };
}

// Browser memblokir autoplay sebelum ada interaksi (mis. setelah reload). Coba lagi di sentuhan/klik berikutnya.
function retryOnGesture() {
  if (waitingForGesture) return;
  waitingForGesture = true;
  const go = () => {
    waitingForGesture = false;
    window.removeEventListener('pointerdown', go);
    window.removeEventListener('keydown', go);
    void audio?.play().catch(() => {});
  };
  window.addEventListener('pointerdown', go, { once: true });
  window.addEventListener('keydown', go, { once: true });
}

export function playSadSong(volume = 0.8): void {
  if (typeof Audio === 'undefined' || finishedPlaying || held) return;
  if (!audio) {
    const a = new Audio();
    a.loop = wantsLoop();                     // sudah pernah pilih "Lanjut baca" -> langsung loop
    a.volume = volume;
    a.preload = 'auto';
    a.addEventListener('ended', notifyEnd);   // hanya terpicu kalau tidak loop
    // kalau mp3 tidak ada, coba m4a / ogg
    a.addEventListener('error', () => {
      if (nextSrc < SOURCES.length) {
        a.src = SOURCES[nextSrc++];
        void a.play().catch(retryOnGesture);
      } else if (!a.loop) {
        notifyEnd();                          // semua file gagal dimuat: dialog tetap muncul
      }
    });
    a.src = SOURCES[nextSrc++];
    audio = a;
  }
  if (audio.paused) void audio.play().catch(retryOnGesture);
}

/** Pembaca memilih "Lanjut baca": lagu diputar ulang dari awal dan sekarang loop. */
export function continueSadSong(): void {
  held = false;
  try { localStorage.setItem(CONTINUE_KEY, '1'); } catch { /* abaikan */ }
  finishedPlaying = false;
  if (audio) {
    audio.loop = true;
    audio.currentTime = 0;
    void audio.play().catch(retryOnGesture);
  } else {
    playSadSong();
  }
}

/** Dipanggil saat cerita di-reset. */
export function clearContinueFlag(): void {
  try { localStorage.removeItem(CONTINUE_KEY); } catch { /* abaikan */ }
}

export function stopSadSong(): void {
  audio?.pause();
  audio = null;
  nextSrc = 0;
  finishedPlaying = false;
}
