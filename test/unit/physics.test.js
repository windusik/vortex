import Vortex from '../../src/vortex';

describe('Physics Integration', () => {
  let element;
  
  beforeEach(() => {
    document.body.innerHTML = '<div id="ball"></div>';
    element = document.getElementById('ball');
  });

  test('should apply physics to element', async () => {
    const physics = Vortex.physics();
    const ball = physics.addParticle(50, 50, 5);
    
    let lastY = 50;
    let hasBounced = false;
    
    Vortex.animate({
      update: () => {
        element.style.transform = `translate(${ball.x}px, ${ball.y}px)`;
        
        if (ball.y > lastY) hasBounced = true;
        lastY = ball.y;
        
        physics.constrainToBounds(ball, 0, 0, 300, 300, 0.7);
      }
    });
    
    ball.velocity.y = -10;
    
    await new Promise(r => setTimeout(r, 500));
    expect(hasBounced).toBe(true);
  });
});