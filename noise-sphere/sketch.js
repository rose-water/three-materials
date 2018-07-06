// -----------------------------------------------------
// adapted from https://codepen.io/farisk/pen/vrbzwL?editors=0010
// -----------------------------------------------------
var container;
var camera, scene, renderer;
var sphere;

init();
animate();

// -----------------------------------------------------
function init() {
  setupRenderer();
  setupCamera();
  setupScene();

  window.addEventListener('resize', onWindowResize, false);
}

// -----------------------------------------------------
function setupCamera() {
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
}

// -----------------------------------------------------
function setupScene() {
  scene = new THREE.Scene();

  var sphereGeo = new THREE.SphereGeometry(20, 128, 128);
  var sphereMat = new THREE.MeshNormalMaterial();
  sphere        = new THREE.Mesh(sphereGeo, sphereMat);

  scene.add(camera);
  scene.add(sphere);
}

// -----------------------------------------------------
function setupRenderer() {
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('canvas'),
    antialias: true
  });
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// -----------------------------------------------------
function update() {
  var time = performance.now() * 0.0005;

  // reposition vertices
  var modifier1 = 0.8;
  var modifier2 = 1.3;
  for (var i = 0; i < sphere.geometry.vertices.length; i++) {
    let vert = sphere.geometry.vertices[i];
    vert.normalize().multiplyScalar(1 + modifier1 * noise.perlin3(vert.x * modifier2 + time, vert.y * modifier2 + time, vert.z * modifier2));
  }

  sphere.geometry.computeVertexNormals();
  sphere.geometry.normalsNeedUpdate  = true;
  sphere.geometry.verticesNeedUpdate = true;
}

// -----------------------------------------------------
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// -----------------------------------------------------
function animate() {
  update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// -----------------------------------------------------
