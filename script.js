document.addEventListener('DOMContentLoaded', function () {
    
    /**
     * Handles the main mobile menu toggle (hamburger to close icon).
     */
    const setupMobileMenu = () => {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const hamburgerIcon = document.getElementById('hamburger-icon');
        const closeIcon = document.getElementById('close-icon');

        if (!mobileMenuButton) return;

        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            hamburgerIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        });
    };

    /**
     * Handles the accordion functionality within the mobile menu.
     */
    const setupMobileAccordion = () => {
        const accordions = document.querySelectorAll('.mobile-menu-accordion');

        accordions.forEach(accordion => {
            accordion.addEventListener('click', () => {
                const submenu = accordion.nextElementSibling;
                const chevron = accordion.querySelector('.chevron-icon');

                // Close other open submenus
                accordions.forEach(otherAccordion => {
                    if (otherAccordion !== accordion) {
                        const otherSubmenu = otherAccordion.nextElementSibling;
                        if (otherSubmenu && !otherSubmenu.classList.contains('hidden')) {
                            otherSubmenu.classList.add('hidden');
                            otherSubmenu.style.maxHeight = null;
                            otherAccordion.querySelector('.chevron-icon').classList.remove('rotate-180');
                        }
                    }
                });
                
                // Toggle current submenu
                submenu.classList.toggle('hidden');
                chevron.classList.toggle('rotate-180');
                if (!submenu.classList.contains('hidden')) {
                    submenu.style.maxHeight = submenu.scrollHeight + "px";
                } else {
                    submenu.style.maxHeight = null;
                }
            });
        });
    };

    /**
     * Handles desktop dropdown menus.
     */
    const setupDesktopDropdowns = () => {
        const dropdownContainers = document.querySelectorAll('.dropdown-container');

        dropdownContainers.forEach(container => {
            const button = container.querySelector('button');
            const menu = container.querySelector('.dropdown-menu');
            if (!button || !menu) return;

            button.addEventListener('click', (event) => {
                event.stopPropagation();
                // Check if the menu is already open
                const isMenuOpen = !menu.classList.contains('hidden');
                // First, close all dropdowns
                closeAllDropdowns();
                // If it wasn't open, open it
                if (!isMenuOpen) {
                    menu.classList.remove('hidden');
                }
            });
        });
        
        // Function to close all dropdowns
        const closeAllDropdowns = () => {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.add('hidden');
            });
        };

        // Close dropdowns when clicking outside
        window.addEventListener('click', (event) => {
            if (!event.target.closest('.dropdown-container')) {
                closeAllDropdowns();
            }
        });
    };

    /**
     * Handles the search overlay functionality.
     */
    const setupSearchOverlay = () => {
        const searchToggleButton = document.getElementById('search-toggle-button');
        const searchOverlay = document.getElementById('search-overlay');
        const closeSearchButton = document.getElementById('close-search-button');
        const searchInput = document.getElementById('search-input');
        
        if (!searchOverlay) return;

        const openSearch = () => {
            searchOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            setTimeout(() => searchInput.focus(), 50); // Delay focus slightly
        };

        const closeSearch = () => {
            searchOverlay.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
        };
        
        searchToggleButton.addEventListener('click', openSearch);
        closeSearchButton.addEventListener('click', closeSearch);
        
        searchOverlay.addEventListener('click', (event) => {
            if (event.target === searchOverlay) closeSearch();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !searchOverlay.classList.contains('hidden')) {
                closeSearch();
            }
        });
    };

    /**
     * Handles the main image slider/carousel.
     */
    const setupSlider = () => {
        const slider = document.getElementById('slider');
        const slides = slider.querySelectorAll('.slide');
        const controlsContainer = document.getElementById('slider-controls');
        if (!slides.length) return;

        let currentSlide = 0;
        let slideInterval;

        // Create navigation dots
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetInterval();
            });
            controlsContainer.appendChild(dot);
        });

        const dots = controlsContainer.querySelectorAll('.slider-dot');

        const goToSlide = (slideIndex) => {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            
            currentSlide = (slideIndex + slides.length) % slides.length;
            
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        };

        const nextSlide = () => {
            goToSlide(currentSlide + 1);
        };

        const startInterval = () => {
            slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        };
        
        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };

        // Pause on hover
        slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slider.addEventListener('mouseleave', startInterval);

        // Initialize slider
        slides[0].classList.add('active');
        dots[0].classList.add('active');
        // A single-slide slider does not need auto-play
        if (slides.length > 1) {
             startInterval();
        }
    };

    // Initialize all components
    setupMobileMenu();
    setupMobileAccordion();
    setupDesktopDropdowns();
    setupSearchOverlay();
    setupSlider();
});