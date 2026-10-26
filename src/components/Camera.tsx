import { useEffect, useRef, useState } from 'react';

// Mencoba kamera asli; kalau ditolak/tidak ada, tampil viewfinder gelap.
export default function Camera() {
  const vid = useRef<HTMLVideoElement>(null);
  const [ok, setOk] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let stream: MediaStream | undefined;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
      .then(s => { stream = s; if (vid.current) { vid.current.srcObject = s; setOk(true); } })
      .catch(() => setOk(false));
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  return (
    <div className="relative h-full w-full select-none overflow-hidden bg-black text-white">
      <video ref={vid} autoPlay playsInline muted className={`absolute inset-0 h-full w-full object-cover ${ok ? '' : 'hidden'}`} />
      {!ok && <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 text-[13px] text-white/30">Kamera tidak tersedia</div>}
      {flash && <div className="absolute inset-0 bg-white" />}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-black/60 pb-[56px] pt-5">
        <button onClick={() => { setFlash(true); setTimeout(() => setFlash(false), 120); }}
          className="h-[72px] w-[72px] rounded-full border-[4px] border-white p-1 active:scale-90 transition-transform"><span className="block h-full w-full rounded-full bg-white" /></button>
      </div>
    </div>
  );
}
