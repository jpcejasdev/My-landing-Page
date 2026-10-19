/**
 * Animación de entrada: los elementos con .reveal aparecen al entrar en pantalla.
 */
import { $$, prefersReducedMotion } from '../utils/dom.js';

export function initReveal(selector = '.reveal') {
  const elements = $$(selector);

  if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
    elements.forEach((el) => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  elements.forEach((el) => observer.observe(el));
}
