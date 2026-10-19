/**
 * Carrusel horizontal genérico basado en scroll-snap.
 * - Flechas anterior / siguiente (con vuelta al inicio/final)
 * - Avance automático que se pausa con mouse, foco o touch
 * - Oculta los controles si todo el contenido entra en pantalla
 */
import { prefersReducedMotion } from '../utils/dom.js';

const EDGE_TOLERANCE = 4; // px de margen al detectar inicio/fin del scroll

export function createCarousel({ track, controls, prevButton, nextButton, intervalMs = 5000 }) {
  let timerId = null;
  let paused = false;
  const reduceMotion = prefersReducedMotion();
  const behavior = reduceMotion ? 'auto' : 'smooth';

  const hasOverflow = () => track.scrollWidth > track.clientWidth + EDGE_TOLERANCE;
  const isAtStart = () => track.scrollLeft <= EDGE_TOLERANCE;
  const isAtEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - EDGE_TOLERANCE;

  function stepSize() {
    const slide = track.firstElementChild;
    if (!slide) return track.clientWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return slide.getBoundingClientRect().width + gap;
  }

  function go(direction) {
    if (direction > 0 && isAtEnd()) track.scrollTo({ left: 0, behavior });
    else if (direction < 0 && isAtStart()) track.scrollTo({ left: track.scrollWidth, behavior });
    else track.scrollBy({ left: direction * stepSize(), behavior });
  }

  function startAutoplay() {
    clearInterval(timerId);
    if (reduceMotion || !hasOverflow()) return;
    timerId = setInterval(() => {
      if (!paused && !document.hidden) go(1);
    }, intervalMs);
  }

  /** Recalcula controles y autoplay (llamar después de cambiar el contenido). */
  function refresh() {
    controls.hidden = !hasOverflow();
    startAutoplay();
  }

  prevButton.addEventListener('click', () => { go(-1); startAutoplay(); });
  nextButton.addEventListener('click', () => { go(1); startAutoplay(); });

  const pause = () => { paused = true; };
  const resume = () => { paused = false; };
  track.addEventListener('mouseenter', pause);
  track.addEventListener('mouseleave', resume);
  track.addEventListener('focusin', pause);
  track.addEventListener('focusout', resume);
  track.addEventListener('touchstart', pause, { passive: true });
  track.addEventListener('touchend', () => setTimeout(resume, 4000), { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refresh, 150);
  });

  return { refresh };
}
