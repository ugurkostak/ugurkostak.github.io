/**
 * Central initialization script for site functionality
 * Manages DOM-ready events and page initialization in one place
 */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize page-specific components.
  // Only call masonryBuild() when a masonry grid is actually present;
  // the legacy template helper throws on null elements otherwise.
  if (
    typeof masonryBuild === 'function' &&
    document.querySelector('.grid, .masonry, [data-masonry]')
  ) {
    masonryBuild();
  }

  // Note: navbarToggleSidebar() from the legacy template is intentionally
  // NOT called here. The mobile sidebar toggle is fully handled by
  // assets/js/sidebar.js; calling the legacy version binds a second click
  // handler on `.navbar-toggle` that races with ours and breaks the toggle
  // on pages that include this script (e.g. home, about).

  if (typeof navActivePage === 'function') {
    navActivePage();
  }
});
