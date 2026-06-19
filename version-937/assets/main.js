(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function normalize(value) {
        return (value || '').toString().toLowerCase().trim();
    }

    function setupMenu() {
        var button = qs('.menu-toggle');
        var nav = qs('.site-nav');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            var open = nav.classList.toggle('open');
            button.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    function setupHero() {
        var hero = qs('.hero');
        if (!hero) {
            return;
        }
        var slides = qsa('.hero-slide', hero);
        var featureTitle = qs('[data-hero-title]', hero);
        var featureDesc = qs('[data-hero-desc]', hero);
        var featureLink = qs('[data-hero-link]', hero);
        var featureImage = qs('[data-hero-image]', hero);
        var dots = qsa('.hero-dot', hero);
        var active = 0;

        function show(index) {
            if (!slides.length) {
                return;
            }
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === active);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === active);
            });
            var slide = slides[active];
            if (featureTitle) {
                featureTitle.textContent = slide.getAttribute('data-title') || '';
            }
            if (featureDesc) {
                featureDesc.textContent = slide.getAttribute('data-desc') || '';
            }
            if (featureLink) {
                featureLink.href = slide.getAttribute('data-link') || './library.html';
            }
            if (featureImage) {
                featureImage.src = slide.getAttribute('data-image') || './1.jpg';
                featureImage.alt = slide.getAttribute('data-title') || '';
            }
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
            });
        });

        show(0);
        if (slides.length > 1) {
            window.setInterval(function () {
                show(active + 1);
            }, 5200);
        }
    }

    function setupSearch() {
        var input = qs('[data-search-input]');
        var cards = qsa('.movie-card');
        var buttons = qsa('[data-filter-value]');
        var current = 'all';

        function matches(card, query) {
            var text = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-year'),
                card.getAttribute('data-type'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-category')
            ].join(' '));
            var type = normalize(card.getAttribute('data-type') + ' ' + card.getAttribute('data-genre') + ' ' + card.getAttribute('data-category'));
            var passQuery = !query || text.indexOf(query) !== -1;
            var passFilter = current === 'all' || type.indexOf(current) !== -1;
            return passQuery && passFilter;
        }

        function apply() {
            var query = normalize(input ? input.value : '');
            cards.forEach(function (card) {
                card.classList.toggle('is-hidden', !matches(card, query));
            });
        }

        if (input) {
            input.addEventListener('input', apply);
        }
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                buttons.forEach(function (item) {
                    item.classList.remove('active');
                });
                button.classList.add('active');
                current = normalize(button.getAttribute('data-filter-value'));
                apply();
            });
        });
    }

    window.initMoviePlayer = function (url, videoId) {
        var video = document.getElementById(videoId || 'movie-player');
        var cover = qs('.player-cover');
        var started = false;

        if (!video || !url) {
            return;
        }

        function attach() {
            if (started) {
                return Promise.resolve();
            }
            started = true;
            if (cover) {
                cover.classList.add('hidden');
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
                return video.play().catch(function () {});
            }
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(url);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
                return Promise.resolve();
            }
            video.src = url;
            return video.play().catch(function () {});
        }

        if (cover) {
            cover.addEventListener('click', attach);
        }
        video.addEventListener('click', function () {
            if (!started) {
                attach();
            }
        });
    };

    document.addEventListener('DOMContentLoaded', function () {
        setupMenu();
        setupHero();
        setupSearch();
    });
})();
