import { normalizeText } from './utils.js';
import { debounce } from './utils.js';


export function filterLinks(searchTerm, contenedoresDeLinks) {
  contenedoresDeLinks.forEach((contenedor) => {
    const links = contenedor.querySelectorAll('a');
    let anyVisible = false;

    links.forEach((link) => {
      const title = normalizeText(link.textContent);
      const match = title.includes(searchTerm);

      link.classList.toggle('hidden', !match);

      if (match) anyVisible = true;
    });

    contenedor.classList.toggle('hidden', !anyVisible);
  });
}

export function setupSearch(inputSelector, contenedoresSelector) {
  const searchInput = document.querySelector(inputSelector);
  const contenedoresDeLinks = document.querySelectorAll(contenedoresSelector);

  searchInput.addEventListener('input', debounce((e) => {
    const searchTerm = normalizeText(e.target.value.trim());
    filterLinks(searchTerm, contenedoresDeLinks);
  }, 300));
}
