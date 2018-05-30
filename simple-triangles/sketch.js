// -----------------------------------------------------
// from https://codepen.io/blackratio/pen/NrrZGm?editors=1010
// -----------------------------------------------------

var container, stats;
var camera, scene, renderer;

init();
animate();

// -----------------------------------------------------
function init() {
  container         = document.getElementById('container');
  scene = new THREE.Scene();
  camera            = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 2, 50);
  camera.position.z = 2;
  let triangles     = 25;

  // setup geometry
  let geometry = new THREE.BufferGeometry();

  // because each triangle has 3 vertices, and each vertex has three coordinates
  let vertices = new Float32Array(triangles * 3 * 3);

  // Setup vertices as attribute of BufferGeometry
  for (let i = 0; i < vertices.length; i += 3) {
    vertices[i    ] = Math.random() - 0.5;
    vertices[i + 1] = Math.random() - 0.5;
    vertices[i + 2] = Math.random() - 0.5;
  }
  geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));

  // Setup colors as attribute of BufferGeometry
  let colors = new Uint8Array(triangles * 3 * 4);
  for (let i = 0, l = triangles * 3 * 4; i < l; i += 4) {
    colors[ i     ] = Math.random() * 255;
		colors[ i + 1 ] = Math.random() * 255;
		colors[ i + 2 ] = Math.random() * 255;
		colors[ i + 3 ] = Math.random() * 255;
  }
  geometry.addAttribute('color', new THREE.BufferAttribute(colors, 4, true));

  // setup material with shaders
  let material = new THREE.RawShaderMaterial({
    uniforms       : {
      time         : {
        value      : 9.9
      }
    },
    vertexShader   : document.getElementById('vertexShader').textContent,
    fragmentShader : document.getElementById('fragmentShader').textContent,
    side           : THREE.DoubleSide,
    transparent    : true
  });

  // debugging material
  // let wireMat = new THREE.MeshBasicMaterial({
  //   wireframe: true,
  //   color: 0x000000
  // });

  let mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // setup renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xffffff);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);
}

// -----------------------------------------------------
function animate() {
  requestAnimationFrame(animate);
  render();
}

// -----------------------------------------------------
function render() {
  let time = performance.now();
  let object = scene.children[0];
  object.rotation.y = time * 0.0009;
  object.material.uniforms.time.value = time * 0.009;
  renderer.render(scene, camera);
}

// -----------------------------------------------------
function onWindowResize(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// -----------------------------------------------------
