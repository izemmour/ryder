/**
 * CobeGlobe Component
 * 
 * Lightweight 3D WebGL globe using COBE library (5kB)
 * Adapts colors to event color scheme
 * Animates order flow arcs from warehouses to customers
 * Shows warehouse tooltips on hover
 */

import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';

interface CobeGlobeProps {
  className?: string;
  primaryColor?: string; // Event primary color (e.g., gold for Black Friday)
  backgroundColor?: string; // Background color
  onOrderCountChange?: (count: number) => void; // Callback when order count changes
}

interface OrderArc {
  from: [number, number]; // [lat, long]
  to: [number, number]; // [lat, long]
  progress: number; // 0 to 1
  id: number;
}

// Warehouse/distribution center locations - SYNCED with OrderPopup.tsx checkout animation
interface WarehouseLocation {
  location: [number, number]; // [latitude, longitude]
  name: string;
  city: string;
}

const WAREHOUSES: WarehouseLocation[] = [
  { location: [40.7357, -74.1724], name: "New Jersey DC", city: "Newark, NJ" },
  { location: [32.7767, -96.797], name: "Texas Fulfillment", city: "Dallas, TX" },
  { location: [51.5074, -0.1278], name: "UK Fulfillment", city: "London, UK" }, // Default 3rd location (matches OrderPopup Europe option)
];

// Major customer destination cities
const DESTINATIONS: Array<[number, number]> = [
  [34.0522, -118.2437], // Los Angeles
  [41.8781, -87.6298],  // Chicago
  [29.7604, -95.3698],  // Houston
  [33.4484, -112.074],  // Phoenix
  [39.7392, -104.9903], // Denver
  [47.6062, -122.3321], // Seattle
  [25.7617, -80.1918],  // Miami
  [42.3601, -71.0589],  // Boston
  [43.6532, -79.3832],  // Toronto
  [49.2827, -123.1207], // Vancouver
  [48.8566, 2.3522],    // Paris
  [52.52, 13.405],      // Berlin
  [41.9028, 12.4964],   // Rome
  [40.4168, -3.7038],   // Madrid
  [35.6762, 139.6503],  // Tokyo
  [37.5665, 126.978],   // Seoul
  [31.2304, 121.4737],  // Shanghai
  [22.3193, 114.1694],  // Hong Kong
  [-33.8688, 151.2093], // Sydney
  [-37.8136, 144.9631], // Melbourne
];

// Calculate great circle intermediate point
function interpolateGreatCircle(
  from: [number, number],
  to: [number, number],
  fraction: number
): [number, number] {
  const [lat1, lon1] = [from[0] * Math.PI / 180, from[1] * Math.PI / 180];
  const [lat2, lon2] = [to[0] * Math.PI / 180, to[1] * Math.PI / 180];
  
  const d = 2 * Math.asin(Math.sqrt(
    Math.pow(Math.sin((lat1 - lat2) / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon1 - lon2) / 2), 2)
  ));
  
  const a = Math.sin((1 - fraction) * d) / Math.sin(d);
  const b = Math.sin(fraction * d) / Math.sin(d);
  
  const x = a * Math.cos(lat1) * Math.cos(lon1) + b * Math.cos(lat2) * Math.cos(lon2);
  const y = a * Math.cos(lat1) * Math.sin(lon1) + b * Math.cos(lat2) * Math.sin(lon2);
  const z = a * Math.sin(lat1) + b * Math.sin(lat2);
  
  const latResult = Math.atan2(z, Math.sqrt(x * x + y * y)) * 180 / Math.PI;
  const lonResult = Math.atan2(y, x) * 180 / Math.PI;
  
  return [latResult, lonResult];
}

// Convert lat/long to screen coordinates (approximate for tooltip positioning)
function latLongToScreen(
  lat: number,
  long: number,
  phi: number,
  containerSize: number
): { x: number; y: number; visible: boolean } {
  // Simple orthographic projection approximation
  const latRad = lat * Math.PI / 180;
  const longRad = (long - phi * 180 / Math.PI) * Math.PI / 180;
  
  // Check if point is on visible hemisphere
  const visible = Math.cos(latRad) * Math.cos(longRad) > 0;
  
  const x = containerSize * 0.5 + (containerSize * 0.4 * Math.cos(latRad) * Math.sin(longRad));
  const y = containerSize * 0.5 - (containerSize * 0.4 * Math.sin(latRad));
  
  return { x, y, visible };
}

