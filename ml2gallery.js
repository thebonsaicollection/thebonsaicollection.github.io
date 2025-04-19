// Actualiza hora de la isla cada segundo
function updateIslandTime() {
  const now = new Date();
  const formatted = now.toLocaleTimeString('es-AR', { hour12: false });
  document.getElementById('island-time').textContent = 'Hora de la isla: ' + formatted;
}

// Valores iniciales simulados
let islandStats = {
  energia: 87,
  agua: 65,
  oxigeno: 91,
  tbc: 4520
};

// Función para simular cambios aleatorios suaves
function varyStat(statName, minChange, maxChange, minValue = 0, maxValue = 10000) {
  const change = Math.floor(Math.random() * (maxChange - minChange + 1)) + minChange;
  const direction = Math.random() > 0.5 ? 1 : -1;
  islandStats[statName] += direction * change;
  islandStats[statName] = Math.max(minValue, Math.min(islandStats[statName], maxValue));
}

// Refrescar visualización de estadísticas
function updateStatsUI() {
  document.querySelector("#stats span:nth-child(1) strong").textContent = islandStats.energia + "%";
  document.querySelector("#stats span:nth-child(2) strong").textContent = islandStats.agua + "%";
  document.querySelector("#stats span:nth-child(3) strong").textContent = islandStats.oxigeno + "%";
  document.querySelector("#stats span:nth-child(4) strong").textContent = islandStats.tbc.toLocaleString();
}

// Cambiar stats cada 5 a 7 segundos
function startRandomVariation() {
  setInterval(() => {
    varyStat("energia", 1, 4, 0, 100);
    varyStat("agua", 1, 3, 0, 100);
    varyStat("oxigeno", 1, 2, 0, 100);
    varyStat("tbc", 10, 50, 0, 999999);
    updateStatsUI();
  }, Math.floor(Math.random() * 2000) + 5000); // entre 5 y 7 segundos
}

window.addEventListener('DOMContentLoaded', () => {
  const iframe = document.getElementById('spline-scene');

  iframe.addEventListener('load', () => {
    console.log('Escena de Spline cargada correctamente.');
  });

  updateIslandTime();
  setInterval(updateIslandTime, 1000);

  updateStatsUI();
  startRandomVariation();
});
