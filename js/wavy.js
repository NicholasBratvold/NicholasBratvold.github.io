import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xd0f0d0); // set background colour
canvas.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(100,1,0.1,1000); // view angle, aspect ratio, near, far
camera.position.set(0,3,0);
camera.lookAt(0,0,0);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
// var controls = new OrbitControls(camera, renderer.domElement);
// controls.damping = 0.2;
// controls.autoRotate = false;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

// //SCROLLBAR FUNCTION DISABLE
// window.onscroll = function () {
//      window.scrollTo(0,0);
// }

var ambientLight = new THREE.AmbientLight(0x606060);
scene.add(ambientLight);

var marbleMaterial = new THREE.ShaderMaterial( {
    uniforms: { 
         time: {value: new THREE.Vector3(0.0,0.0,-1.0) },
    },
      vertexShader: document.getElementById( 'myVertShader' ).textContent,
      fragmentShader: document.getElementById( 'pnoiseFragShader' ).textContent,
          side: THREE.DoubleSide
  } );
  
var marbleGeometry = new THREE.PlaneBufferGeometry(window.innerWidth,window.innerHeight);
var marble = new THREE.Mesh(marbleGeometry, marbleMaterial);
marble.position.x = 0;
marble.position.z = 0;
marble.position.y = 0;
marble.rotation.x = -Math.PI / 2;
scene.add(marble);

var time = 0.0;
function update() {
    requestAnimationFrame(update);
    marbleMaterial.uniforms.time.value = time;
    renderer.render(scene, camera);
    time+=0.01;
  }
  
update();