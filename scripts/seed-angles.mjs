import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema.ts';
import { marketingAngles } from '../drizzle/schema.ts';
import { config } from 'dotenv';

config();

const angles = [
  {
    slug: 'restorative-alignment',
    name: 'Restorative Alignment',
    productTitle: 'Restorative Alignment Pillow',
    tags: 'Cervical Support, Spinal Alignment, Pain Relief',
    description: 'Wake up pain-free with proper cervical support and spinal alignment',
    colorScheme: '#2d3a5c',
    sortOrder: 1,
    isActive: 1
  },
  {
    slug: 'hotel-quality',
    name: 'Hotel Quality',
    productTitle: 'The Same Pillows Used in 5-Star Hotels - For Less',
    tags: '100% Cotton, Skin Friendly, Award Winning, 300 Thread Count',
    description: 'Sleep like you\'re on vacation every night with luxury hotel-quality comfort',
    colorScheme: '#1a1a1a',
    sortOrder: 2,
    isActive: 1
  },
  {
    slug: 'neck-pain-relief',
    name: 'Neck Pain Relief',
    productTitle: 'Neck Pain Relief Pillow',
    tags: 'Orthopedic Support, Pressure Relief, Therapeutic',
    description: 'Say goodbye to morning neck stiffness with targeted orthopedic support',
    colorScheme: '#e63946',
    sortOrder: 3,
    isActive: 1
  },
  {
    slug: 'gift-angle',
    name: 'Gift Angle',
    productTitle: 'The Perfect Gift for Better Sleep',
    tags: 'Thoughtful Gift, Premium Quality, Health & Wellness',
    description: 'Give the gift of restful nights and pain-free mornings',
    colorScheme: '#d4a5a5',
    sortOrder: 4,
    isActive: 1
  }
];

async function seed() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection, { schema, mode: 'default' });

  console.log('🌱 Seeding marketing angles...');

  for (const angle of angles) {
    try {
      await db.insert(marketingAngles).values(angle);
      console.log(`✅ Created angle: ${angle.name}`);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⏭️  Angle already exists: ${angle.name}`);
      } else {
        console.error(`❌ Error creating angle ${angle.name}:`, error.message);
      }
    }
  }

  console.log('✨ Marketing angles seeding complete!');
  await connection.end();
}

seed().catch((error) => {
  console.error('Fatal error during seeding:', error);
  process.exit(1);
});
