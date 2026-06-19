(function () {
  window.setupPlayer = function (source) {
    var video = document.querySelector("[data-player]");
    var cover = document.querySelector("[data-play-cover]");
    if (!video || !source) {
      return;
    }

    var loaded = false;
    var hlsInstance = null;

    function begin() {
      if (cover) {
        cover.classList.add("is-hidden");
      }
      if (loaded) {
        video.play();
        return;
      }
      loaded = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        video.play();
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play();
        });
      }
    }

    if (cover) {
      cover.addEventListener("click", begin);
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        begin();
      }
    });
    video.addEventListener("play", function () {
      if (cover) {
        cover.classList.add("is-hidden");
      }
    });
    window.addEventListener("pagehide", function () {
      if (hlsInstance && hlsInstance.destroy) {
        hlsInstance.destroy();
      }
    });
  };
})();
