/**
 * Unified blog system - Supports both vertical feed and grid layouts
 * - For tech-blog: Renders vertical feed with images on left, descriptions on right
 * - For cinema/photography: Applies hover overlays to existing grid items
 * - Animated scroll progress indicator on the left with date of current article
 * - Right-side timeline separator showing month/year
 */

(function () {
  // Lorem Ipsum text pool for descriptions (used in vertical feed layout)
  const loremTextPool = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam."
  ];

  let articlesData = [];

  /**
   * Detect current page from URL
   */
  function detectPage() {
    const path = window.location.pathname;
    if (path.includes('tech-blog')) return 'tech-blog';
    if (path.includes('cinema')) return 'cinema';
    if (path.includes('photo')) return 'photography';
    return null;
  }

  /**
   * Get metadata path based on current page
   */
  function getMetadataPath() {
    const page = detectPage();
    const pathMap = {
      'tech-blog': './tech-blog/metadata.json',
      'cinema': './cinema/metadata.json',
      'photography': './photography/metadata.json'
    };
    return pathMap[page] || './tech-blog/metadata.json';
  }

  /**
   * Format date as "Month Year"
   */
  function formatDateShort(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options).toUpperCase();
  }

  /**
   * Format date as "Month" and "Year" separately
   */
  function formatDateParts(dateString) {
    const date = new Date(dateString);
    const monthOptions = { month: 'long' };
    const yearOptions = { year: 'numeric' };
    
    const month = date.toLocaleDateString('en-US', monthOptions);
    const year = date.toLocaleDateString('en-US', yearOptions);
    
    return { month, year };
  }

  /**
   * Format date as "Month Day, Year"
   */
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Get Lorem Ipsum text for index
   */
  function getLoremText(index) {
    return loremTextPool[index % loremTextPool.length];
  }

  /**
   * Update scrollbar date and right timeline based on currently visible article
   */
  function updateScrollbarDate() {
    const items = document.querySelectorAll('.blog-feed-item');
    const dateElement = document.getElementById('blogScrollbarDate');
    const monthElement = document.getElementById('blogTimelineMonth');
    const yearElement = document.getElementById('blogTimelineYear');
    
    if (items.length === 0) return;

    let closestItem = null;
    let closestDistance = Infinity;

    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const distance = Math.abs(rect.top - window.innerHeight / 2);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestItem = index;
      }
    });

    if (closestItem !== null && articlesData[closestItem]) {
      const dateShort = formatDateShort(articlesData[closestItem].date);
      const dateParts = formatDateParts(articlesData[closestItem].date);
      
      if (dateElement) {
        dateElement.textContent = dateShort;
      }
      
      if (monthElement) {
        monthElement.textContent = dateParts.month;
      }
      
      if (yearElement) {
        yearElement.textContent = dateParts.year;
      }
    }
  }

  /**
   * Update scroll progress bar
   */
  function updateScrollProgress() {
    const scrollbar = document.querySelector('.blog-scrollbar-progress');
    if (!scrollbar) return;

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Calculate scroll percentage
    const totalScroll = documentHeight - windowHeight;
    const scrollPercent = (scrollTop / totalScroll) * 100;

    // Update scrollbar height
    scrollbar.style.height = Math.max(0, Math.min(100, scrollPercent)) + '%';

    // Update date based on visible article
    updateScrollbarDate();
  }

  /**
   * Load and render articles for vertical feed (tech-blog layout)
   */
  async function loadAndRenderVerticalFeed() {
    try {
      const metadataPath = getMetadataPath();
      const page = detectPage();
      console.log('Blog.js: Detected page:', page);
      console.log('Blog.js: Loading metadata from:', metadataPath);
      
      const response = await fetch(metadataPath);
      if (!response.ok) {
        console.error('Blog.js: Failed to fetch metadata. Status:', response.status);
        return;
      }
      
      const data = await response.json();
      const articles = data.articles || [];
      console.log('Blog.js: Loaded', articles.length, 'articles');

      articlesData = articles;

      const container = document.getElementById('blogFeedContainer');
      if (!container) {
        console.error('Blog.js: blogFeedContainer not found in DOM');
        return;
      }
      
      container.innerHTML = '';

      articles.forEach((article, index) => {
        const item = document.createElement('article');
        item.className = 'blog-feed-item';

        const loremText = getLoremText(index);

        item.innerHTML = `
          <div class="blog-feed-item-image">
            <img src="${article.image}" alt="${article.title}">
            <a href="./${page}/${article.slug}.html" class="blog-feed-item-overlay">
              <div class="project-text-holder">
                <div class="project-text-inner">
                  <h3>${article.title}</h3>
                  <div class="blog-feed-item-overlay-date-text">${formatDate(article.date)}</div>
                  <p>Discover more</p>
                </div>
              </div>
            </a>
          </div>
          <div class="blog-feed-item-content">
            <h2 class="blog-feed-item-title">${article.title}</h2>
            <p class="blog-feed-item-summary">${loremText}</p>
          </div>
        `;

        container.appendChild(item);
      });
      
      console.log('Blog.js: Rendered', articles.length, 'articles to container');

      // Setup scroll listener after articles are loaded
      setupScrollListener();
    } catch (error) {
      console.error('Blog.js: Error loading articles:', error);
    }
  }

  /**
   * Apply hover overlays to grid layout (cinema/photography)
   * The grid items already exist in HTML, we just enhance them with hover styles
   */
  function enhanceGridItems() {
    // Grid items are already in HTML with .project-description class
    // blog.css handles the hover overlay styling
    // No additional JS needed for grid layout
  }

  /**
   * Setup scroll event listener
   */
  function setupScrollListener() {
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    // Initial update
    updateScrollProgress();
  }

  /**
   * Initialize blog system based on page type
   */
  function init() {
    const page = detectPage();
    console.log('Blog.js: Initializing for page:', page);
    
    if (page === 'tech-blog' || page === 'cinema' || page === 'photography') {
      // All collection pages use vertical feed layout
      loadAndRenderVerticalFeed();
    } else {
      // Fallback: try to load vertical feed if container exists
      if (document.getElementById('blogFeedContainer')) {
        console.log('Blog.js: Found blogFeedContainer, loading vertical feed');
        loadAndRenderVerticalFeed();
      } else {
        console.warn('Blog.js: Could not determine page type and blogFeedContainer not found');
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Also initialize navbar functions after load
  window.addEventListener('load', () => {
    if (typeof navbarToggleSidebar === 'function') {
      navbarToggleSidebar();
    }
    if (typeof navActivePage === 'function') {
      navActivePage();
    }
  });
})();
