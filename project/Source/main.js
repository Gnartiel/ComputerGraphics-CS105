var activeControl = false,
    hasLight = false,
    hasBackground = false,
    alpha = 0,
    playMusic = false,
    materialColor = 0x910b1c;
    const params = {
        color: '#eed1ff'
        };

// Play audio
$(".controls-music-btn").click(() => {
    if (!playMusic) {
        playMusic = true;
        $("#audio").get(0).play();
        $(".controls-music-btn").addClass("active");
    } else {
        playMusic = false;
        $("#audio").get(0).pause();
        $(".controls-music-btn").removeClass("active");
    }
});

function init() {
    var scene = new THREE.Scene();
    var geometry, material, mesh;
    material = new THREE.MeshBasicMaterial({ color: "#910b1c" });


    var gridHelper = new THREE.GridHelper(150, 30, "#333", "#333");
    gridHelper.position.y = -5;
    scene.add(gridHelper);
    scene.background = new THREE.Color( params.color );
    var pointLight = getPointLight(0xffffff, 10, 100);
    var spotLight = getSpotLight(0xffffff, 10, 100);
    //BACKGROUND
    var points = getBackgroundAllPoints();
    var particles = setPoint();
    var texture =  createGradientTexture();

    var gui = new dat.GUI();
    gui.domElement.id = "GUI";
      gui.addColor(params, 'color').name("Background").onChange(function(value) {

        scene.background.set( value );
    
      });

    //Handle event on click geometry
    $(".geometry").click(function () {
        if (activeControl) {
            $(".controls-btn.active").removeClass("active");
            transformControls.detach(mesh);
        }

        var geometryName = $(this).text();

        switch (geometryName) {
            case "Box":
                geometry = new THREE.BoxGeometry(9, 9, 9);
                break;
            case "Sphere":
                geometry = new THREE.SphereGeometry(5);
                break;
            case "Cone":
                geometry = new THREE.ConeGeometry(5, 9.5, 32);
                break;
            case "Cylinder":
                geometry = new THREE.CylinderGeometry(5, 5, 9.5, 32);
                break;
            case "Torus":
                geometry = new THREE.TorusGeometry(3, 1.5, 16, 100);
                break;
            case "Torus Knot":
                geometry = new THREE.TorusKnotGeometry(3, 1, 100, 16);
                break;
            case "Tetrahedron":
                geometry = new THREE.TetrahedronGeometry(8.5, 0);
                break;
            case "Octahedron":
                geometry = new THREE.OctahedronGeometry(5, 1);
                break;
            case "Dodecahedron":
                geometry = new THREE.DodecahedronGeometry(5, 1);
                break;
            case "Icosahedron":
                geometry = new THREE.IcosahedronGeometry(5.8, 0);
                break;
            case "Circle":
                geometry = new THREE.CircleGeometry(5, 32);
                break;
            case "Tube":
                geometry = new THREE.TubeGeometry(getTube(3), 15, 2, 8, false);
                break;
            case "Heart":
                geometry = new THREE.ExtrudeGeometry(getHeart(), { amount: 2, bevelEnable: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 });
                geometry.rotateX(Math.PI)
                break;
            case "Teapot":
                geometry = new THREE.TeapotGeometry(5, 10);
                break;
        }
        mesh = new THREE.Mesh(geometry, material);

        scene.remove(scene.getObjectByName("geometry"));

        mesh.name = "geometry";
        mesh.castShadow = true;

        scene.add(mesh);
    });

    // Handle event when upload geometry file is selected
    $("#uploadGeometry").change(function (event) {
        var file = event.target.files[0];
        var loader = new THREE.GLTFLoader();

        loader.load(
            URL.createObjectURL(file),
            function (gltf) {
                var object = gltf.scene;

                // Remove existing mesh
                scene.remove(scene.getObjectByName("geometry"));

                // Set the material of the loaded object (modify as needed)
                object.traverse(function (child) {
                    if (child.isMesh) {
                        //child.scale.set( 0.2, 0.2, 0.2 );
                        child.material = material;
                        child.castShadow = true;
                    }
                });

                object.name = "geometry";
                scene.add(object);
                object.scale.set(0.2, 0.2, 0.2);
                // Update the geometry variable
                geometry = object.children[0].geometry.clone();
                geometry.scale(0.2, 0.2, 0.2);
                // Update the mesh with the new geometry
                mesh.geometry.dispose();
                mesh.geometry = geometry;

                // Assign the new mesh to the transform controls
                transformControls.detach();
                mesh = object.children[0];
                transformControls.attach(mesh);

                //mesh.scale.set(0.2, 0.2, 0.2);
            },
            undefined,
            function (error) {
                console.error("An error occurred while loading the geometry:", error);
            }
        );        
    });

    var colorGUI = gui.addFolder("Color");
    addColorGUI(material, "Geometry Color", { color: 0x910b1c }, colorGUI);
    colorGUI.close();
    //Handle event on click surface
    $(".surface").click(function () {
        if (activeControl) {
            $(".controls-btn.active").removeClass("active");
            transformControls.detach(mesh);
        }

        var loader = new THREE.TextureLoader();
        scene.remove(scene.getObjectByName("geometry"));

        var materialName = $(this).text(),
            materialColor = material.color;

        switch (materialName) {
            case "Point":
                material = new THREE.PointsMaterial({ color: materialColor, size: 0.2 });
                mesh = new THREE.Points(geometry, material);
                break;
            case "Line":
                material = new THREE.LineBasicMaterial({ color: materialColor });
                mesh = new THREE.Line(geometry, material);
                break;
            case "Solid":
                material = new THREE.MeshBasicMaterial({ color: materialColor });
                mesh = new THREE.Mesh(geometry, material);
                break;
            case "Weave":
                material = new THREE.MeshBasicMaterial({
                    map: loader.load("./assets/textures/weave.jpg"),
                });
                mesh = new THREE.Mesh(geometry, material);
                break;
            case "Floor wood":
                material = new THREE.MeshBasicMaterial({
                    map: loader.load("./assets/textures/floor-wood.jpg"),
                });
                mesh = new THREE.Mesh(geometry, material);
                break;
            case "Grasslight":
                material = new THREE.MeshBasicMaterial({
                    map: loader.load("./assets/textures/grasslight-big.jpg"),
                });
                mesh = new THREE.Mesh(geometry, material);
                break;
            case "Plaster":
                material = new THREE.MeshBasicMaterial({
                    map: loader.load("./assets/textures/plaster.jpg"),
                });
                mesh = new THREE.Mesh(geometry, material);
                break;
            case "Stone":
                material = new THREE.MeshBasicMaterial({
                    map: loader.load("./assets/textures/stone.jpg"),
                });
                mesh = new THREE.Mesh(geometry, material);
                break;
            case "Water":
                material = new THREE.MeshBasicMaterial({
                    map: loader.load("./assets/textures/water.jpg"),
                });
                mesh = new THREE.Mesh(geometry, material);
                break;
            case "Satin":
                material = new THREE.MeshBasicMaterial({
                    map: loader.load("./assets/textures/satin.jpg"),
                });
                mesh = new THREE.Mesh(geometry, material);
                break;
            case "Spiral":
                material = new THREE.MeshBasicMaterial({
                    map: loader.load("./assets/textures/spiral.png"),
                });
                mesh = new THREE.Mesh(geometry, material);
                break;
            case "Triangle":
                material = new THREE.MeshBasicMaterial({
                    map: loader.load("./assets/textures/triangle.jpg"),
                });
                mesh = new THREE.Mesh(geometry, material);
                break;
            case "Remove Texture":
                mesh.material.map = null; 
                mesh.material.needsUpdate = true;
                break;
            // case "Select Texture":
            //     mesh.material = BasicMaterial;
            //     mesh.material.wireframe = false;
            //     mesh.material.map = texture;
            //     mesh.material.map.needsUpdate = true;
            //     mesh.material.needsUpdate = true;
            //     break;
        }
        material.color = materialColor ;
        mesh.name = "geometry";
        mesh.castShadow = true; // Shadow (đổ bóng).
        scene.add(mesh);
        update(renderer, scene, camera, controls);
    });

    

    // Bắt sự kiện click vào nút hoặc liên kết để kích hoạt sự kiện chọn file
    $("#upload-texture-btn").click(function() {
        // Kích hoạt sự kiện chọn file
        $("#texture-input").click();
    });
    
    // Bắt sự kiện khi người dùng chọn file ảnh
    $("#texture-input").change(function(e) {
        var file = e.target.files[0];
        
        if (file) {
        // Tạo một đối tượng FileReader để đọc dữ liệu từ file
        var reader = new FileReader();
        
        reader.onload = function(e) {
            var textureUrl = e.target.result;
            
            // Tạo một texture mới từ file ảnh được chọn
            var texture = new THREE.TextureLoader().load(textureUrl);
            
            // Thay đổi texture của geometry hiện tại
            mesh.material.map = texture;
            mesh.material.needsUpdate = true;
            
            // Cập nhật lại hiển thị
            update(renderer, scene, camera, controls);
        };
        
        // Đọc dữ liệu từ file ảnh như là một địa chỉ URL
        reader.readAsDataURL(file);
        }
    });
  

    //Handle event click on button controls
    $(".controls-btn").click(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            transformControls.detach(mesh);
            activeControl = false;
        } else {
            activeControl = true;
            const controlType = $(this).attr("type");
            switch (controlType) {
                case "translate":
                    transformControls.attach(mesh);
                    transformControls.setMode("translate");
                    break;
                case "rotate":
                    transformControls.attach(mesh);
                    transformControls.setMode("rotate");
                    break;
                case "scale":
                    transformControls.attach(mesh);
                    transformControls.setMode("scale");
                    break;
            }

            $(".controls-btn.active").removeClass("active");
            $(this).addClass("active");

            scene.add(transformControls);
        }
    });

    //Handle event on click light
    // $(".light").click(function () {
    //     if ($(this).text() == "Point Light" && hasLight==false) {
    //         hasLight = true;
    //         scene.add(pointLight);

    //         var plane = getPlane(150);
    //         gridHelper.add(plane);

    //         var pointLightHelper = getPointLightHelper(pointLight);
    //         scene.add(pointLightHelper);
           
    //             activeControl = true;
    //             transformControls.attach(pointLight);
    //             transformControls.setMode("translate");
    //             scene.add(transformControls);
            

    //         // planeColorGUI = addColorGUI(plane.material, "Plane Color", { color: 0x15151e }, colorGUI);
    //     } else {
    //         hasLight = false;

    //         scene.remove(scene.getObjectByName("PointLight"));
    //         scene.remove(scene.getObjectByName("PointLightHelper"));
    //         gridHelper.remove(scene.getObjectByName("Plane"));
    //         scene.remove(transformControls)
    //         colorGUI.remove(planeColorGUI);
    //     }
    // });
