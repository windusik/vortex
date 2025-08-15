/**
 * WebGL рендерер для сложных 3D анимаций
 * @class WebGLRenderer
 */
class WebGLRenderer {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.gl = null;
    this.programs = {};
    this.textures = {};
    this.meshes = {};
    this._init(options);
  }

  _init(options) {
    try {
      this.gl = this.canvas.getContext('webgl2', options) || 
                this.canvas.getContext('webgl', options) || 
                this.canvas.getContext('experimental-webgl', options);
      
      if (!this.gl) {
        throw new Error('WebGL not supported');
      }
      
      this._setupViewport();
      this._createBasicShaders();
      
    } catch (e) {
      console.error('WebGL initialization error:', e);
    }
  }

  _setupViewport() {
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
  }

  _createBasicShaders() {
    // Вершинный шейдер
    const vsSource = `
      attribute vec3 aPosition;
      attribute vec4 aColor;
      
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      
      varying vec4 vColor;
      
      void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
        vColor = aColor;
      }
    `;
    
    // Фрагментный шейдер
    const fsSource = `
      precision mediump float;
      
      varying vec4 vColor;
      
      void main() {
        gl_FragColor = vColor;
      }
    `;
    
    this._createProgram('basic', vsSource, fsSource);
  }

  _createProgram(name, vsSource, fsSource) {
    const vertexShader = this._compileShader(this.gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this._compileShader(this.gl.FRAGMENT_SHADER, fsSource);
    
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Program linking error:', this.gl.getProgramInfoLog(program));
      return null;
    }
    
    this.programs[name] = program;
    return program;
  }

  _compileShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }

  createMesh(name, vertices, indices, colors = null) {
    const mesh = {
      vao: this.gl.createVertexArray(),
      vertexBuffer: this.gl.createBuffer(),
      indexBuffer: this.gl.createBuffer(),
      colorBuffer: this.gl.createBuffer(),
      vertexCount: indices.length
    };
    
    this.gl.bindVertexArray(mesh.vao);
    
    // Вершинные данные
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(0);
    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 0, 0);
    
    // Цвета
    if (colors) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.colorBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
      this.gl.enableVertexAttribArray(1);
      this.gl.vertexAttribPointer(1, 4, this.gl.FLOAT, false, 0, 0);
    }
    
    // Индексы
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
    
    this.gl.bindVertexArray(null);
    
    this.meshes[name] = mesh;
    return mesh;
  }

  render() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    // Устанавливаем шейдер
    const program = this.programs['basic'];
    this.gl.useProgram(program);
    
    // Устанавливаем матрицы
    const projectionMatrix = this._createProjectionMatrix();
    const modelViewMatrix = this._createModelViewMatrix();
    
    const pUniform = this.gl.getUniformLocation(program, 'uProjectionMatrix');
    const mvUniform = this.gl.getUniformLocation(program, 'uModelViewMatrix');
    
    this.gl.uniformMatrix4fv(pUniform, false, projectionMatrix);
    this.gl.uniformMatrix4fv(mvUniform, false, modelViewMatrix);
    
    // Рендерим все меши
    Object.values(this.meshes).forEach(mesh => {
      this.gl.bindVertexArray(mesh.vao);
      this.gl.drawElements(
        this.gl.TRIANGLES,
        mesh.vertexCount,
        this.gl.UNSIGNED_SHORT,
        0
      );
      this.gl.bindVertexArray(null);
    });
  }

  _createProjectionMatrix() {
    const fieldOfView = 45 * Math.PI / 180;
    const aspect = this.canvas.width / this.canvas.height;
    const zNear = 0.1;
    const zFar = 100.0;
    
    const projectionMatrix = new Float32Array(16);
    const f = 1.0 / Math.tan(fieldOfView / 2);
    
    projectionMatrix[0] = f / aspect;
    projectionMatrix[5] = f;
    projectionMatrix[10] = (zFar + zNear) / (zNear - zFar);
    projectionMatrix[11] = -1;
    projectionMatrix[14] = (2 * zFar * zNear) / (zNear - zFar);
    projectionMatrix[15] = 0;
    
    return projectionMatrix;
  }

  _createModelViewMatrix() {
    const modelViewMatrix = new Float32Array(16);
    
    // Простая матрица вида модели
    modelViewMatrix[0] = 1;
    modelViewMatrix[5] = 1;
    modelViewMatrix[10] = 1;
    modelViewMatrix[12] = 0;
    modelViewMatrix[13] = 0;
    modelViewMatrix[14] = -5; // Отодвигаем камеру
    modelViewMatrix[15] = 1;
    
    return modelViewMatrix;
  }

  animate(callback) {
    const renderLoop = () => {
      callback();
      this.render();
      requestAnimationFrame(renderLoop);
    };
    
    renderLoop();
  }
}

export default WebGLRenderer;