#!/usr/bin/env tsx
/**
 * Interactive Landing Page Generator CLI
 * 
 * Walks through guideline steps and generates:
 * - Config file skeleton based on page type
 * - Route in App.tsx
 * - LP Manager integration
 */

import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

// ============================================
// TYPES
// ============================================

type PageType = 'angle' | 'event' | 'use-case';

interface LandingPageData {
  pageType: PageType;
  name: string;
  slug: string;
  title: string;
  description: string;
  category: string;
}

// ============================================
// UTILITIES
// ============================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============================================
// CONFIG TEMPLATES
// ============================================

function generateConfigTemplate(data: LandingPageData): string {
  const { pageType, name, slug, title, description, category } = data;
  
  // Base template
  let template = `/**
 * ${name} Landing Page Configuration
 * 
 * Page Type: ${pageType}
 * Category: ${category}
 */

import type { LandingPageConfig } from './types';
import { baseConfig } from './base.config';

export const ${slugify(slug).replace(/-/g, '')}Config: LandingPageConfig = {
  ...baseConfig,
  
  // ============================================
  // REQUIRED FIELDS
  // ============================================
  
  id: '${slugify(slug)}',
  name: '${name}',
  slug: '${slug}',
  pageType: '${pageType}',
  category: '${category}',
  
  // ============================================
  // SEO CONFIGURATION
  // ============================================
  
  seo: {
    title: '${title} – FluffCo',
    description: '${description}',
    noindex: true, // Prevent search engine indexing
  },
  
  // ============================================
  // GALLERY CONFIGURATION
  // ============================================
  
  gallery: {
    images: [
      '/images/pillow-hero.png',
      '/images/lifestyle-sleep.png',
      '/images/engineering-detail-new.png',
    ],
    slotOrder: [1, 2, 3, 4, 5, 6],
  },
  
  // ============================================
  // HERO SECTION
  // ============================================
  
  hero: {
    badge: {
      icon: 'star',
      text: '746,000+ Happy Sleepers',
    },
    title: '${title}',
    subtitle: '${description}',
    features: [
      { icon: 'check', text: '100% Cotton' },
      { icon: 'check', text: 'Skin Friendly' },
      { icon: 'check', text: 'Award Winning' },
      { icon: 'check', text: '300 Thread Count' },
    ],
  },
  
  // ============================================
  // TESTIMONIALS
  // ============================================
  
  testimonials: {
    sectionTitle: 'Real Reviews',
    sectionSubtitle: 'Loved by Hundreds of Thousands',
    testimonials: [
      {
        name: 'Sarah M.',
        location: 'New York, NY',
        rating: 5,
        date: '2024-01-15',
        content: 'Best pillow I\\'ve ever owned. The quality is exceptional and it has completely transformed my sleep.',
        verified: true,
      },
      // Add more testimonials here
    ],
  },
  
  // ============================================
  // PRICING CONFIGURATION
  // ============================================
  
  pricing: {
    tiers: {
      standard: [
        { quantity: 1, price: 59.90, compareAtPrice: 115.00, savings: 55.10, savingsPercent: 48 },
        { quantity: 2, price: 98.90, compareAtPrice: 222.00, savings: 123.10, savingsPercent: 55 },
        { quantity: 4, price: 149.90, compareAtPrice: 444.00, savings: 294.10, savingsPercent: 66 },
      ],
      king: [
        { quantity: 1, price: 69.90, compareAtPrice: 135.00, savings: 65.10, savingsPercent: 48 },
        { quantity: 2, price: 118.90, compareAtPrice: 262.00, savings: 143.10, savingsPercent: 55 },
        { quantity: 4, price: 179.90, compareAtPrice: 524.00, savings: 344.10, savingsPercent: 66 },
      ],
    },
  },
  
  // ============================================
  // FAQ CONFIGURATION
  // ============================================
  
  faq: {
    items: [
      {
        question: 'What makes this pillow different?',
        answer: 'Our pillow uses premium materials and hotel-quality construction for exceptional comfort and durability.',
      },
      {
        question: 'How do I care for my pillow?',
        answer: 'Machine wash cold, tumble dry low. The pillow maintains its shape and quality wash after wash.',
      },
      {
        question: 'What is your return policy?',
        answer: 'We offer a 30-night trial. If you\\'re not completely satisfied, return it for a full refund.',
      },
    ],
  },
  
  // ============================================
  // SECTIONS
  // ============================================
  
  sections: [
    'hero',
    'benefits',
    'technology',
    'testimonials',
    'faq',
  ],
`;

  // Add event-specific configuration
  if (pageType === 'event') {
    template += `
  // ============================================
  // EVENT-SPECIFIC CONFIGURATION
  // ============================================
  
  event: {
    endDate: '2024-12-31', // YYYY-MM-DD format
    colorScheme: 'valentine', // valentine, mothers-day, fathers-day, etc.
  },
  
  announcementBar: {
    text: 'Limited Time Event - Ends Soon!',
    link: '#pricing',
  },
`;
  }

  template += `};
`;

  return template;
}

