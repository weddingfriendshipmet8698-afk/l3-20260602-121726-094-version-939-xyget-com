(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function escapeHTML(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-site-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function move(step) {
      show(current + step);
    }

    function play() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        move(1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        move(-1);
        play();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        move(1);
        play();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        play();
      });
    });
    show(0);
    play();
  }

  function initSearch() {
    var index = window.SEARCH_INDEX || [];
    var boxes = Array.prototype.slice.call(document.querySelectorAll("[data-search-box]"));
    boxes.forEach(function (box) {
      var shell = box.closest(".search-shell") || document;
      var results = shell.querySelector("[data-search-results]");
      if (!results) {
        return;
      }
      box.addEventListener("input", function () {
        var query = box.value.trim().toLowerCase();
        if (!query) {
          results.classList.remove("is-open");
          results.innerHTML = "";
          return;
        }
        var hits = index.filter(function (item) {
          return String(item.search || "").toLowerCase().indexOf(query) !== -1;
        }).slice(0, 12);
        if (!hits.length) {
          results.innerHTML = '<div class="search-hit"><span></span><span>没有找到相关影片</span></div>';
          results.classList.add("is-open");
          return;
        }
        results.innerHTML = hits.map(function (item) {
          return '<a class="search-hit" href="' + escapeHTML(item.url) + '">' +
            '<img src="' + escapeHTML(item.image) + '" alt="' + escapeHTML(item.title) + '">' +
            '<span><strong>' + escapeHTML(item.title) + '</strong><span>' + escapeHTML(item.genre) + ' · ' + escapeHTML(item.year) + '</span></span>' +
            '</a>';
        }).join("");
        results.classList.add("is-open");
      });
      document.addEventListener("click", function (event) {
        if (!shell.contains(event.target)) {
          results.classList.remove("is-open");
        }
      });
    });
  }

  function initLocalFilter() {
    var input = document.querySelector("[data-local-filter]");
    var year = document.querySelector("[data-year-filter]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    if (!input && !year) {
      return;
    }

    function apply() {
      var query = input ? input.value.trim().toLowerCase() : "";
      var selectedYear = year ? year.value : "";
      cards.forEach(function (card) {
        var text = String(card.getAttribute("data-search-text") || "").toLowerCase();
        var cardYear = card.getAttribute("data-year") || "";
        var ok = (!query || text.indexOf(query) !== -1) && (!selectedYear || selectedYear === cardYear);
        card.classList.toggle("is-hidden", !ok);
      });
    }

    if (input) {
      input.addEventListener("input", apply);
    }
    if (year) {
      year.addEventListener("change", apply);
    }
  }

  onReady(function () {
    initMenu();
    initHero();
    initSearch();
    initLocalFilter();
  });
})();
