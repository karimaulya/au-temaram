import { useEffect, useState } from 'react';
import { useStory, playSfx, stopSfx } from '../story/StoryProvider';

const NO_SB = 'no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';
// Taruh video jalanan lari di /public/video/run.mp4 (atau isi field `video` di efek call pada script.ts)
const DEFAULT_VIDEO = '/video/run.mp4';

const PhoneIcon = ({ rotate = 0 }: { rotate?: number }) => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="white" style={{ transform: `rotate(${rotate}deg)` }}>
    <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" />
  </svg>
);

export default function CallScreen() {
  const { state, endCall } = useStory();
  const call = state.call;
  const [previousCall, setPreviousCall] = useState(call);
  const [phase, setPhase] = useState<'ringing' | 'active'>('ringing');
  const [declined, setDeclined] = useState(false);
  const [secs, setSecs] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [dead, setDead] = useState(false);               // video call "mati" (layar hitam)
  const [videoFailed, setVideoFailed] = useState(false);

  // Reset call-local state before rendering a newly started call.
  if (previousCall !== call) {
    setPreviousCall(call);
    setPhase('ringing');
    setDeclined(false);
    setSecs(0);
    setLineCount(0);
    setDead(false);
    setVideoFailed(false);
  }

  // dering
  useEffect(() => {
    if (!call || phase !== 'ringing' || declined) return;
    playSfx('ringtone', true);
    return () => stopSfx('ringtone');
  }, [call, phase, declined]);

  // setelah diangkat: suara latar, timer, auto-end
  useEffect(() => {
    if (!call || phase !== 'active') return;
    if (call.answerSfx) playSfx(call.answerSfx, true);
    const tick = window.setInterval(() => setSecs(s => s + 1), 1000);
    const end = !call.script && call.autoEndMs ? window.setTimeout(endCall, call.autoEndMs) : undefined;
    return () => { clearInterval(tick); clearTimeout(end); if (call.answerSfx) stopSfx(call.answerSfx); };
  }, [call, phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // percakapan berbentuk teks: baris muncul satu-satu. Video call lalu "mati", audio call langsung berakhir.
  useEffect(() => {
    if (!call?.script || phase !== 'active' || dead) return;
    if (lineCount >= call.script.length) {
      const t = window.setTimeout(call.mode === 'video' ? () => setDead(true) : endCall, call.mode === 'video' ? 2200 : 2500);
      return () => clearTimeout(t);
    }
    const wait = lineCount === 0 ? 1200 : call.script[lineCount - 1].delay ?? 2800;
    const t = window.setTimeout(() => setLineCount(c => c + 1), wait);
    return () => clearTimeout(t);
  }, [call, phase, lineCount, dead]); // eslint-disable-line react-hooks/exhaustive-deps

  // video call mati: layar hitam sebentar, lalu ditutup
  useEffect(() => {
    if (!dead) return;
    const t = window.setTimeout(endCall, 1800);
    return () => clearTimeout(t);
  }, [dead]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!call || declined) return null;
  const mmss = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
  const isVideoActive = phase === 'active' && call.mode === 'video';

  // ================= VIDEO CALL AKTIF =================
  if (isVideoActive) {
    const lines = (call.script ?? []).slice(0, lineCount);
    const shown = lines.slice(-4);
    const offset = lines.length - shown.length;
    return (
      <div className="absolute inset-0 z-[70] overflow-hidden bg-black text-white">
        {dead ? (
          <div className="flex h-full w-full items-center justify-center text-[13px] text-white/25">Video call terputus</div>
        ) : (
          <>
            {/* layar besar: video jalanan lari */}
            {videoFailed ? (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-zinc-900 via-black to-zinc-950" />
            ) : (
              <video
                src={call.video ?? DEFAULT_VIDEO}
                autoPlay loop playsInline
                onError={() => setVideoFailed(true)}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/30" />

            {/* nama + timer */}
            <div className="absolute left-5 top-[56px] drop-shadow">
              <div className="text-[20px] font-semibold">{call.who}</div>
              <div className="text-[13px] text-white/70">{mmss}</div>
            </div>

            {/* layar kecil: gelap */}
            <div className="absolute right-4 top-[100px] h-[150px] w-[100px] overflow-hidden rounded-[16px] border border-white/15 bg-black shadow-xl" />

            {/* percakapan (teks) */}
            <div className={`absolute inset-x-0 bottom-[130px] flex max-h-[42%] flex-col justify-end gap-2 overflow-y-auto px-5 ${NO_SB}`}>
              {shown.map((l, i) => (
                <div key={offset + i} className={`flex flex-col ${l.sender === 'Asahi' ? 'items-end' : 'items-start'}`}>
                  <span className="mb-0.5 text-[11px] text-white/60">{l.sender}</span>
                  <div className="max-w-[85%] rounded-[16px] bg-black/55 px-3 py-2 text-[14px] backdrop-blur">{l.text}</div>
                </div>
              ))}
            </div>

            {/* tutup panggilan */}
            <div className="absolute inset-x-0 bottom-[50px] flex justify-center">
              <button onClick={endCall} className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-red-500 transition-transform active:scale-90">
                <PhoneIcon rotate={135} />
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ================= DERING / PANGGILAN SUARA =================
  return (
    <div className="absolute inset-0 z-[70] flex flex-col items-center overflow-hidden bg-gradient-to-b from-zinc-800 to-black text-white">
      <div className="mt-[110px] text-center">
        <div className="text-[34px] font-medium">{call.who}</div>
        <div className="mt-1 text-[16px] text-white/60">
          {phase === 'ringing' ? (call.mode === 'video' ? 'FaceTime Video…' : 'mobile') : mmss}
        </div>
      </div>

      {phase === 'active' && call.script && (
        <div className={`mt-6 flex w-full flex-1 flex-col justify-end gap-2 overflow-y-auto px-5 pb-6 ${NO_SB}`}>
          {call.script.slice(0, lineCount).map((l, i) => (
            <div key={i} className={`flex flex-col ${l.sender === 'Asahi' ? 'items-end' : 'items-start'}`}>
              <span className="mb-0.5 text-[11px] text-white/45">{l.sender}</span>
              <div className="max-w-[85%] rounded-[16px] bg-white/15 px-3 py-2 text-[14px] backdrop-blur">{l.text}</div>
            </div>
          ))}
        </div>
      )}

      <div className={`flex w-full justify-around px-10 pb-[70px] ${phase === 'active' && call.script ? '' : 'mt-auto'}`}>
        <button
          onClick={() => {
            if (phase === 'active') endCall();
            else { setDeclined(true); window.setTimeout(() => setDeclined(false), 1500); } // menolak -> berdering lagi
          }}
          className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-red-500 transition-transform active:scale-90"
        >
          <PhoneIcon rotate={135} />
        </button>
        {phase === 'ringing' && (
          <button onClick={() => setPhase('active')} className="flex h-[70px] w-[70px] animate-pulse items-center justify-center rounded-full bg-green-500 transition-transform active:scale-90">
            <PhoneIcon />
          </button>
        )}
      </div>
    </div>
  );
}
