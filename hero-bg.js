/**
 * Cyberpunk Hero Video Background
 * 全屏视频背景
 */
(function() {
    function init() {
        var hero = document.querySelector(".hero");
        if (!hero || hero._videoLoaded) return;
        hero._videoLoaded = true;

        var bg = hero.querySelector(".hero-bg");
        if (!bg) return;

        // 创建视频元素
        var video = document.createElement("video");
        video.src = "https://cdn.coverr.co/videos/coverr-neon-city-2835/1080p.mp4";
        video.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;pointer-events:none";
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = true;
        video.setAttribute("playsinline", "");

        // 插到 hero-bg 后面
        bg.parentNode.insertBefore(video, bg.nextSibling);

        // 播放
        video.play().catch(function() {});
    }

    if (document.readyState === "loading")
        document.addEventListener("DOMContentLoaded", init);
    else
        init();
})();