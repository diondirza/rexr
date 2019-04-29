import { createScript } from '../utils/dom';
import { ANALYTIC_UA } from './constants';

interface LoadScript extends HTMLScriptElement {
  id: string;
  callback: Function;
}

export default function externalScripts() {
  const onLoadScripts: LoadScript[] = [];

  window.addEventListener('DOMContentLoaded', () => {
    (window as any).ga && (window as any).ga('create', ANALYTIC_UA, 'auto', { useAmpClientId: true });
  });

  if (onLoadScripts.length) {
    window.addEventListener('load', () => {
      onLoadScripts.map(createScript);
    });
  }
}
