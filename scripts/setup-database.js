#!/usr/bin/env node

/**
 * Database Setup Script for Guff Ghar
 * This script helps set up and migrate your database
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

function runCommand(command, description) {
  console.log(`\n🔄 ${description}...`)
  try {
    execSync(command, { stdio: 'inherit' })
    console.log(`✅ ${description} completed successfully`)
  } catch (error) {
    console.error(`❌ Failed to ${description.toLowerCase()}:`, error.message)
    process.exit(1)
  }
}

function checkEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found!')
    console.log('Please create .env.local file with your database credentials')
    process.exit(1)
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8')
  if (envContent.includes('[YOUR-PASSWORD]') || envContent.includes('[PROJECT-REF]')) {
    console.error('❌ Please update your DATABASE_URL in .env.local with actual Supabase credentials')
    console.log('Replace [YOUR-PASSWORD] and [PROJECT-REF] with your actual values')
    process.exit(1)
  }
  
  console.log('✅ Environment file looks good')
}

async function main() {
  console.log('🚀 Setting up Guff Ghar Database...\n')
  
  // Check environment file
  checkEnvFile()
  
  // Generate Prisma client
  runCommand('npx prisma generate', 'Generating Prisma client')
  
  // Push database schema
  runCommand('npx prisma db push', 'Pushing database schema')
  
  // Optional: Seed with sample data
  console.log('\n📊 Would you like to seed with sample data? (y/n)')
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })
  
  readline.question('', (answer) => {
    if (answer.toLowerCase() === 'y') {
      runCommand('npx prisma db seed', 'Seeding database with sample data')
    }
    
    console.log('\n🎉 Database setup complete!')
    console.log('\nNext steps:')
    console.log('1. Update Vercel environment variables with your DATABASE_URL')
    console.log('2. Deploy to Vercel: npm run vercel-deploy')
    console.log('3. Test your app at the deployed URL')
    
    readline.close()
  })
}

main().catch(console.error)