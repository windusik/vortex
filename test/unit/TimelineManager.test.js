import TimelineManager from '../../src/core/TimelineManager';
import VortexEngine from '../../src/core/VortexEngine';

describe('TimelineManager', () => {
  let elements = [];
  
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="el1"></div>
      <div id="el2"></div>
      <div id="el3"></div>
    `;
    elements = [
      document.getElementById('el1'),
      document.getElementById('el2'),
      document.getElementById('el3')
    ];
  });

  test('should create timeline with animations', () => {
    const anim1 = new VortexEngine({ targets: elements[0] });
    const anim2 = new VortexEngine({ targets: elements[1] });
    
    const timeline = new TimelineManager();
    timeline.add(anim1).add(anim2);
    
    expect(timeline.animations.length).toBe(2);
  });

  test('should play animations in sequence', async () => {
    const timeline = new TimelineManager();
    const results = [];
    
    timeline.add(
      new VortexEngine({
        targets: elements[0],
        properties: { opacity: [0, 1] },
        duration: 50,
        complete: () => results.push(1)
      })
    );
    
    timeline.add(
      new VortexEngine({
        targets: elements[1],
        properties: { opacity: [0, 1] },
        duration: 50,
        complete: () => results.push(2)
      }),
      '+=50'
    );
    
    await new Promise(r => setTimeout(r, 200));
    expect(results).toEqual([1, 2]);
  });

  test('should handle relative positioning', async () => {
    const timeline = new TimelineManager();
    const results = [];
    
    timeline.add(
      new VortexEngine({
        targets: elements[0],
        properties: { opacity: [0, 1] },
        duration: 50,
        complete: () => results.push(1)
      })
    );
    
    timeline.add(
      new VortexEngine({
        targets: elements[1],
        properties: { opacity: [0, 1] },
        duration: 50,
        complete: () => results.push(2)
      }),
      '+=20'
    );
    
    await new Promise(r => setTimeout(r, 150));
    expect(results[1] - results[0]).toBeGreaterThanOrEqual(20);
  });
});