console.log(THREE);

function init(type) //type = {scale, rotation, move}
{
    var scene = new THREE.Scene();

    scene.fog = new THREE.FogExp2(0xffffff, 0.2);
    var box = getBox(1, 1, 1);
    var plane = getPlane(4);
    plane.name = 'plane-1';

    box.position.y = box.geometry.parameters.height / 2;
    plane.rotation.x = Math.PI / 2;
    plane.position.y = 1;
    plane.add(box);
    scene.add(plane);


    var camera = new THREE.PerspectiveCamera(
        45, window.innerWidth / window.innerHeight,
        1, 1000
    );
    camera.position.z = 5;
    camera.position.x = 1;
    camera.position.y = 2;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('rgb(255,255,255)');
    document.getElementById('webgl').appendChild(renderer.domElement);
    renderer.render(scene, camera);

    update(renderer, scene, camera);

    return scene;
}

function getBox(w, h, d) {
    var geometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00
    });
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

function update(renderer, scene, camera) {
    renderer.render(scene, camera);
    var plane = scene.getObjectByName('plane-1');
    plane.rotation.y += 0.001;
    plane.rotation.z += 0.001;

    scene.traverse(function(child) {
        child.scale.x += 0.001;
    })

    // plane.position.y += 0.001;
    requestAnimationFrame(function() {
        update(renderer, scene, camera);
    })
}

function getPlane(size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide
    });
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
}
var scene = init();