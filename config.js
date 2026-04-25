/**
 * ══════════════════════════════════════════════════════════
 *  KONFIGURASI BOT WHATSAPP - TRIANGLE STORE
 * ══════════════════════════════════════════════════════════
 */

const path = require('path');

module.exports = {

  // ── Info Toko ──────────────────────────────────────────
  storeName: 'TRIANGLE STORE',
  ownerNumber: '6281234567890', // Ganti dengan nomor WA kamu

  // ── Prefix Command ────────────────────────────────────
  prefix: '#',

  // ── Path Gambar QRIS ──────────────────────────────────
  qrisImagePath: path.join(__dirname, 'media', 'qris.jpeg'),

  // ── Daftar Produk ─────────────────────────────────────
  products: {
    gpt: {
      name: 'CHATGPT PLUS',
      keyword: 'gpt',
      prices: [
        { duration: '5 HARI', price: 'IDR 8.000', warranty: 'Garansi 5 Hari' },
        { duration: '1 BULAN', price: 'IDR 25.000', warranty: 'Garansi 1 Bulan' },
      ],
      description: 'Akses penuh ChatGPT Plus (GPT-4o, GPT-4.5)',
      note: '✅ Status: Shared Account\n✅ Akses: Semua fitur premium aktif',
    },

    leonardo: {
      name: 'LEONARDO AI',
      keyword: 'leonardo',
      prices: [
        { category: 'PRIVATE' },
        { duration: '1 BULAN', price: '18.000' },
      ],
      description: 'Akses premium Leonardo AI image generator',
      note: '✅ AKUN DARI SELLER\n✅ GARANSI 20 HARI\n✅ KREDIT 8.5K',
    },

    canva: {
      name: 'CANVA PRO',
      keyword: 'canva',
      prices: [
        { duration: '1 BULAN', price: 'IDR 15.000', warranty: 'Garansi 1 Bulan' },
      ],
      description: 'Akses Canva Pro premium design',
      note: '✅ Status: Private Account\n✅ Akses: Semua template & fitur pro',
    },

    spotify: {
      name: 'SPOTIFY PREMIUM',
      keyword: 'spotify',
      prices: [
        { category: '🏷 INDPLAN NOGAR' },
        { duration: '1 Bulan', price: '9.000' },
        { duration: '3 Bulan', price: '12.000' },
        { category: '🏷 FAMPLAN FULLGAR' },
        { duration: '1 Bulan', price: '18.000' },
        { duration: '2 Bulan', price: '30.000' },
      ],
      description: 'Spotify Premium no ads & offline mode',
      note: '✅ Akun Dari Seller\n✅ Bisa Semua Perangkat',
    },

    netflix: {
      name: 'NETFLIX PREMIUM',
      keyword: 'netflix',
      prices: [
        { duration: '1 BULAN (1 PROFIL)', price: 'IDR 20.000', warranty: 'Garansi 1 Bulan' },
        { duration: '1 BULAN (FULL ACCESS)', price: 'IDR 35.000', warranty: 'Garansi 1 Bulan' },
      ],
      description: 'Netflix Premium UHD 4K',
      note: '✅ Status: Shared Account\n✅ Akses: Resolusi 4K UHD',
    },

    youtube: {
      name: 'YOUTUBE PREMIUM',
      keyword: 'youtube',
      prices: [
        { duration: '1 BULAN', price: 'IDR 5.000', warranty: 'Garansi 1 Bulan' },
      ],
      description: 'YouTube Premium No Ads & YT Music',
      note: '✅ Status: Via Invite (Email Pribadi)\n✅ Akses: Background Play & No Ads',
    },
  },

  // ── Footer ────────────────────────────────────────────
  footer: '────────────────\n∆ TRIANGLE STORE ∆',
};
