document.addEventListener('DOMContentLoaded', function () {
  var timelineSections = document.querySelectorAll('.timeline-section');

  if (!timelineSections.length) {
    return;
  }

  function formatSeparator(section, item) {
    if (!item || !section) {
      return;
    }

    var month = item.getAttribute('data-month') || '';
    var year = item.getAttribute('data-year') || '';
    var monthText = section.querySelector('.timeline-month');
    var yearText = section.querySelector('.timeline-year');

    if (monthText) {
      monthText.textContent = month;
    }
    if (yearText) {
      yearText.textContent = year;
    }
  }

  function updateTimelineSeparator() {
    timelineSections.forEach(function (section) {
      var items = section.querySelectorAll('.timeline-item[data-year][data-month]');
      if (!items.length) {
        return;
      }

      var selected = items[0];
      var threshold = window.innerHeight * 0.2;

      items.forEach(function (item) {
        var rect = item.getBoundingClientRect();
        if (rect.top <= threshold) {
          selected = item;
        }
      });

      formatSeparator(section, selected);
    });
  }

  window.addEventListener('scroll', updateTimelineSeparator);
  window.addEventListener('resize', updateTimelineSeparator);
  updateTimelineSeparator();
});
