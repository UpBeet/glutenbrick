import THREE from 'three';
import Pepper from '../lib/pepper';

// Three js constants
let context = {};
let camera = {};
let renderer;
let scene;
let effect;
let ghost;

const mesh = {};

const gameObjects = {
  disk: {},
  pOne: {},
  pTwo: {},
};

const torusGeo = new THREE.TorusGeometry(90, 40, 8, 8);
const sphereGeo = new THREE.SphereGeometry(100, 10, 10);
const basicMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  effect.setSize(window.innerWidth, window.innerHeight);
};

export const openHand = player => {
  if (!gameObjects[player].open) {
    gameObjects[player].open = true;
    gameObjects[player].mesh.scale.set(1, 1, 1);
  }
};

export const closeHand = player => {
  if (gameObjects[player].open) {
    gameObjects[player].open = false;
    gameObjects[player].mesh.scale.set(0.4, 0.4, 0.4);
  }
};

export const updatePlayerTransform = (player, roll, yaw, pitch, handPos) => {
  const current = gameObjects[player];
  current.mesh.rotation.set(pitch, -yaw, roll);
  current.mesh.position.setX(handPos.x * 250);
  current.mesh.position.setY(handPos.y * 200 - 100);
};

const updateGameObj = (key) => {
  const current = gameObjects[key];
};

const animate = () => {
  requestAnimationFrame(animate);
  effect.render(scene, camera);
};

const buildPlayer = (key) => {
  const current = gameObjects[key];
  current.mesh = new THREE.Mesh(torusGeo, basicMat);
  current.position = { x: 100, y: 0, z: 0 };
  scene.add(current.mesh);
  current.mesh.translateX(current.position.x);
  current.mesh.translateY(current.position.y);
  current.mesh.translateZ(current.position.z);
};

export const init = () => {
  // get dom context
  context = document.querySelector('#renderer');

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  // camera.position.z = 400;

  scene = new THREE.Scene();

  buildPlayer('pOne');

  // Renderer init
  renderer = new THREE.WebGLRenderer();
  context.appendChild(renderer.domElement);

  ghost = new THREE.PeppersGhostEffect(renderer);
  effect = ghost;
  effect.setSize(window.innerWidth, window.innerHeight);
  effect.cameraDistance = 800;

  window.addEventListener('resize', onWindowResize, false);
  animate();
};

export default {
  init,
};
