import './style.css'
import * as THREE from 'three'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,100);
const canvas = document.querySelector('#bg');
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});


camera.position.set(0,0,-0.5);
console.log(camera.position);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
camera.position.setZ(30);


renderer.render(scene,camera);

const geometry = new THREE.TorusGeometry(10,3,16,100);
const material = new THREE.MeshBasicMaterial({color:0xFF6347});
const pointlight = new THREE.PointLight(0xffffff);
pointlight.position.set(0,5,0);
const ambienLight = new THREE.AmbientLight(0xffffff);
scene.add(pointlight,ambienLight);

const loader = new FBXLoader();

const texture = new THREE.TextureLoader().load('./models/lago.jpg');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapS = THREE.RepeatWrapping;

scene.background = texture;

console.log(pointlight);

var duck = null;

loader.load('./models/bottle.fbx', (fbx) => {
  fbx.scale.setScalar(0.3);

  fbx.traverse(function(child) {
    console.log(child);
    if(child instanceof THREE.Mesh){
      //child.material = material;
      duck = fbx;
    }
  });

  fbx.position.set(1.0,-10,1.0);

  scene.add(fbx);
  console.log("Load models");
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();


  renderer.setSize(window.innerWidth, window.innerHeight);
}, false)

console.log(scene);


document.addEventListener("keydown", (e) => {
  switch(e.code){
    case 'Space':
      camera.position.y += 1.0;
      break;
    case 'ShiftLeft':
      camera.position.y -= 1.0;
      break;
    case 'KeyD':
      camera.rotateY(-0.05);
      break;
    case 'KeyA':
      camera.rotateY(0.05);
      break;
    case 'KeyW':
      camera.position.z -= Math.cos(camera.rotation.y);
      camera.position.x -= Math.sin(camera.rotation.y);
      break;
    case 'KeyS':
      camera.position.z += Math.cos(camera.rotation.y);
      camera.position.x += Math.sin(camera.rotation.y);
      break;
  }
});



//const torus = new THREE.Mesh(geometry,material);

const longitud = 15;

var offsetr = 0.01;
var offsetg = 0.03;
var offsetb = 0.05;

function animate(){
  if(duck != null){
    //duck.rotation.x += 0.01;
    duck.rotation.y += 0.02;
    //duck.rotation.z += 0.01;
  }
  
  pointlight.color.r += offsetr;
  pointlight.color.g += offsetg; 
  pointlight.color.b += offsetb;

  if(pointlight.color.r > 1 || pointlight.color.r < 0){
    offsetr *= -1;
  }

  if(pointlight.color.b > 1 || pointlight.color.b < 0){
    offsetb *= -1;
  }

  if(pointlight.color.g > 1 || pointlight.color.g < 0){
    offsetg *= -1;
  }

  var angulo = Date.now() * 0.01;

  pointlight.position.set(Math.cos(angulo) * longitud,2,Math.sin(angulo) * longitud);


  requestAnimationFrame(animate);
  renderer.render(scene,camera);
}

animate();