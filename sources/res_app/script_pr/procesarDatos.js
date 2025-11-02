// Variable global para almacenar los datos procesados en procesarDatos()
let datosProcesadosGlobal = [];

// Función para procesar datos antiguos
function procesarDatosAnt() {
    const input = document.getElementById('inputTextAnt').value.trim();
    if (!input) {
        alert('Por favor, pega los datos primero.');
        return;
    }
    const lines = input.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const regex = /^([A-ZÁÉÍÓÚÑ.\s]+?)\s(\d+)\s(\d{4})\s(\d+)\s(\d{2}\/\d{2}\s-\s\d{2}\/\d{2})\s*(\d*)$/i;
    const resultados = [];

    for (const line of lines) {
        const match = line.match(regex);
        if (match) {
            resultados.push({
                razonSocial: match[1].trim(),
                cuenta: parseInt(match[2], 10),
                anio: parseInt(match[3], 10),
                caracter: parseInt(match[4], 10),
                servicios: match[5],
                mesesTrabajados: match[6] === '' ? 0 : parseInt(match[6], 10)
            });
        }
    }

    if (resultados.length === 0) {
        document.getElementById('resultadoAnt').innerHTML = '<p>No se reconocieron datos con el formato esperado.</p>';
        return;
    }

    let tablaHTML = '<table><thead><tr><th>RAZÓN SOCIAL</th><th>CUENTA</th><th>AÑO</th><th>CARACTER</th><th>SERVICIOS</th><th>MESES TRABAJADOS</th></tr></thead><tbody>';
    for (const fila of resultados) {
        tablaHTML += `<tr>
 <td>${fila.razonSocial}</td>
 <td>${fila.cuenta}</td>
 <td>${fila.anio}</td>
 <td>${fila.caracter}</td>
 <td>${fila.servicios}</td>
 <td>${fila.mesesTrabajados}</td>
</tr>`;
    }
    tablaHTML += '</tbody></table>';

    const resumen = {};
    for (const fila of resultados) {
        const key = fila.razonSocial;
        if (!resumen[key]) {
            resumen[key] = {
                mesesTotales: 0
            };
        }
        resumen[key].mesesTotales += fila.mesesTrabajados;
    }

    tablaHTML += `<h3>Resumen por Razón Social</h3>`;
    tablaHTML += '<table><thead><tr><th>RAZÓN SOCIAL</th><th>Años de Servicio</th><th>Meses Trabajados Totales</th></tr></thead><tbody>';
    for (const razon in resumen) {
        const mesesCount = resumen[razon].mesesTotales;
        const años = Math.floor(mesesCount / 12);
        const meses = mesesCount % 12;
        const anosServicio = `${años} años, ${meses} meses`;
        tablaHTML += `<tr>
 <td>${razon}</td>
 <td>${anosServicio}</td>
 <td>${mesesCount}</td>
</tr>`;
    }
    tablaHTML += '</tbody></table>';

    document.getElementById('resultadoAnt').innerHTML = tablaHTML;
}

