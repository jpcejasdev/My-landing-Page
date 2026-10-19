/**
 * Punto de entrada: inicializa cada módulo de la página.
 */
import { CONFIG } from './config.js';
import { $ } from './utils/dom.js';
import { initI18n, onLangChange } from './modules/i18n.js';
import { initThemeToggle } from './modules/theme.js';
import { renderProfile } from './modules/profile-terminal.js';
import { initProjects } from './modules/projects.js';
import { initContactForm } from './modules/contact-form.js';
import { initReveal } from './modules/reveal.js';

initThemeToggle($('#theme-toggle'));

const projects = initProjects({
  track: $('#projects-track'),
  controls: $('#carousel-controls'),
  prevButton: $('#prev'),
  nextButton: $('#next'),
  intervalMs: CONFIG.carouselIntervalMs,
  fallbackUrl: CONFIG.githubUrl,
});

initContactForm($('#contact-form'), { endpoint: CONFIG.formEndpoint });

// Contenido generado por JS que depende del idioma.
onLangChange(() => {
  renderProfile($('#profile-code'));
  projects.render();
});

// Aplica el idioma inicial (dispara los renders de arriba).
initI18n($('#lang-toggle'));

initReveal();

$('#year').textContent = new Date().getFullYear();
