
// //import * as THREE from 'https://threejs.org/build/three.module.js';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
// import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

// function main() {
//     // Select the canvas and set it to the size of the window
//     const canvas = document.querySelector('#c');
//     const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
//     renderer.setSize(window.innerWidth, window.innerHeight); // Full window canvas

//     // Adjust the camera
//     const fov = 60; // Slightly wider FOV
//     const aspect = window.innerWidth / window.innerHeight; // Aspect ratio to match the window size
//     const near = 0.1;
//     const far = 100;
//     const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
//     camera.position.z = 30; // Move the camera back to fit all objects

//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color( 'white' );

//     // Basic directional light
//     const color = 0xFFFFFF;
//     const intensity = 1;
//     const light = new THREE.DirectionalLight(color, intensity);
//     light.position.set(-1, 2, 4);
//     scene.add(light);




//     const mtlLoader = new MTLLoader();
//     mtlLoader.load('./13463_Australian_Cattle_Dog_v3.mtl', (mtl) => {
//         mtl.preload();
//         console.log(mtl);
//         const objLoader = new OBJLoader();
//         objLoader.setMaterials(mtl);
//         objLoader.load( './13463_Australian_Cattle_Dog_v3.obj', ( root ) => {
//             root.scale.set(0.2,0.2,0.2);
//             root.rotation.z = Math.PI/2;
//             root.rotation.x = -Math.PI/2;
//             root.position.y = -2;

//             scene.add( root );

//          } );
//     });
//     // Create a variety of geometries
//     const geometries = [
//         new THREE.BoxGeometry(1, 1, 1), // Cube
//         new THREE.SphereGeometry(0.5, 12, 12), // Sphere
//         new THREE.CylinderGeometry(0.5, 0.5, 1, 12), // Cylinder
//         new THREE.ConeGeometry(0.5, 1, 12), // Cone
//         new THREE.TorusGeometry(0.5, 0.2, 12, 24) // Torus
//     ];

//     // Function to create and add shapes to the scene
//     function makeInstance(geometry, color, x, y) {
//         const material = new THREE.MeshPhongMaterial({color: color});
//         const shape = new THREE.Mesh(geometry, material);
//         scene.add(shape);
//         shape.position.x = x;
//         shape.position.y = y;
//         return shape;
//     }

//     // Generate 20 different objects with unique colors and positions
//     const objects = [];
//     for (let i = 0; i < 20; i++) {
//         const geometry = geometries[i % geometries.length];
//         const color = Math.random() * 0xffffff; // Random color for each shape
//         const x = (i % 5) * 5 - 10; // Spread out on the x-axis
//         const y = Math.floor(i / 5) * 5 - 10; // Spread out on the y-axis
//         objects.push(makeInstance(geometry, color, x, y));
//     }

//     const loader = new THREE.TextureLoader();
//     const texture = loader.load( 'https://threejs.org/manual/examples/resources/images/wall.jpg' );
// 	texture.colorSpace = THREE.SRGBColorSpace;

//     const geometry = new THREE.BoxGeometry( 1, 1, 1);
// 	const material = new THREE.MeshBasicMaterial( {
// 		map: texture
// 	} );
//     const cube = new THREE.Mesh( geometry, material );
//     cube.position.y = -2
// 	scene.add( cube );
// 	objects.push( cube ); // add to our list of cubes to rotate


//     // Animation loop
//     function render(time) {
//         time *= 0.001;  // convert time to seconds

//         objects.forEach((obj, ndx) => {
//             const speed = 1 + ndx * .1;
//             const rot = time * speed;
//             obj.rotation.x = rot;
//             obj.rotation.y = rot;
//         });

//         renderer.render(scene, camera);

//         requestAnimationFrame(render);
//     }

//     requestAnimationFrame(render);
// }

// main();

// import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
// import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

// function main() {
//     // Select the canvas and set it to the size of the window
//     const canvas = document.querySelector('#c');
//     const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
//     renderer.setSize(window.innerWidth, window.innerHeight); // Full window canvas

//     // Adjust the camera
//     const fov = 60; // Slightly wider FOV
//     const aspect = window.innerWidth / window.innerHeight; // Aspect ratio to match the window size
//     const near = 0.1;
//     const far = 100;
//     const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
//     camera.position.z = 30; // Move the camera back to fit all objects

//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color('white');

//     // Basic directional light
//     const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1);
//     dirLight.position.set(-1, 2, 4);
//     scene.add(dirLight);

//     // Ambient light for general illumination
//     const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
//     scene.add(ambientLight);

