/**
 * Математические утилиты
 * @namespace MathUtils
 */
const MathUtils = {
  // Линейная интерполяция
  lerp(start, end, t) {
    return start * (1 - t) + end * t;
  },

  // Ограничение значения в диапазоне
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  // Отображение значения из одного диапазона в другой
  map(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  },

  // Округление до указанного количества знаков
  round(value, decimals = 0) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  },

  // Генерация случайного числа в диапазоне
  random(min, max) {
    return Math.random() * (max - min) + min;
  },

  // Генерация случайного целого числа в диапазоне
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Проверка на четность
  isEven(value) {
    return value % 2 === 0;
  },

  // Проверка на нечетность
  isOdd(value) {
    return Math.abs(value % 2) === 1;
  },

  // Факториал
  factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    
    return result;
  },

  // Преобразование градусов в радианы
  degToRad(degrees) {
    return degrees * Math.PI / 180;
  },

  // Преобразование радиан в градусы
  radToDeg(radians) {
    return radians * 180 / Math.PI;
  },

  // Вычисление расстояния между двумя точками
  distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  },

  // Вычисление угла между двумя точками
  angleBetween(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  },

  // Нормализация угла в диапазон [0, 360)
  normalizeAngle(angle) {
    angle = angle % 360;
    return angle < 0 ? angle + 360 : angle;
  },

  // Вычисление среднего значения массива
  average(arr) {
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  },

  // Вычисление медианы массива
  median(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    
    return sorted.length % 2 === 0 ?
      (sorted[middle - 1] + sorted[middle]) / 2 :
      sorted[middle];
  },

  // Вычисление стандартного отклонения
  standardDeviation(arr) {
    const avg = this.average(arr);
    const squareDiffs = arr.map(val => Math.pow(val - avg, 2));
    return Math.sqrt(this.average(squareDiffs));
  }
};

export default MathUtils;