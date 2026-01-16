/**
 * LUXE SPA - Ultra Premium JavaScript
 * With GSAP, Lenis, Swiper, and Custom Interactions
 */

// =========================================
// PRELOADER
// =========================================
class Preloader {
    constructor() {
        this.el = document.getElementById('preloader');
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.el?.classList.add('hidden');
                document.body.style.overflow = '';
                this.initAnimations();
            }, 2000);
        });
    }

    initAnimations() {
        // Trigger hero animations after preloader
        gsap.from('.hero__badge', { opacity: 0, y: 30, duration: 0.8, delay: 0.2 });
        gsap.from('.hero__title .word', {
            opacity: 0,
            y: 80,
            stagger: 0.1,
            duration: 0.8,
            delay: 0.4,
            ease: 'power3.out'
        });
        gsap.from('.hero__subtitle', { opacity: 0, y: 30, duration: 0.8, delay: 0.8 });
        gsap.from('.hero__stats', { opacity: 0, y: 30, duration: 0.8, delay: 1 });
        gsap.from('.hero__cta', { opacity: 0, y: 30, duration: 0.8, delay: 1.2 });
        gsap.from('.hero__trust', { opacity: 0, y: 30, duration: 0.8, delay: 1.4 });
    }
}

// =========================================
// CUSTOM CURSOR
// =========================================
class CustomCursor {
    constructor() {
        this.cursor = document.getElementById('cursor');
        this.dot = this.cursor?.querySelector('.cursor__dot');
        this.outline = this.cursor?.querySelector('.cursor__outline');
        this.pos = { x: 0, y: 0 };
        this.mouse = { x: 0, y: 0 };

        if (window.matchMedia('(pointer: coarse)').matches) return;
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        this.animate();
        this.setupHoverEffects();
    }

    animate() {
        this.pos.x += (this.mouse.x - this.pos.x) * 0.15;
        this.pos.y += (this.mouse.y - this.pos.y) * 0.15;

        if (this.dot) {
            this.dot.style.left = `${this.mouse.x}px`;
            this.dot.style.top = `${this.mouse.y}px`;
        }
        if (this.outline) {
            this.outline.style.left = `${this.pos.x}px`;
            this.outline.style.top = `${this.pos.y}px`;
        }

        requestAnimationFrame(() => this.animate());
    }

    setupHoverEffects() {
        const hoverElements = document.querySelectorAll('a, button, .magnetic-btn, [data-lightbox]');

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.cursor?.classList.add('hover'));
            el.addEventListener('mouseleave', () => this.cursor?.classList.remove('hover'));
        });
    }
}

// =========================================
// LENIS SMOOTH SCROLL
// =========================================
class SmoothScroll {
    constructor() {
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true
        });

        this.init();
    }

    init() {
        const raf = (time) => {
            this.lenis.raf(time);
            requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);

        // Connect with GSAP ScrollTrigger
        this.lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => this.lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    }

    scrollTo(target) {
        this.lenis.scrollTo(target);
    }
}

// =========================================
// SCROLL PROGRESS
// =========================================
class ScrollProgress {
    constructor() {
        this.progressBar = document.getElementById('scrollProgress');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            if (this.progressBar) {
                this.progressBar.style.width = `${progress}%`;
            }
        });
    }
}

// =========================================
// HEADER
// =========================================
class Header {
    constructor() {
        this.header = document.getElementById('header');
        this.toggle = document.getElementById('navToggle');
        this.menu = document.getElementById('navMenu');
        this.init();
    }

    init() {
        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.header?.classList.add('scrolled');
            } else {
                this.header?.classList.remove('scrolled');
            }
        });

        // Mobile toggle
        this.toggle?.addEventListener('click', () => {
            this.toggle.classList.toggle('active');
            this.menu?.classList.toggle('active');
            document.body.style.overflow = this.menu?.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        document.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                this.toggle?.classList.remove('active');
                this.menu?.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// =========================================
// THEME TOGGLE
// =========================================
class ThemeToggle {
    constructor() {
        this.toggle = document.getElementById('themeToggle');
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        document.documentElement.setAttribute('data-theme', this.theme);

        this.toggle?.addEventListener('click', () => {
            this.theme = this.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', this.theme);
            localStorage.setItem('theme', this.theme);
        });
    }
}

// =========================================
// MAGNETIC BUTTONS
// =========================================
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.magnetic-btn');
        if (window.matchMedia('(pointer: coarse)').matches) return;
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        });
    }
}

