import THREE from 'three';
import Pepper from '../lib/pepper';

// Three js constants
let context = {};
let camera = {};
let renderer;
let scene;
let effect;
let ghost;

const gameObjects = {
  disk: {},
  pOne: {},
  pTwo: {},
};

const torusGeo = new THREE.TorusGeometry(50, 20, 8, 8);
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
  }
};

export const closeHand = player => {
  if (gameObjects[player].open) {
    gameObjects[player].open = false;
  }
};

export const updatePlayerTransform = (player, roll, yaw, pitch, handPos) => {
  const current = gameObjects[player];
  current.mesh.rotation.set(pitch, -yaw, roll);
  current.mesh.position.setX(handPos.x * 250);
  current.mesh.position.setY(handPos.y * 200 - 100);
};

const checkGrab = (player) => {
  const ball = gameObjects.disk;
  const location = player.position;
  const ballRad = ball.mesh.geometry.boundingSphere.radius;
  const handRad = player.mesh.geometry.boundingSphere.radius;
  const dX = ball.position.x - location.x;
  const dY = ball.position.y - location.y;
  const dZ = ball.position.z - location.z;

  const between = (dX * dX) + (dY * dY) + (dZ * dZ);
  if (between <= ballRad + handRad) {
    return true;
  }
  else {
    return false;
  }
};

const checkBounds = ball => {
  const range = 200;
  if (ball.position.x >= range || ball.position.x < -range) {
    ball.velocity.x *= -1;
  }
  else if (ball.position.y >= range || ball.position.y < -range) {
    ball.velocity.y *= -1;
  }
};

const ballMove = () => {
  const ball = gameObjects.disk;
  ball.mesh.translateX(ball.velocity.x);
  ball.mesh.translateY(ball.velocity.y);
  ball.position.x += ball.velocity.x;
  ball.position.y += ball.velocity.y;
  checkBounds(ball);
};

const animate = () => {
  requestAnimationFrame(animate);
  // ballMove();
  effect.render(scene, camera);
};

const buildPlayer = (key) => {
  const current = gameObjects[key];
  const material = new THREE.MeshBasicMaterial();
  if (key === 'pOne') {
    current.mesh = new THREE.Mesh(torusGeo, basicMat);
    current.position = { x: 0, y: 0, z: -100 };
  }
  if (key === 'pTwo') {
    current.mesh = new THREE.Mesh(torusGeo, material);
    current.position = { x: 0, y: 0, z: 100 };
  }
  scene.add(current.mesh);
  current.mesh.translateX(current.position.x);
  current.mesh.translateY(current.position.y);
  current.mesh.translateZ(current.position.z);
};

const buildBall = () => {
  const ball = gameObjects.disk;
  ball.mesh = new THREE.Mesh(sphereGeo, basicMat);
  ball.position = { x: 0, y: 0, z: 0 };
  ball.velocity = { x: 15, y: 8 };
  scene.add(ball.mesh);
};

export const init = () => {
  // get dom context
  context = document.querySelector('#renderer');
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  // camera.position.z = 400;

  scene = new THREE.Scene();
  buildPlayer('pOne');
  buildPlayer('pTwo');
  // buildBall();

  // Renderer init
  renderer = new THREE.WebGLRenderer();
  context.appendChild(renderer.domElement);

  ghost = new THREE.PeppersGhostEffect(renderer);
  effect = ghost;
  effect.setSize(window.innerWidth, window.innerHeight);
  effect.cameraDistance = 400;

  window.addEventListener('resize', onWindowResize, false);
  animate();
};

export default {
  init,
};
