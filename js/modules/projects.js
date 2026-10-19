/**
 * Renderiza las tarjetas de proyectos dentro del carrusel.
 * Los datos vienen de js/data/projects.js.
 */
import { PROJECTS } from '../data/projects.js';
import { t, localize } from './i18n.js';
import { escapeHtml } from '../utils/dom.js';
import { createCarousel } from './carousel.js';

function initials(text) {
  const letters = text.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]);
  return letters.join('').toUpperCase() || '·';
}

function cardTemplate({ href, thumb, title, description, tags = [], linkText, extraClass = '' }) {
  const tagList = tags.length
    ? `<ul class="tags">${tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join('')}</ul>`
    : '';

  return `
    <li class="slide ${extraClass}">
      <a class="project-card" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">
        <div class="thumb">${thumb}</div>
        <div class="card-body">
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(description)}</p>
          ${tagList}
          <span class="card-link">${escapeHtml(linkText)} <span aria-hidden="true">→</span></span>
        </div>
      </a>
    </li>`;
}

function projectCard(project) {
  const title = localize(project.title);
  const thumb = project.image
    ? `<img src="${escapeHtml(project.image)}" alt="" loading="lazy">`
    : `<span class="thumb-initials">${escapeHtml(initials(title))}</span>`;

  return cardTemplate({
    href: project.url || '#',
    thumb,
    title,
    description: localize(project.description),
    tags: project.tags,
    linkText: t('projects.view'),
  });
}

function placeholderCard(fallbackUrl) {
  return cardTemplate({
    href: fallbackUrl,
    thumb: '<span class="thumb-initials">{ }</span>',
    title: t('projects.soon.t'),
    description: t('projects.soon.d'),
    linkText: t('projects.soon.l'),
    extraClass: 'placeholder',
  });
}

export function initProjects({ track, controls, prevButton, nextButton, intervalMs, fallbackUrl }) {
  const carousel = createCarousel({ track, controls, prevButton, nextButton, intervalMs });

  function render() {
    const scrollPosition = track.scrollLeft;
    track.innerHTML = PROJECTS.length
      ? PROJECTS.map(projectCard).join('')
      : placeholderCard(fallbackUrl);
    track.scrollLeft = scrollPosition;
    carousel.refresh();
  }

  return { render };
}
