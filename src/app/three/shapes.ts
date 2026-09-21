/**
 * Figuras que pueden formar las partículas. Cada generador rellena un
 * Float32Array con `count` posiciones (x, y, z) centradas en el origen y con
 * un radio aproximado de 2 unidades.
 *
 * Se usa un generador aleatorio con semilla para que cada figura sea siempre
 * idéntica entre visitas.
 */
export type ShapeName = 'planet' | 'knot' | 'dna' | 'cube' | 'network' | 'atom' | 'wave' | 'galaxy';

export const SHAPE_NAMES: readonly ShapeName[] = ['planet', 'knot', 'dna', 'cube', 'network', 'atom', 'wave', 'galaxy'];

type Random = () => number;
type Generator = (count: number, random: Random, out: Float32Array) => void;

export function generateShape(name: ShapeName, count: number): Float32Array {
  const out = new Float32Array(count * 3);
  GENERATORS[name](count, seededRandom(hashString(name)), out);
  return out;
}

// ---------------------------------------------------------------------------
// Generadores
// ---------------------------------------------------------------------------

/** Planeta con anillos inclinados (un guiño al proyecto del Sistema Solar). */
const planet: Generator = (count, random, out) => {
  const sphereCount = Math.floor(count * 0.62);
  for (let i = 0; i < count; i++) {
    if (i < sphereCount) {
      // Distribución de Fibonacci: puntos repartidos uniformemente sobre la esfera.
      const y = 1 - (i / (sphereCount - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = i * GOLDEN_ANGLE;
      const r = 1.45 + (random() - 0.5) * 0.05;
      set(out, i, Math.cos(theta) * radius * r, y * r, Math.sin(theta) * radius * r);
    } else {
      const r = 2.05 + Math.pow(random(), 0.8) * 1.25;
      const angle = random() * TAU;
      const [x, y, z] = rotateX(Math.cos(angle) * r, (random() - 0.5) * 0.05, Math.sin(angle) * r, 0.42);
      set(out, i, ...rotateZ(x, y, z, 0.28));
    }
  }
};

/** Nudo toroidal (2, 3). */
const knot: Generator = (count, random, out) => {
  for (let i = 0; i < count; i++) {
    const t = random() * TAU;
    const r = 2 + Math.cos(3 * t);
    const [ox, oy, oz] = randomInSphere(random, 0.26);
    set(out, i, r * Math.cos(2 * t) * 0.68 + ox, r * Math.sin(2 * t) * 0.68 + oy, -Math.sin(3 * t) * 0.68 + oz);
  }
};

/** Doble hélice de ADN con peldaños. */
const dna: Generator = (count, random, out) => {
  const rungs = 26;
  const strandCount = Math.floor(count * 0.78);
  for (let i = 0; i < count; i++) {
    let x: number, y: number, z: number;
    if (i < strandCount) {
      const s = random();
      const angle = s * TAU * 2.6 + (i % 2) * Math.PI;
      y = (s - 0.5) * 5.4;
      x = Math.cos(angle) * 1.05 + (random() - 0.5) * 0.12;
      z = Math.sin(angle) * 1.05 + (random() - 0.5) * 0.12;
    } else {
      const step = Math.floor(random() * rungs);
      const s = (step + 0.5) / rungs;
      const angle = s * TAU * 2.6;
      const u = random() * 2 - 1;
      y = (s - 0.5) * 5.4 + (random() - 0.5) * 0.04;
      x = Math.cos(angle) * 1.05 * u;
      z = Math.sin(angle) * 1.05 * u;
    }
    set(out, i, ...rotateZ(x, y, z, -0.55));
  }
};

/** Cubo de rejilla con nodos en las intersecciones. */
const cube: Generator = (count, random, out) => {
  const half = 1.35;
  const grid = [-half, -half / 3, half / 3, half];
  const lineCount = Math.floor(count * 0.72);
  for (let i = 0; i < count; i++) {
    const coords = [0, 0, 0];
    if (i < lineCount) {
      // Un punto sobre una línea de la rejilla que esté en la superficie del cubo.
      const axis = Math.floor(random() * 3);
      let a: number, b: number;
      do {
        a = grid[Math.floor(random() * 4)];
        b = grid[Math.floor(random() * 4)];
      } while (Math.abs(a) !== half && Math.abs(b) !== half);
      coords[axis] = (random() * 2 - 1) * half;
      coords[(axis + 1) % 3] = a;
      coords[(axis + 2) % 3] = b;
    } else {
      // Nodos brillantes en las esquinas y cruces de la superficie.
      let c: number[];
      do {
        c = [0, 1, 2].map(() => grid[Math.floor(random() * 4)]);
      } while (!c.some((v) => Math.abs(v) === half));
      const [ox, oy, oz] = randomInSphere(random, 0.07);
      coords[0] = c[0] + ox;
      coords[1] = c[1] + oy;
      coords[2] = c[2] + oz;
    }
    set(out, i, coords[0], coords[1], coords[2]);
  }
};

/** Red: icosaedro con aristas, nodos y conexiones al centro. */
const network: Generator = (count, random, out) => {
  const t = (1 + Math.sqrt(5)) / 2;
  const raw = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ];
  const vertices = raw.map((v) => {
    const length = Math.hypot(v[0], v[1], v[2]);
    return v.map((c) => (c / length) * 2);
  });
  const edges: [number, number][] = [];
  for (let a = 0; a < vertices.length; a++) {
    for (let b = a + 1; b < vertices.length; b++) {
      if (distance(vertices[a], vertices[b]) < 2.2) edges.push([a, b]);
    }
  }

  for (let i = 0; i < count; i++) {
    const kind = random();
    let p: number[];
    if (kind < 0.55) {
      const [a, b] = edges[Math.floor(random() * edges.length)];
      p = lerp3(vertices[a], vertices[b], random());
    } else if (kind < 0.72) {
      const v = vertices[Math.floor(random() * vertices.length)];
      const o = randomInSphere(random, 0.12);
      p = [v[0] + o[0], v[1] + o[1], v[2] + o[2]];
    } else if (kind < 0.86) {
      const v = vertices[Math.floor(random() * vertices.length)];
      p = lerp3([0, 0, 0], v, Math.pow(random(), 0.7));
    } else {
      const o = randomOnSphere(random);
      const r = 0.55 + random() * 0.1;
      p = [o[0] * r, o[1] * r, o[2] * r];
    }
    set(out, i, p[0], p[1], p[2]);
  }
};

/** Átomo: núcleo y tres órbitas con electrones. */
const atom: Generator = (count, random, out) => {
  const orbits = [0, Math.PI / 3, (2 * Math.PI) / 3];
  const nucleusCount = Math.floor(count * 0.16);
  for (let i = 0; i < count; i++) {
    if (i < nucleusCount) {
      set(out, i, ...randomInSphere(random, 0.42));
      continue;
    }
    const orbit = orbits[i % 3];
    const isElectron = random() < 0.08;
    const angle = isElectron ? orbit * 2 + 0.6 + (random() - 0.5) * 0.12 : random() * TAU;
    const tube = isElectron ? 0.13 : 0.035;
    const r = 2.05;
    const [ox, oy, oz] = randomInSphere(random, tube);
    // Círculo inclinado: visto de frente parece una elipse.
    const x = Math.cos(angle) * r + ox;
    const y = Math.sin(angle) * r * 0.38 + oy;
    const z = Math.sin(angle) * r * 0.92 + oz;
    set(out, i, ...rotateZ(x, y, z, orbit));
  }
};

/** Superficie ondulada, como una tela en movimiento. */
const wave: Generator = (count, random, out) => {
  const columns = Math.ceil(Math.sqrt(count * 1.7));
  const rows = Math.ceil(count / columns);
  for (let i = 0; i < count; i++) {
    const u = (i % columns) / (columns - 1) + (random() - 0.5) * 0.004;
    const v = Math.floor(i / columns) / Math.max(1, rows - 1);
    const x = (u - 0.5) * 7;
    const z = (v - 0.5) * 4.2;
    const y = Math.sin(x * 1.25) * 0.38 + Math.cos(z * 1.7 + x * 0.55) * 0.3;
    set(out, i, ...rotateX(x, y, z, 0.62));
  }
};

/** Galaxia espiral de tres brazos. */
const galaxy: Generator = (count, random, out) => {
  const arms = 3;
  for (let i = 0; i < count; i++) {
    const r = Math.pow(random(), 1.6) * 3.3;
    const arm = (i % arms) * (TAU / arms);
    const spin = r * 1.35;
    const spread = Math.pow(random(), 2.2) * (random() < 0.5 ? 1 : -1) * 0.45 * (1 - r / 4);
    const angle = arm + spin + spread;
    const y = gaussian(random) * 0.1 * (1.2 - r / 3.3);
    const [x, yy, z] = rotateX(Math.cos(angle) * r, y, Math.sin(angle) * r, 0.95);
    set(out, i, x, yy, z);
  }
};

const GENERATORS: Record<ShapeName, Generator> = { planet, knot, dna, cube, network, atom, wave, galaxy };

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

const TAU = Math.PI * 2;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function set(out: Float32Array, index: number, x: number, y: number, z: number): void {
  out[index * 3] = x;
  out[index * 3 + 1] = y;
  out[index * 3 + 2] = z;
}

function rotateX(x: number, y: number, z: number, angle: number): [number, number, number] {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [x, y * c - z * s, y * s + z * c];
}

function rotateZ(x: number, y: number, z: number, angle: number): [number, number, number] {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [x * c - y * s, x * s + y * c, z];
}

function randomOnSphere(random: Random): [number, number, number] {
  const u = random() * 2 - 1;
  const theta = random() * TAU;
  const r = Math.sqrt(1 - u * u);
  return [r * Math.cos(theta), u, r * Math.sin(theta)];
}

function randomInSphere(random: Random, radius: number): [number, number, number] {
  const [x, y, z] = randomOnSphere(random);
  const r = Math.cbrt(random()) * radius;
  return [x * r, y * r, z * r];
}

function gaussian(random: Random): number {
  return Math.sqrt(-2 * Math.log(random() || 1e-6)) * Math.cos(TAU * random());
}

function lerp3(a: number[], b: number[], t: number): number[] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function distance(a: number[], b: number[]): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

/** Mulberry32: generador pseudoaleatorio pequeño y rápido con semilla. */
function seededRandom(seed: number): Random {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(text: string): number {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  return hash >>> 0;
}
