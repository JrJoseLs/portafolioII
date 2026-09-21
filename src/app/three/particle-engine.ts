import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  NormalBlending,
  PerspectiveCamera,
  Plane,
  Points,
  PointsMaterial,
  Raycaster,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

import { PARTICLE_FRAGMENT_SHADER, PARTICLE_VERTEX_SHADER } from './shaders';
import { ShapeName, generateShape } from './shapes';

/** Posición, tamaño y opacidad de la figura en pantalla (se anima suavemente). */
export interface SceneLayout {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly opacity: number;
}

export interface ParticleEngineOptions {
  readonly dark: boolean;
  readonly reducedMotion: boolean;
  readonly shape: ShapeName;
  readonly layout: SceneLayout;
  /** Se llama si se pierde el contexto WebGL (p. ej. por falta de memoria de la GPU). */
  readonly onContextLost?: () => void;
}

const PALETTES = {
  dark: { particles: ['#2997ff', '#7d7aff', '#ff4f9a'], stars: '#ffffff', starOpacity: 0.55 },
  light: { particles: ['#0071e3', '#5e5ce6', '#ff375f'], stars: '#1d1d1f', starOpacity: 0.18 },
} as const;

const MORPH_SECONDS = 1.9;
const PULSE_SECONDS = 3;
const CAMERA_Z = 9;
/** Elementos sobre los que un clic NO debe generar una onda. */
const INTERACTIVE = 'a, button, input, textarea, select, label, summary, dialog, [role="button"], [role="tab"], .card';

/**
 * Motor de la escena de partículas. Es una clase de TypeScript sin
 * dependencias de Angular, y se carga de forma diferida (junto con Three.js)
 * para no retrasar la carga inicial de la página.
 */
export class ParticleEngine {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(45, 1, 0.1, 100);
  private readonly geometry = new BufferGeometry();
  private readonly material: ShaderMaterial;
  private readonly points: Points;
  private readonly stars: Points<BufferGeometry, PointsMaterial>;

  private readonly count: number;
  private readonly from: Float32Array;
  private readonly to: Float32Array;
  private readonly randoms: Float32Array;
  private readonly shapes = new Map<ShapeName, Float32Array>();
  private shape: ShapeName;
  private morph = 1;

  private layout: SceneLayout;
  private readonly current = { x: 0, y: 0, scale: 1, opacity: 0 };
  private responsiveScale = 1;

  private readonly pointer = new Vector2(0, 0);
  private pointerActive = false;
  private pointerStrength = 0;
  private readonly raycaster = new Raycaster();
  private readonly plane = new Plane(new Vector3(0, 0, 1), 0);
  private readonly hit = new Vector3();

  private spin = 0;
  private spinVelocity = 0;
  private dragTiltX = 0;
  private dragging = false;
  private lastDragX = 0;
  private lastDragY = 0;
  private cameraZ = CAMERA_Z;

  private pulseTime = -1;
  private time = 0;
  private lastFrame = 0;
  private frame = 0;
  private running = false;

  private dark: boolean;
  private reducedMotion: boolean;
  private exploring = false;

