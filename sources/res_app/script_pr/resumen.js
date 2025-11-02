  
   export function resumen() {
            // Construcción del resumen
            const datosSujetoHTML = document.getElementById('resultadoSujeto').innerHTML.trim();
            const datosAntHTML = document.getElementById('resultadoAnt').innerHTML.trim();
            const datosDesdeHTML = document.getElementById('resultado').innerHTML.trim();
            const monotributoHTML = document.getElementById('resultadoMonotributo').innerHTML.trim();

            let resumenHTML = '';

            resumenHTML += '<h3>Datos Personales</h3>';
            resumenHTML += datosSujetoHTML || '<p>No hay datos personales guardados.</p>';

            resumenHTML += '<h3>Datos hasta 06/1994</h3>';
            resumenHTML += datosAntHTML || '<p>No hay datos antiguos procesados.</p>';

            resumenHTML += '<h3>Datos desde 07/1994</h3>';
            resumenHTML += datosDesdeHTML || '<p>No hay datos desde julio de 1994 procesados.</p>';

            resumenHTML += '<h3>Monotributo Aportante</h3>';
            resumenHTML += monotributoHTML || '<p>No hay datos de monotributo aportante procesados.</p>';

            const contenedorResumen = document.getElementById('resultadoResumen');
            contenedorResumen.innerHTML = resumenHTML;

            // Crear botón de imprimir dinámicamente
            const btnImprimir = document.createElement('input');
            btnImprimir.type = 'button';
            btnImprimir.value = 'Imprimir';
            btnImprimir.className = 'printbutton';

            btnImprimir.addEventListener('click', () => {
                window.print();
            });

            // Añadir el botón al final del div resultadoResumen
            contenedorResumen.appendChild(btnImprimir);
        }