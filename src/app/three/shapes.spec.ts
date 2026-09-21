import { SHAPE_NAMES, generateShape } from './shapes';

describe('shapes', () => {
  const COUNT = 2000;

  for (const name of SHAPE_NAMES) {
    it(`"${name}" genera posiciones válidas y dentro de la escena`, () => {
      const positions = generateShape(name, COUNT);
      expect(positions.length).toBe(COUNT * 3);
      for (const value of positions) {
        expect(Number.isFinite(value)).toBeTrue();
        expect(Math.abs(value)).toBeLessThan(6);
      }
    });
  }

  it('genera siempre la misma figura (semilla fija)', () => {
    expect(generateShape('knot', 100)).toEqual(generateShape('knot', 100));
  });
});
