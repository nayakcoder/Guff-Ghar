#!/usr/bin/env node

/**
 * Mobile Testing Helper for Guff Ghar
 * Automatically detects IP and provides mobile testing URLs
 */

const { execSync } = require('child_process')
const os = require('os')

function getLocalIP() {
  const interfaces = os.networkInterfaces()
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address
      }
    }
  }
  
  return 'localhost'
}

function generateQRCode(url) {
  try {
    // Try to generate QR code if qrcode-terminal is installed
    const qr = require('qrcode-terminal')
    console.log('\n📱 QR Code for Mobile Access:')
    qr.generate(url, { small: true })
  } catch (error) {
    console.log('\n💡 Tip: Install qrcode-terminal for QR codes:')
    console.log('npm install -g qrcode-terminal')
  }
}

async function main() {
  console.log('🔧 Mobile Testing Helper for Guff Ghar\n')
  
  const localIP = getLocalIP()
  const port = process.env.PORT || 3001
  const localUrl = `http://localhost:${port}`
  const networkUrl = `http://${localIP}:${port}`
  
  console.log('📍 Development URLs:')
  console.log(`   Local:   ${localUrl}`)
  console.log(`   Network: ${networkUrl}`)
  
  console.log('\n📱 Mobile Testing Instructions:')
  console.log('   1. Connect your phone to the same WiFi network')
  console.log(`   2. Open browser on phone and go to: ${networkUrl}`)
  console.log('   3. Test touch interactions and responsive design')
  
  // Generate QR code for easy mobile access
  generateQRCode(networkUrl)
  
  console.log('\n🛠  DevTools Mobile Testing:')
  console.log('   1. Open Chrome DevTools (F12)')
  console.log('   2. Click device toggle icon (📱)')
  console.log('   3. Select iPhone/Android preset')
  console.log('   4. Test responsive features')
  
  console.log('\n✨ Features to Test:')
  console.log('   • Touch scrolling and gestures')
  console.log('   • Mobile navigation menu')
  console.log('   • Portrait/landscape rotation')
  console.log('   • Form inputs and keyboard')
  console.log('   • Image uploads (camera access)')
  console.log('   • PWA features (install prompt)')
  
  console.log('\n🚀 Production Testing:')
  console.log('   • Use your deployed Vercel URL on mobile')
  console.log('   • Test over cellular data, not just WiFi')
  console.log('   • Check performance on slower connections')
  
  console.log('\n💡 Useful Mobile Testing Tools:')
  console.log('   • Chrome DevTools Device Mode')
  console.log('   • Firefox Responsive Design Mode')
  console.log('   • Safari Web Inspector (for iOS)')
  console.log('   • BrowserStack for real device testing')
}

main().catch(console.error)