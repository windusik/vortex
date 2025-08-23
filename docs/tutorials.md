# VortexJS Tutorials

## Basic Animation

```javascript
// Простая анимация прозрачности
vortex.animate({
  targets: '.fade-in',
  properties: {
    opacity: [0, 1]
  },
  duration: 1000
});
```

## Timeline Animation

```javascript
// Создание последовательности анимаций
const timeline = vortex.timeline();

timeline.add(
  vortex.animate({
    targets: '.first',
    properties: { x: 100 }
  })
);

timeline.add(
  vortex.animate({
    targets: '.second',
    properties: { y: 100 }
  }),
  '+=500' // Задержка 500ms
);
```

## SVG Morphing

```javascript
// Морфинг SVG path
const svg = vortex.svg(document.querySelector('svg'));
svg.morphPath(0, 'M10 10 L90 10 L90 90 L10 90 Z');
```

## Physics Animation

```javascript
// Физическая анимация с отскоками
const physics = vortex.physics();
const particle = physics.addParticle(50, 50);

vortex.animate({
  update: () => {
    element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
  }
});
```

## WebGL Integration

```javascript
// Создание WebGL сцены
const canvas = document.querySelector('canvas');
const webgl = vortex.webgl(canvas);

webgl.animate(() => {
  // Обновление сцены
});
```