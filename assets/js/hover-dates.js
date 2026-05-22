document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.timeline-item').forEach(function (item) {
    var month = item.getAttribute('data-month');
    var year = item.getAttribute('data-year');
    var published = item.getAttribute('data-published') || (month && year ? month + ' ' + year : '');
    if (!published) return;

    var overlay = item.querySelector('.project-text-inner');
    if (overlay && !overlay.querySelector('.project-date')) {
      var d = document.createElement('div');
      d.className = 'project-date';
      d.textContent = 'Published: ' + published;
      overlay.appendChild(d);
    }
  });
});
