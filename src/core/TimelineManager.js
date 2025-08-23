class TimelineManager {
  constructor(params = {}) {
    this.animations = [];
    this.children = [];
    this.position = 0;
    this.duration = 0;
    this.isPlaying = false;
    this.playbackRate = 1;
    this._rafId = null;
    this._lastTime = 0;
    this._init(params);
  }

  _init(params) {
    this.autoplay = params.autoplay !== false;
    this.loop = params.loop || false;
    this.direction = params.direction || 'normal';
    
    if (this.autoplay) {
      this.play();
    }
  }

  add(animation, position = '+=0') {
    if (typeof position === 'string') {
      if (position.startsWith('+=')) {
        position = this.position + parseFloat(position.substring(2));
      } else if (position.startsWith('-=')) {
        position = this.position - parseFloat(position.substring(2));
      } else if (position === '<') {
        const lastAnim = this.animations[this.animations.length - 1];
        position = lastAnim ? lastAnim.startTime : 0;
      } else if (position === '>') {
        const lastAnim = this.animations[this.animations.length - 1];
        position = lastAnim ? lastAnim.endTime : 0;
      } else {
        position = parseFloat(position);
      }
    }
    
    animation.startTime = position;
    animation.endTime = position + (animation.duration || 0);
    
    this.animations.push(animation);
    this._updateDuration();
    
    return this;
  }

  _updateDuration() {
    this.duration = Math.max(...this.animations.map(a => a.endTime), 0);
  }

  play() {
    if (this.isPlaying) return this;
    
    this.isPlaying = true;
    this.startTime = performance.now() - this.position;
    this._lastTime = performance.now();
    this._tick();
    
    return this;
  }

  pause() {
    this.isPlaying = false;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    return this;
  }

  restart() {
    this.position = 0;
    this.pause();
    return this.play();
  }

  reverse() {
    this.playbackRate *= -1;
    return this;
  }

  seek(time) {
    this.position = Math.max(0, Math.min(time, this.duration));
    this._updateAnimations();
    return this;
  }

  _tick() {
    if (!this.isPlaying) return;
    
    const now = performance.now();
    const delta = now - this._lastTime;
    this._lastTime = now;
    
    this.position += delta * this.playbackRate;
    this._updateAnimations();
    
    if (this.position < this.duration && this.position >= 0) {
      this._rafId = requestAnimationFrame(() => this._tick());
    } else {
      this._handleComplete();
    }
  }

  _updateAnimations() {
    this.animations.forEach(anim => {
      const localTime = this.position - anim.startTime;
      
      if (localTime >= 0 && localTime <= anim.duration) {
        anim.seek(localTime);
      } else if (localTime > anim.duration) {
        anim.seek(anim.duration);
      } else {
        anim.seek(0);
      }
    });
  }

  _handleComplete() {
    this.isPlaying = false;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    
    if (this.loop) {
      this.position = 0;
      this.play();
    }
  }
}

export default TimelineManager;