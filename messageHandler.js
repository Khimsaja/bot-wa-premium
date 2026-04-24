/**
 * ══════════════════════════════════════════════════════════
 *  MESSAGE HANDLER - Bot WhatsApp Premium App Store
 * ══════════════════════════════════════════════════════════
 *  Menghandle semua pesan masuk dan menentukan respons bot.
 */

const fs = require('fs');
const config = require('./config');
const { MessageMedia } = require('whatsapp-web.js');

// ── Helper: Buat teks daftar produk ─────────────────────
function buildProductList() {
  const products = Object.values(config.products);
  let list = `╔══════════════════════════╗\n`;
  list += `║  ${config.storeName}  ║\n`;
  list += `╠══════════════════════════╣\n`;
  list += `║   📋 *DAFTAR APLIKASI*   ║\n`;
  list += `╠══════════════════════════╣\n\n`;

  products.forEach((product, index) => {
    list += `  ${index + 1}. ${product.emoji} *${product.name}*\n`;
  });

  list += `\n╚══════════════════════════╝\n\n`;
  list += `📌 *Cara Order:*\n`;
  list += `Ketik nama aplikasi untuk lihat harga.\n`;
  list += `Contoh: ketik *GPT* atau *Leonardo*\n\n`;
  list += `💳 Ketik *#bayar* untuk info pembayaran.\n`;
  list += `❓ Ketik *#help* untuk bantuan.\n\n`;
  list += config.footer;

  return list;
}

// ── Helper: Buat teks detail harga produk ───────────────
function buildProductDetail(product) {
  let detail = `╔══════════════════════════╗\n`;
  detail += `║  ${product.emoji} *${product.name}*  ║\n`;
  detail += `╠══════════════════════════╣\n\n`;
  detail += `📝 *Deskripsi:*\n${product.description}\n\n`;
  detail += `💰 *DAFTAR HARGA:*\n`;
  detail += `─────────────────────\n`;

  product.prices.forEach((p, i) => {
    detail += `\n📦 *Paket ${i + 1} — ${p.duration}*\n`;
    detail += `   💵 Harga: *${p.price}*\n`;
    detail += `   🛡️ Garansi: *${p.warranty}*\n`;
  });

  detail += `\n─────────────────────\n\n`;
  detail += `${product.note}\n\n`;
  detail += `🛒 *Mau order?*\n`;
  detail += `Ketik *#bayar* untuk mendapatkan QRIS pembayaran.\n`;
  detail += `Lalu konfirmasi ke admin setelah transfer.\n\n`;
  detail += config.footer;

  return detail;
}

// ── Helper: Buat teks help ──────────────────────────────
function buildHelpMessage() {
  let help = `╔══════════════════════════╗\n`;
  help += `║    ❓ *MENU BANTUAN*     ║\n`;
  help += `╠══════════════════════════╣\n\n`;
  help += `📋 *#list*\n`;
  help += `   → Lihat daftar aplikasi premium\n\n`;

  const products = Object.values(config.products);
  products.forEach((product) => {
    help += `${product.emoji} *${product.keyword.toUpperCase()}*\n`;
    help += `   → Lihat harga ${product.name}\n\n`;
  });

  help += `💳 *#bayar*\n`;
  help += `   → Info pembayaran via QRIS\n\n`;
  help += `👤 *#owner*\n`;
  help += `   → Hubungi admin/owner\n\n`;
  help += `╚══════════════════════════╝\n\n`;
  help += config.footer;

  return help;
}

