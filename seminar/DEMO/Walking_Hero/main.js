//THREEJS RELATED VARIABLES 

var scene, sphere,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    gobalLight, shadowLight, backLight,
    renderer,
    container,
    controls;

// OTHER VARIABLES

var PI = Math.PI;
var hero;
var container;
var sphereRotation = 0;
// MATERIALS

var brownMat = new THREE.MeshStandardMaterial({
    color: 0x401A07,
    side: THREE.DoubleSide,
    roughness: 1
});

var blackMat = new THREE.MeshPhongMaterial({
    color: 0x100707
});

var redMat = new THREE.MeshPhongMaterial({
    color: 0xAA5757
});

var blueMat = new THREE.MeshPhongMaterial({
    color: 0x5b9696
});

var whiteMat = new THREE.MeshPhongMaterial({
    color: 0xffffff
});

var currentMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000
});


//INIT THREE JS, SCREEN AND MOUSE EVENTS

function initScreenAnd3D() {
    var backgroundColor = 0xd6eae6; // Màu nền của background (ví dụ: xanh dương)
    var background = new THREE.Color(backgroundColor);
    container = document.getElementById('world');
    HEIGHT = container.offsetHeight;
    WIDTH = container.width;
    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;

    scene = new THREE.Scene();

    scene.fog = new THREE.Fog(0xd6eae6, 150, 300);
    scene.background = background;
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 50;
    nearPlane = 1;
    farPlane = 2000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    camera.position.x = 10;
    camera.position.z = 100;
    camera.position.y = 0;
    //camera.lookAt(new THREE.Vector3(0, 30, 0));

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
    renderer.shadowMap.enabled = true;

    container.appendChild(renderer.domElement);

    window.addEventListener('resize', handleWindowResize, false);

    handleWindowResize();
}

function handleWindowResize() {
    HEIGHT = container.offsetHeight;
    WIDTH = container.offsetWidth;
    windowHalfX = WIDTH / 5;
    windowHalfY = HEIGHT / 5;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

function createLights() {
    globalLight = new THREE.AmbientLight(0xffffff, 1);
    shadowLight = new THREE.DirectionalLight(0xffffff, 1);
    shadowLight.position.set(10, 8, 8);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -40;
    shadowLight.shadow.camera.right = 40;
    shadowLight.shadow.camera.top = 40;
    shadowLight.shadow.camera.bottom = -40;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;
    shadowLight.shadow.mapSize.width = shadowLight.shadow.mapSize.height = 2048;
    scene.add(globalLight);
    scene.add(shadowLight);
}

Hero = function() {
    this.runningCycle = 0;
    this.mesh = new THREE.Group();
    this.body = new THREE.Group();
    this.mesh.add(this.body);

    var torsoGeom = new THREE.BoxGeometry(8, 8, 8, 1); //
    this.torso = new THREE.Mesh(torsoGeom, blueMat);
    this.torso.position.y = 8;
    this.torso.castShadow = true;
    this.body.add(this.torso);

    var handGeom = new THREE.BoxGeometry(3, 3, 3, 1);
    this.handR = new THREE.Mesh(handGeom, brownMat);
    this.handR.position.z = 7;
    this.handR.position.y = 8;
    this.body.add(this.handR);

    this.handL = this.handR.clone();
    this.handL.position.z = -this.handR.position.z;
    this.body.add(this.handL);

    var headGeom = new THREE.BoxGeometry(16, 16, 16, 1); //
    this.head = new THREE.Mesh(headGeom, blueMat);
    this.head.position.y = 21;
    this.head.castShadow = true;
    this.body.add(this.head);

    var legGeom = new THREE.BoxGeometry(8, 3, 5, 1);

    this.legR = new THREE.Mesh(legGeom, brownMat);
    this.legR.position.x = 0;
    this.legR.position.z = 7;
    this.legR.position.y = 0;
    this.legR.castShadow = true;
    this.body.add(this.legR);

    this.legL = this.legR.clone();
    this.legL.position.z = -this.legR.position.z;
    this.legL.castShadow = true;
    this.body.add(this.legL);

    this.body.traverse(function(object) {
        if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
        }
    });
}

Hero.prototype.run = function() {
    this.runningCycle += .03;
    var t = this.runningCycle;
    t = t * PI;
    var amp = 4;

    this.legR.position.x = Math.cos(t) * amp;
    this.legR.position.y = Math.max(0, -Math.sin(t) * amp);

    this.legL.position.x = Math.cos(t + PI) * amp;
    this.legL.position.y = Math.max(0, -Math.sin(t + PI) * amp);

    if (t > PI) {
        this.legR.rotation.z = Math.cos(t * 2 + PI / 2) * PI / 4;
        this.legL.rotation.z = 0;
    } else {
        this.legR.rotation.z = 0;
        this.legL.rotation.z = Math.cos(t * 2 + PI / 2) * PI / 4;
    }

    this.torso.position.y = 8 - Math.cos(t * 2) * amp * .2;
    this.torso.rotation.y = -Math.cos(t + PI) * amp * .05;

    this.head.position.y = 21 - Math.cos(t * 2) * amp * .3;
    this.head.rotation.x = Math.cos(t) * amp * .02;
    this.head.rotation.y = Math.cos(t) * amp * .01;

    this.handR.position.x = -Math.cos(t) * amp;
    this.handR.rotation.z = -Math.cos(t) * PI / 8;
    this.handL.position.x = -Math.cos(t + PI) * amp;
    this.handL.rotation.z = -Math.cos(t + PI) * PI / 8;
}

