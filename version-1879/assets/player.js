(function () {
  window.initMoviePlayer = function (url) {
    var video = document.getElementById('movie-player');
    var cover = document.getElementById('player-cover');
    var playButton = document.getElementById('player-toggle');
    var muteButton = document.getElementById('player-mute');
    var fullButton = document.getElementById('player-fullscreen');
    var hls = null;
    var ready = false;

    if (!video || !url) return;

    function attach() {
      if (ready) return;
      ready = true;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: false });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else {
        video.src = url;
      }
    }

    function play() {
      attach();
      var action = video.play();
      if (action && typeof action.catch === 'function') {
        action.catch(function () {});
      }
    }

    function togglePlay() {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    }

    function refresh() {
      if (cover) cover.classList.toggle('hidden', !video.paused);
      if (playButton) playButton.textContent = video.paused ? '▶' : 'Ⅱ';
      if (muteButton) muteButton.textContent = video.muted ? '🔇' : '🔊';
    }

    if (cover) cover.addEventListener('click', play);
    if (playButton) playButton.addEventListener('click', togglePlay);
    if (muteButton) {
      muteButton.addEventListener('click', function () {
        video.muted = !video.muted;
        refresh();
      });
    }
    if (fullButton) {
      fullButton.addEventListener('click', function () {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (video.requestFullscreen) {
          video.requestFullscreen();
        }
      });
    }
    video.addEventListener('click', togglePlay);
    video.addEventListener('play', refresh);
    video.addEventListener('pause', refresh);
    video.addEventListener('volumechange', refresh);
    window.addEventListener('pagehide', function () {
      if (hls && hls.destroy) hls.destroy();
    });
    refresh();
  };
})();
