import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema.ts';
import { ctaButtons } from '../drizzle/schema.ts';
import { config } from 'dotenv';

config();

const buttons = [
  {
    text: 'Order Now',
    secondaryText: '& Save {discount}%',
    alternativeText: 'Shop Now',
    url: 'https://checkout.get.fluff.co',
    variant: 'default',
    isDefault: 1,
    sortOrder: 1
  },
  {
    text: 'Gift Now',
    secondaryText: '& Save {discount}%',
    alternativeText: 'Send a Gift',
    url: 'https://checkout.get.fluff.co',
    variant: 'default',
    isDefault: 0,
    sortOrder: 2
  },
  {
    text: 'Get Hotel Quality',
    secondaryText: '& Save {discount}%',
    alternativeText: 'Order Now',
    url: 'https://checkout.get.fluff.co',
    variant: 'default',
    isDefault: 0,
    sortOrder: 3
  },
  {
    text: 'Claim Now',
    secondaryText: '& Save {discount}%',
    alternativeText: 'Get Yours',
    url: 'https://checkout.get.fluff.co',
    variant: 'default',
    isDefault: 0,
    sortOrder: 4
  },
  {
    text: 'End Your Pillow Battle',
    secondaryText: '& Save {discount}%',
    alternativeText: 'Get Relief',
    url: 'https://checkout.get.fluff.co',
    variant: 'default',
    isDefault: 0,
    sortOrder: 5
  }
];

async function seed() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection, { schema, mode: 'default' });

  console.log('🌱 Seeding CTA button groups...');

  for (const button of buttons) {
    try {
      await db.insert(ctaButtons).values(button);
      console.log(`✅ Created CTA button: ${button.text}`);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⏭️  CTA button already exists: ${button.text}`);
      } else {
        console.error(`❌ Error creating CTA button ${button.text}:`, error.message);
      }
    }
  }

  console.log('✨ CTA button groups seeding complete!');
  await connection.end();
}

seed().catch((error) => {
  console.error('Fatal error during seeding:', error);
  process.exit(1);
});