// ============================================
// FILE OPERATIONS
// ============================================

function createConfigFile(data: LandingPageData): string {
  const configDir = path.join(process.cwd(), 'client', 'src', 'config');
  const fileName = `${slugify(data.slug)}.config.ts`;
  const filePath = path.join(configDir, fileName);
  
  const content = generateConfigTemplate(data);
  fs.writeFileSync(filePath, content, 'utf8');
  
  return filePath;
}

function updateConfigIndex(data: LandingPageData): void {
  const indexPath = path.join(process.cwd(), 'client', 'src', 'config', 'index.ts');
  let content = fs.readFileSync(indexPath, 'utf8');
  
  const configVarName = slugify(data.slug).replace(/-/g, '');
  const importStatement = `import { ${configVarName}Config } from './${slugify(data.slug)}.config';`;
  
  // Add import
  if (!content.includes(importStatement)) {
    const lastImportIndex = content.lastIndexOf('import');
    const nextLineIndex = content.indexOf('\n', lastImportIndex);
    content = content.slice(0, nextLineIndex + 1) + importStatement + '\n' + content.slice(nextLineIndex + 1);
  }
  
  // Add to landingPageConfigs object
  const configsMatch = content.match(/export const landingPageConfigs = {([^}]+)}/s);
  if (configsMatch) {
    const configsContent = configsMatch[1];
    if (!configsContent.includes(`'${data.slug}':`)) {
      const newEntry = `  '${data.slug}': ${configVarName}Config,`;
      const updatedConfigs = content.replace(
        /export const landingPageConfigs = {/,
        `export const landingPageConfigs = {\n${newEntry}`
      );
      content = updatedConfigs;
    }
  }
  
  // Add to exports
  if (!content.includes(`export { ${configVarName}Config }`)) {
    content += `\nexport { ${configVarName}Config };`;
  }
  
  fs.writeFileSync(indexPath, content, 'utf8');
}

