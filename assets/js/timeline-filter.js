/**
 * Interactive Timeline Filter Component
 * Adds year-based filtering, clickable navigation, and intro text display to timeline separators
 * Reusable across multiple pages: tech-writings.html, cinema.html, photography.html
 * 
 * Usage: Include this script after separator.js on any page with .timeline-section elements
 * The timeline-separator must contain a .timeline-date div for year display
 * Timeline items must have data-year, data-month, and optionally data-intro attributes
 */

document.addEventListener('DOMContentLoaded', function () {
  var timelineSections = document.querySelectorAll('.timeline-section');

  if (!timelineSections.length) {
    return;
  }

  timelineSections.forEach(function (section) {
    initializeTimelineFilter(section);
    updateIntroText(section); // Initial intro text display
  });

  // Also update intro text on scroll
  window.addEventListener('scroll', function () {
    timelineSections.forEach(updateIntroText);
  });

  function initializeTimelineFilter(section) {
    var separator = section.querySelector('.timeline-separator');
    var timelineDate = section.querySelector('.timeline-date');
    var items = section.querySelectorAll('.timeline-item[data-year]');

    if (!separator || !timelineDate || !items.length) {
      return;
    }

    // Extract unique years and sort them in descending order
    var yearsSet = new Set();
    items.forEach(function (item) {
      var year = item.getAttribute('data-year');
      if (year) {
        yearsSet.add(year);
      }
    });

    var years = Array.from(yearsSet).sort(function (a, b) {
      return b - a;
    });

    if (years.length <= 1) {
      return; // No need for filter with 0 or 1 year
    }

    // Create filter container
    var filterContainer = document.createElement('div');
    filterContainer.className = 'timeline-filters';

    // Create year filter buttons
    years.forEach(function (year) {
      var button = document.createElement('button');
      button.className = 'year-filter active';
      button.textContent = year;
      button.setAttribute('data-year', year);

      button.addEventListener('click', function (e) {
        e.preventDefault();
        filterByYear(section, year);
        updateFilterButtons(filterContainer, year);
        updateIntroText(section); // Update intro after filtering
      });

      filterContainer.appendChild(button);
    });

    // Append filter container to separator
    separator.appendChild(filterContainer);

    // Add click handlers to current date display for quick year navigation
    var yearText = timelineDate.querySelector('.timeline-year');

    if (yearText) {
      yearText.addEventListener('click', function () {
        var currentYear = yearText.textContent.trim();
        updateFilterButtons(filterContainer, currentYear);
        filterByYear(section, currentYear);
        updateIntroText(section); // Update intro after filtering
      });
    }
  }

  function updateIntroText(section) {
    var introContainer = section.querySelector('.timeline-intro');
    if (!introContainer) {
      return;
    }

    var items = section.querySelectorAll('.timeline-item:not(.hidden-by-filter)');
    if (!items.length) {
      return;
    }

    // Find the first visible item in viewport
    var selected = items[0];
    var threshold = window.innerHeight * 0.2;

    items.forEach(function (item) {
      var rect = item.getBoundingClientRect();
      if (rect.top <= threshold) {
        selected = item;
      }
    });

    // Extract intro text from data attribute
    var introText = selected.getAttribute('data-intro') || '';
    var introP = introContainer.querySelector('p');

    if (introP) {
      introP.textContent = introText;
    }
  }

  function filterByYear(section, selectedYear) {
    var items = section.querySelectorAll('.timeline-item');
    var firstVisibleItem = null;

    items.forEach(function (item) {
      var itemYear = item.getAttribute('data-year');
      if (itemYear === selectedYear) {
        item.classList.remove('hidden-by-filter');
        if (!firstVisibleItem) {
          firstVisibleItem = item;
        }
      } else {
        item.classList.add('hidden-by-filter');
      }
    });

    // Scroll to first visible item smoothly
    if (firstVisibleItem) {
      setTimeout(function () {
        firstVisibleItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }

  function updateFilterButtons(filterContainer, activeYear) {
    var buttons = filterContainer.querySelectorAll('.year-filter');
    buttons.forEach(function (button) {
      if (button.getAttribute('data-year') === activeYear) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
});
