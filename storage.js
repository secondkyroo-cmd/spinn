/* ============================================================
   Lucky Spin — data layer
   Semua data (hadiah, win rate, durasi) disimpan di localStorage
   supaya halaman spin & halaman admin saling terhubung.
   ============================================================ */

const STORAGE_KEY = 'luckySpinData_v1';

function uid() {
  return 'p_' + Math.random().toString(36).slice(2, 9);
}

function defaultData() {
  return {
    prizes: [
      { id: uid(), name: 'Grand Prize',      color: '#FFC93C', winRate: 5 },
      { id: uid(), name: 'Voucher 100rb',    color: '#FF4D8D', winRate: 10 },
      { id: uid(), name: 'Diskon 20%',       color: '#6EE7B7', winRate: 20 },
      { id: uid(), name: 'Free Ongkir',      color: '#7C9EFF', winRate: 25 },
      { id: uid(), name: 'Voucher 50rb',     color: '#FFA26B', winRate: 15 },
      { id: uid(), name: 'Coba Lagi',        color: '#B497FF', winRate: 25 },
    ],
    duration: 6, // detik
  };
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const d = defaultData();
      saveData(d);
      return d;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.prizes)) throw new Error('format rusak');
    if (typeof parsed.duration !== 'number' || parsed.duration <= 0) parsed.duration = 6;
    parsed.prizes.forEach(p => {
      if (typeof p.winRate !== 'number' || isNaN(p.winRate)) p.winRate = 0;
      if (!p.color) p.color = '#FFC93C';
      if (!p.id) p.id = uid();
    });
    return parsed;
  } catch (e) {
    const d = defaultData();
    saveData(d);
    return d;
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function resetData() {
  const d = defaultData();
  saveData(d);
  return d;
}

/**
 * Memilih hadiah secara acak berdasarkan bobot win rate.
 * Bekerja walau total win rate tidak persis 100 (dinormalisasi otomatis).
 */
function weightedPick(prizes) {
  const total = prizes.reduce((s, p) => s + (Number(p.winRate) || 0), 0);
  if (total <= 0) {
    return prizes[Math.floor(Math.random() * prizes.length)];
  }
  let r = Math.random() * total;
  for (const p of prizes) {
    r -= Number(p.winRate) || 0;
    if (r <= 0) return p;
  }
  return prizes[prizes.length - 1];
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}
