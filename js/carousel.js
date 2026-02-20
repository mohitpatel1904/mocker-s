// ===================================
// CAROUSEL LOGIC - MOCKERS
// ===================================

let currentSlide = 0;
const totalSlides = 3;
let autoplayInterval;
const AUTOPLAY_DELAY = 6000;

document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    startAutoplay();
    initScrollAnimations();
});

function initCarousel() {
    const videos = document.querySelectorAll('.carousel-video');
    if (videos[0]) {
        videos[0].play().catch(e => console.log('Autoplay blocked:', e));
    }
}

function goToSlide(slideIndex) {
    stopAutoplay();
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.pagination-dot');

    if (!slides.length || !dots.length) return;

    // Pause current video
    const currentVideo = slides[currentSlide]?.querySelector('video');
    if (currentVideo) currentVideo.pause();

    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = slideIndex;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    // Play new video
    const video = slides[currentSlide].querySelector('video');
    if (video) {
        video.currentTime = 0;
        video.play().catch(e => console.log('Video play blocked'));
    }

    setTimeout(startAutoplay, 2000);
}

function nextSlide() {
    goToSlide((currentSlide + 1) % totalSlides);
}

function prevSlide() {
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
}

function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
}

function stopAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
}

// Scroll-triggered animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card, .feature-card, .stat-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add animation class styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Expose to global scope for inline onclick handlers
window.prevSlide = prevSlide;
window.nextSlide = nextSlide;
window.goToSlide = goToSlide;
window.scrollToProducts = (id) => {
    const el = document.getElementById(id || 'products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
};
