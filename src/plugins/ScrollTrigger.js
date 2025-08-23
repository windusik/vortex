/**
 * Плагин для анимаций по скроллу
 * @class ScrollTrigger
 */
class ScrollTrigger {
  constructor(vortex) {
    this.vortex = vortex;
    this.name = 'scrollTrigger';
    this.triggers = [];
    this._init();
  }

  _init() {
    this.vortex.registerPlugin(this);
    window.addEventListener('scroll', this._handleScroll.bind(this));
    window.addEventListener('resize', this._handleResize.bind(this));
    this._handleScroll();
  }

  create(triggerElement, animation, options = {}) {
    const trigger = {
      element: triggerElement,
      animation: animation,
      start: options.start || 'top bottom',
      end: options.end || 'bottom top',
      scrub: options.scrub || false,
      markers: options.markers || false,
      onEnter: options.onEnter,
      onLeave: options.onLeave,
      onEnterBack: options.onEnterBack,
      onLeaveBack: options.onLeaveBack,
      once: options.once || false
    };
    
    this._calculateTriggerPosition(trigger);
    this.triggers.push(trigger);
    
    if (this.markers) {
      this._createMarkers(trigger);
    }
    
    return trigger;
  }

  _calculateTriggerPosition(trigger) {
    const rect = trigger.element.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight;
    
    // Парсим start и end позиции
    const [startPos, startRef] = trigger.start.split(' ');
    const [endPos, endRef] = trigger.end.split(' ');
    
    // Вычисляем start scroll position
    let start;
    if (startRef === 'top') {
      start = rect.top + scrollY;
    } else if (startRef === 'center') {
      start = rect.top + scrollY + rect.height / 2;
    } else { // bottom
      start = rect.top + scrollY + rect.height;
    }
    
    if (startPos === 'top') {
      start -= 0;
    } else if (startPos === 'center') {
      start -= viewportHeight / 2;
    } else { // bottom
      start -= viewportHeight;
    }
    
    // Вычисляем end scroll position
    let end;
    if (endRef === 'top') {
      end = rect.top + scrollY;
    } else if (endRef === 'center') {
      end = rect.top + scrollY + rect.height / 2;
    } else { // bottom
      end = rect.top + scrollY + rect.height;
    }
    
    if (endPos === 'top') {
      end -= 0;
    } else if (endPos === 'center') {
      end -= viewportHeight / 2;
    } else { // bottom
      end -= viewportHeight;
    }
    
    trigger.startPos = start;
    trigger.endPos = end;
    trigger.rect = rect;
  }

  _handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    
    this.triggers.forEach(trigger => {
      const { startPos, endPos, animation } = trigger;
      
      if (scrollY >= startPos && scrollY <= endPos) {
        // Триггер активен
        if (!trigger.isActive) {
          trigger.isActive = true;
          if (trigger.onEnter) trigger.onEnter();
        }
        
        if (trigger.scrub) {
          const progress = (scrollY - startPos) / (endPos - startPos);
          animation.seek(progress * animation.duration);
        }
      } else {
        // Триггер не активен
        if (trigger.isActive) {
          trigger.isActive = false;
          if (trigger.onLeave) trigger.onLeave();
        }
      }
      
      // Проверяем обратное направление
      if (scrollY < startPos && trigger.wasActive) {
        if (trigger.onEnterBack) trigger.onEnterBack();
      }
      
      if (scrollY > endPos && trigger.wasActive) {
        if (trigger.onLeaveBack) trigger.onLeaveBack();
      }
      
      trigger.wasActive = trigger.isActive;
      
      // Если once, удаляем триггер после активации
      if (trigger.once && trigger.isActive) {
        this._removeTrigger(trigger);
      }
    });
  }

  _handleResize() {
    this.triggers.forEach(trigger => {
      this._calculateTriggerPosition(trigger);
    });
  }

  _removeTrigger(trigger) {
    const index = this.triggers.indexOf(trigger);
    if (index !== -1) {
      this.triggers.splice(index, 1);
    }
  }

  _createMarkers(trigger) {
    const startMarker = document.createElement('div');
    startMarker.className = 'vortex-scroll-marker start';
    startMarker.style.position = 'absolute';
    startMarker.style.left = '0';
    startMarker.style.width = '100%';
    startMarker.style.height = '2px';
    startMarker.style.backgroundColor = 'green';
    startMarker.style.zIndex = '9999';
    
    const endMarker = document.createElement('div');
    endMarker.className = 'vortex-scroll-marker end';
    endMarker.style.position = 'absolute';
    endMarker.style.left = '0';
    endMarker.style.width = '100%';
    endMarker.style.height = '2px';
    endMarker.style.backgroundColor = 'red';
    endMarker.style.zIndex = '9999';
    
    document.body.appendChild(startMarker);
    document.body.appendChild(endMarker);
    
    const updateMarkers = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      startMarker.style.top = `${trigger.startPos - scrollY + window.innerHeight}px`;
      endMarker.style.top = `${trigger.endPos - scrollY + window.innerHeight}px`;
    };
    
    updateMarkers();
    window.addEventListener('scroll', updateMarkers);
    window.addEventListener('resize', updateMarkers);
    
    trigger.markers = { start: startMarker, end: endMarker, update: updateMarkers };
  }
}

export default ScrollTrigger;