  private readonly events = new AbortController();

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly options: ParticleEngineOptions,
  ) {
    this.dark = options.dark;
    this.reducedMotion = options.reducedMotion;
    this.shape = options.shape;
    this.layout = options.layout;

    const small = window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4;
    this.count = small ? 9000 : 18000;

    this.renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2));
    this.renderer.setClearColor(0x000000, 0);
    this.camera.position.set(0, 0, CAMERA_Z);

    // Geometría: posición de origen, de destino y un valor aleatorio por partícula.
    this.from = new Float32Array(this.getShape(this.shape));
    this.to = new Float32Array(this.from);
    this.randoms = new Float32Array(this.count);
    for (let i = 0; i < this.count; i++) this.randoms[i] = Math.random();
    this.geometry.setAttribute('position', new BufferAttribute(new Float32Array(this.count * 3), 3));
    this.geometry.setAttribute('aFrom', new BufferAttribute(this.from, 3));
    this.geometry.setAttribute('aTo', new BufferAttribute(this.to, 3));
    this.geometry.setAttribute('aRandom', new BufferAttribute(this.randoms, 1));

    this.material = new ShaderMaterial({
      vertexShader: PARTICLE_VERTEX_SHADER,
      fragmentShader: PARTICLE_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 1 },
        uSize: { value: 30 },
        uPixelRatio: { value: this.renderer.getPixelRatio() },
        uWobble: { value: 1 },
        uPointer: { value: new Vector3(99, 99, 99) },
        uPointerStrength: { value: 0 },
        uPulseOrigin: { value: new Vector3() },
        uPulseTime: { value: -1 },
        uColorA: { value: new Color() },
        uColorB: { value: new Color() },
        uColorC: { value: new Color() },
        uOpacity: { value: 0 },
      },
    });
    this.points = new Points(this.geometry, this.material);
    // Los vértices se mueven en el shader: el recorte por frustum de Three.js no aplica.
    this.points.frustumCulled = false;
    this.scene.add(this.points);

    this.stars = this.createStars(small ? 700 : 1400);
    this.scene.add(this.stars);

    this.setTheme(this.dark);
    this.setReducedMotion(this.reducedMotion);
    this.resize();
    this.listen();
    this.start();
  }

  // -------------------------------------------------------------------------
  // API pública
  // -------------------------------------------------------------------------

  /** Transforma las partículas en otra figura. */
  setShape(shape: ShapeName): void {
    if (shape === this.shape) return;

    // La nueva transición parte de donde está cada partícula ahora mismo.
    for (let i = 0; i < this.count; i++) {
      const p = morphProgress(this.morph, this.randoms[i]);
      for (let axis = 0; axis < 3; axis++) {
        const index = i * 3 + axis;
        this.from[index] += (this.to[index] - this.from[index]) * p;
      }
    }
    this.to.set(this.getShape(shape));
    this.geometry.getAttribute('aFrom').needsUpdate = true;
    this.geometry.getAttribute('aTo').needsUpdate = true;

    this.shape = shape;
    this.morph = this.reducedMotion ? 1 : 0;
    this.material.uniforms['uMorph'].value = this.morph;
  }

  setLayout(layout: SceneLayout): void {
    this.layout = layout;
  }

  setTheme(dark: boolean): void {
    this.dark = dark;
    const palette = dark ? PALETTES.dark : PALETTES.light;
    const uniforms = this.material.uniforms;
    uniforms['uColorA'].value.set(palette.particles[0]);
    uniforms['uColorB'].value.set(palette.particles[1]);
    uniforms['uColorC'].value.set(palette.particles[2]);
    // En fondo oscuro la mezcla aditiva hace que las partículas brillen; en claro se vería lavada.
    this.material.blending = dark ? AdditiveBlending : NormalBlending;
    this.material.needsUpdate = true;
    this.stars.material.color.set(palette.stars);
    this.stars.material.opacity = palette.starOpacity;
  }

  setReducedMotion(reduced: boolean): void {
    this.reducedMotion = reduced;
    this.material.uniforms['uWobble'].value = reduced ? 0 : 1;
    if (reduced) this.morph = 1;
  }

  setExplore(exploring: boolean): void {
    this.exploring = exploring;
    if (!exploring) {
      this.dragging = false;
      this.cameraZ = CAMERA_Z;
    }
  }

  dispose(): void {
    this.running = false;
    cancelAnimationFrame(this.frame);
    this.events.abort();
    this.geometry.dispose();
    this.material.dispose();
    this.stars.geometry.dispose();
    this.stars.material.dispose();
    this.renderer.dispose();
  }

  // -------------------------------------------------------------------------
  // Bucle de animación
  // -------------------------------------------------------------------------

  private start(): void {
    if (this.running) return;
    this.running = true;
    this.lastFrame = performance.now();
    this.frame = requestAnimationFrame(this.tick);
  }

  private stop(): void {
    this.running = false;
    cancelAnimationFrame(this.frame);
  }

  private readonly tick = (now: number): void => {
    if (!this.running) return;
    this.frame = requestAnimationFrame(this.tick);

    const dt = Math.min((now - this.lastFrame) / 1000, 0.05);
    this.lastFrame = now;
    this.time += dt;
    const uniforms = this.material.uniforms;
    const ease = 1 - Math.exp(-dt * 3);

    uniforms['uTime'].value = this.time;

    if (this.morph < 1) {
      this.morph = Math.min(1, this.morph + dt / MORPH_SECONDS);
      uniforms['uMorph'].value = this.morph;
    }

    // Posición y opacidad de la figura según la sección activa.
    this.current.x += (this.layout.x - this.current.x) * ease;
    this.current.y += (this.layout.y - this.current.y) * ease;
    this.current.scale += (this.layout.scale - this.current.scale) * ease;
    this.current.opacity += (this.layout.opacity - this.current.opacity) * ease;
    this.points.position.set(this.current.x, this.current.y, 0);
    this.points.scale.setScalar(this.current.scale * this.responsiveScale);
    uniforms['uOpacity'].value = this.current.opacity * (this.dark ? 0.9 : 0.85);

    // Rotación: giro automático + inercia del arrastre + inclinación hacia el puntero.
    if (!this.reducedMotion) this.spin += dt * 0.08;
    this.spin += this.spinVelocity;
    this.spinVelocity *= 0.94;
    const followPointer = this.pointerActive && !this.dragging && !this.reducedMotion;
    const tiltX = (followPointer ? -this.pointer.y * 0.18 : 0) + this.dragTiltX;
    const tiltY = followPointer ? this.pointer.x * 0.28 : 0;
    this.points.rotation.x += (tiltX - this.points.rotation.x) * ease;
    this.points.rotation.y = this.spin + tiltY;

    // Punto del puntero en coordenadas locales de la figura, para la repulsión.
    this.raycaster.setFromCamera(this.pointer, this.camera);
    this.plane.constant = -this.points.position.z;
    if (this.raycaster.ray.intersectPlane(this.plane, this.hit)) {
      this.points.updateMatrixWorld();
      uniforms['uPointer'].value.copy(this.points.worldToLocal(this.hit));
    }
    const targetStrength = this.pointerActive && !this.dragging ? 1 : 0;
    this.pointerStrength += (targetStrength - this.pointerStrength) * ease;
    uniforms['uPointerStrength'].value = this.pointerStrength;

    if (this.pulseTime >= 0) {
      this.pulseTime += dt;
      if (this.pulseTime > PULSE_SECONDS) this.pulseTime = -1;
      uniforms['uPulseTime'].value = this.pulseTime;
    }

    this.camera.position.z += (this.cameraZ - this.camera.position.z) * ease;
    if (!this.reducedMotion) this.stars.rotation.y += dt * 0.006;
    this.stars.position.y = window.scrollY * 0.0008;

    this.renderer.render(this.scene, this.camera);
  };

  // -------------------------------------------------------------------------
  // Eventos
  // -------------------------------------------------------------------------

  private listen(): void {
    const signal = this.events.signal;

    window.addEventListener('resize', () => this.resize(), { signal });
    document.addEventListener('visibilitychange', () => (document.hidden ? this.stop() : this.start()), { signal });

    window.addEventListener(
      'pointermove',
      (event) => {
        this.pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
        this.pointerActive = true;
        if (this.dragging) {
          this.spinVelocity += (event.clientX - this.lastDragX) * 0.0009;
          this.dragTiltX = clamp(this.dragTiltX + (event.clientY - this.lastDragY) * 0.004, -1, 1);
          this.lastDragX = event.clientX;
          this.lastDragY = event.clientY;
        }
      },
      { signal, passive: true },
    );

    window.addEventListener(
      'pointerdown',
      (event) => {
        if (event.button !== 0 || (event.target as Element | null)?.closest?.(INTERACTIVE)) return;
        this.pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
        this.pulse();
        if (this.exploring) {
          this.dragging = true;
          this.lastDragX = event.clientX;
          this.lastDragY = event.clientY;
        }
      },
      { signal, passive: true },
    );

    const release = (event: PointerEvent) => {
      this.dragging = false;
      if (event.pointerType !== 'mouse') this.pointerActive = false;
    };
    window.addEventListener('pointerup', release, { signal, passive: true });
    window.addEventListener('pointercancel', release, { signal, passive: true });
    document.documentElement.addEventListener('pointerleave', () => (this.pointerActive = false), { signal });

    window.addEventListener(
      'wheel',
      (event) => {
        if (!this.exploring) return;
        event.preventDefault();
        this.cameraZ = clamp(this.cameraZ + event.deltaY * 0.006, 5, 16);
      },
      { signal, passive: false },
    );

    this.canvas.addEventListener(
      'webglcontextlost',
      (event) => {
        event.preventDefault();
        this.stop();
        this.options.onContextLost?.();
      },
      { signal },
    );
  }

  /** Lanza una onda expansiva desde el punto donde está el puntero. */
  private pulse(): void {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    if (!this.raycaster.ray.intersectPlane(this.plane, this.hit)) return;
    this.points.updateMatrixWorld();
    this.material.uniforms['uPulseOrigin'].value.copy(this.points.worldToLocal(this.hit));
    this.pulseTime = 0;
  }

  private resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    // En pantallas estrechas (móvil en vertical) la figura se reduce para caber.
    this.responsiveScale = clamp(this.camera.aspect / 1.2, 0.6, 1);
    this.material.uniforms['uPixelRatio'].value = this.renderer.getPixelRatio();
  }

  // -------------------------------------------------------------------------
  // Utilidades
  // -------------------------------------------------------------------------

  private getShape(shape: ShapeName): Float32Array {
    let positions = this.shapes.get(shape);
    if (!positions) {
      positions = generateShape(shape, this.count);
      this.shapes.set(shape, positions);
    }
    return positions;
  }

  /** Campo de estrellas lejano que da profundidad a la escena. */
  private createStars(count: number): Points<BufferGeometry, PointsMaterial> {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 18 + Math.random() * 22;
      const u = Math.random() * 2 - 1;
      const theta = Math.random() * Math.PI * 2;
      const r = Math.sqrt(1 - u * u);
      positions.set([r * Math.cos(theta) * radius, u * radius, r * Math.sin(theta) * radius - 10], i * 3);
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    const material = new PointsMaterial({ size: 0.09, sizeAttenuation: true, transparent: true, depthWrite: false });
    const stars = new Points(geometry, material);
    stars.frustumCulled = false;
    return stars;
  }
}

/** Progreso de la transición de una partícula. Debe coincidir con el shader. */
function morphProgress(morph: number, random: number): number {
  const t = clamp((morph - random * 0.35) / 0.65, 0, 1);
  return t * t * (3 - 2 * t);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
