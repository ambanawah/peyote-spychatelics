import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌵 Seeding Peyote Spychatelics database...');

  // Admin user
  const adminPassword = await bcrypt.hash('Admin@Peyote2024!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'carlloy57@gmail.com' },
    update: {},
    create: {
      email: 'carlloy57@gmail.com',
      password: adminPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin created:', admin.email);

  // Categories
  const categories = [
    { name: 'Cacti & Succulents', slug: 'cacti-succulents', icon: '🌵' },
    { name: 'Fungi & Mushrooms', slug: 'fungi-mushrooms', icon: '🍄' },
    { name: 'Medicinal Herbs', slug: 'medicinal-herbs', icon: '🌿' },
    { name: 'Tropical Rarities', slug: 'tropical-rarities', icon: '🌺' },
    { name: 'Micro Ecosystems', slug: 'micro-ecosystems', icon: '🪴' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Categories created');

  // Contact settings
  await prisma.contactSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      whatsappNumber: '+13202626158',
      email: 'carlloy57@gmail.com',
      whatsappEnabled: true,
      emailEnabled: true,
      autoReply: 'Thank you for contacting Peyote Spychatelics! We\'ll respond within 24 hours.',
    },
  });
  console.log('✅ Contact settings created');

  // Sample products
  const cactiCat = await prisma.category.findUnique({ where: { slug: 'cacti-succulents' } });
  if (cactiCat) {
    const products = [
      { name: 'Lophophora williamsii', slug: 'lophophora-williamsii', species: 'Peyote Cactus', description: 'The sacred peyote cactus — one of nature\'s most revered botanicals.', price: 89, stock: 12, status: 'FEATURED' as const, origin: 'Mexico' },
      { name: 'Trichocereus pachanoi', slug: 'trichocereus-pachanoi', species: 'San Pedro Cactus', description: 'Majestic columnar cactus from the Andes mountains.', price: 145, stock: 8, status: 'AVAILABLE' as const, origin: 'Peru' },
      { name: 'Bolivian Torch', slug: 'bolivian-torch', species: 'Echinopsis laganiformis', description: 'Fast-growing columnar cactus with striking ribbed form.', price: 78, stock: 15, status: 'AVAILABLE' as const, origin: 'Bolivia' },
    ];
    for (const p of products) {
      await prisma.product.upsert({
        where: { slug: p.slug },
        update: {},
        create: { ...p, categoryId: cactiCat.id },
      });
    }
    console.log('✅ Sample products created');
  }

  console.log('🎉 Database seeded successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
