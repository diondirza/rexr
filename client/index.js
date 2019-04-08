import loadPolyfills from './polyfills';

/**
 * Using webpackMode: "eager" will cause this dynamic import to be part of the main bundle,
 * not creating its own chunk
 */
(async () => {
  await loadPolyfills();
  import(/* webpackMode: "eager" */ './bootstrap.js');
})();