// Función para procesar datos actuales y guardar globalmente
function procesarDatos() {
    const input = document.getElementById('inputText').value.trim();
    if (!input) {
        alert('Por favor, pega los datos primero.');
        return;
    }
    const lines = input.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const regex = /^([A-ZÁÉÍÓÚÑ.\s]+?)\s(\d{2}-\d{8}-\d)\s([A-Z])\s*([A-Z]?)\s(\d{2}\/\d{4})\s(\d+)\s(\d+)\s([\d\.]+,\d{2})\s([\d\.]+,\d{2})\s([\d\.]+,\d{2})\s([\d\.]+,\d{2})$/i;

    function diasEnMes(mm, yyyy) {
        const mes = parseInt(mm, 10);
        const anio = parseInt(yyyy, 10);
        if (mes === 2) {
            if ((anio % 4 === 0 && anio % 100 !== 0) || (anio % 400 === 0)) return 29;
            else return 28;
        }
        if ([1, 3, 5, 7, 8, 10, 12].includes(mes)) return 30;
        return 30;
    }

    function convertirDiasAñosMesesDias(totalDias) {
        const años = Math.floor(totalDias / 365);
        const diasRestantes = totalDias % 365;
        const meses = Math.floor(diasRestantes / 30);
        const dias = diasRestantes % 30;
        return `${años} años, ${meses} meses, ${dias} días`;
    }

    const resultados = [];

    for (const line of lines) {
        const match = line.match(regex);
        if (match) {
            let tR = match[4];
            if (tR === "") tR = "-";
            resultados.push({
                razonSocial: match[1].trim(),
                cuit: match[2],
                p: match[3],
                tR: tR,
                periodo: match[5],
                dias: +match[6],
                horas: +match[7],
                remTotal: parseFloat(match[8].replace(/\./g, '').replace(',', '.')),
                remImpSS: parseFloat(match[9].replace(/\./g, '').replace(',', '.')),
                remRegEsp: parseFloat(match[10].replace(/\./g, '').replace(',', '.')),
                sac: parseFloat(match[11].replace(/\./g, '').replace(',', '.'))
            });
        }
    }

    if (resultados.length === 0) {
        document.getElementById('resultado').innerHTML = '<p>No se reconocieron datos con el formato esperado.</p>';
        return;
    }

    datosProcesadosGlobal = resultados.slice();

    function mesesDesdeCero(periodo) {
        const [mm, yyyy] = periodo.split('/');
        return parseInt(yyyy) * 12 + (parseInt(mm) - 1);
    }

    const resumenE = {};
    const resumenC = {};
    const filasConDiasTrabajadosE = [];
    const filasConDiasTrabajadosC = [];

    for (const fila of resultados) {
        const key = fila.razonSocial;
        const resumen = fila.p === 'E' ? resumenE : (fila.p === 'C' ? resumenC : null);
        const filasDiasTrabajados = fila.p === 'E' ? filasConDiasTrabajadosE : (fila.p === 'C' ? filasConDiasTrabajadosC : null);
        if (!resumen || !filasDiasTrabajados) continue;

        if (!resumen[key]) {
            resumen[key] = {
                periodos: new Set(),
                remTotal: 0,
                remImpSS: 0,
                remRegEsp: 0,
                sac: 0,
                diasTrabajadosSuma: 0
            };
        }
        resumen[key].periodos.add(fila.periodo);
        resumen[key].remTotal += fila.remTotal;
        resumen[key].remImpSS += fila.remImpSS;
        resumen[key].remRegEsp += fila.remRegEsp;
        resumen[key].sac += fila.sac;

        const dias = fila.dias;
        const [mm, yyyy] = fila.periodo.split('/');
        const diasMes = diasEnMes(mm, yyyy);

        let diasTrabajados = 0;
        if (dias > 0 && dias < diasMes) {
            diasTrabajados = dias;
            filasDiasTrabajados.push({
                razonSocial: fila.razonSocial,
                periodo: fila.periodo,
                dias,
                diasMes
            });
        }
        resumen[key].diasTrabajadosSuma += diasTrabajados;
    }

    // Calcular años de servicio para resumenE y resumenC
    function calcularAniosServicio(resumen) {
        for (const razon in resumen) {
            const listPeriodos = Array.from(resumen[razon].periodos);
            const mesesNumericos = listPeriodos.map(mesesDesdeCero);
            const minMes = Math.min(...mesesNumericos);
            const maxMes = Math.max(...mesesNumericos);
            const mesesCount = maxMes - minMes + 1;
            const años = Math.floor(mesesCount / 12);
            const meses = mesesCount % 12;
            resumen[razon].anosServicio = `${años} años, ${meses} meses`;
            resumen[razon].totalMesesServicio = mesesCount;
        }
    }

    calcularAniosServicio(resumenE);
    calcularAniosServicio(resumenC);

    let tablaHTML = '<table><thead><tr><th>RAZÓN SOCIAL</th><th>CUIT</th><th>P</th><th>T.R.</th><th>PERÍODO</th><th>DIAS</th><th>HORAS</th><th>REM TOTAL</th><th>REM IMP. SS</th><th>REM. REG. ESP.</th><th>S.A.C.</th></tr></thead><tbody>';
    for (const fila of resultados) {
        tablaHTML += `<tr>
 <td>${fila.razonSocial}</td>
 <td>${fila.cuit}</td>
 <td>${fila.p}</td>
 <td>${fila.tR}</td>
 <td>${fila.periodo}</td>
 <td>${fila.dias}</td>
 <td>${fila.horas}</td>
 <td>${fila.remTotal.toFixed(2)}</td>
 <td>${fila.remImpSS.toFixed(2)}</td>
 <td>${fila.remRegEsp.toFixed(2)}</td>
 <td>${fila.sac.toFixed(2)}</td>
</tr>`;
    }
    tablaHTML += '</tbody></table>';

    // Función para crear tabla resumen para un resumen dado y etiqueta P ('E' o 'C')
    function crearTablaResumen(resumen, pValor) {
        let html = `<h3>Resumen por Razón Social para Servicios: ${pValor === 'E' ? 'Especiales' : 'Comunes'}</h3>`;
        html += '<table><thead><tr><th>RAZÓN SOCIAL</th><th>Años de Servicio</th><th>Días Trabajados</th><th>Suma REM TOTAL</th><th>Suma REM IMP. SS</th><th>Suma REM. REG. ESP.</th><th>Suma S.A.C.</th></tr></thead><tbody>';
        for (const razon in resumen) {
            html += `<tr>
 <td>${razon}</td>
 <td>${resumen[razon].anosServicio}</td>
 <td>${resumen[razon].diasTrabajadosSuma}</td>
 <td>${resumen[razon].remTotal.toFixed(2)}</td>
 <td>${resumen[razon].remImpSS.toFixed(2)}</td>
 <td>${resumen[razon].remRegEsp.toFixed(2)}</td>
 <td>${resumen[razon].sac.toFixed(2)}</td>
</tr>`;
        }
        html += '</tbody></table>';

        // Sumamos tiempo total de servicio en meses para convertir en años y meses
        const totalMeses = Object.values(resumen).reduce((acc, cur) => {
            return acc + (cur.totalMesesServicio || 0);
        }, 0);
        const añosTotales = Math.floor(totalMeses / 12);
        const mesesRestantes = totalMeses % 12;

        html += `<p>Cantidad de tiempo de servicio: ${añosTotales} años y ${mesesRestantes} meses</p>`;

        // Sumar días trabajados en meses parciales
        const totalDiasTrabajados = Object.values(resumen).reduce((acc, cur) => acc + cur.diasTrabajadosSuma, 0);
        const diasConvertidos = convertirDiasAñosMesesDias(totalDiasTrabajados);

        html += `<p>Cantidad de días trabajados en meses parciales: ${totalDiasTrabajados} días (${diasConvertidos})</p>`;
        // Extraer años, meses y días de la conversión de días trabajados
        const partes = diasConvertidos.match(/(\d+) años, (\d+) meses, (\d+) días/);
        const añosDias = parseInt(partes[1], 10);
        const mesesDias = parseInt(partes[2], 10);
        const diasDias = parseInt(partes[3], 10);

        // Convertir todo a días para sumar apropiadamente
        const totalDiasSuma = (añosTotales * 365) + (mesesRestantes * 30) + (añosDias * 365) + (mesesDias * 30) + diasDias;

        // Volver a convertir a años, meses y días
        const añosFinal = Math.floor(totalDiasSuma / 365);
        const diasRestantes = totalDiasSuma % 365;
        const mesesFinal = Math.floor(diasRestantes / 30);
        const diasFinal = diasRestantes % 30;

        // Agregar el párrafo con el total de tiempo de servicio sumado
        html += `<p>Total de tiempo de servicio: ${añosFinal} años, ${mesesFinal} meses, ${diasFinal} días</p>`;

        return html;
    }

    tablaHTML += crearTablaResumen(resumenE, 'E');
    tablaHTML += crearTablaResumen(resumenC, 'C');

    // Mostrar tabla principal y resúmenes
    const contenedor = document.getElementById('resultado');
    contenedor.innerHTML = tablaHTML;

    // Mostrar tabla adicionales Clientes ultimos 120 aportes
    ultimosAportes();
}

