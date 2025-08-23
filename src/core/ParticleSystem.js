/**
 * Система частиц для сложных эффектов
 * @class ParticleSystem
 */
class ParticleSystem {
  constructor(options = {}) {
    this.particles = [];
    this.emitters = [];
    this.forces = [];
    this.maxParticles = options.maxParticles || 1000;
    this.pool = [];
    this._init(options);
  }

  _init(options) {
    // Инициализация системы
    this.gravity = options.gravity || { x: 0, y: 0.1 };
    this.wind = options.wind || { x: 0, y: 0 };
    this.friction = options.friction || 0.98;
    this.bounce = options.bounce || 0.6;
    this.bounds = options.bounds || null;
  }

  addEmitter(emitter) {
    this.emitters.push(emitter);
    return emitter;
  }

  addForce(force) {
    this.forces.push(force);
    return force;
  }

  createParticle(options = {}) {
    let particle;
    
    if (this.pool.length > 0) {
      particle = this.pool.pop();
      this._resetParticle(particle, options);
    } else {
      if (this.particles.length >= this.maxParticles) return null;
      
      particle = {
        x: 0, y: 0,
        vx: 0, vy: 0,
        life: 1,
        age: 0,
        size: 10,
        color: '#ffffff',
        alpha: 1,
        rotation: 0,
        data: {}
      };
      
      this._resetParticle(particle, options);
    }
    
    this.particles.push(particle);
    return particle;
  }

  _resetParticle(particle, options) {
    particle.x = options.x || 0;
    particle.y = options.y || 0;
    particle.vx = options.vx || 0;
    particle.vy = options.vy || 0;
    particle.life = options.life || 1;
    particle.age = 0;
    particle.size = options.size || 10;
    particle.color = options.color || '#ffffff';
    particle.alpha = options.alpha !== undefined ? options.alpha : 1;
    particle.rotation = options.rotation || 0;
    particle.data = options.data || {};
  }

  update(deltaTime) {
    // Обновляем эмиттеры
    this.emitters.forEach(emitter => {
      emitter.update(this, deltaTime);
    });
    
    // Обновляем частицы
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // Применяем силы
      this.forces.forEach(force => {
        force.apply(p, deltaTime);
      });
      
      // Гравитация
      p.vx += this.gravity.x * deltaTime;
      p.vy += this.gravity.y * deltaTime;
      
      // Ветер
      p.vx += this.wind.x * deltaTime;
      p.vy += this.wind.y * deltaTime;
      
      // Трение
      p.vx *= this.friction;
      p.vy *= this.friction;
      
      // Обновление позиции
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      
      // Ограничения
      if (this.bounds) {
        this._constrainParticle(p);
      }
      
      // Обновление возраста
      p.age += deltaTime;
      
      // Удаление старых частиц
      if (p.age >= p.life) {
        this.pool.push(this.particles.splice(i, 1)[0]);
      }
    }
  }

  _constrainParticle(p) {
    if (p.x < this.bounds.x) {
      p.x = this.bounds.x;
      p.vx *= -this.bounce;
    } else if (p.x > this.bounds.x + this.bounds.width) {
      p.x = this.bounds.x + this.bounds.width;
      p.vx *= -this.bounce;
    }
    
    if (p.y < this.bounds.y) {
      p.y = this.bounds.y;
      p.vy *= -this.bounce;
    } else if (p.y > this.bounds.y + this.bounds.height) {
      p.y = this.bounds.y + this.bounds.height;
      p.vy *= -this.bounce;
    }
  }

  render(ctx) {
    ctx.save();
    
    this.particles.forEach(p => {
      const progress = p.age / p.life;
      const alpha = p.alpha * (1 - progress);
      
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      
      ctx.fillRect(
        -p.size * 0.5,
        -p.size * 0.5,
        p.size,
        p.size
      );
      
      ctx.restore();
    });
    
    ctx.restore();
  }

  clear() {
    this.pool = this.pool.concat(this.particles);
    this.particles = [];
  }
}

export default ParticleSystem;