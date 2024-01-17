const sun = document.querySelector('.sun');
const innerPlanets = document.querySelectorAll('.planet');
const outerPlanets = document.querySelectorAll('.outer-planet');

const numberOfInnerPlanets = 12; // Especificamos que hay 12 planetas internos
const numberOfOuterPlanets = 36;

const innerRadius = 220;
const outerRadius = 350;

const innerAngularIncrement = (2 * Math.PI) / numberOfInnerPlanets;
const outerAngularIncrement = (2 * Math.PI) / numberOfOuterPlanets;

const innerAngularSpeed = 0.01;
const outerAngularSpeed = 0.01;

function calculatePosition(angle, radius) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const x = centerX + (radius * Math.cos(angle));
    const y = centerY + (radius * Math.sin(angle));

    return { x, y };
}

function animateInnerPlanets() {
    let angle = innerAngularSpeed * (performance.now() * 0.005);

    for (let i = 0; i < numberOfInnerPlanets; i++) {
        const { x, y } = calculatePosition(angle, innerRadius);

        innerPlanets[i].style.left = x + 'px';
        innerPlanets[i].style.top = y + 'px';

        angle += innerAngularIncrement;
    }
}

function animateOuterPlanets() {
    let angle = outerAngularSpeed * (performance.now() * 0.005);

    for (let i = 0; i < numberOfOuterPlanets; i++) {
        const { x, y } = calculatePosition(angle, outerRadius);

        outerPlanets[i].style.left = x + 'px';
        outerPlanets[i].style.top = y + 'px';

        angle += outerAngularIncrement;
    }
}

function showPopup(landName) {
            const popupTitle = document.getElementById('popup-title');
            const popupDescription = document.getElementById('popup-description');
            const popup = document.getElementById('popup');

            popupTitle.textContent = landName;
            popupDescription.textContent = `Conoce más información detallada sobre ${landName} en el panel particular de la isla`;

            popup.style.display = 'block';
        }

        function hidePopup() {
            const popup = document.getElementById('popup');
            popup.style.display = 'none';

}

function viewDetails() {
    const popupTitle = document.getElementById('popup-title');
    const landName = popupTitle.textContent;

    // Página de detalles común para todas las islas
    const detailsPage = 'detalles_land.html';

    // Redirige a la página de detalles con un parámetro de consulta para identificar la isla
    window.location.href = `${detailsPage}?isla=${encodeURIComponent(landName)}`;
}




function animate() {
    animateInnerPlanets();
    animateOuterPlanets();
    requestAnimationFrame(animate);
}

animate();

particlesJS("particles-js", {
  particles: {
    number: {
      value: 200,
      density: {
        enable: true,
        value_area: 1200,
      },
    },
    color: {
      value: "#ffffff",
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.8,
      random: true,
      anim: {
        enable: true,
        speed: 0.5,
        opacity_min: 0,
        sync: false,
      },
    },
    size: {
      value: 2,
      random: true,
    },
    line_linked: {
      enable: false, // Desactiva las líneas vinculadas
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false, // Desactiva el rebote
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "bubble",
      },
      onclick: {
        enable: true,
        mode: "push",
      },
      resize: true,
    },
    modes: {
      bubble: {
        distance: 400,
        size: 12,
        duration: 3,
        opacity: 0.8,
        speed: 1,
      },
      push: {
        particles_nb: 4,
      },
      remove: {
        particles_nb: 2,
      },
    },
  },
  retina_detect: true,
});