// =========================================
// ANIMATED COUNTERS
// =========================================
class AnimatedCounters {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');
        this.init();
    }

    init() {
        this.counters.forEach(counter => {
            const target = parseFloat(counter.dataset.count);
            const isDecimal = target % 1 !== 0;

            ScrollTrigger.create({
                trigger: counter,
                start: 'top 80%',
                onEnter: () => {
                    gsap.to(counter, {
                        innerText: target,
                        duration: 2,
                        snap: { innerText: isDecimal ? 0.1 : 1 },
                        ease: 'power2.out',
                        onUpdate: function () {
                            if (isDecimal) {
                                counter.innerText = parseFloat(counter.innerText).toFixed(1);
                            } else {
                                counter.innerText = Math.round(counter.innerText).toLocaleString('tr-TR');
                            }
                        }
                    });
                },
                once: true
            });
        });
    }
}

// =========================================
// SCROLL ANIMATIONS
// =========================================
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        gsap.registerPlugin(ScrollTrigger);

        // Reveal fade elements
        document.querySelectorAll('.reveal-fade').forEach(el => {
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                onEnter: () => el.classList.add('revealed'),
                once: true
            });
        });

        // Split text animations
        document.querySelectorAll('.split-text').forEach(el => {
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                onEnter: () => el.classList.add('revealed'),
                once: true
            });
        });

        // Service cards stagger
        gsap.from('.service-card', {
            scrollTrigger: {
                trigger: '.services__grid',
                start: 'top 80%'
            },
            opacity: 0,
            y: 60,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out'
        });

        // Team cards
        gsap.from('.team-card', {
            scrollTrigger: {
                trigger: '.team__grid',
                start: 'top 80%'
            },
            opacity: 0,
            y: 60,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out'
        });

        // Pricing cards
        gsap.from('.pricing-card', {
            scrollTrigger: {
                trigger: '.pricing__grid',
                start: 'top 80%'
            },
            opacity: 0,
            y: 60,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power3.out'
        });

        // Gallery items
        gsap.from('.gallery__item', {
            scrollTrigger: {
                trigger: '.gallery__grid',
                start: 'top 80%'
            },
            opacity: 0,
            scale: 0.9,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power3.out'
        });
    }
}

// =========================================
// TILT EFFECT
// =========================================
class TiltEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-tilt]');
        if (window.matchMedia('(pointer: coarse)').matches) return;
        this.init();
    }

    init() {
        this.elements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                gsap.to(el, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformPerspective: 1000,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            el.addEventListener('mouseleave', () => {
                gsap.to(el, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
        });
    }
}

// =========================================
// COMPARISON SLIDER
// =========================================
class ComparisonSlider {
    constructor() {
        this.sliders = document.querySelectorAll('[data-comparison]');
        this.init();
    }

    init() {
        this.sliders.forEach(slider => {
            const handle = slider.querySelector('.comparison__handle');
            const after = slider.querySelector('.comparison__after');
            let isDragging = false;

            const updatePosition = (e) => {
                if (!isDragging) return;
                const rect = slider.getBoundingClientRect();
                const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
                const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));

                handle.style.left = `${percent}%`;
                after.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
            };

            handle.addEventListener('mousedown', () => isDragging = true);
            handle.addEventListener('touchstart', () => isDragging = true);

            document.addEventListener('mousemove', updatePosition);
            document.addEventListener('touchmove', updatePosition);

            document.addEventListener('mouseup', () => isDragging = false);
            document.addEventListener('touchend', () => isDragging = false);
        });
    }
}

// =========================================
// SWIPERS
// =========================================
class Sliders {
    constructor() {
        this.init();
    }

    init() {
        // Transformation slider
        new Swiper('#transformationSlider', {
            slidesPerView: 1,
            spaceBetween: 30,
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            }
        });

        // Testimonials slider
        new Swiper('#testimonialsSlider', {
            slidesPerView: 1,
            spaceBetween: 30,
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            },
            autoplay: {
                delay: 4000,
                disableOnInteraction: false
            }
        });
    }
}

// =========================================
// LIGHTBOX
// =========================================
class Lightbox {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.image = this.lightbox?.querySelector('.lightbox__image');
        this.close = this.lightbox?.querySelector('.lightbox__close');
        this.prevBtn = this.lightbox?.querySelector('.lightbox__nav--prev');
        this.nextBtn = this.lightbox?.querySelector('.lightbox__nav--next');
        this.items = document.querySelectorAll('[data-lightbox]');
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.items.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.currentIndex = index;
                this.open(item.href);
            });
        });

        this.close?.addEventListener('click', () => this.closeLightbox());
        this.prevBtn?.addEventListener('click', () => this.prev());
        this.nextBtn?.addEventListener('click', () => this.next());

        this.lightbox?.addEventListener('click', (e) => {
            if (e.target === this.lightbox) this.closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!this.lightbox?.classList.contains('active')) return;
            if (e.key === 'Escape') this.closeLightbox();
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
    }

    open(src) {
        if (this.image) this.image.src = src;
        this.lightbox?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox?.classList.remove('active');
        document.body.style.overflow = '';
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.open(this.items[this.currentIndex].href);
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.open(this.items[this.currentIndex].href);
    }
}

