/**
 * Плагин для анимации текста
 * @class TextPlugin
 */
class TextPlugin {
  constructor(vortex) {
    this.vortex = vortex;
    this.name = 'text';
    this._init();
  }

  _init() {
    this.vortex.registerPlugin(this);
  }

  typewriter(element, options = {}) {
    const text = element.textContent;
    element.textContent = '';
    
    const speed = options.speed || 50;
    const delay = options.delay || 0;
    const cursor = options.cursor || '|';
    const cursorBlinkSpeed = options.cursorBlinkSpeed || 500;
    
    let currentPos = 0;
    let cursorVisible = true;
    
    // Создаем курсор
    const cursorElement = document.createElement('span');
    cursorElement.className = 'vortex-cursor';
    cursorElement.textContent = cursor;
    element.appendChild(cursorElement);
    
    // Анимация мигания курсора
    const cursorInterval = setInterval(() => {
      cursorVisible = !cursorVisible;
      cursorElement.style.opacity = cursorVisible ? '1' : '0';
    }, cursorBlinkSpeed);
    
    // Анимация печатания
    const typeInterval = setInterval(() => {
      if (currentPos < text.length) {
        const char = text.charAt(currentPos);
        const charElement = document.createTextNode(char);
        element.insertBefore(charElement, cursorElement);
        currentPos++;
      } else {
        clearInterval(typeInterval);
        clearInterval(cursorInterval);
        cursorElement.remove();
        
        if (options.onComplete) {
          options.onComplete();
        }
      }
    }, speed);
    
    return {
      stop: () => {
        clearInterval(typeInterval);
        clearInterval(cursorInterval);
        cursorElement.remove();
        element.textContent = text;
      }
    };
  }

  scramble(element, options = {}) {
    const originalText = element.textContent;
    const chars = "!<>-_\\/[]{}—=+*^?#________";
    const speed = options.speed || 30;
    const delay = options.delay || 0;
    const iterations = options.iterations || 5;
    
    let queue = [];
    
    for (let i = 0; i < originalText.length; i++) {
      const from = originalText[i] || '';
      const to = originalText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      
      queue.push({ from, to, start, end });
    }
    
    let frame = 0;
    let output = [];
    
    const update = () => {
      let complete = 0;
      
      for (let i = 0, n = queue.length; i < n; i++) {
        let { from, to, start, end, char } = queue[i];
        
        if (frame >= end) {
          complete++;
          output[i] = to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = chars[Math.floor(Math.random() * chars.length)];
            queue[i].char = char;
          }
          
          output[i] = `<span class="vortex-scramble-char">${char}</span>`;
        } else {
          output[i] = from;
        }
      }
      
      element.innerHTML = output.join('');
      
      if (complete === queue.length) {
        clearInterval(interval);
        element.textContent = originalText;
        
        if (options.onComplete) {
          options.onComplete();
        }
      } else {
        frame++;
      }
    };
    
    const interval = setInterval(update, speed);
    
    return {
      stop: () => {
        clearInterval(interval);
        element.textContent = originalText;
      }
    };
  }
}

export default TextPlugin;