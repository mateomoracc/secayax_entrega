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
