#!/bin/bash
# ══════════════════════════════════════════════════════════
#  DEPLOY SCRIPT - BOT WHATSAPP PREMIUM APP STORE
# ══════════════════════════════════════════════════════════
#  Jalankan script ini di VPS Ubuntu (20.04 / 22.04 / 24.04)
#
#  Cara pakai:
#    chmod +x deploy.sh
#    sudo ./deploy.sh
# ══════════════════════════════════════════════════════════

set -e

# ── Warna Terminal ───────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

BOT_DIR="/opt/wa-premium-bot"
BOT_USER="botwa"

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════╗"
echo "║                                              ║"
echo "║   💎  PREMIUM APP STORE - VPS Deploy  💎    ║"
echo "║                                              ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

# ── Cek root ─────────────────────────────────────────────
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}❌ Jalankan script ini sebagai root (sudo)${NC}"
  exit 1
fi

# ═════════════════════════════════════════════════════════
# STEP 1: Update & Install Dependencies
# ═════════════════════════════════════════════════════════
echo -e "\n${YELLOW}[1/7] 📦 Mengupdate sistem & install dependencies...${NC}"
apt-get update -y
apt-get upgrade -y

# Dependencies untuk Chromium/Puppeteer (dibutuhkan whatsapp-web.js)
apt-get install -y \
  curl \
  wget \
  git \
  unzip \
  build-essential \
  gconf-service \
  libasound2 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgcc1 \
  libgconf-2-4 \
  libgdk-pixbuf2.0-0 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  ca-certificates \
  fonts-liberation \
  libnss3 \
  lsb-release \
  xdg-utils \
  libgbm-dev \
  libxshmfence1

echo -e "${GREEN}✅ Dependencies terinstall${NC}"

# ═════════════════════════════════════════════════════════
# STEP 2: Install Node.js 20 LTS
# ═════════════════════════════════════════════════════════
echo -e "\n${YELLOW}[2/7] 🟢 Menginstall Node.js 20 LTS...${NC}"

if command -v node &> /dev/null; then
  NODE_VER=$(node -v)
  echo -e "   Node.js sudah terinstall: ${NODE_VER}"
else
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

echo -e "   Node.js: $(node -v)"
echo -e "   npm: $(npm -v)"
echo -e "${GREEN}✅ Node.js terinstall${NC}"

# ═════════════════════════════════════════════════════════
# STEP 3: Install PM2
# ═════════════════════════════════════════════════════════
echo -e "\n${YELLOW}[3/7] 🔄 Menginstall PM2...${NC}"

if command -v pm2 &> /dev/null; then
  echo "   PM2 sudah terinstall"
else
  npm install -g pm2
fi

echo -e "${GREEN}✅ PM2 terinstall${NC}"

# ═════════════════════════════════════════════════════════
# STEP 4: Buat user khusus bot (opsional, lebih aman)
# ═════════════════════════════════════════════════════════
echo -e "\n${YELLOW}[4/7] 👤 Setup user & direktori bot...${NC}"

# Buat user jika belum ada
if id "$BOT_USER" &>/dev/null; then
  echo "   User '$BOT_USER' sudah ada"
else
  useradd -m -s /bin/bash "$BOT_USER"
  echo "   User '$BOT_USER' dibuat"
fi

# Buat direktori bot
mkdir -p "$BOT_DIR"
mkdir -p "$BOT_DIR/logs"
mkdir -p "$BOT_DIR/media"

echo -e "${GREEN}✅ User & direktori siap${NC}"

# ═════════════════════════════════════════════════════════
# STEP 5: Copy file bot
# ═════════════════════════════════════════════════════════
echo -e "\n${YELLOW}[5/7] 📁 Meng-copy file bot...${NC}"

# Copy semua file bot (kecuali node_modules dan auth)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cp "$SCRIPT_DIR/index.js" "$BOT_DIR/"
cp "$SCRIPT_DIR/messageHandler.js" "$BOT_DIR/"
cp "$SCRIPT_DIR/config.js" "$BOT_DIR/"
cp "$SCRIPT_DIR/package.json" "$BOT_DIR/"
cp "$SCRIPT_DIR/package-lock.json" "$BOT_DIR/" 2>/dev/null || true
cp "$SCRIPT_DIR/ecosystem.config.js" "$BOT_DIR/"
cp "$SCRIPT_DIR/.gitignore" "$BOT_DIR/" 2>/dev/null || true

# Copy media (QRIS, dll)
if [ -d "$SCRIPT_DIR/media" ]; then
  cp -r "$SCRIPT_DIR/media/"* "$BOT_DIR/media/" 2>/dev/null || true
  echo "   Media files copied"
fi

# Set ownership
chown -R "$BOT_USER:$BOT_USER" "$BOT_DIR"

echo -e "${GREEN}✅ File bot ter-copy ke $BOT_DIR${NC}"

# ═════════════════════════════════════════════════════════
# STEP 6: Install npm dependencies
# ═════════════════════════════════════════════════════════
echo -e "\n${YELLOW}[6/7] 📦 Menginstall npm dependencies...${NC}"

cd "$BOT_DIR"
sudo -u "$BOT_USER" npm install --production

echo -e "${GREEN}✅ Dependencies terinstall${NC}"

# ═════════════════════════════════════════════════════════
# STEP 7: Start dengan PM2
# ═════════════════════════════════════════════════════════
echo -e "\n${YELLOW}[7/7] 🚀 Menjalankan bot dengan PM2...${NC}"

# Stop bot lama jika ada
sudo -u "$BOT_USER" bash -c "cd $BOT_DIR && pm2 delete wa-premium-bot 2>/dev/null || true"

# Start bot
sudo -u "$BOT_USER" bash -c "cd $BOT_DIR && pm2 start ecosystem.config.js"

# Setup PM2 startup (auto-start saat VPS reboot)
pm2 startup systemd -u "$BOT_USER" --hp "/home/$BOT_USER"
sudo -u "$BOT_USER" bash -c "pm2 save"

echo -e "${GREEN}✅ Bot berjalan!${NC}"

# ═════════════════════════════════════════════════════════
# SELESAI
# ═════════════════════════════════════════════════════════
echo -e "\n${CYAN}"
echo "╔══════════════════════════════════════════════╗"
echo "║                                              ║"
echo "║   ✅  DEPLOYMENT SELESAI!                    ║"
echo "║                                              ║"
echo "║   Bot berjalan di: $BOT_DIR                  "
echo "║   User: $BOT_USER                            "
echo "║                                              ║"
echo "║   📌 PENTING:                                ║"
echo "║   Scan QR Code dari log PM2:                 ║"
echo "║   pm2 logs wa-premium-bot                    ║"
echo "║                                              ║"
echo "║   📋 Commands:                               ║"
echo "║   pm2 status        → Cek status             ║"
echo "║   pm2 logs          → Lihat log              ║"
echo "║   pm2 restart all   → Restart bot            ║"
echo "║   pm2 stop all      → Stop bot               ║"
echo "║                                              ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"
