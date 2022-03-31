// import three.js at compile time
// import * as THREE from 'three';

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

if(!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("No canvas found");
    window.stop();
}

// Three.js setup
const renderer = new THREE.WebGLRenderer({ canvas });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);

// Camera setup
camera.position.z = 5;

// Add a cube to the scene
const geometry = new THREE.BoxGeometry(1, 1, 1);
const greenmaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const yellowmaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cube = new THREE.Mesh(geometry, yellowmaterial);
scene.add(cube);

// Three.js loop
const animate = () => {
    requestAnimationFrame(animate);
    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    // Update the camera's size
    camera.aspect = 1920/1080;

    // Make the camera zoom in and out
    camera.position.z = (Math.sin(Date.now() / 1000) * 5) + 10;

    // Make the canvas scale to the window
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    console.log(cube.rotation);
    renderer.render(scene, camera);
}

animate();