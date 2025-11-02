export function setupThemeToggle(mainSelector) {
  const main = document.querySelector(mainSelector);
  const divContainer = document.createElement('div');
  divContainer.id = 'theme-toggle-container';
  main.insertBefore(divContainer, main.firstChild);

  // Botón de cambio de tema
  const btnToggle = document.createElement('button');
  btnToggle.id = 'btn-theme-toggle';
  btnToggle.setAttribute('aria-label', 'Cambiar tema claro/oscuro');

  // Botón volver al principio
  const btnTop = document.createElement('button');
  btnTop.id = 'btn-back-to-top';
  btnTop.innerHTML = `<span class="material-icons">vertical_align_top</span>`;
  btnTop.setAttribute('aria-label', 'Volver al principio de la página');

  divContainer.appendChild(btnToggle);
  divContainer.appendChild(btnTop);

  const body = document.body;

  // Función para actualizar el ícono del botón según el tema
  function updateButtonIcon() {
    if (body.classList.contains('light-theme')) {
      // Modo claro activo: mostrar ícono de sol (para cambiar a oscuro)
      btnToggle.innerHTML = `<span class="material-icons">light_mode</span>`;
      btnToggle.setAttribute('aria-label', 'Cambiar a modo oscuro');
    } else {
      // Modo oscuro activo: mostrar ícono de luna (para cambiar a claro)
      btnToggle.innerHTML = `<span class="material-icons">dark_mode</span>`;
      btnToggle.setAttribute('aria-label', 'Cambiar a modo claro');
    }
  }

  // Aplicar tema guardado o, si no hay, forzar dark por defecto (sin clase)
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light-theme');
  } else {
    body.classList.remove('light-theme');
    localStorage.setItem('theme', 'dark');
  }

  updateButtonIcon();

  btnToggle.addEventListener('click', () => {
    if (body.classList.contains('light-theme')) {
      body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    }
    updateButtonIcon();
  });

  btnTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
