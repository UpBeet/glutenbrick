import THREE from 'three';
import Pepper from '../lib/pepper';

// Three js constants
let context = {};
let camera = {};
let renderer;
let scene;
let effect;
let ghost;
let aiState = 'waiting';

const gameObjects = {
  disk: {},
  pOne: {},
  pTwo: {},
};

let tracker = {};

const torusGeo = new THREE.TorusGeometry(50, 20, 8, 8);
const sphereGeo = new THREE.SphereGeometry(50, 10, 10);
const trackerGeo = new THREE.CubeGeometry(500, 500, 2);
const basicMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const basicMat2 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const basicMat3 = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.2 });

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  effect.setSize(window.innerWidth, window.innerHeight);
};

// SECTION
// PLAYER
// SECTION
const buildPlayer = (key) => {
  const current = gameObjects[key];
  const material = new THREE.MeshBasicMaterial();
  current.open = true;
  if (key === 'pOne') {
    current.mesh = new THREE.Mesh(torusGeo, basicMat);
    current.position = { x: 0, y: 0, z: -400 };
  }
  if (key === 'pTwo') {
    current.mesh = new THREE.Mesh(torusGeo, material);
    current.position = { x: 0, y: 0, z: 400 };
  }
  current.score = 0;
  scene.add(current.mesh);
  current.mesh.translateX(current.position.x);
  current.mesh.translateY(current.position.y);
  current.mesh.translateZ(current.position.z);
};

const shootBall = player => {
  if (player === 'pOne') {
    aiState = 'catching';
  }

  const vector = new THREE.Vector3(0, 0, 1);
  vector.applyQuaternion(player.mesh.quaternion);
  vector.multiplyScalar(8);

  gameObjects.disk.velocity = vector;
  // after release
  gameObjects.disk.held = false;
  gameObjects.disk.currentOwner = null;
};

export const openHand = player => {
  if (!gameObjects[player].open) {
    gameObjects[player].open = true;
    gameObjects[player].mesh.scale.set(1, 1, 1);
    if (gameObjects.disk.held && gameObjects.disk.currentOwner === gameObjects[player]) {
      shootBall(gameObjects[player]);
    }
  }
};

export const closeHand = player => {
  if (gameObjects[player].open) {
    gameObjects[player].open = false;
    gameObjects[player].mesh.scale.set(0.4, 0.4, 0.4);
  }
};

const checkGrab = (player) => {
  const ball = gameObjects.disk;
  const location = player.position;
  const ballRad = 50;
  const handRad = 50;
  const dX = ball.position.x - location.x;
  const dY = ball.position.y - location.y;
  if (Math.abs(ball.position.z - location.z) < ballRad) {
    const between = (dX * dX) + (dY * dY);

    if (between <= ballRad * ballRad + handRad * handRad) {
      return true;
    }
    else {
      return false;
    }
  }
  else return false;
};

export const updatePlayerTransform = (player, roll, yaw, pitch, handPos) => {
  const current = gameObjects[player];
  current.mesh.rotation.set(-pitch, yaw, roll);
  current.mesh.position.setX(handPos.x * 300);
  current.mesh.position.setY(handPos.y * 300 - 150);
  current.position.x = handPos.x * 300;
  current.position.y = handPos.y * 300 - 150;
};

const resetBall = () => {
  gameObjects.disk.position = { x: 0, y: 0, z: 0 };
  gameObjects.disk.mesh.position.set(0, 0, 0);
};

const scorePoint = position => {
  resetBall();
  gameObjects.pOne.score++;
  gameObjects.disk.velocity = { x: 0, y: 0, z: -4 };
};

// SECTION
// BALL
// SECTION
const buildBall = () => {
  const ball = gameObjects.disk;
  ball.mesh = new THREE.Mesh(sphereGeo, basicMat2);
  ball.position = { x: 0, y: 0, z: 0 };
  ball.velocity = { x: 0, y: 0, z: -4 };
  scene.add(ball.mesh);
  ball.held = false;
};

const checkBounds = ball => {
  const range = 360;
  if (ball.position.x >= (range - 110) || ball.position.x < -(range - 110)) {
    ball.velocity.x *= -1;
  }
  if (ball.position.y >= (range - 110) || ball.position.y < -(range - 110)) {
    ball.velocity.y *= -1;
  }
  if (ball.position.z < -range) {
    scorePoint(ball.position.z);
  }
  if (ball.position.z >= range) {
    // check if hit Targets
    if (checkGrab(gameObjects.pTwo)) {
      scorePoint();
    }
    else {
      ball.velocity.z *= -1;
    }
  }
};

const ballMove = () => {
  const ball = gameObjects.disk;

  if (!ball.held) {
    ball.mesh.translateX(ball.velocity.x);
    ball.mesh.translateY(ball.velocity.y);
    ball.mesh.translateZ(ball.velocity.z);
    ball.position.x += ball.velocity.x;
    ball.position.y += ball.velocity.y;
    ball.position.z += ball.velocity.z;
    checkBounds(ball);
  }
  else {
    ball.mesh.position.setX(ball.currentOwner.position.x);
    ball.mesh.position.setY(ball.currentOwner.position.y);
    ball.position.x = ball.currentOwner.position.x;
    ball.position.y = ball.currentOwner.position.y;
    if (ball.currentOwner.position.z > 0) {
      ball.position.z = 300;
      ball.mesh.position.setZ(300);
    }
    else {
      ball.position.z = -300;
      ball.mesh.position.setZ(-300);
    }
  }
};

const animate = () => {
  requestAnimationFrame(animate);
  if (!gameObjects.pOne.open && checkGrab(gameObjects.pOne)) {
    gameObjects.disk.held = true;
    gameObjects.disk.currentOwner = gameObjects.pOne;
  }
  if (!gameObjects.pTwo.open && checkGrab(gameObjects.pTwo)) {
    gameObjects.disk.held = true;
    gameObjects.disk.currentOwner = gameObjects.pTwo;
  }
  ballMove();
  tracker.position.setZ(gameObjects.disk.position.z);
  effect.render(scene, camera);
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

  tracker = new THREE.Mesh(trackerGeo, basicMat3);
  scene.add(tracker);
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
