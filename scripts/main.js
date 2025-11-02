import { createSections } from './config.js';
import { constituciones, tratados, codigos, leyes } from './data.js';
import { setupSearch } from './searchFilter.js';
import { renderCards } from './cards.js';
import { setupThemeToggle } from './themeToggle.js';
import { setupDetailsToggle } from './utils.js';

// Crear secciones con los enlaces
createSections(constituciones, 'Constituciones Argentinas', 'leyes');
createSections(codigos, 'Códigos de Fondo y Forma', 'leyes');
createSections(tratados, 'Tratados Constitucionales', 'leyes');
createSections(leyes, 'Leyes Nacionales y de Mendoza', 'leyes');

// Inicializar búsqueda
setupSearch('#search-input', '.divContainer_links');

// Renderizar cards
renderCards('#cards-container', ['educacion', 'noticias', 'ensayos']);

// Configurar toggle de tema y botón volver arriba
document.addEventListener('DOMContentLoaded', () => {
  setupThemeToggle('main');
});

// Animación texto (puedes modularizar también si quieres)
const words = ["aprender;", "enseñar;", "servir;"];
const el = document.getElementById("animated-text");
let index = 0;

function changeText() {
  el.style.opacity = 0;
  setTimeout(() => {
    el.textContent = words[index];
    el.style.opacity = 1;
    index = (index + 1) % words.length;
  }, 500);
}

setInterval(changeText, 3000);


document.addEventListener('DOMContentLoaded', () => {
  setupDetailsToggle(); // Usa el selector por defecto 'details'
});