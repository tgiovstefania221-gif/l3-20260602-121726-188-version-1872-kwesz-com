(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var index = 0;
        var timer = null;

        var showSlide = function (nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        };

        var startTimer = function () {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 6000);
        };

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                startTimer();
            });
        });

        hero.addEventListener('mouseenter', function () {
            window.clearInterval(timer);
        });

        hero.addEventListener('mouseleave', startTimer);
        startTimer();
    }

    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-search-panel]'));

    panels.forEach(function (panel) {
        var input = panel.querySelector('[data-search-input]');
        var root = panel.parentElement || document;
        var scope = root.querySelector('[data-card-scope]') || document;
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-search]'));
        var noResults = root.querySelector('[data-no-results]');
        var yearFilter = panel.querySelector('[data-filter-year]');
        var regionFilter = panel.querySelector('[data-filter-region]');
        var genreFilter = panel.querySelector('[data-filter-genre]');

        var applyFilters = function () {
            var query = input ? input.value.trim().toLowerCase() : '';
            var year = yearFilter ? yearFilter.value : '';
            var region = regionFilter ? regionFilter.value : '';
            var genre = genreFilter ? genreFilter.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var text = (card.getAttribute('data-search') || '').toLowerCase();
                var cardYear = card.getAttribute('data-year') || '';
                var cardRegion = card.getAttribute('data-region') || '';
                var cardGenre = card.getAttribute('data-genre') || '';
                var matched = true;

                if (query && text.indexOf(query) === -1) {
                    matched = false;
                }

                if (year && cardYear !== year) {
                    matched = false;
                }

                if (region && cardRegion.indexOf(region) === -1) {
                    matched = false;
                }

                if (genre && cardGenre.indexOf(genre) === -1 && text.indexOf(genre.toLowerCase()) === -1) {
                    matched = false;
                }

                card.hidden = !matched;

                if (matched) {
                    visible += 1;
                }
            });

            if (noResults) {
                noResults.hidden = visible !== 0;
            }
        };

        [input, yearFilter, regionFilter, genreFilter].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilters);
                control.addEventListener('change', applyFilters);
            }
        });
    });

    var startPlayer = function (shell) {
        var video = shell.querySelector('video');
        var overlay = shell.querySelector('[data-player-overlay]');
        var source = video ? video.querySelector('source') : null;
        var url = source ? source.getAttribute('src') : '';

        if (!video || !url) {
            return;
        }

        if (video.getAttribute('data-ready') !== 'true') {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({ enableWorker: true });
                hls.loadSource(url);
                hls.attachMedia(video);
                shell._hls = hls;
            } else {
                video.src = url;
            }

            video.setAttribute('data-ready', 'true');
        }

        if (overlay) {
            overlay.classList.add('is-hidden');
        }

        video.setAttribute('controls', 'controls');
        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                if (overlay) {
                    overlay.classList.remove('is-hidden');
                }
            });
        }
    };

    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (shell) {
        var overlay = shell.querySelector('[data-player-overlay]');
        var video = shell.querySelector('video');

        if (overlay) {
            overlay.addEventListener('click', function () {
                startPlayer(shell);
            });
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    startPlayer(shell);
                }
            });
        }
    });
})();
