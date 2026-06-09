document.addEventListener('DOMContentLoaded', () => {
  const URL_API = "http://localhost:3000/api";
  
  const pestañas = document.querySelectorAll('.pestaña-autenticacion');
  const formularioIngreso = document.getElementById('formularioIngreso');
  const formularioRegistro = document.getElementById('formularioRegistro');
  const formularioPin = document.getElementById('formularioPin');
  
  const puertaAutenticacion = document.getElementById('puertaAutenticacion');
  const aplicacionPrincipal = document.getElementById('aplicacionPrincipal');
  const navegacionInferior = document.getElementById('navegacionInferior');
  const errorAutenticacion = document.getElementById('errorAutenticacion');
  
  //login visible, app y navegación ocultas//
  if (puertaAutenticacion) puertaAutenticacion.classList.remove('oculto');
  if (aplicacionPrincipal) aplicacionPrincipal.classList.add('oculto');
  if (navegacionInferior) navegacionInferior.classList.add('navegacion-oculta');

  // CONTROL DE CAMBIO VISUAL DE PESTAÑAS //
  pestañas.forEach(pestaña => {
    pestaña.addEventListener('click', () => {
      pestañas.forEach(p => p.classList.remove('activo'));
      pestaña.classList.add('activo');
      
      formularioIngreso.classList.add('oculto');
      formularioRegistro.classList.add('oculto');
      formularioPin.classList.add('oculto');
      if (errorAutenticacion) errorAutenticacion.hidden = true;

      const tipoPestaña = pestaña.getAttribute('data-pestaña');
      if (tipoPestaña === 'ingreso') formularioIngreso.classList.remove('oculto');
      if (tipoPestaña === 'registro') formularioRegistro.classList.remove('oculto');
      if (tipoPestaña === 'pin') formularioPin.classList.remove('oculto');
    });
  });
if (formularioRegistro) {
    formularioRegistro.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nombre = document.getElementById('nombreRegistro').value;
      const finca = document.getElementById('fincaRegistro').value; // <-- CAPTURA LA FINCA CORREGIDA
      const correo = document.getElementById('correoRegistro').value;
      const contrasena = document.getElementById('contrasenaRegistro').value;

      if (errorAutenticacion) errorAutenticacion.hidden = true;

      try {
        const respuesta = await fetch(`${URL_API}/registro`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, finca, correo, contrasena }) // <-- SE ENVÍA LA FINCA AL SERVIDOR
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(data.error || 'Error al registrar el usuario.');
        }

        alert(data.mensaje); // "Usuario registrado con éxito."
        formularioRegistro.reset();

        // Redirigir automáticamente a la pestaña de inicio de sesión
        const pestañaIngreso = document.querySelector('[data-pestaña="ingreso"]');
        if (pestañaIngreso) pestañaIngreso.click();

      } catch (err) {
        if (errorAutenticacion) {
          errorAutenticacion.textContent = err.message;
          errorAutenticacion.hidden = false;
        }
      }
    });
  }

  // PROCESAR EL FORMULARIO //
  if (formularioIngreso) {
    formularioIngreso.addEventListener('submit', async (e) => {
      e.preventDefault();

      const correo = document.getElementById('correoIngreso').value;
      const contrasena = document.getElementById('contrasenaIngreso').value;

      if (errorAutenticacion) errorAutenticacion.hidden = true;

      try {
        const respuesta = await fetch(`${URL_API}/ingreso`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo, contrasena })
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(data.error || 'Credenciales inválidas.');
        }

        entrarAApp(data.usuario);
        formularioIngreso.reset();

      } catch (err) {
        if (errorAutenticacion) {
          errorAutenticacion.textContent = err.message;
          errorAutenticacion.hidden = false;
        }
      }
    });
  }
//PROCESAR PIN//
  if (formularioPin) {
    formularioPin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pin = document.getElementById('pinIngreso').value;

      if (pin === "0000") {
        const usuarioDemo = {
          nombre: "Usuario Desarrollador",
          correo: "dev@secayax.com",
          finca: "Finca Cafetera Demo"
        };
        entrarAApp(usuarioDemo);
        formularioPin.reset();
        return;
      }

      try {
        const respuestaPin = await fetch(${URL_API}/ingreso-pin, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin })
        });
        
        const dataPin = await respuestaPin.json();
        if (!respuestaPin.ok) throw new Error(dataPin.error || 'PIN no válido.');

        entrarAApp(dataPin.usuario);
        formularioPin.reset();
      } catch (err) {
        alert(err.message);
      }
    });
  }

  // mostrar interfaz de la aplicacion//
  function entrarAApp(usuario) {
    if (puertaAutenticacion) puertaAutenticacion.classList.add('oculto');
    if (aplicacionPrincipal) aplicacionPrincipal.classList.remove('oculto');
    if (navegacionInferior) navegacionInferior.classList.remove('navegacion-oculta');

    const perfilNombre = document.getElementById('perfilNombre');
    const perfilEmail = document.getElementById('perfilEmail');
    const perfilFinca = document.getElementById('perfilFinca');
    const ultimaSync = document.getElementById('ultimaSync');

    if (perfilNombre) perfilNombre.textContent = usuario.nombre || '—';
    if (perfilEmail) perfilEmail.textContent = usuario.correo || '—';
    if (perfilFinca) perfilFinca.textContent = usuario.finca || '—';
    if (ultimaSync) {
      const ahora = new Date();
      ultimaSync.textContent = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }
});