function updateAppRoutes(data: LandingPageData): void {
  const appPath = path.join(process.cwd(), 'client', 'src', 'App.tsx');
  let content = fs.readFileSync(appPath, 'utf8');
  
  const configVarName = slugify(data.slug).replace(/-/g, '');
  
  // Add import
  const importStatement = `  ${configVarName}Config,`;
  if (!content.includes(importStatement)) {
    const importMatch = content.match(/import {([^}]+)} from ["']\.\/config["'];/s);
    if (importMatch) {
      const imports = importMatch[1];
      const updatedImports = imports.trim() + ',\n' + importStatement;
      content = content.replace(
        /import {([^}]+)} from ["']\.\/config["'];/s,
        `import {\n${updatedImports}\n} from "./config";`
      );
    }
  }
  
  // Add route
  const routeComment = `      {/* ${data.name} variant */}`;
  const routeCode = `      <Route path={"/${data.slug}"}>\n        {() => <ProductLandingTemplate config={${configVarName}Config} />}\n      </Route>`;
  
  if (!content.includes(`path={"/${data.slug}"}`)) {
    // Find the direct slug routes section
    const directRoutesIndex = content.indexOf('DIRECT SLUG ROUTES');
    if (directRoutesIndex !== -1) {
      const nextSectionIndex = content.indexOf('/* ===', directRoutesIndex + 1);
      const insertPosition = nextSectionIndex !== -1 ? nextSectionIndex : content.lastIndexOf('</Switch>');
      
      content = content.slice(0, insertPosition) + 
                `\n${routeComment}\n${routeCode}\n\n      ` + 
                content.slice(insertPosition);
    }
  }
  
  fs.writeFileSync(appPath, content, 'utf8');
}

// ============================================
// MAIN CLI FLOW
// ============================================

async function main() {
  console.log('\n🚀 Landing Page Generator\n');
  console.log('This tool will guide you through creating a new landing page.');
  console.log('All pages must follow LANDING_PAGE_GUIDELINES.md\n');
  
  // Step 1: Page Type
  console.log('Step 1: Select Page Type');
  console.log('  1) Angle - Product positioning (e.g., "Hotel Quality", "Neck Pain Relief")');
  console.log('  2) Event - Seasonal/holiday pages (e.g., "Valentine\'s Gift", "Mother\'s Day")');
  console.log('  3) Use Case - Problem-first pages (e.g., "Side Sleeper", "Hot Sleeper")\n');
  
  const pageTypeChoice = await question('Enter choice (1-3): ');
  const pageTypeMap: Record<string, PageType> = { '1': 'angle', '2': 'event', '3': 'use-case' };
  const pageType = pageTypeMap[pageTypeChoice.trim()];
  
  if (!pageType) {
    console.log('❌ Invalid choice. Exiting.');
    rl.close();
    return;
  }
  
  // Step 2: Page Name
  console.log(`\nStep 2: Page Name`);
  console.log('Example: "Hotel Quality Pillow", "Valentine\'s Gift", "Side Sleeper Pillow"\n');
  const name = await question('Enter page name: ');
  
  if (!name.trim()) {
    console.log('❌ Page name is required. Exiting.');
    rl.close();
    return;
  }
  
  // Step 3: Slug (auto-suggest from name)
  const suggestedSlug = slugify(name);
  console.log(`\nStep 3: URL Slug`);
  console.log(`Suggested: ${suggestedSlug}\n`);
  const slugInput = await question(`Enter slug (press Enter to use suggested): `);
  const slug = slugInput.trim() || suggestedSlug;
  
  // Step 4: SEO Title
  console.log(`\nStep 4: SEO Title`);
  console.log(`Format: "{Title} – FluffCo"`);
  console.log(`Suggested: "${name} – FluffCo"\n`);
  const titleInput = await question('Enter SEO title (press Enter to use suggested): ');
  const title = titleInput.trim() || name;
  
  // Step 5: SEO Description
  console.log(`\nStep 5: SEO Description`);
  console.log('Keep it under 160 characters for optimal display in search results.\n');
  const description = await question('Enter SEO description: ');
  
  if (!description.trim()) {
    console.log('❌ SEO description is required. Exiting.');
    rl.close();
    return;
  }
  
  // Determine category
  const category = pageType === 'use-case' ? 'use-case' : pageType === 'event' ? 'event' : 'angle';
  
  // Summary
  const data: LandingPageData = {
    pageType,
    name: name.trim(),
    slug,
    title,
    description: description.trim(),
    category,
  };
  
  console.log('\n📋 Summary:');
  console.log(`  Page Type: ${pageType}`);
  console.log(`  Name: ${data.name}`);
  console.log(`  Slug: ${data.slug}`);
  console.log(`  URL: https://get.fluff.co/${data.slug}`);
  console.log(`  SEO Title: ${data.title} – FluffCo`);
  console.log(`  SEO Description: ${data.description}`);
  console.log(`  Category: ${data.category}\n`);
  
  const confirm = await question('Create landing page? (y/n): ');
  
  if (confirm.toLowerCase() !== 'y') {
    console.log('❌ Cancelled. Exiting.');
    rl.close();
    return;
  }
  
  // Generate files
  console.log('\n⚙️  Generating files...\n');
  
  try {
    // Create config file
    const configPath = createConfigFile(data);
    console.log(`✅ Created config: ${path.relative(process.cwd(), configPath)}`);
    
    // Update config index
    updateConfigIndex(data);
    console.log(`✅ Updated config index`);
    
    // Update App.tsx routes
    updateAppRoutes(data);
    console.log(`✅ Updated App.tsx routes`);
    
    console.log('\n🎉 Landing page created successfully!\n');
    console.log('Next steps:');
    console.log(`  1. Edit the config file: client/src/config/${slugify(data.slug)}.config.ts`);
    console.log(`  2. Customize gallery images, testimonials, pricing, and FAQ`);
    console.log(`  3. Run validation: pnpm validate:lp ${data.slug}`);
    console.log(`  4. View page: http://localhost:3000/${data.slug}`);
    console.log(`  5. Register in LP Manager for admin access\n`);
    
  } catch (error) {
    console.error('\n❌ Error creating landing page:', error);
  }
  
  rl.close();
}

main();