var pointLight, pointLightHelper, spotLight, spotLightHelper;

$(".light").click(function () {
    if ($(this).text() == "Point Light") {
        if (!hasLight || activeControl) {
            hasLight = true;

            // Remove spotlight and its helper
            if (spotLight) {
                scene.remove(spotLight);
                scene.remove(spotLightHelper);
                spotLightHelper = null;
            }
            // if (directionalLight) {
            //     scene.remove(directionalLight);
            //     scene.remove(directionalLightHelper);
            //     directionalLightHelper = null;
            // }

            // Add point light
            scene.add(pointLight);
            var plane = getPlane(150);
            gridHelper.add(plane);
            // Add point light helper
            pointLightHelper = getPointLightHelper(pointLight);
            scene.add(pointLightHelper);

            activeControl = true;

            // Attach transform controls to point light
            transformControls.attach(pointLight);
            transformControls.setMode("translate");
            scene.add(transformControls);
        }
    }else if ($(this).text() == "Spot Light") {
        if (!hasLight || activeControl) {
            hasLight = true;

            // Remove point light and its helper
            if (pointLight) {
                scene.remove(pointLight);
                scene.remove(pointLightHelper);
                pointLightHelper = null;
            }
            // if (directionalLight) {
            //     scene.remove(directionalLight);
            //     scene.remove(directionalLightHelper);
            //     directionalLightHelper = null;
            // }
            // Add spot light
            scene.add(spotLight);
            var plane = getPlane(150);
            gridHelper.add(plane);
            // Add spot light helper
            spotLightHelper = getSpotLightHelper(spotLight);
            scene.add(spotLightHelper);

            activeControl = true;

            // Attach transform controls to spot light
            transformControls.attach(spotLight);
            transformControls.setMode("translate");
            scene.add(transformControls);
        }
    } else {
        if (pointLight) {
            scene.remove(pointLight);
            scene.remove(pointLightHelper);
            pointLightHelper = null;
            gridHelper.remove(scene.getObjectByName("Plane"));

        }

        // Remove spotlight and its helper
        if (spotLight) {
            scene.remove(spotLight);
            scene.remove(spotLightHelper);
            spotLightHelper = null;
            gridHelper.remove(scene.getObjectByName("Plane"));
        }
        hasLight = false;
        scene.remove(transformControls)
        colorGUI.remove(planeColorGUI);
        
    }
});
    // else if ($(this).text() == "Directional") {
    //     if (!hasLight || activeControl) {
    //         hasLight = true;

    //         // Remove point light and its helper
    //         if (pointLight) {
    //             scene.remove(pointLight);
    //             scene.remove(pointLightHelper);
    //             pointLightHelper = null;
    //         }
    //         if (spotLight) {
    //             scene.remove(spotLight);
    //             scene.remove(spotLightHelper);
    //             spotLightHelper = null;
    //         }
    //         // Add spot light
    //         scene.add(directionalLight);
    //         var plane = getPlane(150);
    //         gridHelper.add(plane);
    //         // Add spot light helper
    //         directionalLightHelper = getSpotLightHelper(directionalLight);
    //         scene.add(directionalLightHelper);

    //         activeControl = true;

    //         // Attach transform controls to spot light
    //         transformControls.attach(directionalLight);
    //         transformControls.setMode("translate");
    //         scene.add(transformControls);
    //     } 
    // } 
    
    //Handle event on click animation
    $(".animation").click(function () {
        var $nameAnimation = $(this).text();
        if ($(".animation.active").hasClass("active")) {
            $(".animation.active").removeClass("active");
        }
        switch ($nameAnimation) {
            case "3_dim rotation":
                $(this).addClass("active");
                break;
            case "Bounce":
                $(this).addClass("active");
                break;
            case "3_dim scaling":
                $(this).addClass("active");
                break;
            case "Remove Animation":
                break;
        }
    });

    var texture, points, particles;
    var currentBackground; // Biến lưu trữ nền hiện tại

