import { useEffect, useState } from 'react';
import { useStory } from '../story/StoryProvider';
import { playSadSong } from '../story/bgm';

// Isi berita dari doc AU (poin 24). Nama situs sengaja generik; ganti SITE kalau mau.
const SITE = 'berita.example';
const TAG = 'Berita Eksklusif';
const HEADLINE = "Setahun Koma Usai Tragedi Cipularang, Korban Berinisial 'A' Akhirnya Tersadar";
const DATE = '7 Agustus 2026';
const PHOTO = '/photos/news.png';
const PARAGRAPHS = [
  "**BANDUNG** — Keajaiban medis baru saja terjadi di salah satu rumah sakit di Kota Bandung. Seorang remaja berinisial 'A', yang merupakan satu-satunya korban selamat dari kecelakaan maut di Tol Cipularang setahun silam, akhirnya dilaporkan tersadar dari koma panjangnya.",
  "Masih lekat di ingatan publik mengenai tragedi kelam yang terjadi pada hari Kamis, 7 Agustus 2025. Saat itu, sebuah minibus yang membawa rombongan 10 orang remaja asal Jakarta mengalami kecelakaan tragis di Tol Cipularang. Rombongan sahabat tersebut diketahui sedang dalam perjalanan menuju Bandung untuk menghabiskan waktu liburan bersama.",
  "Nahas, perjalanan yang seharusnya penuh suka cita itu berakhir duka. Insiden kecelakaan lalu lintas yang parah tersebut merenggut nyawa sembilan remaja di lokasi kejadian. Dari sepuluh penumpang, hanya 'A' yang ditemukan dalam kondisi kritis dan segera dilarikan ke ruang ICU.",
  "Kini, lebih dari satu tahun sejak malam nahas tersebut, tim dokter mengonfirmasi bahwa 'A' telah membuka mata dan mulai menunjukkan respons motorik. \"Ini adalah perkembangan yang sangat luar biasa. Pasien 'A' telah melewati masa kritis yang sangat panjang, dan saat ini tim medis sedang fokus pada pemulihan fisik serta pendampingan psikologisnya,\" ujar salah satu perwakilan tim dokter.",
  "Tantangan terberat ke depan tidak hanya pada pemulihan fisik 'A', tetapi juga pemulihan trauma mentalnya. Menghadapi kenyataan bahwa sembilan sahabatnya telah berpulang dalam perjalanan liburan mereka setahun yang lalu tentu membutuhkan waktu dan pendampingan ekstra dari pihak keluarga dan profesional.",
];

// **tebal** sederhana
const fmt = (s: string) =>
  s.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') ? <b key={i} className="font-bold text-white">{part.slice(2, -2)}</b> : part);

export default function NewsPage() {
  const { tap } = useStory();
  const [photoOk, setPhotoOk] = useState(true);

  // Lagu sedih mulai di sini dan SENGAJA tidak dihentikan saat halaman ditutup (lihat story/bgm.ts).
  useEffect(() => { playSadSong(0.8); }, []);

  return (
    <div className="absolute inset-0 z-[72] flex flex-col bg-black pt-[48px] text-white">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2">
        <button onClick={() => tap('news-back')} className="text-[#007aff] text-[16px] active:opacity-50">‹ Kembali</button>
        <div className="mx-auto rounded-lg bg-zinc-900 px-3 py-1 text-[13px] text-zinc-400">{SITE}</div>
        <div className="w-14" />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 pb-12 no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="text-[12px] font-semibold uppercase tracking-wide text-red-600">{TAG}</div>
        <h1 className="mt-2 text-[24px] font-bold leading-tight">{HEADLINE}</h1>
        <div className="mt-2 text-[12px] text-zinc-500">{DATE}</div>

        {photoOk && (
          <img src={PHOTO} alt="" onError={() => setPhotoOk(false)} className="mt-4 w-full rounded-[10px] object-cover" />
        )}

        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-zinc-200">
          {PARAGRAPHS.map((p, i) => <p key={i}>{fmt(p)}</p>)}
        </div>
      </div>
    </div>
  );
}
