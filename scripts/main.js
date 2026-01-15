/**
 * LUXE SPA - Premium Beauty Center
 * Ultra Professional JavaScript System
 */

// =========================================
// UTILITY FUNCTIONS
// =========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        if (!inThrottle) {
            func.apply(this, arguments);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// =========================================
// NAVIGATION
// =========================================
class Navigation {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.toggle = document.querySelector('.mobile-menu-toggle');
        this.menu = document.querySelector('.nav__menu');
        this.links = document.querySelectorAll('.nav__link');
        this.init();
    }

    init() {
        // Sticky nav on scroll
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 50) {
                this.nav?.classList.add('scrolled');
            } else {
                this.nav?.classList.remove('scrolled');
            }
        }, 100), { passive: true });

        // Mobile menu toggle
        this.toggle?.addEventListener('click', () => {
            const isExpanded = this.toggle.getAttribute('aria-expanded') === 'true';
            this.toggle.setAttribute('aria-expanded', !isExpanded);
            this.menu?.classList.toggle('active');
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });

        // Close menu on link click
        this.links.forEach(link => {
            link.addEventListener('click', () => {
                this.toggle?.setAttribute('aria-expanded', 'false');
                this.menu?.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Active link highlighting
        this.highlightActiveLink();
    }

    highlightActiveLink() {
        const sections = document.querySelectorAll('.section, .hero-section');
        
        window.addEventListener('scroll', throttle(() => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                if (scrollY >= sectionTop) {
                    current = section.getAttribute('id') || '';
                }
            });

            this.links.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, 100), { passive: true });
    }
}

// =========================================
// SCROLL ANIMATIONS
// =========================================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.service-card, .team-card, .pricing-card, .gallery-item');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    }
}

// =========================================
// BEFORE/AFTER SLIDER
// =========================================
class BeforeAfterSlider {
    constructor() {
        this.sliders = document.querySelectorAll('.before-after-slider');
        this.init();
    }

    init() {
        this.sliders.forEach(slider => {
            this.createSlider(slider);
        });
    }

    createSlider(container) {
        const handle = container.querySelector('.slider-handle');
        const afterImg = container.querySelector('.after-img');
        let isDragging = false;

        const updateSlider = (e) => {
            if (!isDragging) return;
            const rect = container.getBoundingClientRect();
            const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            
            handle.style.left = `${percentage}%`;
            afterImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        };

        handle.addEventListener('mousedown', () => isDragging = true);
        handle.addEventListener('touchstart', () => isDragging = true);
        
        document.addEventListener('mousemove', updateSlider);
        document.addEventListener('touchmove', updateSlider);
        
        document.addEventListener('mouseup', () => isDragging = false);
        document.addEventListener('touchend', () => isDragging = false);

        // Initialize at 50%
        afterImg.style.clipPath = 'inset(0 50% 0 0)';
    }
}

// =========================================
// TESTIMONIAL CAROUSEL
// =========================================
class TestimonialCarousel {
    constructor() {
        this.track = document.querySelector('.testimonial-track');
        this.init();
    }

    init() {
        if (!this.track) return;
        
        // Clone items for infinite scroll
        const items = this.track.querySelectorAll('.testimonial-card');
        items.forEach(item => {
            const clone = item.cloneNode(true);
            this.track.appendChild(clone);
        });

        // Pause on hover
        this.track.addEventListener('mouseenter', () => {
            this.track.style.animationPlayState = 'paused';
        });

        this.track.addEventListener('mouseleave', () => {
            this.track.style.animationPlayState = 'running';
        });
    }
}

// =========================================
// BOOKING SYSTEM
// =========================================
class BookingSystem {
    constructor() {
        this.form = document.getElementById('booking-form');
        this.steps = document.querySelectorAll('.form-step');
        this.stepButtons = document.querySelectorAll('.booking-steps .step');
        this.prevBtn = document.getElementById('prev-step');
        this.nextBtn = document.getElementById('next-step');
        this.submitBtn = document.getElementById('submit-booking');
        
        this.currentStep = 1;
        this.maxStep = 4;
        
        this.formData = {
            service: '',
            serviceName: '',
            date: '',
            time: '',
            price: 0,
            name: '',
            phone: '',
            email: '',
            notes: ''
        };
        
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.setupEventListeners();
        this.generateCalendar();
        this.updateSlotsIndicator();
    }

