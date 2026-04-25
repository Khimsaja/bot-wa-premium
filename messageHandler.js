/**
 * ══════════════════════════════════════════════════════════
 *  MESSAGE HANDLER - TRIANGLE STORE
 * ══════════════════════════════════════════════════════════
 */

const fs = require('fs');
const config = require('./config');
const { MessageMedia } = require('whatsapp-web.js');

// ── Helper: Buat teks daftar produk ─────────────────────
function buildProductList() {
  const products = Object.values(config.products);
  let list = `[ *${config.storeName}* ]\n`;
  list += `────────────────\n`;
  list += `*DAFTAR APLIKASI*\n\n`;

  products.forEach((product, index) => {
    list += `${index + 1}. ${product.name} (Ketik: ${product.keyword.toUpperCase()})\n`;
  });

  list += `\nKetik nama aplikasi untuk cek harga (Contoh: *GPT*)\n`;
  list += `Ketik *#bayar* untuk cara pembayaran\n`;
  list += `Ketik *#help* untuk bantuan\n`;
  list += config.footer;

  return list;
}

// ── Helper: Buat teks detail harga produk ───────────────
function buildProductDetail(product) {
  let detail = `[ *${product.name}* ]\n`;
  detail += `────────────────\n`;
  detail += `${product.note}\n\n`;
  detail += `*HARGA:*\n`;

  product.prices.forEach((p) => {
    if (p.category) {
      detail += `\n${p.category}\n`;
    } else if (p.warranty) {
      detail += `- *${p.duration}*: ${p.price} (${p.warranty})\n`;
    } else {
      detail += `${p.duration} : ${p.price}\n`;
    }
  });

  detail += `\nKetik *#bayar* untuk konfirmasi pesanan.\n`;
  detail += config.footer;

  return detail;
}

// ── Helper: Buat teks help ──────────────────────────────
function buildHelpMessage() {
  let help = `[ *BANTUAN* ]\n`;
  help += `────────────────\n`;
  help += `*#list*   : Lihat daftar aplikasi\n`;
  
  const products = Object.values(config.products);
  products.forEach((product) => {
    help += `${product.keyword.toLowerCase().padEnd(7, ' ')} : Cek harga ${product.name}\n`;
  });

  help += `*#bayar*  : Cara pembayaran\n`;
  help += `*#owner*  : Kontak admin\n`;
  help += config.footer;

  return help;
}

// ── Helper: Buat teks pembayaran ────────────────────────
function buildPaymentMessage() {
  let payment = `[ *PEMBAYARAN* ]\n`;
  payment += `────────────────\n`;
  payment += `Scan QRIS di bawah ini untuk membayar.\n\n`;
  payment += `*CARA ORDER:*\n`;
  payment += `1. Scan QRIS & transfer sesuai nominal.\n`;
  payment += `2. Screenshot bukti transfer berhasil.\n`;
  payment += `3. Kirim ke grup ini.\n\n`;
  payment += `*SYARAT BUKTI TRANSFER:*\n`;
  payment += `- Terlihat jam & tanggal\n`;
  payment += `- Terlihat nominal\n`;
  payment += `- Status berhasil (bukan pending)\n`;
  payment += `- No referensi / ID transaksi\n\n`;
  payment += `*Bukti terpotong/edit = Tidak diproses.*\n`;
  payment += config.footer;

  return payment;
}

// ── Main Handler ────────────────────────────────────────
async function handleMessage(message, client) {
  const body = message.body.trim().toLowerCase();

  if (!body) return;

  if (body === `${config.prefix}list`) {
    await message.reply(buildProductList());
    return;
  }

  if (body === `${config.prefix}help`) {
    await message.reply(buildHelpMessage());
    return;
  }

  if (body === `${config.prefix}bayar`) {
    await message.reply(buildPaymentMessage());

    try {
      if (fs.existsSync(config.qrisImagePath)) {
        const media = MessageMedia.fromFilePath(config.qrisImagePath);
        const chat = await message.getChat();
        await chat.sendMessage(media, {
          caption: '[ SCAN QRIS ]\nKirim bukti transfer ke grup ini setelah scan.',
        });
      } else {
        await message.reply('Sistem error: QRIS tidak ditemukan.');
      }
    } catch (err) {
      await message.reply('Sistem error: Gagal memuat QRIS.');
    }
    return;
  }

  if (body === `${config.prefix}owner`) {
    const ownerMsg =
      `[ *ADMIN* ]\n` +
      `────────────────\n` +
      `*Kontak:* wa.me/${config.ownerNumber}\n` +
      `*Operasional:* 08:00 - 23:00 WIB\n` +
      config.footer;
    await message.reply(ownerMsg);
    return;
  }

  const products = Object.values(config.products);
  for (const product of products) {
    if (body === product.keyword.toLowerCase()) {
      await message.reply(buildProductDetail(product));
      return;
    }
  }
}

module.exports = { handleMessage };
