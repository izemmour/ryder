#!/usr/bin/env node

/**
 * Image Compression Script
 * 
 * Compresses all PNG images in client/public/images/ using Sharp
 * - Creates optimized/ subdirectory for compressed images
 * - Maintains 85% quality for visual fidelity
 * - Generates both PNG and WebP versions
 * - Preserves original files
 */

import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SOURCE_DIR = join(__dirname, '../client/public/images');
const OUTPUT_DIR = join(SOURCE_DIR, 'optimized');

// Compression settings
const QUALITY = 85;
const PNG_COMPRESSION_LEVEL = 9;

async function ensureDir(dir) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function getFileSizeInMB(filePath) {
  const stats = await stat(filePath);
  return (stats.size / (1024 * 1024)).toFixed(2);
}

async function compressImage(inputPath, outputDir) {
  const filename = basename(inputPath);
  const ext = extname(filename);
  const nameWithoutExt = basename(filename, ext);
  
  if (ext.toLowerCase() !== '.png') {
    return null;
  }
  
  const outputPngPath = join(outputDir, filename);
  const outputWebpPath = join(outputDir, `${nameWithoutExt}.webp`);
  
  try {
    const originalSize = await getFileSizeInMB(inputPath);
    
    // Compress PNG
    await sharp(inputPath)
      .png({
        quality: QUALITY,
        compressionLevel: PNG_COMPRESSION_LEVEL,
        adaptiveFiltering: true,
        palette: false
      })
      .toFile(outputPngPath);
    
    const compressedPngSize = await getFileSizeInMB(outputPngPath);
    
    // Generate WebP version
    await sharp(inputPath)
      .webp({
        quality: QUALITY,
        effort: 6
      })
      .toFile(outputWebpPath);
    
    const webpSize = await getFileSizeInMB(outputWebpPath);
    
    const savings = ((1 - compressedPngSize / originalSize) * 100).toFixed(1);
    const webpSavings = ((1 - webpSize / originalSize) * 100).toFixed(1);
    
    return {
      filename,
      originalSize: `${originalSize}MB`,
      compressedPngSize: `${compressedPngSize}MB`,
      webpSize: `${webpSize}MB`,
      savings: `${savings}%`,
      webpSavings: `${webpSavings}%`
    };
  } catch (err) {
    console.error(`Error compressing ${filename}:`, err.message);
    return null;
  }
}

async function getAllPngFiles(dir) {
  const files = [];
  
  async function scan(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip optimized directory
        if (entry.name !== 'optimized') {
          await scan(fullPath);
        }
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
        files.push(fullPath);
      }
    }
  }
  
  await scan(dir);
  return files;
}

async function main() {
  console.log('🖼️  Image Compression Script\n');
  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);
  
  // Ensure output directory exists
  await ensureDir(OUTPUT_DIR);
  
  // Get all PNG files
  const pngFiles = await getAllPngFiles(SOURCE_DIR);
  console.log(`Found ${pngFiles.length} PNG files\n`);
  
  if (pngFiles.length === 0) {
    console.log('No PNG files found to compress.');
    return;
  }
  
  // Compress images
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;
  let totalWebpSize = 0;
  let successCount = 0;
  
  for (let i = 0; i < pngFiles.length; i++) {
    const inputPath = pngFiles[i];
    const filename = basename(inputPath);
    
    process.stdout.write(`[${i + 1}/${pngFiles.length}] ${filename}... `);
    
    const result = await compressImage(inputPath, OUTPUT_DIR);
    
    if (result) {
      console.log(`✓ ${result.originalSize} → ${result.compressedPngSize} (${result.savings}) | WebP: ${result.webpSize} (${result.webpSavings})`);
      
      totalOriginalSize += parseFloat(result.originalSize);
      totalCompressedSize += parseFloat(result.compressedPngSize);
      totalWebpSize += parseFloat(result.webpSize);
      successCount++;
    } else {
      console.log('✗ Failed');
    }
  }
  
  // Summary
  console.log('\n📊 Compression Summary:');
  console.log(`   Files processed: ${successCount}/${pngFiles.length}`);
  console.log(`   Total original size: ${totalOriginalSize.toFixed(2)}MB`);
  console.log(`   Total compressed PNG size: ${totalCompressedSize.toFixed(2)}MB`);
  console.log(`   Total WebP size: ${totalWebpSize.toFixed(2)}MB`);
  console.log(`   PNG savings: ${((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1)}%`);
  console.log(`   WebP savings: ${((1 - totalWebpSize / totalOriginalSize) * 100).toFixed(1)}%`);
  console.log(`\n✨ Compression complete! Optimized images saved to: ${OUTPUT_DIR}`);
}

main().catch(console.error);
