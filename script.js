
        // --- 3D SCENE SETUP ---
    import * as THREE from 'three';
    import {OrbitControls} from 'https://unpkg.com/three@0.128.0/examples/jsm/controls/OrbitControls.js';

    const container = document.getElementById('canvas-container');
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a); // dark blue-black

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(5, 3, 12);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // limit for performance
    renderer.shadowMap.enabled = true; // for future use if needed
    container.appendChild(renderer.domElement);

    // Controls (slow rotation, auto-rotate)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;
    controls.enableZoom = false; // keep zoom off to preserve layout, but can be enabled if desired
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2; // restrict below horizon
    controls.minDistance = 8;
    controls.maxDistance = 18;

    // Lights
    // Ambient
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);

    // Main directional light (golden)
    const dirLight = new THREE.DirectionalLight(0xffdd99, 1.5);
    dirLight.position.set(2, 5, 5);
    dirLight.castShadow = false;
    scene.add(dirLight);

    // Fill light (blueish)
    const fillLight = new THREE.PointLight(0x4466cc, 0.8);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    // Back light (purple)
    const backLight = new THREE.PointLight(0xaa88ff, 0.6);
    backLight.position.set(0, 2, -8);
    scene.add(backLight);

    // --- CREATE 3D OBJECTS ---

    // Central glowing core (sphere with halo)
    const coreGeo = new THREE.SphereGeometry(1.2, 64, 64);
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
    emissive: 0x442200,
    roughness: 0.2,
    metalness: 0.8
        });
    const coreSphere = new THREE.Mesh(coreGeo, coreMat);
    coreSphere.castShadow = true;
    coreSphere.receiveShadow = false;
    coreSphere.position.set(0, 0.5, 0);
    scene.add(coreSphere);

    // Add a point light inside for glow
    const glowLight = new THREE.PointLight(0xffaa33, 2, 10);
    glowLight.position.set(0, 0.5, 0);
    scene.add(glowLight);

    // Torus Knot (fancy 3D shape)
    const knotGeo = new THREE.TorusKnotGeometry(1.8, 0.4, 128, 16);
    const knotMat = new THREE.MeshStandardMaterial({color: 0x33aaff, emissive: 0x113366, wireframe: false, transparent: true, opacity: 0.7 });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    knot.position.set(0, 1.2, 0);
    knot.rotation.x = Math.PI / 4;
    knot.rotation.y = Math.PI / 6;
    scene.add(knot);

    // Floating rings (multiple)
    const ringMat = new THREE.MeshStandardMaterial({color: 0xffaa55, emissive: 0x331100, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    for (let i = 0; i < 5; i++) {
            const ringGeo = new THREE.TorusGeometry(2.2 + i * 0.5, 0.05, 32, 100);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.rotation.y = i * 0.8;
    ring.position.y = -0.5 + i * 0.6;
    scene.add(ring);
        }

    // Small floating cubes / stars
    const cubeMat = new THREE.MeshStandardMaterial({color: 0xaaccff, emissive: 0x224466 });
    for (let j = 0; j < 30; j++) {
            const size = Math.random() * 0.15 + 0.05;
    const cubeGeo = new THREE.BoxGeometry(size, size, size);
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    const angle = (j / 30) * Math.PI * 2;
    const radius = 3.5 + Math.random() * 2.5;
    const height = (Math.random() - 0.5) * 4;
    cube.position.set(
    Math.cos(angle) * radius,
    height,
    Math.sin(angle) * radius
    );
    cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    scene.add(cube);
        }

    // Add a floor reflection effect (invisible plane to catch shadows if needed, but skip for performance)
    // Instead add a grid helper for style
    const gridHelper = new THREE.GridHelper(20, 20, 0xffaa33, 0x3366aa);
    gridHelper.position.y = -1.5;
    scene.add(gridHelper);

    // Stars background (particles)
    const starsGeo = new THREE.BufferGeometry();
    const starsCount = 1500;
    const posArray = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
            const r = 20 + Math.random() * 30;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 2;
    posArray[i] = Math.sin(theta) * Math.cos(phi) * r;
    posArray[i + 1] = Math.sin(theta) * Math.sin(phi) * r;
    posArray[i + 2] = Math.cos(theta) * r;
        }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starsMat = new THREE.PointsMaterial({color: 0xffffff, size: 0.15, transparent: true, opacity: 0.8 });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // --- ANIMATION LOOP ---
    function animate() {
        requestAnimationFrame(animate);

    // Rotate some objects for liveliness
    knot.rotation.y += 0.002;
    knot.rotation.x += 0.001;
    coreSphere.rotation.x += 0.001;
    coreSphere.rotation.y += 0.002;
    stars.rotation.y += 0.0002;

    controls.update(); // for auto-rotate

    renderer.render(scene, camera);
        }
    animate();

    // --- RESIZE HANDLER ---
    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
        }

    // --- CALCULATOR LOGIC (separate, but integrated) ---
    // This is a simple but robust calculator with standard operations
    class Calculator {
        constructor(prevEl, currEl) {
        this.prevEl = prevEl;
    this.currEl = currEl;
    this.clear();
            }

    clear() {
        this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.updateDisplay();
            }

    delete() { // not used directly but could be mapped
                if (this.currentOperand.length > 1) {
        this.currentOperand = this.currentOperand.slice(0, -1);
                } else {
        this.currentOperand = '0';
                }
            }

    appendNumber(number) {
                if (number === '.' && this.currentOperand.includes('.')) return;
    if (this.currentOperand === '0' && number !== '.') {
        this.currentOperand = number;
                } else {
        this.currentOperand += number;
                }
            }

    chooseOperation(operation) {
                if (this.currentOperand === '') return;
    if (this.previousOperand !== '') {
        this.compute();
                }
    this.operation = operation;
    this.previousOperand = this.currentOperand + ' ' + this.getSymbol(operation);
    this.currentOperand = '';
            }

    getSymbol(op) {
                switch (op) {
                    case '/': return '÷';
    case '*': return '×';
    case '-': return '−';
    case '+': return '+';
    default: return op;
                }
            }

    compute() {
        let computation;
    const prev = parseFloat(this.previousOperand.split(' ')[0]);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
                    case '+':
    computation = prev + current;
    break;
    case '-':
    computation = prev - current;
    break;
    case '*':
    computation = prev * current;
    break;
    case '/':
    computation = prev / current;
    break;
    default:
    return;
                }
    this.currentOperand = computation.toString();
    this.operation = undefined;
    this.previousOperand = '';
            }

    updateDisplay() {
        this.currEl.innerText = this.currentOperand || '0';
    this.prevEl.innerText = this.previousOperand || '';
            }

    handleSign() {
                if (this.currentOperand !== '0' && this.currentOperand !== '') {
        this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
                }
            }

    handlePercent() {
                if (this.currentOperand !== '0' && this.currentOperand !== '') {
        this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
                }
            }
        }

    // Initialize calculator with DOM elements
    const prevEl = document.getElementById('previous-operand');
    const currEl = document.getElementById('current-operand');
    const calculator = new Calculator(prevEl, currEl);

        // Event listeners for buttons
        document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = button.dataset.action;

            if (action === 'number') {
                calculator.appendNumber(button.dataset.value);
                calculator.updateDisplay();
            } else if (action === 'operator') {
                calculator.chooseOperation(button.dataset.value);
                calculator.updateDisplay();
            } else if (action === 'clear') {
                calculator.clear();
            } else if (action === 'equals') {
                calculator.compute();
                calculator.updateDisplay();
            } else if (action === 'decimal') {
                calculator.appendNumber('.');
                calculator.updateDisplay();
            } else if (action === 'sign') {
                calculator.handleSign();
                calculator.updateDisplay();
            } else if (action === 'percent') {
                calculator.handlePercent();
                calculator.updateDisplay();
            }

            // Add tiny haptic feedback simulation (vibrate if supported)
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(10);
            }
        });
        });

        // Prevent touch events from being swallowed by canvas
        document.querySelector('.calculator-card').addEventListener('touchstart', (e) => {
        e.stopPropagation();
        }, {passive: true });

    console.log('3D Calculator ready!');
