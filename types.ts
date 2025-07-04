export interface Point {
  x: number;
  y: number;
}

export interface Particle extends Point {
  originX: number;
  originY: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
  // For smoke simulation
  life?: number;
  maxLife?: number;
  angle?: number;
  angleSpeed?: number;
}

export interface FabricConfig {
  id: string;
  name: string;
  particleCount: number;
  connectDistance: number;
  springStiffness: number;
  damping: number;
  repelStrength: number;
  particleColor: string | string[];
  lineColor: (opacity: number) => string;
  particleSize: { min: number; max: number };
  drawLines: boolean;
  particleArrangement: 'grid' | 'random';
}