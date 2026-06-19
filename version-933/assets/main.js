(function () {
  var menuButton = document.querySelector('[data-mobile-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-hero-slider]').forEach(function (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    restart();
  });

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilters(scope) {
    var queryInput = scope.querySelector('[data-search-input]');
    var yearSelect = scope.querySelector('[data-year-filter]');
    var typeSelect = scope.querySelector('[data-type-filter]');
    var grid = scope.parentElement.parentElement.querySelector('.searchable-grid') || document.querySelector('.searchable-grid');

    if (!grid) {
      return;
    }

    var query = normalize(queryInput && queryInput.value);
    var year = normalize(yearSelect && yearSelect.value);
    var type = normalize(typeSelect && typeSelect.value);
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-tags'),
        card.getAttribute('data-type'),
        card.getAttribute('data-year')
      ].join(' '));
      var matchesQuery = !query || haystack.indexOf(query) !== -1;
      var matchesYear = !year || normalize(card.getAttribute('data-year')) === year;
      var matchesType = !type || normalize(card.getAttribute('data-type')) === type;
      card.classList.toggle('is-hidden', !(matchesQuery && matchesYear && matchesType));
    });
  }

  document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
    var searchParams = new URLSearchParams(window.location.search);
    var preset = searchParams.get('q') || '';
    var queryInput = scope.querySelector('[data-search-input]');

    if (queryInput && preset) {
      queryInput.value = preset;
    }

    scope.querySelectorAll('input, select').forEach(function (control) {
      control.addEventListener('input', function () {
        applyFilters(scope);
      });
      control.addEventListener('change', function () {
        applyFilters(scope);
      });
    });

    applyFilters(scope);
  });
})();
