import loadPolyfills from './polyfills';

/**
 * Using webpackMode: "eager" will cause this dynamic import to be part of the main bundle,
 * not creating its own chunk
 */

window.onerror = (message, url, line, col, error) => {
  console.error(error.stack);
  // TO-DO: create global function to show error on screen
  // global.showErrorScreen(message);
};

(async () => {
  await loadPolyfills();
  import(/* webpackMode: "eager" */ './bootstrap.js');
})();
