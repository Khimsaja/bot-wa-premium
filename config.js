/**
 * ══════════════════════════════════════════════════════════
 *  KONFIGURASI BOT WHATSAPP - PREMIUM APP STORE
 * ══════════════════════════════════════════════════════════
 *  Edit file ini untuk menambah/mengubah produk, harga,
 *  dan pesan-pesan bot.
 */

const path = require('path');

module.exports = {

  // ── Info Toko ──────────────────────────────────────────
  storeName: '🏪 PREMIUM APP STORE',
  ownerNumber: '6281234567890', // Ganti dengan nomor WA kamu (format 62xxx)

  // ── Prefix Command ────────────────────────────────────
  prefix: '#',

  // ── Path Gambar QRIS ──────────────────────────────────
  qrisImagePath: path.join(__dirname, 'media', 'qris.jpeg'),

  // ── Daftar Produk ─────────────────────────────────────
  // Tambahkan produk baru dengan format yang sama
  products: {
    // ── CHATGPT ──
    gpt: {
      name: '🤖 ChatGPT Plus',
      keyword: 'gpt',              // keyword trigger (case-insensitive)
      emoji: '🤖',
      prices: [
        {
          duration: '5 Hari',
          price: 'Rp 8.000',
          warranty: '5 Hari Garansi',
        },
        {
          duration: '1 Bulan',
          price: 'Rp 25.000',
          warranty: 'Full Garansi',
        },
      ],
      description: 'Akses penuh ke ChatGPT Plus (GPT-4o, GPT-4.5, dll)',
      note: '✅ Shared Account\n✅ Garansi sesuai paket\n✅ Akses semua fitur premium',
    },

    // ── LEONARDO AI ──
    leonardo: {
      name: '🎨 Leonardo AI',
      keyword: 'leonardo',
      emoji: '🎨',
      prices: [
        {
          duration: '1 Minggu',
          price: 'Rp 10.000',
          warranty: '7 Hari Garansi',
        },
        {
          duration: '1 Bulan',
          price: 'Rp 30.000',
          warranty: 'Full Garansi',
        },
      ],
      description: 'Akses premium Leonardo AI untuk generate gambar AI',
      note: '✅ Shared Account\n✅ Garansi sesuai paket\n✅ Unlimited generation',
    },

    // ── CANVA PRO ──
    canva: {
      name: '🖌️ Canva Pro',
      keyword: 'canva',
      emoji: '🖌️',
      prices: [
        {
          duration: '1 Bulan',
          price: 'Rp 15.000',
          warranty: 'Full Garansi',
        },
      ],
      description: 'Akses Canva Pro untuk desain premium',
      note: '✅ Private Account\n✅ Full garansi\n✅ Semua template premium',
    },

    // ── SPOTIFY PREMIUM ──
    spotify: {
      name: '🎵 Spotify Premium',
      keyword: 'spotify',
      emoji: '🎵',
      prices: [
        {
          duration: '1 Bulan',
          price: 'Rp 8.000',
          warranty: '30 Hari Garansi',
        },
        {
          duration: '3 Bulan',
          price: 'Rp 20.000',
          warranty: 'Full Garansi',
        },
      ],
      description: 'Spotify Premium tanpa iklan, download offline',
      note: '✅ Private/Shared Account\n✅ Garansi sesuai paket\n✅ No Ads, Offline Mode',
    },

    // ── NETFLIX PREMIUM ──
    netflix: {
      name: '🎬 Netflix Premium',
      keyword: 'netflix',
      emoji: '🎬',
      prices: [
        {
          duration: '1 Bulan (1 Profil)',
          price: 'Rp 20.000',
          warranty: '30 Hari Garansi',
        },
        {
          duration: '1 Bulan (Full Access)',
          price: 'Rp 35.000',
          warranty: 'Full Garansi',
        },
      ],
      description: 'Netflix Premium UHD 4K tanpa batas',
      note: '✅ Shared Account\n✅ Garansi sesuai paket\n✅ UHD 4K Quality',
    },
  },

  // ── Pesan Selamat Datang (opsional) ───────────────────
  welcomeMessage: (groupName) =>
    `👋 *Halo! Selamat datang di ${groupName}*\n\n` +
    `Ketik *#list* untuk lihat daftar aplikasi premium.\n` +
    `Ketik *#help* untuk bantuan.\n` +
    `Ketik *#bayar* untuk info pembayaran QRIS.`,

  // ── Footer ────────────────────────────────────────────
  footer: '─────────────────────\n💎 *PREMIUM APP STORE* │ Fast & Trusted',
};