// ── Helper: Buat teks pembayaran ────────────────────────
function buildPaymentMessage() {
  let payment = `╔══════════════════════════╗\n`;
  payment += `║   💳 *INFO PEMBAYARAN*   ║\n`;
  payment += `╠══════════════════════════╣\n\n`;
  payment += `📱 *Scan QRIS di bawah ini* untuk melakukan pembayaran.\n\n`;
  payment += `📌 *Langkah-langkah:*\n`;
  payment += `1️⃣ Pilih aplikasi yang mau dibeli\n`;
  payment += `2️⃣ Scan QRIS & bayar sesuai harga\n`;
  payment += `3️⃣ Screenshot bukti transfer\n`;
  payment += `4️⃣ Kirim screenshot ke *GRUP INI*\n`;
  payment += `5️⃣ Tunggu proses (maks 1x24 jam)\n\n`;
  payment += `🚨 *WAJIB DIBACA — SYARAT BUKTI TRANSFER:*\n`;
  payment += `─────────────────────\n`;
  payment += `Screenshot bukti transfer *HARUS* memperlihatkan:\n\n`;
  payment += `  ✅ *JAM & TANGGAL* transaksi\n`;
  payment += `  ✅ *NOMINAL* yang ditransfer\n`;
  payment += `  ✅ *NAMA PENGIRIM*\n`;
  payment += `  ✅ *STATUS BERHASIL* (bukan pending)\n`;
  payment += `  ✅ *ID TRANSAKSI / No. Referensi*\n\n`;
  payment += `⚠️ Screenshot yang *TIDAK LENGKAP* atau *TERPOTONG*\n`;
  payment += `❌ *TIDAK AKAN DIPROSES!*\n`;
  payment += `─────────────────────\n\n`;
  payment += `📢 Kirim screenshot langsung ke *GRUP INI*\n`;
  payment += `agar admin bisa langsung memproses pesananmu.\n\n`;
  payment += `• Transfer sesuai nominal, jangan lebih/kurang\n`;
  payment += `• Jangan edit/crop screenshot\n\n`;
  payment += config.footer;

  return payment;
}

// ── Main Handler ────────────────────────────────────────
async function handleMessage(message, client) {
  // Ambil teks pesan, lowercase untuk matching
  const body = message.body.trim().toLowerCase();

  // Skip pesan kosong
  if (!body) return;

  // ── Command: #list ──
  if (body === `${config.prefix}list`) {
    const listText = buildProductList();
    await message.reply(listText);
    console.log(`[BOT] 📋 Sent product list`);
    return;
  }

  // ── Command: #help ──
  if (body === `${config.prefix}help`) {
    const helpText = buildHelpMessage();
    await message.reply(helpText);
    console.log(`[BOT] ❓ Sent help message`);
    return;
  }

  // ── Command: #bayar ──
  if (body === `${config.prefix}bayar`) {
    const paymentText = buildPaymentMessage();

    // Kirim pesan teks dulu
    await message.reply(paymentText);

    // Kirim gambar QRIS
    try {
      if (fs.existsSync(config.qrisImagePath)) {
        const media = MessageMedia.fromFilePath(config.qrisImagePath);
        const chat = await message.getChat();
        await chat.sendMessage(media, {
          caption: '💳 *Scan QRIS di atas untuk pembayaran*\n\n' +
            '🚨 *PERHATIAN!*\n' +
            'Setelah bayar, *WAJIB* kirim screenshot bukti transfer ke *GRUP INI* dengan detail:\n\n' +
            '📌 *JAM & TANGGAL* transaksi\n' +
            '📌 *NOMINAL* yang dibayar\n' +
            '📌 *NAMA PENGIRIM & STATUS BERHASIL*\n\n' +
            '❌ Bukti tidak lengkap = *TIDAK DIPROSES*\n' +
            '✅ Bukti lengkap = *LANGSUNG DIPROSES* 🚀',
        });
        console.log(`[BOT] 💳 Sent QRIS image`);
      } else {
        await message.reply('⚠️ Maaf, gambar QRIS belum tersedia. Hubungi admin.');
        console.log(`[BOT] ⚠️ QRIS image not found at: ${config.qrisImagePath}`);
      }
    } catch (err) {
      console.error('[BOT] Error sending QRIS:', err);
      await message.reply('⚠️ Terjadi error saat mengirim QRIS. Coba lagi nanti.');
    }
    return;
  }

  // ── Command: #owner ──
  if (body === `${config.prefix}owner`) {
    const ownerMsg =
      `╔══════════════════════════╗\n` +
      `║     👤 *CONTACT ADMIN*   ║\n` +
      `╠══════════════════════════╣\n\n` +
      `📱 Hubungi owner/admin:\n` +
      `wa.me/${config.ownerNumber}\n\n` +
      `⏰ *Jam Operasional:*\n` +
      `Senin - Minggu: 08:00 - 23:00 WIB\n\n` +
      `📌 Respon maks 1x24 jam\n\n` +
      config.footer;

    await message.reply(ownerMsg);
    console.log(`[BOT] 👤 Sent owner info`);
    return;
  }

  // ── Keyword Produk (GPT, Leonardo, dll) ───────────────
  const products = Object.values(config.products);
  for (const product of products) {
    if (body === product.keyword.toLowerCase()) {
      const detailText = buildProductDetail(product);
      await message.reply(detailText);
      console.log(`[BOT] 💰 Sent pricing for: ${product.name}`);
      return;
    }
  }
}

module.exports = { handleMessage };
