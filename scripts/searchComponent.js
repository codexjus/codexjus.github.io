// searchComponent.js

export function setupSearchComponent() {
  // Selecciona el header y el body
  const header = document.querySelector('header');
  const body = document.body;

  // Crear el nav
  const nav = document.createElement('nav');

  // Crear el form
  const form = document.createElement('form');
  form.id = 'search-form';

  // Crear input
  const input = document.createElement('input');
  input.id = 'search-input';
  input.type = 'text';
  input.placeholder = 'Busque palabras claves...';

  // Crear botón submit
  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = 'Buscar';

  // Agregar input y botón al form
  form.appendChild(input);
  form.appendChild(button);

  // Agregar form al nav
  nav.appendChild(form);

  // Insertar nav justo después del header
  if (header.nextSibling) {
    body.insertBefore(nav, header.nextSibling);
  } else {
    body.appendChild(nav);
  }

  // Guardar contenido original para búsqueda
  let currentIndex = 0;
  const contentElement = document.getElementById("content");
  const originalContent = contentElement.innerHTML;

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // evitar envío del formulario
    findText();
  });

  input.addEventListener("keyup", function (event) {
    if (this.value.length > 0 && event.key !== 'Enter') {
      currentIndex = 0; // resetear índice si cambia texto y no es Enter
    }
  });

  function findText() {
    const searchText = input.value.toLowerCase();
    const content = originalContent.toLowerCase();
    const index = content.indexOf(searchText, currentIndex);
    if (index !== -1 && searchText.length > 0) {
      // Resaltar texto encontrado
      const before = originalContent.substring(0, index);
      const match = originalContent.substring(index, index + searchText.length);
      const after = originalContent.substring(index + searchText.length);

      const newText = `${before}<span id='highlight'>${match}</span>${after}`;
      contentElement.innerHTML = newText;

      const highlightedElement = document.getElementById("highlight");
      highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      highlightedElement.focus();

      currentIndex = index + searchText.length; // actualizar índice
    } else {
      alert("¡Llegaste al final del documento. Puedes volver a intentarlo desde el principio!");
      currentIndex = 0; // reiniciar índice
      contentElement.innerHTML = originalContent; // quitar resaltado
    }
  }
}
