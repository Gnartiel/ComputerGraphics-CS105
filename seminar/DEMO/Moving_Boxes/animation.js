// ---------- ---------- ----------
// SCENE, CAMERA, and RENDERER
// ---------- ---------- ----------
const scene = new THREE.Scene();
var gui = new dat.GUI();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000);
camera.position.set(0,2,7);

camera.lookAt(0,0,0);

const renderer = THREE.WebGL1Renderer ? new THREE.WebGL1Renderer() : new THREE.WebGLRenderer;
renderer.setSize(window.innerWidth, window.innerHeight);
( document.getElementById('demo') || document.body ).appendChild(renderer.domElement);
// ---------- ----------
// HELPERS
// ---------- ----------
function getPlane(size){
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshBasicMaterial({color: 'rgb(120, 120, 120)', side: THREE.DoubleSide,});
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
} 

var plane = getPlane(100);
plane.rotation.x = Math.PI/2;
plane.position.y = -2;
scene.add(plane);

const demoGroupCreate = (count) => {
    const demoGroup = new THREE.Group();
    let i = 0;
    while(i < count){
        const material = new THREE.MeshNormalMaterial({
            transparent: true, 
            opacity: 1 
        });
        const mesh = new THREE.Mesh( new THREE.BoxGeometry(1,1,1), material );
        demoGroup.add(mesh);
        i += 1;
    }
    return demoGroup;
};
const demoGroupInit = function(demoGroup, forMesh){
    forMesh = forMesh || function(){};
    const len = demoGroup.children.length; 

    demoGroup.children.forEach(function(mesh, i){
        mesh.material.opacity = 1;
        mesh.position.x = 0;
        
        mesh.position.z = -5 + 10 * (i / (len -1 ));
        mesh.scale.set(1, 1, 1); 
        mesh.rotation.set(0, 0, 0); 
        forMesh(mesh, i);
    });
    demoGroup.position.set(0, 0, 0);
    demoGroup.rotation.set(0, 0, 0);
};
const demoGroupUpdate1 = (demogroup, a1) => {
    const a2 = 1 - Math.abs(0.5 - a1) / 0.5;
    const len = demoGroup.children.length;
    demoGroupInit(demoGroup, function(mesh, i){
        mesh.material.opacity = 1;
        // POSITION FOR EACH MESH
        const orderPer = (i + 1) / len,
        orderBias = 1 - Math.abs(0.5 - orderPer) / 0.5,
        radian = Math.PI * 0.5 + (-Math.PI + Math.PI * orderBias) * a2,
        radius = 5 - 10 * orderPer;
        mesh.position.x = Math.cos(radian) * radius;
        mesh.position.z = Math.sin(radian) * radius;
        // SCALE FOR EACH MESH
        const scalar = 1 + ( -0.25 + 1.50 * orderPer * a2) * orderPer;
        mesh.scale.multiplyScalar(scalar);
        // ROTATION FOR EACH MESH
        mesh.rotation.y = Math.PI * 0.5 * a2 * orderPer;
        mesh.rotation.x = Math.PI * 8 * orderPer * a2;
    });
};


// ---------- ----------
// OBJECTS
// ---------- ----------
var demoGroup = demoGroupCreate(4);
demoGroupInit(demoGroup);
scene.add(demoGroup);


// ---------- ----------
// ANIMATION LOOP
// ---------- ----------
const FPS_UPDATE = 20, 
FPS_MOVEMENT = 30;    
FRAME_MAX = 300;
let secs = 0, 
frame = 0, 
lt = new Date(); 
// update trạng thái của đối tượng trong khung hình
const update = function(frame, frameMax){
    // alpha values
    const a1 = frame / frameMax;
    demoGroupUpdate1(demoGroup, a1)
};
const loop = () => {
    const now = new Date(),
    secs = (now - lt) / 1000;
    requestAnimationFrame(loop);
    if(secs > 1 / FPS_UPDATE){
        // update, render
        update( Math.floor(frame), FRAME_MAX);
        renderer.render(scene, camera);
        // step frame
        frame += FPS_MOVEMENT * secs;
        frame %= FRAME_MAX;
        lt = now;
    }
};
loop();
var guiControls = new function () {
    this.boxCount = 4; // Số lượng box mặc định
};

var boxCountController = gui.add(guiControls, 'boxCount', 1, 5).step(1).name('Box Count');
boxCountController.onChange(function (value) {
    // Xóa tất cả các box hiện có trong demoGroup
    while (demoGroup.children.length > 0) {
        demoGroup.remove(demoGroup.children[0]);
    }

    // Tạo lại các box mới dựa trên số lượng box mới
    demoGroup = demoGroupCreate(value);
    demoGroupInit(demoGroup);
    scene.add(demoGroup);
});

