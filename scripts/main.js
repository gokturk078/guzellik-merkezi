/**
 * LUXE GÜZELLİK MERKEZİ - Clean JavaScript
 * Vanilla JS, No Dependencies, Professional
 */

(function () {
    'use strict';

    // =========================================
    // HEADER SCROLL EFFECT + PROGRESS BAR
    // =========================================
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scrollProgress');

    function handleScroll() {
        // Header background on scroll
        if (window.scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }

        // Scroll progress bar
        if (scrollProgress) {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = `${scrollPercent}%`;
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // =========================================
    // MOBILE NAVIGATION WITH OVERLAY
    // =========================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');

    function toggleMobileMenu() {
        const isActive = navMenu?.classList.contains('active');

        navToggle?.classList.toggle('active', !isActive);
        navMenu?.classList.toggle('active', !isActive);
        navOverlay?.classList.toggle('active', !isActive);
        document.body.style.overflow = !isActive ? 'hidden' : '';
    }

    function closeMobileMenu() {
        navToggle?.classList.remove('active');
        navMenu?.classList.remove('active');
        navOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    navToggle?.addEventListener('click', toggleMobileMenu);
    navOverlay?.addEventListener('click', closeMobileMenu);

    // Close menu on link click
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // =========================================
    // ACTIVE NAV LINK ON SCROLL
    // =========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightActiveNav() {
        const scrollY = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveNav, { passive: true });

    // =========================================
    // SMOOTH SCROLL
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =========================================
    // COMPARISON SLIDER + THUMBNAIL GALLERY
    // =========================================
    const slider = document.getElementById('comparisonSlider');
    const handle = document.getElementById('comparisonHandle');
    const afterImage = slider?.querySelector('.comparison-after');
    const beforeImage = slider?.querySelector('.comparison-before');

    if (slider && handle && afterImage) {
        let isDragging = false;

        function updateSlider(clientX) {
            const rect = slider.getBoundingClientRect();
            const x = clientX - rect.left;
            const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));

            handle.style.left = `${percent}%`;
            afterImage.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
        }

        // Mouse events
        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) updateSlider(e.clientX);
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Touch events
        handle.addEventListener('touchstart', () => {
            isDragging = true;
        });

        document.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches[0]) {
                updateSlider(e.touches[0].clientX);
            }
        });

        document.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Click on slider to move
        slider.addEventListener('click', (e) => {
            if (e.target !== handle && !handle.contains(e.target)) {
                updateSlider(e.clientX);
            }
        });
    }

    // Thumbnail Gallery
    const thumbnails = document.querySelectorAll('.comparison-thumbnails .thumbnail');
    const treatmentBadge = document.querySelector('.treatment-badge');
    const treatmentTitle = document.querySelector('.treatment-title');
    const treatmentDesc = document.querySelector('.treatment-desc');
    const treatmentStats = document.querySelectorAll('.treatment-stat');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Update active state
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');

            // Get data from thumbnail
            const beforeSrc = thumb.dataset.before;
            const afterSrc = thumb.dataset.after;
            const title = thumb.dataset.title;
            const type = thumb.dataset.type;
            const sessions = thumb.dataset.sessions;
            const weeks = thumb.dataset.weeks;
            const improvement = thumb.dataset.improvement;

            // Update slider images with fade effect
            if (beforeImage && afterImage) {
                slider.style.opacity = '0.5';
                setTimeout(() => {
                    beforeImage.src = beforeSrc;
                    afterImage.src = afterSrc;
                    slider.style.opacity = '1';

                    // Reset slider position
                    handle.style.left = '50%';
                    afterImage.style.clipPath = 'inset(0 50% 0 0)';
                }, 200);
            }

            // Update treatment info
            if (treatmentBadge) {
                treatmentBadge.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                    ${type}
                `;
            }
            if (treatmentTitle) treatmentTitle.textContent = title;
            if (treatmentDesc) treatmentDesc.textContent = `${type} ile ${title.toLowerCase()} tedavisi`;

            // Update stats
            if (treatmentStats.length >= 3) {
                treatmentStats[0].querySelector('.stat-value').textContent = sessions;
                treatmentStats[1].querySelector('.stat-value').textContent = weeks;
                treatmentStats[2].querySelector('.stat-value').textContent = `%${improvement}`;
            }
        });
    });

    // =========================================
    // BOOKING FORM
    // =========================================
    const bookingForm = document.getElementById('bookingForm');

    bookingForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Gönderiliyor...</span>';

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Success state
        const formCard = document.querySelector('.booking-card');
        if (formCard) {
            formCard.innerHTML = `
                <div class="form-success">
                    <div class="form-success-icon">🎉</div>
                    <h3>Randevu Talebiniz Alındı!</h3>
                    <p>En kısa sürede sizinle iletişime geçeceğiz.</p>
                    <p style="margin-top: 1rem; color: var(--gold);">📞 Acil durumlar için: 0212 345 67 89</p>
                </div>
            `;
        }
    });

    // Phone input formatting
    const phoneInput = document.getElementById('phone');
    phoneInput?.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        // Format as 05XX XXX XX XX
        if (value.length > 4) {
            value = value.slice(0, 4) + ' ' + value.slice(4);
        }
        if (value.length > 8) {
            value = value.slice(0, 8) + ' ' + value.slice(8);
        }
        if (value.length > 11) {
            value = value.slice(0, 11) + ' ' + value.slice(11);
        }

        e.target.value = value;
    });

    // Set minimum date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // =========================================
    // FLOATING BUTTONS VISIBILITY + SCROLL TO TOP
    // =========================================
    const floatingButtons = document.getElementById('floatingButtons');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    function handleFloatingButtons() {
        if (window.scrollY > 400) {
            floatingButtons?.classList.add('visible');
        } else {
            floatingButtons?.classList.remove('visible');
        }
    }

    // Scroll to top functionality
    scrollTopBtn?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', handleFloatingButtons, { passive: true });
    handleFloatingButtons(); // Initial check

    // =========================================
    // ANIMATED STAT COUNTERS
    // =========================================
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    function animateCounter(element) {
        const target = parseFloat(element.dataset.count);
        const isDecimal = element.dataset.decimal === 'true';
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = target * easeOutQuart;

            if (isDecimal) {
                element.textContent = current.toFixed(1);
            } else {
                element.textContent = Math.floor(current).toLocaleString('tr-TR');
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));

    // =========================================
    // HERO PARALLAX EFFECT
    // =========================================
    const heroImage = document.getElementById('heroImage');

    function handleParallax() {
        if (heroImage && window.scrollY < window.innerHeight) {
            const scrolled = window.scrollY;
            heroImage.style.transform = `scale(1.05) translateY(${scrolled * 0.3}px)`;
        }
    }

    window.addEventListener('scroll', handleParallax, { passive: true });

    // =========================================
    // SCROLL REVEAL ANIMATION
    // =========================================
    const revealElements = document.querySelectorAll('.service-card, .team-card, .testimonial-card, .pricing-card');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        revealObserver.observe(el);
    });

    // =========================================
    // VIP PACKAGE 24-HOUR COUNTDOWN
    // =========================================
    const vipHours = document.getElementById('vipHours');
    const vipMinutes = document.getElementById('vipMinutes');
    const vipSeconds = document.getElementById('vipSeconds');
    const vipSlotsCount = document.getElementById('vipSlotsCount');

    // Initialize VIP slots (3-7 random)
    let vipSlots = Math.floor(Math.random() * 5) + 3;
    if (vipSlotsCount) vipSlotsCount.textContent = vipSlots;

    // VIP Countdown - resets at midnight
    function getSecondsUntilMidnight() {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        return Math.floor((midnight - now) / 1000);
    }

    let vipCountdownSeconds = getSecondsUntilMidnight();

    function updateVipCountdown() {
        if (!vipHours || !vipMinutes || !vipSeconds) return;

        if (vipCountdownSeconds <= 0) {
            vipCountdownSeconds = 24 * 60 * 60; // Reset to 24 hours
        }

        const hours = Math.floor(vipCountdownSeconds / 3600);
        const minutes = Math.floor((vipCountdownSeconds % 3600) / 60);
        const seconds = vipCountdownSeconds % 60;

        vipHours.textContent = String(hours).padStart(2, '0');
        vipMinutes.textContent = String(minutes).padStart(2, '0');
        vipSeconds.textContent = String(seconds).padStart(2, '0');

        vipCountdownSeconds--;
    }

    // Start VIP countdown
    updateVipCountdown();
    setInterval(updateVipCountdown, 1000);

    // =========================================
    // DYNAMIC URGENCY SYSTEM
    // =========================================
    const slotsElement = document.getElementById('slotsRemaining');
    const countdownElement = document.getElementById('countdownTimer');
    const viewersElement = document.getElementById('liveViewers');

    // Initialize slots (2-5 random)
    let currentSlots = Math.floor(Math.random() * 4) + 2;
    if (slotsElement) slotsElement.textContent = currentSlots;

    // Countdown Timer (3 hours from now, resets daily)
    let countdownSeconds = 3 * 60 * 60; // 3 hours

    // Check localStorage for existing countdown
    const savedCountdown = localStorage.getItem('luxeCountdown');
    const savedTime = localStorage.getItem('luxeCountdownTime');

    if (savedCountdown && savedTime) {
        const elapsed = Math.floor((Date.now() - parseInt(savedTime)) / 1000);
        const remaining = parseInt(savedCountdown) - elapsed;
        if (remaining > 0) {
            countdownSeconds = remaining;
        } else {
            // Reset countdown
            countdownSeconds = 3 * 60 * 60;
            localStorage.setItem('luxeCountdown', countdownSeconds);
            localStorage.setItem('luxeCountdownTime', Date.now());
        }
    } else {
        localStorage.setItem('luxeCountdown', countdownSeconds);
        localStorage.setItem('luxeCountdownTime', Date.now());
    }

    function updateCountdown() {
        if (!countdownElement || countdownSeconds <= 0) return;

        const hours = Math.floor(countdownSeconds / 3600);
        const minutes = Math.floor((countdownSeconds % 3600) / 60);
        const seconds = countdownSeconds % 60;

        countdownElement.textContent =
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');

        countdownSeconds--;

        // Add urgency class when under 30 minutes
        if (countdownSeconds < 30 * 60) {
            countdownElement.parentElement?.parentElement?.classList.add('urgent');
        }
    }

    // Start countdown
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Live Viewers (fluctuate between 8-20)
    let currentViewers = Math.floor(Math.random() * 13) + 8;
    if (viewersElement) viewersElement.textContent = currentViewers;

    function updateViewers() {
        if (!viewersElement) return;

        // Random fluctuation (-2 to +2)
        const change = Math.floor(Math.random() * 5) - 2;
        currentViewers = Math.max(5, Math.min(25, currentViewers + change));
        viewersElement.textContent = currentViewers;
    }

    // Update viewers every 5-10 seconds
    setInterval(updateViewers, 5000 + Math.random() * 5000);

    // Occasionally decrease slots (simulate bookings)
    function simulateBooking() {
        if (!slotsElement || currentSlots <= 1) return;

        // 20% chance to decrease slot every 2 minutes
        if (Math.random() < 0.2) {
            currentSlots--;
            slotsElement.textContent = currentSlots;

            // Add flash animation
            slotsElement.style.animation = 'none';
            slotsElement.offsetHeight; // Trigger reflow
            slotsElement.style.animation = 'slotFlash 0.5s ease';
        }
    }

    setInterval(simulateBooking, 120000); // Every 2 minutes

    // =========================================
    // MULTI-CHANNEL BOOKING TABS
    // =========================================
    const bookingTabs = document.querySelectorAll('.booking-tab');
    const bookingContents = document.querySelectorAll('.booking-tab-content');

    bookingTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            // Update active tab
            bookingTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active content
            bookingContents.forEach(content => {
                content.classList.remove('active');
                if (content.dataset.content === targetTab) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Quick Booking Form
    const quickBookingForm = document.getElementById('quickBookingForm');
    quickBookingForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = quickBookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Gönderiliyor...</span>';

        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));

        submitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>Randevu Alındı!</span>';
        submitBtn.style.background = '#4CAF50';

        setTimeout(() => {
            quickBookingForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    });

    // Callback Form
    const callbackForm = document.getElementById('callbackForm');
    callbackForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = callbackForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Kaydediliyor...</span>';

        await new Promise(r => setTimeout(r, 1500));

        submitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>Sizi Arayacağız!</span>';
        submitBtn.style.background = '#4CAF50';

        setTimeout(() => {
            callbackForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    });

    // =========================================
    // LIVE BOOKING NOTIFICATIONS - SOCIAL PROOF
    // =========================================
    const liveNotification = document.getElementById('liveNotification');
    const notificationName = document.getElementById('notificationName');
    const notificationService = document.getElementById('notificationService');
    const notificationTime = document.getElementById('notificationTime');
    const notificationClose = document.getElementById('notificationClose');

    // Turkish names and services data
    const notificationData = {
        names: [
            'Ayşe S.', 'Fatma K.', 'Zeynep A.', 'Elif B.', 'Merve T.',
            'Selin D.', 'Büşra E.', 'Ceren H.', 'Dilara M.', 'Esra N.',
            'Gamze Ö.', 'Hande P.', 'İrem R.', 'Pınar Y.', 'Sibel Z.',
            'Deniz A.', 'Ece B.', 'Gizem C.', 'Melis K.', 'Yağmur S.'
        ],
        services: [
            'Hydrafacial', 'Cilt Bakımı', 'Lazer Epilasyon', 'Masaj Terapisi',
            'Manikür & Pedikür', 'Saç Bakımı', 'Kaş Tasarımı', 'IPL Tedavisi',
            'Anti-Aging', 'Derin Temizlik', 'Keratin Bakımı', 'VIP Paket'
        ],
        times: [
            '1 dakika önce', '2 dakika önce', '3 dakika önce', '5 dakika önce',
            '8 dakika önce', '10 dakika önce', '15 dakika önce', 'Az önce'
        ]
    };

    let notificationPaused = false;
    let notificationInterval = null;

    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function showNotification() {
        if (notificationPaused || !liveNotification) return;

        // Update content with random data
        if (notificationName) notificationName.textContent = getRandomItem(notificationData.names);
        if (notificationService) notificationService.textContent = getRandomItem(notificationData.services);
        if (notificationTime) notificationTime.textContent = getRandomItem(notificationData.times);

        // Show notification
        liveNotification.classList.add('visible');

        // Auto-hide after 6 seconds
        setTimeout(() => {
            liveNotification.classList.remove('visible');
        }, 6000);
    }

    function hideNotification() {
        liveNotification?.classList.remove('visible');
        notificationPaused = true;
        // Resume after 30 seconds
        setTimeout(() => {
            notificationPaused = false;
        }, 30000);
    }

    // Close button handler
    notificationClose?.addEventListener('click', hideNotification);

    // CTA click - close notification
    liveNotification?.querySelector('.notification-cta')?.addEventListener('click', () => {
        liveNotification.classList.remove('visible');
    });

    // Start notification rotation after 10 seconds initial delay
    setTimeout(() => {
        showNotification();
        // Then show every 12-20 seconds randomly
        notificationInterval = setInterval(() => {
            if (!notificationPaused) {
                showNotification();
            }
        }, 12000 + Math.random() * 8000);
    }, 10000);

    // Pause notifications when user is interacting with forms
    document.querySelectorAll('input, textarea, select').forEach(el => {
        el.addEventListener('focus', () => {
            notificationPaused = true;
        });
        el.addEventListener('blur', () => {
            setTimeout(() => {
                notificationPaused = false;
            }, 5000);
        });
    });

    // =========================================
    // SKIN ANALYSIS QUIZ - LEAD MAGNET
    // =========================================
    const quizOverlay = document.getElementById('quizOverlay');
    const quizModal = document.getElementById('quizModal');
    const quizClose = document.getElementById('quizClose');
    const quizTrigger = document.getElementById('quizTrigger');
    const quizProgressBar = document.getElementById('quizProgressBar');
    const quizStepIndicator = document.getElementById('quizStepIndicator');
    const quizSteps = document.querySelectorAll('.quiz-step');
    const quizForm = document.getElementById('quizForm');
    const quizRecommendations = document.getElementById('quizRecommendations');
    const quizBookBtn = document.getElementById('quizBookBtn');

    let currentQuizStep = 1;
    const totalQuizSteps = 5;
    const quizAnswers = {};

    // Service recommendations based on answers
    const serviceRecommendations = {
        akne: [
            { name: 'Akne Tedavisi', desc: 'Derin gözenek temizliği ve akne kontrolü', price: '450₺' },
            { name: 'LED Terapi', desc: 'Yağ üretimini dengeleyici mavi ışık tedavisi', price: '350₺' },
            { name: 'Derin Temizlik', desc: 'Haftalık profesyonel temizlik', price: '300₺' }
        ],
        leke: [
            { name: 'Leke Tedavisi', desc: 'C vitamini ve AHA/BHA serum tedavisi', price: '550₺' },
            { name: 'Kimyasal Peeling', desc: 'Ton eşitleme ve yenilenme', price: '600₺' },
            { name: 'Hydrafacial', desc: 'Parlaklık ve nem dengesi', price: '650₺' }
        ],
        kırışıklık: [
            { name: 'Anti-Aging Bakım', desc: 'Kolajen üretimini artırıcı tedavi', price: '750₺' },
            { name: 'Botox Alternatif', desc: 'Peptit bazlı sıkılaştırma', price: '850₺' },
            { name: 'Yüz Masajı', desc: 'Kas gevşetme ve dolaşım artırma', price: '400₺' }
        ],
        kuruluk: [
            { name: 'Nem Terapisi', desc: 'Hyaluronik asit yoğun nemlendirme', price: '500₺' },
            { name: 'Hydrafacial', desc: 'Derin nemlendirme ve beslenme', price: '650₺' },
            { name: 'Bariyer Onarım', desc: 'Cilt bariyeri güçlendirme', price: '450₺' }
        ],
        gözenek: [
            { name: 'Gözenek Küçültme', desc: 'Laser veya mikro iğneleme', price: '700₺' },
            { name: 'Hydrafacial', desc: 'Gözenek temizliği ve sıkılaştırma', price: '650₺' },
            { name: 'Retinol Peel', desc: 'Hücre yenileme ve sıkılaştırma', price: '550₺' }
        ]
    };

    function openQuiz() {
        quizOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeQuiz() {
        quizOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateProgress() {
        const progress = (currentQuizStep / totalQuizSteps) * 100;
        if (quizProgressBar) quizProgressBar.style.width = progress + '%';
        if (quizStepIndicator) quizStepIndicator.textContent = `Adım ${currentQuizStep}/${totalQuizSteps}`;
    }

    function showStep(stepNum) {
        quizSteps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.dataset.step) === stepNum) {
                step.classList.add('active');
            }
        });
        currentQuizStep = stepNum;
        updateProgress();
    }

    function showResults() {
        quizModal?.classList.add('show-results');

        // Get recommendations based on main concern
        const concern = quizAnswers.concern || 'kuruluk';
        const recommendations = serviceRecommendations[concern] || serviceRecommendations.kuruluk;

        // Render recommendations
        if (quizRecommendations) {
            quizRecommendations.innerHTML = recommendations.map((rec, idx) => `
                <div class="recommendation-card">
                    <div class="recommendation-rank">${idx + 1}</div>
                    <div class="recommendation-info">
                        <h4>${rec.name}</h4>
                        <p>${rec.desc} • ${rec.price}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    // Event Listeners
    quizTrigger?.addEventListener('click', openQuiz);
    quizClose?.addEventListener('click', closeQuiz);

    quizOverlay?.addEventListener('click', (e) => {
        if (e.target === quizOverlay) closeQuiz();
    });

    // Quiz option clicks
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', () => {
            const step = option.closest('.quiz-step');
            const stepNum = parseInt(step.dataset.step);
            const value = option.dataset.value;

            // Save answer
            if (stepNum === 1) quizAnswers.skinType = value;
            if (stepNum === 2) quizAnswers.concern = value;
            if (stepNum === 3) quizAnswers.experience = value;
            if (stepNum === 4) quizAnswers.budget = value;

            // Mark as selected
            step.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');

            // Auto advance after 300ms
            setTimeout(() => {
                if (stepNum < totalQuizSteps) {
                    showStep(stepNum + 1);
                }
            }, 300);
        });
    });

    // Form submission
    quizForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = quizForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Analiz ediliyor...</span>';

        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));

        // Save contact info
        quizAnswers.name = document.getElementById('quizName')?.value;
        quizAnswers.phone = document.getElementById('quizPhone')?.value;
        quizAnswers.email = document.getElementById('quizEmail')?.value;

        // Show results
        showResults();
    });

    // Book button closes quiz
    quizBookBtn?.addEventListener('click', closeQuiz);

    // =========================================
    // SMART CHATBOT - DECISION TREE
    // =========================================
    const chatbot = document.getElementById('chatbot');
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotMinimize = document.getElementById('chatbotMinimize');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotQuickReplies = document.getElementById('chatbotQuickReplies');

    // Decision Tree Data
    const chatbotData = {
        welcome: {
            message: getGreeting() + ' Luxe Güzellik Merkezi\'ne hoş geldiniz! 💫 Size nasıl yardımcı olabilirim?',
            options: [
                { text: '📅 Randevu Al', action: 'booking' },
                { text: '💡 Hizmet Önerisi', action: 'recommendation' },
                { text: '💰 Fiyat Bilgisi', action: 'prices' },
                { text: '❓ Sık Sorulan Sorular', action: 'faq' },
                { text: '📍 Konum & Ulaşım', action: 'location' },
                { text: '📞 Canlı Destek', action: 'support' }
            ]
        },
        booking: {
            message: 'Harika! Randevu almak istediğiniz hizmeti seçin:',
            options: [
                { text: '✨ Cilt Bakımı', action: 'booking_skin' },
                { text: '💆 Hydrafacial', action: 'booking_hydra' },
                { text: '💇 Saç Bakımı', action: 'booking_hair' },
                { text: '💅 Manikür & Pedikür', action: 'booking_nails' },
                { text: '🌟 VIP Paket', action: 'booking_vip' },
                { text: '◀️ Ana Menü', action: 'welcome' }
            ]
        },
        booking_skin: {
            message: 'Cilt Bakımı için mükemmel bir seçim! 🌸\n\n⏰ Süre: 60-90 dakika\n💰 Fiyat: 450₺\'den başlayan\n\nHemen randevu almak ister misiniz?',
            options: [
                { text: '✅ Hemen Randevu Al', action: 'redirect_booking' },
                { text: '📱 WhatsApp ile İletişim', action: 'redirect_whatsapp' },
                { text: '◀️ Diğer Hizmetler', action: 'booking' }
            ]
        },
        booking_hydra: {
            message: 'Hydrafacial ile cildiniz 10 yaş genç görünecek! ✨\n\n⏰ Süre: 45-60 dakika\n💰 Fiyat: 650₺\n🎁 İlk seansta %15 indirim!\n\nHemen randevu almak ister misiniz?',
            options: [
                { text: '✅ Hemen Randevu Al', action: 'redirect_booking' },
                { text: '📱 WhatsApp ile İletişim', action: 'redirect_whatsapp' },
                { text: '◀️ Diğer Hizmetler', action: 'booking' }
            ]
        },
        booking_hair: {
            message: 'Saç Bakımı ile saçlarınıza hayat verin! 💇‍♀️\n\n⏰ Süre: 45-90 dakika\n💰 Fiyat: 300₺\'den başlayan\n\nUzman ekibimiz sizi bekliyor!',
            options: [
                { text: '✅ Hemen Randevu Al', action: 'redirect_booking' },
                { text: '📱 WhatsApp ile İletişim', action: 'redirect_whatsapp' },
                { text: '◀️ Diğer Hizmetler', action: 'booking' }
            ]
        },
        booking_nails: {
            message: 'Manikür & Pedikür ile elleriniz ve ayaklarınız ışıldasın! 💅\n\n⏰ Süre: 60-90 dakika\n💰 Fiyat: Set 250₺\n\nRandevunuzu hemen oluşturalım!',
            options: [
                { text: '✅ Hemen Randevu Al', action: 'redirect_booking' },
                { text: '📱 WhatsApp ile İletişim', action: 'redirect_whatsapp' },
                { text: '◀️ Diğer Hizmetler', action: 'booking' }
            ]
        },
        booking_vip: {
            message: '🌟 VIP Paket - Kendinize özel bir gün!\n\n✨ Dahil Hizmetler:\n• Hydrafacial\n• Masaj Terapisi\n• Manikür & Pedikür\n• İkramlar\n\n⏰ Süre: 4-5 saat\n💰 Fiyat: 1.890₺ (2.500₺ değerinde)\n\nBu özel paket için hemen randevu alın!',
            options: [
                { text: '✅ Hemen Randevu Al', action: 'redirect_booking' },
                { text: '📱 WhatsApp ile İletişim', action: 'redirect_whatsapp' },
                { text: '◀️ Ana Menü', action: 'welcome' }
            ]
        },
        recommendation: {
            message: 'Size en uygun hizmeti bulmak için birkaç soru soracağım! 💭\n\nEn büyük güzellik hedefiniz nedir?',
            options: [
                { text: '🌸 Cilt Sorunları', action: 'rec_skin' },
                { text: '😌 Stres & Rahatlama', action: 'rec_relax' },
                { text: '💇 Saç Problemleri', action: 'rec_hair' },
                { text: '✨ Genel Bakım', action: 'rec_general' },
                { text: '◀️ Ana Menü', action: 'welcome' }
            ]
        },
        rec_skin: {
            message: 'Cilt sorunları için size önerilerim:\n\n1️⃣ **Hydrafacial** - Derin temizlik ve nem\n2️⃣ **Anti-Aging Bakım** - Kırışıklık önleme\n3️⃣ **Akne Tedavisi** - Sivilce kontrolü\n\n💡 En popüler: Hydrafacial!',
            options: [
                { text: '💆 Hydrafacial Randevusu', action: 'booking_hydra' },
                { text: '🔍 Diğer Seçenekler', action: 'booking' },
                { text: '◀️ Ana Menü', action: 'welcome' }
            ]
        },
        rec_relax: {
            message: 'Rahatlama için önerilerim:\n\n1️⃣ **Masaj Terapisi** - Derin gevşeme\n2️⃣ **VIP Paket** - Tam gün şımarma\n3️⃣ **Aromaterapi** - Zihinsel dinlenme\n\n💡 En popüler: Masaj Terapisi!',
            options: [
                { text: '🌟 VIP Paket İncele', action: 'booking_vip' },
                { text: '📅 Randevu Al', action: 'redirect_booking' },
                { text: '◀️ Ana Menü', action: 'welcome' }
            ]
        },
        rec_hair: {
            message: 'Saç problemleri için önerilerim:\n\n1️⃣ **Keratin Bakımı** - Parlak, düz saçlar\n2️⃣ **Dökülme Tedavisi** - Güçlü kökler\n3️⃣ **Renk & Bakım** - Canlı saçlar',
            options: [
                { text: '💇 Saç Bakımı Randevusu', action: 'booking_hair' },
                { text: '📞 Uzmanla Görüş', action: 'support' },
                { text: '◀️ Ana Menü', action: 'welcome' }
            ]
        },
        rec_general: {
            message: 'Genel bakım için popüler seçenekler:\n\n✨ **Aylık Bakım Paketi** - 990₺\n✨ **VIP Paket** - 1.890₺\n✨ **Deneme Paketi** - 350₺ (İlk ziyaret)\n\n💡 Yeni müşterilerimize özel %15 indirim!',
            options: [
                { text: '🎁 Deneme Paketi Al', action: 'redirect_booking' },
                { text: '🌟 VIP Paket İncele', action: 'booking_vip' },
                { text: '◀️ Ana Menü', action: 'welcome' }
            ]
        },
        prices: {
            message: '💰 Fiyat Listesi:\n\n• Cilt Bakımı: 450₺\'den\n• Hydrafacial: 650₺\n• Saç Bakımı: 300₺\'den\n• Manikür-Pedikür: 250₺\n• Masaj: 400₺\'den\n• VIP Paket: 1.890₺\n\n🎁 İlk ziyarette %15 indirim!',
            options: [
                { text: '📅 Randevu Al', action: 'booking' },
                { text: '📋 Paketleri Gör', action: 'redirect_prices' },
                { text: '◀️ Ana Menü', action: 'welcome' }
            ]
        },
        faq: {
            message: 'Sık sorulan sorular:',
            options: [
                { text: '🕐 Çalışma saatleri?', action: 'faq_hours' },
                { text: '🅿️ Park yeri var mı?', action: 'faq_parking' },
                { text: '💳 Ödeme seçenekleri?', action: 'faq_payment' },
                { text: '❌ İptal politikası?', action: 'faq_cancel' },
                { text: '◀️ Ana Menü', action: 'welcome' }
            ]
        },
        faq_hours: {
            message: '🕐 Çalışma Saatlerimiz:\n\n• Pazartesi-Cumartesi: 09:00-21:00\n• Pazar: 10:00-18:00\n\n📞 Rezervasyon için 24 saat ulaşabilirsiniz!',
            options: [
                { text: '📅 Randevu Al', action: 'redirect_booking' },
                { text: '❓ Diğer Sorular', action: 'faq' },
                { text: '◀️ Ana Menü', action: 'welcome' }
            ]
        },
        faq_parking: {
            message: '🅿️ Evet! Ücretsiz vale park hizmetimiz bulunmaktadır.\n\nAdres: Nişantaşı, Teşvikiye Cad. No:42',
            options: [
                { text: '📍 Haritada Gör', action: 'redirect_location' },
                { text: '❓ Diğer Sorular', action: 'faq' },
                { text: '◀️ Ana Menü', action: 'welcome' }
            ]
        },
        faq_payment: {
            message: '💳 Ödeme Seçenekleri:\n\n• Nakit\n• Kredi/Banka Kartı\n• Havale/EFT\n• 3-6 Taksit imkanı\n\n✅ Tüm kartlar geçerlidir!',
            options: [
                { text: '📅 Randevu Al', action: 'redirect_booking' },
                { text: '❓ Diğer Sorular', action: 'faq' },
                { text: '◀️ Ana Menü', action: 'welcome' }
            ]
        },
        faq_cancel: {
            message: '❌ İptal Politikası:\n\n• 24 saat öncesine kadar ücretsiz iptal\n• 24 saatten az kalan iptallerde %50 ücret\n\n📞 İptal için: 0212 345 67 89',
            options: [
                { text: '📅 Randevu Al', action: 'redirect_booking' },
                { text: '❓ Diğer Sorular', action: 'faq' },
                { text: '◀️ Ana Menü', action: 'welcome' }
            ]
        },
        location: {
            message: '📍 Adresimiz:\n\nNişantaşı, Teşvikiye Cad. No:42\nŞişli/İstanbul\n\n🚇 Metro: Osmanbey (5 dk yürüme)\n🚌 Otobüs: Nişantaşı durağı\n🅿️ Ücretsiz vale park',
            options: [
                { text: '🗺️ Haritada Aç', action: 'redirect_maps' },
                { text: '📞 Yol Tarifi Al', action: 'support' },
                { text: '◀️ Ana Menü', action: 'welcome' }
            ]
        },
        support: {
            message: '📞 Canlı Destek:\n\nTelefon: 0212 345 67 89\nWhatsApp: Hemen yazın!\n\n⏰ Müşteri hizmetleri 09:00-21:00 arası aktif.',
            options: [
                { text: '📱 WhatsApp Aç', action: 'redirect_whatsapp' },
                { text: '📞 Hemen Ara', action: 'redirect_phone' },
                { text: '◀️ Ana Menü', action: 'welcome' }
            ]
        }
    };

    function getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Günaydın! ☀️';
        if (hour < 18) return 'İyi günler! 🌤️';
        return 'İyi akşamlar! 🌙';
    }

    function getCurrentTime() {
        return new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    }

    function addMessage(text, isBot = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isBot ? 'bot' : 'user'}`;
        messageDiv.innerHTML = `
            <div class="message-bubble">${text.replace(/\n/g, '<br>')}</div>
            <span class="message-time">${getCurrentTime()}</span>
        `;
        chatbotMessages?.appendChild(messageDiv);
        chatbotMessages?.scrollTo({ top: chatbotMessages.scrollHeight, behavior: 'smooth' });
    }

    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot typing';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        `;
        chatbotMessages?.appendChild(typingDiv);
        chatbotMessages?.scrollTo({ top: chatbotMessages.scrollHeight, behavior: 'smooth' });
        return typingDiv;
    }

    function removeTyping(typingEl) {
        typingEl?.remove();
    }

    function renderQuickReplies(options) {
        if (!chatbotQuickReplies) return;
        chatbotQuickReplies.innerHTML = '';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quick-reply-btn';
            btn.textContent = opt.text;
            btn.addEventListener('click', () => handleAction(opt.action, opt.text));
            chatbotQuickReplies.appendChild(btn);
        });
    }

    function handleAction(action, userText) {
        // Add user message
        addMessage(userText, false);

        // Handle redirects
        if (action === 'redirect_booking') {
            setTimeout(() => {
                chatbot?.classList.remove('open');
                document.querySelector('#randevu')?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
            return;
        }
        if (action === 'redirect_whatsapp') {
            window.open('https://wa.me/902123456789?text=Merhaba,%20bilgi%20almak%20istiyorum', '_blank');
            return;
        }
        if (action === 'redirect_phone') {
            window.location.href = 'tel:+902123456789';
            return;
        }
        if (action === 'redirect_prices') {
            chatbot?.classList.remove('open');
            document.querySelector('#fiyatlar')?.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        if (action === 'redirect_location' || action === 'redirect_maps') {
            window.open('https://maps.google.com/?q=Nişantaşı+Teşvikiye+Caddesi+İstanbul', '_blank');
            return;
        }

        // Show typing indicator
        const typing = showTyping();

        // Simulate response delay
        setTimeout(() => {
            removeTyping(typing);
            const data = chatbotData[action];
            if (data) {
                addMessage(data.message);
                renderQuickReplies(data.options);
            }
        }, 800 + Math.random() * 400);
    }

    // Toggle chatbot
    chatbotToggle?.addEventListener('click', () => {
        chatbot?.classList.toggle('open');

        // Show welcome message on first open
        if (chatbot?.classList.contains('open') && chatbotMessages?.children.length === 0) {
            setTimeout(() => {
                addMessage(chatbotData.welcome.message);
                renderQuickReplies(chatbotData.welcome.options);
            }, 300);
        }
    });

    // Minimize button
    chatbotMinimize?.addEventListener('click', () => {
        chatbot?.classList.remove('open');
    });

    // =========================================
    // EXIT INTENT POPUP
    // =========================================
    const exitPopupOverlay = document.getElementById('exitPopupOverlay');
    const exitPopup = document.getElementById('exitPopup');
    const exitPopupClose = document.getElementById('exitPopupClose');
    const exitPopupDecline = document.getElementById('exitPopupDecline');
    const exitPopupForm = document.getElementById('exitPopupForm');
    const exitPopupSuccess = document.getElementById('exitPopupSuccess');
    const exitPopupBook = document.getElementById('exitPopupBook');

    let exitPopupShown = false;

    // Check if popup was shown before (24 hour cookie)
    function hasExitPopupBeenShown() {
        return localStorage.getItem('exitPopupShown') !== null;
    }

    function markExitPopupShown() {
        const expiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
        localStorage.setItem('exitPopupShown', expiry);
    }

    function showExitPopup() {
        if (exitPopupShown || hasExitPopupBeenShown()) return;
        exitPopupShown = true;
        exitPopupOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideExitPopup() {
        exitPopupOverlay?.classList.remove('active');
        document.body.style.overflow = '';
        markExitPopupShown();
    }

    // Exit intent detection - mouse leaves viewport from top
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 10) {
            showExitPopup();
        }
    });

    // Mobile: Detect back button or fast scroll up (simplified)
    let lastScrollY = window.scrollY;
    let scrollUpCount = 0;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY < lastScrollY && currentScrollY < 100) {
            scrollUpCount++;
            if (scrollUpCount > 3 && !exitPopupShown && !hasExitPopupBeenShown()) {
                // User scrolling up rapidly near top - might be leaving
                setTimeout(() => {
                    if (window.scrollY < 50) {
                        showExitPopup();
                    }
                }, 500);
            }
        } else {
            scrollUpCount = 0;
        }
        lastScrollY = currentScrollY;
    }, { passive: true });

    // Close handlers
    exitPopupClose?.addEventListener('click', hideExitPopup);
    exitPopupDecline?.addEventListener('click', hideExitPopup);

    // Close on overlay click
    exitPopupOverlay?.addEventListener('click', (e) => {
        if (e.target === exitPopupOverlay) {
            hideExitPopup();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && exitPopupOverlay?.classList.contains('active')) {
            hideExitPopup();
        }
    });

    // Form submission
    exitPopupForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = exitPopupForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Gönderiliyor...</span>';

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success state
        exitPopup?.classList.add('success');
        markExitPopupShown();
    });

    // Book button closes popup
    exitPopupBook?.addEventListener('click', () => {
        hideExitPopup();
    });

    // =========================================
    // STICKY BOOKING BAR
    // =========================================
    const stickyBookingBar = document.getElementById('stickyBookingBar');
    const stickySlotsCount = document.getElementById('stickySlotsCount');

    // Sync sticky slots with main urgency slots
    if (stickySlotsCount && currentSlots) {
        stickySlotsCount.textContent = currentSlots;
    }

    // Show sticky bar after scrolling 500px
    function updateStickyBar() {
        if (window.scrollY > 500) {
            stickyBookingBar?.classList.add('visible');
        } else {
            stickyBookingBar?.classList.remove('visible');
        }

        // Update slots count if changed
        if (stickySlotsCount && slotsElement) {
            stickySlotsCount.textContent = slotsElement.textContent;
        }
    }

    window.addEventListener('scroll', updateStickyBar, { passive: true });

    // =========================================
    // REFERRAL LINK COPY
    // =========================================
    const referralLink = document.getElementById('referralLink');
    const copyReferralBtn = document.getElementById('copyReferralBtn');
    const shareCopyBtn = document.getElementById('shareCopyBtn');

    async function copyReferralLink(btn) {
        if (!referralLink) return;

        try {
            await navigator.clipboard.writeText(referralLink.value);

            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>Kopyalandı!</span>';
            btn.style.background = '#4CAF50';
            btn.style.color = '#fff';

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.style.color = '';
            }, 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    }

    copyReferralBtn?.addEventListener('click', () => copyReferralLink(copyReferralBtn));
    shareCopyBtn?.addEventListener('click', () => copyReferralLink(shareCopyBtn));

    // =========================================
    // INIT LOG
    // =========================================
    console.log('✨ Luxe Güzellik Merkezi - Site yüklendi');

})();
