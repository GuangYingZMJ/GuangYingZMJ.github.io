/**
 * 3D 光影 Logo - 光影造梦局
 * Three.js 交互式，鼠标控制旋转
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
        var crystal = new THREE.Mesh(new THREE.IcosahedronGeometry(1.0, 1), mat);
        group.add(crystal);

        // Core
        var core = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.45, 0),
            new THREE.MeshBasicMaterial({ color: 0xff2d95, transparent: true, opacity: 0.25 })
        );
        group.add(core);

        // Wireframe
        var wire = new THREE.Mesh(
            new THREE.IcosahedronGeometry(1.05, 1),
            new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.15 })
        );
        group.add(wire);

        // Rings
        function ring(r, tr, col, rx, ry) {
            var m = new THREE.Mesh(
                new THREE.TorusGeometry(r, tr, 24, 48),
                new THREE.MeshPhysicalMaterial({ color: col, emissive: col, emissiveIntensity: 0.4, metalness: 0.6, roughness: 0.3, transparent: true, opacity: 0.6 })
            );
            m.rotation.x = rx; m.rotation.y = ry;
            return m;
        }
        group.add(ring(1.5, 0.02, 0x00f0ff, Math.PI/3, 0));
        group.add(ring(1.8, 0.018, 0xff2d95, Math.PI/1.5, Math.PI/4));
        group.add(ring(1.2, 0.012, 0xffea00, Math.PI/2.5, -Math.PI/3));

        // Particles
        var pc = 150, g = new THREE.BufferGeometry(), pos = new Float32Array(pc*3), cols = new Float32Array(pc*3);
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

        // Mouse
        var tx = 0, ty = 0, cx = 0, cy = 0;
        document.addEventListener("mousemove", function(e) {
            var r = el.getBoundingClientRect();
            ty = ((e.clientX - r.left)/r.width - 0.5)*Math.PI;
            tx = ((e.clientY - r.top)/r.height - 0.5)*Math.PI*0.5;
        });
        document.addEventListener("touchmove", function(e) {
            var t = e.touches[0], r = el.getBoundingClientRect();
            ty = ((t.clientX - r.left)/r.width - 0.5)*Math.PI;
            tx = ((t.clientY - r.top)/r.height - 0.5)*Math.PI*0.5;
        }, { passive: true });

        // Animation
        var time = 0;
        (function loop() {
            requestAnimationFrame(loop);
            time += 0.01;
            cx += (tx-cx)*0.06; cy += (ty-cy)*0.06;
            group.rotation.x = cx;
            group.rotation.y = cy + time * 0.002;

            var p = Math.sin(time)*0.12+0.88;
            mat.emissiveIntensity = 0.12 + p*0.18;
            core.material.opacity = 0.2 + Math.sin(time*2)*0.12;

            group.children[3].rotation.z += 0.01;
            group.children[4].rotation.x += 0.008;
            group.children[4].rotation.z += 0.005;
            group.children[5].rotation.y += 0.012;
            group.children[5].rotation.x += 0.006;

            var hue = 0.55 + Math.sin(time*0.25)*0.12;
            var hc = new THREE.Color().setHSL(hue, 0.85, 0.5);
            mat.color.copy(hc); mat.emissive.copy(hc);

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