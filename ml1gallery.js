const apiKey = '2660fc95c33d40beb4270562c3e433be';
const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/400x600/000033/ffffff?text=NFT';
const API_ENDPOINT = 'https://api.opensea.io/api/v1';
const LOADING_DELAY = 2000;

const options = {
  method: 'GET',
  headers: {
    'X-API-KEY': apiKey,
    'Accept': 'application/json'
  }
};

// Efectos 3D y parallax
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX - windowHalfX);
  mouseY = (event.clientY - windowHalfY);
  
  requestAnimationFrame(updateGalleryPerspective);
});

function updateGalleryPerspective() {
  const rooms = document.querySelectorAll('.gallery-room');
  const rotationX = (mouseY / windowHalfY) * 5;
  const rotationY = (mouseX / windowHalfX) * 5;

  rooms.forEach((room, index) => {
    const depth = index * 0.2;
    room.style.transform = `
      perspective(1000px)
      rotateX(${-rotationX}deg)
      rotateY(${rotationY}deg)
      translateZ(${depth}px)
    `;
  });
}

// Manejo de detalles NFT
function showNFTDetails(collection) {
  const overlay = document.querySelector('.overlay');
  const nftDetails = document.getElementById('nft-details');
  
  document.getElementById('nft-info').textContent = `Nombre del NFT: ${collection.name}`;
  document.getElementById('nft-description').textContent = `Descripción: ${collection.description || 'No disponible'}`;
  document.getElementById('nft-volume').textContent = `Volumen: ${collection.stats?.total_volume || 'No disponible'}`;
  document.getElementById('nft-image').src = collection.image_url || 'default-image-url.jpg';
  
  overlay.classList.add('active');
  nftDetails.classList.add('active');
  
  // Efecto de parallax en la imagen
  const nftImage = document.getElementById('nft-image');
  nftImage.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = nftImage.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    nftImage.style.transform = `
      perspective(1000px)
      rotateY(${(x - 0.5) * 10}deg)
      rotateX(${(y - 0.5) * -10}deg)
      scale(1.05)
    `;
  });
  
  nftImage.addEventListener('mouseleave', () => {
    nftImage.style.transform = 'none';
  });
}

function hideNFTDetails() {
  const overlay = document.querySelector('.overlay');
  const nftDetails = document.getElementById('nft-details');
  
  overlay.classList.remove('active');
  nftDetails.classList.remove('active');
}

function createCollectionElement(collection, index, isHighValue = false) {
  const item = document.createElement('div');
  item.classList.add('top-volume-item');
  if (isHighValue) item.classList.add('high-value');
  
  const totalVolume = collection.stats?.total_volume ?? 'No disponible';
  let creatorProfileURL = collection.creator?.address ? `https://opensea.io/${collection.creator.address}` : null;

  item.innerHTML = `
    <div class="nft-card">
      <div class="nft-image">
        <img src="${collection.image_url || DEFAULT_IMAGE_URL}" alt="${collection.name}" onerror="this.src='${DEFAULT_IMAGE_URL}'">
      </div>
      <div class="nft-info">
        <h3>${index + 1}. ${collection.name}</h3>
        <p>Volumen 24h: ${totalVolume}</p>
        <p>NFTs: ${collection.nft_count}</p>
      </div>
      <div class="nft-actions">
        <button class="rental-button" onclick="comprarNFT('${creatorProfileURL}', '${collection.name}')">
          Comprar NFT
        </button>
      </div>
    </div>
  `;

  item.addEventListener('click', () => showNFTDetails(collection));
  return item;
}

// Función que maneja la redirección al perfil del creador o a la búsqueda en OpenSea
function comprarNFT(creatorProfileURL, collectionName) {
  if (creatorProfileURL && creatorProfileURL !== 'null' && creatorProfileURL !== 'undefined') {
    window.open(creatorProfileURL, '_blank'); // Redirigir al perfil del creador
  } else {
    console.warn(`No se encontró perfil del creador para ${collectionName}. Redirigiendo a la búsqueda en OpenSea...`);
    const searchURL = `https://opensea.io/assets?search[query]=${encodeURIComponent(collectionName)}`;
    window.open(searchURL, '_blank');
  }
}

const slotsState = Array(9).fill({ nft: null, endTime: null, userId: null });

function checkSlotsExpiration() {
  const now = Date.now();
  slotsState.forEach((slot, index) => {
    if (slot.endTime && now > slot.endTime) {
      slotsState[index] = { nft: null, endTime: null, userId: null };
      updateSlot(index);
    }
  });
}

