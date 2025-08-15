import EasingFunctions from '../../src/core/EasingFunctions';

describe('EasingFunctions', () => {
  test('linear should return same value', () => {
    expect(EasingFunctions.linear(0.5)).toBe(0.5);
  });

  test('easeInQuad should accelerate', () => {
    expect(EasingFunctions.easeInQuad(0.5)).toBe(0.25);
    expect(EasingFunctions.easeInQuad(0.75)).toBeCloseTo(0.5625);
  });

  test('easeOutElastic should overshoot', () => {
    const val = EasingFunctions.easeOutElastic(0.5);
    expect(val).toBeGreaterThan(1);
  });

});