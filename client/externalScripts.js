import { createScript } from '../utils/dom';
import { ANALYTIC_UA } from './constants';

export default function externalScripts() {
  const onLoadScripts = [];

  window.addEventListener('DOMContentLoaded', () => {
    window.ga && window.ga('create', ANALYTIC_UA, 'auto', { useAmpClientId: true });
  });

  if (onLoadScripts.length) {
    window.addEventListener('load', () => {
      onLoadScripts.map(createScript);
    });
  }
}
