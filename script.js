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


/**
 * Sets up horizontal scrolling with arrow buttons and mobile auto-scroll.
 */
const setupHorizontalScrollers = () => {
    const scrollers = document.querySelectorAll('.horizontal-scroll-container');
    if (scrollers.length === 0) return;

    // Use an object to store the interval timers for each scroller
    const autoScrollIntervals = {};

    scrollers.forEach(scroller => {
        const containerId = scroller.id;
        const leftArrow = document.querySelector(`.scroll-arrow.left-arrow[data-container="${containerId}"]`);
        const rightArrow = document.querySelector(`.scroll-arrow.right-arrow[data-container="${containerId}"]`);
        const cards = scroller.querySelectorAll('.hostel-card, .entity-card');
        let currentIndex = 0;

        // --- Manual scrolling with arrows (for desktop) ---
        if (leftArrow && rightArrow) {
            leftArrow.addEventListener('click', () => {
                const scrollAmount = scroller.clientWidth * -0.8;
                scroller.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });

            rightArrow.addEventListener('click', () => {
                const scrollAmount = scroller.clientWidth * 0.8;
                scroller.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }
        
        // --- Automatic scrolling function for mobile ---
        const startAutoScroll = () => {
             // Use matchMedia to check if the view is mobile (arrows are not displayed)
            const isMobile = window.matchMedia('(max-width: 1023px)').matches;
            if (!isMobile || cards.length <= 1) return; // Exit if not mobile or not enough cards

            // Clear any previously running interval for this scroller
            clearInterval(autoScrollIntervals[containerId]); 
            
            autoScrollIntervals[containerId] = setInterval(() => {
                // Move to the next card index
                currentIndex = (currentIndex + 1) % cards.length;
                
                const nextCard = cards[currentIndex];
                
                // If we've looped back to the first card, scroll instantly to the start
                if (currentIndex === 0) {
                    scroller.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    // Otherwise, scroll to the next card's position
                    scroller.scrollTo({
                        left: nextCard.offsetLeft - 24, // Adjust for the gap
                        behavior: 'smooth'
                    });
                }
            }, 3500); // Change slide every 3.5 seconds
        };
        
        const stopAutoScroll = () => {
            clearInterval(autoScrollIntervals[containerId]);
        };

        // --- Event Listeners to manage auto-scroll ---
        // Start the automatic scrolling when the page loads
        startAutoScroll();

        // Pause the scrolling when the user touches or hovers over the container
        scroller.addEventListener('touchstart', stopAutoScroll, { passive: true });
        scroller.addEventListener('mouseenter', stopAutoScroll);

        // Resume scrolling after a delay when the user stops interacting
        scroller.addEventListener('touchend', () => setTimeout(startAutoScroll, 5000)); // 5-second delay after touch
        scroller.addEventListener('mouseleave', startAutoScroll);

        // Re-evaluate whether to auto-scroll when the window is resized
        window.addEventListener('resize', () => {
            stopAutoScroll();
            startAutoScroll();
        });
    });
};

// Make sure this function call is inside your DOMContentLoaded listener
setupHorizontalScrollers();

/**
 * Fetches blog posts and user data from a placeholder API and displays them.
 */
const fetchAndDisplayBlogPosts = async () => {
    const grid = document.getElementById('blog-posts-grid');
    const loader = document.getElementById('blog-loader');
    const errorMessage = document.getElementById('blog-error-message');
    
    // API endpoints for placeholder data
    const postsUrl = 'https://jsonplaceholder.typicode.com/posts';
    const usersUrl = 'https://jsonplaceholder.typicode.com/users';

    try {
        // Fetch posts and users data in parallel
        const [postsResponse, usersResponse] = await Promise.all([
            fetch(postsUrl),
            fetch(usersUrl)
        ]);

        if (!postsResponse.ok || !usersResponse.ok) {
            throw new Error('Network response was not ok.');
        }

        const posts = await postsResponse.json();
        const users = await usersResponse.json();

        // Create a map of users by their ID for easy lookup
        const usersMap = new Map(users.map(user => [user.id, user.name]));
        
        // Mock categories and colors
        const categories = [
            { name: 'Student Guides', color: 'teal' },
            { name: 'Accommodation', color: 'indigo' },
            { name: 'Exam Prep', color: 'amber' },
            { name: 'City Life', color: 'sky' }
        ];

        // We'll only show the first 6 posts for this demo
        const postsToDisplay = posts.slice(0, 6);

        postsToDisplay.forEach((post, index) => {
            const authorName = usersMap.get(post.userId) || 'Anonymous';
            const category = categories[index % categories.length];
            const readTime = Math.floor(post.body.length / 1500) + 3; // Estimate read time
            const postDate = new Date();
            postDate.setDate(postDate.getDate() - (index * 3)); // Simulate different post dates

            const postCardHTML = `
                <article class="blog-card">
                    <div class="flex-shrink-0">
                        <img class="h-48 w-full object-cover" src="https://placehold.co/600x400/${category.color}-100/${category.color}-800?text=${category.name.replace(' ', '+')}" alt="Blog post image">
                    </div>
                    <div class="flex flex-1 flex-col justify-between bg-white p-6">
                        <div class="flex-1">
                            <p class="text-sm font-medium text-${category.color}-600">
                                <a href="#" class="hover:underline">${category.name}</a>
                            </p>
                            <a href="#" class="mt-2 block">
                                <p class="text-xl font-semibold text-slate-900 capitalize">${post.title.substring(0, 50)}</p>
                                <p class="mt-3 text-base text-slate-500">${post.body.substring(0, 120)}...</p>
                            </a>
                        </div>
                        <div class="mt-6 flex items-center">
                            <div class="flex-shrink-0">
                                <a href="#">
                                    <span class="sr-only">${authorName}</span>
                                    <img class="h-10 w-10 rounded-full bg-gray-200" src="https://placehold.co/40x40/cbd5e1/475569?text=${authorName.charAt(0)}" alt="Author avatar">
                                </a>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm font-medium text-slate-900">
                                    <a href="#" class="hover:underline">${authorName}</a>
                                </p>
                                <div class="flex space-x-1 text-sm text-slate-500">
                                    <time datetime="${postDate.toISOString().split('T')[0]}">${postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                                    <span aria-hidden="true">&middot;</span>
                                    <span>${readTime} min read</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            `;
            grid.innerHTML += postCardHTML;
        });

        // Hide loader and show grid
        loader.classList.add('hidden');
        grid.classList.remove('hidden');

    } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        // Hide loader and show error message
        loader.classList.add('hidden');
        errorMessage.classList.remove('hidden');
    }
};

// Call the function to fetch and display the blog posts
fetchAndDisplayBlogPosts();

/**
 * Handles the accordion functionality for the FAQ section.
 */
const setupFaqAccordion = () => {
    const accordionContainer = document.getElementById('faq-accordion-container');
    if (!accordionContainer) return;

    const faqItems = accordionContainer.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const button = item.querySelector('.faq-question-button');
        const answer = item.querySelector('.faq-answer');
        const chevron = item.querySelector('.faq-chevron');

        button.addEventListener('click', () => {
            const isOpening = answer.classList.contains('hidden');

            // Close all other open items first
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.faq-answer').classList.add('hidden');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                    otherItem.querySelector('.faq-chevron').classList.remove('faq-chevron-rotated');
                }
            });

            // Toggle the clicked item
            if (isOpening) {
                answer.classList.remove('hidden');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                chevron.classList.add('faq-chevron-rotated');
            } else {
                answer.style.maxHeight = null;
                // Add a listener to hide it after the transition completes
                answer.addEventListener('transitionend', () => {
                    answer.classList.add('hidden');
                }, { once: true });
                chevron.classList.remove('faq-chevron-rotated');
            }
        });
    });
};

// Call the new function to initialize the FAQ section
setupFaqAccordion();


    // Initialize all components
    setupMobileMenu();
    setupMobileAccordion();
    setupDesktopDropdowns();
    setupNavbarSearch();
    setupSlider();
     setupCategoryScroller(); 
     
});

