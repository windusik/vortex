/**
 * Управление SVG анимациями
 * @class SVGManager
 */
class SVGManager {
  constructor(svgElement) {
    this.svg = svgElement;
    this.paths = [];
    this._init();
  }

  _init() {
    // Находим все path в SVG
    this.paths = Array.from(this.svg.querySelectorAll('path'));
    
    // Сохраняем оригинальные данные path
    this.paths.forEach(path => {
      path.originalD = path.getAttribute('d');
    });
  }

  morphPath(index, newD, duration = 1000, easing = 'easeInOutQuad') {
    if (index < 0 || index >= this.paths.length) return;
    
    const path = this.paths[index];
    const startD = path.getAttribute('d');
    
    const animation = new VortexEngine({
      targets: { progress: 0 },
      properties: {
        progress: {
          value: 1,
          duration: duration,
          easing: easing
        }
      },
      update: () => {
        const d = this._interpolatePath(startD, newD, animation.targets.progress);
        path.setAttribute('d', d);
      }
    });
    
    return animation;
  }

  _interpolatePath(startD, endD, progress) {
    // Упрощенная интерполяция path
    // В реальной реализации нужно использовать более сложный алгоритм
    if (progress <= 0) return startD;
    if (progress >= 1) return endD;
    
    // Для демонстрации просто возвращаем один из path
    // В реальности нужно разбить path на точки и интерполировать
    return progress < 0.5 ? startD : endD;
  }

  drawPath(index, duration = 1000, easing = 'easeInOutQuad') {
    if (index < 0 || index >= this.paths.length) return;
    
    const path = this.paths[index];
    const length = path.getTotalLength();
    
    // Устанавливаем свойства stroke для анимации
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    
    const animation = new VortexEngine({
      targets: path.style,
      properties: {
        strokeDashoffset: {
          value: 0,
          duration: duration,
          easing: easing
        }
      }
    });
    
    return animation;
  }

  resetAll() {
    this.paths.forEach(path => {
      path.setAttribute('d', path.originalD);
      path.style.strokeDasharray = '';
      path.style.strokeDashoffset = '';
    });
  }
}

export default SVGManager;