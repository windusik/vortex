/**
 * Управление CSS-анимациями
 * @class CSSManager
 */
class CSSManager {
  constructor() {
    this.styleElement = null;
    this.styleSheet = null;
    this.animationCount = 0;
    this._init();
  }

  _init() {
    this.styleElement = document.createElement('style');
    document.head.appendChild(this.styleElement);
    this.styleSheet = this.styleElement.sheet;
  }

  animate(element, properties, duration = 1000, easing = 'ease', delay = 0) {
    const animationName = `vortex-animation-${++this.animationCount}`;
    const keyframes = this._createKeyframes(properties);
    
    this._insertKeyframes(animationName, keyframes);
    
    element.style.animation = `${animationName} ${duration}ms ${easing} ${delay}ms forwards`;
    
    return {
      stop: () => {
        element.style.animation = '';
        this._removeKeyframes(animationName);
      }
    };
  }

  _createKeyframes(properties) {
    const from = {};
    const to = {};
    
    Object.entries(properties).forEach(([prop, value]) => {
      if (typeof value === 'object') {
        from[prop] = value.from;
        to[prop] = value.to;
      } else {
        to[prop] = value;
      }
    });
    
    return {
      from: from,
      to: to
    };
  }

  _insertKeyframes(name, keyframes) {
    const fromRules = Object.entries(keyframes.from)
      .map(([prop, value]) => `${prop}: ${value};`)
      .join(' ');
    
    const toRules = Object.entries(keyframes.to)
      .map(([prop, value]) => `${prop}: ${value};`)
      .join(' ');
    
    const rule = `
      @keyframes ${name} {
        from { ${fromRules} }
        to { ${toRules} }
      }
    `;
    
    this.styleSheet.insertRule(rule, this.styleSheet.cssRules.length);
  }

  _removeKeyframes(name) {
    for (let i = 0; i < this.styleSheet.cssRules.length; i++) {
      const rule = this.styleSheet.cssRules[i];
      if (rule.name === name) {
        this.styleSheet.deleteRule(i);
        break;
      }
    }
  }

  setStyles(element, styles) {
    Object.entries(styles).forEach(([prop, value]) => {
      element.style[prop] = value;
    });
  }

  getComputedStyle(element, property) {
    return window.getComputedStyle(element).getPropertyValue(property);
  }
}

export default CSSManager;