    setupEventListeners() {
        this.prevBtn?.addEventListener('click', () => this.previousStep());
        this.nextBtn?.addEventListener('click', () => this.nextStep());
        this.submitBtn?.addEventListener('click', (e) => this.submitBooking(e));
        
        // Service selection
        document.querySelectorAll('input[name="service"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.formData.service = e.target.value;
                this.formData.serviceName = e.target.closest('.service-option').querySelector('h4').textContent;
                this.formData.price = parseInt(e.target.dataset.price) || 0;
            });
        });

        // Form submission prevent
        this.form.addEventListener('submit', (e) => e.preventDefault());
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.maxStep) {
                this.currentStep++;
                this.updateStepView();
                
                if (this.currentStep === 4) {
                    this.updateSummary();
                }
            }
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepView();
        }
    }

    updateStepView() {
        // Update fieldsets
        this.steps.forEach(step => step.classList.remove('active'));
        const currentStepEl = document.querySelector(`[data-step="${this.currentStep}"]`);
        currentStepEl?.classList.add('active');
        
        // Update step indicators
        this.stepButtons.forEach((btn, index) => {
            btn.classList.remove('active', 'completed');
            if (index + 1 === this.currentStep) {
                btn.classList.add('active');
            } else if (index + 1 < this.currentStep) {
                btn.classList.add('completed');
            }
        });
        
        // Update buttons
        this.prevBtn.disabled = this.currentStep === 1;
        this.nextBtn.style.display = this.currentStep === this.maxStep ? 'none' : 'block';
        this.submitBtn.style.display = this.currentStep === this.maxStep ? 'block' : 'none';
    }

    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                if (!this.formData.service) {
                    this.showError('Lütfen bir hizmet seçin');
                    return false;
                }
                return true;
            case 2:
                if (!this.formData.date || !this.formData.time) {
                    this.showError('Lütfen tarih ve saat seçin');
                    return false;
                }
                return true;
            case 3:
                const name = document.getElementById('name')?.value.trim();
                const phone = document.getElementById('phone')?.value.trim();
                
                if (!name || name.length < 3) {
                    this.showError('Lütfen geçerli bir ad soyad girin');
                    return false;
                }
                if (!phone || phone.length < 10) {
                    this.showError('Lütfen geçerli bir telefon numarası girin');
                    return false;
                }
                
                this.formData.name = name;
                this.formData.phone = phone;
                this.formData.email = document.getElementById('email')?.value.trim() || '';
                this.formData.notes = document.getElementById('notes')?.value.trim() || '';
                return true;
            default:
                return true;
        }
    }

    showError(message) {
        // Remove existing error
        const existingError = document.querySelector('.booking-error');
        existingError?.remove();
        
        const error = document.createElement('div');
        error.className = 'booking-error';
        error.style.cssText = 'background: #fee; color: #c00; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; text-align: center; font-weight: 500;';
        error.textContent = message;
        
        const currentFieldset = document.querySelector('.form-step.active');
        currentFieldset?.prepend(error);
        
        setTimeout(() => error.remove(), 4000);
    }

    generateCalendar() {
        const calendar = document.getElementById('booking-calendar');
        if (!calendar) return;
        
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        
        // Update month display
        const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        document.querySelector('.calendar-month').textContent = `${monthNames[month]} ${year}`;
        
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        
        // Day headers
        const dayHeaders = ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-day header';
            header.textContent = day;
            calendar.appendChild(header);
        });
        
        // Empty cells for first row
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'calendar-day unavailable';
            calendar.appendChild(empty);
        }
        
        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('button');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            dayElement.type = 'button';
            
            const date = new Date(year, month, day);
            const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            
            if (date < todayDate) {
                dayElement.classList.add('unavailable');
                dayElement.disabled = true;
            } else {
                dayElement.addEventListener('click', () => this.selectDate(date, dayElement));
            }
            
            calendar.appendChild(dayElement);
        }
    }

    selectDate(date, element) {
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
        });
        element.classList.add('selected');
        
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        this.formData.date = date.toLocaleDateString('tr-TR', options);
        
        this.generateTimeSlots();
    }

    generateTimeSlots() {
        const container = document.getElementById('time-slots');
        if (!container) return;
        
        container.innerHTML = '';
        
        const slots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
        
        slots.forEach(time => {
            const button = document.createElement('button');
            button.className = 'time-slot';
            button.textContent = time;
            button.type = 'button';
            button.addEventListener('click', () => this.selectTime(time, button));
            container.appendChild(button);
        });
    }

    selectTime(time, element) {
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        element.classList.add('selected');
        this.formData.time = time;
    }

    updateSummary() {
        document.getElementById('summary-service').textContent = this.formData.serviceName || '-';
        document.getElementById('summary-date').textContent = this.formData.date || '-';
        document.getElementById('summary-time').textContent = this.formData.time || '-';
        document.getElementById('summary-name').textContent = this.formData.name || '-';
        document.getElementById('summary-phone').textContent = this.formData.phone || '-';
        document.getElementById('summary-price').textContent = this.formData.price ? `₺${this.formData.price.toLocaleString('tr-TR')}` : '-';
    }

    updateSlotsIndicator() {
        const slotsEl = document.getElementById('slots-left');
        if (slotsEl) {
            const randomSlots = Math.floor(Math.random() * 4) + 2;
            slotsEl.textContent = randomSlots;
        }
    }

    async submitBooking(e) {
        e.preventDefault();
        
        const termsChecked = document.querySelector('input[name="terms"]')?.checked;
        if (!termsChecked) {
            this.showError('Lütfen hizmet şartlarını kabul edin');
            return;
        }
        
        // Show loading
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = '<span class="spinner"></span> Onaylanıyor...';
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success
        this.showSuccess();
    }

    showSuccess() {
        const bookingId = 'BK' + Date.now().toString().slice(-6);
        
        // Create success overlay
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        `;
        
        overlay.innerHTML = `
            <div style="background: white; padding: 3rem; border-radius: 24px; text-align: center; max-width: 500px; margin: 1rem; animation: slideUp 0.5s ease;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
                <h2 style="font-family: 'Playfair Display', serif; font-size: 2rem; margin-bottom: 0.5rem;">Tebrikler!</h2>
                <h3 style="color: #D4AF37; margin-bottom: 1.5rem;">Randevunuz Onaylandı</h3>
                <div style="background: #f5f5f5; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: left;">
                    <p style="margin: 0.5rem 0;"><strong>Randevu No:</strong> ${bookingId}</p>
                    <p style="margin: 0.5rem 0;"><strong>Hizmet:</strong> ${this.formData.serviceName}</p>
                    <p style="margin: 0.5rem 0;"><strong>Tarih:</strong> ${this.formData.date}</p>
                    <p style="margin: 0.5rem 0;"><strong>Saat:</strong> ${this.formData.time}</p>
                </div>
                <p style="color: #666; font-size: 0.9rem; margin-bottom: 1.5rem;">📱 Randevu hatırlatması SMS ile gönderilecektir.</p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button onclick="location.reload()" style="background: linear-gradient(135deg, #D4AF37, #F4D03F); color: #2c2c2c; padding: 1rem 2rem; border: none; border-radius: 50px; font-weight: 600; cursor: pointer;">Yeni Randevu</button>
                    <a href="tel:+902123456789" style="background: transparent; border: 2px solid #2c2c2c; color: #2c2c2c; padding: 1rem 2rem; border-radius: 50px; font-weight: 600; text-decoration: none;">Bizi Ara</a>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Confetti effect
        this.triggerConfetti();
    }

    triggerConfetti() {
        const colors = ['#D4AF37', '#B2AC88', '#F5F5DC', '#FFFFFF'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                border-radius: 50%;
                z-index: 10000;
                animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 4000);
        }
    }
}

