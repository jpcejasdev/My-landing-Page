/*
 * Se carga de forma bloqueante en el <head> para aplicar el tema y el
 * idioma ANTES de que se pinte la página. Así se evita el "parpadeo"
 * del modo claro al entrar en modo oscuro.
 * Es un script clásico (no módulo) a propósito: los módulos se ejecutan
 * después del render.
 */
(function () {
  var theme;
  var lang;

  try {
    theme = localStorage.getItem('theme');
    lang = localStorage.getItem('lang');
  } catch (e) {
    /* localStorage puede no estar disponible (modo privado, etc.) */
  }

  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  if (lang !== 'es' && lang !== 'en') {
    lang = (navigator.language || 'es').toLowerCase().indexOf('es') === 0 ? 'es' : 'en';
  }

  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.lang = lang;
})();
