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
                const isMenuOpen = !menu.classList.contains('hidden');
                closeAllDropdowns();
                if (!isMenuOpen) {
                    menu.classList.remove('hidden');
                }
            });
        });
        
        const closeAllDropdowns = () => {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.add('hidden');
            });
        };

        window.addEventListener('click', (event) => {
            if (!event.target.closest('.dropdown-container')) {
                closeAllDropdowns();
            }
        });
    };

    /**
     * Handles the inline search bar in the navbar.
     */
    const setupNavbarSearch = () => {
        const searchToggleButton = document.getElementById('search-toggle-button');
        const inlineSearchContainer = document.getElementById('inline-search-container');
        const closeInlineSearchButton = document.getElementById('close-inline-search');
        const searchInput = document.getElementById('inline-search-input');
        
        if (!searchToggleButton || !inlineSearchContainer || !closeInlineSearchButton) return;

        const openSearch = () => {
            inlineSearchContainer.classList.remove('hidden');
            inlineSearchContainer.classList.add('flex');
            setTimeout(() => searchInput.focus(), 50);
        };

        const closeSearch = () => {
            inlineSearchContainer.classList.add('hidden');
            inlineSearchContainer.classList.remove('flex');
        };

        searchToggleButton.addEventListener('click', openSearch);
        closeInlineSearchButton.addEventListener('click', closeSearch);
        
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !inlineSearchContainer.classList.contains('hidden')) {
                closeSearch();
            }
        });
    };


    /**
     * Handles the main image slider/carousel.
     */
    const setupSlider = () => {
        const slider = document.getElementById('slider');
        if (!slider) return;
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
            if (slides[currentSlide]) {
                slides[currentSlide].classList.remove('active');
                dots[currentSlide].classList.remove('active');
            }
            
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
        if (slides.length > 0) {
            slides[0].classList.add('active');
            dots[0].classList.add('active');
            if (slides.length > 1) {
                startInterval();
            }
        }
    };

    // Initialize all components
    setupMobileMenu();
    setupMobileAccordion();
    setupDesktopDropdowns();
    setupNavbarSearch();
    setupSlider();
    setupCategoryScroller(); 
});

/**
 * Handles the automatic scrolling for the category cards on mobile.
 */
const setupCategoryScroller = () => {
    const container = document.querySelector('.category-container');
    // Exit if the container element doesn't exist
    if (!container) return;

    const cards = container.querySelectorAll('.category-card');
    // Exit if there's nothing to scroll
    if (cards.length <= 1) return;

    let currentIndex = 0;
    let autoScrollInterval;

    const startAutoScroll = () => {
        // Stop any previous scrolling
        clearInterval(autoScrollInterval);

        // Set an interval to scroll every 2 seconds
        autoScrollInterval = setInterval(() => {
            // This check ensures scrolling only happens when the view is mobile (i.e., horizontal)
            const isScrollable = container.scrollWidth > container.clientWidth;

            if (isScrollable) {
                // Move to the next card, and loop back to the start if at the end
                currentIndex = (currentIndex + 1) % cards.length;
                
                const nextCard = cards[currentIndex];

                // Smoothly scroll the container to the next card's position
                container.scrollTo({
                    left: nextCard.offsetLeft,
                    behavior: 'smooth'
                });
            }
        }, 2000); // 2000 milliseconds = 2 seconds
    };

    // Start the automatic scrolling
    startAutoScroll();

    // Optional but recommended: Pause scrolling when the user's mouse is over the container
    container.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
    // Resume scrolling when the mouse leaves
    container.addEventListener('mouseleave', startAutoScroll);
};
