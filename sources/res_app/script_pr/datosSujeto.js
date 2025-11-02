function calcularEdadCompleta(fechaNacimientoStr, fechaActual = new Date()) {
  const partes = fechaNacimientoStr.split('/');
  const anioN = parseInt(partes[2], 10);
  const mesN = parseInt(partes[1], 10) - 1;
  const diaN = parseInt(partes[0], 10);

  const fechaNacimiento = new Date(anioN, mesN, diaN);

  let años = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
  let meses = fechaActual.getMonth() - fechaNacimiento.getMonth();
  let dias = fechaActual.getDate() - fechaNacimiento.getDate();

  if (dias < 0) {
    meses--;
    const ultimoDiaMesAnterior = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 0);
    dias += ultimoDiaMesAnterior.getDate();
  }
  if (meses < 0) {
    años--;
    meses += 12;
  }

  return { años, meses, dias };
}

export function datosSujeto() {
  const nombre = document.getElementById('nombreApellido').value.trim();
  const dni = document.getElementById('dni').value.trim();
  const cuilCuit = document.getElementById('cuilCuit').value.trim();
  const generoRegistral = document.getElementById('generoRegistral').value.trim();
  const lugarNacimiento = document.getElementById('lugarNacimiento').value.trim();
  const fechaNacimiento = document.getElementById('fechaNacimiento').value.trim();
  const fechaIngresoPais = document.getElementById('fechaIngresoPais').value.trim();

  // Validaciones básicas
  if (!nombre) {
    alert('Por favor, ingrese Apellido y Nombre.');
    return;
  }
  if (!dni || isNaN(dni)) {
    alert('Por favor, ingrese un DNI válido.');
    return;
  }
  const cuilRegex = /^\d{2}-\d+-\d+$/;
  if (!cuilRegex.test(cuilCuit)) {
    alert('Por favor, ingrese un CUIL/CUIT válido (formato xx-xxxxxxxx-x).');
    return;
  }
  if (!['Masculino', 'Femenino', 'No Binario'].includes(generoRegistral)) {
    alert('Por favor, seleccione un género registral válido.');
    return;
  }
  if (!lugarNacimiento) {
    alert('Por favor, ingrese lugar de nacimiento.');
    return;
  }
  const fechaRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if (fechaIngresoPais !== '-' && !fechaRegex.test(fechaIngresoPais)) {
    alert('Fecha de ingreso al país inválida. Use dd/mm/yyyy ó "-".');
    return;
  }
  if (!fechaRegex.test(fechaNacimiento)) {
    alert('Fecha de nacimiento inválida. Use dd/mm/yyyy.');
    return;
  }

  // Fecha del sistema y cálculo de edad completo
  const fechaSistema = new Date();
  const fechaCalculo = `${fechaSistema.getDate().toString().padStart(2, '0')}/${(fechaSistema.getMonth() + 1).toString().padStart(2, '0')}/${fechaSistema.getFullYear()}`;
  const edadCompleta = calcularEdadCompleta(fechaNacimiento, fechaSistema);

  // Mostrar en tabla resumen
  let resumenHTML = '<table><thead><tr><th>Campos</th><th>Datos Personales</th></tr></thead><tbody>';
  resumenHTML += `<tr><td>Nombre y Apellido</td><td>${nombre}</td></tr>`;
  resumenHTML += `<tr><td>DNI</td><td>${dni}</td></tr>`;
  resumenHTML += `<tr><td>CUIL/CUIT</td><td>${cuilCuit}</td></tr>`;
  resumenHTML += `<tr><td>Género Registral</td><td>${generoRegistral}</td></tr>`;
  resumenHTML += `<tr><td>Lugar de Nacimiento</td><td>${lugarNacimiento}</td></tr>`;
  resumenHTML += `<tr><td>Fecha Nacimiento</td><td>${fechaNacimiento}</td></tr>`;
  resumenHTML += `<tr><td>Fecha ingreso al país</td><td>${fechaIngresoPais || '-'}</td></tr>`;
  resumenHTML += `<tr><td>Fecha de Cálculo</td><td>${fechaCalculo}</td></tr>`;
  resumenHTML += `<tr><td>Edad al momento del cálculo</td><td>${edadCompleta.años} años, ${edadCompleta.meses} meses, ${edadCompleta.dias} días</td></tr>`;
  resumenHTML += '</tbody></table>';

  document.getElementById('resultadoSujeto').innerHTML = resumenHTML;
}
