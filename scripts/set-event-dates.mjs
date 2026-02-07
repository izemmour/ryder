import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import { landingPageSettings } from '../drizzle/schema.ts';

const db = drizzle(process.env.DATABASE_URL);

console.log('🗓️  Setting event end dates...\n');

// Event end dates for 2026
const eventDates = [
  { pageId: 'valentine', endDate: '2026-02-14' },
  { pageId: 'mothers-day', endDate: '2026-05-10' }, // Second Sunday of May
  { pageId: 'fathers-day', endDate: '2026-06-21' }, // Third Sunday of June
  { pageId: 'black-friday', endDate: '2026-11-27' }, // Day after Thanksgiving
];

for (const event of eventDates) {
  try {
    await db
      .update(landingPageSettings)
      .set({ eventEndDate: event.endDate })
      .where(eq(landingPageSettings.pageId, event.pageId));
    
    console.log(`✅ Set ${event.pageId} end date to ${event.endDate}`);
  } catch (error) {
    console.error(`❌ Failed to set ${event.pageId}:`, error.message);
  }
}

console.log('\n✨ Event dates updated!');
process.exit(0);
