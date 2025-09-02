class TantePaulaApp {
    constructor() {
        this.lastScrollY = 0;
        this.ticking = false;
        this.heroCarousel = null;
        this.isCarouselPaused = false;
        this.mobileMenuToggle = null;
        this.mobileSidebar = null;
        this.mobileSidebarClose = null;
        this.mobileBackdrop = null;
        
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEverything();
            });
        } else {
            this.setupEverything();
        }
    }
    
    setupEverything() {
        console.log('Setting up Tante Paula App');
        this.initializeLibraries();
        this.initializeHeader();
        this.initializeMobileMenu();
        this.initializeHeroCarousel();
        this.setupEventListeners();
        this.initializeBackToTop();
        this.initializeCookieBanner();
        this.initializeNewsletterForm();
        this.initializeAnimatedWords();
    }
    
    initializeLibraries() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100
            });
        }
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    initializeHeader() {
        this.header = document.getElementById('header');
        this.lastScrollY = window.scrollY;
        console.log('Header initialized:', this.header);
    }
    
    initializeMobileMenu() {
        this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        this.mobileSidebar = document.getElementById('mobile-sidebar');
        this.mobileSidebarClose = document.getElementById('mobile-sidebar-close');
        
        console.log('Mobile menu elements:', {
            toggle: this.mobileMenuToggle,
            sidebar: this.mobileSidebar,
            close: this.mobileSidebarClose
        });
        
        if (!this.mobileMenuToggle || !this.mobileSidebar) {
            console.error('Mobile menu elements not found');
            return;
        }
        
        this.createMobileBackdrop();
        
        this.mobileMenuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Mobile menu toggle clicked');
            this.toggleMobileMenu();
        });
        
        if (this.mobileSidebarClose) {
            this.mobileSidebarClose.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Mobile menu close clicked');
                this.closeMobileMenu();
            });
        }
        
        if (this.mobileBackdrop) {
            this.mobileBackdrop.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Mobile backdrop clicked');
                this.closeMobileMenu();
            });
        }
        
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
    }
    
    createMobileBackdrop() {
        const existingBackdrop = document.getElementById('mobile-sidebar-backdrop');
        if (existingBackdrop) {
            existingBackdrop.remove();
        }
        
        this.mobileBackdrop = document.createElement('div');
        this.mobileBackdrop.className = 'mobile-sidebar-backdrop';
        this.mobileBackdrop.id = 'mobile-sidebar-backdrop';
        document.body.appendChild(this.mobileBackdrop);
        console.log('Mobile backdrop created:', this.mobileBackdrop);
    }
    
    toggleMobileMenu() {
        if (!this.mobileSidebar) return;
        
        const isOpen = this.mobileSidebar.classList.contains('open');
        console.log('Toggle mobile menu, currently open:', isOpen);
        
        if (isOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        if (!this.mobileSidebar) return;
        
        console.log('Opening mobile menu');
        this.mobileSidebar.classList.add('open');
        if (this.mobileBackdrop) {
            this.mobileBackdrop.classList.add('open');
        }
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.classList.add('active');
            this.mobileMenuToggle.setAttribute('aria-expanded', 'true');
        }
        this.mobileSidebar.setAttribute('aria-hidden', 'false');
        
        document.body.classList.add('no-scroll');
    }
    
    closeMobileMenu() {
        if (!this.mobileSidebar) return;
        
        console.log('Closing mobile menu');
        this.mobileSidebar.classList.remove('open');
        if (this.mobileBackdrop) {
            this.mobileBackdrop.classList.remove('open');
        }
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.classList.remove('active');
            this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
        this.mobileSidebar.setAttribute('aria-hidden', 'true');
        
        document.body.classList.remove('no-scroll');
    }
    
    initializeHeroCarousel() {
        console.log('Initializing hero carousel, Swiper available:', typeof Swiper !== 'undefined');
        
        if (typeof Swiper === 'undefined') {
            console.error('Swiper not loaded');
            return;
        }
        
        const carouselElement = document.querySelector('.hero-carousel');
        if (!carouselElement) {
            console.error('Hero carousel element not found');
            return;
        }
        
        this.heroCarousel = new Swiper('.hero-carousel', {
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: false
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            speed: 1000,
            on: {
                slideChange: (swiper) => {
                    console.log('Slide changed to:', swiper.realIndex);
                    this.updateCarouselDots(swiper.realIndex);
                }
            }
        });
        
        console.log('Hero carousel initialized:', this.heroCarousel);
        this.initializeCarouselControls();
        
        if (this.heroCarousel && this.heroCarousel.autoplay) {
            this.heroCarousel.autoplay.start();
        }
    }
    
    initializeCarouselControls() {
        const pauseButton = document.getElementById('carousel-pause');
        const dots = document.querySelectorAll('.dot');
        
        console.log('Initializing carousel controls', { pauseButton, dots: dots.length });
        
        if (pauseButton && this.heroCarousel) {
            pauseButton.addEventListener('click', () => {
                console.log('Pause button clicked, paused:', this.isCarouselPaused);
                if (this.isCarouselPaused) {
                    this.heroCarousel.autoplay.start();
                    pauseButton.innerHTML = '<i data-lucide="pause"></i>';
                    this.isCarouselPaused = false;
                } else {
                    this.heroCarousel.autoplay.stop();
                    pauseButton.innerHTML = '<i data-lucide="play"></i>';
                    this.isCarouselPaused = true;
                }
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        }
        
        if (this.heroCarousel) {
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    console.log('Dot clicked:', index);
                    this.heroCarousel.slideToLoop(index);
                });
            });
        }
    }
    
    updateCarouselDots(activeIndex) {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    }
    
    setupEventListeners() {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        
        window.addEventListener('resize', () => this.handleResize(), { passive: true });
        
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }
    
    handleScroll() {
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.updateHeader();
                this.updateBackToTop();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }
    
    updateHeader() {
        if (!this.header) return;
        
        const currentScrollY = window.scrollY;
        
        if (currentScrollY < 100) {
            this.header.classList.remove('hidden');
        } else if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
            this.header.classList.add('hidden');
        } else if (currentScrollY < this.lastScrollY) {
            this.header.classList.remove('hidden');
        }
        
        this.lastScrollY = currentScrollY;
    }
    
    handleKeyDown(e) {
        if (e.key === 'Escape' && this.mobileSidebar && this.mobileSidebar.classList.contains('open')) {
            this.closeMobileMenu();
            return;
        }
    }
    
    handleResize() {
        if (window.innerWidth > 768 && this.mobileSidebar && this.mobileSidebar.classList.contains('open')) {
            this.closeMobileMenu();
        }
        
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
    
    initializeBackToTop() {
        this.backToTopButton = document.getElementById('back-to-top');
        
        if (this.backToTopButton) {
            this.backToTopButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    updateBackToTop() {
        if (!this.backToTopButton) return;
        
        const scrolled = window.scrollY > 300;
        
        if (scrolled && !this.backToTopButton.classList.contains('visible')) {
            this.backToTopButton.classList.add('visible');
        } else if (!scrolled && this.backToTopButton.classList.contains('visible')) {
            this.backToTopButton.classList.remove('visible');
        }
    }
    
    initializeCookieBanner() {
        this.cookieBanner = document.getElementById('cookie-banner');
        const acceptButton = document.getElementById('cookie-accept');
        const settingsButton = document.getElementById('cookie-settings');
        
        if (!localStorage.getItem('cookiesAccepted') && this.cookieBanner) {
            setTimeout(() => {
                this.showCookieBanner();
            }, 1000);
        }
        
        if (acceptButton) {
            acceptButton.addEventListener('click', () => this.acceptCookies());
        }
        
        if (settingsButton) {
            settingsButton.addEventListener('click', () => this.showCookieSettings());
        }
    }
    
    showCookieBanner() {
        if (this.cookieBanner) {
            this.cookieBanner.classList.add('visible');
            this.cookieBanner.setAttribute('aria-hidden', 'false');
        }
    }
    
    hideCookieBanner() {
        if (this.cookieBanner) {
            this.cookieBanner.classList.remove('visible');
            this.cookieBanner.setAttribute('aria-hidden', 'true');
        }
    }
    
    acceptCookies() {
        localStorage.setItem('cookiesAccepted', 'true');
        this.hideCookieBanner();
        console.log('Cookies accepted');
    }
    
    showCookieSettings() {
        window.location.href = 'cookies.html';
    }
    
    initializeNewsletterForm() {
        const form = document.getElementById('newsletter-form');
        
        if (form) {
            form.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        }
    }
    
    handleNewsletterSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
        
        if (!this.isValidEmail(email)) {
            this.showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
            return;
        }
        
        this.showNotification('Vielen Dank! Sie wurden erfolgreich angemeldet.', 'success');
        e.target.reset();
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close" aria-label="Schließen">
                <i data-lucide="x"></i>
            </button>
        `;
        
        const styles = `
            .notification {
                position: fixed;
                top: var(--space-xl);
                right: var(--space-xl);
                background: var(--color-white);
                color: var(--color-gray-800);
                padding: var(--space-lg);
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-xl);
                border-left: 4px solid var(--color-primary);
                z-index: var(--z-toast);
                transform: translateX(100%);
                transition: transform var(--transition-normal);
                display: flex;
                align-items: center;
                gap: var(--space-md);
                max-width: 400px;
            }
            .notification.notification-success {
                border-left-color: var(--color-secondary);
            }
            .notification.notification-error {
                border-left-color: #EF4444;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                padding: var(--space-xs);
                border-radius: var(--radius-sm);
                transition: background-color var(--transition-fast);
                flex-shrink: 0;
            }
            .notification-close:hover {
                background-color: var(--color-gray-100);
            }
        `;
        
        if (!document.querySelector('#notification-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'notification-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
        
        document.body.appendChild(notification);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            this.hideNotification(notification);
        });
        
        setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);
    }
    
    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    initializeAnimatedWords() {
        const animatedWords = document.querySelectorAll('.animated-word');
        
        animatedWords.forEach(word => {
            const delay = word.getAttribute('data-delay') || 0;
            word.style.setProperty('--animation-delay', `${delay}ms`);
        });
    }
}

let tantePaulaApp = null;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!tantePaulaApp) {
            tantePaulaApp = new TantePaulaApp();
            window.tantePaulaApp = tantePaulaApp;
        }
    });
} else {
    if (!tantePaulaApp) {
        tantePaulaApp = new TantePaulaApp();
        window.tantePaulaApp = tantePaulaApp;
    }
}

document.addEventListener('visibilitychange', () => {
    if (tantePaulaApp && tantePaulaApp.heroCarousel) {
        if (document.hidden) {
            tantePaulaApp.heroCarousel.autoplay.stop();
        } else if (!tantePaulaApp.isCarouselPaused) {
            tantePaulaApp.heroCarousel.autoplay.start();
        }
    }
});