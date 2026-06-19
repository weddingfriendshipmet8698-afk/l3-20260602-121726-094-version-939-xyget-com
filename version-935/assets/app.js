(function() {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');

  if (toggle && header) {
    toggle.addEventListener('click', function() {
      header.classList.toggle('menu-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function(slide, i) {
      slide.classList.toggle('active', i === current);
    });
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }

  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() {
      showSlide(i);
    });
  });

  if (slides.length > 1) {
    setInterval(function() {
      showSlide(current + 1);
    }, 5200);
  }

  var autofillInput = document.querySelector('[data-autofill-query]');
  if (autofillInput) {
    var params = new URLSearchParams(window.location.search);
    var queryValue = params.get('q');
    if (queryValue) {
      autofillInput.value = queryValue;
    }
  }

  function filterCards(value) {
    var term = value.trim().toLowerCase();
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-list] .movie-card'));
    cards.forEach(function(card) {
      var haystack = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
      card.classList.toggle('is-hidden', Boolean(term) && haystack.indexOf(term) === -1);
    });
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-live-search]'));
  searchInputs.forEach(function(input) {
    if (input.value) {
      filterCards(input.value);
    }
    input.addEventListener('input', function() {
      filterCards(input.value);
    });
  });
})();