/*
function calculoMonotributoAportante() {
    const input = document.getElementById('inputMonotributo').value.trim();
    if (!input) {
        alert('Por favor, pega los datos primero.');
        return;
    }

    const lines = input.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const regex = /^(\d{2,})\s+(\d{2}\/\d{4})\s+(\d{2}\/\d{4}|-)\s+(MONOTRIBUTO APORTANTE|MONOTRIBUTO)\s+([A-Za-z]{2})\s+(\d{2}\/\d{2}\/\d{4})\s+(\d{2}\/\d{2}\/\d{4})$/i;

    // Obtener fecha actual como MM/YYYY
    function obtenerFechaActualMMYYYY() {
        const hoy = new Date();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0'); // Mes 0-based +1
        const yyyy = hoy.getFullYear();
        return `${mm}/${yyyy}`;
    }

    const resultados = [];

    for (const line of lines) {
        const match = line.match(regex);
        if (match) {
            const periodoHastaRaw = match[3];
            const periodoHasta = (periodoHastaRaw === '-') ? obtenerFechaActualMMYYYY() : periodoHastaRaw;

            resultados.push({
                categoria: match[1],
                periodoDesde: match[2],
                periodoHasta: periodoHasta,
                impuesto: match[4].toUpperCase(),
                estado: match[5].toUpperCase(),
                fechaEstado: match[6],
                fechaActualizacion: match[7]
            });
        }
    }

    if (resultados.length === 0) {
        document.getElementById('resultadoMonotributo').innerHTML = '<p>No se encontraron filas con MONOTRIBUTO o MONOTRIBUTO APORTANTE.</p>';
        return;
    }

    function mesesTranscurridos(desde, hasta) {
        if (!hasta) return 0;
        const [mmDesde, yyyyDesde] = desde.split('/').map(Number);
        const [mmHasta, yyyyHasta] = hasta.split('/').map(Number);
        return (yyyyHasta - yyyyDesde) * 12 + (mmHasta - mmDesde) + 1;
    }

    let totalMeses = 0;

    let tablaHTML = '<table><thead><tr><th>CATEGORÍA</th><th>PERÍODO DESDE</th><th>PERÍODO HASTA</th><th>IMPUESTO</th><th>ESTADO</th><th>FECHA ESTADO</th><th>FECHA ACTUALIZACIÓN</th><th>PERIODO TRANSCURRIDO</th></tr></thead><tbody>';

    for (const fila of resultados) {
        const meses = mesesTranscurridos(fila.periodoDesde, fila.periodoHasta);
        totalMeses += meses;

        const años = Math.floor(meses / 12);
        const mesesRest = meses % 12;
        const periodoTranscurridoStr = meses === 0 ? '0 meses' : `${años} años, ${mesesRest} meses`;

        tablaHTML += `<tr>
            <td>${fila.categoria}</td>
            <td>${fila.periodoDesde}</td>
            <td>${fila.periodoHasta}</td>
            <td>${fila.impuesto}</td>
            <td>${fila.estado}</td>
            <td>${fila.fechaEstado}</td>
            <td>${fila.fechaActualizacion}</td>
            <td>${periodoTranscurridoStr}</td>
        </tr>`;
    }

    tablaHTML += '</tbody></table>';

    const totalAños = Math.floor(totalMeses / 12);
    const totalMesesRest = totalMeses % 12;

    tablaHTML += `<p><strong>Tiempo total acumulado:</strong> ${totalAños} años y ${totalMesesRest} meses</p>`;

    document.getElementById('resultadoMonotributo').innerHTML = tablaHTML;
}*/

