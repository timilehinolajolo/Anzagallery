'use strict';

const App = (() => {
  let allOrgs = [];
  const filters = { search: '', type: '' };

  // ── Icons (inline SVG strings) ─────────────────────────────────────────
  const ICONS = {
    website: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,

    github: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`,

    community: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  };

  // ── Bootstrap ──────────────────────────────────────────────────────────
  async function init() {
    try {
      const response = await fetch('data/orgs.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      allOrgs = await response.json();
      allOrgs.sort((a, b) => a.name.localeCompare(b.name));
      hide('loading-state');
      attachEventListeners();
      render();
    } catch (err) {
      hide('loading-state');
      showError(`Could not load organizations — ${err.message}`);
    }
  }

  // ── Event listeners ────────────────────────────────────────────────────
  function attachEventListeners() {
    document.getElementById('search').addEventListener('input', e => {
      filters.search = e.target.value.toLowerCase().trim();
      render();
    });

    document.getElementById('type-filter').addEventListener('change', e => {
      filters.type = e.target.value;
      render();
    });

    document.getElementById('clear-filters').addEventListener('click', clearFilters);

    document.getElementById('reset-link').addEventListener('click', e => {
      e.preventDefault();
      clearFilters();
    });
  }

  function clearFilters() {
    filters.search = '';
    filters.type   = '';
    document.getElementById('search').value      = '';
    document.getElementById('type-filter').value = '';
    render();
  }

  function isFiltering() {
    return filters.search || filters.type;
  }

  // ── Filter logic ───────────────────────────────────────────────────────
  function getFiltered() {
    return allOrgs.filter(org => {
      const matchSearch = !filters.search ||
        org.name.toLowerCase().includes(filters.search) ||
        org.description.toLowerCase().includes(filters.search);

      const matchType = !filters.type || org.type === filters.type;

      return matchSearch && matchType;
    });
  }

  // ── Render ─────────────────────────────────────────────────────────────
  function render() {
    const filtered = getFiltered();
    const count    = filtered.length;
    const total    = allOrgs.length;
    const grid     = document.getElementById('card-grid');

    document.getElementById('results-count').textContent = isFiltering()
      ? `${count} of ${total} organizations`
      : `${total} organizations`;

    isFiltering() ? show('clear-filters') : hide('clear-filters');

    if (count === 0) {
      grid.innerHTML = '';
      show('empty-state');
      return;
    }

    hide('empty-state');
    grid.innerHTML = filtered.map(createCard).join('');
  }

  function createCard(org) {
    const badgeClass = `badge-${org.type.toLowerCase()}`;

    const websiteLink = org.website
      ? `<a href="${esc(org.website)}" class="org-link" target="_blank" rel="noopener noreferrer" title="Website">${ICONS.website}</a>`
      : '';

    const githubLink = org.github
      ? `<a href="${esc(org.github)}" class="org-link" target="_blank" rel="noopener noreferrer" title="GitHub">${ICONS.github}</a>`
      : '';

    const communityLink = org.community
      ? `<a href="${esc(org.community)}" class="org-link" target="_blank" rel="noopener noreferrer" title="Community">${ICONS.community}</a>`
      : '';

    return `
      <article class="org-card" role="listitem">
        <div class="card-header">
          <h2 class="org-name">${esc(org.name)}</h2>
          <span class="type-badge ${badgeClass}">${esc(org.type)}</span>
        </div>
        <div class="card-body">
          <p class="org-description">${esc(org.description)}</p>
        </div>
        <div class="card-footer">
          <div class="org-links">
            ${websiteLink}${githubLink}${communityLink}
          </div>
        </div>
      </article>
    `.trim();
  }

  // ── Utilities ──────────────────────────────────────────────────────────
  function esc(str) {
    return String(str).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  function show(id) { document.getElementById(id).classList.remove('hidden'); }
  function hide(id) { document.getElementById(id).classList.add('hidden'); }

  function showError(message) {
    document.getElementById('error-message').textContent = message;
    show('error-state');
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
