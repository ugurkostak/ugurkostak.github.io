(function () {
  // Navigation items configuration
  var navItems = [
    { href: 'index.html', title: 'Home', label: 'Home' },
    { href: 'about.html', title: 'About', label: 'About' },
    { href: 'cinema.html', title: 'Cinema', label: 'Cinema' },
    { href: 'photography.html', title: 'Photography', label: 'Photography' },
    { href: 'tech-writings.html', title: 'Tech Writings', label: 'Tech Writings' },
    { href: 'consulting-teaching.html', title: 'Consulting & Teaching', label: 'Consulting & Teaching' },
    { href: 'contact.html', title: 'Contact', label: 'Contact' }
  ];

  // Site branding and metadata
  var siteConfig = {
    brandText: 'About Photography and Cinema',
    tagline: 'Here I will be writing mostly about my photographs and cinema I have seen.',
    logoSrc: './assets/movies/mashup-logo.svg',
    copyright: '© Ugur Kostak | Website created with <a href="http://www.mashup-template.com/" title="Create website with free html template">Mashup Template</a>/<a href="https://www.unsplash.com/" title="Beautiful Free Images">Unsplash</a>',
    social: [
      { icon: 'fa-instagram', href: 'https://www.instagram.com/pian_pianino', title: 'Instagram' },
      { icon: 'fa-dribbble', href: 'https://dribbble.com/', title: 'Dribbble' },
      { icon: 'fa-twitter', href: 'https://twitter.com/salyangozhizi', title: 'Twitter' }
    ]
  };

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

    if (item.href === 'tech-writings.html' && window.location.pathname.indexOf('/tech-writings/') !== -1) {
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
  }

  // Initialize sidebar on DOM ready or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSidebar);
  } else {
    renderSidebar();
  }
})();
