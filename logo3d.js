/**
 * ========================================
 *  ?? 3D 光影球体 Logo — 光影造梦局
 *  多层球壳实现柔和边缘透明渐变
 *  鼠标拖动旋转 + 自动缓慢旋转
 * ========================================
 */
(function () {
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
        camera.position.set(0, 0.8, 4.5);

        var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        container.appendChild(renderer.domElement);

        var group = new THREE.Group();
        scene.add(group);

        // --- 核心内发光球 (深粉色, 不透明) ---
        var coreGeo = new THREE.SphereGeometry(0.7, 48, 48);
        var coreMat = new THREE.MeshPhysicalMaterial({
            color: 0xff2d95,
            emissive: 0xff2d95,
            emissiveIntensity: 0.6,
            metalness: 0.0,
            roughness: 0.3,
            transparent: true,
            opacity: 0.95,
        });
        var core = new THREE.Mesh(coreGeo, coreMat);
        group.add(core);

        // --- 主体球 (青色, 接近不透明 97%) ---
        var mainGeo = new THREE.SphereGeometry(1.0, 48, 48);
        var mainMat = new THREE.MeshPhysicalMaterial({
            color: 0x00f0ff,
            emissive: 0x00f0ff,
            emissiveIntensity: 0.3,
            metalness: 0.1,
            roughness: 0.2,
            clearcoat: 0.6,
            clearcoatRoughness: 0.3,
            transparent: true,
            opacity: 0.97,
        });
        var mainSphere = new THREE.Mesh(mainGeo, mainMat);
        group.add(mainSphere);

        // --- 柔和边缘过渡层 (5层同心球壳, 递减透明度) ---
        var glowData = [
            { r: 1.1, op: 0.40, col: 0x00f0ff },
            { r: 1.2, op: 0.20, col: 0x00ddff },
            { r: 1.3, op: 0.10, col: 0x00ccff },
            { r: 1.4, op: 0.05, col: 0x00bbff },
            { r: 1.5, op: 0.02, col: 0x00aaff },
        ];
        glowData.forEach(function (g) {
            var geo = new THREE.SphereGeometry(g.r, 36, 36);
            var mat = new THREE.MeshBasicMaterial({
                color: g.col,
                transparent: true,
                opacity: g.op,
                depthWrite: false,
                side: THREE.BackSide,
            });
            group.add(new THREE.Mesh(geo, mat));
        });

        // --- 轨道光环 ---
        function makeRing(r, tr, col, rx, ry) {
            var g = new THREE.TorusGeometry(r, tr, 32, 64);
            var m = new THREE.MeshPhysicalMaterial({
                color: col,
                emissive: col,
                emissiveIntensity: 0.5,
                metalness: 0.8,
                roughness: 0.2,
                transparent: true,
                opacity: 0.7,
            });
            var mesh = new THREE.Mesh(g, m);
            mesh.rotation.x = rx;
            mesh.rotation.y = ry;
            return mesh;
        }
        var r1 = makeRing(1.7, 0.025, 0x00f0ff, Math.PI / 3, 0);
        var r2 = makeRing(2.0, 0.02, 0xff2d95, Math.PI / 1.5, Math.PI / 4);
        var r3 = makeRing(1.4, 0.015, 0xffea00, Math.PI / 2.5, -Math.PI / 3);
        group.add(r1);
        group.add(r2);
        group.add(r3);

        // --- 粒子 (减少到 100 个, 优化性能) ---
        var pCount = 100;
        var pGeo = new THREE.BufferGeometry();
        var pos = new Float32Array(pCount * 3);
        var pcols = new Float32Array(pCount * 3);
        var cC = new THREE.Color(0x00f0ff),
            cP = new THREE.Color(0xff2d95),
            cY = new THREE.Color(0xffea00);
        var pals = [cC, cP, cY];
        for (var i = 0; i < pCount; i++) {
            var t = Math.random() * Math.PI * 2;
            var p = Math.acos(2 * Math.random() - 1);
            var r = 2.3 + Math.random() * 1.8;
            pos[i * 3] = r * Math.sin(p) * Math.cos(t);
            pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
            pos[i * 3 + 2] = r * Math.cos(p);
            var col = pals[Math.floor(Math.random() * 3)];
            pcols[i * 3] = col.r;
            pcols[i * 3 + 1] = col.g;
            pcols[i * 3 + 2] = col.b;
        }
        pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        pGeo.setAttribute("color", new THREE.BufferAttribute(pcols, 3));
        var pMat = new THREE.PointsMaterial({
            size: 0.06,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
        });
        var particles = new THREE.Points(pGeo, pMat);
        group.add(particles);

        // --- 灯光 ---
        var l1 = new THREE.PointLight(0x00f0ff, 1.5, 10);
        l1.position.set(3, 2, 2);
        scene.add(l1);
        var l2 = new THREE.PointLight(0xff2d95, 1.5, 10);
        l2.position.set(-2, -2, 3);
        scene.add(l2);
        scene.add(new THREE.AmbientLight(0x224466, 0.3));

        // --- 鼠标拖拽旋转交互 (不是悬停, 需按住拖拽) ---
        var isDragging = false;
        var prevMouse = { x: 0, y: 0 };
        var targetRot = { x: 0, y: 0 };
        var currentRot = { x: 0, y: 0 };
        var velocity = { x: 0, y: 0 };

        container.addEventListener("mousedown", function (e) {
            isDragging = true;
            prevMouse.x = e.clientX;
            prevMouse.y = e.clientY;
            velocity.x = 0;
            velocity.y = 0;
        });

        document.addEventListener("mousemove", function (e) {
            if (!isDragging) return;
            var dx = e.clientX - prevMouse.x;
            var dy = e.clientY - prevMouse.y;
            // 灵敏度 0.005, 跟人眼转动匹配
            targetRot.y += dx * 0.005;
            targetRot.x += dy * 0.005;
            // 限制垂直旋转角度避免翻转
            targetRot.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, targetRot.x));
            velocity.x = dy * 0.005;
            velocity.y = dx * 0.005;
            prevMouse.x = e.clientX;
            prevMouse.y = e.clientY;
        });

        document.addEventListener("mouseup", function () {
            isDragging = false;
        });

        // --- 触摸支持 ---
        container.addEventListener("touchstart", function (e) {
            var t = e.touches[0];
            isDragging = true;
            prevMouse.x = t.clientX;
            prevMouse.y = t.clientY;
            velocity.x = 0;
            velocity.y = 0;
        }, { passive: true });

        document.addEventListener("touchmove", function (e) {
            if (!isDragging) return;
            var t = e.touches[0];
            var dx = t.clientX - prevMouse.x;
            var dy = t.clientY - prevMouse.y;
            targetRot.y += dx * 0.005;
            targetRot.x += dy * 0.005;
            targetRot.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, targetRot.x));
            velocity.x = dy * 0.005;
            velocity.y = dx * 0.005;
            prevMouse.x = t.clientX;
            prevMouse.y = t.clientY;
        }, { passive: true });

        document.addEventListener("touchend", function () {
            isDragging = false;
        }, { passive: true });

        // --- 动画循环 ---
        var time = 0;
        var autoRotSpeed = 0.003;

        function animate() {
            requestAnimationFrame(animate);
            time += 0.01;

            if (!isDragging) {
                // 自动缓慢旋转 + 惯性衰减
                velocity.x *= 0.95;
                velocity.y *= 0.95;
                targetRot.y += autoRotSpeed + velocity.y;
                targetRot.x += velocity.x;
                targetRot.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, targetRot.x));
            }

            // 平滑跟随 target
            currentRot.x += (targetRot.x - currentRot.x) * 0.08;
            currentRot.y += (targetRot.y - currentRot.y) * 0.08;
            group.rotation.x = currentRot.x;
            group.rotation.y = currentRot.y;

            // 脉冲发光
            var pulse = Math.sin(time * 1.5) * 0.15 + 0.85;
            mainMat.emissiveIntensity = 0.2 + pulse * 0.25;
            coreMat.emissiveIntensity = 0.4 + pulse * 0.3;
            coreMat.opacity = 0.85 + Math.sin(time * 2) * 0.1;

            // 光环旋转
            r1.rotation.z += 0.008;
            r2.rotation.x += 0.006;
            r2.rotation.z += 0.004;
            r3.rotation.y += 0.01;
            r3.rotation.x += 0.005;

            // 颜色缓慢循环 (光影变幻)
            var hue = 0.55 + Math.sin(time * 0.3) * 0.15;
            var hCol = new THREE.Color().setHSL(hue, 0.9, 0.5);
            mainMat.color.copy(hCol);
            mainMat.emissive.copy(hCol);

            // 灯光动态旋转
            l1.position.set(Math.sin(time * 0.7) * 3, 1.5 + Math.sin(time * 0.5) * 0.5, Math.cos(time * 0.7) * 3);
            l2.position.set(Math.sin(time * 0.5 + 2) * 3, -1 + Math.sin(time * 0.4) * 0.5, Math.cos(time * 0.5 + 2) * 3);

            particles.rotation.y += 0.001;
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener("resize", function () {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });

        if (window.innerWidth < 768) {
            camera.position.set(0, 0.8, 5.5);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init3DLogo);
    } else {
        init3DLogo();
    }
})();
