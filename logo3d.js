/**
 * 3D 光影 Logo - 光影造梦局
 * 鼠标按住拖拽旋转，松手后匀速自转
 */
(function() {
    function init() {
        if (typeof THREE === "undefined") {
            var s = document.createElement("script");
            s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
            s.onload = start;
            document.head.appendChild(s);
        } else {
            start();
        }
    }

    function start() {
        var el = document.getElementById("cubeContainer");
        if (!el || el._loaded) return;
        el._loaded = true;
        while (el.firstChild) el.removeChild(el.firstChild);

        var size = Math.min(el.clientWidth || 300, window.innerWidth * 0.4);
        if (size < 100) size = 280;
        el.style.width = size + "px";
        el.style.height = size + "px";
        el.style.margin = "0 auto";

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
        camera.position.set(0, 0.5, 5.5);
        camera.lookAt(0, 0, 0);

        var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(size, size);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        el.appendChild(renderer.domElement);

        var group = new THREE.Group();
        scene.add(group);

        // Crystal
        var mat = new THREE.MeshPhysicalMaterial({
            color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.2,
            metalness: 0.4, roughness: 0.1, clearcoat: 0.6, clearcoatRoughness: 0.3,
            transparent: true, opacity: 0.9
        });
        group.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.0, 1), mat));

        // Core
        var core = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.45, 0),
            new THREE.MeshBasicMaterial({ color: 0xff2d95, transparent: true, opacity: 0.25 })
        );
        group.add(core);

        // Wireframe
        group.add(new THREE.Mesh(
            new THREE.IcosahedronGeometry(1.05, 1),
            new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.15 })
        ));

        // Rings
        function ring(r, tr, col, rx, ry) {
            var m = new THREE.Mesh(
                new THREE.TorusGeometry(r, tr, 24, 48),
                new THREE.MeshPhysicalMaterial({ color: col, emissive: col, emissiveIntensity: 0.4, metalness: 0.6, roughness: 0.3, transparent: true, opacity: 0.6 })
            );
            m.rotation.x = rx; m.rotation.y = ry;
            return m;
        }
        var rings = [
            ring(1.5, 0.02, 0x00f0ff, Math.PI/3, 0),
            ring(1.8, 0.018, 0xff2d95, Math.PI/1.5, Math.PI/4),
            ring(1.2, 0.012, 0xffea00, Math.PI/2.5, -Math.PI/3)
        ];
        rings.forEach(function(r) { group.add(r); });

        // Particles (simplified for performance)
        var pc = 120, g = new THREE.BufferGeometry(), pos = new Float32Array(pc*3), cols = new Float32Array(pc*3);
        var pal = [new THREE.Color(0x00f0ff), new THREE.Color(0xff2d95), new THREE.Color(0xffea00)];
        for (var i = 0; i < pc; i++) {
            var t = Math.random()*Math.PI*2, p = Math.acos(2*Math.random()-1), r = 2+Math.random()*1.8;
            pos[i*3] = r*Math.sin(p)*Math.cos(t); pos[i*3+1] = r*Math.sin(p)*Math.sin(t); pos[i*3+2] = r*Math.cos(p);
            var c = pal[Math.floor(Math.random()*3)];
            cols[i*3]=c.r; cols[i*3+1]=c.g; cols[i*3+2]=c.b;
        }
        g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        g.setAttribute("color", new THREE.BufferAttribute(cols, 3));
        var pts = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, sizeAttenuation: true }));
        group.add(pts);

        // Lights
        var l1 = new THREE.PointLight(0x00f0ff, 1, 8); l1.position.set(2.5, 2, 2); scene.add(l1);
        var l2 = new THREE.PointLight(0xff2d95, 1, 8); l2.position.set(-2, -1.5, 2.5); scene.add(l2);
        scene.add(new THREE.AmbientLight(0x334466, 0.4));

        // ===== 鼠标拖拽交互 =====
        var isDragging = false;
        var prevX = 0, prevY = 0;
        var dragRotX = 0, dragRotY = 0;
        var velX = 0, velY = 0;      // 拖拽时的速度
        var autoRotY = 0;            // 自动旋转角度

        el.style.cursor = "grab";

        function onDown(e) {
            isDragging = true;
            el.style.cursor = "grabbing";
            var pos = getPos(e);
            prevX = pos.x;
            prevY = pos.y;
            velX = 0;
            velY = 0;
        }

        function onMove(e) {
            if (!isDragging) return;
            var pos = getPos(e);
            var dx = pos.x - prevX;
            var dy = pos.y - prevY;
            // 速度匹配人眼：灵敏度系数 0.005，拖拽手感自然
            dragRotY += dx * 0.005;
            dragRotX += dy * 0.005;
            // 限制垂直旋转范围，避免翻转
            dragRotX = Math.max(-1.2, Math.min(1.2, dragRotX));
            velX = dy * 0.005;
            velY = dx * 0.005;
            prevX = pos.x;
            prevY = pos.y;
        }

        function onUp() {
            isDragging = false;
            el.style.cursor = "grab";
        }

        function getPos(e) {
            if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            return { x: e.clientX, y: e.clientY };
        }

        // Mouse events
        el.addEventListener("mousedown", onDown);
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);

        // Touch events
        el.addEventListener("touchstart", function(e) { e.preventDefault(); onDown(e); }, { passive: false });
        document.addEventListener("touchmove", function(e) { if (isDragging) e.preventDefault(); onMove(e); }, { passive: false });
        document.addEventListener("touchend", onUp);

        // ===== 动画循环 =====
        var time = 0;

        (function loop() {
            requestAnimationFrame(loop);
            time += 0.01;

            if (!isDragging) {
                // 松手后惯性衰减
                if (Math.abs(velY) > 0.0001 || Math.abs(velX) > 0.0001) {
                    dragRotY += velY;
                    dragRotX += velX;
                    dragRotX = Math.max(-1.2, Math.min(1.2, dragRotX));
                    velY *= 0.95;
                    velX *= 0.95;
                } else {
                    velY = 0;
                    velX = 0;
                }
                // 匀速自转（拖拽时暂停）
                autoRotY += 0.003;
            }

            // 最终旋转 = 自动旋转 + 拖拽旋转
            group.rotation.y = autoRotY + dragRotY;
            group.rotation.x = dragRotX;

            // 脉冲发光
            var p = Math.sin(time)*0.12+0.88;
            mat.emissiveIntensity = 0.12 + p*0.18;
            core.material.opacity = 0.2 + Math.sin(time*2)*0.12;

            // 光环自转
            rings[0].rotation.z += 0.01;
            rings[1].rotation.x += 0.008;
            rings[1].rotation.z += 0.005;
            rings[2].rotation.y += 0.012;
            rings[2].rotation.x += 0.006;

            // 颜色微变
            var hue = 0.55 + Math.sin(time*0.25)*0.12;
            var hc = new THREE.Color().setHSL(hue, 0.85, 0.5);
            mat.color.copy(hc); mat.emissive.copy(hc);

            // 灯光环绕
            l1.position.set(Math.sin(time*0.6)*2.5, 1.5+Math.sin(time*0.4)*0.5, Math.cos(time*0.6)*2.5);
            l2.position.set(Math.sin(time*0.4+2)*2.5, -1+Math.sin(time*0.3)*0.5, Math.cos(time*0.4+2)*2.5);

            pts.rotation.y += 0.001;
            renderer.render(scene, camera);
        })();
    }

    if (document.readyState === "loading")
        document.addEventListener("DOMContentLoaded", init);
    else
        init();
})();