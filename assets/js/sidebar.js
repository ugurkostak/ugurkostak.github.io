(function () {
  // Navigation items configuration
  var navItems = [
    { href: 'index.html', title: 'Home', label: 'Home' },
    { href: 'about.html', title: 'About', label: 'About' },
    { href: 'cinema.html', title: 'Cinema', label: 'Cinema' },
    { href: 'photography.html', title: 'Photography', label: 'Photography' },
    { href: 'tech-blog.html', title: 'Tech Blog', label: 'Tech Blog' },
    { href: 'algorithmic-art.html', title: 'Algorithmic Art', label: 'Algorithmic Art' }
  ];

  // Site branding and metadata
  var siteConfig = {
    brandText: 'About Photography and Cinema',
    tagline: 'Here I will be writing mostly about my photographs and cinema I have seen.',
    logoSrc: './assets/images/movies/mashup-logo.svg',
    copyright: '© Ugur Kostak | Website created with <a href="http://www.mashup-template.com/" title="Create website with free html template">Mashup Template</a>/<a href="https://www.unsplash.com/" title="Beautiful Free Images">Unsplash</a>',
    social: [
      { icon: 'fa-instagram', href: 'https://www.instagram.com/pian_pianino', title: 'Instagram' },
      { icon: 'fa-dribbble', href: 'https://dribbble.com/', title: 'Dribbble' },
      { icon: 'fa-twitter', href: 'https://twitter.com/salyangozhizi', title: 'Twitter' }
    ]
  };

  var THEME_STORAGE_KEY = 'site-theme';

  function isValidTheme(theme) {
    return theme === 'light' || theme === 'dark';
  }

  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  function getStoredTheme() {
    try {
      var storedTheme = window.localStorage && window.localStorage.getItem(THEME_STORAGE_KEY);
      return isValidTheme(storedTheme) ? storedTheme : null;
    } catch (err) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      if (window.localStorage) {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
      }
    } catch (err) {
      return;
    }
  }

  function getInitialTheme() {
    return getStoredTheme() || getSystemTheme();
  }

  function getActiveTheme() {
    var activeTheme = document.documentElement.getAttribute('data-theme');
    return isValidTheme(activeTheme) ? activeTheme : getInitialTheme();
  }

  function getThemeLabel(theme) {
    return theme === 'dark' ? 'Dark theme' : 'Light theme';
  }

  function getNextTheme(theme) {
    return theme === 'dark' ? 'light' : 'dark';
  }

  function updateThemeToggle(theme) {
    var toggles = Array.prototype.slice.call(document.querySelectorAll('[data-theme-toggle]'));
    var nextTheme = getNextTheme(theme);

    toggles.forEach(function (toggle) {
      var label = toggle.querySelector('[data-theme-toggle-label]');
      var icon = toggle.querySelector('[data-theme-toggle-icon]');
      var actionLabel = 'Switch to ' + getThemeLabel(nextTheme).toLowerCase();

      toggle.setAttribute('aria-label', getThemeLabel(theme) + ' active. ' + actionLabel + '.');
      toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      toggle.title = actionLabel;

      if (label) {
        label.textContent = getThemeLabel(theme);
      }

      if (icon) {
        icon.className = 'fa ' + (theme === 'dark' ? 'fa-moon-o' : 'fa-sun-o');
      }
    });
  }

  function applyTheme(theme) {
    var normalizedTheme = isValidTheme(theme) ? theme : getSystemTheme();
    document.documentElement.setAttribute('data-theme', normalizedTheme);
    updateThemeToggle(normalizedTheme);
  }

  function toggleTheme() {
    var nextTheme = getNextTheme(getActiveTheme());
    applyTheme(nextTheme);
    setStoredTheme(nextTheme);
  }

  function createThemeToggle() {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    button.setAttribute('data-theme-toggle', '');
    button.addEventListener('click', toggleTheme, false);

    var iconWrap = document.createElement('span');
    iconWrap.className = 'theme-toggle-icon';
    iconWrap.setAttribute('aria-hidden', 'true');

    var icon = document.createElement('i');
    icon.setAttribute('data-theme-toggle-icon', '');
    iconWrap.appendChild(icon);

    var label = document.createElement('span');
    label.setAttribute('data-theme-toggle-label', '');

    button.appendChild(iconWrap);
    button.appendChild(label);

    return button;
  }

  function setupSystemThemeListener() {
    if (!window.matchMedia) return;

    var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    var listener = function () {
      if (!getStoredTheme()) {
        applyTheme(getSystemTheme());
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(listener);
    }
  }

  applyTheme(getInitialTheme());
  setupSystemThemeListener();

  /**
   * Calculates the relative path prefix for the current page
   * @returns {string} prefix - either './' for root pages or '../' repeated for nested pages
   */
  function getPrefix() {
    var segments = window.location.pathname.split('/');
    var depth = segments.length - 2;
    return depth > 0 ? '../'.repeat(depth) : './';
  }

  /**
   * Gets the current page filename
   * @returns {string} filename of current page
   */
  function getCurrentPage() {
    var current = window.location.pathname.split('/').pop();
    return current === '' ? 'index.html' : current;
  }

  /**
   * Determines if a nav item should be marked as active
   * @param {Object} item - nav item configuration
   * @param {string} currentPage - current page filename
   * @returns {boolean} whether item should be marked active
   */
  function isActiveItem(item, currentPage) {
    if (item.href === currentPage) {
      return true;
    }

    if (item.href === 'cinema.html' && window.location.pathname.indexOf('/cinema/') !== -1) {
      return true;
    }

    if (item.href === 'tech-blog.html' && window.location.pathname.indexOf('/tech-blog/') !== -1) {
      return true;
    }

    if (item.href === 'math-blog.html' && window.location.pathname.indexOf('/math-blog/') !== -1) {
      return true;
    }

    return false;
  }

  /**
   * Renders the sidebar navigation with branding, nav items, and social links
   */
  function renderSidebar() {
    var navCollapseRoot = document.getElementById('navbar-collapse');
    if (!navCollapseRoot) return;

    var prefix = getPrefix();
    var currentPage = getCurrentPage();

    // Clear existing content
    navCollapseRoot.innerHTML = '';

    // Create and append site header
    var siteHeaderDiv = document.createElement('div');
    siteHeaderDiv.className = 'site-header hidden-xs';
    
    var brandLink = document.createElement('a');
    brandLink.className = 'site-brand';
    brandLink.href = prefix + 'index.html';
    brandLink.title = '';
    
    var logoImg = document.createElement('img');
    logoImg.className = 'img-responsive site-logo';
    logoImg.alt = 'Site Logo';
    logoImg.src = prefix + siteConfig.logoSrc;
    
    brandLink.appendChild(logoImg);
    var brandText = document.createElement('span');
    brandText.textContent = siteConfig.brandText;
    brandLink.appendChild(brandText);
    
    siteHeaderDiv.appendChild(brandLink);
    
    var taglinePara = document.createElement('p');
    taglinePara.textContent = siteConfig.tagline;
    siteHeaderDiv.appendChild(taglinePara);
    
    navCollapseRoot.appendChild(siteHeaderDiv);

    // Create and append nav list
    var navList = document.createElement('ul');
    navList.className = 'nav';
    navList.id = 'sidebar-nav';

    navItems.forEach(function (item) {
      var link = document.createElement('a');
      link.href = prefix + item.href;
      link.title = item.title;
      link.textContent = item.label;
      if (isActiveItem(item, currentPage)) {
        link.className = 'active';
      }

      var listItem = document.createElement('li');
      listItem.appendChild(link);
      navList.appendChild(listItem);
    });

    navCollapseRoot.appendChild(navList);

    var themeToggleWrapper = document.createElement('div');
    themeToggleWrapper.className = 'theme-toggle-wrapper';
    themeToggleWrapper.appendChild(createThemeToggle());
    navCollapseRoot.appendChild(themeToggleWrapper);

    // Create and append nav footer
    var navFooter = document.createElement('nav');
    navFooter.className = 'nav-footer';

    var socialPara = document.createElement('p');
    socialPara.className = 'nav-footer-social-buttons';

    siteConfig.social.forEach(function (social) {
      var iconLink = document.createElement('a');
      iconLink.className = 'fa-icon';
      iconLink.href = social.href;
      iconLink.title = social.title;
      
      var icon = document.createElement('i');
      icon.className = 'fa ' + social.icon;
      
      iconLink.appendChild(icon);
      socialPara.appendChild(iconLink);
    });

    navFooter.appendChild(socialPara);

    var copyrightPara = document.createElement('p');
    copyrightPara.innerHTML = siteConfig.copyright;
    navFooter.appendChild(copyrightPara);

    navCollapseRoot.appendChild(navFooter);
    updateThemeToggle(getActiveTheme());
  }

  // Initialize sidebar on DOM ready or immediately if already loaded
  function initSidebar() {
    renderSidebar();

    // Mobile toggle: attach a single handler to all navbar-toggle buttons.
    // Safari/iOS fires pointerdown -> touchstart -> click for one tap; binding
    // multiple events on the same button would flip the menu state several
    // times per tap. We bind only `click` (no 300ms delay thanks to the
    // viewport meta) and dedupe with a short cooldown to absorb any stray
    // synthetic events some browsers still dispatch.
    var btns = Array.prototype.slice.call(document.querySelectorAll('.navbar-toggle'));
    var navCollapse = document.getElementById('navbar-collapse');
    var lastToggleAt = 0;
    if (btns && btns.length && navCollapse) {
      function openNav() {
        navCollapse.classList.add('open');
        navCollapse.style.display = 'block';
        btns.forEach(function (b) { b.classList.remove('collapsed'); b.setAttribute('aria-expanded', 'true'); });
      }
      function closeNav() {
        navCollapse.classList.remove('open');
        navCollapse.style.display = '';
        btns.forEach(function (b) { b.classList.add('collapsed'); b.setAttribute('aria-expanded', 'false'); });
      }

      function toggleHandler(e) {
        if (e) {
          try { e.preventDefault(); } catch (err) {}
          e.stopPropagation();
        }
        var now = Date.now();
        if (now - lastToggleAt < 300) return;
        lastToggleAt = now;
        if (navCollapse.classList.contains('open')) {
          closeNav();
        } else {
          openNav();
        }
      }

      btns.forEach(function (btn) {
        // `click` works reliably on iOS Safari, Android Chrome, and desktop
        // browsers. Binding only one event prevents multi-fire toggling.
        btn.addEventListener('click', toggleHandler, false);
        // Improve responsiveness/visual feedback on touch without re-triggering
        // the toggle: keep the button from receiving the iOS tap highlight
        // delay by acknowledging the touch but not toggling here.
        btn.style.webkitTapHighlightColor = 'transparent';
        btn.setAttribute('aria-expanded', navCollapse.classList.contains('open') ? 'true' : 'false');
      });

      // Close when interacting outside the nav on small screens.
      function outsideHandler(e) {
        if (Date.now() - lastToggleAt < 350) return;
        if (!navCollapse.classList.contains('open')) return;
        var target = e.target;
        var clickedInside = navCollapse.contains(target) || btns.some(function (b) { return b.contains(target); });
        if (!clickedInside && window.getComputedStyle(btns[0]).display !== 'none') {
          closeNav();
        }
      }
      document.addEventListener('click', outsideHandler, false);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebar);
  } else {
    initSidebar();
  }
})();
