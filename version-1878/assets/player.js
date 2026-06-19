(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var video = document.getElementById('moviePlayer');
    var cover = document.querySelector('.play-cover');

    if (!video || !cover) {
      return;
    }

    var stream = video.getAttribute('data-stream');
    var prepared = false;
    var hls = null;

    function prepare() {
      if (prepared || !stream) {
        return Promise.resolve();
      }

      prepared = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        return Promise.resolve();
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        return Promise.resolve();
      }

      video.src = stream;
      return Promise.resolve();
    }

    function play() {
      prepare().then(function () {
        cover.classList.add('is-hidden');
        var attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
          attempt.catch(function () {
            cover.classList.remove('is-hidden');
          });
        }
      });
    }

    cover.addEventListener('click', play);
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
    video.addEventListener('play', function () {
      cover.classList.add('is-hidden');
    });
    video.addEventListener('pause', function () {
      if (!video.ended) {
        cover.classList.remove('is-hidden');
      }
    });
    video.addEventListener('ended', function () {
      cover.classList.remove('is-hidden');
    });
    video.addEventListener('error', function () {
      cover.classList.remove('is-hidden');
    });
  });
})();
