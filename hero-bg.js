/**
 * Cyberpunk Hero Background - 实时生成赛博朋克风格动态背景
 * 替代视频，性能更优，完美匹配主题
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
        var el = document.querySelector(".hero");
        if (!el || el._bgLoaded) return;
        el._bgLoaded = true;

        // 创建 Canvas 作为背景（插入到 hero-bg 后面）
        var bg = el.querySelector(".hero-bg");
        if (!bg) return;

        var canvas = document.createElement("canvas");
        canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;opacity:0.5;z-index:0;pointer-events:none";
        bg.parentNode.insertBefore(canvas, bg.nextSibling);

        var w = el.clientWidth || window.innerWidth;
        var h = el.clientHeight || window.innerHeight;

        var scene = new THREE.Scene();
        var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(1);
        renderer.setClearColor(0x000000, 0);
        canvas.appendChild(renderer.domElement);

        // ===== 赛博朋克网格 =====
        var gridGroup = new THREE.Group();

        // 水平线
        var hLines = 25;
        for (var i = 0; i < hLines; i++) {
            var y = (i / hLines) * 2 - 1;
            var geo = new THREE.BufferGeometry();
            var verts = new Float32Array([-1, y, 0, 1, y, 0]);
            geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
            var alpha = 0.05 + Math.random() * 0.1;
            var mat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: alpha });
            gridGroup.add(new THREE.Line(geo, mat));
        }

        // 垂直线
        var vLines = 35;
        for (var i = 0; i < vLines; i++) {
            var x = (i / vLines) * 2 - 1;
            var geo = new THREE.BufferGeometry();
            var verts = new Float32Array([x, -1, 0, x, 1, 0]);
            geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
            var alpha = 0.03 + Math.random() * 0.08;
            var mat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: alpha });
            gridGroup.add(new THREE.Line(geo, mat));
        }

        // 中心高亮交叉线
        var cx = new THREE.BufferGeometry();
        cx.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-0.5, 0, 0, 0.5, 0, 0]), 3));
        gridGroup.add(new THREE.Line(cx, new THREE.LineBasicMaterial({ color: 0xff2d95, transparent: true, opacity: 0.15 })));

        var cy = new THREE.BufferGeometry();
        cy.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0, -0.5, 0, 0, 0.5, 0]), 3));
        gridGroup.add(new THREE.Line(cy, new THREE.LineBasicMaterial({ color: 0xff2d95, transparent: true, opacity: 0.15 })));

        scene.add(gridGroup);

        // ===== 浮动态 =====
        var dotCount = 60;
        var dg = new THREE.BufferGeometry();
        var dpos = new Float32Array(dotCount * 3);
        for (var i = 0; i < dotCount; i++) {
            dpos[i*3] = (Math.random() - 0.5) * 2;
            dpos[i*3+1] = (Math.random() - 0.5) * 2;
            dpos[i*3+2] = 0;
        }
        dg.setAttribute("position", new THREE.BufferAttribute(dpos, 3));
        var dots = new THREE.Points(dg, new THREE.PointsMaterial({
            color: 0x00f0ff, size: 0.008, transparent: true, opacity: 0.3,
            blending: THREE.AdditiveBlending
        }));
        scene.add(dots);

        // ===== 光柱 =====
        var beamGroup = new THREE.Group();
        for (var i = 0; i < 8; i++) {
            var x = (Math.random() - 0.5) * 1.6;
            var bw = 0.008 + Math.random() * 0.015;
            var bh = 0.3 + Math.random() * 0.7;
            var bg2 = new THREE.BufferGeometry();
            bg2.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
                x-bw, -bh, 0, x+bw, -bh, 0, x+bw, bh, 0,
                x-bw, -bh, 0, x+bw, bh, 0, x-bw, bh, 0
            ]), 3));
            var col = Math.random() > 0.5 ? 0x00f0ff : 0xff2d95;
            var bm = new THREE.MeshBasicMaterial({
                color: col, transparent: true, opacity: 0.04 + Math.random() * 0.04,
                blending: THREE.AdditiveBlending, depthWrite: false
            });
            var mesh = new THREE.Mesh(bg2, bm);
            mesh.userData = { speed: 0.2 + Math.random() * 0.3, offset: Math.random() * Math.PI * 2 };
            beamGroup.add(mesh);
        }
        scene.add(beamGroup);

        // ===== 闪烁像素 =====
        var flickerCount = 40;
        var fg = new THREE.BufferGeometry();
        var fpos = new Float32Array(flickerCount * 3);
        var falpha = new Float32Array(flickerCount);
        for (var i = 0; i < flickerCount; i++) {
            fpos[i*3] = (Math.random() - 0.5) * 1.8;
            fpos[i*3+1] = (Math.random() - 0.5) * 1.8;
            fpos[i*3+2] = 0;
            falpha[i] = Math.random() * 0.5;
        }
        fg.setAttribute("position", new THREE.BufferAttribute(fpos, 3));
        fg.setAttribute("alpha", new THREE.BufferAttribute(falpha, 1));
        var flickerMat = new THREE.PointsMaterial({
            color: 0xffea00, size: 0.012, transparent: true, opacity: 0.3,
            blending: THREE.AdditiveBlending, sizeAttenuation: true
        });
        var flickers = new THREE.Points(fg, flickerMat);
        scene.add(flickers);

        // ===== 动画 =====
        var time = 0;

        function animate() {
            requestAnimationFrame(animate);
            time += 0.005;

            // 网格呼吸
            gridGroup.children.forEach(function(line, i) {
                if (i < hLines) {
                    var p = Math.sin(time * 0.3 + i * 0.3) * 0.5 + 0.5;
                    line.material.opacity = 0.03 + p * 0.08;
                } else if (i < hLines + vLines) {
                    var j = i - hLines;
                    var p = Math.sin(time * 0.2 + j * 0.2) * 0.5 + 0.5;
                    line.material.opacity = 0.02 + p * 0.06;
                }
            });

            // 光柱闪烁
            beamGroup.children.forEach(function(beam) {
                var d = beam.userData;
                beam.material.opacity = 0.02 + Math.sin(time * d.speed + d.offset) * 0.04 + 0.04;
            });

            // 点缓慢漂移
            var dp = dots.geometry.attributes.position.array;
            for (var i = 0; i < dotCount; i++) {
                dp[i*3+1] += Math.sin(time + i) * 0.0003;
                if (dp[i*3+1] > 1) dp[i*3+1] = -1;
            }
            dots.geometry.attributes.position.needsUpdate = true;

            // 闪烁像素
            flickers.material.opacity = 0.15 + Math.sin(time * 3) * 0.1;

            renderer.render(scene, camera);
        }

        animate();

        // 自适应
        window.addEventListener("resize", function() {
            w = el.clientWidth || window.innerWidth;
            h = el.clientHeight || window.innerHeight;
            renderer.setSize(w, h);
        });
    }

    if (document.readyState === "loading")
        document.addEventListener("DOMContentLoaded", init);
    else
        init();
})();