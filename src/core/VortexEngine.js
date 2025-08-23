class VortexEngine {
  constructor(params = {}) {
    this.targets = [];
    this.animations = [];
    this.timelines = [];
    this.currentTime = 0;
    this.playbackRate = 1;
    this.isPlaying = false;
    this._lastTime = 0;
    this._rafId = null;
    this._init(params);
  }

  _init(params) {
    this._parseTargets(params.targets);
    this._createAnimations(params);
    this._setupEventListeners();
    
    // Новое: кеширование начальных значений
    this._cacheInitialValues();
  }

  _cacheInitialValues() {
    this.initialValues = {};
    this.targets.forEach(target => {
      const id = target.id || Math.random().toString(36).substring(7);
      this.initialValues[id] = {};
      
      this.animations.forEach(anim => {
        Object.keys(anim.properties).forEach(prop => {
          this.initialValues[id][prop] = this._getCurrentValue(target, prop);
        });
      });
    });
  }

  _parseTargets(targets) {
    if (!targets) return;
    
    if (typeof targets === 'string') {
      // CSS селектор
      this.targets = Array.from(document.querySelectorAll(targets));
    } else if (Array.isArray(targets)) {
      this.targets = targets.slice();
    } else if (targets instanceof NodeList || targets instanceof HTMLCollection) {
      this.targets = Array.from(targets);
    } else {
      this.targets = [targets];
    }
  }

  _createAnimations(params) {
    const animation = {
      properties: params.properties || {},
      duration: params.duration || 1000,
      delay: params.delay || 0,
      easing: params.easing || 'easeOutQuad',
      loop: params.loop || false,
      direction: params.direction || 'normal',
      autoplay: params.autoplay !== false,
      update: params.update,
      begin: params.begin,
      complete: params.complete
    };
    
    this.animations.push(animation);
    
    if (animation.autoplay) {
      this.play();
    }
  }

  _setupEventListeners() {
    // Настройка слушателей событий
  }

  play() {
    if (this.isPlaying) return this;
    
    this.isPlaying = true;
    this._lastTime = performance.now();
    
    if (this.animations.some(anim => anim.begin)) {
      this.animations.forEach(anim => {
        if (anim.begin) anim.begin();
      });
    }
    
    this._dispatchEvent('play');
    this._tick();
    return this;
  }

  pause() {
    this.isPlaying = false;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this._dispatchEvent('pause');
    return this;
  }

  restart() {
    this.currentTime = 0;
    this.pause();
    
    // Сброс к начальным значениям
    this.targets.forEach(target => {
      const id = target.id || Math.random().toString(36).substring(7);
      Object.keys(this.initialValues[id] || {}).forEach(prop => {
        this._setValue(target, prop, this.initialValues[id][prop]);
      });
    });
    
    return this.play();
  }

  reverse() {
    this.playbackRate *= -1;
    return this;
  }

  seek(time) {
    this.currentTime = Math.max(0, Math.min(time, this.duration));
    this._updateAnimations();
    return this;
  }

  _tick() {
    if (!this.isPlaying) return;
    
    const now = performance.now();
    const delta = now - this._lastTime;
    this._lastTime = now;
    
    this.currentTime += delta * this.playbackRate;
    this._updateAnimations();
    
    if (this.currentTime < this.duration) {
      this._rafId = requestAnimationFrame(() => this._tick());
    } else {
      this._handleComplete();
    }
  }

  _updateAnimations() {
    this.animations.forEach(anim => {
      this._updateAnimation(anim);
    });
    
    if (this.animations.some(anim => anim.update)) {
      this.animations.forEach(anim => {
        if (anim.update) anim.update();
      });
    }
  }

  _updateAnimation(animation) {
    const progress = this._calculateProgress(animation);
    const easedProgress = this._applyEasing(progress, animation.easing);
    
    this.targets.forEach(target => {
      Object.entries(animation.properties).forEach(([prop, value]) => {
        this._setProperty(target, prop, value, easedProgress);
      });
    });
  }

  _calculateProgress(animation) {
    const time = Math.max(0, this.currentTime - animation.delay);
    const duration = animation.duration;
    
    if (time >= duration) {
      return animation.loop ? time % duration / duration : 1;
    }
    
    return time / duration;
  }

  _applyAnimation(animation, progress) {
    const easedProgress = this._applyEasing(progress, animation.easing);
    
    this.targets.forEach(target => {
      Object.entries(animation.properties).forEach(([prop, value]) => {
        this._setProperty(target, prop, value, easedProgress);
      });
    });
  }

  _setProperty(target, property, value, progress) {
    if (typeof value === 'object' && (value.from !== undefined || value.to !== undefined || value.value !== undefined)) {
      const start = value.from !== undefined ? 
                   value.from : 
                   this._getCurrentValue(target, property);
      const end = value.to !== undefined ? 
                 value.to : 
                 (value.value !== undefined ? value.value : start);
      const current = start + (end - start) * progress;
      
      this._setValue(target, property, current);
    } else if (Array.isArray(value)) {
      const start = value[0];
      const end = value[1];
      const current = start + (end - start) * progress;
      
      this._setValue(target, property, current);
    } else {
      this._setValue(target, property, value);
    }
  }

  _getCurrentValue(target, property) {
    if (typeof target === 'object' && target.style) {
      const value = target.style[property];
      if (value) {
        const numericMatch = value.match(/(-?\d+\.?\d*)(px|%|deg|rad|turn)?/);
        if (numericMatch) {
          return parseFloat(numericMatch[1]);
        }
        return value;
      }
      
      try {
        const computed = window.getComputedStyle(target).getPropertyValue(property);
        if (computed) {
          const numericMatch = computed.match(/(-?\d+\.?\d*)(px|%|deg|rad|turn)?/);
          if (numericMatch) {
            return parseFloat(numericMatch[1]);
          }
          return computed;
        }
      } catch (e) {
        console.warn('Could not get computed style for', property, e);
      }
    }
    
    return 0;
  }

  _setValue(target, property, value) {
    if (typeof target === 'object' && target.style) {
      // Для transform свойств используем специальную обработку
      if (property.startsWith('translate') || 
          property.startsWith('rotate') || 
          property.startsWith('scale') || 
          property === 'x' || property === 'y') {
        
        this._applyTransform(target, property, value);
      } else {
        target.style[property] = this._formatValue(property, value);
      }
    }
  }

  _applyTransform(target, property, value) {
    let transform = target.style.transform || '';
    
    // Удаляем существующие значения этого типа трансформации
    const transformRegex = new RegExp(`\\b${property}\\([^)]+\\)`, 'g');
    transform = transform.replace(transformRegex, '');

    let transformValue = '';
    
    if (property === 'x') {
      transformValue = `translateX(${this._formatValue(property, value)})`;
    } else if (property === 'y') {
      transformValue = `translateY(${this._formatValue(property, value)})`;
    } else {
      transformValue = `${property}(${this._formatValue(property, value)})`;
    }
    
    // Обновляем transform
    target.style.transform = `${transform} ${transformValue}`.trim();
  }

  _formatValue(property, value) {
    if (typeof value === 'number') {
      if (property === 'opacity') {
        return value;
      } else if (property.includes('rotate')) {
        return `${value}deg`;
      } else if (property === 'scale') {
        return value;
      } else {
        return `${value}px`;
      }
    }
    return value;
  }

  _applyEasing(progress, easing) {
    return EasingFunctions[easing] ? 
      EasingFunctions[easing](progress) : 
      progress;
  }

  _handleComplete() {
    this.isPlaying = false;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    
    if (this.animations.some(anim => anim.complete)) {
      this.animations.forEach(anim => {
        if (anim.complete) anim.complete();
      });
    }
    
    this._dispatchEvent('complete');
  }

  _dispatchEvent(type) {
    const event = new CustomEvent(`vortex:${type}`, {
      detail: { 
        target: this,
        time: this.currentTime 
      }
    });
    
    this.targets.forEach(target => {
      if (target.dispatchEvent) {
        target.dispatchEvent(event);
      }
    });
  }

  add(params) {
    this._createAnimations(params);
    return this;
  }

  timeline(params = {}) {
    const timeline = new TimelineManager(params);
    this.timelines.push(timeline);
    return timeline;
  }

  get duration() {
    return Math.max(...this.animations.map(a => a.delay + a.duration), 0);
  }
}

export default VortexEngine;