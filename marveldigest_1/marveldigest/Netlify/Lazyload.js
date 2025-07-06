document.addEventListener('DOMContentLoaded', function() {
  // Select all images and iframes
  document.querySelectorAll('img, iframe').forEach(el => {
    // If not already annotated and not marked eager, make it lazy
    if (!el.hasAttribute('loading') && !el.classList.contains('eager')) {
      el.setAttribute('loading', 'lazy');
    }
  });
});