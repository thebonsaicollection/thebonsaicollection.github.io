import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.157.0/examples/jsm/controls/PointerLockControls.js';

class Gallery {
  constructor() {
    this.initialize();
    this.setupScene();
    this.setupLights();
    this.setupControls();
    this.loadNFTs();
    this.animate();
    this.selectedNFT = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.setupInteraction();
  }

  initialize() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#gallery-canvas'),
      antialias: true
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Posición inicial de la cámara
    this.camera.position.set(0, 1.7, 15);

    // Variables de movimiento
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.movementSpeed = 150; // Velocidad reducida

    window.addEventListener('resize', () => this.onWindowResize());
  }

  setupScene() {
    // Color de fondo espacial
    this.scene.background = new THREE.Color(0x000033);
    this.scene.fog = new THREE.FogExp2(0x000033, 0.01);

    // Suelo de la isla con textura de hierba
    const textureLoader = new THREE.TextureLoader();
    const floorTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/terrain/grasslight-big.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(4, 4);
    
    const floorGeometry = new THREE.CircleGeometry(30, 32);
    const floorMaterial = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.8,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Crear la arquitectura
    this.createArchitecture();
    
    // Crear el árbol central
    this.createCentralTree();
  }

  createCentralTree() {
    // Tronco
    const trunkGeometry = new THREE.CylinderGeometry(1, 1.5, 8, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x4A2F10,
      roughness: 0.9,
      metalness: 0.1
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(0, 4, 0);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    this.scene.add(trunk);

    // Copa del árbol
    const leavesGeometry = new THREE.ConeGeometry(5, 10, 8);
    const leavesMaterial = new THREE.MeshStandardMaterial({
      color: 0x2D5A27,
      roughness: 0.8,
      metalness: 0.2
    });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.set(0, 10, 0);
    leaves.castShadow = true;
    leaves.receiveShadow = true;
    this.scene.add(leaves);
  }

  createArchitecture() {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xE8DCC4,
      roughness: 0.8,
      metalness: 0.2,
      transparent: true,
      opacity: 0.9
    });

    // Crear las habitaciones en forma circular
    this.createRoom(-15, 0, -15, 10, 15, 10); // Sala 1
    this.createRoom(15, 0, -15, 10, 15, 10);  // Sala 2
    this.createRoom(0, 0, 15, 10, 15, 10);    // Sala 3

    // Crear pasillos curvos
    this.createCurvedHallway(0, 0, -15, 5, 15, 30); // Pasillo central
    this.createCurvedHallway(-15, 0, 0, 30, 15, 5); // Pasillo horizontal
  }

  createCurvedHallway(x, y, z, width, height, depth) {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xE8DCC4,
      roughness: 0.8,
      metalness: 0.2,
      transparent: true,
      opacity: 0.9
    });

    // Paredes curvas del pasillo
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x - width/2, y + height/2, z),
      new THREE.Vector3(x, y + height/2, z + depth/2),
      new THREE.Vector3(x + width/2, y + height/2, z + depth)
    ]);

    const geometry = new THREE.TubeGeometry(curve, 20, 0.5, 8, false);
    const mesh = new THREE.Mesh(geometry, wallMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
  }

  createRoom(x, y, z, width, height, depth) {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xE8DCC4,
      roughness: 0.8,
      metalness: 0.2
    });

    // Paredes
    const walls = [
      { pos: [x, y + height/2, z], size: [width, height, 1] }, // Pared trasera
      { pos: [x, y + height/2, z + depth], size: [width, height, 1] }, // Pared frontal
      { pos: [x - width/2, y + height/2, z + depth/2], size: [1, height, depth] }, // Pared izquierda
      { pos: [x + width/2, y + height/2, z + depth/2], size: [1, height, depth] }  // Pared derecha
    ];

    walls.forEach(wall => {
      const geometry = new THREE.BoxGeometry(...wall.size);
      const mesh = new THREE.Mesh(geometry, wallMaterial);
      mesh.position.set(...wall.pos);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    });

    // Techo
    const ceilingGeometry = new THREE.BoxGeometry(width, 1, depth);
    const ceiling = new THREE.Mesh(ceilingGeometry, wallMaterial);
    ceiling.position.set(x, y + height, z + depth/2);
    ceiling.castShadow = true;
    ceiling.receiveShadow = true;
    this.scene.add(ceiling);

    // Columnas en las esquinas
    const columnPositions = [
      [x - width/3, y, z - depth/3],
      [x + width/3, y, z - depth/3],
      [x - width/3, y, z + depth/3],
      [x + width/3, y, z + depth/3]
    ];

    columnPositions.forEach(pos => {
      this.createColumn(pos[0], pos[1], pos[2]);
    });
  }

  createColumn(x, y, z) {
    const columnMaterial = new THREE.MeshStandardMaterial({
      color: 0xDCDCDC,
      roughness: 0.3,
      metalness: 0.7
    });

    // Base
    const baseGeometry = new THREE.CylinderGeometry(0.8, 0.8, 1, 16);
    const base = new THREE.Mesh(baseGeometry, columnMaterial);
    base.position.set(x, y + 0.5, z);
    base.castShadow = true;
    base.receiveShadow = true;
    this.scene.add(base);

    // Fuste
    const shaftGeometry = new THREE.CylinderGeometry(0.6, 0.6, 15, 16);
    const shaft = new THREE.Mesh(shaftGeometry, columnMaterial);
    shaft.position.set(x, y + 8, z);
    shaft.castShadow = true;
    shaft.receiveShadow = true;
    this.scene.add(shaft);

    // Capitel
    const capitalGeometry = new THREE.CylinderGeometry(0.8, 0.6, 1, 16);
    const capital = new THREE.Mesh(capitalGeometry, columnMaterial);
    capital.position.set(x, y + 15.5, z);
    capital.castShadow = true;
    capital.receiveShadow = true;
    this.scene.add(capital);
  }

  setupLights() {
    // Luz ambiental
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambient);

    // Luz principal
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(0, 50, 50);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 500;
    this.scene.add(mainLight);

    // Luces de acento
    const spotLights = [
      { pos: [-15, 10, -10], color: 0xFFE5B4 },
      { pos: [15, 10, -10], color: 0xFFE5B4 },
      { pos: [0, 15, 0], color: 0xFFE5B4 }
    ];

    spotLights.forEach(light => {
      const spotLight = new THREE.SpotLight(light.color, 0.5);
      spotLight.position.set(...light.pos);
      spotLight.angle = Math.PI / 6;
      spotLight.penumbra = 0.5;
      spotLight.decay = 2;
      spotLight.distance = 30;
      spotLight.castShadow = true;
      this.scene.add(spotLight);
    });
  }

  setupControls() {
    this.controls = new PointerLockControls(this.camera, document.body);

    const startButton = document.getElementById('start-experience');
    startButton.addEventListener('click', () => {
      this.controls.lock();
    });

    this.controls.addEventListener('lock', () => {
      document.getElementById('controls-info').style.display = 'none';
    });

    this.controls.addEventListener('unlock', () => {
      document.getElementById('controls-info').style.display = 'block';
    });

    document.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          this.moveForward = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          this.moveBackward = true;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          this.moveLeft = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.moveRight = true;
          break;
      }
    });

    document.addEventListener('keyup', (event) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          this.moveForward = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          this.moveBackward = false;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          this.moveLeft = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.moveRight = false;
          break;
      }
    });
  }

  async loadNFTs() {
    // Posiciones de NFTs en forma circular alrededor del árbol
    const nftPositions = [
      // Sala 1 (izquierda)
      [-20, 1.7, -20], [-15, 1.7, -20], [-10, 1.7, -20],
      [-20, 1.7, -15], [-15, 1.7, -15], [-10, 1.7, -15],
      [-20, 1.7, -10], [-15, 1.7, -10], [-10, 1.7, -10],

      // Sala 2 (derecha)
      [10, 1.7, -20], [15, 1.7, -20], [20, 1.7, -20],
      [10, 1.7, -15], [15, 1.7, -15], [20, 1.7, -15],
      [10, 1.7, -10], [15, 1.7, -10], [20, 1.7, -10],

      // Sala 3 (frontal)
      [-10, 1.7, 10], [-5, 1.7, 10], [0, 1.7, 10],
      [-10, 1.7, 15], [-5, 1.7, 15], [0, 1.7, 15],
      [-10, 1.7, 20], [-5, 1.7, 20], [0, 1.7, 20]
    ];

    nftPositions.forEach((position, index) => {
      this.createNFTFrame(position, index);
    });

    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      document.getElementById('controls-info').style.display = 'block';
    }, 1000);
  }

  createNFTFrame(position, index) {
    const frameGeometry = new THREE.BoxGeometry(2, 3, 0.1);
    const frameMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x4A4A4A,
      metalness: 0.8,
      roughness: 0.2
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(...position);
    frame.castShadow = true;
    frame.receiveShadow = true;
    frame.userData.isNFTFrame = true;
    frame.userData.nftId = index;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(`https://picsum.photos/seed/${index}/800/800`, (texture) => {
      const imageGeometry = new THREE.PlaneGeometry(1.8, 1.8);
      const imageMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
      });
      const image = new THREE.Mesh(imageGeometry, imageMaterial);
      image.position.z = 0.06;
      frame.add(image);
    });

    this.scene.add(frame);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.controls.isLocked) {
      const delta = 0.016; // Aproximadamente 60 FPS

      this.velocity.x -= this.velocity.x * 5.0 * delta;
      this.velocity.z -= this.velocity.z * 5.0 * delta;

      this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
      this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
      this.direction.normalize();

      if (this.moveForward || this.moveBackward) {
        this.velocity.z -= this.direction.z * this.movementSpeed * delta;
      }
      if (this.moveLeft || this.moveRight) {
        this.velocity.x -= this.direction.x * this.movementSpeed * delta;
      }

      this.controls.moveRight(-this.velocity.x * delta);
      this.controls.moveForward(-this.velocity.z * delta);
    }

    this.renderer.render(this.scene, this.camera);
  }

  setupInteraction() {
    const interactionButtons = document.querySelector('.nft-interaction-buttons');
    
    // Evento para el clic en el canvas
    window.addEventListener('click', (event) => {
      if (!this.controls.isLocked) return;

      // Calcular posición del mouse en coordenadas normalizadas (-1 a +1)
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Actualizar el raycaster
      this.raycaster.setFromCamera(this.mouse, this.camera);

      // Detectar intersecciones con los marcos de NFT
      const intersects = this.raycaster.intersectObjects(this.scene.children, true);
      
      const nftFrame = intersects.find(intersect => 
        intersect.object.parent && 
        intersect.object.parent.userData.isNFTFrame
      );

      if (nftFrame) {
        this.selectedNFT = nftFrame.object.parent;
        interactionButtons.classList.add('visible');
      } else {
        this.selectedNFT = null;
        interactionButtons.classList.remove('visible');
      }
    });

    // Eventos para los botones de interacción
    document.getElementById('view-nft').addEventListener('click', () => {
      if (this.selectedNFT) {
        this.showNFTDetails(this.selectedNFT);
      }
    });

    document.getElementById('buy-nft').addEventListener('click', () => {
      if (this.selectedNFT) {
        this.handleBuyNFT(this.selectedNFT);
      }
    });

    document.getElementById('rent-space').addEventListener('click', () => {
      if (this.selectedNFT) {
        this.handleRentSpace(this.selectedNFT);
      }
    });
  }

  showNFTDetails(nftFrame) {
    const nftId = nftFrame.userData.nftId;
    // Aquí puedes implementar la lógica para mostrar los detalles del NFT
    console.log(`Mostrando detalles del NFT ${nftId}`);
    // Por ejemplo, abrir un modal con la información
  }

  handleBuyNFT(nftFrame) {
    const nftId = nftFrame.userData.nftId;
    // Aquí puedes implementar la lógica para comprar el NFT
    console.log(`Iniciando proceso de compra del NFT ${nftId}`);
  }

  handleRentSpace(nftFrame) {
    const nftId = nftFrame.userData.nftId;
    // Aquí puedes implementar la lógica para alquilar el espacio
    console.log(`Iniciando proceso de alquiler del espacio ${nftId}`);
  }
}

// Iniciar la galería
window.addEventListener('load', () => {
  new Gallery();
}); 