function updateSlot(slotIndex) {
  const slot = document.querySelector(`#slot-${slotIndex}`);
  const slotState = slotsState[slotIndex];

  slot.innerHTML = slotState.nft
    ? `<h3>${slotState.nft.name}</h3>
       <img src="${slotState.nft.image_url}" alt="NFT">
       <p>Volumen: ${slotState.nft.stats.total_volume}</p>`
    : 'Disponible para alquilar';
}

async function rentSlot(slotIndex, userId) {
  const nftData = await fetchTopVolumeNFTs();
  if (!nftData?.collections) {
    alert('No se pudo obtener NFT para mostrar.');
    return;
  }

  slotsState[slotIndex] = {
    nft: nftData.collections[0],
    userId,
    endTime: Date.now() + 30 * 60 * 1000
  };

  updateSlot(slotIndex);
}

function alquilarEspacio() {
  alert('Función de alquiler no implementada aún.');
}

async function displayTopVolumeNFTs() {
  const container = document.querySelector('.top-volume-container');
  if (!container) return console.error('No se encontró el contenedor .top-volume-container');

  container.innerHTML = '<div class="loading">Cargando<span>.</span><span>.</span><span>.</span></div>';

  const topVolumeData = await fetchTopVolumeNFTs();
  if (!topVolumeData?.collections) {
    container.innerHTML = '<p class="error-message">No se pudieron obtener las colecciones de OpenSea.</p>';
    return;
  }

  const salons = [
    document.querySelectorAll('#room-1 .slot'),
    document.querySelectorAll('#room-2 .slot'),
    document.querySelectorAll('#room-3 .slot')
  ];

  let nftIndex = 0;
  salons.flat().forEach(slot => {
    slot.innerHTML = '<div class="loading-slot">Cargando<span>.</span><span>.</span><span>.</span></div>';
  });

  // Añadir animación de entrada escalonada
  topVolumeData.collections.forEach((collection, index) => {
    const isHighValue = collection.stats?.total_volume > 10000;
    const collectionElement = createCollectionElement(collection, index, isHighValue);

    if (nftIndex < 9) {
      const [salonIndex, slotIndex] = [Math.floor(nftIndex / 3), nftIndex % 3];
      const slot = salons[salonIndex][slotIndex];
      
      // Agregar delay a la animación basado en el índice
      setTimeout(() => {
        slot.innerHTML = '';
        slot.appendChild(collectionElement);
        slot.style.animation = `fadeIn 0.6s ease-out ${index * 0.1}s forwards`;
      }, index * 100);
    }

    nftIndex++;
  });
}

