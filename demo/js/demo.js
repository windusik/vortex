document.addEventListener('DOMContentLoaded', () => {
  // Базовые анимации
  const fadeBox = document.getElementById('fade-box');
  const moveBox = document.getElementById('move-box');
  const scaleBox = document.getElementById('scale-box');
  
  vortex.animate({
    targets: fadeBox,
    properties: {
      opacity: [0, 1],
      rotate: '360deg'
    },
    duration: 2000,
    loop: true,
    direction: 'alternate',
    easing: 'easeInOutSine'
  });
  
  vortex.animate({
    targets: moveBox,
    properties: {
      x: 300,
      backgroundColor: '#e74c3c'
    },
    duration: 1500,
    loop: true,
    direction: 'alternate',
    easing: 'easeOutBack'
  });
  
  vortex.animate({
    targets: scaleBox,
    properties: {
      scale: [1, 1.5],
      borderRadius: ['8px', '50%']
    },
    duration: 1000,
    loop: true,
    direction: 'alternate'
  });
  
  // Временные линии
  const timelineButton = document.getElementById('timeline-button');
  const timelineBox1 = document.getElementById('timeline-box1');
  const timelineBox2 = document.getElementById('timeline-box2');
  const timelineBox3 = document.getElementById('timeline-box3');
  
  const timeline = vortex.timeline({ autoplay: false });
  
  timeline.add(
    vortex.animate({
      targets: timelineBox1,
      properties: {
        x: 300,
        backgroundColor: '#9b59b6'
      },
      duration: 1000,
      easing: 'easeOutQuad'
    })
  );
  
  timeline.add(
    vortex.animate({
      targets: timelineBox2,
      properties: {
        y: 100,
        backgroundColor: '#2ecc71'
      },
      duration: 800
    }),
    '-=500' // Начинается за 500ms до окончания предыдущей анимации
  );
  
  timeline.add(
    vortex.animate({
      targets: timelineBox3,
      properties: {
        x: 300,
        y: 100,
        scale: 1.5,
        backgroundColor: '#e67e22'
      },
      duration: 1200,
      easing: 'easeInOutBack'
    }),
    '+=200' // Начинается через 200ms после окончания предыдущей анимации
  );
  
  timelineButton.addEventListener('click', () => {
    timeline.restart();
  });
  
  // Физические анимации
  const physicsButton = document.getElementById('physics-button');
  const physicsBall = document.getElementById('physics-ball');
  
  const physics = vortex.physics();
  const ball = physics.addParticle(30, 30, 5);
  
  physicsButton.addEventListener('click', () => {
    ball.y = 30;
    ball.x = 30;
    ball.velocity.x = Math.random() * 5;
    ball.velocity.y = -10;
  });
  
  vortex.animate({
    update: () => {
      physicsBall.style.transform = `translate(${ball.x}px, ${ball.y}px)`;
      physics.constrainToBounds(ball, 0, 0, 300, 300, 0.7);
    }
  });
  
  // SVG анимации
  const svgMorphButton = document.getElementById('svg-morph-button');
  const svgDrawButton = document.getElementById('svg-draw-button');
  const svgPath = document.querySelector('.svg-demo path');
  
  const svg = vortex.svg(document.querySelector('svg'));
  
  svgMorphButton.addEventListener('click', () => {
    svg.morphPath(0, 'M20 50 Q50 10 80 50 T140 50');
  });
  
  svgDrawButton.addEventListener('click', () => {
    svg.drawPath(0, 1000, 'easeInOutQuad');
  });
  
  // Анимация текста
  const typewriterButton = document.getElementById('typewriter-button');
  const scrambleButton = document.getElementById('scramble-button');
  const typewriterText = document.getElementById('typewriter-text');
  const scrambleText = document.getElementById('scramble-text');
  
  typewriterButton.addEventListener('click', () => {
    vortex.plugin.text.typewriter(typewriterText, {
      speed: 30,
      cursor: '|'
    });
  });
  
  scrambleButton.addEventListener('click', () => {
    vortex.plugin.text.scramble(scrambleText, {
      speed: 30,
      iterations: 10
    });
  });
  
  // Частицы в герое
  const heroParticles = document.querySelector('.hero-particles');
  const canvas = document.createElement('canvas');
  heroParticles.appendChild(canvas);
  
  canvas.width = heroParticles.offsetWidth;
  canvas.height = heroParticles.offsetHeight;
  
  const ctx = canvas.getContext('2d');
  const particles = vortex.particles({
    maxParticles: 100,
    gravity: { x: 0, y: 0.05 }
  });
  
  // Добавляем эмиттер частиц
  particles.addEmitter({
    x: canvas.width / 2,
    y: canvas.height,
    rate: 5,
    emit: () => ({
      x: Math.random() * canvas.width,
      y: canvas.height,
      vx: Math.random() * 2 - 1,
      vy: -2 - Math.random() * 3,
      life: 5 + Math.random() * 5,
      size: 2 + Math.random() * 3,
      color: `hsl(${Math.random() * 60 + 200}, 80%, 60%)`
    })
  });
  
  // Анимация частиц
  vortex.animate({
    update: (delta) => {
      particles.update(delta / 1000);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.render(ctx);
    }
  });
});