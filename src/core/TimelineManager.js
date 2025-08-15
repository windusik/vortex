/**
 * TimelineManager - управление сложными временными линиями анимаций
 * @class TimelineManager
 */
class TimelineManager {
  constructor(params = {}) {
    this.animations = [];
    this.children = [];
    this.position = 0;
    this.duration = 0;
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
      } else {
        position = parseFloat(position);
      }
    }
    
    animation.startTime = position;
    animation.endTime = position + animation.duration;
    
    this.animations.push(animation);
    this._updateDuration();
    
    return this;
  }

  _updateDuration() {
    this.duration = Math.max(...this.animations.map(a => a.endTime), 0);
  }

  play() {
    this.isPlaying = true;
    this.startTime = performance.now() - this.position;
    this._tick();
  }

  pause() {
    this.isPlaying = false;
  }

  seek(time) {
    this.position = Math.max(0, Math.min(time, this.duration));
    this._updateAnimations();
  }

  _tick() {
    if (!this.isPlaying) return;
    
    const now = performance.now();
    this.position = (now - this.startTime) * this.playbackRate;
    
    this._updateAnimations();
    
    if (this.position < this.duration) {
      requestAnimationFrame(() => this._tick());
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
    
    if (this.loop) {
      this.position = 0;
      this.play();
    }
  }
}

export default TimelineManager;