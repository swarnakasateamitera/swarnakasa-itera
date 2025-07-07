/**
 * =========================================================================
 * SKRIP FINAL UNTUK WEBSITE SWARNAKASA
 * =========================================================================
 * File ini berisi semua logika JavaScript yang dibutuhkan, termasuk:
 * 1. Inisialisasi AOS (Animasi saat Scroll)
 * 2. Inisialisasi Swiper.js (untuk Galeri Carousel)
 * 3. Logika Kustom untuk Fitur Zoom Gambar (Modal Pop-up)
 * 4. Logika untuk Navbar Sticky
 * =========================================================================
 */

document.addEventListener("DOMContentLoaded", function() {

    // ---------------------------------------------------------------------
    // 1. INISIALISASI AOS (ANIMATION ON SCROLL)
    // ---------------------------------------------------------------------
    // Fitur ini memberikan animasi 'fade-up' pada elemen saat di-scroll.
    // Konfigurasi ini tidak diubah dan tetap berfungsi seperti semula.
    // ---------------------------------------------------------------------
    AOS.init({
        duration: 800,
        once: true,
    });


    // ---------------------------------------------------------------------
    // 2. INISIALISASI SWIPER.JS UNTUK GALERI
    // ---------------------------------------------------------------------
    // Fitur ini membuat galeri gambar menjadi carousel yang bisa digeser.
    // Konfigurasi ini tidak diubah dan tetap berfungsi seperti semula.
    // ---------------------------------------------------------------------
    const swiper = new Swiper('.gallery-swiper', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        loop: true,
        coverflowEffect: {
            rotate: 40,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });


    // ---------------------------------------------------------------------
    // 3. LOGIKA KUSTOM UNTUK FITUR ZOOM GAMBAR GALERI (MODAL)
    // ---------------------------------------------------------------------
    // Fitur ini memungkinkan pengguna mengklik gambar di galeri untuk melihat
    // dalam ukuran penuh dengan modal pop-up yang responsif dan mudah digunakan.
    // ---------------------------------------------------------------------

    // Mengambil elemen-elemen penting dari HTML
    const modal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-img');
    const modalLoading = document.getElementById('modal-loading');
    const modalCaption = document.getElementById('modal-caption');
    const modalCaptionText = document.getElementById('modal-caption-text');
    const closeModalBtn = document.getElementById('modal-close');
    const galleryItems = document.querySelectorAll('.gallery-item'); // Slide gallery items

    // Memeriksa apakah semua elemen modal ada sebelum melanjutkan
    if (modal && modalImage && closeModalBtn && galleryItems.length > 0) {

        // Fungsi untuk membuka modal dengan gambar
        const openModal = function(imageSrc, imageAlt = '') {
            // Reset state modal
            modalImage.style.opacity = '0';
            modalLoading.style.display = 'flex';
            modalCaption.style.opacity = '0';
            
            // Tampilkan modal
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            // Set ARIA attributes untuk accessibility
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open'); // Prevent background scrolling
            
            // Preload gambar
            const img = new Image();
            img.onload = function() {
                modalImage.src = imageSrc;
                modalImage.alt = imageAlt;
                
                // Hide loading, show image
                modalLoading.style.display = 'none';
                modalImage.style.opacity = '1';
                
                // Show caption if available
                if (imageAlt) {
                    modalCaptionText.textContent = imageAlt;
                    modalCaption.style.opacity = '1';
                }
                
                // Focus on close button for keyboard accessibility
                closeModalBtn.focus();
            };
            
            img.onerror = function() {
                console.error('Failed to load image:', imageSrc);
                closeModal();
            };
            
            img.src = imageSrc;
        };

        // Fungsi untuk menutup modal
        const closeModal = function(event) {
            // Prevent default behavior if event exists
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            
            // Reset state
            modalImage.src = '';
            modalImage.alt = '';
            modalImage.style.opacity = '0';
            modalCaption.style.opacity = '0';
            modalCaptionText.textContent = '';
            
            // Set ARIA attributes
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open'); // Restore background scrolling
            
            // Return focus to gallery section instead of top
            const gallerySection = document.getElementById('gallery');
            if (gallerySection) {
                // Scroll to gallery section smoothly with a slight delay to ensure modal is hidden
                setTimeout(() => {
                    gallerySection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                    
                    // Set focus to gallery section for accessibility after scroll completes
                    setTimeout(() => {
                        gallerySection.focus({ preventScroll: true });
                    }, 500);
                }, 100);
            } else {
                // Fallback: stay at current scroll position
                console.warn('Gallery section not found, staying at current position');
            }
        };

        // Event listener untuk setiap item galeri
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                // Ambil sumber gambar dari data-img atau dari img tag
                const imgElement = item.querySelector('.gallery-img');
                if (imgElement) {
                    const imageSrc = item.getAttribute('data-img') || imgElement.src;
                    const imageAlt = imgElement.alt || `Galeri ${index + 1}`;
                    
                    openModal(imageSrc, imageAlt);
                }
            });
            
            // Tambahkan cursor pointer untuk menunjukkan bahwa item bisa diklik
            item.style.cursor = 'pointer';
        });

        // Event listener untuk tombol close
        closeModalBtn.addEventListener('click', function(event) {
            closeModal(event);
        });

        // Event listener untuk menutup modal saat mengklik area latar belakang
        modal.addEventListener('click', function(event) {
            // Hanya tutup jika yang di-klik adalah modal backdrop, bukan kontennya
            if (event.target === modal) {
                closeModal(event);
            }
        });

        // Event listener untuk keyboard navigation
        document.addEventListener('keydown', function(event) {
            if (!modal.classList.contains('hidden')) {
                switch(event.key) {
                    case 'Escape':
                        closeModal(event);
                        break;
                    case 'Enter':
                    case ' ':
                        if (event.target === closeModalBtn) {
                            closeModal(event);
                        }
                        break;
                }
            }
        });

        // Prevent context menu on gallery images (optional)
        galleryItems.forEach(item => {
            const img = item.querySelector('.gallery-img');
            if (img) {
                img.addEventListener('contextmenu', function(event) {
                    event.preventDefault();
                });
            }
        });
    } else {
        console.warn('Gallery modal elements not found. Gallery zoom functionality will not work.');
    }


    // ---------------------------------------------------------------------
    // 4. LOGIKA UNTUK NAVBAR STICKY
    // ---------------------------------------------------------------------
    // Fitur ini membuat navbar menempel di atas saat halaman di-scroll.
    // Konfigurasi ini tidak diubah dan tetap berfungsi seperti semula.
    // ---------------------------------------------------------------------
    let nav = document.querySelector("nav");
    if (nav) {
        window.onscroll = function () {
            if (document.documentElement.scrollTop > 20) {
                nav.classList.add("sticky");
            } else {
                nav.classList.remove("sticky");
            }
        };
    }


    // ---------------------------------------------------------------------
    // 5. LOGIKA ANIMASI INTERAKTIF UNTUK DIVISION CARDS
    // ---------------------------------------------------------------------
    // Menambahkan animasi yang lebih interaktif dan engaging
    // ---------------------------------------------------------------------

    // Intersection Observer untuk animasi saat scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const divisionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe division cards
    const divisionCards = document.querySelectorAll('.division-card');
    divisionCards.forEach(card => {
        divisionObserver.observe(card);
    });

    // Observe section title and subtitle
    const sectionTitle = document.querySelector('.section-title');
    const sectionSubtitle = document.querySelector('.section-subtitle');
    
    if (sectionTitle) divisionObserver.observe(sectionTitle);
    if (sectionSubtitle) divisionObserver.observe(sectionSubtitle);

    // Enhanced hover effects dengan sound effect simulasi
    divisionCards.forEach((card, index) => {
        const icon = card.querySelector('.division-icon i');
        const title = card.querySelector('.division-title');
        
        // Mouse enter effect
        card.addEventListener('mouseenter', () => {
            // Add ripple effect
            createRippleEffect(card);
            
            // Icon rotation based on division type
            if (icon) {
                if (icon.classList.contains('fa-flag-checkered')) {
                    icon.style.animation = 'iconPulse 0.6s ease';
                } else if (icon.classList.contains('fa-microchip')) {
                    icon.style.animation = 'iconPulse 0.8s ease';
                } else if (icon.classList.contains('fa-plane')) {
                    icon.style.animation = 'iconPulse 0.7s ease';
                }
            }
        });

        // Mouse leave effect
        card.addEventListener('mouseleave', () => {
            if (icon) {
                icon.style.animation = '';
            }
        });

        // Click effect untuk interaksi lebih lanjut
        card.addEventListener('click', () => {
            // Bounce animation
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'bounce 0.6s ease';
            }, 10);
            
            // Reset animation after completion
            setTimeout(() => {
                card.style.animation = '';
            }, 600);
        });
    });

    // Function untuk membuat ripple effect yang smooth
    function createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(241, 208, 10, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 1;
        `;
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';
        
        element.style.position = 'relative';
        element.style.overflow = 'visible'; // Pastikan ripple tidak terpotong
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Add ripple keyframe animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes bounce {
            0%, 20%, 60%, 100% {
                transform: translateY(-12px) scale(1.03);
            }
            40% {
                transform: translateY(-20px) scale(1.05);
            }
            80% {
                transform: translateY(-16px) scale(1.04);
            }
        }
    `;
    document.head.appendChild(style);

    // Parallax effect for division section
    window.addEventListener('scroll', () => {
        const divisionSection = document.getElementById('divisi');
        if (divisionSection) {
            const rect = divisionSection.getBoundingClientRect();
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                divisionCards.forEach((card, index) => {
                    const offset = (index + 1) * 0.1;
                    card.style.transform = `translateY(${rate * offset}px)`;
                });
            }
        }
    });


    // ---------------------------------------------------------------------
    // 6. LOGIKA ANIMASI INTERAKTIF UNTUK ABOUT CARDS
    // ---------------------------------------------------------------------
    // Menambahkan animasi yang serupa dengan division cards untuk consistency
    // ---------------------------------------------------------------------

    // Observe about cards
    const aboutCards = document.querySelectorAll('.about-card');
    aboutCards.forEach(card => {
        divisionObserver.observe(card);
    });

    // Observe about section title and subtitle
    const aboutSectionTitle = document.querySelector('.about-section-title');
    const aboutSectionSubtitle = document.querySelector('.about-section-subtitle');
    
    if (aboutSectionTitle) divisionObserver.observe(aboutSectionTitle);
    if (aboutSectionSubtitle) divisionObserver.observe(aboutSectionSubtitle);

    // Enhanced hover effects untuk about cards
    aboutCards.forEach((card, index) => {
        const icon = card.querySelector('.about-icon svg');
        const title = card.querySelector('.about-title');
        
        // Mouse enter effect
        card.addEventListener('mouseenter', () => {
            // Add ripple effect
            createRippleEffect(card);
            
            // Icon animation based on card type
            if (icon && index === 0) {
                // Technology innovation - spin effect
                icon.style.animation = 'techSpin 2s linear infinite';
            } else if (icon && index === 1) {
                // Team collaboration - pulse effect
                icon.style.animation = 'teamPulse 1.5s ease-in-out infinite';
            } else if (icon && index === 2) {
                // Achievement - bounce effect
                icon.style.animation = 'achievementBounce 1s ease-in-out infinite';
            }
        });

        // Mouse leave effect
        card.addEventListener('mouseleave', () => {
            if (icon) {
                icon.style.animation = '';
            }
        });

        // Click effect untuk interaksi lebih lanjut
        card.addEventListener('click', () => {
            // Bounce animation
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'bounce 0.6s ease';
            }, 10);
            
            // Reset animation after completion
            setTimeout(() => {
                card.style.animation = '';
            }, 600);

            // Visual feedback dengan color flash
            const originalBg = card.style.backgroundColor;
            card.style.transition = 'background-color 0.3s ease';
            card.style.backgroundColor = 'rgba(241, 208, 10, 0.1)';
            
            setTimeout(() => {
                card.style.backgroundColor = originalBg;
            }, 300);
        });
    });

    // Add enhanced parallax effect for about section
    window.addEventListener('scroll', () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const rect = aboutSection.getBoundingClientRect();
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3; // Lighter parallax for about section
            
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                aboutCards.forEach((card, index) => {
                    const offset = (index + 1) * 0.05; // Subtle movement
                    card.style.transform = `translateY(${rate * offset}px)`;
                });
            }
        }
    });


    // ---------------------------------------------------------------------
    // 7. LOGIKA ANIMASI INTERAKTIF UNTUK ACHIEVEMENTS CARDS
    // ---------------------------------------------------------------------
    // Menambahkan animasi zoom in yang halus untuk prestasi dan capaian
    // ---------------------------------------------------------------------

    // Observe achievements cards
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach(card => {
        divisionObserver.observe(card);
    });

    // Observe achievements section title and subtitle
    const achievementsSectionTitle = document.querySelector('.achievements-section-title');
    const achievementsSectionSubtitle = document.querySelector('.achievements-section-subtitle');
    
    if (achievementsSectionTitle) divisionObserver.observe(achievementsSectionTitle);
    if (achievementsSectionSubtitle) divisionObserver.observe(achievementsSectionSubtitle);

    // Enhanced hover effects untuk achievement cards
    achievementCards.forEach((card, index) => {
        const icon = card.querySelector('.achievement-icon svg');
        const title = card.querySelector('.achievement-title');
        const year = card.querySelector('.achievement-year');
        
        // Mouse enter effect
        card.addEventListener('mouseenter', () => {
            // Add subtle ripple effect
            createRippleEffect(card);
            
            // Icon animation dengan slight bounce
            if (icon) {
                icon.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                icon.style.transform = 'scale(1.15) rotate(5deg)';
            }

            // Year badge glow effect
            if (year) {
                year.style.textShadow = '0 0 10px rgba(241, 208, 10, 0.5)';
            }
        });

        // Mouse leave effect
        card.addEventListener('mouseleave', () => {
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }

            if (year) {
                year.style.textShadow = 'none';
            }
        });

        // Click effect untuk feedback visual
        card.addEventListener('click', () => {
            // Scale down briefly then bounce back
            card.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                card.style.transform = 'scale(1.05)';
            }, 100);

            // Visual feedback dengan subtle color change
            const originalBg = card.style.backgroundColor;
            card.style.transition = 'background-color 0.2s ease';
            card.style.backgroundColor = 'rgba(241, 208, 10, 0.05)';
            
            setTimeout(() => {
                card.style.backgroundColor = originalBg;
            }, 200);

            // Icon bounce effect
            if (icon) {
                icon.style.animation = 'achievementIconBounce 0.6s ease';
                setTimeout(() => {
                    icon.style.animation = '';
                }, 600);
            }
        });
    });

    // Add enhanced subtle parallax for achievements section
    window.addEventListener('scroll', () => {
        const achievementsSection = document.getElementById('achievements');
        if (achievementsSection) {
            const rect = achievementsSection.getBoundingClientRect();
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.2; // Very subtle parallax
            
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                achievementCards.forEach((card, index) => {
                    const offset = (index + 1) * 0.03; // Very subtle movement
                    card.style.transform = `translateY(${rate * offset}px) scale(1)`;
                });
            }
        }
    });

    // Add achievement-specific keyframe animation
    const achievementStyle = document.createElement('style');
    achievementStyle.textContent = `
        @keyframes achievementIconBounce {
            0%, 20%, 60%, 100% {
                transform: scale(1.15) rotate(5deg);
            }
            40% {
                transform: scale(1.25) rotate(8deg);
            }
            80% {
                transform: scale(1.2) rotate(6deg);
            }
        }
    `;
    document.head.appendChild(achievementStyle);


    // ---------------------------------------------------------------------
    // 8. LOGIKA ANIMASI INTERAKTIF UNTUK TEAM CARDS
    // ---------------------------------------------------------------------
    // Menambahkan animasi yang engaging untuk team section dengan berbagai efek
    // ---------------------------------------------------------------------

    // Observe team cards
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
        divisionObserver.observe(card);
    });

    // Enhanced hover effects untuk team cards
    teamCards.forEach((card, index) => {
        const img = card.querySelector('img');
        const imageContainer = card.querySelector('.team-image-container');
        const name = card.querySelector('h4');
        const position = card.querySelector('p');
        
        // Initial state untuk intersection observer
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
    // Function untuk reset border animation dengan proper timing
    function resetBorderAnimation(card) {
        // Force reset semua pseudo-elements
        card.classList.add('animation-reset');
        
        // Force reflow untuk memastikan perubahan applied
        card.offsetHeight;
        
        // Remove setelah browser frame refresh
        requestAnimationFrame(() => {
            card.classList.remove('animation-reset');
        });
    }

    // Enhanced hover effects untuk team cards dengan ANTI-STUCK SYSTEM
    teamCards.forEach((card, index) => {
        const img = card.querySelector('img');
        const imageContainer = card.querySelector('.team-image-container');
        const name = card.querySelector('h4');
        const position = card.querySelector('p');
        
        // State management untuk mencegah konflik animasi
        let isHovering = false;
        let hoverTimeout = null;
        let leaveTimeout = null;
        
        // Initial state untuk intersection observer
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        // Mouse enter effect dengan robust state management dan border reset
        card.addEventListener('mouseenter', () => {
            // Clear semua timeout untuk mencegah konflik
            if (hoverTimeout) clearTimeout(hoverTimeout);
            if (leaveTimeout) clearTimeout(leaveTimeout);
            
            isHovering = true;
            
            // Reset border animation SEBELUM hover baru dengan function khusus
            resetBorderAnimation(card);
            
            // Force stop semua animasi immediately
            card.style.animation = 'none !important';
            
            // Add ripple effect
            createRippleEffect(card);
            
            // Image pulse effect dengan border glow (smooth circular)
            if (img) {
                img.classList.add('pulse-border');
                img.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important';
                // Pastikan tetap circular dengan overflow visible
                if (imageContainer) {
                    imageContainer.style.overflow = 'visible';
                }
            }

            // Name dan position effects
            if (name) {
                name.style.transform = 'translateY(-2px)';
                name.style.textShadow = '0 2px 4px rgba(241, 208, 10, 0.3)';
            }

            if (position) {
                position.style.transform = 'translateY(-2px)';
                position.style.textShadow = '0 0 8px rgba(241, 208, 10, 0.4)';
            }
            
            // Apply hover state dengan delay untuk smooth transition
            hoverTimeout = setTimeout(() => {
                if (isHovering && card.matches(':hover')) {
                    card.classList.remove('animation-reset');
                    card.style.transform = 'translateY(-15px) scale(1.03)';
                    card.style.boxShadow = '0 25px 50px rgba(33, 50, 94, 0.15)';
                }
            }, 50);
        });

        // Mouse leave effect dengan robust cleanup dan border reset
        card.addEventListener('mouseleave', () => {
            // Clear semua timeout
            if (hoverTimeout) clearTimeout(hoverTimeout);
            if (leaveTimeout) clearTimeout(leaveTimeout);
            
            isHovering = false;
            
            // Reset border animation dengan function khusus
            resetBorderAnimation(card);
            
            // Force stop semua animasi immediately
            card.style.animation = 'none !important';
            
            if (img) {
                img.classList.remove('pulse-border');
            }

            if (name) {
                name.style.transform = 'translateY(0)';
                name.style.textShadow = 'none';
            }

            if (position) {
                position.style.transform = 'translateY(0)';
                position.style.textShadow = 'none';
            }

            // Reset styles
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
            
            // Return to floating animation setelah delay yang cukup
            leaveTimeout = setTimeout(() => {
                if (!isHovering && !card.matches(':hover')) {
                    card.classList.remove('animation-reset');
                    card.classList.add('floating');
                    card.style.animation = 'teamFloatSmooth 3.5s ease-in-out infinite';
                }
            }, 300);
        });

        // Click effect untuk interaksi yang lebih responsive
        card.addEventListener('click', () => {
            // Clear semua timeout
            if (hoverTimeout) clearTimeout(hoverTimeout);
            if (leaveTimeout) clearTimeout(leaveTimeout);
            
            // Bounce animation
            card.style.animation = 'none';
            card.style.transform = 'translateY(-10px) scale(0.98)';
            
            setTimeout(() => {
                card.style.transform = 'translateY(-15px) scale(1.05)';
            }, 100);
            
            // Visual feedback dengan color flash
            const originalBg = card.style.backgroundColor;
            card.style.transition = 'background-color 0.3s ease';
            card.style.backgroundColor = 'rgba(241, 208, 10, 0.08)';
            
            setTimeout(() => {
                card.style.backgroundColor = originalBg;
                
                // Return to hover state if still hovering
                if (card.matches(':hover')) {
                    card.style.transform = 'translateY(-15px) scale(1.03)';
                }
            }, 300);

            // Image zoom effect on click
            if (img) {
                img.style.transform = 'scale(1.15)';
                setTimeout(() => {
                    if (card.matches(':hover')) {
                        img.style.transform = 'scale(1.12)'; // Hover state
                    } else {
                        img.style.transform = 'scale(1)'; // Normal state
                    }
                }, 400);
            }
        });

        // Initial floating animation setup
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            card.classList.add('floating');
            card.style.animation = 'teamFloatSmooth 3.5s ease-in-out infinite';
        }, index * 150);
    });

    // Intersection Observer khusus untuk team cards dengan efek yang lebih dramatis
    const teamObserverOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const teamObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const cardIndex = Array.from(teamCards).indexOf(card);
                
                // Trigger entrance animation with stagger
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    card.style.animation = 'slideInUp 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards, teamFloat 3s ease-in-out infinite 1.2s';
                }, cardIndex * 200);
                
                // Unobserve after animation
                teamObserver.unobserve(card);
            }
        });
    }, teamObserverOptions);

    // Observe all team cards
    teamCards.forEach(card => {
        teamObserver.observe(card);
    });

    // Add enhanced parallax effect for team section
    window.addEventListener('scroll', () => {
        const teamSection = document.getElementById('team');
        if (teamSection) {
            const rect = teamSection.getBoundingClientRect();
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.1; // Very subtle parallax
            
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                teamCards.forEach((card, index) => {
                    const offset = (index + 1) * 0.02; // Very subtle movement
                    const currentTransform = card.style.transform || '';
                    if (!currentTransform.includes('translateY')) {
                        card.style.transform = `translateY(${rate * offset}px)`;
                    }
                });
            }
        }
    });

    // Add team-specific keyframe animations dengan improved performance
    const teamStyle = document.createElement('style');
    teamStyle.textContent = `
        @keyframes teamCardHover {
            0%, 100% { 
                transform: translateY(-15px) scale(1.05);
            }
            50% { 
                transform: translateY(-18px) scale(1.05);
            }
        }
        
        @keyframes teamCardClick {
            0%, 20%, 60%, 100% {
                transform: translateY(-12px) scale(1.03);
            }
            40% {
                transform: translateY(-20px) scale(1.07);
            }
            80% {
                transform: translateY(-16px) scale(1.05);
            }
        }
        
        @keyframes teamImageGlow {
            0%, 100% { 
                box-shadow: 0 8px 25px rgba(241, 208, 10, 0.4);
                filter: brightness(1.1) contrast(1.1);
            }
            50% { 
                box-shadow: 0 12px 35px rgba(241, 208, 10, 0.6);
                filter: brightness(1.2) contrast(1.2);
            }
        }
        
        /* Improved transition untuk smooth animation switching */
        .team-card {
            transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                       box-shadow 0.3s ease,
                       opacity 0.3s ease !important;
        }
        
        .team-card img {
            transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55),
                       border-color 0.3s ease,
                       border-width 0.3s ease,
                       box-shadow 0.3s ease,
                       filter 0.3s ease !important;
        }
        
        /* Dark mode team card improvements */
        .dark .team-card {
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }
        
        .dark .team-card:hover {
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
        }
    `;
    document.head.appendChild(teamStyle);

    // Add special effects untuk team interactions dengan smooth transition
    const teamGrid = document.querySelector('.team-grid');
    if (teamGrid) {
        // Prevent animation conflicts
        let isGridHovered = false;
        
        // Add grid hover effect
        teamGrid.addEventListener('mouseenter', () => {
            isGridHovered = true;
            teamCards.forEach((card, index) => {
                // Clear existing animations
                card.style.animation = 'none';
                
                setTimeout(() => {
                    if (isGridHovered && !card.matches(':hover')) {
                        card.style.transform = 'translateY(-5px) scale(1.02)';
                    }
                }, index * 100);
            });
        });

        teamGrid.addEventListener('mouseleave', () => {
            isGridHovered = false;
            teamCards.forEach((card) => {
                if (!card.matches(':hover')) {
                    card.style.transform = 'translateY(0) scale(1)';
                    // Restart floating animation
                    setTimeout(() => {
                        if (!card.matches(':hover') && !isGridHovered) {
                            card.style.animation = 'teamFloat 3s ease-in-out infinite';
                        }
                    }, 300);
                }
            });
        });
        
        // Add intersection observer untuk smooth entrance
        const teamIntersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cards = entry.target.querySelectorAll('.team-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                            // Start floating animation setelah entrance selesai
                            setTimeout(() => {
                                if (!card.matches(':hover')) {
                                    card.style.animation = 'teamFloat 3s ease-in-out infinite';
                                }
                            }, 800);
                        }, index * 150);
                    });
                }
            });
        }, { threshold: 0.3 });
        
        teamIntersectionObserver.observe(teamGrid);
    }
    
    }); // Close teamCards.forEach

});