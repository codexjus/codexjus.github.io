function calcularPagoDiasTrabajados(remuneracion, fechaDespido) {
            const [anioStr, mesStr, diaStr] = fechaDespido.split('-');
            const anio = parseInt(anioStr, 10);
            const mes = parseInt(mesStr, 10) - 1;
            const dia = parseInt(diaStr, 10);
            const diasMes = new Date(anio, mes + 1, 0).getDate();
            const diasTrabajados = dia;
            const pago = (remuneracion / diasMes) * diasTrabajados;
            return pago;
        }

        function calcularPagoDiasFaltantes(remuneracion, fechaDespido) {
            const [anioStr, mesStr, diaStr] = fechaDespido.split('-');
            const anio = parseInt(anioStr, 10);
            const mes = parseInt(mesStr, 10) - 1;
            const dia = parseInt(diaStr, 10);
            const diasMes = new Date(anio, mes + 1, 0).getDate();
            const diasFaltantes = diasMes - dia;
            const pagoFaltante = (remuneracion / diasMes) * diasFaltantes;
            return pagoFaltante;
        }

        function calcularSAC(remuneracion, fechaDespido) {
            const pagoIntegracionMes = calcularPagoDiasFaltantes(remuneracion, fechaDespido);
            const sac = pagoIntegracionMes / 12;
            return sac;
        }

        function calcularDiasTranscurridosHastaFechaDespido(fechaDespido) {
            const [anioStr, mesStr, diaStr] = fechaDespido.split('-');
            const anio = parseInt(anioStr, 10);
            const mes = parseInt(mesStr, 10) - 1;
            const dia = parseInt(diaStr, 10);
            let diasTranscurridos = 0;
            for (let m = 0; m < mes; m++) {
                diasTranscurridos += new Date(anio, m + 1, 0).getDate();
            }
            diasTranscurridos += dia;
            return diasTranscurridos;
        }

        function calcularAntiguedad(fechaIngreso, fechaDespido) {
            const [anioIngresoStr, mesIngresoStr, diaIngresoStr] = fechaIngreso.split('-');
            const anioIngreso = parseInt(anioIngresoStr, 10);
            const mesIngreso = parseInt(mesIngresoStr, 10) - 1;
            const diaIngreso = parseInt(diaIngresoStr, 10);

            const [anioDespidoStr] = fechaDespido.split('-');
            const anioDespido = parseInt(anioDespidoStr, 10);

            const fechaFinAntiguedad = new Date(anioDespido, 11, 31);
            const fechaInicio = new Date(anioIngreso, mesIngreso, diaIngreso);

            let diferenciaAnios = fechaFinAntiguedad.getFullYear() - fechaInicio.getFullYear();
            if (fechaFinAntiguedad < fechaInicio) {
                diferenciaAnios = 0;
            }
            return diferenciaAnios;
        }

        function calcularAntiguedadReal(fechaIngreso, fechaDespido) {
            const fechaInicio = new Date(fechaIngreso);
            const fechaFin = new Date(fechaDespido);

            let años = fechaFin.getFullYear() - fechaInicio.getFullYear();
            if (
                fechaFin.getMonth() < fechaInicio.getMonth() ||
                (fechaFin.getMonth() === fechaInicio.getMonth() && fechaFin.getDate() < fechaInicio.getDate())
            ) {
                años--;
            }
            return años < 0 ? 0 : años;
        }

        function calcularAntiguedadConMeses(fechaIngreso, fechaDespido) {
            const fechaInicio = new Date(fechaIngreso);
            const fechaFin = new Date(fechaDespido);

            let años = fechaFin.getFullYear() - fechaInicio.getFullYear();
            let meses = fechaFin.getMonth() - fechaInicio.getMonth();
            let dias = fechaFin.getDate() - fechaInicio.getDate();

            if (dias < 0) {
                meses--;
                dias += new Date(fechaFin.getFullYear(), fechaFin.getMonth(), 0).getDate();
            }
            if (meses < 0) {
                años--;
                meses += 12;
            }

            return { años, meses };
        }

        function diasVacacionesSegunAntiguedad(antiguedad) {
            if (antiguedad < 5) return 14;
            if (antiguedad >= 5 && antiguedad <= 10) return 21;
            if (antiguedad > 10 && antiguedad <= 20) return 28;
            if (antiguedad > 20) return 35;
        }

        // Ahora la función recibe diasVacaciones calculados fuera
        function calcularVacacionesNoGozadas(remuneracion, diasVacaciones, fechaDespido) {
            const diasTranscurridos = calcularDiasTranscurridosHastaFechaDespido(fechaDespido);
            const pagoVacaciones = (remuneracion / 25) * ((diasTranscurridos * diasVacaciones) / 365);
            return pagoVacaciones;
        }

        function calcularSACVacacionesNoGozadas(remuneracion, diasVacaciones, fechaDespido) {
            const vacacionesNoGozadas = calcularVacacionesNoGozadas(remuneracion, diasVacaciones, fechaDespido);
            const sacVacaciones = vacacionesNoGozadas / 12;
            return sacVacaciones;
        }


        function esAnioBisiesto(anio) {
            return (anio % 4 === 0 && anio % 100 !== 0) || (anio % 400 === 0);
        }

        function calcularSACProporcional(remuneracion, fechaDespido) {
            const [anioStr, mesStr, diaStr] = fechaDespido.split('-');
            const anio = parseInt(anioStr, 10);
            const mes = parseInt(mesStr, 10);
            const dia = parseInt(diaStr, 10);

            const remuneracionMitad = remuneracion / 2;
            let divisorSemestre;
            let diasTrabajadosSemestre;

            if (mes >= 1 && mes <= 6) {
                divisorSemestre = esAnioBisiesto(anio) ? 182 : 181;
                const inicioSemestre = new Date(anio, 0, 1);
                const fechaDesp = new Date(anio, mes - 1, dia);
                diasTrabajadosSemestre = Math.floor((fechaDesp - inicioSemestre) / (1000 * 60 * 60 * 24)) + 1;
            } else {
                divisorSemestre = 184;
                const inicioSemestre = new Date(anio, 6, 1);
                const fechaDesp = new Date(anio, mes - 1, dia);
                diasTrabajadosSemestre = Math.floor((fechaDesp - inicioSemestre) / (1000 * 60 * 60 * 24)) + 1;
            }
            const sacProporcional = (remuneracionMitad / divisorSemestre) * diasTrabajadosSemestre;
            return sacProporcional;
        }

        function calcularIndemnizacionPreaviso(remuneracion, fechaIngreso, fechaDespido) {
            const antiguedadReal = calcularAntiguedadReal(fechaIngreso, fechaDespido);
            if (antiguedadReal >= 5) {
                return remuneracion * 2;
            } else {
                return remuneracion;
            }
        }

        function calcularIndemnizacionAntiguedad(remuneracion, fechaIngreso, fechaDespido) {
            const antiguedad = calcularAntiguedad(fechaIngreso, fechaDespido);
            return remuneracion * antiguedad;
        }

        function calcularSACIndemnizacionPreaviso(remuneracion, fechaIngreso, fechaDespido, preavisoChecked) {
            if (!preavisoChecked) {
                const indemnizacion = calcularIndemnizacionPreaviso(remuneracion, fechaIngreso, fechaDespido);
                return indemnizacion / 12;
            }
            return 0;
        }

        document.getElementById('indemnizacionForm').addEventListener('submit', function (event) {
            event.preventDefault();

            const remuneracion = parseFloat(document.getElementById('remuneracion').value);
            const fechaIngreso = document.getElementById('fechaIngreso').value;
            const fechaDespido = document.getElementById('fechaDespido').value;
            const preavisoChecked = document.getElementById('preaviso').checked;

            // Datos cliente
            const antiguedadReal = calcularAntiguedadConMeses(fechaIngreso, fechaDespido);
            const antiguedadHastaFinAnio = calcularAntiguedad(fechaIngreso, fechaDespido);
            const diasTrabajadosAnio = calcularDiasTranscurridosHastaFechaDespido(fechaDespido);
            const [anioStr, mesStr, diaStr] = fechaDespido.split('-');
            const anio = parseInt(anioStr, 10);
            const mes = parseInt(mesStr, 10) - 1;
            const dia = parseInt(diaStr, 10);
            const diasTrabajadosMes = dia;
            const diasMes = new Date(anio, mes + 1, 0).getDate();
            const diasFaltanMes = diasMes - dia;

            let semestreTexto, diasTrabajadosSemestre;
            if (mes + 1 <= 6) {
                semestreTexto = "Primer semestre";
                const inicioSemestre = new Date(anio, 0, 1);
                const fechaDesp = new Date(anio, mes, dia);
                diasTrabajadosSemestre = Math.floor((fechaDesp - inicioSemestre) / (1000 * 60 * 60 * 24)) + 1;
            } else {
                semestreTexto = "Segundo semestre";
                const inicioSemestre = new Date(anio, 6, 1);
                const fechaDesp = new Date(anio, mes, dia);
                diasTrabajadosSemestre = Math.floor((fechaDesp - inicioSemestre) / (1000 * 60 * 60 * 24)) + 1;
            }

            // Calcular dias de vacaciones según antiguedad al 31/12
            let diasVacaciones;
            if (antiguedadHastaFinAnio <= 5) diasVacaciones = 14;
            else if (antiguedadHastaFinAnio > 5 && antiguedadHastaFinAnio <= 10) diasVacaciones = 21;
            else if (antiguedadHastaFinAnio > 10 && antiguedadHastaFinAnio <= 20) diasVacaciones = 28;
            else diasVacaciones = 35;

            // Cálculos indemnizaciones
            const pagoDiasTrabajados = calcularPagoDiasTrabajados(remuneracion, fechaDespido);
            const pagoDiasFaltantes = calcularPagoDiasFaltantes(remuneracion, fechaDespido);
            const sac = calcularSAC(remuneracion, fechaDespido);
            const vacacionesNoGozadas = calcularVacacionesNoGozadas(remuneracion, diasVacaciones, fechaDespido);
            const sacVacaciones = calcularSACVacacionesNoGozadas(remuneracion, diasVacaciones, fechaDespido);
            const sacProporcional = calcularSACProporcional(remuneracion, fechaDespido);

            let indemnizacionPreaviso = 0;
            if (!preavisoChecked) {
                indemnizacionPreaviso = calcularIndemnizacionPreaviso(remuneracion, fechaIngreso, fechaDespido);
            }
            const indemnizacionAntiguedad = calcularIndemnizacionAntiguedad(remuneracion, fechaIngreso, fechaDespido);
            const sacIndemnizacionPreaviso = calcularSACIndemnizacionPreaviso(remuneracion, fechaIngreso, fechaDespido, preavisoChecked);

            // Formateo resultado - Primera sección: Datos del Cliente
            const datosClienteSection = `<dl><dt>Datos del Cliente</dt>` +
                `<dd><p>a. Fecha de Ingreso: ${fechaIngreso}</p>` +
                `<p>b. Fecha de Despido: ${fechaDespido}</p>` +
                `<p>c. Antigüedad real: ${antiguedadReal.años} años y ${antiguedadReal.meses} meses</p>` +
                `<p>d. Antigüedad al 31/12 del año despido: ${antiguedadHastaFinAnio} años</p>` +
                `<p>e. Días trabajados en el año hasta fecha despido: ${diasTrabajadosAnio}</p>` +
                `<p>f. Días trabajados en el mes de despido: ${diasTrabajadosMes}</p>` +
                `<p>g. Días faltantes para terminar el mes de despido: ${diasFaltanMes}</p>` +
                `<p>h. Semestre de despido: ${semestreTexto} (${diasTrabajadosSemestre} días trabajados)</p>` +
                `<p>i. Días de vacaciones que corresponden: ${diasVacaciones}</p>` +
                `<p>j. Remuneración: $${remuneracion.toFixed(2)}</p></dd>`;

            // Segunda sección: Indemnizaciones y rubros
            const indemnizacionPorAntiguedadSAC = indemnizacionAntiguedad / 12;
            const indemnizacionesSection = `<dl><dt>Rubros Obligatorios e Indemnizatorios</dt>` +
                `<dd><p>a. Haberes por Días Trabajados: $${pagoDiasTrabajados.toFixed(2)}</p>` +
                `<p>b. Integración del Mes de Despido: $${pagoDiasFaltantes.toFixed(2)}</p>` +
                `<p>c. SAC Integración del Mes de Despido: $${sac.toFixed(2)}</p>` +
                `<p>d. Vacaciones no Gozadas: $${vacacionesNoGozadas.toFixed(2)}</p>` +
                `<p>e. SAC Vacaciones no Gozadas: $${sacVacaciones.toFixed(2)}</p>` +
                `<p>f. Salario Anual Complementario (SAC Proporcional): $${sacProporcional.toFixed(2)}</p>` +
                `<p>g. Indemnización Sustitutiva por Falta de Preaviso: $${indemnizacionPreaviso.toFixed(2)}</p>` +
                `<p>h. SAC Indemnización Sustitutiva por Falta de Preaviso: $${sacIndemnizacionPreaviso.toFixed(2)}</p>` +
                `<p>i. Indemnización por Antigüedad: $${indemnizacionAntiguedad.toFixed(2)}</p>` +
                `<p>j. SAC Indemnización por Antigüedad: $${indemnizacionPorAntiguedadSAC.toFixed(2)}</p></dd></dl>`;

            document.getElementById('result').innerHTML = datosClienteSection + indemnizacionesSection;

        });



        /*Styles*/
        function setupThemeToggle(mainSelector) {
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
        // Configurar toggle de tema y botón volver arriba
        document.addEventListener('DOMContentLoaded', () => {
            setupThemeToggle('main');
        });



