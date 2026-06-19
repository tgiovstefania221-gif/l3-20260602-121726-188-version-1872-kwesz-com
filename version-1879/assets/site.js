(function () {
  function getQuery(name) {
    return new URLSearchParams(window.location.search).get(name) || '';
  }

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function setupMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!button || !menu) return;
    button.addEventListener('click', function () {
      menu.classList.toggle('hidden');
    });
  }

  function setupFilters() {
    var inputs = document.querySelectorAll('[data-filter-input]');
    inputs.forEach(function (input) {
      var scope = input.closest('[data-filter-scope]') || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
      var buttons = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-value]'));
      var active = 'all';

      function apply() {
        var q = normalize(input.value);
        cards.forEach(function (card) {
          var text = normalize(card.getAttribute('data-search-text'));
          var values = normalize(card.getAttribute('data-filter-values'));
          var textOk = !q || text.indexOf(q) !== -1;
          var valueOk = active === 'all' || values.indexOf(active) !== -1;
          card.classList.toggle('filter-hidden', !(textOk && valueOk));
        });
      }

      input.addEventListener('input', apply);
      buttons.forEach(function (button) {
        button.addEventListener('click', function () {
          active = normalize(button.getAttribute('data-filter-value')) || 'all';
          buttons.forEach(function (b) {
            b.classList.remove('bg-primary-600', 'text-white', 'shadow-md');
            b.classList.add('bg-white', 'text-secondary-700');
          });
          button.classList.remove('bg-white', 'text-secondary-700');
          button.classList.add('bg-primary-600', 'text-white', 'shadow-md');
          apply();
        });
      });
      apply();
    });
  }

  function setupCategoryPanels() {
    var buttons = document.querySelectorAll('[data-category-tab]');
    var panels = document.querySelectorAll('[data-category-panel]');
    if (!buttons.length || !panels.length) return;
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var key = button.getAttribute('data-category-tab');
        buttons.forEach(function (b) {
          b.classList.remove('bg-primary-600', 'text-white', 'shadow-md');
          b.classList.add('bg-white', 'text-secondary-700');
        });
        button.classList.remove('bg-white', 'text-secondary-700');
        button.classList.add('bg-primary-600', 'text-white', 'shadow-md');
        panels.forEach(function (panel) {
          panel.classList.toggle('hidden', panel.getAttribute('data-category-panel') !== key);
        });
      });
    });
  }

  function setupSearchPage() {
    var page = document.querySelector('[data-search-page]');
    if (!page) return;
    var q = getQuery('q');
    var input = page.querySelector('[data-filter-input]');
    if (input && q) {
      input.value = q;
      input.dispatchEvent(new Event('input'));
    }
  }

  setupMenu();
  setupCategoryPanels();
  setupFilters();
  setupSearchPage();
})();
