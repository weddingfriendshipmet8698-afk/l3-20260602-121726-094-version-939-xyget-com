(function () {
  function bindPlayer(frame) {
    var video = frame.querySelector('video');
    var button = frame.querySelector('.player-start');
    var source = frame.getAttribute('data-source');
    var initialized = false;
    var hlsInstance = null;

    if (!video || !button || !source) {
      return;
    }

    function loadSource() {
      if (initialized) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        initialized = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          maxBufferLength: 30,
          capLevelToPlayerSize: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        initialized = true;
        return;
      }

      video.src = source;
      initialized = true;
    }

    function playVideo() {
      loadSource();
      frame.classList.add('is-playing');
      var promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          frame.classList.remove('is-playing');
        });
      }
    }

    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      playVideo();
    });

    frame.addEventListener('click', function (event) {
      if (event.target === video && !video.paused) {
        return;
      }
      if (video.paused) {
        playVideo();
      }
    });

    video.addEventListener('play', function () {
      frame.classList.add('is-playing');
    });

    video.addEventListener('ended', function () {
      frame.classList.remove('is-playing');
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance && typeof hlsInstance.destroy === 'function') {
        hlsInstance.destroy();
      }
    });
  }

  document.querySelectorAll('.js-player').forEach(bindPlayer);
})();
