import { setupThemeToggle } from './themeToggle.js';
import { setupDetailsToggle } from './utils.js';
import { setupSearchComponent } from './searchComponent.js';

// Configurar toggle de tema y botón volver arriba
document.addEventListener('DOMContentLoaded', () => {
  setupThemeToggle('main');
});



document.addEventListener('DOMContentLoaded', () => {
  setupDetailsToggle(); // Usa el selector por defecto 'details'
});

document.addEventListener('DOMContentLoaded', () => {
  setupSearchComponent();
  // Aquí puedes llamar a otras funciones o inicializar otros componentes
});
