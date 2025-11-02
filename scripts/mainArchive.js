import { setupThemeToggle } from './themeToggle.js';
import { setupDetailsToggle } from './utils.js';

// Configurar toggle de tema y botón volver arriba
document.addEventListener('DOMContentLoaded', () => {
  setupThemeToggle('main');
});



document.addEventListener('DOMContentLoaded', () => {
  setupDetailsToggle(); // Usa el selector por defecto 'details'
});


