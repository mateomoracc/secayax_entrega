document.addEventListener('DOMContentLoaded', () => {
  // --- SELECTORES ---
  const btnAbrirTecho = document.getElementById('btnAbrirTecho');
  const btnCerrarTecho = document.getElementById('btnCerrarTecho');
  const estadoTecho = document.getElementById('estadoTecho');
  const anilloProgreso = document.getElementById('anilloProgreso');
  const valorProgreso = document.getElementById('valorProgreso');
  const mensajeEstado = document.getElementById('mensajeEstado');
  const secadoAuto = document.getElementById('secadoAuto');
  const avisoEmergente = document.getElementById('avisoEmergente');
  const textoIa = document.getElementById('textoIa');
  const valorLluvia = document.getElementById('valorLluvia');
  const valorTemperatura = document.getElementById('valorTemperatura');
  const humedadAmbiente = document.getElementById('humedadAmbiente');
  const probLluvia = document.getElementById('probLluvia');
  const anilloLluvia = document.getElementById('anilloLluvia');
  const iconoClima = document.getElementById('iconoClima');
  const descClima = document.getElementById('descClima');
  const btnLimpiarNotif = document.getElementById('btnLimpiarNotif');
  const listaNotificaciones = document.getElementById('listaNotificaciones');

  const CIRCUNFERENCIA_LLUVIA = 138;

  function actualizarGaugeLluvia(porcentaje) {
    if (probLluvia) probLluvia.textContent = porcentaje + '%';
    if (anilloLluvia) {
      anilloLluvia.style.strokeDashoffset = CIRCUNFERENCIA_LLUVIA - (CIRCUNFERENCIA_LLUVIA * porcentaje) / 100;
    }
  }

  function actualizarHumedadAmbiente(humedad) {
    if (!humedadAmbiente) return;
    const estado = humedad > 55 ? 'Mala' : 'Buena';
    const clase = humedad > 55 ? 'estado-malo' : 'estado-bueno';
    humedadAmbiente.innerHTML = humedad + '% <span class="' + clase + '">(' + estado + ')</span>';
  }

  function actualizarClima(temperatura, lluvia) {
    if (valorTemperatura) valorTemperatura.textContent = temperatura + '°';
    if (!iconoClima || !descClima) return;
    if (lluvia > 70) {
      iconoClima.textContent = '🌧️';
      descClima.textContent = 'lluvioso';
    } else if (temperatura > 28) {
      iconoClima.textContent = '☀️';
      descClima.textContent = 'despejado';
    } else {
      iconoClima.textContent = '⛅';
      descClima.textContent = 'parcialmente nublado';
    }
  }

  function toggleControlesManuales(automatico) {
    const deshabilitado = automatico;
    if (btnAbrirTecho) btnAbrirTecho.disabled = deshabilitado;
    if (btnCerrarTecho) btnCerrarTecho.disabled = deshabilitado;
  }

  const navItems = document.querySelectorAll('.item-navegacion');
  const panelNotif = document.getElementById('panelNotificaciones');
  const panelPerfil = document.getElementById('panelPerfil');
  const botonesCerrar = document.querySelectorAll('[data-cerrar]');

  // mostrar avisos //
  function mostrarAviso(mensaje) {
    avisoEmergente.textContent = mensaje;
    avisoEmergente.classList.add('mostrar');
    setTimeout(() => {
      avisoEmergente.classList.remove('mostrar');
    }, 3000);
  }

  // inteligencia artificial //
  function analizarIA() {
    const temperatura = Math.floor(Math.random() * 15) + 20; // 20°C a 34°C
    const humedad = Math.floor(Math.random() * 50) + 20;     // 20% a 70%
    const lluvia = Math.floor(Math.random() * 100);
  
    if (valorLluvia) valorLluvia.textContent = lluvia + '%';
    actualizarClima(temperatura, lluvia);
    actualizarHumedadAmbiente(humedad);
    actualizarGaugeLluvia(lluvia);
  
    if (lluvia > 70) {
      textoIa.textContent = 'Alta probabilidad de lluvia. Se recomienda cerrar el techo.';
      if (estadoTecho) estadoTecho.textContent = 'Cerrado';
      valorProgreso.textContent = '0%';
      anilloProgreso.style.setProperty('--progreso', '0');
      mensajeEstado.textContent = 'La IA detectó lluvia y cerró automáticamente el techo.';
    }
    else if (humedad > 50) {
      textoIa.textContent = 'Humedad elevada detectada. Activar secado.';
      mensajeEstado.textContent = 'La IA recomienda aumentar el secado.';
      valorProgreso.textContent = '45%';
      anilloProgreso.style.setProperty('--progreso', '45');
    }
    else if (temperatura > 28) {
      textoIa.textContent = 'Condiciones ideales para el secado del café.';
      mensajeEstado.textContent = 'La IA recomienda mantener el techo abierto.';
      valorProgreso.textContent = '75%';
      anilloProgreso.style.setProperty('--progreso', '75');
    }
    else {
      textoIa.textContent = 'Condiciones normales de operación.';
      mensajeEstado.textContent = 'La IA no detectó riesgos para el secado.';
      valorProgreso.textContent = '60%';
      anilloProgreso.style.setProperty('--progreso', '60');
    }
  }

  // control del techo //
  btnAbrirTecho.addEventListener('click', () => {
    estadoTecho.textContent = 'Abierto';
    valorProgreso.textContent = '100%';
    anilloProgreso.style.setProperty('--progreso', '100');
    mensajeEstado.textContent = 'El techo se ha abierto por completo para aprovechar el sol.';
    mostrarAviso('Techo abierto exitosamente');
  });

  btnCerrarTecho.addEventListener('click', () => {
    estadoTecho.textContent = 'Cerrado';
    valorProgreso.textContent = '0%';
    anilloProgreso.style.setProperty('--progreso', '0');
    mensajeEstado.textContent = 'Techo cerrado para proteger el café de la humedad o lluvia.';
    mostrarAviso('Techo cerrado para protección');
  });