//     // Hemisphere light for a nice sky and ground effect
//     const hemiLight = new THREE.HemisphereLight(0x4040ff, 0x404040, 0.6);
//     scene.add(hemiLight);

//     // Spot light for a focused lighting effect
//     const spotLight = new THREE.SpotLight(0xFFFFFF);
//     spotLight.position.set(5, 10, 5);
//     spotLight.castShadow = true;
//     scene.add(spotLight);

//     const mtlLoader = new MTLLoader();
//     mtlLoader.load('./13463_Australian_Cattle_Dog_v3.mtl', (mtl) => {
//         mtl.preload();
//         console.log(mtl);
//         const objLoader = new OBJLoader();
//         objLoader.setMaterials(mtl);
//         objLoader.load('./13463_Australian_Cattle_Dog_v3.obj', (root) => {
//             root.scale.set(0.2, 0.2, 0.2);
//             root.rotation.z = Math.PI / 2;
//             root.rotation.x = -Math.PI / 2;
//             root.position.y = -2;

//             scene.add(root);
//         });
//     });

//     // Create a variety of geometries
//     const geometries = [
//         new THREE.BoxGeometry(1, 1, 1), // Cube
//         new THREE.SphereGeometry(0.5, 12, 12), // Sphere
//         new THREE.CylinderGeometry(0.5, 0.5, 1, 12), // Cylinder
//         new THREE.ConeGeometry(0.5, 1, 12), // Cone
//         new THREE.TorusGeometry(0.5, 0.2, 12, 24) // Torus
//     ];

//     // Function to create and add shapes to the scene
//     function makeInstance(geometry, color, x, y) {
//         const material = new THREE.MeshPhongMaterial({ color: color });
//         const shape = new THREE.Mesh(geometry, material);
//         scene.add(shape);
//         shape.position.x = x;
//         shape.position.y = y;
//         return shape;
//     }

//     // Generate 20 different objects with unique colors and positions
//     const objects = [];
//     for (let i = 0; i < 20; i++) {
//         const geometry = geometries[i % geometries.length];
//         const color = Math.random() * 0xffffff; // Random color for each shape
//         const x = (i % 5) * 5 - 10; // Spread out on the x-axis
//         const y = Math.floor(i / 5) * 5 - 10; // Spread out on the y-axis
//         objects.push(makeInstance(geometry, color, x, y));
//     }

//     const loader = new THREE.TextureLoader();
//     const texture = loader.load('https://threejs.org/manual/examples/resources/images/wall.jpg');
//     texture.colorSpace = THREE.SRGBColorSpace;

//     const geometry = new THREE.BoxGeometry(1, 1, 1);
//     const material = new THREE.MeshBasicMaterial({
//         map: texture
//     });
//     const cube = new THREE.Mesh(geometry, material);
//     cube.position.y = -2;
//     scene.add(cube);
//     objects.push(cube); // add to our list of cubes to rotate

//     // Animation loop
//     function render(time) {
//         time *= 0.001;  // convert time to seconds

//         objects.forEach((obj, ndx) => {
//             const speed = 1 + ndx * .1;
//             const rot = time * speed;
//             obj.rotation.x = rot;
//             obj.rotation.y = rot;
//         });

//         renderer.render(scene, camera);

//         requestAnimationFrame(render);
//     }

//     requestAnimationFrame(render);
// }

// main();

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
    scene.background = new THREE.Color('white');

    // Add OrbitControls
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0); // Optional: Set the target to the center of the scene
    controls.update();

    // Basic directional light
    const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    dirLight.position.set(-1, 2, 4);
    scene.add(dirLight);

    // Ambient light for general illumination
    const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);

    // Hemisphere light for a nice sky and ground effect
    const hemiLight = new THREE.HemisphereLight(0x4040ff, 0x404040, 0.6);
    scene.add(hemiLight);

    // Spot light for a focused lighting effect
    const spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(5, 10, 5);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const mtlLoader = new MTLLoader();
    mtlLoader.load('./13463_Australian_Cattle_Dog_v3.mtl', (mtl) => {
        mtl.preload();
        console.log(mtl);
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('./13463_Australian_Cattle_Dog_v3.obj', (root) => {
            root.scale.set(0.2, 0.2, 0.2);
            root.rotation.z = Math.PI / 2;
            root.rotation.x = -Math.PI / 2;
            root.position.y = -2;

            scene.add(root);
        });
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
        const material = new THREE.MeshPhongMaterial({ color: color });
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
    const texture = loader.load('https://threejs.org/manual/examples/resources/images/wall.jpg');
    texture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
        map: texture
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.y = -2;
    scene.add(cube);
    objects.push(cube); // add to our list of cubes to rotate

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
