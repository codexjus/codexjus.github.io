import { cardsData } from './data.js';

const categoryNames = {
  ensayos: 'Doctrina y Teoría Jurídica',
  educacion: 'Educación Jurídica',
  noticias: 'Noticias y Actualidad Jurídica'
};

export function createCard({ title, description, link, linkText = 'Abrir', type }) {
  const card = document.createElement('article');
  card.className = 'card_docs';

  if (type) {
    card.classList.add(`card_${type}`);
  }

  const h5 = document.createElement('h4');
  h5.textContent = title;
  card.appendChild(h5);

  const p = document.createElement('p');
  p.textContent = description;
  card.appendChild(p);

  const a = document.createElement('a');
  a.href = link;
  a.textContent = linkText;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  card.appendChild(a);

  return card;
}

export function getCardsByCategory(category) {
  return cardsData[category] || [];
}

export function renderCards(containerSelector, categories) {
  const container = document.querySelector(containerSelector);
  container.innerHTML = '';

  categories.forEach(category => {
    const section = document.createElement('section');
    section.classList.add('category-section');

    const heading = document.createElement('h3');
    heading.textContent = categoryNames[category] || category;
    section.appendChild(heading);

    const cardsGrid = document.createElement('div');
    cardsGrid.classList.add('cards-grid');
    section.appendChild(cardsGrid);

    const cards = getCardsByCategory(category);
    cards.forEach(cardData => {
      const cardElement = createCard(cardData);
      cardsGrid.appendChild(cardElement);
    });

    container.appendChild(section);
  });
}
