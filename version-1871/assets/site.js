const toggleButton = document.querySelector(".mobile-toggle");
const nav = document.querySelector(".main-nav");

if (toggleButton && nav) {
    toggleButton.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        toggleButton.setAttribute("aria-expanded", String(isOpen));
    });
}

const carousel = document.querySelector("[data-hero-carousel]");

if (carousel) {
    const slides = Array.from(carousel.querySelectorAll(".hero-slide"));
    const dots = Array.from(carousel.querySelectorAll(".hero-dot"));
    let activeIndex = 0;

    const setSlide = (index) => {
        activeIndex = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle("active", slideIndex === activeIndex);
        });
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle("active", dotIndex === activeIndex);
        });
    };

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => setSlide(index));
    });

    if (slides.length > 1) {
        setInterval(() => setSlide(activeIndex + 1), 5200);
    }
}

const normalize = (value) => (value || "").toString().trim().toLowerCase();

const applyFilters = () => {
    const input = document.querySelector(".site-search-input");
    const query = normalize(input ? input.value : "");
    const activeChip = document.querySelector(".filter-chip.active");
    const selectedType = activeChip ? activeChip.dataset.type : "all";
    const cards = document.querySelectorAll(".searchable-list .movie-card");

    cards.forEach((card) => {
        const text = normalize([
            card.dataset.title,
            card.dataset.year,
            card.dataset.region,
            card.dataset.type,
            card.dataset.genre,
            card.dataset.tags
        ].join(" "));
        const typeMatch = selectedType === "all" || normalize(card.dataset.type).includes(normalize(selectedType));
        const queryMatch = !query || text.includes(query);
        card.classList.toggle("is-filtered-out", !(typeMatch && queryMatch));
    });
};

document.querySelectorAll(".site-search-input").forEach((input) => {
    input.addEventListener("input", applyFilters);
});

document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
        document.querySelectorAll(".filter-chip").forEach((item) => item.classList.remove("active"));
        chip.classList.add("active");
        applyFilters();
    });
});

function setupPlayer(source) {
    const video = document.getElementById("movie-video");
    const overlay = document.getElementById("player-overlay");

    if (!video || !source) {
        return;
    }

    let ready = false;
    let hlsInstance = null;

    const attachSource = () => {
        if (ready) {
            return;
        }

        ready = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
            hlsInstance.on(window.Hls.Events.ERROR, (_, data) => {
                if (data && data.fatal) {
                    hlsInstance.destroy();
                    hlsInstance = null;
                    ready = false;
                }
            });
        }
    };

    const playVideo = () => {
        attachSource();
        if (overlay) {
            overlay.classList.add("is-hidden");
        }
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {
                if (overlay) {
                    overlay.classList.remove("is-hidden");
                }
            });
        }
    };

    if (overlay) {
        overlay.addEventListener("click", playVideo);
    }

    video.addEventListener("click", () => {
        if (video.paused) {
            playVideo();
        } else {
            video.pause();
        }
    });

    video.addEventListener("play", () => {
        if (overlay) {
            overlay.classList.add("is-hidden");
        }
    });

    video.addEventListener("pause", () => {
        if (overlay && video.currentTime === 0) {
            overlay.classList.remove("is-hidden");
        }
    });
}
