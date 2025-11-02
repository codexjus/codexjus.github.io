import { procesarDatosAnt, procesarDatos, calculoMonotributoAportante } from './procesarDatos.js';
import { datosSujeto } from './datosSujeto.js';
import { resumen } from './resumen.js';

// Función para controlar tabs
function openTab(tabName, elmnt) {
    const tabs = document.querySelectorAll('.tabcontent');
    tabs.forEach(tab => tab.style.display = 'none');
    document.getElementById(tabName).style.display = 'block';

    const buttons = document.querySelectorAll('.tablink');
    buttons.forEach(btn => btn.classList.remove('active'));
    elmnt.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    // Activa la primera pestaña
    const firstTab = document.querySelector('.tablink');
    if (firstTab) firstTab.click();

    // Asocia openTab a cada botón de pestaña usando data-attribute
    document.querySelectorAll('.tablink').forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            openTab(tabName, button);
        });
    });

    // Asociar funciones a botones (ya sin onclick en HTML)
    document.getElementById('btnProcesarAnt').addEventListener('click', procesarDatosAnt);
    document.getElementById('btnProcesarDesde').addEventListener('click', procesarDatos);
    document.getElementById('btnProcesarMono').addEventListener('click', calculoMonotributoAportante);
    document.getElementById('btnDatosSujeto').addEventListener('click', datosSujeto);
    document.getElementById('btnResumen').addEventListener('click', resumen);
});

