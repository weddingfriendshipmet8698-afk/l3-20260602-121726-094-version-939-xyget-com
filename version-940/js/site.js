(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.main-nav');
    if (menuButton && nav) {
        menuButton.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var active = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === active);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === active);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
        });
    });

    if (slides.length) {
        showSlide(0);
        window.setInterval(function () {
            showSlide(active + 1);
        }, 5200);
    }

    var searchInput = document.querySelector('[data-search-input]');
    var searchItems = Array.prototype.slice.call(document.querySelectorAll('[data-search-item], .movie-card'));
    if (searchInput && searchItems.length) {
        searchInput.addEventListener('input', function () {
            var value = searchInput.value.trim().toLowerCase();
            searchItems.forEach(function (item) {
                var text = item.textContent.toLowerCase();
                item.style.display = !value || text.indexOf(value) >= 0 ? '' : 'none';
            });
        });
    }

    var video = document.querySelector('[data-player-video]');
    if (video) {
        var sourceNode = video.querySelector('source');
        var source = sourceNode ? sourceNode.getAttribute('src') : '';
        var cover = document.querySelector('[data-player-cover]');
        var button = document.querySelector('[data-player-button]');

        function bindSource() {
            if (!source) {
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (!data || !data.fatal) {
                        return;
                    }
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    } else {
                        hls.destroy();
                    }
                });
            } else {
                video.src = source;
            }
        }

        function startPlayback() {
            bindSource();
            if (cover) {
                cover.classList.add('is-hidden');
            }
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
        }

        if (button) {
            button.addEventListener('click', startPlayback);
        }
        if (cover) {
            cover.addEventListener('click', startPlayback);
        }
        video.addEventListener('play', function () {
            if (cover) {
                cover.classList.add('is-hidden');
            }
        });
        video.addEventListener('pause', function () {
            if (video.currentTime === 0 && cover) {
                cover.classList.remove('is-hidden');
            }
        });
    }
}());
