/**
 * Central initialization script for site functionality
 * Manages DOM-ready events and page initialization in one place
 */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize page-specific components
  if (typeof masonryBuild === 'function') {
    masonryBuild();
  }

  // Initialize navigation
  if (typeof navbarToggleSidebar === 'function') {
    navbarToggleSidebar();
  }

  if (typeof navActivePage === 'function') {
    navActivePage();
  }
});
