/**
 * Плагин для создания каруселей, управляемых скроллом
 * @class ScrollCarousel
 */
export default class ScrollCarousel {
  constructor(vortex) {
    this.vortex = vortex;
    this.name = 'scrollCarousel';
    this.carousels = new Map();
    vortex.registerPlugin(this);
  }

  create(container, options = {}) {
    const items = Array.from(container.children);
    const state = {
      currentIndex: 0,
      scrollLock: false,
      items,
      options: {
        scrollSpeed: options.scrollSpeed || 1,
        snap: options.snap ?? true
      }
    };

    this.carousels.set(container, state);

    // Инициализация событий
    container.addEventListener('wheel', (e) => this.handleWheel(e, state));
    
    return {
      next: () => this.moveTo(state, state.currentIndex + 1),
      prev: () => this.moveTo(state, state.currentIndex - 1)
    };
  }

  handleWheel(e, state) {
    if (state.scrollLock) return;
    state.scrollLock = true;

    const direction = Math.sign(e.deltaY);
    this.moveTo(state, state.currentIndex + direction);

    setTimeout(() => { state.scrollLock = false; }, 500);
  }

  moveTo(state, index) {
    const { items, options } = state;
    index = Math.max(0, Math.min(index, items.length - 1));

    this.vortex.animate({
      targets: items,
      properties: {
        x: (i) => `${(i - index) * 100 * options.scrollSpeed}%`,
        opacity: (i) => i === index ? 1 : 0.5
      },
      duration: 800,
      easing: 'easeOutQuint'
    });

    state.currentIndex = index;
  }
}