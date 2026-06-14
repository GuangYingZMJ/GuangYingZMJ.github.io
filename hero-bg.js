/**
 * Cyberpunk Hero Background - 纯 Canvas 2D 实现，无冲突
 */
(function() {
    var canvas, ctx, w, h, animId;

    function init() {
        var bg = document.querySelector(".hero-bg");
        if (!bg || bg._bgReady) return;
        bg._bgReady = true;

        canvas = document.createElement("canvas");
        canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none";
        bg.parentNode.insertBefore(canvas, bg.nextSibling);

        resize();
        window.addEventListener("resize", resize);
        start();
    }

    function resize() {
        var hero = document.querySelector(".hero");
        w = hero ? hero.clientWidth : window.innerWidth;
        h = hero ? hero.clientHeight : window.innerHeight;
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        ctx = canvas.getContext("2d");
    }

    function start() {
        // 网格参数
        var grid = { size: 40, opacity: 0 };
        var beams = [];
        var dots = [];
        var time = 0;

        // 初始化光柱
        for (var i = 0; i < 10; i++) {
            beams.push({
                x: Math.random() * w,
                w: 1 + Math.random() * 2,
                h: 30 + Math.random() * 80,
                speed: 0.3 + Math.random() * 0.5,
                offset: Math.random() * Math.PI * 2,
                color: Math.random() > 0.5 ? "0, 240, 255" : "255, 45, 149"
            });
        }

        // 初始化粒子
        for (var i = 0; i < 50; i++) {
            dots.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.3,
                vy: -0.1 - Math.random() * 0.3,
                size: 0.5 + Math.random() * 1.5,
                alpha: 0.1 + Math.random() * 0.3
            });
        }

        function draw() {
            animId = requestAnimationFrame(draw);
            time += 0.01;

            ctx.clearRect(0, 0, w, h);

            // ---- 网格 ----
            var gridAlpha = 0.04 + Math.sin(time * 0.2) * 0.02;
            ctx.strokeStyle = "rgba(0, 240, 255, " + gridAlpha + ")";
            ctx.lineWidth = 0.5;

            var offset = (time * 10) % grid.size;
            for (var x = -grid.size + offset; x < w + grid.size; x += grid.size) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (var y = -grid.size + offset; y < h + grid.size; y += grid.size) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }

            // ---- 光柱 ----
            for (var i = 0; i < beams.length; i++) {
                var b = beams[i];
                var alpha = 0.03 + Math.sin(time * b.speed + b.offset) * 0.03;
                var grad = ctx.createLinearGradient(b.x, 0, b.x + b.w, 0);
                grad.addColorStop(0, "rgba(" + b.color + ", 0)");
                grad.addColorStop(0.5, "rgba(" + b.color + ", " + alpha + ")");
                grad.addColorStop(1, "rgba(" + b.color + ", 0)");
                ctx.fillStyle = grad;
                ctx.fillRect(b.x, (h - b.h) / 2, b.w, b.h);
            }

            // ---- 粒子 ----
            for (var i = 0; i < dots.length; i++) {
                var d = dots[i];
                d.x += d.vx;
                d.y += d.vy;
                if (d.y < -5) { d.y = h + 5; d.x = Math.random() * w; }
                if (d.x < -5 || d.x > w + 5) d.x = Math.random() * w;

                var pulse = 0.5 + Math.sin(time * 2 + i) * 0.5;
                ctx.fillStyle = "rgba(0, 240, 255, " + (d.alpha * pulse) + ")";
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
                ctx.fill();
            }

            // ---- 闪烁像素 ----
            for (var i = 0; i < 15; i++) {
                var fx = Math.random() * w;
                var fy = Math.random() * h;
                var fa = Math.random() * 0.08;
                ctx.fillStyle = "rgba(255, 234, 0, " + fa + ")";
                ctx.fillRect(fx, fy, 2, 2);
            }
        }

        draw();
    }

    if (document.readyState === "loading")
        document.addEventListener("DOMContentLoaded", init);
    else
        init();
})();