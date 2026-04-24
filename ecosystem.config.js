/**
 * ══════════════════════════════════════════════════════════
 *  PM2 ECOSYSTEM CONFIG - BOT WHATSAPP PREMIUM APP STORE
 * ══════════════════════════════════════════════════════════
 *  Konfigurasi PM2 untuk menjalankan bot di VPS.
 *  Jalankan: pm2 start ecosystem.config.js
 */

module.exports = {
  apps: [
    {
      name: 'wa-premium-bot',
      script: 'index.js',
      cwd: '/opt/wa-premium-bot',

      // ── Process Management ──────────────────────────────
      instances: 1,            // Hanya 1 instance (WhatsApp session)
      autorestart: true,       // Auto restart jika crash
      watch: false,            // Jangan watch file changes di production
      max_memory_restart: '512M', // Restart jika memory > 512MB

      // ── Restart Policy ──────────────────────────────────
      max_restarts: 10,        // Max 10x restart
      min_uptime: '10s',       // Minimal uptime sebelum dianggap stabil
      restart_delay: 5000,     // Delay 5 detik antar restart

      // ── Logs ────────────────────────────────────────────
      error_file: '/opt/wa-premium-bot/logs/error.log',
      out_file: '/opt/wa-premium-bot/logs/output.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // ── Environment ─────────────────────────────────────
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
