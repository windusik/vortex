if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function(callback) {
    return setTimeout(function() {
      callback(performance.now());
    }, 16);
  };
  
  window.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };
}

if (!window.performance) {
  window.performance = {
    now: function() {
      return Date.now();
    }
  };
}

import VortexEngine from './core/VortexEngine';
import TimelineManager from './core/TimelineManager';
import PhysicsEngine from './core/PhysicsEngine';
import ParticleSystem from './core/ParticleSystem';
import SVGManager from './core/SVGManager';
import WebGLRenderer from './core/WebGLRenderer';
import CSSManager from './core/CSSManager';

import MorphPlugin from './plugins/MorphPlugin';
import TextPlugin from './plugins/TextPlugin';
import ScrollTrigger from './plugins/ScrollTrigger';
import DragPlugin from './plugins/DragPlugin';
import PathPlugin from './plugins/PathPlugin';

import ColorUtils from './utils/ColorUtils';
import DOMUtils from './utils/DOMUtils';
import MathUtils from './utils/MathUtils';
import PerformanceMonitor from './utils/PerformanceMonitor';

/**
 * Основной класс VortexJS
 * @class Vortex
 */
class Vortex {
  constructor() {
    this.plugins = {};
    this._initPlugins();
  }

  _initPlugins() {
    this._registerPlugin(new MorphPlugin(this));
    this._registerPlugin(new TextPlugin(this));
    this._registerPlugin(new ScrollTrigger(this));
    this._registerPlugin(new DragPlugin(this));
    this._registerPlugin(new PathPlugin(this));
  }

  _registerPlugin(plugin) {
    this.plugins[plugin.name] = plugin;
  }

  animate(params) {
    return new VortexEngine(params);
  }

  timeline(params) {
    return new TimelineManager(params);
  }

  physics(options) {
    return new PhysicsEngine(options);
  }

  particles(options) {
    return new ParticleSystem(options);
  }

  svg(element) {
    return new SVGManager(element);
  }

  webgl(canvas, options) {
    return new WebGLRenderer(canvas, options);
  }

  css() {
    return new CSSManager();
  }

  get utils() {
    return {
      color: ColorUtils,
      dom: DOMUtils,
      math: MathUtils,
      performance: PerformanceMonitor
    };
  }

  get plugin() {
    return this.plugins;
  }
}

const vortex = new Vortex();

export {
  VortexEngine,
  TimelineManager,
  PhysicsEngine,
  ParticleSystem,
  SVGManager,
  WebGLRenderer,
  CSSManager,
  MorphPlugin,
  TextPlugin,
  ScrollTrigger,
  DragPlugin,
  PathPlugin,
  ColorUtils,
  DOMUtils,
  MathUtils,
  PerformanceMonitor
};

export default vortex;