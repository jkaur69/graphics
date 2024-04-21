
import * as THREE from 'https://threejs.org/build/three.module.js';

function main() {
    // Select the canvas and set it to the size of the window
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(window.innerWidth, window.innerHeight); // Full window canvas

    // Adjust the camera
    const fov = 60; // Slightly wider FOV
    const aspect = window.innerWidth / window.innerHeight; // Aspect ratio to match the window size
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 30; // Move the camera back to fit all objects

    const scene = new THREE.Scene();

    // Basic directional light
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    // Create a variety of geometries
    const geometries = [
        new THREE.BoxGeometry(1, 1, 1), // Cube
        new THREE.SphereGeometry(0.5, 12, 12), // Sphere
        new THREE.CylinderGeometry(0.5, 0.5, 1, 12), // Cylinder
        new THREE.ConeGeometry(0.5, 1, 12), // Cone
        new THREE.TorusGeometry(0.5, 0.2, 12, 24) // Torus
    ];

    // Function to create and add shapes to the scene
    function makeInstance(geometry, color, x, y) {
        const material = new THREE.MeshPhongMaterial({color: color});
        const shape = new THREE.Mesh(geometry, material);
        scene.add(shape);
        shape.position.x = x;
        shape.position.y = y;
        return shape;
    }

    // Generate 20 different objects with unique colors and positions
    const objects = [];
    for (let i = 0; i < 20; i++) {
        const geometry = geometries[i % geometries.length];
        const color = Math.random() * 0xffffff; // Random color for each shape
        const x = (i % 5) * 5 - 10; // Spread out on the x-axis
        const y = Math.floor(i / 5) * 5 - 10; // Spread out on the y-axis
        objects.push(makeInstance(geometry, color, x, y));
    }

    // Animation loop
    function render(time) {
        time *= 0.001;  // convert time to seconds

        objects.forEach((obj, ndx) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            obj.rotation.x = rot;
            obj.rotation.y = rot;
        });

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();


