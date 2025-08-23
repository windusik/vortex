/**
 * Мониторинг производительности анимаций
 * @class PerformanceMonitor
 */
class PerformanceMonitor {
  constructor() {
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = 0;
    this.frameTimes = [];
    this.maxFrameTime = 0;
    this.minFrameTime = Infinity;
    this.averageFrameTime = 0;
    this.statsElement = null;
    this._init();
  }

  _init() {
    this.lastTime = performance.now();
    this._createStatsElement();
    this._tick();
  }

  _createStatsElement() {
    this.statsElement = document.createElement('div');
    this.statsElement.style.position = 'fixed';
    this.statsElement.style.bottom = '10px';
    this.statsElement.style.right = '10px';
    this.statsElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    this.statsElement.style.color = '#fff';
    this.statsElement.style.padding = '5px 10px';
    this.statsElement.style.fontFamily = 'monospace';
    this.statsElement.style.zIndex = '9999';
    this.statsElement.style.borderRadius = '3px';
    
    document.body.appendChild(this.statsElement);
  }

  _tick() {
    const now = performance.now();
    const delta = now - this.lastTime;
    
    this.frameCount++;
    this.frameTimes.push(delta);
    
    if (this.frameTimes.length > 60) {
      this.frameTimes.shift();
    }
    
    this.maxFrameTime = Math.max(this.maxFrameTime, delta);
    this.minFrameTime = Math.min(this.minFrameTime, delta);
    
    this.averageFrameTime = this.frameTimes.reduce((sum, time) => sum + time, 0) / this.frameTimes.length;
    this.fps = 1000 / this.averageFrameTime;
    
    this._updateStats();
    
    this.lastTime = now;
    requestAnimationFrame(() => this._tick());
  }

  _updateStats() {
    if (!this.statsElement) return;
    
    this.statsElement.textContent = `
      FPS: ${Math.round(this.fps)} | 
      Avg: ${Math.round(this.averageFrameTime)}ms | 
      Min: ${Math.round(this.minFrameTime)}ms | 
      Max: ${Math.round(this.maxFrameTime)}ms
    `;
  }

  logPerformance() {
    console.log(`Performance stats:
      FPS: ${Math.round(this.fps)}
      Average frame time: ${Math.round(this.averageFrameTime)}ms
      Min frame time: ${Math.round(this.minFrameTime)}ms
      Max frame time: ${Math.round(this.maxFrameTime)}ms
    `);
  }
}

export default PerformanceMonitor;