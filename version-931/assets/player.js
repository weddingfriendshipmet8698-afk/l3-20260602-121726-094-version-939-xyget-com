import { H as Hls } from './hls.js';

var boxes = Array.prototype.slice.call(document.querySelectorAll('.player-box'));

boxes.forEach(function (box) {
    var video = box.querySelector('video');
    var button = box.querySelector('.play-cover');
    var source = video ? video.getAttribute('data-stream') : '';
    var attached = false;

    function attach() {
        if (!video || !source || attached) {
            return;
        }

        attached = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (Hls && Hls.isSupported()) {
            var hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
        } else {
            video.src = source;
        }
    }

    function play() {
        attach();
        box.classList.add('playing');
        var promise = video.play();

        if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {
                box.classList.remove('playing');
            });
        }
    }

    if (button) {
        button.addEventListener('click', play);
    }

    if (video) {
        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            }
        });

        video.addEventListener('play', function () {
            box.classList.add('playing');
        });

        video.addEventListener('pause', function () {
            if (!video.ended) {
                box.classList.remove('playing');
            }
        });
    }
});