$(".background").click(function () {
    if ($(this).text() == "Square Point") {
        if (!hasBackground || activeControl) {
            hasBackground = true;

            // Xóa nền hiện tại (nếu có)
            if (currentBackground) {
                scene.remove(currentBackground);
            }

            // Thêm nền mới
            var backgroundAllPoints = getBackgroundAllPoints();
            scene.add(backgroundAllPoints);

            // Lưu trữ nền mới vào biến currentBackground
            currentBackground = backgroundAllPoints;
            scene.background = new THREE.Color(0x000000);
            activeControl = true;
        }
    }
    else if ($(this).text() == "Colorful Point") {
        if (!hasBackground || activeControl) {
            hasBackground = true;

            // Xóa nền hiện tại (nếu có)
            if (currentBackground) {
                scene.remove(currentBackground);
            }

            // Thêm nền mới
            scene.fog = new THREE.FogExp2(0x000000, 0.001);
            var particles = setPoint();
            scene.add(particles);

            // Lưu trữ nền mới vào biến currentBackground
            currentBackground = particles;
            scene.background = new THREE.Color(0x000000);

            activeControl = true;
        }
    }
    else if ($(this).text() == "Cloudy Sky") {
        if (!hasBackground || activeControl) {
            hasBackground = true;

            // Xóa nền hiện tại (nếu có)
            if (currentBackground) {
                scene.remove(currentBackground);
            }

            // Tạo hiệu ứng background bầu trời
            var gradientTexture = createGradientTexture();
            scene.background = gradientTexture;

            // Lưu trữ nền mới vào biến currentBackground
            currentBackground = gradientTexture;

            activeControl = true;
        }
    }
    else {
        // Xóa nền hiện tại (nếu có)
        if (currentBackground) {
            scene.remove(currentBackground);
            currentBackground = null;
        }
        scene.background = null;
        scene.background = new THREE.Color(0xeed1ff);
        // Xóa các mesh đang làm nền
        scene.traverse(function (child) {
            if (child.isPoints && child.name === 'particles') {
                scene.remove(child);
            }
            if (child.isMesh && child.name === 'background') {
                if (child.material.map) {
                    child.material.map.dispose();
                    child.material.map = null;
                }
                scene.remove(child);
            }
        });

        hasLight = false;
    }
});
   
    var camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(10, 9, 15);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.updateProjectionMatrix();
    
    function updateCamera() {
        camera.updateProjectionMatrix();
    }
    

    // Create a configuration object
    const config = {
      positionX: camera.position.x,
      positionY: camera.position.y,
      positionZ: camera.position.z,
      step: 0.1
    };
    var cameraGUI = gui.addFolder("Camera");

    // Add controls to GUI
    cameraGUI.add(config, 'positionX').min(-20).max(20).step(config.step).onChange(function(value) {
        camera.position.x = value;
    });
    
    cameraGUI.add(config, 'positionY').min(-10).max(10).step(config.step).onChange(function(value) {
        camera.position.y = value;
    });
    
    cameraGUI.add(config, 'positionZ').min(-30).max(30).step(config.step).onChange(function(value) {
        camera.position.z = value;
    });

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight - 46);
    renderer.setClearColor("#F0FFFF");
    renderer.shadowMap.enabled = true; // ShadowMap (Đổ bóng).
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Type of shadowMap.
    document.getElementById("WebGL").appendChild(renderer.domElement);
    renderer.render(scene, camera);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    var transformControls = new THREE.TransformControls(camera, renderer.domElement);
    transformControls.size = 0.5;
    transformControls.addEventListener("dragging-changed", (event) => {
        controls.enabled = !event.value;
    });

    cameraGUI.add(camera, "fov", 0, 175).name("Fov").onChange(updateCamera);
    cameraGUI.add(camera, "near", 1, 50, 1).name("Near").onChange(updateCamera);
    cameraGUI.add(camera, "far", 50,5000, 50).name("Far").onChange(updateCamera);
    cameraGUI.add(camera, "aspect", 1, 5).name("Aspect").onChange(updateCamera);
    // cameraGUI.add(camera, "far", 1000, 5000, 10).name("Far").onChange(updateCamera);
    cameraGUI.close();

    var planeColorGUI;
    // var colorGUI = gui.addFolder("Color");
    // addColorGUI(material, "Geometry Color", { color: 0x910b1c }, colorGUI);
    // colorGUI.close();
    // var backgroundColorGUI;
    // var colorGUI = gui.addFolder("Color");
    // addColorGUI(background_color, "Background Color", { color: 0x910b1c }, colorGUI);
    // colorGUI.close();
  
    // addColorGUI(background_color, "Background Color", { color: 0xeed1ff }, colorGUI);
    var lightGUI = gui.addFolder("Light Control");
    lightGUI.add(pointLight, "intensity", 1, 20, 1).name("Intensity");
    lightGUI.add(pointLight, "distance", 1, 200, 1).name("Distance");
    addColorGUI(pointLight, "Light Color", { color: 0xffffff }, colorGUI);
    lightGUI.close();

    update(renderer, scene, camera, controls);
}

