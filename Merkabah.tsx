// Merkabah.tsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Merkabah() {
    const secondTetrahedronRef = useRef<THREE.Mesh | null>(null);

    useEffect(() => {
        const { scene, camera, renderer } = initScene();
        const { tetrahedron1, tetrahedron2 } = createTetrahedrons();
        secondTetrahedronRef.current = tetrahedron2;
        positionTetrahedrons(tetrahedron1, tetrahedron2);
        scene.add(tetrahedron1);
        scene.add(tetrahedron2);
        addLighting(scene);
        camera.position.z = 5;
        animate(renderer, scene, camera, tetrahedron1, secondTetrahedronRef);

        return () => renderer.dispose();
    }, []);

    return null;
}

function initScene() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    const div = document.getElementById('KappaView')!;
    div.appendChild(renderer.domElement);
    return { scene, camera, renderer };
}

function createTetrahedrons() {
    const geometry = new THREE.TetrahedronGeometry(1);
    const material = new THREE.MeshBasicMaterial({
        color: 0x0000ee,
        wireframe: true
    });
    const tetrahedron1 = new THREE.Mesh(geometry, material);
    const tetrahedron2 = new THREE.Mesh(geometry, material);
    return { tetrahedron1, tetrahedron2 };
}

function positionTetrahedrons(tetrahedron1: THREE.Mesh, tetrahedron2: THREE.Mesh) {
    const heightAdjustment = 0;
    tetrahedron1.position.set(0, heightAdjustment / 2, 0);
    tetrahedron1.rotation.x = 0;
    tetrahedron2.position.set(0, -heightAdjustment / 2, 0);
    tetrahedron2.rotation.x = Math.PI;
}

function addLighting(scene: THREE.Scene) {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 5, 5).normalize();
    scene.add(light);
}

function animate(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    tetrahedron1: THREE.Mesh,
    secondTetrahedronRef: React.RefObject<THREE.Mesh | null>
) {
    const moveSpeed = 0.02;

    const animationLoop = function () {
        requestAnimationFrame(animationLoop);

        if (secondTetrahedronRef.current) {
            if (secondTetrahedronRef.current.position.y < -0.5) {
                secondTetrahedronRef.current.position.y += moveSpeed;
            }
        }

        tetrahedron1.rotation.y += 0.01;
        if (secondTetrahedronRef.current) {
            secondTetrahedronRef.current.rotation.y += 0.01;
        }

        renderer.render(scene, camera);
    };

    animationLoop();
}