function calculoMonotributoAportante() {
    const input = document.getElementById('inputMonotributo').value.trim();
    if (!input) {
        alert('Por favor, pega los datos primero.');
        return;
    }

    const lines = input.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const regex = /^(\d{2,})\s+(\d{2}\/\d{4})\s+(\d{2}\/\d{4}|-)\s+(MONOTRIBUTO APORTANTE|MONOTRIBUTO)\s+([A-Za-z]{2})\s+(\d{2}\/\d{2}\/\d{4})\s+(\d{2}\/\d{2}\/\d{4})$/i;

    function obtenerFechaActualMMYYYY() {
        const hoy = new Date();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const yyyy = hoy.getFullYear();
        return `${mm}/${yyyy}`;
    }

    const resultados = [];
    const periodosDesdeVistos = new Set();

    for (const line of lines) {
        const match = line.match(regex);
        if (match) {
            const periodoDesde = match[2];
            if (periodosDesdeVistos.has(periodoDesde)) {
                // Si ya vimos este periodoDesde, ignoramos la fila
                continue;
            }
            periodosDesdeVistos.add(periodoDesde);

            const periodoHastaRaw = match[3];
            const periodoHasta = (periodoHastaRaw === '-') ? obtenerFechaActualMMYYYY() : periodoHastaRaw;

            resultados.push({
                categoria: match[1],
                periodoDesde,
                periodoHasta,
                impuesto: match[4].toUpperCase(),
                estado: match[5].toUpperCase(),
                fechaEstado: match[6],
                fechaActualizacion: match[7]
            });
        }
    }

    if (resultados.length === 0) {
        document.getElementById('resultadoMonotributo').innerHTML = '<p>No se encontraron filas con MONOTRIBUTO o MONOTRIBUTO APORTANTE.</p>';
        return;
    }

    function mesesTranscurridos(desde, hasta) {
        if (!hasta) return 0;
        const [mmDesde, yyyyDesde] = desde.split('/').map(Number);
        const [mmHasta, yyyyHasta] = hasta.split('/').map(Number);
        return (yyyyHasta - yyyyDesde) * 12 + (mmHasta - mmDesde) + 1;
    }

    let totalMeses = 0;
    let tablaHTML = '<table><thead><tr><th>CATEGORÍA</th><th>PERÍODO DESDE</th><th>PERÍODO HASTA</th><th>IMPUESTO</th><th>ESTADO</th><th>FECHA ESTADO</th><th>FECHA ACTUALIZACIÓN</th><th>PERIODO TRANSCURRIDO</th></tr></thead><tbody>';

    for (const fila of resultados) {
        const meses = mesesTranscurridos(fila.periodoDesde, fila.periodoHasta);
        totalMeses += meses;

        const años = Math.floor(meses / 12);
        const mesesRest = meses % 12;
        const periodoTranscurridoStr = meses === 0 ? '0 meses' : `${años} años, ${mesesRest} meses`;

        tablaHTML += `<tr>
            <td>${fila.categoria}</td>
            <td>${fila.periodoDesde}</td>
            <td>${fila.periodoHasta}</td>
            <td>${fila.impuesto}</td>
            <td>${fila.estado}</td>
            <td>${fila.fechaEstado}</td>
            <td>${fila.fechaActualizacion}</td>
            <td>${periodoTranscurridoStr}</td>
        </tr>`;
    }

    tablaHTML += '</tbody></table>';

    const totalAños = Math.floor(totalMeses / 12);
    const totalMesesRest = totalMeses % 12;

    tablaHTML += `<p><strong>Tiempo total acumulado:</strong> ${totalAños} años y ${totalMesesRest} meses</p>`;

    document.getElementById('resultadoMonotributo').innerHTML = tablaHTML;
}



