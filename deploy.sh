#!/bin/bash
set -e

echo "========================================="
echo "  Qiyue Valves - VPS Deployment Script"
echo "========================================="

if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2 globally..."
    sudo npm install -g pm2
fi

if [ ! -f .env ]; then
    echo ""
    echo "ERROR: .env file not found!"
    echo "Please create a .env file first. Example:"
    echo ""
    echo "  cp .env.example .env"
    echo "  nano .env"
    echo ""
    echo "Fill in your database URL, SMTP credentials, etc."
    exit 1
fi

echo "Installing dependencies..."
npm install

echo "Building project..."
npm run build

mkdir -p logs
mkdir -p dist/public/uploads

if [ -d "public/uploads" ] && [ "$(ls -A public/uploads 2>/dev/null)" ]; then
    cp -r public/uploads/* dist/public/uploads/ 2>/dev/null || true
fi

echo "Starting application with PM2..."
pm2 stop qiyue-valves 2>/dev/null || true
pm2 delete qiyue-valves 2>/dev/null || true
pm2 start ecosystem.config.cjs

pm2 save
pm2 startup 2>/dev/null || echo "Run 'sudo env PATH=\$PATH:\$(which node) pm2 startup systemd -u \$USER --hp \$HOME' to enable auto-start on boot"

echo ""
echo "========================================="
echo "  Deployment Complete!"
echo "========================================="
echo ""
echo "Your app is running on port 3000"
echo ""
echo "Useful PM2 commands:"
echo "  pm2 status          - Check app status"
echo "  pm2 logs            - View logs"
echo "  pm2 restart all     - Restart app"
echo ""
echo "Next steps:"
echo "  1. Set up Nginx as a reverse proxy (see nginx.conf)"
echo "  2. Set up SSL with Let's Encrypt"
echo ""
