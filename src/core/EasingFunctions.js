/**
 * Коллекция функций плавности для анимаций
 * @namespace EasingFunctions
 */
const EasingFunctions = {
  // Линейная
  linear: t => t,
  
  // Квадратичные
  easeInQuad: t => t*t,
  easeOutQuad: t => t*(2-t),
  easeInOutQuad: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,
  
  // Кубические
  easeInCubic: t => t*t*t,
  easeOutCubic: t => (--t)*t*t+1,
  easeInOutCubic: t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
  
  // Квартические
  easeInQuart: t => t*t*t*t,
  easeOutQuart: t => 1-(--t)*t*t*t,
  easeInOutQuart: t => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
  
  // Квинтические
  easeInQuint: t => t*t*t*t*t,
  easeOutQuint: t => 1+(--t)*t*t*t*t,
  easeInOutQuint: t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t,
  
  // Синусоидальные
  easeInSine: t => 1 - Math.cos(t * Math.PI / 2),
  easeOutSine: t => Math.sin(t * Math.PI / 2),
  easeInOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  
  // Экспоненциальные
  easeInExpo: t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
  easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutExpo: t => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if ((t *= 2) < 1) return 0.5 * Math.pow(2, 10 * (t - 1));
    return 0.5 * (-Math.pow(2, -10 * --t) + 2);
  },
  
  // Круговые
  easeInCirc: t => 1 - Math.sqrt(1 - t * t),
  easeOutCirc: t => Math.sqrt(1 - (t = t - 1) * t),
  easeInOutCirc: t => {
    if ((t *= 2) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
    return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
  },
  
  // Упругие
  easeInElastic: t => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    
    const p = 0.3;
    const s = p / 4;
    
    return -(
      Math.pow(2, 10 * (t -= 1)) * 
      Math.sin((t - s) * (2 * Math.PI) / p)
    );
  },
  
  easeOutElastic: t => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    
    const p = 0.3;
    const s = p / 4;
    
    return (
      Math.pow(2, -10 * t) * 
      Math.sin((t - s) * (2 * Math.PI) / p) + 1
    );
  },
  
  easeInOutElastic: t => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    
    const p = 0.3 * 1.5;
    const s = p / 4;
    
    if ((t *= 2) < 1) {
      return -0.5 * (
        Math.pow(2, 10 * (t -= 1)) * 
        Math.sin((t - s) * (2 * Math.PI) / p)
      );
    }
    
    return (
      Math.pow(2, -10 * (t -= 1)) * 
      Math.sin((t - s) * (2 * Math.PI) / p) * 0.5 + 1
    );
  },
  
  // Отскоки
  easeInBack: t => {
    const s = 1.70158;
    return t * t * ((s + 1) * t - s);
  },
  
  easeOutBack: t => {
    const s = 1.70158;
    return --t * t * ((s + 1) * t + s) + 1;
  },
  
  easeInOutBack: t => {
    const s = 1.70158 * 1.525;
    if ((t *= 2) < 1) return 0.5 * (t * t * ((s + 1) * t - s));
    return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2);
  },
  
  // Отскоки с настраиваемым параметром
  backIn: (t, s = 1.70158) => t * t * ((s + 1) * t - s),
  backOut: (t, s = 1.70158) => --t * t * ((s + 1) * t + s) + 1,
  backInOut: (t, s = 1.70158 * 1.525) => {
    if ((t *= 2) < 1) return 0.5 * (t * t * ((s + 1) * t - s));
    return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2);
  },
  
  // Ступенчатые
  steps: (t, steps = 10, direction = 'start') => {
    const t2 = Math.min(Math.max(t, 0), 1);
    const step = Math.floor(t2 * steps);
    
    switch (direction) {
      case 'start': return step / steps;
      case 'end': return (step + 1) / steps;
      case 'both': return (t2 * steps % 1 === 0 || t2 === 1) ? 
        step / steps : 
        (step + 0.5) / steps;
      default: return step / steps;
    }
  }
};

export default EasingFunctions;