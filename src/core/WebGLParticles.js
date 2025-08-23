/**
 * WebGL-ускоренная система частиц
 * @class WebGLParticles
 */
export default class WebGLParticles {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl');
    this.particles = [];
    this.maxParticles = options.maxParticles || 10000;
    
    this.initShaders();
    this.initBuffers();
  }

  initShaders() {
    const vertexShader = `
      attribute vec2 position;
      attribute float size;
      attribute vec4 color;
      
      varying vec4 vColor;
      
      void main() {
        vColor = color;
        gl_Position = vec4(position, 0.0, 1.0);
        gl_PointSize = size;
      }
    `;

    const fragmentShader = `
      precision mediump float;
      varying vec4 vColor;
      
      void main() {
        gl_FragColor = vColor;
      }
    `;

    // Компиляция шейдеров (аналогично WebGLRenderer из предыдущей версии)
    // ... 
  }

  addParticle(x, y, size, color) {
    if (this.particles.length >= this.maxParticles) return;
    
    this.particles.push({
      x, y, size, 
      color: color || [1, 0.5, 0, 1],
      velocity: [0, 0]
    });
  }

  update() {
    const positions = new Float32Array(this.particles.length * 2);
    const sizes = new Float32Array(this.particles.length);
    const colors = new Float32Array(this.particles.length * 4);

    this.particles.forEach((p, i) => {
      positions[i*2] = p.x;
      positions[i*2+1] = p.y;
      sizes[i] = p.size;
      
      colors.set(p.color, i*4);
      
      // Физика
      p.x += p.velocity[0];
      p.y += p.velocity[1];
    });

    // Обновление буферов WebGL
    // ...
  }

  render() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.POINTS, 0, this.particles.length);
  }
}