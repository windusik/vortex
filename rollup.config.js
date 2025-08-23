import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.js'];

export default {
  input: 'src/vortex.js',
  output: [
    {
      file: 'dist/vortex.cjs.js',
      format: 'cjs'
    },
    {
      file: 'dist/vortex.esm.js',
      format: 'esm'
    },
    {
      file: 'dist/vortex.min.js',
      format: 'iife',
      name: 'vortex',
      plugins: [terser()]
    }
  ],
  plugins: [
    babel({
      babelHelpers: 'bundled',
      presets: [['@babel/preset-env', {
        targets: {
          browsers: ['> 1%', 'last 2 versions']
        }
      }]],
      exclude: 'node_modules/**',
      extensions
    })
  ]
};