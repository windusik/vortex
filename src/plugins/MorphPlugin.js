/**
 * Плагин для морфинга SVG и DOM элементов
 * @class MorphPlugin
 */
class MorphPlugin {
  constructor(vortex) {
    this.vortex = vortex;
    this.name = 'morph';
    this._init();
  }

  _init() {
    this.vortex.registerPlugin(this);
  }

  morph(element, target, options = {}) {
    const duration = options.duration || 1000;
    const easing = options.easing || 'easeInOutQuad';
    
    if (element instanceof SVGElement && target instanceof SVGElement) {
      return this._morphSVG(element, target, duration, easing);
    } else {
      return this._morphDOM(element, target, duration, easing);
    }
  }

  _morphSVG(element, target, duration, easing) {
    if (element.tagName !== 'path' || target.tagName !== 'path') {
      console.warn('MorphPlugin: Only path elements are supported for SVG morphing');
      return;
    }
    
    const startD = element.getAttribute('d');
    const targetD = target.getAttribute('d');
    
    return new this.vortex({
      targets: element,
      properties: {
        d: {
          from: startD,
          to: targetD,
          duration: duration,
          easing: easing
        }
      }
    });
  }

  _morphDOM(element, target, duration, easing) {
    const startRect = element.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    
    const deltaX = targetRect.left - startRect.left;
    const deltaY = targetRect.top - startRect.top;
    const deltaWidth = targetRect.width / startRect.width;
    const deltaHeight = targetRect.height / startRect.height;
    
    return new this.vortex({
      targets: element,
      properties: {
        translateX: {
          from: 0,
          to: deltaX,
          duration: duration,
          easing: easing
        },
        translateY: {
          from: 0,
          to: deltaY,
          duration: duration,
          easing: easing
        },
        scaleX: {
          from: 1,
          to: deltaWidth,
          duration: duration,
          easing: easing
        },
        scaleY: {
          from: 1,
          to: deltaHeight,
          duration: duration,
          easing: easing
        }
      }
    });
  }
}

export default MorphPlugin;