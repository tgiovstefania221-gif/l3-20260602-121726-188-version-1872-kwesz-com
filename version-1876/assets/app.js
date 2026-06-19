(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle('is-active', itemIndex === current);
            });
            dots.forEach(function (dot, itemIndex) {
                dot.classList.toggle('is-active', itemIndex === current);
            });
        }

        function startHero() {
            stopHero();
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5000);
        }

        function stopHero() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
                startHero();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
                startHero();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                startHero();
            });
        }

        hero.addEventListener('mouseenter', stopHero);
        hero.addEventListener('mouseleave', startHero);
        startHero();
    }

    var forms = document.querySelectorAll('[data-search-form]');
    forms.forEach(function (form) {
        form.addEventListener('submit', function (event) {
            var input = form.querySelector('input[name="q"]');
            if (input && input.value.trim()) {
                event.preventDefault();
                window.location.href = form.getAttribute('action') + '?q=' + encodeURIComponent(input.value.trim());
            }
        });
    });

    var panel = document.querySelector('[data-filter-panel]');
    var grid = document.querySelector('[data-searchable-grid]');
    if (panel && grid) {
        var searchInput = panel.querySelector('[data-search-input]');
        var yearFilter = panel.querySelector('[data-year-filter]');
        var categoryFilter = panel.querySelector('[data-category-filter]');
        var clearSearch = panel.querySelector('[data-clear-search]');
        var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
        var emptyState = document.querySelector('[data-empty-state]');
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q') || '';
        if (searchInput && initialQuery) {
            searchInput.value = initialQuery;
        }

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function applyFilters() {
            var keyword = normalize(searchInput ? searchInput.value : '');
            var year = yearFilter ? yearFilter.value : '';
            var category = categoryFilter ? categoryFilter.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var text = normalize(card.getAttribute('data-search'));
                var cardYear = card.getAttribute('data-year') || '';
                var cardCategory = card.getAttribute('data-category') || '';
                var matched = true;
                if (keyword && text.indexOf(keyword) === -1) {
                    matched = false;
                }
                if (year && cardYear !== year) {
                    matched = false;
                }
                if (category && cardCategory !== category) {
                    matched = false;
                }
                card.classList.toggle('is-hidden', !matched);
                if (matched) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle('is-visible', visible === 0);
            }
        }

        if (searchInput) {
            searchInput.addEventListener('input', applyFilters);
        }
        if (yearFilter) {
            yearFilter.addEventListener('change', applyFilters);
        }
        if (categoryFilter) {
            categoryFilter.addEventListener('change', applyFilters);
        }
        if (clearSearch) {
            clearSearch.addEventListener('click', function () {
                if (searchInput) {
                    searchInput.value = '';
                }
                if (yearFilter) {
                    yearFilter.value = '';
                }
                if (categoryFilter) {
                    categoryFilter.value = '';
                }
                applyFilters();
            });
        }
        applyFilters();
    }

    var players = document.querySelectorAll('[data-player]');
    players.forEach(function (player) {
        var video = player.querySelector('video');
        var trigger = player.querySelector('[data-play-trigger]');
        var hlsInstance = null;

        function attachVideo() {
            if (!video) {
                return;
            }
            var stream = video.getAttribute('data-stream');
            if (!stream || video.getAttribute('data-ready') === '1') {
                return;
            }
            video.setAttribute('data-ready', '1');
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
            } else {
                video.src = stream;
            }
        }

        function playVideo() {
            attachVideo();
            player.classList.add('is-playing');
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {
                    player.classList.remove('is-playing');
                });
            }
        }

        if (trigger && video) {
            trigger.addEventListener('click', playVideo);
        }

        if (video) {
            video.addEventListener('play', function () {
                player.classList.add('is-playing');
            });
            video.addEventListener('ended', function () {
                player.classList.remove('is-playing');
            });
        }

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    });
})();