function createSphere(radius, material) {
    var geometry = new THREE.SphereGeometry(radius, 24, 24);
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

function createCone(radius, height, material) {
    var geometry = new THREE.ConeGeometry(radius, height, 24);
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

function createHero() {
    hero = new Hero();
    hero.mesh.position.y = -15;

    var sphereRadius = 300;
    var sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x32CD32 });
    sphere = createSphere(sphereRadius, sphereMaterial);
    sphere.position.y = -sphereRadius - 20; // Đặt vị trí theo chiều y
    var coneRadius = 100;
    var coneHeight = 500;
    var coneMaterial = new THREE.MeshPhongMaterial({ color: 0x006400 });
    var cone1 = createCone(coneRadius, coneHeight, coneMaterial);
    cone1.position.set(50, 100, 30); // Đặt vị trí theo tọa độ x, y, z
    sphere.add(cone1);

    var cone2 = createCone(coneRadius, coneHeight, coneMaterial);
    cone2.position.set(-50, 100, -40); // Đặt vị trí theo tọa độ x, y, z
    sphere.add(cone2);
    // Tạo các hình nón bên trái của hero
    for (let i = -10; i < 11; i++) {
        var cone = createCone(coneRadius, coneHeight, coneMaterial);
        cone.position.set(i * (-10), 100, -50);
        // cone.position.normalize().multiplyScalar(sphereRadius + coneHeight / 2);
        sphere.add(cone);
    }
    scene.add(sphere);
    scene.add(hero.mesh);
}
var rot = -1;

function loop() {

    updateTrigoCircle(hero.runningCycle);
    hero.run();
    rot += .01;
    hero.mesh.rotation.y = -Math.PI / 4 + Math.sin(rot * Math.PI / 8);
    sphereRotation += 0.01;
    sphere.rotation.z = sphereRotation;
    render();
    requestAnimationFrame(loop);
}

function render() {
    renderer.render(scene, camera);
}

window.addEventListener('load', init, false);

function init(event) {
    initScreenAnd3D();
    createLights();
    createHero();
    loop();
}


// Trigo Circle

var PI = Math.PI;
var trigoArc = document.getElementById("trigoArc");
var trigoLine = document.getElementById("trigoLine");
var trigoPoint = document.getElementById("trigoPoint");
var cosPoint = document.getElementById("cosPoint");
var sinPoint = document.getElementById("sinPoint");
var cosLine = document.getElementById("cosLine");
var sinLine = document.getElementById("sinLine");
var projSinLine = document.getElementById("projSinLine");
var projCosLine = document.getElementById("projCosLine");

var cAngle = 10;
var tp = {
    radiusArc: 100,
    centerX: 60,
    centerY: 60,
    radiusLines: 50,
};

function updateTrigoCircle(angle) {
    angle %= PI * 2;
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    var start = {
        x: tp.centerX + tp.radiusArc * cos,
        y: tp.centerY + tp.radiusArc * sin
    };
    var end = {
        x: tp.centerX + tp.radiusArc,
        y: tp.centerY
    };

    var arcSweep = angle >= PI ? 1 : 0;
    var d = ["M", tp.centerX, tp.centerY,
        "L", start.x, start.y,
        "A", tp.radiusArc, tp.radiusArc, 0, arcSweep, 0, end.x, end.y,
        "L", tp.centerX, tp.centerY
    ].join(" ");

    trigoArc.setAttribute("d", d);
    trigoLine.setAttribute("x2", tp.centerX + cos * tp.radiusLines);
    trigoLine.setAttribute("y2", tp.centerY + sin * tp.radiusLines);
    trigoPoint.setAttribute("cx", tp.centerX + cos * tp.radiusLines);
    trigoPoint.setAttribute("cy", tp.centerY + sin * tp.radiusLines);
    cosPoint.setAttribute("cx", tp.centerX + cos * tp.radiusLines);
    sinPoint.setAttribute("cy", tp.centerY + sin * tp.radiusLines);
    cosLine.setAttribute("x2", tp.centerX + cos * tp.radiusLines);
    sinLine.setAttribute("y2", tp.centerY + sin * tp.radiusLines);
    projSinLine.setAttribute("x2", tp.centerX + cos * tp.radiusLines);
    projSinLine.setAttribute("y2", tp.centerY + sin * tp.radiusLines);
    projSinLine.setAttribute("y1", tp.centerY + sin * tp.radiusLines);
    projCosLine.setAttribute("x2", tp.centerX + cos * tp.radiusLines);
    projCosLine.setAttribute("x1", tp.centerX + cos * tp.radiusLines);
    projCosLine.setAttribute("y2", tp.centerY + sin * tp.radiusLines);
}