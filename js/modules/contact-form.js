/**
 * Formulario "Contratá mis servicios".
 * Valida los datos y los envía al Google Apps Script configurado en
 * js/config.js, que los reenvía por WhatsApp sin exponer el número.
 */
import { t, getLang, onLangChange } from './i18n.js';

const VALIDATORS = {
  name: (value) => value.length >= 2,
  phone: (value) => /^\+?[\d\s()-]{8,20}$/.test(value) && value.replace(/\D/g, '').length >= 8,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value),
  reason: (value) => value.length >= 10,
};
const FIELDS = Object.keys(VALIDATORS);

export function initContactForm(form, { endpoint }) {
  const statusEl = form.querySelector('[data-form-status]');
  const submitButton = form.querySelector('[type="submit"]');
  const submitLabel = submitButton.querySelector('[data-i18n]');
  const field = (name) => form.elements.namedItem(name);
  const errorEl = (name) => form.querySelector(`[data-err="${name}"]`);

  let statusKey = '';

  /* ---------- UI ---------- */

  function setStatus(key) {
    statusKey = key;
    statusEl.className = 'form-status';
    if (key) statusEl.classList.add(key === 'form.ok' ? 'ok' : 'err');
    statusEl.textContent = key ? t(key) : '';
  }

  function setFieldError(name, errorKey) {
    const el = errorEl(name);
    const input = field(name);
    el.closest('.field').classList.toggle('invalid', Boolean(errorKey));
    input.setAttribute('aria-invalid', errorKey ? 'true' : 'false');
    el.dataset.key = errorKey || '';
    el.textContent = errorKey ? t(errorKey) : '';
  }

  function setSending(isSending) {
    submitButton.disabled = isSending;
    submitLabel.textContent = t(isSending ? 'form.sending' : 'form.submit');
  }

  /* ---------- Datos y validación ---------- */

  function readValues() {
    return Object.fromEntries(FIELDS.map((name) => [name, field(name).value.trim()]));
  }

  /** Marca los campos inválidos y devuelve true si todo es válido. */
  function validate(values) {
    const invalid = FIELDS.filter((name) => !VALIDATORS[name](values[name]));
    FIELDS.forEach((name) => setFieldError(name, invalid.includes(name) ? `err.${name}` : ''));
    if (invalid.length) field(invalid[0]).focus();
    return invalid.length === 0;
  }

  /* ---------- Envío ---------- */

  async function send(values) {
    // Apps Script no devuelve cabeceras CORS legibles, por eso se usa 'no-cors'
    // con Content-Type text/plain (no dispara preflight). La contra: no se
    // puede leer la respuesta, solo detectar errores de red.
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ ...values, lang: getLang(), page: location.href }),
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('');

    const values = readValues();
    if (!validate(values)) return;

    // Campo trampa completado → es un bot: fingimos éxito sin enviar nada.
    if (field('website').value) {
      form.reset();
      setStatus('form.ok');
      return;
    }

    if (!endpoint) {
      console.warn('[contact-form] Falta configurar formEndpoint en js/config.js');
      setStatus('form.err');
      return;
    }

    setSending(true);
    try {
      await send(values);
      form.reset();
      setStatus('form.ok');
    } catch (error) {
      console.error('[contact-form] Error al enviar:', error);
      setStatus('form.err');
    } finally {
      setSending(false);
    }
  }

  /* ---------- Eventos ---------- */

  form.addEventListener('submit', handleSubmit);

  // Borra el error de un campo apenas el usuario lo corrige.
  form.addEventListener('input', (event) => {
    if (FIELDS.includes(event.target.name)) setFieldError(event.target.name, '');
  });

  // Re-traduce los mensajes visibles al cambiar de idioma.
  onLangChange(() => {
    FIELDS.forEach((name) => {
      const el = errorEl(name);
      if (el.dataset.key) el.textContent = t(el.dataset.key);
    });
    if (statusKey) setStatus(statusKey);
  });
}
