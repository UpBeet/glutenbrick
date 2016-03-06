import THREE from 'three';

// Three js constants
let context = {};
let camera = {};
let renderer = {};
let scene = {};
const mesh = {};

const gameObjects = {
  disk: {},
  pOne: {},
  pTwo: {},
};

const torusGeo = new THREE.TorusGeometry(100, 4, 8, 8);
const sphereGeo = new THREE.SphereGeometry(100, 10, 10);
const basicMat = new THREE.MeshBasicMaterial({ color: 0x540D6E });

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

export const openHand = player => {
  if (!gameObjects[player].open) {
    gameObjects[player].open = true;
  }
};

export const closeHand = player => {
  if (gameObjects[player].open) {
    gameObjects[player].open = false;
  }
};

export const updatePlayerTransform = (player, rotMat, handPos) => {
  const data = {
    rotation: rotMat,
    position: handPos,
  };
};

const updateGameObj = (key) => {
  const current = gameObjects[key];
};

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

const buildPlayer = (key) => {
  const current = gameObjects[key];
  current.mesh = new THREE.Mesh(torusGeo, basicMat);
  current.position = { x: 100, y: 0, z: 0 };
  scene.add(current.mesh);
  current.mesh.translateX(current.position.x);
};

export const init = () => {
  // get dom context
  context = document.querySelector('#renderer');

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 400;

  scene = new THREE.Scene();
  gameObjects.disk = new THREE.Mesh(sphereGeo, basicMat);
  scene.add(mesh);


  // Renderer init
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  context.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
  animate();
};

export default {
  init,
};