async function fetchTopVolumeNFTs() {
  try {
    console.log('Iniciando fetchTopVolumeNFTs...');
    const response = await fetch('https://api.opensea.io/api/v2/collections?limit=9', {
      method: 'GET',
      headers: {
        'X-API-KEY': apiKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Datos recibidos de OpenSea:', data);
    return data;
  } catch (error) {
    console.error('Error al obtener NFTs:', error);
    // Usar datos de prueba en caso de error
    return {
      collections: Array(9).fill(null).map((_, index) => ({
        name: `NFT de Prueba ${index + 1}`,
        description: 'Este es un NFT de prueba para demostración',
        image_url: `https://picsum.photos/seed/${index}/800/800`,
        stats: {
          total_volume: Math.floor(Math.random() * 10000),
          floor_price: (Math.random() * 2).toFixed(3)
        },
        nft_count: Math.floor(Math.random() * 1000),
        creator: {
          address: '0x' + Math.random().toString(16).slice(2, 42)
        }
      }))
    };
  }
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  // Crear overlay para los detalles del NFT
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.addEventListener('click', hideNFTDetails);
  document.body.appendChild(overlay);
  
  // Iniciar la galería
  setInterval(checkSlotsExpiration, 60000);
  displayTopVolumeNFTs();
  
  // Actualizar dimensiones de la ventana
  window.addEventListener('resize', () => {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
  });
});

// Estado global
let audioEnabled = true;
let backgroundMusic = null;
let currentQuality = 'high';

// Clase principal para manejar la galería
class GalleryManager {
  constructor() {
    this.initialize();
    this.setupEventListeners();
    this.loadTopVolume();
  }

  initialize() {
    // Inicializar audio
    this.initializeAudio();
    
    // Inicializar controles
    this.initializeControls();
    
    // Mostrar pantalla de carga
    this.showLoadingScreen();
  }

  initializeAudio() {
    backgroundMusic = new Audio('assets/audio/ambient.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.8;

    const volumeSlider = document.querySelector('.volume-slider');
    const audioToggle = document.getElementById('toggle-audio');

    volumeSlider.addEventListener('input', (e) => {
      const volume = e.target.value / 100;
      if (backgroundMusic) {
        backgroundMusic.volume = volume;
      }
    });

    audioToggle.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      const icon = audioToggle.querySelector('i');
      
      if (audioEnabled) {
        icon.className = 'fas fa-volume-up';
        backgroundMusic?.play();
      } else {
        icon.className = 'fas fa-volume-mute';
        backgroundMusic?.pause();
      }
    });
  }

  initializeControls() {
    const qualitySelect = document.getElementById('quality-settings');
    qualitySelect.addEventListener('change', (e) => {
      currentQuality = e.target.value;
      this.updateQualitySettings();
    });
  }

  updateQualitySettings() {
    const canvas = document.getElementById('gallery-canvas');
    switch (currentQuality) {
      case 'low':
        canvas.style.imageRendering = 'pixelated';
        break;
      case 'medium':
        canvas.style.imageRendering = 'auto';
        break;
      case 'high':
        canvas.style.imageRendering = 'crisp-edges';
        break;
    }
  }

  showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = loadingScreen.querySelector('.loading-progress');
    let progress = 0;

    const updateProgress = () => {
      progress += 1;
      progressBar.style.width = `${progress}%`;
      
      if (progress < 100) {
        setTimeout(updateProgress, LOADING_DELAY / 100);
      } else {
        setTimeout(() => {
          loadingScreen.style.opacity = '0';
          setTimeout(() => {
            loadingScreen.style.display = 'none';
          }, 500);
        }, 500);
      }
    };

    updateProgress();
  }

  setupEventListeners() {
    // Eventos para NFTs
    document.querySelectorAll('.slot').forEach(slot => {
      slot.addEventListener('click', () => this.showNFTDetails(slot.dataset.nftId));
    });

    // Evento para cerrar modal
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
      closeModal.addEventListener('click', () => {
        document.getElementById('nft-details').classList.add('hidden');
      });
    }

    // Eventos para botones de acción
    document.getElementById('buy-nft')?.addEventListener('click', () => this.handleBuyNFT());
    document.getElementById('rent-space')?.addEventListener('click', () => this.handleRentSpace());
  }

  async loadTopVolume() {
    const container = document.querySelector('.top-volume-container');
    
    try {
      // Simular carga de NFTs populares
      const popularNFTs = await this.fetchPopularNFTs();
      this.displayPopularNFTs(popularNFTs, container);
    } catch (error) {
      console.error('Error cargando NFTs populares:', error);
      container.innerHTML = '<p class="error-message">Error al cargar NFTs populares</p>';
    }
  }

  async fetchPopularNFTs() {
    // Simulación de datos de NFTs populares
    return [
      {
        id: 1,
        name: 'NFT #1',
        price: '0.5 ETH',
        image: DEFAULT_IMAGE_URL,
        description: 'NFT popular #1'
      },
      {
        id: 2,
        name: 'NFT #2',
        price: '0.8 ETH',
        image: DEFAULT_IMAGE_URL,
        description: 'NFT popular #2'
      },
      {
        id: 3,
        name: 'NFT #3',
        price: '1.2 ETH',
        image: DEFAULT_IMAGE_URL,
        description: 'NFT popular #3'
      }
    ];
  }

  displayPopularNFTs(nfts, container) {
    container.innerHTML = nfts.map(nft => this.createNFTElement(nft)).join('');
  }

  createNFTElement(nft) {
    return `
      <div class="nft-card" data-nft-id="${nft.id}">
        <div class="nft-image">
          <img src="${nft.image}" alt="${nft.name}" loading="lazy">
        </div>
        <div class="nft-info">
          <h3>${nft.name}</h3>
          <p>${nft.price}</p>
        </div>
      </div>
    `;
  }

  async showNFTDetails(nftId) {
    const modal = document.getElementById('nft-details');
    const nft = await this.fetchNFTDetails(nftId);

    if (nft) {
      document.getElementById('nft-image').src = nft.image;
      document.getElementById('nft-title').textContent = nft.name;
      document.getElementById('nft-description').textContent = nft.description;
      document.getElementById('nft-volume').textContent = `Precio: ${nft.price}`;
      
      modal.classList.remove('hidden');
    }
  }

  async fetchNFTDetails(nftId) {
    // Simulación de obtención de detalles del NFT
    return {
      id: nftId,
      name: `NFT #${nftId}`,
      description: 'Una descripción detallada del NFT iría aquí...',
      price: '0.5 ETH',
      image: DEFAULT_IMAGE_URL
    };
  }

  handleBuyNFT() {
    // Implementar lógica de compra
    console.log('Iniciando proceso de compra...');
  }

  handleRentSpace() {
    // Implementar lógica de alquiler
    console.log('Iniciando proceso de alquiler...');
  }
}

// Inicializar la galería cuando se carga el documento
document.addEventListener('DOMContentLoaded', () => {
  new GalleryManager();
});
