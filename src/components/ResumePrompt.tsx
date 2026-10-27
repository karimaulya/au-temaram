import { useState } from 'react';
import { useStory, playSfx, RESTORED_AFTER_READING } from '../story/StoryProvider';
import { continueSadSong } from '../story/bgm';

// Pop up setelah refresh / buka lagi browser, kalau pembaca sebelumnya sudah selesai membaca berita.
// "Lanjutkan"  -> lagu sedih loop lagi + monitor ICU (pelan) menyala lagi, HP tetap seperti terakhir.
// "Mulai dari awal" -> hapus progres, cerita mulai dari lockscreen.
export default function ResumePrompt() {
  const { reset } = useStory();
  const [open, setOpen] = useState(RESTORED_AFTER_READING);
  if (!open) return null;
  const goOn = () => {
    setOpen(false);
    continueSadSong();               // lagu sedih, loop
    playSfx('icu', true, 0.22);      // monitor ICU tetap pelan seperti setelah berita dibaca
  };
  return (
    <div className="absolute inset-0 z-[99] flex items-center justify-center bg-black/75 px-8 backdrop-blur-sm">
      <div className="w-full rounded-[28px] border border-white/10 bg-zinc-900/95 p-6 text-center">
        <div className="text-[20px] font-semibold text-white">Lanjutkan cerita?</div>
        <p className="mt-1 text-[14px] text-zinc-400">Kamu sudah sampai akhir cerita. Mau lanjut baca isi hp Asahi atau mulai dari awal?</p>
        <button onClick={goOn} className="mt-5 w-full rounded-full bg-[#007aff] py-3 text-[16px] font-semibold text-white active:opacity-70">Lanjutkan</button>
        <button onClick={reset} className="mt-2 w-full py-2 text-[15px] text-zinc-400 active:opacity-60">Mulai dari awal</button>
      </div>
    </div>
  );
}
