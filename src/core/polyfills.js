if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (callback) => {
    return setTimeout(callback, 16);
  };
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = (id) => {
    clearTimeout(id);
  };
}

if (!window.performance?.now) {
  window.performance = window.performance || {};
  window.performance.now = () => Date.now();
}

// Object.assign полифилл
if (typeof Object.assign !== 'function') {
  Object.assign = function(target) {
    for (let i = 1; i < arguments.length; i++) {
      const source = arguments[i];
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
}