// =========================================
// SMOOTH SCROLL
// =========================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// =========================================
// LAZY LOADING ENHANCEMENT
// =========================================
class LazyLoadEnhancer {
    constructor() {
        this.images = document.querySelectorAll('img[loading="lazy"]');
        this.init();
    }

    init() {
        this.images.forEach(img => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            
            if (img.complete) {
                img.style.opacity = '1';
            } else {
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                });
            }
        });
    }
}

// =========================================
// PARALLAX EFFECT
// =========================================
class ParallaxEffect {
    constructor() {
        this.hero = document.querySelector('.hero-section');
        this.init();
    }

    init() {
        if (!this.hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                this.hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
            }
        }, 16), { passive: true });
    }
}

// =========================================
// CSS KEYFRAMES INJECTION
// =========================================
function injectAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(30px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes confettiFall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
        
        .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid transparent;
            border-top-color: currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// =========================================
// INITIALIZE APPLICATION
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    // Inject animations
    injectAnimations();
    
    // Initialize all components
    new Navigation();
    new ScrollAnimations();
    new BeforeAfterSlider();
    new TestimonialCarousel();
    new BookingSystem();
    new SmoothScroll();
    new LazyLoadEnhancer();
    new ParallaxEffect();
    
    // Add loaded class
    document.body.classList.add('loaded');
    
    // Log load time
    console.log(`🌟 LUXE SPA loaded in ${Math.round(performance.now())}ms`);
});

// =========================================
// SERVICE WORKER REGISTRATION (PWA)
// =========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    });
}
