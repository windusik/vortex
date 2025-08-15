import VortexEngine from '../../src/core/VortexEngine';

describe('VortexEngine Core', () => {
  let element;
  
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="test1" style="width: 100px; height: 100px;"></div>
      <div id="test2" style="width: 50px; height: 50px;"></div>
      <div class="group" style="opacity: 0.5;"></div>
      <div class="group" style="opacity: 0.5;"></div>
    `;
    element = document.getElementById('test1');
  });

  test('should initialize with default values', () => {
    const anim = new VortexEngine({ targets: element });
    expect(anim.duration).toBe(0);
    expect(anim.isPlaying).toBe(false);
  });

  test('should animate single property', async () => {
    const anim = new VortexEngine({
      targets: element,
      properties: { opacity: [0, 1] },
      duration: 100
    });
    
    await new Promise(r => setTimeout(r, 150));
    expect(element.style.opacity).toBe('1');
  });

  test('should handle multiple targets', async () => {
    const anim = new VortexEngine({
      targets: '.group',
      properties: { opacity: [0, 1] },
      duration: 100
    });
    
    await new Promise(r => setTimeout(r, 150));
    const groups = document.querySelectorAll('.group');
    groups.forEach(el => {
      expect(el.style.opacity).toBe('1');
    });
  });

  test('should apply easing functions', async () => {
    const anim = new VortexEngine({
      targets: element,
      properties: { translateX: '100px' },
      duration: 100,
      easing: 'easeInOutQuad'
    });
    
    await new Promise(r => setTimeout(r, 50));
    expect(element.style.transform).toContain('translateX');
  });

  test('should handle color animation', async () => {
    const anim = new VortexEngine({
      targets: element,
      properties: { backgroundColor: ['#000000', '#ffffff'] },
      duration: 100
    });
    
    await new Promise(r => setTimeout(r, 150));
    expect(element.style.backgroundColor).toBe('rgb(255, 255, 255)');
  });

  test('should handle transform properties', async () => {
    const anim = new VortexEngine({
      targets: element,
      properties: { 
        rotate: '360deg',
        scale: 2
      },
      duration: 100
    });
    
    await new Promise(r => setTimeout(r, 150));
    expect(element.style.transform).toContain('rotate(360deg)');
    expect(element.style.transform).toContain('scale(2)');
  });

  test('should handle delays', async () => {
    const start = Date.now();
    let endTime;
    
    const anim = new VortexEngine({
      targets: element,
      properties: { opacity: [0, 1] },
      duration: 100,
      delay: 100,
      complete: () => { endTime = Date.now(); }
    });
    
    await new Promise(r => setTimeout(r, 250));
    expect(endTime - start).toBeGreaterThanOrEqual(200);
  });

  test('should handle looping', async () => {
    let count = 0;
    
    const anim = new VortexEngine({
      targets: element,
      properties: { opacity: [0, 1] },
      duration: 50,
      loop: true,
      update: () => { count++; }
    });
    
    await new Promise(r => setTimeout(r, 160));
    expect(count).toBeGreaterThan(2);
  });

  test('should handle direction alternate', async () => {
    const anim = new VortexEngine({
      targets: element,
      properties: { opacity: [0, 1] },
      duration: 50,
      loop: true,
      direction: 'alternate'
    });
    
    await new Promise(r => setTimeout(r, 160));
    expect(element.style.opacity).not.toBe('1');
  });
});