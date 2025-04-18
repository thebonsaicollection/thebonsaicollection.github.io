// Detectar cuando el iframe ha sido cargado
window.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('spline-scene');
  
    iframe.addEventListener('load', () => {
      console.log('Escena de Spline cargada correctamente en el iframe.');
      // Podés agregar lógica adicional acá si querés interactuar con el iframe o mostrar algo
    });
  });
  