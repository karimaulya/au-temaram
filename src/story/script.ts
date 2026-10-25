import type { Step } from './types';

// Satu array = satu alur cerita. Urutan array = urutan cerita.
// Semua efek di tiap step jalan bersamaan, lalu engine menunggu `gate` (kalau ada).
export const STEPS: Step[] = [
  { id: 's1', note: '1 lockscreen', do: [
      { k: 'clock', time: '04:17' },
      { k: 'notify', chatId: 'calendar', sender: 'Kalender', text: '06.10 - Sarapan di Roti Gempol' },
      { k: 'notify', chatId: 'group', sender: 'Ujang Kedu💙', text: 'Haruto: Siapa yang punya nomornya?' },
    ], gate: { on: 'unlock' } },

  { id: 's2', note: '2 arahin buka grup', do: [{ k: 'unlockChunk', chunkId: 'group-1' }],
    gate: { on: 'chunkDone', chunkId: 'group-1' } },

  { id: 's3', note: '3 notif jae', delay: 1500, do: [
      { k: 'unlockChunk', chunkId: 'jae-1' },
      { k: 'notify', chatId: 'jae', sender: 'Jae berisik', text: 'Udah dichat?', chunkId: 'jae-1' },
      { k: 'vibrate' },
    ] },

  { id: 's4', note: '4 chat owner (read, tidak dibalas)', do: [{ k: 'unlockChunk', chunkId: 'owner-1' }],
    gate: { on: 'chunkDone', chunkId: 'owner-1' } },

  { id: 's5', note: '5 ditelepon owner, cuma angin', delay: 2000, do: [
      { k: 'call', who: 'Temaram Guest House', mode: 'audio', answerSfx: 'wind', autoEndMs: 9000 },
    ], gate: { on: 'callEnd' } },

  { id: 's6', note: '6 notif ajun', delay: 1500, do: [
      { k: 'unlockChunk', chunkId: 'group-2' },
      { k: 'notify', chatId: 'group', sender: 'Ujang Kedu💙', text: 'Bang Ajun: Gimana sa?', chunkId: 'group-2' },
    ], gate: { on: 'chunkDone', chunkId: 'group-2' } },

  { id: 's7-8', note: '7 notif jae + 8 pintu digedor', delay: 1200, do: [
      { k: 'unlockChunk', chunkId: 'jae-2' },
      { k: 'notify', chatId: 'jae', sender: 'Jae berisik', text: 'Kenapa sih emang? Takut ya? Wkwkwkw', chunkId: 'jae-2' },
      { k: 'fx', name: 'knock' },
      { k: 'sfx', name: 'knock-soft' },
      { k: 'sfx', name: 'knock-hard@3500', loop: true },   // makin keras, terus sampai pintu dibuka
    ], gate: { on: 'chunkDone', chunkId: 'jae-2' } },

  { id: 's10-11', note: '10 pintu dibuka & benda digeser, 11 notif jae', delay: 1500, do: [
      { k: 'sfx', name: '-knock-hard' }, { k: 'sfx', name: 'door-open' }, { k: 'sfx', name: 'drag-heavy@1500' },
      { k: 'unlockChunk', chunkId: 'jae-3' },
      { k: 'notify', chatId: 'jae', sender: 'Jae berisik', text: 'Buruan, lo siap-siapnya kek putri solo', chunkId: 'jae-3' },
    ], gate: { on: 'chunkDone', chunkId: 'jae-3' } },

  { id: 's12', note: '12 notif bang ucuk', delay: 1500, do: [
      { k: 'unlockChunk', chunkId: 'ucuk-1' },
      { k: 'notify', chatId: 'ucuk', sender: 'Bang Ucuk', text: 'udah bareng jae, sa?', chunkId: 'ucuk-1' },
    ], gate: { on: 'chunkDone', chunkId: 'ucuk-1' } },

  // Teks video call tidak ada di xlsx; diambil dari doc AU (step 13).
  { id: 's13', note: '13 video call ucuk, gelap + jalanan lari', delay: 1500, do: [
      { k: 'call', who: 'Bang Ucuk', mode: 'video', script: [
        { sender: 'Asahi', text: 'Bang … ini Jae kenapa malah jadi ngejar gue?' },
        { sender: 'Asahi', text: 'Bang, mukanya Jae …. Mukanya Jae ancur.' },
        { sender: 'Asahi', text: 'Bang, gue takut! Sumpah! Takut banget! Gue harus gimana?' },
        { sender: 'Hyunsuk', text: 'Sa, lo nengok ke belakang?' },
        { sender: 'Hyunsuk', text: 'Kan udah gue bilang, jangan nengok belakang.' },
        { sender: 'Asahi', text: 'Gue nemu rumah yang ada lampunya. Kayaknya kosong. Gue mau numpang dulu … takut …' },
      ] },
    ], gate: { on: 'callEnd' } },

  { id: 's14-15', note: '14 notif doyie + 15 chat grup', delay: 1500, do: [
      { k: 'unlockChunk', chunkId: 'group-3' },
      { k: 'notify', chatId: 'group', sender: 'Ujang Kedu💙', text: 'Doyie: Kok lama sa?', chunkId: 'group-3' },
    ], gate: { on: 'chunkDone', chunkId: 'group-3' } },

  { id: 's16', note: '16 jae telepon, tawa serem', delay: 2000, do: [
      { k: 'call', who: 'Jae berisik', mode: 'audio', answerSfx: 'creepy-laugh', autoEndMs: 8000 },
    ], gate: { on: 'callEnd' } },

  { id: 's17-18', note: '17 gedoran + notif beruntun, 18 chat jae', delay: 1000, do: [
      { k: 'fx', name: 'knock' },
      { k: 'sfx', name: 'knock-hard', loop: true },   // berhenti lewat cue "(ketukannya berhenti)" di sheet
      { k: 'unlockChunk', chunkId: 'jae-4' },
      // hanya SATU notif (pesan pertama). Sisanya muncul kalau Asahi tetap di room chat.
      { k: 'notify', chatId: 'jae', sender: 'Jae berisik', text: 'KELUAR', chunkId: 'jae-4' },
    ], gate: { on: 'chunkDone', chunkId: 'jae-4' } },

  { id: 's19', note: '19 gedoran berhenti, notif jeo', delay: 1500, do: [
      { k: 'sfx', name: '-knock-hard' },
      { k: 'unlockChunk', chunkId: 'jeo-1' },
      { k: 'notify', chatId: 'jeo', sender: 'Jeo', text: 'Wei', chunkId: 'jeo-1' },
    ], gate: { on: 'chunkDone', chunkId: 'jeo-1' } },

  { id: 's20', note: '20 notif jeo di grup, balik ke grup', delay: 800, do: [
      { k: 'unlockChunk', chunkId: 'group-4' },
      { k: 'notify', chatId: 'group', sender: 'Ujang Kedu💙', text: 'Jeo: Anaknya udah bareng gue', chunkId: 'group-4' },
    ], gate: { on: 'chunkDone', chunkId: 'group-4' } },

  { id: 's21a', note: '21 lari', delay: 1000, do: [{ k: 'sfx', name: 'run' }] },
  { id: 's21b', note: '21 jatuh + layar pecah', delay: 3500, do: [{ k: 'sfx', name: 'fall' }, { k: 'fx', name: 'crack' }] },
  { id: 's21c', note: '21 alarm 06.10', delay: 1800, do: [
      { k: 'clock', time: '06:10' },
      { k: 'alarm', label: 'Sarapan di Roti Gempol' },
    ], gate: { on: 'tap', id: 'alarm-dismiss' } },

  { id: 's22-23', note: '22 notif Mia, 23 chat Mia', delay: 2000, do: [
      { k: 'sfx', name: 'icu-monitor', loop: true },
      { k: 'unlockChunk', chunkId: 'mia-1' },
      { k: 'notify', chatId: 'mia', sender: 'Mia', text: 'Kamu udah bangun, Sa? Berita ini beneran?', chunkId: 'mia-1' },
    ], gate: { on: 'chunkDone', chunkId: 'mia-1' } },

  // user menekan link di chat Mia -> openPage('news') -> NewsPage; tombol kembali memanggil tap('news-back')
  { id: 's24', note: '24 link -> halaman berita', do: [],
    gate: { on: 'tap', id: 'news-back' } },

  { id: 's25', note: '25 semua chat hilang, sisa konten pra-kecelakaan', do: [
      { k: 'wipe', keepChats: ['prev', 'mia'] },
    ] },
];
