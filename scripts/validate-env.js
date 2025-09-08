#!/usr/bin/env node

/**
 * Environment Validation Script
 * Checks if all required environment variables are properly configured
 */

const fs = require('fs')
const path = require('path')

function checkFile(filePath, name) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${name} exists`)
    return true
  } else {
    console.log(`❌ ${name} missing`)
    return false
  }
}

function validateEnvVar(content, varName, required = true) {
  const regex = new RegExp(`${varName}=["']?([^"'\\n]+)["']?`)
  const match = content.match(regex)
  
  if (!match) {
    if (required) {
      console.log(`❌ ${varName} is missing`)
      return false
    } else {
      console.log(`⚠️  ${varName} is optional but not set`)
      return true
    }
  }
  
  const value = match[1]
  
  // Check for placeholder values
  const placeholders = ['your-', '[YOUR-', 'change-this', 'localhost', 'password123']
  const hasPlaceholder = placeholders.some(placeholder => 
    value.toLowerCase().includes(placeholder.toLowerCase())
  )
  
  if (hasPlaceholder && required) {
    console.log(`⚠️  ${varName} contains placeholder value: ${value}`)
    return false
  }
  
  if (varName === 'DATABASE_URL' && !value.includes('supabase.co')) {
    console.log(`⚠️  ${varName} should use Supabase for production`)
  }
  
  console.log(`✅ ${varName} is configured`)
  return true
}

function main() {
  console.log('🔍 Validating Guff Ghar Environment Configuration...\n')
  
  let isValid = true
  
  // Check if files exist
  const envLocalPath = path.join(__dirname, '..', '.env.local')
  const envPath = path.join(__dirname, '..', '.env')
  
  if (!checkFile(envLocalPath, '.env.local')) {
    console.log('\n📝 Please create .env.local file with your configuration')
    console.log('Copy from .env and update with your actual values')
    return
  }
  
  // Read environment file
  const envContent = fs.readFileSync(envLocalPath, 'utf8')
  
  console.log('\n🔐 Checking required environment variables:')
  
  // Required variables
  isValid &= validateEnvVar(envContent, 'DATABASE_URL', true)
  isValid &= validateEnvVar(envContent, 'JWT_SECRET', true)
  isValid &= validateEnvVar(envContent, 'NEXT_PUBLIC_APP_URL', true)
  
  console.log('\n🎨 Checking optional variables:')
  
  // Optional variables
  validateEnvVar(envContent, 'CLOUDINARY_CLOUD_NAME', false)
  validateEnvVar(envContent, 'CLOUDINARY_API_KEY', false)
  validateEnvVar(envContent, 'CLOUDINARY_API_SECRET', false)
  
  console.log('\n📊 Summary:')
  
  if (isValid) {
    console.log('✅ Environment configuration looks good!')
    console.log('\nNext steps:')
    console.log('1. Run: npm run db:setup')
    console.log('2. Deploy: vercel --prod')
    console.log('3. Add environment variables to Vercel dashboard')
  } else {
    console.log('❌ Please fix the issues above before proceeding')
    console.log('\nSee DATABASE_SETUP.md for detailed instructions')
  }
}

main()