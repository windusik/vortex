/**
 * Плагин для перетаскивания элементов с физикой
 * @class DragPlugin
 */
class DragPlugin {
  constructor(vortex) {
    this.vortex = vortex;
    this.name = 'drag';
    this.draggables = [];
    this._init();
  }

  _init() {
    this.vortex.registerPlugin(this);
    this.physics = new PhysicsEngine();
    this._setupEventListeners();
  }

  makeDraggable(element, options = {}) {
    const particle = this.physics.addParticle(0, 0, options.mass || 1);
    const draggable = { element, particle, options };
    
    this.draggables.push(draggable);
    this._updatePosition(draggable);
    
    return {
      particle,
      destroy: () => {
        const index = this.draggables.indexOf(draggable);
        if (index !== -1) {
          this.draggables.splice(index, 1);
        }
      }
    };
  }

  _setupEventListeners() {
    let isDragging = false;
    let currentDraggable = null;
    let offsetX = 0;
    let offsetY = 0;
    
    document.addEventListener('mousedown', e => {
      this.draggables.forEach(draggable => {
        const rect = draggable.element.getBoundingClientRect();
        
        if (
          e.clientX >= rect.left && 
          e.clientX <= rect.right && 
          e.clientY >= rect.top && 
          e.clientY <= rect.bottom
        ) {
          isDragging = true;
          currentDraggable = draggable;
          
          offsetX = e.clientX - rect.left;
          offsetY = e.clientY - rect.top;
          
          // Фиксируем частицу при начале перетаскивания
          currentDraggable.particle.fixed = true;
          currentDraggable.particle.x = e.clientX;
          currentDraggable.particle.y = e.clientY;
          
          e.preventDefault();
        }
      });
    });
    
    document.addEventListener('mousemove', e => {
      if (isDragging && currentDraggable) {
        currentDraggable.particle.x = e.clientX;
        currentDraggable.particle.y = e.clientY;
        this._updatePosition(currentDraggable);
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging && currentDraggable) {
        // Освобождаем частицу с некоторой инерцией
        currentDraggable.particle.fixed = false;
        currentDraggable.particle.velocity.x = (currentDraggable.particle.x - currentDraggable.particle.oldX) * 0.5;
        currentDraggable.particle.velocity.y = (currentDraggable.particle.y - currentDraggable.particle.oldY) * 0.5;
        
        isDragging = false;
        currentDraggable = null;
      }
    });
    
    // Запускаем физический движок
    this.physics.start();
    
    // Обновляем позиции элементов в цикле анимации
    const animate = () => {
      this.draggables.forEach(draggable => {
        if (!draggable.particle.fixed) {
          this._updatePosition(draggable);
        }
      });
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  _updatePosition(draggable) {
    const { element, particle, options } = draggable;
    const bounds = options.bounds;
    
    if (bounds) {
      this.physics.constrainToBounds(
        particle,
        bounds.left,
        bounds.top,
        bounds.right,
        bounds.bottom,
        options.bounce || 0.5
      );
    }
    
    element.style.transform = `translate(${particle.x - particle.mass * 0.5}px, ${particle.y - particle.mass * 0.5}px)`;
  }
}

export default DragPlugin;