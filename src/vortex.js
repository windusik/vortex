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
    // Инициализация всех плагинов
    this._registerPlugin(new MorphPlugin(this));
    this._registerPlugin(new TextPlugin(this));
    this._registerPlugin(new ScrollTrigger(this));
    this._registerPlugin(new DragPlugin(this));
    this._registerPlugin(new PathPlugin(this));
  }

  _registerPlugin(plugin) {
    this.plugins[plugin.name] = plugin;
  }

  // Основной метод для создания анимации
  animate(params) {
    return new VortexEngine(params);
  }

  // Создание временной линии
  timeline(params) {
    return new TimelineManager(params);
  }

  // Создание физического движка
  physics(options) {
    return new PhysicsEngine(options);
  }

  // Создание системы частиц
  particles(options) {
    return new ParticleSystem(options);
  }

  // Работа с SVG
  svg(element) {
    return new SVGManager(element);
  }

  // WebGL рендерер
  webgl(canvas, options) {
    return new WebGLRenderer(canvas, options);
  }

  // CSS анимации
  css() {
    return new CSSManager();
  }

  // Утилиты
  get utils() {
    return {
      color: ColorUtils,
      dom: DOMUtils,
      math: MathUtils,
      performance: PerformanceMonitor
    };
  }

  // Доступ к плагинам
  get plugin() {
    return this.plugins;
  }
}

// Создаем глобальный экземпляр
const vortex = new Vortex();

// Экспортируем основные классы
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

// Экспортируем основной экземпляр по умолчанию
export default vortex;