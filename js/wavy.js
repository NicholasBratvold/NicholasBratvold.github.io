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

const timeSlider = document.getElementById('timeSlider');

timeSlider.addEventListener('input', function() {
  time = parseFloat(timeSlider.value);
});
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


/* 
My name is Nick. 
I am a engineer Physisist who obtained my degree from UBC.  
My degree has equipped me with multidisiplinary ability to apply theoritical 
concepts efficienty.  I have taken optics, statistical mechanics, 
applidea partial derivatives, probability, and a handful of computer science courses. 
As well as robot and machine learning design courses. I won a robotics competition 
against my cohort of engineering physics at UBC. I have also done capstone project.
 One was a microfluidics/software project make a protable and quick system to quantify 
 Fentanyl at 100x below the lethal dose. The other one involved building, designing, 
 and optimizing a state of the art video generation model from scratch. A lot of 
 literature review and headbanging was needed for that. I am passionate about 
 education and have ambitions to become a teacher or professor later in life. I 
 would like to try engineering a little bit first since I completed(survived) the 
 degree. I have worked for MCW conultants to design power distribution systems. I also 
 conducted arc flash studies to produce safety labels and recommend fuse and breaker 
 settings for airport Lidar towers across western Canada. I worked in a maker lab where 
 I designed $50 robot kits currently being sold. There was a quadraped and also a 
 modular battle bot. I also ran one of the building on my own over a summer where I 
 scheduled one on one design sessions for kids aged 12-18. Together we built tons of 
 fun things like a VR video game, tesla coils, RC cars, minecraft reinforcment agent, 
 and more battle bots of course. I also took a summer to teach STEAM in remote 
 indigenous communities across northern BC. I loved the opportunity to combine land 
 based learning and physics concepts to students. There I taught kids how to rig up 
 pulley systems to get 200+ lb logs off of roads, built cardboard canoes, and minature
  propellor boats. In my free time 
I enjoy cooking and am currently making a recipe book of my succesful crations. 
*/