export function CobeGlobe({ 
  className = "", 
  primaryColor = "#FFD700", // Default gold
  backgroundColor = "#1a1a1a", // Default dark
  onOrderCountChange
}: CobeGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const phiRef = useRef(0);
  const [hoveredWarehouse, setHoveredWarehouse] = useState<number | null>(null);
  const [warehousePositions, setWarehousePositions] = useState<Array<{ x: number; y: number; visible: boolean }>>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Convert hex to RGB for COBE
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
      ] : [1, 1, 1];
    };

    const primaryRgb = hexToRgb(primaryColor);
    
    // Light yellow for water, darker yellow for continents
    const waterColor: [number, number, number] = [0.98, 0.95, 0.85]; // Light yellow (#FAF2D9)
    const landColor: [number, number, number] = primaryRgb as [number, number, number]; // Darker yellow from event scheme

    let phi = 0;
    let width = 0;
    let orderArcs: OrderArc[] = [];
    let nextArcId = 0;
    let lastArcTime = Date.now();
    let orderCount = Math.floor(100 + Math.random() * 50); // Start at random number 100-150

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    globeRef.current = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 3,
      baseColor: waterColor,
      markerColor: landColor,
      glowColor: waterColor,
      markers: [],
      onRender: (state) => {
        // Slower auto-rotate (reduced from 0.003 to 0.001)
        state.phi = phi;
        phi += 0.001;
        phiRef.current = phi;
        
        // Update warehouse tooltip positions
        if (containerRef.current) {
          const containerSize = containerRef.current.offsetWidth;
          const positions = WAREHOUSES.map(wh => 
            latLongToScreen(wh.location[0], wh.location[1], phi, containerSize)
          );
          setWarehousePositions(positions);
        }
        
        const now = Date.now();
        
        // Add new order arc every 8-12 seconds (not overwhelming)
        if (now - lastArcTime > 8000 + Math.random() * 4000) {
          const warehouse = WAREHOUSES[Math.floor(Math.random() * WAREHOUSES.length)];
          const destination = DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];
          orderArcs.push({
            from: warehouse.location,
            to: destination,
            progress: 0,
            id: nextArcId++
          });
          lastArcTime = now;
          
          // Increment order count and notify parent
          orderCount++;
          if (onOrderCountChange) {
            onOrderCountChange(orderCount);
          }
        }
        
        // Update arc progress (animate from warehouse to customer)
        orderArcs = orderArcs
          .map(arc => ({ ...arc, progress: arc.progress + 0.01 })) // Slow, easy to digest
          .filter(arc => arc.progress <= 1);
        
        // Build markers: warehouses (persistent) + arc points (animated)
        const markers: Array<{ location: [number, number]; size: number }> = [
          // Persistent warehouse markers
          ...WAREHOUSES.map(wh => ({ location: wh.location, size: 0.03 })),
        ];
        
        // Add arc trail markers (multiple points along each arc)
        orderArcs.forEach(arc => {
          // Draw 10 points along the arc for smooth visualization
          for (let i = 0; i < 10; i++) {
            const pointProgress = arc.progress - (i * 0.05);
            if (pointProgress >= 0 && pointProgress <= 1) {
              const location = interpolateGreatCircle(arc.from, arc.to, pointProgress);
              const opacity = 1 - (i * 0.1); // Fade trail
              markers.push({
                location,
                size: 0.025 * opacity
              });
            }
          }
          
          // Destination marker (bright when arc reaches it)
          if (arc.progress >= 0.9) {
            markers.push({
              location: arc.to,
              size: 0.04 * (1 - (arc.progress - 0.9) * 10) // Pulse at destination
            });
          }
        });
        
        state.markers = markers;
        
        // Resize on window change
        state.width = width * 2;
        state.height = width * 2;
      }
    });

    return () => {
      globeRef.current?.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, [primaryColor, backgroundColor, onOrderCountChange]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          aspectRatio: '1',
        }}
      />
      
      {/* Warehouse hover tooltips */}
      {WAREHOUSES.map((warehouse, index) => {
        const pos = warehousePositions[index];
        if (!pos || !pos.visible) return null;
        
        return (
          <div
            key={index}
            className="absolute pointer-events-none transition-opacity duration-200"
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              transform: 'translate(-50%, -120%)',
              opacity: hoveredWarehouse === index ? 1 : 0,
            }}
          >
            <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-neutral-200">
              <div className="text-xs font-semibold text-[#1a1a1a] whitespace-nowrap">
                {warehouse.name}
              </div>
              <div className="text-[10px] text-neutral-600 whitespace-nowrap">
                {warehouse.city}
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Invisible hover zones over warehouse markers */}
      {WAREHOUSES.map((warehouse, index) => {
        const pos = warehousePositions[index];
        if (!pos || !pos.visible) return null;
        
        return (
          <div
            key={`hover-${index}`}
            className="absolute cursor-pointer"
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              transform: 'translate(-50%, -50%)',
              width: '24px',
              height: '24px',
            }}
            onMouseEnter={() => setHoveredWarehouse(index)}
            onMouseLeave={() => setHoveredWarehouse(null)}
          />
        );
      })}
    </div>
  );
}
