var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({canvas: document.getElementById("canvas"), antialias: true});
renderer.setPixelRatio(window.devicePixelRadio);
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
// document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var controls = new THREE.OrbitControls(camera, renderer.domElement);

camera.position.x = -100;
camera.position.y = -20;
camera.position.z = -100;

var axesHelper = new THREE.AxesHelper(2.25);
scene.add(axesHelper);

var octree;
var q;

function createOctree(m, n) {
	let box = new Box(m/2, m/2, m/2, m/2, m/2, m/2);
	octree = new OcTree(box, n);
}

function createPoint(m, n) {
	for (let i = 0; i < n; i++) {
		let x = Math.random()*m;
		let y = Math.random()*m;
		let z = Math.random()*m;
		let point = new Point(x, y, z);
		octree.insert(point);
	}
}

controls.update();

var animate = function() {
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);
};

animate();