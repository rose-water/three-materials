// --------------------------------------------------------------
// from https://codepen.io/rosewater/pen/NMoyGN?editors=0010
// This is mostly around seeing the behavior for subdivision
// and is missing all the shader stuff and post processing
// with multi pass.
//
// To look through:
// http://luxiyalu.com/render-post-processing-with-three-js/
// --------------------------------------------------------------

var FOV      = 2;
var RES      = 8;
var BGCOLOR  = 0x7070C0;

var PI       = Math.PI;
var TAU      = PI * 2;
var sin      = Math.sin;
var cos      = Math.cos;
var ratio    = window.innerWidth / window.innerHeight;
var lastTime = 0;

var renderer, camera, scene;
var geometry, subdiv, cube;
var fillLight, rimLight, ambiLight;
var vNormalsHelper;

init();
animate(0);

// --------------------------------------------------------------
function init() {
  setupRenderer();
  setupCamera();
  setupLights();
  setupScene();
}

// --------------------------------------------------------------
function setupRenderer() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color(BGCOLOR));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);
}

// --------------------------------------------------------------
function setupCamera() {
  camera = new THREE.PerspectiveCamera(FOV, ratio, 1, 500);
  camera.position.y = 20;
  camera.position.z = 50;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
}

// --------------------------------------------------------------
function setupLights() {
  let lightsPos = new THREE.Vector3(15, -5, 10);

  // setup fill light
  fillLight = new THREE.DirectionalLight(0xAACCFF, 0.25);
  fillLight.position.set(lightsPos.x, lightsPos.y, lightsPos.z);
  fillLight.castShadow = true;
  fillLight.shadow.mapSize.width = 2048;
  fillLight.shadow.mapSize.height = 2048;
  fillLight.shadow.camera.near = 1;
  fillLight.shadow.camera.far = 100;

  // setup rimLight
  rimLight = new THREE.DirectionalLight(0xFFBB88, 1.75);
  rimLight.position.set(-lightsPos.x, -lightsPos.y, -lightsPos.z);
  rimLight.castShadow = true;
  rimLight.shadow.mapSize.width = 2048;
  rimLight.shadow.mapSize.height = 2048;
  rimLight.shadow.camera.near = 1;
  rimLight.shadow.camera.far = 100;

  // setup ambient light
  ambiLight = new THREE.AmbientLight(BGCOLOR, 0.128);
}

// --------------------------------------------------------------
function setupScene() {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(BGCOLOR, .01);

  // setup geometry
  // RES in this case refers to segments in width/height/depth
  geometry = new THREE.BoxGeometry(1, 1, 1, RES, RES, RES);

  // setup SubdivisionModifier
  subdiv = new THREE.SubdivisionModifier(1);

  // Modify box geometry
  for (var index in geometry.vertices) {
    let vert = geometry.vertices[index];

    // If we normalize all the vertices we end up with a sphere
    // I take this to mean that we are normalizing relative to some origin
    // Which should be the center of the BoxGeometry?
    vert.normalize();
    vert.multiplyScalar(.5);

    // Some vertex displacement
    vert.x += (Math.random() * 2 - 1) / 10;
    vert.y += (Math.random() * 2 - 1) / 10;
    vert.z += (Math.random() * 2 - 1) / 10;
  }

  subdiv.modify(geometry);
  subdiv.modify(geometry);
  subdiv.modify(geometry);

  // check for duplicate vertices
  geometry.mergeVertices();

  // compute vertex normals
  geometry.computeVertexNormals();

  // setup material
  let material = new THREE.MeshPhongMaterial({
    color     : 0x8899CC,
    specular  : 0x888888,
    wireframe : false,
    shininess : 10,
    shading   : THREE.FlatShading,
    fog       : true
  });

  // setup mesh
  cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  cube.receiveShadow = true;

  // Vertex normals helper
  // vNormalsHelper = new THREE.VertexNormalsHelper(cube, 0.1, 0xffffff, 0.1);
  // scene.add(vNormalsHelper);

  // add everything to scene
  scene.add(fillLight);
  scene.add(rimLight);
  scene.add(ambiLight);

  scene.add(cube);
}

// --------------------------------------------------------------
function animate(time) {
  let dt = time - lastTime;
  lastTime = time;
  // vNormalsHelper.update();
  cube.rotation.y += dt / 1000;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// --------------------------------------------------------------
