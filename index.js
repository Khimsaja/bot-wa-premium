/**
 * ══════════════════════════════════════════════════════════
 *  BOT WHATSAPP - PREMIUM APP STORE
 * ══════════════════════════════════════════════════════════
 *  Bot WhatsApp untuk handle grup jual beli aplikasi premium.
 *
 *  Fitur:
 *  - #list    → Daftar aplikasi premium
 *  - GPT      → Harga ChatGPT Plus
 *  - Leonardo → Harga Leonardo AI
 *  - Canva    → Harga Canva Pro
 *  - Spotify  → Harga Spotify Premium
 *  - Netflix  → Harga Netflix Premium
 *  - #bayar   → Kirim QRIS pembayaran
 *  - #help    → Menu bantuan
 *  - #owner   → Info admin
 *
 *  Cara jalankan: node index.js
 *  Scan QR Code yang muncul di terminal dengan WhatsApp.
 * ══════════════════════════════════════════════════════════
 */

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { handleMessage } = require('./messageHandler');
const config = require('./config');

// ── Banner ──────────────────────────────────────────────
console.log(`
╔══════════════════════════════════════════════╗
║                                              ║
║   💎  PREMIUM APP STORE - WhatsApp Bot  💎   ║
║                                              ║
║   Version : 1.0.0                            ║
║   Author  : Premium Store                    ║
║   Status  : Starting...                      ║
║                                              ║
╚══════════════════════════════════════════════╝
`);

// ── Inisialisasi Client ─────────────────────────────────
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './.wwebjs_auth', // Simpan sesi di folder lokal
  }),
  puppeteer: {
    headless: true,
    // Gunakan Chromium sistem jika tersedia (VPS/Docker)
    ...(process.env.PUPPETEER_EXECUTABLE_PATH && {
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    }),
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--disable-gpu',
      '--single-process',       // Hemat RAM di VPS
      '--no-zygote',            // Hemat RAM di VPS
    ],
  },
});

// ── Event: QR Code ──────────────────────────────────────
client.on('qr', (qr) => {
  console.log('\n📱 Scan QR Code di bawah ini dengan WhatsApp:\n');
  qrcode.generate(qr, { small: true });
  console.log('\n⏳ Menunggu scan...\n');
  
  // Fallback kalau terminalnya bikin QR mleyot
  console.log('⚠️ KALAU QR DI ATAS PANJANG/MLEYOT DAN GAGAL DISCAN:');
  console.log('1. Copy teks panjang di bawah ini:');
  console.log('\n' + qr + '\n');
  console.log('2. Buka web: https://www.the-qrcode-generator.com/');
  console.log('3. Paste teksnya ke sana, lalu scan QR yang muncul di webnya pakai HP lu.');
});

// ── Event: Authenticated ────────────────────────────────
client.on('authenticated', () => {
  console.log('✅ Autentikasi berhasil!');
});

// ── Event: Auth Failure ─────────────────────────────────
client.on('auth_failure', (msg) => {
  console.error('❌ Autentikasi gagal:', msg);
  console.log('🔄 Coba hapus folder .wwebjs_auth dan jalankan ulang.');
});

// ── Event: Ready ────────────────────────────────────────
client.on('ready', () => {
  console.log(`
╔══════════════════════════════════════════════╗
║                                              ║
║   ✅  BOT SIAP DIGUNAKAN!                    ║
║                                              ║
║   📋 #list     → Daftar Aplikasi             ║
║   💰 GPT       → Harga ChatGPT              ║
║   🎨 LEONARDO  → Harga Leonardo AI          ║
║   🖌️ CANVA     → Harga Canva Pro            ║
║   🎵 SPOTIFY   → Harga Spotify              ║
║   🎬 NETFLIX   → Harga Netflix              ║
║   💳 #bayar    → QRIS Pembayaran            ║
║   ❓ #help     → Menu Bantuan               ║
║   👤 #owner    → Info Admin                  ║
║                                              ║
╚══════════════════════════════════════════════╝
  `);
});

// ── Event: Disconnected ─────────────────────────────────
client.on('disconnected', (reason) => {
  console.log('⚠️ Bot terputus:', reason);
  console.log('🔄 Mencoba reconnect...');
  client.initialize();
});

// ── Event: Message ──────────────────────────────────────
client.on('message', async (message) => {
  try {
    await handleMessage(message, client);
  } catch (error) {
    console.error('[BOT] Error handling message:', error);
  }
});

// ── Event: Group Join (Welcome Message) ─────────────────
client.on('group_join', async (notification) => {
  try {
    const chat = await notification.getChat();
    // Ambil data member yang baru masuk (bisa lebih dari 1 kalau di-add sekaligus)
    const newMembers = notification.recipientIds;
    
    for (const memberId of newMembers) {
      const contact = await client.getContactById(memberId);
      const pushname = contact.pushname || contact.number;

      // Format Jam dan Tanggal
      const now = new Date();
      // Pakai timezone Asia/Jakarta biar selalu WIB
      const tanggal = now.toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const jam = now.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' }) + ' WIB';

      // Teks Welcome
      const welcomeMsg =
        `[ *WELCOME* ]\n` +
        `────────────────\n` +
        `Halo *@${contact.number}*\n` +
        `Selamat datang di *${chat.name}*\n\n` +
        `*Tanggal Masuk:* ${tanggal}\n` +
        `*Jam:* ${jam}\n\n` +
        `Ketik *#list* untuk daftar aplikasi\n` +
        `Ketik *#help* untuk bantuan\n` +
        config.footer;

      // Coba ambil foto profil WA member baru
      let profilePicUrl = null;
      try {
        profilePicUrl = await contact.getProfilePicUrl();
      } catch (err) {
        console.log(`[BOT] Gagal mengambil PP untuk ${contact.number}`);
      }

      if (profilePicUrl) {
        // Kalau PP ada/tidak diprivate, kirim fotonya + caption welcome
        try {
          const media = await MessageMedia.fromUrl(profilePicUrl);
          await chat.sendMessage(media, { caption: welcomeMsg, mentions: [contact] });
          console.log(`[BOT] 👋 Welcome message (dengan foto) sent for: ${pushname}`);
        } catch (mediaErr) {
          // Kalau gagal download gambar, fallback ke teks aja
          await chat.sendMessage(welcomeMsg, { mentions: [contact] });
          console.log(`[BOT] 👋 Welcome message (teks fallback) sent for: ${pushname}`);
        }
      } else {
        // Kalau PP kosong / diprivate, kirim teks aja
        await chat.sendMessage(welcomeMsg, { mentions: [contact] });
        console.log(`[BOT] 👋 Welcome message (tanpa foto) sent for: ${pushname}`);
      }
    }
  } catch (error) {
    console.error('[BOT] Error sending welcome message:', error);
  }
});

// ── Start Bot ───────────────────────────────────────────
console.log('⏳ Memulai bot... Mohon tunggu.\n');
client.initialize();

// ── Graceful Shutdown ───────────────────────────────────
process.on('SIGINT', async () => {
  console.log('\n🛑 Mematikan bot...');
  await client.destroy();
  process.exit(0);
});
