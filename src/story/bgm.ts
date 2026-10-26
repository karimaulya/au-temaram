// Lagu sedih penutup (public/sfx/sad-song.mp3).
//
// Sengaja dipisah dari playSfx/stopSfx: lagu ini TIDAK boleh ikut berhenti saat halaman berita
// ditutup (unmount) maupun saat stopAllSfx() dipanggil oleh efek "wipe". Audio-nya hidup di level
// modul, jadi terus berputar (loop) sampai halaman ditutup / cerita di-reset.

const SOURCES = ['/sfx/sad-song.mp3', '/sfx/sad-song.m4a', '/sfx/sad-song.ogg'];

let audio: HTMLAudioElement | null = null;
let nextSrc = 0;
let waitingForGesture = false;

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
  if (typeof Audio === 'undefined') return;
  if (!audio) {
    const a = new Audio();
    a.loop = true;
    a.volume = volume;
    a.preload = 'auto';
    // kalau mp3 tidak ada, coba m4a / ogg
    a.addEventListener('error', () => {
      if (nextSrc < SOURCES.length) {
        a.src = SOURCES[nextSrc++];
        void a.play().catch(retryOnGesture);
      }
    });
    a.src = SOURCES[nextSrc++];
    audio = a;
  }
  if (audio.paused) void audio.play().catch(retryOnGesture);
}

export function stopSadSong(): void {
  audio?.pause();
  audio = null;
  nextSrc = 0;
}
