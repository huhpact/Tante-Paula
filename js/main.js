class TantePaulaApp {
    constructor() {
        this.cookieSettings = {
            essential: true,
            analytics: false,
            marketing: false
        };
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
        this.initializeScrollProgress();
        this.initializeParallax();
        this.initializeHeader();
        this.initializeMobileMenu();
        this.initializeHeroCarousel();
        this.setupEventListeners();
        this.initializeBackToTop();
        this.initializeCookieBanner();
        this.initializeAnimatedWords();
        this.initializeGalleryAutoHover();
        this.initializePartnersAnimation();
        this.initializeStatsCounter();
        this.initializeIntersectionObserver();
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
        const essentialButton = document.getElementById('cookie-essential');
        const settingsButton = document.getElementById('cookie-settings');
        
        const cookiesAccepted = localStorage.getItem('cookiesAccepted');
        if (!cookiesAccepted) {
            setTimeout(() => {
                this.showCookieBanner();
            }, 1000);
        }
        
        if (acceptButton) {
            acceptButton.addEventListener('click', () => {
                this.acceptAllCookies();
                this.hideCookieBanner();
            });
        }
        
        if (essentialButton) {
            essentialButton.addEventListener('click', () => {
                this.acceptEssentialCookies();
                this.hideCookieBanner();
            });
        }
        
        if (settingsButton) {
            settingsButton.addEventListener('click', () => {
                this.showCookieSettings();
            });
        }
    }
    
    showCookieBanner() {
        if (this.cookieBanner) {
            this.cookieBanner.classList.add('show');
            this.cookieBanner.setAttribute('aria-hidden', 'false');
        }
    }
    
    hideCookieBanner() {
        if (this.cookieBanner) {
            this.cookieBanner.classList.remove('show');
            this.cookieBanner.setAttribute('aria-hidden', 'true');
        }
    }
    
    acceptAllCookies() {
        this.cookieSettings = {
            essential: true,
            analytics: true,
            marketing: true
        };
        localStorage.setItem('cookiesAccepted', 'all');
        localStorage.setItem('cookieSettings', JSON.stringify(this.cookieSettings));
        console.log('All cookies accepted');
    }
    
    acceptEssentialCookies() {
        this.cookieSettings = {
            essential: true,
            analytics: false,
            marketing: false
        };
        localStorage.setItem('cookiesAccepted', 'essential');
        localStorage.setItem('cookieSettings', JSON.stringify(this.cookieSettings));
        console.log('Essential cookies accepted');
    }
    
    showCookieSettings() {
        // Create a modal for cookie settings
        const modal = document.createElement('div');
        modal.className = 'cookie-modal';
        modal.innerHTML = `
            <div class="cookie-modal-content">
                <h3>Cookie-Einstellungen</h3>
                <div class="cookie-option">
                    <label>
                        <input type="checkbox" checked disabled> Notwendige Cookies
                        <span>Diese Cookies sind für die Grundfunktionen der Website erforderlich.</span>
                    </label>
                </div>
                <div class="cookie-option">
                    <label>
                        <input type="checkbox" id="analytics-cookies"> Analyse-Cookies
                        <span>Helfen uns zu verstehen, wie Besucher unsere Website nutzen.</span>
                    </label>
                </div>
                <div class="cookie-option">
                    <label>
                        <input type="checkbox" id="marketing-cookies"> Marketing-Cookies
                        <span>Werden verwendet, um personalisierte Werbung anzuzeigen.</span>
                    </label>
                </div>
                <div class="cookie-modal-actions">
                    <button class="btn btn-primary" id="save-settings">Einstellungen speichern</button>
                    <button class="btn btn-secondary" id="close-modal">Schließen</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.classList.add('show');
        
        // Handle modal interactions
        document.getElementById('save-settings').addEventListener('click', () => {
            const analytics = document.getElementById('analytics-cookies').checked;
            const marketing = document.getElementById('marketing-cookies').checked;
            
            this.cookieSettings = {
                essential: true,
                analytics,
                marketing
            };
            
            localStorage.setItem('cookiesAccepted', 'custom');
            localStorage.setItem('cookieSettings', JSON.stringify(this.cookieSettings));
            
            document.body.removeChild(modal);
            this.hideCookieBanner();
        });
        
        document.getElementById('close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Close modal on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    initializeNewsletterForm() {
        const form = document.getElementById('newsletter-form');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const emailInput = form.querySelector('input[type="email"]');
                const submitButton = form.querySelector('button[type="submit"]');
                const email = emailInput.value.trim();
                
                if (!this.isValidEmail(email)) {
                    this.showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
                    return;
                }
                
                // Simulate form submission
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Wird angemeldet...';
                submitButton.disabled = true;
                
                setTimeout(() => {
                    this.showNotification('Vielen Dank! Sie wurden erfolgreich für unseren Newsletter angemeldet.', 'success');
                    emailInput.value = '';
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 1500);
            });
        }
    }
    
    initializeAnimatedWords() {
        const animatedWords = document.querySelectorAll('.animated-word');
        
        animatedWords.forEach((word, index) => {
            const delay = index * 200;
            word.style.setProperty('--animation-delay', `${delay}ms`);
        });
    }
    
    // Gallery Auto Hover Effect
    initializeGalleryAutoHover() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Start auto hover sequence when gallery comes into view
                    this.startGallerySequence(galleryItems);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        const gallerySection = document.querySelector('#gallery-section');
        if (gallerySection) {
            observer.observe(gallerySection);
        }
    }
    
    startGallerySequence(items) {
        let currentIndex = 0;
        
        const showNext = () => {
            // Remove active class from all items
            items.forEach(item => item.classList.remove('active'));
            
            // Add active class to current item
            if (items[currentIndex]) {
                items[currentIndex].classList.add('active');
            }
            
            currentIndex = (currentIndex + 1) % items.length;
        };
        
        // Start immediately
        showNext();
        
        // Continue sequence every 2 seconds
        const interval = setInterval(showNext, 2000);
        
        // Stop sequence after one full cycle
        setTimeout(() => {
            clearInterval(interval);
            items.forEach(item => item.classList.remove('active'));
        }, items.length * 2000);
    }
    
    // Partners Animation
    initializePartnersAnimation() {
        const partnerItems = document.querySelectorAll('.partner-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    
                    partnerItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '0';
                            item.style.transform = 'translateY(30px)';
                            item.style.transition = 'all 0.6s ease-out';
                            
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, 100);
                        }, index * 200);
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        const partnersSection = document.querySelector('#partners-section');
        if (partnersSection) {
            observer.observe(partnersSection);
        }
        
        partnerItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const name = item.getAttribute('data-name');
                this.showPartnerTooltip(item, name);
            });
            
            item.addEventListener('mouseleave', () => {
                this.hidePartnerTooltip(item);
            });
        });
    }
    
    showPartnerTooltip(element, name) {
        const tooltip = document.createElement('div');
        tooltip.className = 'partner-tooltip';
        tooltip.textContent = `Partner seit 2020 - ${name}`;
        
        element.style.position = 'relative';
        element.appendChild(tooltip);
    }
    
    hidePartnerTooltip(element) {
        const tooltip = element.querySelector('.partner-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
    
    initializeScrollProgress() {
        const progressBar = document.getElementById('scroll-progress');

        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    initializeParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-element');

        window.addEventListener('scroll', () => {
            parallaxElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const scrolled = window.scrollY;
                const rate = scrolled * 0.3;

                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    element.style.transform = `translateY(${rate - rect.top * 0.1}px)`;
                }
            });
        });
    }

    initializeStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    this.animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => observer.observe(stat));
    }
    
    animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 40);
    }
    
    initializeIntersectionObserver() {
        const animatedElements = document.querySelectorAll('.about-card, .contact-item, .testimonial-card, .gallery-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    entry.target.style.transition = 'all 0.6s ease-out';
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        animatedElements.forEach(el => observer.observe(el));
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
            <button class="notification-close" aria-label="Schließen">×</button>
        `;
        
        const styles = `
            .notification {
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: white;
                color: #1f2937;
                padding: 1rem 1.5rem;
                border-radius: 0.75rem;
                box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
                border-left: 4px solid #6366f1;
                z-index: 1000;
                transform: translateX(100%);
                transition: transform 0.3s ease-out;
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 400px;
            }
            .notification.notification-success {
                border-left-color: #10b981;
            }
            .notification.notification-error {
                border-left-color: #ef4444;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 0.25rem;
                transition: background-color 0.15s ease-out;
                flex-shrink: 0;
                font-size: 1.25rem;
            }
            .notification-close:hover {
                background-color: #f3f4f6;
            }
        `;
        
        if (!document.querySelector('#notification-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'notification-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
        
        document.body.appendChild(notification);
        
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