const sun = document.querySelector('.sun');
const innerPlanets = document.querySelectorAll('.planet');
const outerPlanets = document.querySelectorAll('.outer-planet');

const numberOfInnerPlanets = 12;
const numberOfOuterPlanets = 36;

function calculatePosition(angle, radius) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const relativeRadius = radius * Math.min(window.innerWidth, window.innerHeight) / 1000;

    const x = centerX + (relativeRadius * Math.cos(angle));
    const y = centerY + (relativeRadius * Math.sin(angle));

    return { x, y };
}

function animateInnerPlanets() {
    const innerRadius = 0.3 * Math.min(window.innerWidth, window.innerHeight);
    const innerAngularIncrement = (2 * Math.PI) / numberOfInnerPlanets;
    const innerAngularSpeed = 0.01 * Math.min(window.innerWidth, window.innerHeight) / 1000;

    let angle = innerAngularSpeed * (performance.now() * 0.005);

    for (let i = 0; i < numberOfInnerPlanets; i++) {
        const { x, y } = calculatePosition(angle, innerRadius);

        innerPlanets[i].style.left = x + 'px';
        innerPlanets[i].style.top = y + 'px';

        angle += innerAngularIncrement;
    }
}

function animateOuterPlanets() {
    const outerRadius = 0.55 * Math.min(window.innerWidth, window.innerHeight);
    const outerAngularIncrement = (2 * Math.PI) / numberOfOuterPlanets;
    const outerAngularSpeed = 0.01 * Math.min(window.innerWidth, window.innerHeight) / 1000;

    let angle = outerAngularSpeed * (performance.now() * 0.005);

    for (let i = 0; i < numberOfOuterPlanets; i++) {
        const { x, y } = calculatePosition(angle, outerRadius);

        outerPlanets[i].style.left = x + 'px';
        outerPlanets[i].style.top = y + 'px';

        angle += outerAngularIncrement;
    }
}

function animate() {
    animateInnerPlanets();
    animateOuterPlanets();
    requestAnimationFrame(animate);
}

animate();


function showPopup(landName) {
            const popupTitle = document.getElementById('popup-title');
            const popupDescription = document.getElementById('popup-description');
            const popup = document.getElementById('popup');

            popupTitle.textContent = landName;
            popupDescription.textContent = `Discover more detailed information about ${landName} on the specific island panel.`;

            popup.style.display = 'block';
        }

        function hidePopup() {
            const popup = document.getElementById('popup');
            popup.style.display = 'none';

}

function viewDetails() {
    const popupTitle = document.getElementById('popup-title');
    const landName = popupTitle.textContent;

    const detailsPage = 'detalles_land.html';

    window.location.href = `${detailsPage}?Land=${encodeURIComponent(landName)}`;
}

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
      enable: false,
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false,
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