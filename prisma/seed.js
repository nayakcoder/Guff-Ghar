const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const user1 = await prisma.user.upsert({
    where: { email: 'demo@guffghar.com' },
    update: {},
    create: {
      email: 'demo@guffghar.com',
      username: 'guffghar_demo',
      displayName: 'Guff Ghar Demo',
      bio: 'Welcome to Guff Ghar! This is a demo account.',
      hashedPassword,
      verified: true,
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'test@guffghar.com' },
    update: {},
    create: {
      email: 'test@guffghar.com',
      username: 'test_user',
      displayName: 'Test User',
      bio: 'Another test user for the platform.',
      hashedPassword,
    },
  })

  // Create sample posts
  const post1 = await prisma.post.create({
    data: {
      content: 'Welcome to Guff Ghar! 🎉 This is the future of Nepali social media.',
      authorId: user1.id,
      mediaUrls: [],
      mediaTypes: [],
    },
  })

  const post2 = await prisma.post.create({
    data: {
      content: 'नमस्ते सबैलाई! यो एउटा नयाँ सुरुवात हो। 🙏',
      authorId: user2.id,
      mediaUrls: [],
      mediaTypes: [],
    },
  })

  // Create sample interactions
  await prisma.like.create({
    data: {
      userId: user2.id,
      postId: post1.id,
    },
  })

  await prisma.comment.create({
    data: {
      content: 'This looks amazing! Can\'t wait to use it.',
      authorId: user2.id,
      postId: post1.id,
    },
  })

  // Create a follow relationship
  await prisma.follow.create({
    data: {
      followerId: user2.id,
      followingId: user1.id,
    },
  })

  // Update user counts
  await prisma.user.update({
    where: { id: user1.id },
    data: { 
      postsCount: 1,
      followersCount: 1,
    },
  })

  await prisma.user.update({
    where: { id: user2.id },
    data: { 
      postsCount: 1,
      followingCount: 1,
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`Created users: ${user1.username}, ${user2.username}`)
  console.log('You can login with:')
  console.log('  Email: demo@guffghar.com')
  console.log('  Password: password123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })