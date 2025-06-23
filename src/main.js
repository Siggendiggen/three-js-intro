import './style.css'

// importerer js library
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup
//trenger en scene == en container som holder ocjektene dine (kamera og lys)

const scene = new THREE.Scene();

// perspective camera er mest likt menneske øyet, 75 er field of view, 
// deretter aspect ratio basert på browseren, sist er view fustrum
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
// gjør det til en fullscreen canvas
renderer.setSize(window.innerWidth, window.innerHeight);
// posisjonerer kameraet litt til siden for å tydeliggjøre shapes
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus / shape

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347  });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff, 1000);
pointLight.position.set(15, 0, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

//const lightHelper = new THREE.PointLightHelper(pointLight)
//const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(lightHelper, gridHelper)

//const controls = new OrbitControls(camera, renderer.domElement);


function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  // plasserer stjernene tilfeldig
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

//antall stjerner
Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('/photos/space.jpg');
scene.background = spaceTexture;

// Avatar

const sigridTexture = new THREE.TextureLoader().load('/photos/profilbilde.jpeg');

const sigrid = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: sigridTexture }));

scene.add(sigrid);


// Moon

const moonTexture = new THREE.TextureLoader().load('/photos/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('/photos/normal.jpg');

const moon = new THREE.Mesh(
  // 3 = radius
  new THREE.SphereGeometry(3, 32, 32),
  //legger til tekstur til figuren
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

sigrid.position.z = -5;
sigrid.position.x = 2;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  sigrid.rotation.y += 0.01;
  sigrid.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop 

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  // for å oppdatere forandringer gjort med med musa (trenger kode under helpers)
  // controls.update();

  renderer.render(scene, camera);
}

animate();