function update(renderer, scene, camera, controls) {
    renderer.render(scene, camera);
    controls.update();

    var geometry = scene.getObjectByName("geometry");
{
    var name = $(".animation.active").text();
    switch (name) {
        case "3_dim rotation":
            geometry.rotation.x = Date.now() * 0.001;
            geometry.rotation.y = Date.now() * 0.002;
            geometry.rotation.z = Date.now() * 0.001;
            break;
        case "Bounce":
            alpha = Math.PI * 0.015 + alpha;
            geometry.position.x = ((10 * Math.cos(alpha)));
            geometry.position.y = (10 * Math.abs(Math.sin(alpha)));
            // geometry.rotation.y = Date.now() * 0.002;
            // geometry.rotation.z = Date.now() * 0.001;
            break;
        case "3_dim scaling":
            alpha = Math.PI * 0.05 + alpha;
            var scaleX = Math.abs(Math.sin(alpha / 4));
            var scaleY = Math.abs(Math.cos(alpha / 5));
            var scaleZ = Math.abs(Math.sin(alpha / 7));
            geometry.scale.set(scaleX, scaleY, scaleZ);
            break;
    }
    }

    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    });
}

function getPlane(size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshStandardMaterial({
        color: "#666666",
        side: THREE.DoubleSide,
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true; // Receive shadow (Nhận đỗ bóng).
    mesh.rotation.x = Math.PI / 2;
    mesh.name = "Plane";

    return mesh;
}

function getHeart() {
    const x = -4, 
    y = -6; 

    var heartShape = new THREE.Shape();
    heartShape.moveTo(x + 2.5, y + 2.5);
    heartShape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    heartShape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    heartShape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    heartShape.bezierCurveTo(x + 6.5, y + 7.7, x + 8.5, y + 5.5, x + 8.5, y + 3.5);
    heartShape.bezierCurveTo(x + 8.5, y + 3.5, x + 8.5, y, x + 5, y);
    heartShape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

    return heartShape;
}

function getTube(size) {
    class CustomSinCurve extends THREE.Curve {
        constructor(scale = 1) {
            super();

            this.scale = scale;
        }

        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = t *  6- 3;
            const ty = Math.sin(2 * Math.PI * t);
            const tz = 0;

            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }

    return new CustomSinCurve(size);
}

function getPointLight(color, intensity, distance) {
    var pointLight = new THREE.PointLight(color, intensity, distance);
    pointLight.position.set(10, 10, 10);
    pointLight.castShadow = true;
    pointLight.name = "PointLight";

    return pointLight;
}

function getSpotLight(color, intensity, distance) {
    var spotLight = new THREE.SpotLight(color, intensity, distance);
    spotLight.position.set(10, 10, 10);
    spotLight.castShadow = true;
    spotLight.name = "SpotLight";

    return spotLight;
}

function getPointLightHelper(pointLight) {
    const sphereSize = 1;
    const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    pointLightHelper.name = "PointLightHelper";

    return pointLightHelper;
}
function getSpotLightHelper(spotLight) {
    const sphereSize = 1;
    const spotLightHelper = new THREE.SpotLightHelper(spotLight, sphereSize);
    spotLightHelper.name = "SpotLightHelper";

    return spotLightHelper;
}

function addColorGUI(obj, name, params, folder) {
    var objColorGUI = folder
        .addColor(params, "color")
        .name(name)
        .onChange(function () {
            obj.color.set(params.color);
        });

    return objColorGUI;
}

function getBackgroundAllPoints() {
    const vertices = [];

    for (let i = 0; i < 30000; i++) {
        const x = THREE.MathUtils.randFloatSpread(2000);
        const y = THREE.MathUtils.randFloatSpread(2000);
        const z = THREE.MathUtils.randFloatSpread(2000);

        vertices.push(x, y, z);
    }

    const geometry1 = new THREE.BufferGeometry();
    geometry1.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

    const material1 = new THREE.PointsMaterial({ color: 0x888888 });

    const points = new THREE.Points(geometry1, material1);
    points.name = "Square Point";
    return points;
}

function setPoint() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    const sprite = new THREE.TextureLoader().load( './assets/textures/disc.png' );
    sprite.colorSpace = THREE.SRGBColorSpace;

    for ( let i = 0; i < 10000; i ++ ) {

        const x = 2000 * Math.random() - 1000;
        const y = 2000 * Math.random() - 1000;
        const z = 2000 * Math.random() - 1000;

        vertices.push( x, y, z );
    }

    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

    var material = new THREE.PointsMaterial( { size: 4, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true } );
    material.color.setHSL( 1.8, 0.3, 0.7, THREE.SRGBColorSpace );
    const time = Date.now() * 0.00005;
    const h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
    material.color.setHSL( h, 0.5, 0.5 );

    const particles = new THREE.Points( geometry, material );
    particles.name = "Colorful Point";
    return particles;
}


  
  // Hàm tạo gradient texture cho background bầu trời
  function createGradientTexture() {
    var canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;

    var context = canvas.getContext('2d');

    // Vẽ gradient màu
    var gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#65C2F5"); // Màu xám nhạt
    gradient.addColorStop(1, "#FFFFFF"); // Màu trắng

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    var numCircles = 300;
    var maxCircleRadius = 30;
    var minCircleRadius = 10;

    for (var i = 0; i < numCircles; i++) {
        var circleX = Math.random() * canvas.width;
        var circleY = Math.random() * canvas.height;
        var circleRadius = minCircleRadius + Math.random() * (maxCircleRadius - minCircleRadius);
        var circleOpacity = Math.random() * 0.8; // Độ đục của hình tròn

        // Vẽ hình tròn
        context.beginPath();
        context.arc(circleX, circleY, circleRadius, 0, Math.PI * 2, false);
        context.closePath();
        context.fillStyle = 'rgba(255, 255, 255, ' + circleOpacity + ')';
        context.fill(); 
        }
    

    var texture = new THREE.CanvasTexture(canvas);
    texture.name = "Cloudy Sky";
    return texture;
 }
  


function loadModel() {
    const modelInput = document.getElementById('modelInput');
    modelInput.addEventListener('change', handleFileSelect, false);
    modelInput.click();
  }
  
  function handleFileSelect(event) {
    const file = event.target.files[0];
  
    const reader = new FileReader();
    reader.onload = function (event) {
      const gltfData = event.target.result;
  
      const loader = new THREE.GLTFLoader();
      loader.parse(gltfData, '', function (gltf) {
        const model = gltf.scene;
  
        // Đường dẫn tuyệt đối đến thư mục chứa texture
        const texturePath = 'assets/glTF/dog/textures';
  
        // Lặp qua các material của model
        model.traverse(function (object) {
          if (object.isMesh) {
            object.material.forEach(function (material) {
              // Kiểm tra nếu material sử dụng texture
              if (material.map) {
                // Tạo đường dẫn tuyệt đối đến tệp texture
                const textureFile = texturePath + material.map.name+ "png";
                
                // Tạo một texture loader
                const textureLoader = new THREE.TextureLoader();
                textureLoader.load(textureFile, function (texture) {
                  material.map = texture;
                  material.needsUpdate = true;
                });
              }
            });
          }
        });
  
        scene.add(model);
      });
    };
  
    if (file) {
      reader.readAsArrayBuffer(file);
    }
  }

  function animate() {
    requestAnimationFrame(animate);
  
    // Render scene
    renderer.render(scene, camera);
  }  
init();
