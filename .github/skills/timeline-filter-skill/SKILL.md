---
name: timeline-filter-skill
description: "Use when: adding year-based filtering and timeline navigation to collection pages such as cinema, photography, tech-blog, algorithmic-art, or a future requested soft-skills collection."
---

# Interactive Timeline Filter Component Skill

## Overview
The Interactive Timeline Filter is a reusable JavaScript component that adds year-based filtering and smooth navigation to timeline-based content. Users can click on year buttons to quickly jump to and view items from a specific year.

## Component Files
- **timeline-filter.js** (`/assets/js/timeline-filter.js`) - Main filtering logic
- **separator.css** (`/assets/css/separator.css`) - Enhanced styling for interactive elements

## Features
✓ Automatic year extraction from timeline items  
✓ Clickable year filter buttons  
✓ Smooth scroll navigation to filtered content  
✓ Visual feedback (active state for selected year)  
✓ Responsive design (mobile-friendly filter layout)  
✓ Click-to-navigate on current year display  
✓ Fully reusable across multiple pages  

## Implementation Requirements

### HTML Structure
Each page using the timeline filter must have:

```html
<div class="timeline-section">
  <div class="timeline-separator">
    <div class="timeline-date">
      <span class="timeline-month">Month</span>
      <span class="timeline-year">Year</span>
    </div>
  </div>
  
  <div class="hero-full-wrapper">
    <div class="grid">
      <div class="gutter-sizer"></div>
      <div class="grid-sizer"></div>
      
      <!-- Timeline items with required data attributes -->
      <div class="grid-item timeline-item" data-year="2026" data-month="May" data-published="May 15, 2026">
        <!-- Content -->
      </div>
    </div>
  </div>
</div>
```

### Required Data Attributes
Each `.timeline-item` must include:
- `data-year` - Year value (e.g., "2026")
- `data-month` - Month name (e.g., "May", "April")
- `data-published` - Optional: Full published date for hover display

### CSS Files Required
```html
<link href="./assets/css/separator.css" rel="stylesheet">
```

### JavaScript Files Required (in order)
```html
<script type="text/javascript" src="./assets/js/main.85741bff.js"></script>
<script type="text/javascript" src="./assets/js/sidebar.js"></script>
<script type="text/javascript" src="./assets/js/separator.js"></script>
<script type="text/javascript" src="./assets/js/hover-dates.js"></script>
<script type="text/javascript" src="./assets/js/timeline-filter.js"></script>
```

## How It Works

### Initialization
1. When the page loads, `timeline-filter.js` scans for `.timeline-section` elements
2. For each section, it extracts all unique years from `data-year` attributes
3. Creates clickable filter buttons for each year (sorted descending)
4. Appends buttons to the `.timeline-separator` in a `.timeline-filters` container

### Filtering
1. User clicks a year button or the current year display
2. All `.timeline-item` elements are filtered based on selected year
3. Non-matching items get `.hidden-by-filter` class (display: none)
4. Page smoothly scrolls to first visible item of selected year
5. Clicked button gets `.active` class for visual feedback

### Responsive Behavior
- **Desktop**: Filter buttons appear to the right of current date display
- **Mobile** (<768px): Filter buttons stack below current date display

## CSS Classes

### Interactive Elements
- `.timeline-filters` - Container for year filter buttons
- `.year-filter` - Individual year button
- `.year-filter.active` - Currently selected year button
- `.timeline-item.hidden-by-filter` - Hidden item (display: none)

### Styling Customization
All interactive elements can be styled via `separator.css`:
- Button colors (default: light gray, active: `#ff6360`)
- Padding, font sizes, border radius
- Hover effects and transitions

## Usage on Other Pages

### To add to cinema.html:
1. Verify `.timeline-section` structure is present
2. Add `data-year` and `data-month` attributes to each `.timeline-item`
3. Include `timeline-filter.js` before closing `</body>` tag
4. Ensure `separator.css` is linked in `<head>`

### To add to photography.html:
1. Same steps as cinema.html
2. Ensure grid items have `.timeline-item` class
3. Add required data attributes

## Code Behavior

### Year Extraction
```javascript
var yearsSet = new Set();
items.forEach(function (item) {
  var year = item.getAttribute('data-year');
  if (year) yearsSet.add(year);
});
var years = Array.from(yearsSet).sort(function (a, b) {
  return b - a; // Descending order (newest first)
});
```

### Filter Logic
```javascript
function filterByYear(section, selectedYear) {
  var items = section.querySelectorAll('.timeline-item');
  items.forEach(function (item) {
    var itemYear = item.getAttribute('data-year');
    if (itemYear === selectedYear) {
      item.classList.remove('hidden-by-filter');
    } else {
      item.classList.add('hidden-by-filter');
    }
  });
  // Smooth scroll to first visible item
  firstVisibleItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
```

## Conditions for Auto-Deactivation
The filter component only initializes if:
- `.timeline-section` elements exist on the page
- Each section contains `.timeline-separator` and `.timeline-date` 
- At least one `.timeline-item[data-year]` element exists
- **More than 1 unique year** is found (no filter needed for single year)

## Browser Compatibility
- Modern browsers with ES5+ support
- Uses `scrollIntoView()` with smooth behavior (fallback: instant scroll)
- Tested on Chrome, Firefox, Safari, Edge

## Accessibility
- Buttons are focusable and keyboard navigable
- Semantic button elements with clear labels
- Color-coded but not color-only (text labels on all buttons)
- Scroll behavior respects `prefers-reduced-motion` (CSS-based)

## Performance Notes
- Lightweight: ~3KB unminified
- Runs once on DOMContentLoaded
- Filter operations are O(n) where n = number of items
- No external dependencies required

## Future Enhancement Ideas
- Persist selected filter in URL hash or localStorage
- Add "Show All" button to reset filter
- Month-level filtering in addition to year
- Animated transitions when showing/hiding items
