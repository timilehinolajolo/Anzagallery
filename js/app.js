'use strict';

const App = (() => {
  let allIssues = [];
  const filters = { search: '', language: '', org: '' };

  // ── Bootstrap ──────────────────────────────────────────────────────────
  async function init() {
    try {
      const response = await fetch('data/issues.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      allIssues = await response.json();
      allIssues.sort((a, b) => b.date_added.localeCompare(a.date_added));
      hide('loading-state');
      buildFilterOptions(allIssues);
      attachEventListeners();
      render();
    } catch (err) {
      hide('loading-state');
      showError(`Could not load issues — ${err.message}`);
    }
  }

  // ── Filters ────────────────────────────────────────────────────────────
  function buildFilterOptions(issues) {
    const languages = [...new Set(issues.flatMap(i => i.languages))].sort();
    const orgs      = [...new Set(issues.map(i => i.org))].sort();
    populateSelect('language-filter', languages);
    populateSelect('org-filter', orgs);
  }

  function populateSelect(id, options) {
    const select = document.getElementById(id);
    options.forEach(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function attachEventListeners() {
    document.getElementById('search').addEventListener('input', e => {
      filters.search = e.target.value.toLowerCase().trim();
      render();
    });

    document.getElementById('language-filter').addEventListener('change', e => {
      filters.language = e.target.value;
      render();
    });

    document.getElementById('org-filter').addEventListener('change', e => {
      filters.org = e.target.value;
      render();
    });

    document.getElementById('clear-filters').addEventListener('click', clearFilters);

    document.getElementById('reset-link').addEventListener('click', e => {
      e.preventDefault();
      clearFilters();
    });
  }

  function clearFilters() {
    filters.search   = '';
    filters.language = '';
    filters.org      = '';
    document.getElementById('search').value          = '';
    document.getElementById('language-filter').value = '';
    document.getElementById('org-filter').value      = '';
    render();
  }

  function isFiltering() {
    return filters.search || filters.language || filters.org;
  }

  function getFiltered() {
    return allIssues.filter(issue => {
      const matchSearch = !filters.search ||
        issue.title.toLowerCase().includes(filters.search) ||
        issue.org.toLowerCase().includes(filters.search) ||
        (issue.tags || []).some(t => t.toLowerCase().includes(filters.search));

      const matchLanguage = !filters.language ||
        issue.languages.includes(filters.language);

      const matchOrg = !filters.org || issue.org === filters.org;

      return matchSearch && matchLanguage && matchOrg;
    });
  }

  // ── Render ─────────────────────────────────────────────────────────────
  function render() {
    const filtered = getFiltered();
    const count    = filtered.length;
    const total    = allIssues.length;
    const grid     = document.getElementById('card-grid');

    document.getElementById('results-count').textContent =
      isFiltering()
        ? `${count} of ${total} issue${total !== 1 ? 's' : ''}`
        : `${total} issue${total !== 1 ? 's' : ''}`;

    isFiltering()
      ? show('clear-filters')
      : hide('clear-filters');

    if (count === 0) {
      grid.innerHTML = '';
      show('empty-state');
      return;
    }

    hide('empty-state');
    grid.innerHTML = filtered.map(createCard).join('');
  }

  function createCard(issue) {
    const logoHtml = issue.logo
      ? `<img src="${esc(issue.logo)}" alt="${esc(issue.org)} logo" class="org-logo" width="40" height="40" loading="lazy" onerror="this.outerHTML='<span class=org-logo-fallback>${esc(issue.org.charAt(0))}</span>'">`
      : `<span class="org-logo-fallback">${esc(issue.org.charAt(0))}</span>`;

    const languageTags = issue.languages
      .map(lang => `<span class="tag tag-language">${esc(lang)}</span>`)
      .join('');

    const topicTags = (issue.tags || [])
      .map(tag => `<span class="tag tag-topic">${esc(tag)}</span>`)
      .join('');

    return `
      <article class="issue-card" role="listitem">
        <div class="card-header">
          ${logoHtml}
          <span class="org-name">${esc(issue.org)}</span>
        </div>
        <div class="card-body">
          <span class="issue-number">#${esc(String(issue.issue_number))}</span>
          <h2 class="issue-title">${esc(issue.title)}</h2>
        </div>
        <div class="card-footer">
          <div class="tags">${languageTags}${topicTags}</div>
          <a
            href="${esc(issue.url)}"
            class="view-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View issue #${esc(String(issue.issue_number))} on GitHub"
          >View &rarr;</a>
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
    const el = document.getElementById('error-state');
    document.getElementById('error-message').textContent = message;
    el.classList.remove('hidden');
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
