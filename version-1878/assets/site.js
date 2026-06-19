(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.nav-links');
    var search = document.querySelector('.header-search');

    if (toggle && nav && search) {
      toggle.addEventListener('click', function () {
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        nav.classList.toggle('is-open');
        search.classList.toggle('is-open');
      });
    }

    var slider = document.querySelector('[data-hero-slider]');
    if (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dots button'));
      var current = 0;

      function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('active', slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('active', dotIndex === current);
        });
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
          show(index);
        });
      });

      show(0);
      setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-card-filter]')).forEach(function (panel) {
      var input = panel.querySelector('[data-filter-input]');
      var grid = document.querySelector('[data-filter-grid]');
      var buttons = Array.prototype.slice.call(panel.querySelectorAll('[data-filter-year]'));
      var activeYear = 'all';

      if (!grid) {
        return;
      }

      if (panel.getAttribute('data-read-query') === 'true' && input) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        input.value = query;
      }

      function normalize(value) {
        return String(value || '').toLowerCase().trim();
      }

      function applyFilter() {
        var keyword = normalize(input ? input.value : '');
        Array.prototype.slice.call(grid.querySelectorAll('.movie-card')).forEach(function (card) {
          var haystack = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-year'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-tags'),
            card.textContent
          ].join(' '));
          var yearMatch = activeYear === 'all' || card.getAttribute('data-year') === activeYear;
          var wordMatch = !keyword || haystack.indexOf(keyword) !== -1;
          card.classList.toggle('is-filter-hidden', !(yearMatch && wordMatch));
        });
      }

      if (input) {
        input.addEventListener('input', applyFilter);
      }

      buttons.forEach(function (button) {
        button.addEventListener('click', function () {
          activeYear = button.getAttribute('data-filter-year') || 'all';
          buttons.forEach(function (item) {
            item.classList.toggle('active', item === button);
          });
          applyFilter();
        });
      });

      applyFilter();
    });
  });
})();
