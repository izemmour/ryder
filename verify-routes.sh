#!/bin/bash

# Landing Pages Route Verification Script
# Tests all landing page routes to ensure they're working

echo "=================================="
echo "Landing Pages Route Verification"
echo "=================================="
echo ""

BASE_URL="http://localhost:3001"

# Array of routes to test
routes=(
  "/"
  "/down-pillow-restorative-alignment"
  "/lp/restorative-alignment"
  "/hotel-quality-pillow"
  "/lp/hotel-quality"
  "/neck-pain-relief-pillow"
  "/lp/neck-pain-relief"
  "/side-sleeper-pillow"
  "/lp/side-sleeper"
  "/valentines-gift"
  "/lp/valentine-gift"
  "/mothers-day-gift"
  "/lp/mothers-day"
  "/fathers-day-gift"
  "/lp/fathers-day"
  "/quiz"
  "/debug-quiz"
  "/lp"
)

# Test each route
for route in "${routes[@]}"; do
  echo "Testing: $route"
  status_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$route")
  
  if [ "$status_code" -eq 200 ]; then
    echo "  ✅ Status: $status_code (OK)"
  else
    echo "  ❌ Status: $status_code (ERROR)"
  fi
  echo ""
done

echo "=================================="
echo "Verification Complete"
echo "=================================="
