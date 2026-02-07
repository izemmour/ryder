import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { landingPageSettings, marketingAngles, ctaButtons } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log('🎯 Assigning angles and CTA buttons to landing pages...\n');

// Fetch all angles and CTA buttons
const angles = await db.select().from(marketingAngles);
const ctas = await db.select().from(ctaButtons);

console.log(`Found ${angles.length} marketing angles and ${ctas.length} CTA buttons\n`);

// Log what we found
console.log('Angles:', angles.map(a => `${a.id}: ${a.name}`).join(', '));
console.log('CTAs:', ctas.map(c => `${c.id}: ${c.text}`).join(', '));
console.log('');

// Create mapping objects for easy lookup - use first match by index since we know the order
const angleMap = {
  'gift': angles[3],  // Gift Angle
  'hotel': angles[1],  // Hotel Quality
  'neck-pain': angles[2],  // Neck Pain Relief
  'restorative': angles[0],  // Restorative Alignment
};

const ctaMap = {
  'order': ctas[0],  // Order Now
  'gift': ctas[1],  // Gift Now
  'hotel': ctas[2],  // Get Hotel Quality
  'claim': ctas[3],  // Claim Now
  'end-battle': ctas[4],  // End Your Pillow Battle
};

// Assignment configuration
const assignments = [
  // Event pages - use gift angle and gift CTA
  { pageId: 'valentine-gift', angleId: angleMap['gift']?.id, ctaButtonId: ctaMap['gift']?.id },
  { pageId: 'mothers-day', angleId: angleMap['gift']?.id, ctaButtonId: ctaMap['gift']?.id },
  { pageId: 'fathers-day', angleId: angleMap['gift']?.id, ctaButtonId: ctaMap['gift']?.id },
  { pageId: 'black-friday', angleId: angleMap['restorative']?.id, ctaButtonId: ctaMap['claim']?.id },
  
  // Angle pages - use matching angles and CTAs
  { pageId: 'restorative-alignment', angleId: angleMap['restorative']?.id, ctaButtonId: ctaMap['order']?.id },
  { pageId: 'hotel-quality', angleId: angleMap['hotel']?.id, ctaButtonId: ctaMap['hotel']?.id },
  { pageId: 'neck-pain-relief', angleId: angleMap['neck-pain']?.id, ctaButtonId: ctaMap['end-battle']?.id },
  
  // Use case page
  { pageId: 'side-sleeper', angleId: angleMap['restorative']?.id, ctaButtonId: ctaMap['order']?.id },
  
  // Default page
  { pageId: 'default', angleId: angleMap['hotel']?.id, ctaButtonId: ctaMap['order']?.id },
];

// Execute assignments
for (const assignment of assignments) {
  if (!assignment.angleId || !assignment.ctaButtonId) {
    console.log(`⚠️  Skipping ${assignment.pageId} - missing angle or CTA button`);
    continue;
  }
  
  try {
    // Check if settings exist
    const existing = await db.select().from(landingPageSettings).where(eq(landingPageSettings.pageId, assignment.pageId));
    
    if (existing.length > 0) {
      // Update existing
      await db.update(landingPageSettings)
        .set({
          angleId: assignment.angleId,
          ctaButtonId: assignment.ctaButtonId,
        })
        .where(eq(landingPageSettings.pageId, assignment.pageId));
      console.log(`✅ Updated ${assignment.pageId}: angle=${assignment.angleId}, cta=${assignment.ctaButtonId}`);
    } else {
      // Insert new
      await db.insert(landingPageSettings).values({
        pageId: assignment.pageId,
        angleId: assignment.angleId,
        ctaButtonId: assignment.ctaButtonId,
        isActive: 1,
      });
      console.log(`✅ Created ${assignment.pageId}: angle=${assignment.angleId}, cta=${assignment.ctaButtonId}`);
    }
  } catch (error) {
    console.error(`❌ Error assigning ${assignment.pageId}:`, error.message);
  }
}

console.log('\n✨ Assignment complete!');
await connection.end();
