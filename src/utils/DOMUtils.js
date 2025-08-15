/**
 * Утилиты для работы с DOM
 * @namespace DOMUtils
 */
const DOMUtils = {
  // Создание элемента с атрибутами и стилями
  createElement(tag, attrs = {}, styles = {}) {
    const el = document.createElement(tag);
    
    Object.entries(attrs).forEach(([name, value]) => {
      el.setAttribute(name, value);
    });
    
    Object.entries(styles).forEach(([prop, value]) => {
      el.style[prop] = value;
    });
    
    return el;
  },

  // Получение позиции элемента относительно документа
  getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset,
      width: rect.width,
      height: rect.height
    };
  },

  // Проверка видимости элемента в viewport
  isInViewport(el, threshold = 0) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) - threshold &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth) - threshold &&
      rect.bottom >= threshold &&
      rect.right >= threshold
    );
  },

  // Получение всех родителей элемента
  getParents(el) {
    const parents = [];
    let current = el.parentNode;
    
    while (current && current !== document) {
      parents.push(current);
      current = current.parentNode;
    }
    
    return parents;
  },

  // Получение или установка CSS переменной
  cssVariable(name, value) {
    if (value !== undefined) {
      document.documentElement.style.setProperty(`--${name}`, value);
    } else {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(`--${name}`)
        .trim();
    }
  },

  // Добавление класса с префиксом
  addClass(el, className, prefix = 'vortex') {
    el.classList.add(`${prefix}-${className}`);
  },

  // Удаление класса с префиксом
  removeClass(el, className, prefix = 'vortex') {
    el.classList.remove(`${prefix}-${className}`);
  },

  // Переключение класса с префиксом
  toggleClass(el, className, prefix = 'vortex') {
    el.classList.toggle(`${prefix}-${className}`);
  },

  // Анимация высоты элемента (раскрытие/свертывание)
  animateHeight(el, duration = 300, easing = 'ease-in-out') {
    const startHeight = el.offsetHeight;
    const targetHeight = el.style.height === '0px' ? 
      el.scrollHeight : 
      0;
    
    el.style.transition = `height ${duration}ms ${easing}`;
    el.style.overflow = 'hidden';
    el.style.height = `${targetHeight}px`;
    
    return new Promise(resolve => {
      setTimeout(() => resolve(), duration);
    });
  },

  // Ожидание загрузки DOM
  ready() {
    return new Promise(resolve => {
      if (document.readyState !== 'loading') {
        resolve();
      } else {
        document.addEventListener('DOMContentLoaded', resolve);
      }
    });
  }
};

export default DOMUtils;