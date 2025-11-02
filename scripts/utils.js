export function normalizeText(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/*Funcion para details*/
// utils.js

export function setupDetailsToggle(selector = 'details') {
  const allDetails = document.querySelectorAll(selector);

  allDetails.forEach(detail => {
    detail.addEventListener('toggle', function () {
      if (this.open) {
        allDetails.forEach(otherDetail => {
          if (otherDetail !== this && otherDetail.open) {
            otherDetail.open = false;
          }
        });
      }
    });
  });
}
