# VortexJS API Documentation

## Core Classes

### `VortexEngine`
Основной класс для создания анимаций.

```javascript
const animation = new VortexEngine({
  targets: '.element',
  properties: {
    opacity: [0, 1],
    translateX: '100px'
  },
  duration: 1000,
  easing: 'easeOutQuad'
});
```

### `TimelineManager`
Управление сложными временными линиями.

```javascript
const timeline = new TimelineManager();
timeline.add(animation1)
       .add(animation2, '+=500') // через 500ms после окончания animation1
       .add(animation3, '<') // одновременно с animation2
```

## Plugins

### MorphPlugin
Морфинг SVG и DOM элементов.

```javascript
vortex.plugin.morph.morph(element, targetElement, {
  duration: 1000,
  easing: 'easeInOutQuad'
});
```

### TextPlugin
Анимация текста.

```javascript
vortex.plugin.text.typewriter(element, {
  speed: 50,
  cursor: '|'
});
```

## Utils

### ColorUtils
Работа с цветами.

```javascript
const gradient = ColorUtils.interpolateColor('#ff0000', '#0000ff', 0.5);
```

### DOMUtils
Утилиты для работы с DOM.

```javascript
const offset = DOMUtils.getOffset(element);
```

## Getting Started

1. Установка через npm:
```bash
npm install vortexjs
```

2. Подключение в проекте:
```javascript
import vortex from 'vortexjs';

vortex.animate({
  targets: '.box',
  properties: {
    rotate: '360deg'
  },
  duration: 2000,
  loop: true
});
```