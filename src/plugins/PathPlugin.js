/**
 * Плагин для движения по пути
 * @class PathPlugin
 */
class PathPlugin {
  constructor(vortex) {
    this.vortex = vortex;
    this.name = 'path';
    this._init();
  }

  _init() {
    this.vortex.registerPlugin(this);
  }

  moveAlongPath(element, path, options = {}) {
    const duration = options.duration || 1000;
    const easing = options.easing || 'linear';
    const rotate = options.rotate || false;
    
    const points = this._parsePath(path);
    const totalLength = this._calculatePathLength(points);
    
    return new this.vortex({
      targets: element,
      properties: {
        pathProgress: {
          value: 1,
          duration: duration,
          easing: easing
        }
      },
      update: anim => {
        const progress = anim.targets.pathProgress;
        const { point, angle } = this._getPointOnPath(points, totalLength, progress);
        
        element.style.transform = `
          translate(${point.x}px, ${point.y}px)
          ${rotate ? `rotate(${angle}deg)` : ''}
        `;
      }
    });
  }

  _parsePath(path) {
    if (typeof path === 'string') {
      // Парсим SVG path string
      return this._parseSvgPath(path);
    } else if (Array.isArray(path)) {
      // Уже массив точек
      return path;
    } else if (path instanceof SVGPathElement) {
      // Получаем точки из SVG элемента
      const pathLength = path.getTotalLength();
      const points = [];
      
      for (let i = 0; i <= 100; i++) {
        const point = path.getPointAtLength(pathLength * i / 100);
        points.push({ x: point.x, y: point.y });
      }
      
      return points;
    }
    
    return [];
  }

  _parseSvgPath(pathString) {
    // Упрощенный парсер SVG path
    const points = [];
    const commands = pathString.match(/[a-df-z][^a-df-z]*/gi);
    
    let currentX = 0;
    let currentY = 0;
    
    commands.forEach(cmd => {
      const type = cmd[0];
      const args = cmd.substring(1).trim().split(/[\s,]+/).map(parseFloat);
      
      switch (type.toLowerCase()) {
        case 'm': // moveTo
          currentX = args[0];
          currentY = args[1];
          points.push({ x: currentX, y: currentY });
          break;
          
        case 'l': // lineTo
          currentX += args[0];
          currentY += args[1];
          points.push({ x: currentX, y: currentY });
          break;
          
        case 'c': // cubic bezier
          // Упрощенная реализация - добавляем только конечную точку
          currentX = args[4];
          currentY = args[5];
          points.push({ x: currentX, y: currentY });
          break;
          
        // Другие команды можно добавить по аналогии
      }
    });
    
    return points;
  }

  _calculatePathLength(points) {
    let length = 0;
    
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i-1].x;
      const dy = points[i].y - points[i-1].y;
      length += Math.sqrt(dx * dx + dy * dy);
    }
    
    return length;
  }

  _getPointOnPath(points, totalLength, progress) {
    if (progress <= 0) return { point: points[0], angle: 0 };
    if (progress >= 1) return { point: points[points.length-1], angle: 0 };
    
    const targetLength = totalLength * progress;
    let accumulatedLength = 0;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i-1];
      const current = points[i];
      
      const dx = current.x - prev.x;
      const dy = current.y - prev.y;
      const segmentLength = Math.sqrt(dx * dx + dy * dy);
      
      if (accumulatedLength + segmentLength >= targetLength) {
        const segmentProgress = (targetLength - accumulatedLength) / segmentLength;
        const x = prev.x + dx * segmentProgress;
        const y = prev.y + dy * segmentProgress;
        
        // Вычисляем угол наклона
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        return { 
          point: { x, y },
          angle
        };
      }
      
      accumulatedLength += segmentLength;
    }
    
    return { point: points[points.length-1], angle: 0 };
  }
}

export default PathPlugin;