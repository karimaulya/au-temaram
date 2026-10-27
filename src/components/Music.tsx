import { useState } from 'react';
import type { ReactNode } from 'react';

// Playlist Asahi, gaya Apple Music (iOS 26) versi dark mode. Tidak ada audio; hanya tampilan.
// Daftar playlist -> detail playlist -> mini player + tab bar mengambang.

const NO_SB = 'no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';
const GLASS = 'border border-white/10 bg-white/10 backdrop-blur-2xl shadow-[0_2px_12px_rgba(0,0,0,0.35)]';
const RED = '#ff375f';

// ---------------- DATA ----------------
interface Song { title: string; artist: string; sec?: string }
interface Playlist {
  name: string; short: string; tagline: string; footer: string;
  c: [string, string, string];   // warna gradien: atas, tengah, bawah
  songs: Song[];
}

const song = (s: string, sec?: string): Song => {
  const [artist, ...rest] = s.split(' — ');
  return { artist, title: rest.join(' — '), sec };
};
const list = (...a: string[]): Song[] => a.map(x => song(x));

const PLAYLISTS: Playlist[] = [
  {
    name: 'late night drive', short: 'after dark',
    tagline: 'late night drive • city lights • quiet thoughts',
    footer: 'best listened to at 11 PM, looking out the car window. 🌙',
    c: ['#6b5fd6', '#2a2d6e', '#07071a'],
    songs: list(
      'wave to earth — seasons', 'wave to earth — bad', 'wave to earth — love.', 'DEAN — instagram',
      'The 1975 — About You', 'The 1975 — Somebody Else', 'Joji — SLOW DANCING IN THE DARK', 'Joji — Sanctuary',
      'd4vd — Here With Me', 'Ruth B. — Dandelions', 'JIN — Yours', 'IU — love wins all',
      'Frank Sinatra — That’s Life', 'Southern All Stars — Manatsu no Kajitsu',
      'TREASURE — LOVESICK', 'TREASURE — DARARI', 'TREASURE — CLAP!', 'TREASURE — THANK YOU', 'TREASURE — ORANGE',
    ),
  },
  {
    name: "for quiet minds & creative souls", short: 'study room',
    tagline: 'for quiet minds & creative souls',
    footer: 'headphones on, notifications off, create something beautiful.',
    c: ['#58c9b9', '#1f6f6c', '#04201d'],
    songs: list(
      'wave to earth — light', 'wave to earth — pink', 'wave to earth — calla', 'Nujabes — Aruarian Dance',
      'Nujabes — Feather', 'idealism — both of us', 'Jinsang — affection', 'potsu — just friends',
      'beabadoobee — Coffee', 'Men I Trust — Show Me How', 'Men I Trust — Lauren', 'Clairo — Pretty Girl',
      'Laufey — Promise', 'The Marías — Cariño', 'keshi — beside you', 'Joji — worldstar money (interlude)',
      'Frank Sinatra — Fly Me to the Moon', 'C418 — Sweden', 'C418 — Wet Hands', 'TREASURE — ORANGE',
    ),
  },
  {
    name: 'run until the city becomes a blur', short: 'on the run',
    tagline: 'run until the city becomes a blur',
    footer: 'one more kilometer. one more song. one more thought.',
    c: ['#ff8a4c', '#b8321f', '#210803'],
    songs: list(
      'TREASURE — BONA BONA', 'The Weeknd — Blinding Lights', 'Dua Lipa — Physical', 'Harry Styles — As It Was', 'TREASURE — HELLO',
      'The 1975 — It\'s Not Living (If It\'s Not With You)', 'DAY6 — Time of Our Life', 'Imagine Dragons — On Top of the World', 'OneRepublic — I Ain\'t Worried', 'NCT 127 — Kick It',
      'The Weeknd — Take My Breath', 'Daft Punk — Instant Crush', 'Tame Impala — The Less I Know the Better', 'Chase Atlantic — Swim', 'Joji — YEAH RIGHT', 'Måneskin — SUPERMODEL', 'Arctic Monkeys — Do I Wanna Know?', 'TREASURE — JIKJIN',
      'BLACKPINK — How You Like That', 'Imagine Dragons — Believer', 'Fall Out Boy — Centuries', 'TREASURE — MMM',
      'wave to earth — bad', 'Nujabes — Feather', 'TREASURE — ORANGE',
    ),
  },
];

const grad = (c: [string, string, string], deg = 160) => `linear-gradient(${deg}deg, ${c[0]}, ${c[1]} 55%, ${c[2]})`;
const hue = (s: string) => [...s].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) % 360, 7);

