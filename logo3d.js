/**
 * ========================================
 *  ✨  3D 光影 Logo — 光影造梦局
 *  Three.js 交互式 Logo，鼠标控制旋转
 * ========================================
 */
(function() {
    function init3DLogo() {
        if (typeof THREE === "undefined") {
            var s = document.createElement("script");
            s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
            s.onload = startScene;
            document.head.appendChild(s);
        } else {
            startScene();
        }
    }

    function startScene() {
        var container = document.getElementById("cubeContainer");
        if (!container) return;

        var W = container.clientWidth || 300;
        var H = container.clientHeight || 300;

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
        camera.position.set(3, 2, 5);

        // Clear container (remove old cube markup if any)
        while (container.firstChild) container.removeChild(container.firstChild);
        var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        container.appendChild(renderer.domElement);

        var group = new THREE.Group();
        scene.add(group);

        // --- Crystal ---
        var cGeo = new THREE.IcosahedronGeometry(1.0, 1);
        var cMat = new THREE.MeshPhysicalMaterial({
            color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.15,
            metalness: 0.3, roughness: 0.1, clearcoat: 0.8, clearcoatRoughness: 0.2,
            transparent: true, opacity: 0.95
        });
        var crystal = new THREE.Mesh(cGeo, cMat);
        group.add(crystal);

        // Core glow
        var coreGeo = new THREE.IcosahedronGeometry(0.5, 0);
        var coreMat = new THREE.MeshBasicMaterial({ color: 0xff2d95, transparent: true, opacity: 0.3 });
        var core = new THREE.Mesh(coreGeo, coreMat);
        group.add(core);

        // Wireframe
        var wGeo = new THREE.IcosahedronGeometry(1.05, 1);
        var wMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.2 });
        var wire = new THREE.Mesh(wGeo, wMat);
        group.add(wire);

        // --- Rings ---
        function makeRing(r, tr, col, rx, ry) {
            var g = new THREE.TorusGeometry(r, tr, 32, 64);
            var m = new THREE.MeshPhysicalMaterial({
                color: col, emissive: col, emissiveIntensity: 0.5,
                metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.7
            });
            var mesh = new THREE.Mesh(g, m);
            mesh.rotation.x = rx;
            mesh.rotation.y = ry;
            return mesh;
        }
        var r1 = makeRing(1.6, 0.025, 0x00f0ff, Math.PI / 3, 0);
        var r2 = makeRing(1.9, 0.02, 0xff2d95, Math.PI / 1.5, Math.PI / 4);
        var r3 = makeRing(1.3, 0.015, 0xffea00, Math.PI / 2.5, -Math.PI / 3);
        group.add(r1); group.add(r2); group.add(r3);

        // --- Particles ---
        var pCount = 200;
        var pGeo = new THREE.BufferGeometry();
        var pos = new Float32Array(pCount * 3);
        var pcols = new Float32Array(pCount * 3);
        var cC = new THREE.Color(0x00f0ff), cP = new THREE.Color(0xff2d95), cY = new THREE.Color(0xffea00);
        var pals = [cC, cP, cY];
        for (var i = 0; i < pCount; i++) {
            var t = Math.random() * Math.PI * 2;
            var p = Math.acos(2 * Math.random() - 1);
            var r = 2.2 + Math.random() * 1.5;
            pos[i*3] = r * Math.sin(p) * Math.cos(t);
            pos[i*3+1] = r * Math.sin(p) * Math.sin(t);
            pos[i*3+2] = r * Math.cos(p);
            var col = pals[Math.floor(Math.random() * 3)];
            pcols[i*3] = col.r; pcols[i*3+1] = col.g; pcols[i*3+2] = col.b;
        }
        pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        pGeo.setAttribute("color", new THREE.BufferAttribute(pcols, 3));
        var pMat = new THREE.PointsMaterial({
            size: 0.06, vertexColors: true, transparent: true, opacity: 0.8,
            blending: THREE.AdditiveBlending, sizeAttenuation: true
        });
        var particles = new THREE.Points(pGeo, pMat);
        group.add(particles);

        // --- Lights ---
        var l1 = new THREE.PointLight(0x00f0ff, 1.5, 10);
        l1.position.set(3, 2, 2); scene.add(l1);
        var l2 = new THREE.PointLight(0xff2d95, 1.5, 10);
        l2.position.set(-2, -2, 3); scene.add(l2);
        scene.add(new THREE.AmbientLight(0x224466, 0.3));

        // --- Mouse ---
        var tx = 0, ty = 0, cx = 0, cy = 0;
        document.addEventListener("mousemove", function(e) {
            var rect = container.getBoundingClientRect();
            ty = ((e.clientX - rect.left) / rect.width - 0.5) * Math.PI * 0.8;
            tx = ((e.clientY - rect.top) / rect.height - 0.5) * Math.PI * 0.4;
        });
        document.addEventListener("touchmove", function(e) {
            var t = e.touches[0];
            var rect = container.getBoundingClientRect();
            ty = ((t.clientX - rect.left) / rect.width - 0.5) * Math.PI * 0.8;
            tx = ((t.clientY - rect.top) / rect.height - 0.5) * Math.PI * 0.4;
        }, { passive: true });

        // --- Animation Loop ---
        var time = 0;
        function animate() {
            requestAnimationFrame(animate);
            time += 0.01;

            cx += (tx - cx) * 0.05;
            cy += (ty - cy) * 0.05;
            group.rotation.x = cx;
            group.rotation.y = cy;
            group.rotation.y += 0.002;

            var pulse = Math.sin(time * 1.5) * 0.15 + 0.85;
            cMat.emissiveIntensity = 0.1 + pulse * 0.15;
            coreMat.opacity = 0.2 + Math.sin(time * 2) * 0.15;

            r1.rotation.z += 0.008;
            r2.rotation.x += 0.006; r2.rotation.z += 0.004;
            r3.rotation.y += 0.01; r3.rotation.x += 0.005;

            var hue = 0.55 + Math.sin(time * 0.3) * 0.15;
            var hCol = new THREE.Color().setHSL(hue, 0.9, 0.5);
            cMat.color.copy(hCol); cMat.emissive.copy(hCol);

            l1.position.set(Math.sin(time*0.7)*3, 1.5+Math.sin(time*0.5)*0.5, Math.cos(time*0.7)*3);
            l2.position.set(Math.sin(time*0.5+2)*3, -1+Math.sin(time*0.4)*0.5, Math.cos(time*0.5+2)*3);

            particles.rotation.y += 0.001;
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener("resize", function() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });

        if (window.innerWidth < 768) camera.position.set(3.5, 2.5, 5);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init3DLogo);
    } else {
        init3DLogo();
    }
})();