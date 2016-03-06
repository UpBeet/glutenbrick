import THREE from 'three';

// Three js constants
let context = {};
let camera = {};
let renderer = {};
let scene = {};
let mesh = {};

const cubeGeo = new THREE.BoxGeometry(200, 200, 200);
const basicMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const onWindowResize = () => {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

const animate = () => {

  requestAnimationFrame(animate);

  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.01;

  renderer.render(scene, camera);
};

export const init = () => {
  // get dom context
  context = document.querySelector('#renderer');

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 400;

  scene = new THREE.Scene();
  mesh = new THREE.Mesh(cubeGeo, basicMat);
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
