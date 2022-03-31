// import three.js at compile time
// import * as THREE from 'three';

const version = "v0.0.1 DEV";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const overlayCanvas = document.getElementById("overlaycanvas") as HTMLCanvasElement;

//const backgroundColor = 0xADD8E6;
// Make backgroundColor black
const backgroundColor = 0x000000;

const overlayCTX = overlayCanvas.getContext("2d");

if(!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("No canvas found");
    window.stop();
}

// Three.js setup
const renderer = new THREE.WebGLRenderer({ canvas });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    10000
);

// Add an ambient light that illuminates the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// Camera setup
camera.position.z = 5;

// Add a light
const light = new THREE.PointLight(0xffffff, 10, 100, 3);

const geometry = new THREE.BoxGeometry(Math.random() * 4 + 2, Math.random() * 4 + 2, Math.random() * 4 + 2);

scene.add(light);

// Add some fog
scene.fog = new THREE.Fog(backgroundColor, 0.015, 10000);

// Add a skybox using meshbasicmaterial with the material
const skybox = new THREE.Mesh(
    new THREE.SphereGeometry(100, 100, 100),
    new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        color: backgroundColor,
        fog: false
    }),
);

// Prevent skybox from being culled by the camera
skybox.renderOrder = 100000;
skybox.frustumCulled = false;

// Don't cull the skybox
renderer.shadowMap.enabled = true;

scene.add(skybox);

var cubes: Array<THREE.Mesh> = [];
var speeds: Array<THREE.Vector3> = [];

// Make 100 cubes that are randomly placed in the scene with random colors, sizes and rotations
for(let i = 0; i < 2000; i++) {
    var material = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0, metalness: 0.5 });
    // Generate a random geometry
    const cube = new THREE.Mesh(geometry, material);
    while(!(cube.position.x >= 10 || cube.position.x <= -10) && !(cube.position.y >= 10 || cube.position.y <= -10) && !(cube.position.z >= 10 || cube.position.z <= -10)) {
        cube.position.x = Math.random() * 200 - 100;
        cube.position.y = Math.random() * 200 - 100;
        cube.position.z = Math.random() * 200 - 100;
    }
    cube.rotation.x = Math.random() * Math.PI;
    cube.rotation.y = Math.random() * Math.PI;
    cube.rotation.z = Math.random() * Math.PI;
    cube.scale.x = Math.random() * 2 + 1;
    cube.scale.y = Math.random() * 2 + 1;
    cube.scale.z = Math.random() * 2 + 1;
    cube.castShadow = true;
    cube.receiveShadow = true;

    // Make each cube a different color
    cube.material.color.setHex(Math.random() * 0xffffff);

    cubes.push(cube);
    scene.add(cube);
}

// Add speeds to the cubes
for(let i = 0; i < cubes.length; i++) {
    speeds[i] = new THREE.Vector3(Math.random() * 0.01, Math.random() * 0.01, Math.random() * 0.01);
}

var framecounter = 0;

function animate () {
    // Update the camera's size
    camera.aspect = 1920/1080;

    // Make the camera rotate around
    camera.rotation.x = Math.sin(Date.now() / 1000) * 0.1;
    camera.rotation.z = Math.cos(Date.now() / 1000) * 0.1;

    // Make the camera rotate randomly

    light.position.set(camera.position.x, camera.position.y, camera.position.z);
    
    // Randomly rotate the cubes
    for(let i = 0; i < cubes.length; i++) {
        cubes[i].rotation.x += speeds[i].x;
        cubes[i].rotation.y += speeds[i].y;
        cubes[i].rotation.z += speeds[i].z;
    }

    renderer.setSize(canvas.width, canvas.height);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.fov = 90;
    camera.updateProjectionMatrix();
}

function overlay () {
    
    overlayCanvas.width = window.innerWidth;
    overlayCanvas.height = window.innerHeight;

    var ctx = overlayCTX;
    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
    ctx.font = '48px sans-serif';
    ctx.fillStyle = 'black';
    ctx.fillText(`${version}`, 0, 48, 1000);
    ctx.fillText(`Please do not distribute this highly incomplete game`, 0, overlayCanvas.height - 10, 1000);
    ctx.fillText(`Frame ${framecounter}`, 0, 96, 1000);
    
    ctx.fill();
}

// Three.js loop
function render () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    animate();
    overlay();
    renderer.render(scene, camera);
    framecounter++
    requestAnimationFrame(render);
}

render();