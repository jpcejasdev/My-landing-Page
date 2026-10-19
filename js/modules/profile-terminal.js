/**
 * Renderiza la "terminal" decorativa del hero con el perfil en formato JSON.
 */
import { t } from './i18n.js';
import { escapeHtml } from '../utils/dom.js';

const key = (k) => `<span class="c-key">"${k}"</span>`;
const str = (v) => `<span class="c-str">"${escapeHtml(v)}"</span>`;
const punct = (v) => `<span class="c-pun">${v}</span>`;

export function renderProfile(container) {
  const lines = [
    '<span class="c-com">$ curl /api/me</span>',
    '<span class="c-ok">200 OK</span>',
    punct('{'),
    `  ${key('name')}${punct(':')} ${str('Juan Pablo Cejas')}${punct(',')}`,
    `  ${key('role')}${punct(':')} ${str(t('code.role'))}${punct(',')}`,
    `  ${key('university')}${punct(':')} ${str('UNLP')}${punct(',')}`,
    `  ${key('focus')}${punct(': [')}${str('backend')}${punct(', ')}${str('APIs')}${punct(', ')}${str(t('code.focus3'))}${punct('],')}`,
    `  ${key('status')}${punct(':')} ${str(t('code.status'))}`,
    `${punct('}')} <span class="cursor"></span>`,
  ];
  container.innerHTML = lines.join('\n');
}
