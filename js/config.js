/**
 * Configuración general del sitio.
 * Es el único archivo que tenés que tocar para conectar el formulario.
 */
export const CONFIG = Object.freeze({
  /**
   * URL de la aplicación web de Google Apps Script (termina en /exec).
   * Ver README → "Formulario de contacto".
   * Tu número de WhatsApp NO va acá: queda guardado en Google, en privado.
   */
  formEndpoint: 'https://script.google.com/macros/s/AKfycbz7GuDqxajYN7a_khStLbmqCHA4pHLa9vKo3BO4YLzn6Bpa8b5orjMSgMvRNtaDsUlZ/exec',

  /** Cada cuántos milisegundos avanza solo el carrusel de proyectos. */
  carouselIntervalMs: 5000,

  /** Link al que lleva la tarjeta "Próximamente" mientras no haya proyectos. */
  githubUrl: 'https://github.com/JuampyCejas',
});
