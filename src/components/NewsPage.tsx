import { useStory } from '../story/StoryProvider';

// TODO: ganti isi berita dengan narasimu. Ini hanya kerangka dari poin 24 di doc AU.
export default function NewsPage() {
  const { tap } = useStory();
  return (
    <div className="absolute inset-0 z-[72] flex flex-col bg-white pt-[48px] text-black">
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-2">
        <button onClick={() => tap('news-back')} className="text-[#007aff] text-[16px] active:opacity-50">‹ Kembali</button>
        <div className="mx-auto rounded-lg bg-gray-100 px-3 py-1 text-[13px] text-gray-500">berita.example</div>
        <div className="w-14" />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="text-[12px] font-semibold uppercase tracking-wide text-red-600">Nasional</div>
        <h1 className="mt-2 text-[24px] font-bold leading-tight">
          Satu-satunya Penyintas Kecelakaan Maut Truk dan Hiace Akhirnya Sadar dari Koma
        </h1>
        <div className="mt-2 text-[12px] text-gray-400">7 Agustus 2026</div>
        <p className="mt-4 text-[15px] leading-relaxed text-gray-800">
          [Isi berita: korban selamat dari kecelakaan truk dan mobil Hiace tahun 2025 silam akhirnya terbangun dari kondisi koma.]
        </p>
      </div>
    </div>
  );
}
