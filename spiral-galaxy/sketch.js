// -----------------------------------------------------
// code adapted from https://codepen.io/Astrak/pen/BoBWPB
// not my code! just rewriting for learning
// -----------------------------------------------------
var t            = 0;
var z            = 0;
var howMuch      = 0;
var times        = 0;
var val          = 0;
var numStars     = 10000;
var scene, camera, renderer, controls, galaxyMaterial;

init();
animate();

// -----------------------------------------------------
function init() {
  console.log('init called');
  // setup scene
  scene = new THREE.Scene();

  // setup camera
  camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.5, 1500);
  camera.position.set(-20, -150, 90);

  // setup renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x000000);
  document.body.appendChild(renderer.domElement);

  // setup controls
  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.noPan = true;
  controls.noZoom = false;
  controls.rotateSpeed = 20;
  controls.dynamicDampingFactor = 0.5;

  // create and add galaxy to the scene
  setupGalaxy();

  // add event listener for window resize
  window.addEventListener('resize', function() {
    camera.aspect = innerWidth / innerHeight;
    renderer.setSize(innerWidth, innerHeight);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  }, false);
}

// -----------------------------------------------------
function createGalaxy() {
  // to get arms, the main galaxy shape has to be an ellipse
  // axis1/axis2 must raise over a certain %

  var axis1 = 60 + Math.random() * 20;
  var axis2 = axis1 + 10 + Math.random();

  // axis1 needs to be bigger for excentricity to work
  var majorA;
  var minorA;

  if (axis1 > axis2) {
    majorA = axis1;
    minorA = axis2;
  } else if (axis1 == axis2) {
    majorA = axis1 + 1;
    minorA = axis2;
  } else {
    majorA = axis2;
    minorA = axis1;
  }

  // Radians from the center to the end of each arm
  // Range value between 6 and 18
  // let minAngle  = 6;
  // let maxAngle  = 18;
  var armsAngle = Math.random() * 12 + 6;

  var ellipseFactor = 0.2 + Math.random() * 0.2;
  var stars = [];

  for (let i = 0; i < numStars; i++) {
    var dist = Math.random();
    var angle = dist * armsAngle;

    // ellipse params
    var a   = majorA * dist;
    var b   = minorA * dist;
    var e   = Math.sqrt(a*a - b*b) / a;
    var phi = ellipseFactor * Math.PI/2 * (1 - dist) * (Math.random() * 2 - 1);

    // create point on the ellipse with polar coords
    // random angle from center
    var theta = Math.random() * Math.PI * 2;

    // get radius from theta in polar coords
    var spread = 0.5;
    var radius = Math.sqrt((b * b) / (spread - (0.3
       * e) *  Math.pow(Math.cos(theta), 2)));
    theta += angle;

    // convert to cartesian coords
    let star = {
      x : Math.cos(phi) * Math.cos(theta) * radius,
      y : Math.cos(phi) * Math.sin(theta) * radius,
      z : Math.sin(phi) * radius
    }
    stars.push(star);
  }

  return stars;
}

// -----------------------------------------------------
function setupGalaxy() {
  console.log('setupGalaxy called');
  galaxyMaterial = new THREE.ShaderMaterial({
      vertexShader   : document.getElementById('vShader').textContent,
      fragmentShader : document.getElementById('fShader').textContent,
      uniforms       : {
        size         : {type:'f',value:3.3},
        t            : {type:"f",value:0},
        z            : {type:"f",value:0},
        pixelRatio   : {type:"f",value:innerHeight}
      },
      transparent    : true,
      depthTest      : false,
      blending       : THREE.AdditiveBlending
    });

  var starsGeometry = new THREE.Geometry();
  starsGeometry.vertices = createGalaxy();
  galaxy = new THREE.Points(starsGeometry, galaxyMaterial);
  console.log(scene);
  scene.add(galaxy);
}

// -----------------------------------------------------
function animate() {
  // console.log('animate called');
  galaxyMaterial.uniforms.t.value = t;
  galaxyMaterial.uniforms.z.value = z;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  scene.rotation.z += 0.001;
  controls.update();
}

// -----------------------------------------------------