// ---------------- ICONS ----------------
const Svg = ({ size = 22, sw = 2, fill = 'none', children }: { size?: number; sw?: number; fill?: string; children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const IBack = () => <Svg size={22} sw={2.4}><path d="M15 5l-7 7 7 7" /></Svg>;
const IChevR = () => <Svg size={16} sw={2.6}><path d="M9 5l7 7-7 7" /></Svg>;
const IPlus = () => <Svg size={22} sw={2}><path d="M12 5v14M5 12h14" /></Svg>;
const ISort = () => <Svg size={22} sw={2}><path d="M4 7h16M7 12h10M10 17h4" /></Svg>;
const IDots = () => (
  <Svg size={22} sw={0} fill="currentColor"><circle cx="5" cy="12" r="1.9" /><circle cx="12" cy="12" r="1.9" /><circle cx="19" cy="12" r="1.9" /></Svg>
);
const IShuffle = () => (
  <Svg size={22} sw={2}>
    <path d="M3 7h3.5c2 0 3.2 1 4.3 2.8l2.4 4.4c1.1 1.8 2.3 2.8 4.3 2.8H21" />
    <path d="M3 17h3.5c1.4 0 2.4-.5 3.2-1.5" />
    <path d="M13.5 8.8C14.3 7.7 15.5 7 17.5 7H21" />
    <path d="M18.5 4.5L21 7l-2.5 2.5" /><path d="M18.5 14.5L21 17l-2.5 2.5" />
  </Svg>
);
const IPlay = ({ size = 22 }: { size?: number }) => <Svg size={size} sw={1.6} fill="currentColor"><path d="M7 4.8v14.4a.6.6 0 0 0 .9.5l11.6-7.2a.6.6 0 0 0 0-1L7.9 4.3a.6.6 0 0 0-.9.5z" /></Svg>;
const IPause = ({ size = 22 }: { size?: number }) => <Svg size={size} sw={0} fill="currentColor"><rect x="6" y="4.5" width="4.2" height="15" rx="1.3" /><rect x="13.8" y="4.5" width="4.2" height="15" rx="1.3" /></Svg>;
const IForward = ({ size = 26 }: { size?: number }) => <Svg size={size} sw={1.4} fill="currentColor"><path d="M2.5 6.2v11.6c0 .5.5.8.9.5l8-5.8a.6.6 0 0 0 0-1l-8-5.8c-.4-.3-.9 0-.9.5z" /><path d="M12 6.2v11.6c0 .5.5.8.9.5l8-5.8a.6.6 0 0 0 0-1l-8-5.8c-.4-.3-.9 0-.9.5z" /></Svg>;
const IDownload = () => <Svg size={22} sw={2.2}><path d="M12 4v11M7.5 11l4.5 4.5 4.5-4.5M5 20h14" /></Svg>;
const IAddPerson = () => (
  <Svg size={22} sw={1.9}><circle cx="9" cy="8" r="3.6" /><path d="M2.5 20c.4-3.6 3-5.6 6.5-5.6s6.1 2 6.5 5.6" /><path d="M19 6.5v6M16 9.5h6" /></Svg>
);
const IShare = () => <Svg size={22} sw={1.9}><path d="M12 3v12" /><path d="M8 7l4-4 4 4" /><path d="M7 11H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1" /></Svg>;

const IHome = () => <Svg size={28} sw={1.6} fill="currentColor"><path d="M12 3.2l8.8 7.2c.3.2.4.5.4.9V19a2 2 0 0 1-2 2H15v-6.2H9V21H5.2a2 2 0 0 1-2-2v-7.7c0-.4.1-.7.4-.9z" /></Svg>;
const INew = () => (
  <Svg size={28} sw={0} fill="currentColor"><rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2.2" /><rect x="13" y="3.5" width="7.5" height="7.5" rx="2.2" /><rect x="3.5" y="13" width="7.5" height="7.5" rx="2.2" /><rect x="13" y="13" width="7.5" height="7.5" rx="2.2" /></Svg>
);
const IRadio = () => (
  <Svg size={28} sw={1.8}>
    <circle cx="12" cy="12" r="1.7" fill="currentColor" />
    <path d="M8.7 8.7a4.7 4.7 0 0 0 0 6.6M15.3 8.7a4.7 4.7 0 0 1 0 6.6M5.8 5.8a8.8 8.8 0 0 0 0 12.4M18.2 5.8a8.8 8.8 0 0 1 0 12.4" />
  </Svg>
);
const ILibrary = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="3" width="16" height="18" rx="3.2" fill="currentColor" />
    <path d="M10.4 16.6V8.8l4.7-1.2v7.6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="16.8" r="1.6" fill="#fff" /><circle cx="13.7" cy="15.4" r="1.6" fill="#fff" />
  </svg>
);
const ISearch = () => <Svg size={28} sw={2}><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L20.5 20.5" /></Svg>;

const TABS: { key: string; label: string; icon: ReactNode }[] = [
  { key: 'home', label: 'Home', icon: <IHome /> },
  { key: 'new', label: 'New', icon: <INew /> },
  { key: 'radio', label: 'Radio', icon: <IRadio /> },
  { key: 'library', label: 'Library', icon: <ILibrary /> },
  { key: 'search', label: 'Search', icon: <ISearch /> },
];

// ---------------- KOMPONEN KECIL ----------------
const CircleBtn = ({ onClick, children }: { onClick?: () => void; children?: ReactNode }) => (
  <button onClick={onClick} className={`flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-white active:opacity-60 ${GLASS}`}>{children}</button>
);

const Art = ({ s, size }: { s: Song; size: number }) => {
  const h = hue(s.title + s.artist);
  return (
    <span
      style={{ width: size, height: size, fontSize: size / 2.3, background: `linear-gradient(135deg, hsl(${h} 60% 52%), hsl(${(h + 45) % 360} 65% 26%))` }}
      className="flex shrink-0 items-center justify-center rounded-[6px] font-bold text-white/90"
    >{s.artist[0]}</span>
  );
};

const EqBars = ({ on }: { on: boolean }) => (
  <span className="flex h-[16px] items-end gap-[2.5px]">
    {[10, 16, 7].map((h, i) => (
      <span key={i} className={`w-[3px] rounded-full bg-white ${on ? 'animate-pulse' : ''}`} style={{ height: h, animationDelay: `${i * 160}ms` }} />
    ))}
  </span>
);

// ---------------- APP ----------------
export default function Music({ onBack }: { onBack?: () => void }) {
  const [view, setView] = useState<number | null>(null);   // null = daftar playlist
  const [cur, setCur] = useState({ p: 0, i: 0 });
  const [play, setPlay] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const nowSong = PLAYLISTS[cur.p].songs[cur.i];
  const playSong = (p: number, i: number) => { setCur({ p, i }); setPlay(true); };
  const next = () => playSong(cur.p, (cur.i + 1) % PLAYLISTS[cur.p].songs.length);
  const openPlaylist = (p: number) => { setScrolled(false); setView(p); };

  // ---------- DAFTAR PLAYLIST ----------
  const listView = (
    <div className={`h-full overflow-y-auto pb-[190px] pt-[58px] ${NO_SB}`}>
      <div className="flex items-center justify-between px-4 pt-1">
        {onBack ? <CircleBtn onClick={onBack}><IBack /></CircleBtn> : <span className="h-[44px] w-[44px]" />}
        <div className="flex items-center gap-2">
          <div className={`flex h-[44px] items-center gap-5 rounded-full px-5 text-white ${GLASS}`}><IPlus /><ISort /></div>
          <CircleBtn><IDots /></CircleBtn>
        </div>
      </div>
      <h1 className="px-5 pb-3 pt-5 text-[34px] font-bold tracking-tight">Playlists</h1>
      {PLAYLISTS.map((pl, p) => (
        <button key={pl.name} onClick={() => openPlaylist(p)} className="flex w-full items-center pl-5 text-left active:opacity-60">
          <span
            style={{ background: grad(pl.c) }}
            className="my-[9px] flex h-[62px] w-[62px] shrink-0 items-start rounded-[8px] p-1.5 text-[9.5px] font-semibold leading-[1.15] text-white/90"
          >{pl.short}</span>
          <span className="ml-4 flex min-h-[80px] flex-1 items-center border-b border-white/10 pr-5">
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[17px]">{pl.name}</span>
              <span className="block text-[13px] text-zinc-400">{pl.songs.length} songs</span>
            </span>
            <span className="text-zinc-500"><IChevR /></span>
          </span>
        </button>
      ))}
    </div>
  );

  // ---------- DETAIL PLAYLIST ----------
  const detailView = (() => {
    if (view === null) return null;
    const pl = PLAYLISTS[view];
    const inThis = cur.p === view;
    const togglePlay = () => { if (inThis) setPlay(v => !v); else playSong(view, 0); };
    return (
      <div className="relative h-full w-full">
        <div className={`absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pb-2 pt-[58px] transition-colors duration-200 ${scrolled ? 'bg-black/55 backdrop-blur-xl' : ''}`}>
          <CircleBtn onClick={() => setView(null)}><IBack /></CircleBtn>
          <span className={`mx-3 min-w-0 flex-1 truncate text-center text-[15px] font-semibold transition-opacity duration-200 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>{pl.name}</span>
          <div className="flex items-center gap-2">
            <div className={`flex h-[44px] items-center gap-5 rounded-full px-5 text-white ${GLASS}`}><IAddPerson /><IShare /></div>
            <CircleBtn><IDots /></CircleBtn>
          </div>
        </div>

        <div
          onScroll={e => setScrolled(e.currentTarget.scrollTop > 190)}
          style={{ backgroundColor: pl.c[2] }}
          className={`relative h-full overflow-y-auto pb-[190px] ${NO_SB}`}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[640px]" style={{ background: `linear-gradient(to bottom, ${pl.c[0]} 0, ${pl.c[1]} 380px, ${pl.c[2]} 640px)` }} />

          <div className="relative px-5 pt-[118px]">
            <h1 className="text-[40px] font-bold leading-[1.05] tracking-tight">{pl.name}</h1>
            <p className="mt-2 text-[15px] text-white/70">{pl.tagline}</p>
          </div>
          <div className="relative flex h-[120px] items-center justify-center text-[64px] drop-shadow-lg"></div>

          <div className="relative px-5 text-center">
            <div className="text-[20px] font-semibold">{pl.name}</div>
            <div className="text-[18px] text-white/80">Asahi</div>
            <div className="mt-0.5 text-[13px] font-medium text-white/50">{pl.songs.length} songs • Updated 2d ago</div>
          </div>

          <div className="relative mt-5 flex items-center justify-center gap-3 px-5">
            <button onClick={() => playSong(view, Math.floor(Math.random() * pl.songs.length))} className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-black/25 text-white active:opacity-60"><IShuffle /></button>
            <button onClick={togglePlay} className="flex h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-white text-[16px] font-semibold text-black active:opacity-70">
              {inThis && play ? <IPause size={20} /> : <IPlay size={20} />}{inThis && play ? 'Pause' : 'Play'}
            </button>
            <button className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-black/25 text-white active:opacity-60"><IDownload /></button>
          </div>

          <div className="relative mx-5 mt-5 border-t border-white/10">
            {pl.songs.map((s, i) => {
              const isCur = inThis && cur.i === i;
              return (
                <div key={i}>
                  {s.sec && <div className="pb-1 pt-5 text-[17px] font-bold">{s.sec}</div>}
                  <button onClick={() => playSong(view, i)} className="flex w-full items-center gap-3 text-left active:opacity-60">
                    <span className="relative my-2 shrink-0">
                      <Art s={s} size={46} />
                      {isCur && <span className="absolute inset-0 flex items-center justify-center rounded-[6px] bg-black/50"><EqBars on={play} /></span>}
                    </span>
                    <span className="flex min-h-[62px] min-w-0 flex-1 items-center border-b border-white/10">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[16px]" style={isCur ? { color: '#ff6b81' } : undefined}>{s.title}</span>
                        <span className="block truncate text-[14px] text-white/55">{s.artist}</span>
                      </span>
                      <span className="px-1 text-white/55"><IDots /></span>
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="relative px-8 pb-2 pt-6 text-center text-[13px] italic text-white/50">{pl.footer}</div>
        </div>
      </div>
    );
  })();

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-black text-white select-none">
      {view === null ? listView : detailView}

      {/* Mini player */}
      <div className={`absolute bottom-[93px] left-[21px] right-[21px] z-30 flex h-[50px] items-center gap-3 rounded-full pl-2.5 pr-4 ${GLASS}`}>
        <Art s={nowSong} size={34} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-semibold leading-tight">{nowSong.title}</div>
          <div className="truncate text-[13px] leading-tight text-white/65">{nowSong.artist}</div>
        </div>
        <button onClick={() => setPlay(v => !v)} className="flex h-[34px] w-[34px] items-center justify-center active:opacity-60">{play ? <IPause size={22} /> : <IPlay size={22} />}</button>
        <button onClick={next} className="flex h-[34px] w-[34px] items-center justify-center active:opacity-60"><IForward size={28} /></button>
      </div>

      {/* Tab bar */}
      <div className={`absolute bottom-[22px] left-[21px] right-[21px] z-30 flex h-[62px] items-center rounded-full p-[5px] ${GLASS}`}>
        {TABS.map(t => {
          const active = t.key === 'library';
          return (
            <button
              key={t.key}
              onClick={() => { if (t.key === 'library') setView(null); }}
              style={{ color: active ? RED : '#fff' }}
              className={`flex h-full flex-1 flex-col items-center justify-center gap-px rounded-full active:opacity-60 ${active ? 'bg-white/15' : ''}`}
            >
              {t.icon}
              <span className="text-[10.5px] font-medium leading-none">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
