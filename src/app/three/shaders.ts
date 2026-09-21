/**
 * Shaders de las partículas.
 *
 * Cada partícula guarda su posición de origen (`aFrom`) y de destino (`aTo`);
 * `uMorph` (0 → 1) interpola entre ambas con un pequeño desfase aleatorio por
 * partícula para que la transformación parezca orgánica. Además el shader
 * aplica: ondulación suave, repulsión del puntero y ondas expansivas al hacer clic.
 */
export const PARTICLE_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uWobble;
  uniform vec3 uPointer;
  uniform float uPointerStrength;
  uniform vec3 uPulseOrigin;
  uniform float uPulseTime;

  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aRandom;

  varying float vRandom;
  varying float vGradient;
  varying float vGlow;

  // Debe coincidir con morphProgress() en particle-engine.ts.
  float morphProgress(float morph, float random) {
    return smoothstep(0.0, 1.0, clamp((morph - random * 0.35) / 0.65, 0.0, 1.0));
  }

  void main() {
    float progress = morphProgress(uMorph, aRandom);
    vec3 pos = mix(aFrom, aTo, progress);

    // Durante la transición las partículas se dispersan un poco y vuelven.
    vec3 scatter = normalize(vec3(sin(aRandom * 91.7), cos(aRandom * 47.3), sin(aRandom * 13.1 + 1.3)) + 0.0001);
    pos += scatter * sin(progress * 3.14159) * (0.35 + aRandom * 0.9);

    // Ondulación constante, distinta para cada partícula.
    float t = uTime * 0.7 + aRandom * 6.2831;
    pos += uWobble * 0.045 * vec3(sin(t + pos.y * 1.3), cos(t * 1.13 + pos.x * 1.1), sin(t * 0.87 + pos.z));

    // Repulsión alrededor del puntero.
    vec3 away = pos - uPointer;
    float pointerDistance = length(away);
    float push = (1.0 - smoothstep(0.0, 1.35, pointerDistance)) * uPointerStrength;
    pos += normalize(away + 0.0001) * push * 0.75;

    // Onda expansiva al hacer clic.
    vGlow = push * 0.6;
    if (uPulseTime >= 0.0) {
      vec3 fromPulse = pos - uPulseOrigin;
      float ring = exp(-pow((length(fromPulse) - uPulseTime * 4.2) * 2.4, 2.0)) * exp(-uPulseTime * 1.4);
      pos += normalize(fromPulse + 0.0001) * ring * 0.85;
      vGlow += ring * 1.4;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * (0.55 + aRandom * 0.9) * uPixelRatio * (1.0 / -mvPosition.z) * (1.0 + vGlow * 0.6);

    vRandom = aRandom;
    vGradient = clamp(pos.y * 0.2 + 0.5 + (aRandom - 0.5) * 0.25, 0.0, 1.0);
  }
`;

export const PARTICLE_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uOpacity;

  varying float vRandom;
  varying float vGradient;
  varying float vGlow;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = pow(smoothstep(0.5, 0.0, d), 1.5);

    vec3 color = vGradient < 0.5
      ? mix(uColorA, uColorB, vGradient * 2.0)
      : mix(uColorB, uColorC, (vGradient - 0.5) * 2.0);
    color = mix(color, vec3(1.0), clamp(vGlow * 0.5, 0.0, 0.6));

    gl_FragColor = vec4(color, alpha * uOpacity * (0.5 + vRandom * 0.5));
  }
`;
