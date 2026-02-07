#!/bin/bash

# Auto-Optimization Script: PNG to WebP Conversion
# Converts all PNG images in client/public/images to WebP format
# Maintains original directory structure in optimized/ subdirectory
# Usage: ./scripts/optimize-images.sh

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== FluffCo Image Optimization Script ===${NC}"
echo ""

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo -e "${YELLOW}cwebp not found. Installing webp tools...${NC}"
    sudo apt-get update && sudo apt-get install -y webp
fi

# Base directory
BASE_DIR="client/public/images"
OPTIMIZED_DIR="client/public/images/optimized"

# Create optimized directory if it doesn't exist
mkdir -p "$OPTIMIZED_DIR"

# Counter for statistics
total_files=0
converted_files=0
skipped_files=0
total_original_size=0
total_webp_size=0

echo -e "${BLUE}Scanning for PNG images in $BASE_DIR...${NC}"
echo ""

# Find all PNG files and convert them
while IFS= read -r -d '' png_file; do
    ((total_files++))
    
    # Get relative path from BASE_DIR
    rel_path="${png_file#$BASE_DIR/}"
    
    # Skip if already in optimized directory
    if [[ "$rel_path" == optimized/* ]]; then
        continue
    fi
    
    # Create corresponding directory structure in optimized/
    dir_name=$(dirname "$rel_path")
    mkdir -p "$OPTIMIZED_DIR/$dir_name"
    
    # Output WebP filename
    webp_file="$OPTIMIZED_DIR/${rel_path%.png}.webp"
    
    # Check if WebP already exists and is newer than PNG
    if [[ -f "$webp_file" ]] && [[ "$webp_file" -nt "$png_file" ]]; then
        echo -e "${YELLOW}⏭  Skipping (already optimized): $rel_path${NC}"
        ((skipped_files++))
        continue
    fi
    
    # Get original file size
    original_size=$(stat -f%z "$png_file" 2>/dev/null || stat -c%s "$png_file")
    total_original_size=$((total_original_size + original_size))
    
    # Convert PNG to WebP with quality 85 (good balance of quality/size)
    echo -e "${GREEN}✓ Converting: $rel_path${NC}"
    cwebp -q 85 "$png_file" -o "$webp_file" > /dev/null 2>&1
    
    # Get WebP file size
    webp_size=$(stat -f%z "$webp_file" 2>/dev/null || stat -c%s "$webp_file")
    total_webp_size=$((total_webp_size + webp_size))
    
    # Calculate savings
    savings=$((100 - (webp_size * 100 / original_size)))
    
    # Format sizes
    original_kb=$((original_size / 1024))
    webp_kb=$((webp_size / 1024))
    
    echo -e "  ${original_kb}KB → ${webp_kb}KB (${savings}% smaller)"
    echo ""
    
    ((converted_files++))
done < <(find "$BASE_DIR" -type f -name "*.png" -print0)

# Print summary
echo ""
echo -e "${BLUE}=== Optimization Summary ===${NC}"
echo -e "Total PNG files found: ${total_files}"
echo -e "Converted: ${GREEN}${converted_files}${NC}"
echo -e "Skipped (already optimized): ${YELLOW}${skipped_files}${NC}"

if [[ $converted_files -gt 0 ]]; then
    total_original_mb=$((total_original_size / 1024 / 1024))
    total_webp_mb=$((total_webp_size / 1024 / 1024))
    total_savings=$((100 - (total_webp_size * 100 / total_original_size)))
    
    echo ""
    echo -e "Original size: ${total_original_mb}MB"
    echo -e "WebP size: ${total_webp_mb}MB"
    echo -e "Total savings: ${GREEN}${total_savings}%${NC}"
fi

echo ""
echo -e "${GREEN}✓ Optimization complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Update image paths in code to use toWebP() helper function"
echo -e "2. Verify images load correctly on the site"
echo -e "3. Delete original PNG files if WebP versions work correctly"