// =========================================
// BOOKING SYSTEM
// =========================================
class BookingSystem {
    constructor() {
        this.form = document.getElementById('bookingForm');
        this.steps = document.querySelectorAll('.booking__panel');
        this.stepBtns = document.querySelectorAll('.booking-step');
        this.prevBtn = document.getElementById('prevStep');
        this.nextBtn = document.getElementById('nextStep');
        this.submitBtn = document.getElementById('submitBooking');

        this.currentStep = 1;
        this.data = { service: '', date: '', time: '', price: 0, name: '', phone: '' };

        this.init();
    }

    init() {
        if (!this.form) return;

        this.generateCalendar();
        this.setupListeners();
        this.updateSlots();
    }

    setupListeners() {
        this.prevBtn?.addEventListener('click', () => this.goToPrev());
        this.nextBtn?.addEventListener('click', () => this.goToNext());
        this.submitBtn?.addEventListener('click', (e) => this.submit(e));
        this.form?.addEventListener('submit', (e) => e.preventDefault());

        document.querySelectorAll('input[name="service"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.data.service = e.target.value;
                this.data.price = parseInt(e.target.dataset.price) || 0;
                const serviceName = e.target.closest('.service-option').querySelector('h4').textContent;
                this.data.serviceName = serviceName;
            });
        });
    }

    goToNext() {
        if (!this.validate()) return;
        if (this.currentStep < 4) {
            this.currentStep++;
            this.updateView();
            if (this.currentStep === 4) this.updateSummary();
        }
    }

    goToPrev() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateView();
        }
    }

    updateView() {
        this.steps.forEach(s => s.classList.remove('active'));
        document.querySelector(`[data-step="${this.currentStep}"]`)?.classList.add('active');

        this.stepBtns.forEach((btn, i) => {
            btn.classList.remove('active', 'completed');
            if (i + 1 === this.currentStep) btn.classList.add('active');
            if (i + 1 < this.currentStep) btn.classList.add('completed');
        });

        this.prevBtn.disabled = this.currentStep === 1;
        this.nextBtn.style.display = this.currentStep === 4 ? 'none' : 'flex';
        this.submitBtn.style.display = this.currentStep === 4 ? 'flex' : 'none';
    }

    validate() {
        switch (this.currentStep) {
            case 1:
                if (!this.data.service) { this.showError('Lütfen bir hizmet seçin'); return false; }
                return true;
            case 2:
                if (!this.data.date || !this.data.time) { this.showError('Tarih ve saat seçin'); return false; }
                return true;
            case 3:
                const name = document.getElementById('customerName')?.value.trim();
                const phone = document.getElementById('customerPhone')?.value.trim();
                if (!name || name.length < 3) { this.showError('Geçerli isim girin'); return false; }
                if (!phone || phone.length < 10) { this.showError('Geçerli telefon girin'); return false; }
                this.data.name = name;
                this.data.phone = phone;
                return true;
            default:
                return true;
        }
    }

    showError(msg) {
        const existing = document.querySelector('.booking-error');
        existing?.remove();

        const error = document.createElement('div');
        error.className = 'booking-error';
        error.style.cssText = 'background:#2a1515;color:#ff6b6b;padding:1rem;border-radius:8px;margin-bottom:1rem;text-align:center;font-weight:500;border:1px solid rgba(255,107,107,0.3);';
        error.textContent = msg;

        document.querySelector('.booking__panel.active')?.prepend(error);
        setTimeout(() => error.remove(), 4000);
    }

    generateCalendar() {
        const grid = document.getElementById('calendarGrid');
        const monthDisplay = document.querySelector('.month-year');
        if (!grid) return;

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        if (monthDisplay) monthDisplay.textContent = `${months[month]} ${year}`;

        grid.innerHTML = '';

        ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'].forEach(d => {
            const header = document.createElement('div');
            header.className = 'day-header';
            header.textContent = d;
            grid.appendChild(header);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = now.getDate();

        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'day disabled';
            grid.appendChild(empty);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const day = document.createElement('button');
            day.type = 'button';
            day.className = 'day';
            day.textContent = d;

            if (d < today) {
                day.classList.add('disabled');
                day.disabled = true;
            } else {
                day.addEventListener('click', () => this.selectDate(d, day, months[month], year));
            }

            grid.appendChild(day);
        }
    }

    selectDate(day, el, month, year) {
        document.querySelectorAll('.calendar-grid .day').forEach(d => d.classList.remove('selected'));
        el.classList.add('selected');
        this.data.date = `${day} ${month} ${year}`;
        this.generateTimeSlots();
    }

    generateTimeSlots() {
        const container = document.getElementById('timeSlots');
        if (!container) return;

        container.innerHTML = '';
        const times = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

        times.forEach(time => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'slot';
            btn.textContent = time;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
                btn.classList.add('selected');
                this.data.time = time;
            });
            container.appendChild(btn);
        });
    }

    updateSummary() {
        const serviceNames = { cilt: 'Cilt Bakımı', sac: 'Saç Bakımı', masaj: 'Masaj Terapisi', manikur: 'Manikür & Pedikür' };
        document.getElementById('summaryService').textContent = this.data.serviceName || serviceNames[this.data.service] || '-';
        document.getElementById('summaryDate').textContent = this.data.date || '-';
        document.getElementById('summaryTime').textContent = this.data.time || '-';
        document.getElementById('summaryName').textContent = this.data.name || '-';
        document.getElementById('summaryPhone').textContent = this.data.phone || '-';
        document.getElementById('summaryPrice').textContent = this.data.price ? `₺${this.data.price.toLocaleString('tr-TR')}` : '-';
    }

    updateSlots() {
        const el = document.getElementById('slotsLeft');
        if (el) el.textContent = Math.floor(Math.random() * 4) + 2;
    }

    async submit(e) {
        e.preventDefault();

        const terms = document.querySelector('input[name="terms"]');
        if (!terms?.checked) { this.showError('Şartları kabul edin'); return; }

        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = '<span class="spinner"></span> Onaylanıyor...';

        await new Promise(r => setTimeout(r, 2000));
        this.showSuccess();
    }

    showSuccess() {
        const id = 'BK' + Date.now().toString().slice(-6);

        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:10000;';
        overlay.innerHTML = `
            <div style="background:#1a1a1a;padding:3rem;border-radius:24px;text-align:center;max-width:500px;margin:1rem;border:1px solid rgba(212,175,55,0.3);">
                <div style="font-size:4rem;margin-bottom:1rem;">🎉</div>
                <h2 style="font-family:'Cormorant Garamond',serif;font-size:2rem;color:#fff;">Tebrikler!</h2>
                <h3 style="color:#D4AF37;margin-bottom:1.5rem;">Randevunuz Onaylandı</h3>
                <div style="background:#111;padding:1.5rem;border-radius:12px;margin-bottom:1.5rem;text-align:left;color:#fff;">
                    <p style="margin:0.5rem 0;"><strong>No:</strong> ${id}</p>
                    <p style="margin:0.5rem 0;"><strong>Hizmet:</strong> ${this.data.serviceName}</p>
                    <p style="margin:0.5rem 0;"><strong>Tarih:</strong> ${this.data.date}</p>
                    <p style="margin:0.5rem 0;"><strong>Saat:</strong> ${this.data.time}</p>
                </div>
                <p style="color:#888;font-size:0.9rem;margin-bottom:1.5rem;">📱 SMS hatırlatma gönderilecek</p>
                <button onclick="location.reload()" style="background:linear-gradient(135deg,#D4AF37,#F4D03F);color:#0a0a0a;padding:1rem 2rem;border:none;border-radius:50px;font-weight:600;cursor:pointer;">Tamam</button>
            </div>
        `;
        document.body.appendChild(overlay);
    }
}

// =========================================
// ANCHOR LINKS
// =========================================
class AnchorLinks {
    constructor(smoothScroll) {
        this.smoothScroll = smoothScroll;
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    this.smoothScroll.scrollTo(target);
                }
            });
        });
    }
}

// =========================================
// INIT
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Initialize all components
    new Preloader();
    new CustomCursor();
    const smoothScroll = new SmoothScroll();
    new ScrollProgress();
    new Header();
    new ThemeToggle();
    new MagneticButtons();
    new AnimatedCounters();
    new ScrollAnimations();
    new TiltEffect();
    new ComparisonSlider();
    new Sliders();
    new Lightbox();
    new BookingSystem();
    new AnchorLinks(smoothScroll);

    console.log('✨ LUXE SPA Premium initialized');
});

// Inject spinner CSS
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
    .spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 8px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
`;
document.head.appendChild(spinnerStyle);
