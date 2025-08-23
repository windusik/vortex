class PhysicsEngine {
  constructor() {
    this.particles = [];
    this.springs = [];
    this.gravity = { x: 0, y: 0.5 };
    this.friction = 0.98;
    this.timeStep = 1/60;
    this.lastTime = 0;
    this.isRunning = false;
    this._rafId = null;
  }

  addParticle(x, y, mass = 1, fixed = false) {
    const particle = {
      x, y,
      oldX: x,
      oldY: y,
      mass,
      fixed,
      velocity: { x: 0, y: 0 }
    };
    
    this.particles.push(particle);
    return particle;
  }

  addSpring(p1, p2, length = null, stiffness = 0.5) {
    const spring = {
      p1, p2,
      length: length || this._distance(p1, p2),
      stiffness
    };
    
    this.springs.push(spring);
    return spring;
  }

  _distance(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this._update();
  }

  stop() {
    this.isRunning = false;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  _update() {
    if (!this.isRunning) return;
    
    const now = performance.now();
    const deltaTime = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;
    
    let accumulatedTime = 0;
    while (accumulatedTime < deltaTime) {
      this._verlet(accumulatedTime);
      this._applySprings();
      accumulatedTime += this.timeStep;
    }
    
    this._rafId = requestAnimationFrame(() => this._update());
  }

  _verlet(deltaTime) {
    this.particles.forEach(p => {
      if (p.fixed) return;
      
      const tempX = p.x;
      const tempY = p.y;
      
      p.velocity.x += this.gravity.x * deltaTime;
      p.velocity.y += this.gravity.y * deltaTime;
      
      p.velocity.x *= this.friction;
      p.velocity.y *= this.friction;
      
      p.x += p.velocity.x * deltaTime;
      p.y += p.velocity.y * deltaTime;
      
      p.oldX = tempX;
      p.oldY = tempY;
    });
  }

  _applySprings() {
    this.springs.forEach(s => {
      const dx = s.p2.x - s.p1.x;
      const dy = s.p2.y - s.p1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance === 0) return;
      
      const diff = (s.length - distance) / distance * s.stiffness;
      const offsetX = dx * diff * 0.5;
      const offsetY = dy * diff * 0.5;
      
      if (!s.p1.fixed) {
        s.p1.x -= offsetX;
        s.p1.y -= offsetY;
      }
      
      if (!s.p2.fixed) {
        s.p2.x += offsetX;
        s.p2.y += offsetY;
      }
    });
  }

  applyForce(particle, fx, fy) {
    if (particle.fixed) return;
    
    particle.velocity.x += fx / particle.mass;
    particle.velocity.y += fy / particle.mass;
  }

  constrainToBounds(particle, x1, y1, x2, y2, bounce = 0.5) {
    if (particle.x < x1) {
      particle.x = x1;
      particle.velocity.x *= -bounce;
    } else if (particle.x > x2) {
      particle.x = x2;
      particle.velocity.x *= -bounce;
    }
    
    if (particle.y < y1) {
      particle.y = y1;
      particle.velocity.y *= -bounce;
    } else if (particle.y > y2) {
      particle.y = y2;
      particle.velocity.y *= -bounce;
    }
  }
}

export default PhysicsEngine;