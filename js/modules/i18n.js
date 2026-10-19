/**
 
 * Traduce los elementos marcados con data-i18n* y avisa a otros módulos
 * cuando cambia el idioma, para que vuelvan a renderizar su contenido.
 */
import { TRANSLATIONS } from '../data/translations.js';
import { $$ } from '../utils/dom.js';
import { storage } from '../utils/storage.js';

const SUPPORTED = ['es', 'en'];
const DEFAULT_LANG = 'es';
const root = document.documentElement;
const listeners = new Set();

let currentLang = SUPPORTED.includes(root.lang) ? root.lang : DEFAULT_LANG;

export const getLang = () => currentLang;

/** Devuelve el texto de una clave en el idioma actual (con fallback a español). */
export function t(key) {
  return TRANSLATIONS[currentLang]?.[key] ?? TRANSLATIONS[DEFAULT_LANG][key] ?? key;
}

/** Devuelve el valor localizado de un campo { es, en } o un string simple. */
export function localize(value) {
  if (typeof value === 'string') return value;
  return value?.[currentLang] ?? value?.[DEFAULT_LANG] ?? '';
}

/** Registra una función que se ejecuta cada vez que cambia el idioma. */
export function onLangChange(callback) {
  listeners.add(callback);
}

function applyTranslations() {
  root.lang = currentLang;
  document.title = t('meta.title');

  $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  // Solo para textos propios y confiables (traducciones), nunca para datos del usuario.
  $$('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
  $$('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  $$('[data-i18n-aria]').forEach((el) => {
    const label = t(el.dataset.i18nAria);
    el.setAttribute('aria-label', label);
    el.setAttribute('title', label);
  });

  listeners.forEach((callback) => callback(currentLang));
}

export function setLang(lang) {
  if (!SUPPORTED.includes(lang)) return;
  currentLang = lang;
  storage.set('lang', lang);
  applyTranslations();
}

/** Conecta el botón ES/EN y aplica el idioma inicial. */
export function initI18n(toggleButton) {
  const markActive = () => {
    $$('[data-lang]', toggleButton).forEach((el) => {
      el.classList.toggle('active', el.dataset.lang === currentLang);
    });
  };

  onLangChange(markActive);
  toggleButton.addEventListener('click', () => setLang(currentLang === 'es' ? 'en' : 'es'));
  applyTranslations();
}