// Función para crear la tabla de últimos 120 aportes desde cero y agregar al final de 'resultado'
function ultimosAportes() {
    if (!datosProcesadosGlobal.length) {
        alert('Primero debes procesar los datos con la función procesarDatos()');
        return;
    }

    const ultimos120 = datosProcesadosGlobal.slice(-120);
    const resumen = {};

    let sumaRemTotal = 0;
    let sumaRemImpSS = 0;
    let sumaRemRegEsp = 0;

    for (const fila of ultimos120) {
        const key = fila.razonSocial + '|' + fila.cuit;
        if (!resumen[key]) {
            resumen[key] = {
                razonSocial: fila.razonSocial,
                cuit: fila.cuit,
                remTotal: 0,
                remImpSS: 0,
                remRegEsp: 0,
                sac: 0,
                cantidadValores: 0
            };
        }
        resumen[key].remTotal += fila.remTotal;
        resumen[key].remImpSS += fila.remImpSS;
        resumen[key].remRegEsp += fila.remRegEsp;
        resumen[key].sac += fila.sac;
        resumen[key].cantidadValores++;

        sumaRemTotal += fila.remTotal;
        sumaRemImpSS += fila.remImpSS;
        sumaRemRegEsp += fila.remRegEsp;
    }

    // Crear tabla con DOM, igual que antes
    const tabla = document.createElement('table');
    const thead = document.createElement('thead');
    const encabezado = document.createElement('tr');
    ['RAZÓN SOCIAL', 'CUIT', 'REM TOTAL', 'REM IMP. SS', 'REM. REG. ESP.', 'S.A.C.', 'CANTIDAD DE VALORES'].forEach(texto => {
        const th = document.createElement('th');
        th.textContent = texto;
        encabezado.appendChild(th);
    });
    thead.appendChild(encabezado);
    tabla.appendChild(thead);

    const tbody = document.createElement('tbody');

    for (const key in resumen) {
        const fila = resumen[key];
        const tr = document.createElement('tr');

        [fila.razonSocial,
        fila.cuit,
        fila.remTotal.toFixed(2),
        fila.remImpSS.toFixed(2),
        fila.remRegEsp.toFixed(2),
        fila.sac.toFixed(2),
        fila.cantidadValores
        ].forEach(valor => {
            const td = document.createElement('td');
            td.textContent = valor;

            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    }

    tabla.appendChild(tbody);

    const contenedor = document.getElementById('resultado');

    const titulo = document.createElement('h3');
    titulo.textContent = 'Últimos 120 Aportes';

    contenedor.appendChild(titulo);
    contenedor.appendChild(tabla);

    // Crear párrafo con sumas formateadas
    const parrafo = document.createElement('p');
    parrafo.style.marginTop = '10px';
    parrafo.innerHTML = `La sumatoria de Rem Total es igual a ${sumaRemTotal.toFixed(2)}<br>
                        La sumatoria de Rem Imp SS es igual a ${sumaRemImpSS.toFixed(2)}<br>
                        La sumatoria de Rem Reg Esp es igual a ${sumaRemRegEsp.toFixed(2)}`;
    contenedor.appendChild(parrafo);
}

// Exportar las funciones para uso externo
export { procesarDatosAnt, procesarDatos, calculoMonotributoAportante, ultimosAportes };
