
//import * as THREE from 'https://threejs.org/build/three.module.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

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
    scene.background = new THREE.Color( 'white' );

    // Basic directional light
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);




    const mtlLoader = new MTLLoader();
    mtlLoader.load('./13463_Australian_Cattle_Dog_v3.mtl', (mtl) => {
        mtl.preload();
        console.log(mtl);
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load( './13463_Australian_Cattle_Dog_v3.obj', ( root ) => {
            root.scale.set(0.2,0.2,0.2);
            root.rotation.z = Math.PI/2;
            root.rotation.x = -Math.PI/2;
            root.position.y = -2;

            scene.add( root );

         } );
    });
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

    const loader = new THREE.TextureLoader();
    const texture = loader.load( 'https://threejs.org/manual/examples/resources/images/wall.jpg' );
	texture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.BoxGeometry( 1, 1, 1);
	const material = new THREE.MeshBasicMaterial( {
		map: texture
	} );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.y = -2
	scene.add( cube );
	objects.push( cube ); // add to our list of cubes to rotate


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

// import * as THREE from 'https://threejs.org/build/three.module.js';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// function main() {
//     const canvas = document.querySelector('#c');
//     const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
//     renderer.setSize(window.innerWidth, window.innerHeight); // Adjust to use the full window size

//     const fov = 45;
//     const aspect = window.innerWidth / window.innerHeight; // Adjusted for the full window
//     const near = 0.1;
//     const far = 100;
//     const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
//     camera.position.set(0, 10, 30); // Adjusted to fit more shapes

//     const controls = new OrbitControls(camera, canvas);
//     controls.target.set(0, 5, 0);
//     controls.update();

//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color('black');

//     // Ground plane setup remains the same
//     // Lighting setup remains the same

//     // Define geometries for primary shapes
//     const geometries = [
//         new THREE.BoxGeometry(1, 1, 1), // Cube
//         new THREE.SphereGeometry(0.5, 16, 16), // Sphere
//         new THREE.CylinderGeometry(0.5, 0.5, 1, 16), // Cylinder
//         new THREE.ConeGeometry(0.5, 1, 16), // Cone
//         new THREE.TorusGeometry(0.5, 0.2, 16, 100), // Torus
//     ];

//     // Create and position 20 primary shapes
//     for (let i = 0; i < 20; i++) {
//         const geometry = geometries[i % geometries.length];
//         const material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
//         const shape = new THREE.Mesh(geometry, material);

//         // Position the shapes in a grid-like pattern
//         const row = Math.floor(i / 5);
//         const col = i % 5;
//         shape.position.set(col * 3 - 6, row * 3, 0);

//         scene.add(shape);
//     }

//     // Load a custom 3D model with OBJLoader (this part remains unchanged)

//     // Render loop and resize handler remain unchanged

//     function render() {
//         requestAnimationFrame(render);
//         renderer.render(scene, camera);
//     }

//     requestAnimationFrame(render);
// }

// main();


