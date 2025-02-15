import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.161.0/examples/jsm/controls/OrbitControls.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm';

// Scene Setup
const scene = new THREE.Scene();
const canvas = document.querySelector('#webgl-canvas');
const sizes = { width: window.innerWidth, height: window.innerHeight };
const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 100);
camera.position.set(2, 3, 5);
camera.lookAt(0, 0, 0);
scene.add(camera);

// Materials and Geometries
const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide });
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
const sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5, 10), material);
sphere.position.x = -1.5;
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.15, 32, 128), material);
torus.position.x = 1.5;

const shapesGroup = new THREE.Group();
shapesGroup.add(cube, sphere, torus);
shapesGroup.position.y = 0.5;
shapesGroup.children.forEach((obj) => obj.castShadow = true);
scene.add(shapesGroup);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), material);
plane.position.y = -0.25;
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

// Lights
const ambientLight = new THREE.AmbientLight('white', 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('#ffffff', 2);
directionalLight.position.set(1, 2, 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 10;
scene.add(directionalLight);

const pointLight = new THREE.PointLight('white', 3);
pointLight.position.set(0, 1, 0);
pointLight.castShadow = true;
scene.add(pointLight);

const spotLight = new THREE.SpotLight('purple', 10);
spotLight.position.set(0, 2, 0);
spotLight.castShadow = true;
scene.add(spotLight);

// Light helpers
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(directionalLightHelper);

// Debug UI (GUI)
const gui = new GUI();
gui.add(material, 'metalness', 0, 1, 0.001);
gui.add(material, 'roughness', 0, 1, 0.001);

const lightsFolder = gui.addFolder('Lights');
lightsFolder.add(ambientLight, 'intensity', 0, 6, 0.001);
lightsFolder.add(directionalLight, 'intensity', 0, 6, 0.001);
lightsFolder.add(spotLight, 'intensity', 0, 20, 0.001);

// Camera controls (OrbitControls)
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.01;

// Resize Handler
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  renderer.setSize(sizes.width, sizes.height);
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
});

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Animation Loop
const clock = new THREE.Clock();
function animate() {
  const deltaTime = clock.getElapsedTime();
  
  pointLight.position.x = Math.sin(deltaTime) * 2;
  pointLight.position.z = Math.cos(deltaTime) * 2;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
