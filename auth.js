document.addEventListener('DOMContentLoaded', () => {
  const URL_API = "http://localhost:3000/api";
  
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
