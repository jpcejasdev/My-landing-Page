/**
 * Modo claro / oscuro.
 * El tema inicial lo aplica js/theme-init.js; acá solo se maneja el botón.
 */
import { storage } from '../utils/storage.js';

const root = document.documentElement;

export function initThemeToggle(button) {
  button.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    storage.set('theme', next);
  });
}
