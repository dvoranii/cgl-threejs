import gsap from "gsap";
import * as THREE from "/node_modules/three/build/three.module.js";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import atmosphereVertex from "./shaders/atmosphereVertex.glsl";
import atmosphereFragment from "./shaders/atmosphereFragment.glsl";
import { Float32BufferAttribute } from "three";

const scene = new THREE.Scene();

const canvasContainer = document.querySelector(".globe-container");
const camera = new THREE.PerspectiveCamera(
  75,
  canvasContainer.offsetWidth / canvasContainer.offsetHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("canvas"),
});

renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// create sphere for globe
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      globeTexture: {
        value: new THREE.TextureLoader().load("./img/earth-uv.jpg"),
      },
    },
  })
);

// create atmosphere
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertex,
    fragmentShader: atmosphereFragment,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
  })
);

atmosphere.scale.set(1.25, 1.25, 1.25);
scene.add(atmosphere);

const group = new THREE.Group();
group.add(sphere);
scene.add(group);

const starGeometry = new THREE.BufferGeometry();

// want to use circle texture for stars

function createCircleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;

  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, 2 * Math.PI, false);
  ctx.fillStyle = "white";
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 1, // Adjust this value to control the size of the stars
  sizeAttenuation: true,
  map: createCircleTexture(),
  transparent: true,
  depthWrite: false,
});

// const starMaterial = new THREE.PointsMaterial({
//   color: 0xffffff,
// });

const starVertices = [];

for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = -Math.random() * 10000;
  starVertices.push(x, y, z);
}

starGeometry.setAttribute(
  "position",
  new Float32BufferAttribute(starVertices, 3)
);

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

camera.position.z = 15;

const mouse = {
  x: 0,
  y: 0,
};

function animateScene() {
  renderer.render(scene, camera);
  requestAnimationFrame(animateScene);
  sphere.rotation.y += 0.001;
  gsap.to(group.rotation, {
    x: mouse.y * 0.3,
    y: mouse.x * 0.5,
    duration: 2,
  });
}

animateScene();

addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = (event.clientY / innerHeight) * 2 + 1;
});
