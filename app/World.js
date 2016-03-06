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
  current.mesh.position.setX(handPos.x * 300);
  current.mesh.position.setY(handPos.y * 300 - 150);
};

const checkGrab = (player) => {
  const ball = gameObjects.disk;
  const location = player.position;
  const ballRad = 100;
  const handRad = 300;
  const dX = ball.position.x - location.x;
  const dY = ball.position.y - location.y;
  if (Math.abs(ball.position.z - location.z) < ballRad) {
    const between = (dX * dX) + (dY * dY);

    if (between <= ballRad * ballRad + handRad * handRad) {
      console.log('gotem');
      return true;
    }
    else {
      return false;
    }
  }
  else return false;
};

const checkBounds = ball => {
  const range = 300;
  if (ball.position.x >= range || ball.position.x < -range) {
    ball.velocity.x *= -1;
  }
  if (ball.position.y >= range || ball.position.y < -range) {
    ball.velocity.y *= -1;
  }
  if (ball.position.z >= range || ball.position.z < -range) {
    ball.velocity.z *= -1;
  }
};

const ballMove = () => {
  const ball = gameObjects.disk;
  ball.mesh.translateX(ball.velocity.x);
  ball.mesh.translateY(ball.velocity.y);
  ball.mesh.translateZ(ball.velocity.z);
  ball.position.x += ball.velocity.x;
  ball.position.y += ball.velocity.y;
  ball.position.z += ball.velocity.z;
  checkBounds(ball);
};

const animate = () => {
  requestAnimationFrame(animate);
  ballMove();
  if (!gameObjects.pOne.open) checkGrab(gameObjects.pOne);
  if (!gameObjects.pTwo.open) checkGrab(gameObjects.pTwo);

  effect.render(scene, camera);
};

const buildPlayer = (key) => {
  const current = gameObjects[key];
  const material = new THREE.MeshBasicMaterial();
  if (key === 'pOne') {
    current.mesh = new THREE.Mesh(torusGeo, basicMat);
    current.position = { x: 0, y: 0, z: -400 };
  }
  if (key === 'pTwo') {
    current.mesh = new THREE.Mesh(torusGeo, material);
    current.position = { x: 0, y: 0, z: 400 };
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
  ball.velocity = { x: 2, y: -3, z: 3 };
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
  buildBall();

  // Renderer init
  renderer = new THREE.WebGLRenderer();
  context.appendChild(renderer.domElement);

  ghost = new THREE.PeppersGhostEffect(renderer);
  effect = ghost;
  effect.setSize(window.innerWidth, window.innerHeight);
  effect.cameraDistance = 1000;

  window.addEventListener('resize', onWindowResize, false);
  animate();
};

export default {
  init,
};
