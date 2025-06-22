document.addEventListener('DOMContentLoaded', function () {

    /**
     * Handles the main mobile menu toggle (hamburger to close icon).
     */
    const setupMobileMenu = () => {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const hamburgerIcon = document.getElementById('hamburger-icon');
        const closeIcon = document.getElementById('close-icon');

        if (!mobileMenuButton || !mobileMenu || !hamburgerIcon || !closeIcon) return;

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
                if (!submenu || !chevron) return;

                const isHidden = submenu.classList.contains('hidden');

                // Close all other accordions first
                accordions.forEach(otherAccordion => {
                    if (otherAccordion !== accordion) {
                        const otherSubmenu = otherAccordion.nextElementSibling;
                        const otherChevron = otherAccordion.querySelector('.chevron-icon');
                        if (otherSubmenu && !otherSubmenu.classList.contains('hidden')) {
                            otherSubmenu.classList.add('hidden');
                            otherSubmenu.style.maxHeight = null;
                            otherChevron.classList.remove('rotate-180');
                        }
                    }
                });
                
                // Toggle the current accordion
                submenu.classList.toggle('hidden', !isHidden);
                chevron.classList.toggle('rotate-180', isHidden);
                if (isHidden) {
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

        const closeAllDropdowns = () => {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.add('hidden');
            });
        };

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
     * Handles the main hero image slider/carousel.
     */
    const setupSlider = () => {
        const slider = document.getElementById('slider');
        if (!slider) return;
        const slides = slider.querySelectorAll('.slide');
        const controlsContainer = document.getElementById('slider-controls');
        if (!slides.length || !controlsContainer) return;

        let currentSlide = 0;
        let slideInterval;

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

        const nextSlide = () => goToSlide(currentSlide + 1);
        const startInterval = () => slideInterval = setInterval(nextSlide, 5000);
        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };

        slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slider.addEventListener('mouseleave', startInterval);

        if (slides.length > 0) {
            goToSlide(0); // Set initial state correctly
            if (slides.length > 1) {
                startInterval();
            }
        }
    };

    /**
     * Sets up horizontal scrolling containers with arrow buttons and mobile auto-scroll.
     */
    const setupHorizontalScrollers = () => {
        const scrollers = document.querySelectorAll('.horizontal-scroll-container');
        if (scrollers.length === 0) return;
        const autoScrollIntervals = {};

        scrollers.forEach(scroller => {
            const containerId = scroller.id;
            if (!containerId) return; // Skip if scroller has no ID

            const leftArrow = document.querySelector(`.scroll-arrow.left-arrow[data-container="${containerId}"]`);
            const rightArrow = document.querySelector(`.scroll-arrow.right-arrow[data-container="${containerId}"]`);
            
            if (leftArrow && rightArrow) {
                leftArrow.addEventListener('click', () => scroller.scrollBy({ left: scroller.clientWidth * -0.8, behavior: 'smooth' }));
                rightArrow.addEventListener('click', () => scroller.scrollBy({ left: scroller.clientWidth * 0.8, behavior: 'smooth' }));
            }
            
            const cards = scroller.querySelectorAll('.hostel-card, .entity-card, .category-card');
            let currentIndex = 0;
            const startAutoScroll = () => {
                const isMobile = window.matchMedia('(max-width: 1023px)').matches;
                if (!isMobile || cards.length <= 1) return;
                clearInterval(autoScrollIntervals[containerId]); 
                autoScrollIntervals[containerId] = setInterval(() => {
                    currentIndex = (currentIndex + 1) % cards.length;
                    const nextCard = cards[currentIndex];
                    if (currentIndex === 0) {
                        scroller.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        scroller.scrollTo({ left: nextCard.offsetLeft - 16, behavior: 'smooth' });
                    }
                }, 3500);
            };
            const stopAutoScroll = () => clearInterval(autoScrollIntervals[containerId]);
            startAutoScroll();
            scroller.addEventListener('touchstart', stopAutoScroll, { passive: true });
            scroller.addEventListener('mouseenter', stopAutoScroll);
            scroller.addEventListener('touchend', () => setTimeout(startAutoScroll, 5000));
            scroller.addEventListener('mouseleave', startAutoScroll);
            window.addEventListener('resize', () => {
                stopAutoScroll();
                startAutoScroll();
            });
        });
    };

    /**
     * Sets up functionality for individual hostel cards, including sliders and room tabs.
     */
    const setupHostelCards = () => {
        const hostelCards = document.querySelectorAll('.hostel-card');
        hostelCards.forEach(card => {
            const slider = card.querySelector('.slider');
            if (slider) {
                const slides = card.querySelectorAll('.slide');
                const prevBtn = card.querySelector('.prev-btn');
                const nextBtn = card.querySelector('.next-btn');
                if (!slides.length || !prevBtn || !nextBtn) return;
                let currentIndex = 0;
                const updateSlider = () => slider.style.transform = `translateX(-${currentIndex * 100}%)`;
                prevBtn.addEventListener('click', () => { currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1; updateSlider(); });
                nextBtn.addEventListener('click', () => { currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0; updateSlider(); });
                updateSlider();
            }

            const roomTabs = card.querySelectorAll('.room-tab');
            const roomPanes = card.querySelectorAll('.room-pane');
            if (roomTabs.length > 0) {
                roomTabs.forEach(tab => {
                    tab.addEventListener('click', () => {
                        const targetPaneId = tab.dataset.room;
                        const targetPane = card.querySelector(`#${targetPaneId}`);
                        roomTabs.forEach(t => t.classList.remove('active'));
                        tab.classList.add('active');
                        roomPanes.forEach(pane => pane.classList.remove('active'));
                        if (targetPane) targetPane.classList.add('active');
                    });
                });
            }
        });
    };

    /**
     * Sets up the pop-up modal for amenities.
     */
    const setupAmenitiesModal = () => {
        const modal = document.getElementById('amenities-modal');
        if (!modal) return;
        const openModalBtns = document.querySelectorAll('.amenity-more-btn');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const openModal = () => modal.classList.add('show');
        const closeModal = () => modal.classList.remove('show');
        openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
        closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
        document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal.classList.contains('show')) closeModal(); });
    };
    
    /**
     * Fetches blog posts from a placeholder API and displays them.
     */
    const fetchAndDisplayBlogPosts = async () => {
        const grid = document.getElementById('blog-posts-grid');
        const loader = document.getElementById('blog-loader');
        const errorMessage = document.getElementById('blog-error-message');
        if (!grid || !loader || !errorMessage) return;

        const postsUrl = 'https://jsonplaceholder.typicode.com/posts';
        const usersUrl = 'https://jsonplaceholder.typicode.com/users';

        try {
            const [postsResponse, usersResponse] = await Promise.all([fetch(postsUrl), fetch(usersUrl)]);
            if (!postsResponse.ok || !usersResponse.ok) throw new Error('Network response was not ok.');
            const posts = await postsResponse.json();
            const users = await usersResponse.json();
            const usersMap = new Map(users.map(user => [user.id, user.name]));
            const categories = [
                { name: 'Student Guides', color: 'teal' }, { name: 'Accommodation', color: 'indigo' },
                { name: 'Exam Prep', color: 'amber' }, { name: 'City Life', color: 'sky' }
            ];
            grid.innerHTML = posts.slice(0, 6).map((post, index) => {
                const authorName = usersMap.get(post.userId) || 'Anonymous';
                const category = categories[index % categories.length];
                const readTime = Math.floor(post.body.length / 1500) + 3;
                const postDate = new Date();
                postDate.setDate(postDate.getDate() - (index * 3));
                return `<article class="blog-card"><div class="flex-shrink-0"><img class="h-48 w-full object-cover" src="https://placehold.co/600x400/${category.color}-100/${category.color}-800?text=${category.name.replace(' ', '+')}" alt=""></div><div class="flex flex-1 flex-col justify-between bg-white p-6"><div class="flex-1"><p class="text-sm font-medium text-${category.color}-600"><a href="#" class="hover:underline">${category.name}</a></p><a href="#" class="mt-2 block"><p class="text-xl font-semibold text-slate-900 capitalize">${post.title.substring(0, 50)}</p><p class="mt-3 text-base text-slate-500">${post.body.substring(0, 120)}...</p></a></div><div class="mt-6 flex items-center"><div class="flex-shrink-0"><a href="#"><img class="h-10 w-10 rounded-full bg-gray-200" src="https://placehold.co/40x40/cbd5e1/475569?text=${authorName.charAt(0)}" alt=""></a></div><div class="ml-3"><p class="text-sm font-medium text-slate-900"><a href="#" class="hover:underline">${authorName}</a></p><div class="flex space-x-1 text-sm text-slate-500"><time datetime="${postDate.toISOString().split('T')[0]}">${postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time><span>&middot;</span><span>${readTime} min read</span></div></div></div></div></article>`;
            }).join('');
            loader.classList.add('hidden');
            grid.classList.remove('hidden');
        } catch (error) {
            console.error('Failed to fetch blog posts:', error);
            loader.classList.add('hidden');
            errorMessage.classList.remove('hidden');
        }
    };

    /**
     * Handles the accordion functionality for the FAQ section.
     */
    const setupFaqAccordion = () => {
        const accordionContainer = document.getElementById('faq-accordion-container');
        if (!accordionContainer) return;
        const faqItems = accordionContainer.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const button = item.querySelector('.faq-question-button');
            if (!button) return;
            button.addEventListener('click', () => {
                const answer = item.querySelector('.faq-answer');
                const chevron = item.querySelector('.faq-chevron');
                const isOpening = answer.classList.contains('hidden');
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        otherAnswer.classList.add('hidden');
                        otherAnswer.style.maxHeight = null;
                        otherItem.querySelector('.faq-chevron').classList.remove('faq-chevron-rotated');
                    }
                });
                if (isOpening) {
                    answer.classList.remove('hidden');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    chevron.classList.add('faq-chevron-rotated');
                } else {
                    answer.style.maxHeight = null;
                    answer.addEventListener('transitionend', () => answer.classList.add('hidden'), { once: true });
                    chevron.classList.remove('faq-chevron-rotated');
                }
            });
        });
    };

    // --- INITIALIZE ALL COMPONENTS ON PAGE LOAD ---
    setupMobileMenu();
    setupMobileAccordion();
    setupDesktopDropdowns();
    setupNavbarSearch();
    setupSlider();
    setupHorizontalScrollers();
    setupHostelCards();
    setupAmenitiesModal();
    fetchAndDisplayBlogPosts();
    setupFaqAccordion();
});
