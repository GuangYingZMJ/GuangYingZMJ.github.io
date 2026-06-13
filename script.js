/**
 * ========================================
 *  🎬  GSAP 动画引擎
 *  首屏 Opening + ScrollTrigger 全动效
 * ========================================
 */

// ===== 等待 GSAP 加载 =====
function initAnimations() {

// ===== backToTop 按钮 =====
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", function() {
    var heroH = window.innerHeight;
    if (backToTop) backToTop.classList.toggle("visible", window.scrollY > heroH * 0.5);
});

// ===== 导航栏 - GSAP 微缩放 =====
const navbar = document.getElementById("navbar");
if (navbar && typeof gsap !== "undefined") {
    ScrollTrigger.create({
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: function(self) {
            navbar.style.transform = "translateY(" + (self.progress * -2) + "px)";
        },
    });
}window.addEventListener("scroll", function() {
    var heroH = window.innerHeight;
    if (backToTop) backToTop.classList.toggle("visible", window.scrollY > heroH * 0.5);
});


    if (typeof gsap === "undefined") {
        setTimeout(initAnimations, 100);
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ================================================================
    //  1. 首屏 Opening Animation
    // ================================================================
    const overlay = document.getElementById("introOverlay");
    const letters = document.querySelectorAll(".intro-letter");
    const divider = document.querySelector(".intro-letter-divider");
    const introSub = document.getElementById("introSub");

    if (overlay && letters.length) {
        const tl = gsap.timeline({
            onComplete: () => {
                overlay.style.pointerEvents = "none";
            }
        });

        // Phase 1: Letters stagger in (slower, elegant)
        tl.fromTo(letters,
            {
                y: 80,
                opacity: 0,
                rotateX: 40,
                filter: "blur(10px)",
            },
            {
                y: 0,
                opacity: 1,
                rotateX: 0,
                filter: "blur(0px)",
                duration: 1.2,
                stagger: 0.07,
                ease: "power3.out",
            },
            0.2
        )
        // Divider pop in
        .fromTo(divider,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
            0.8
        )
        // Subtitle fade up
        .fromTo(introSub,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
            1.2
        )
        // Hold
        .to({}, { duration: 0.8 })
        // Phase 2: Letters compress & scatter
        .to(letters,
            {
                y: -60,
                opacity: 0,
                rotateX: -30,
                filter: "blur(6px)",
                duration: 0.7,
                stagger: 0.03,
                ease: "power2.in",
            }
        )
        .to(divider,
            { scale: 0, opacity: 0, duration: 0.3 },
            "-=0.6"
        )
        .to(introSub,
            { y: -30, opacity: 0, duration: 0.4 },
            "-=0.4"
        )
        // Phase 3: Overlay fades + blurs out smoothly
        .to(overlay,
            {
                opacity: 0,
                scale: 1.05,
                filter: "blur(12px)",
                duration: 1.6,
                ease: "power2.inOut",
            },
            "-=0.3"
        )
        .set(overlay, { display: "none" });
    }

    // ================================================================
    //  2. Hero Reveal (after overlay)
    // ================================================================
    const heroName = document.querySelector(".hero-name");
    const heroGreeting = document.querySelector(".hero-greeting");
    const heroTagline = document.querySelector(".hero-tagline");
    const heroDesc = document.querySelector(".hero-desc");
    const heroBtns = document.querySelectorAll(".hero-actions .btn");
    const heroCube = document.querySelector(".cube-container");

    // Set initial states
    if (heroName) {
        gsap.set(heroName, { clipPath: "inset(0 100% 0 0)", y: 40 });
        gsap.set(heroGreeting, { y: 30, opacity: 0 });
        gsap.set(heroTagline, { y: 30, opacity: 0 });
        gsap.set(heroDesc, { y: 30, opacity: 0 });
        gsap.set(heroBtns, { y: 30, opacity: 0 });
        if (heroCube) gsap.set(heroCube, { x: 80, opacity: 0, rotation: 15 });
    }

    const heroTl = gsap.timeline({
        delay: 3.6,
        defaults: { ease: "power3.out" }
    });

    heroTl
        .to(heroGreeting, { y: 0, opacity: 1, duration: 0.6 }, 0)
        .to(heroName, {
            clipPath: "inset(0 0% 0 0)",
            y: 0,
            duration: 1.2,
            ease: "power4.out",
        }, 0.2)
        .to(heroTagline, { y: 0, opacity: 1, duration: 0.7 }, 0.7)
        .to(heroDesc, { y: 0, opacity: 1, duration: 0.7 }, 0.9)
        .to(heroBtns, { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 }, 1.1)
        .to(heroCube, { x: 0, opacity: 1, rotation: 0, duration: 1.0, ease: "power3.out" }, 0.6);

    // ================================================================
    //  3. ScrollTrigger: Section English Titles
    // ================================================================
    document.querySelectorAll(".section-en-title").forEach((title) => {
        const text = title.textContent;
        const chars = text.split("").map((c, i) =>
            `<span class="en-char" data-i="${i}" style="display:inline-block">${c === " " ? "\u00A0" : c}</span>`
        ).join("");
        title.innerHTML = chars;
        title.style.opacity = "1";
        title.style.transform = "none";

        // Animate chars
        gsap.fromTo(
            title.querySelectorAll(".en-char"),
            {
                y: 120,
                opacity: 0,
                rotateX: 30,
            },
            {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 1.0,
                stagger: 0.04,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: title.closest("[data-section]"),
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            }
        );
    });

    // ================================================================
    //  4. ScrollTrigger: Section Subtitle + Title
    // ================================================================
    document.querySelectorAll("[data-section]").forEach((section) => {
        const st = section.querySelector(".section-title");
        const sub = section.querySelector(".section-subtitle");

        if (st) {
            gsap.set(st, { y: 40, opacity: 0 });
            ScrollTrigger.create({
                trigger: section,
                start: "top 75%",
                onEnter: () => {
                    gsap.to(st, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
                },
                once: true,
            });
        }
        if (sub) {
            gsap.set(sub, { y: 30, opacity: 0 });
            ScrollTrigger.create({
                trigger: section,
                start: "top 75%",
                onEnter: () => {
                    gsap.to(sub, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", delay: 0.15 });
                },
                once: true,
            });
        }
    });

    // ================================================================
    //  5. ScrollTrigger: Cards Stagger In
    // ================================================================
    const staggerConfigs = [
        { selector: ".about-card", start: "top 82%", stagger: 0.18 },
        { selector: ".skill-category", start: "top 80%", stagger: 0.2 },
        { selector: ".portfolio-item", start: "top 85%", stagger: 0.12 },
    ];

    staggerConfigs.forEach((cfg) => {
        const items = document.querySelectorAll(cfg.selector);
        if (!items.length) return;

        // Initial states already set via CSS
        const parent = items[0].closest("[data-section]") || items[0].parentElement;

        ScrollTrigger.create({
            trigger: parent,
            start: cfg.start,
            once: true,
            onEnter: () => {
                gsap.to(items, {
                    y: 0,
                    opacity: 1,
                    duration: 0.9,
                    stagger: cfg.stagger,
                    ease: "power3.out",
                });
            },
        });
    });

    // ================================================================
    //  6. Skill Bars
    // ================================================================
    const skillSection = document.querySelector('[data-section="skills"]');
    if (skillSection) {
        ScrollTrigger.create({
            trigger: skillSection,
            start: "top 70%",
            once: true,
            onEnter: () => {
                document.querySelectorAll(".skill-item").forEach((item) => {
                    const level = parseInt(item.dataset.level, 10);
                    const fill = item.querySelector(".skill-fill");
                    const label = item.querySelector(".skill-level-label");
                    if (fill) {
                        gsap.to(fill, {
                            width: level + "%",
                            duration: 1.0,
                            ease: "power3.out",
                            delay: 0.1 * Array.from(item.closest(".skill-items").children).indexOf(item),
                        });
                    }
                    if (label) {
                        gsap.to(label, {
                            color: "rgba(255,255,255,0.7)",
                            duration: 0.8,
                            delay: 0.3 + 0.1 * Array.from(item.closest(".skill-items").children).indexOf(item),
                            ease: "power2.out",
                        });
                    }
                });
            },
        });
    }

    // ================================================================
    //  7. Portfolio Image / Placeholder Reveal
    // ================================================================
    document.querySelectorAll(".portfolio-item").forEach((item) => {
        const thumb = item.querySelector(".portfolio-thumb");
        const img = thumb?.querySelector("img, .placeholder-thumb");
        if (!img) return;

        gsap.set(img, { scale: 1.1, clipPath: "inset(0 0 100% 0)" });

        ScrollTrigger.create({
            trigger: item,
            start: "top 88%",
            once: true,
            onEnter: () => {
                gsap.to(img, {
                    scale: 1,
                    clipPath: "inset(0 0 0% 0)",
                    duration: 1.0,
                    ease: "power3.out",
                });
            },
        });

        // Subtle parallax on scroll
        if (img.tagName === "IMG") {
            ScrollTrigger.create({
                trigger: thumb,
                start: "top bottom",
                end: "bottom top",
                onUpdate: (self) => {
                    const y = self.progress * 30 - 15;
                    gsap.set(img, { y: y });
                },
            });
        }
    });

    // ================================================================
    //  8. Hero Background Parallax
    // ================================================================
    const heroBg = document.querySelector(".hero-bg");
    if (heroBg) {
        gsap.to(heroBg, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 1,
            },
        });
    }

    // ================================================================
    //  9. Cube subtle floating on scroll
    // ================================================================
    const cube = document.querySelector(".cube");
    if (cube) {
        ScrollTrigger.create({
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
            onUpdate: (self) => {
                gsap.set(cube, {
                    rotationX: -20 + self.progress * 10,
                    rotationY: self.progress * 180,
                });
            },
        });
    }

    // ================================================================
    //  Refresh ScrollTrigger after everything is rendered
    // ================================================================
    ScrollTrigger.refresh();
    // ================================================================
    // ================================================================
    //  10. Gradual Blur - React Bits style layered blur
    // ================================================================
    var gradualBlurStyles = document.createElement("style");
    gradualBlurStyles.textContent = ".gradient-mask-btm { mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%); }";
    document.head.appendChild(gradualBlurStyles);

    function createGradualBlur(container) {
        var layers = 8;
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < layers; i++) {
            var div = document.createElement("div");
            var progress = (i + 1) / layers;
            var blurVal = Math.pow(2, progress * 4) * 0.0625 * 3;
            div.className = "gradient-mask-btm";
            div.style.cssText = "position:absolute;inset:0;backdrop-filter:blur(" + blurVal.toFixed(3) + "rem);-webkit-backdrop-filter:blur(" + blurVal.toFixed(3) + "rem);background:transparent;z-index:" + (i + 1) + ";pointer-events:none;";
            fragment.appendChild(div);
        }
        container.appendChild(fragment);
    }

    document.querySelectorAll(".about-card, .skill-category, .portfolio-item").forEach(function(el) {
        var wrapper = document.createElement("div");
        wrapper.style.cssText = "position:relative;overflow:hidden;";
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
        el.style.opacity = "0";
        var blurOverlay = document.createElement("div");
        blurOverlay.style.cssText = "position:absolute;inset:0;z-index:50;pointer-events:none;";
        wrapper.appendChild(blurOverlay);

        // Create gradual blur layers
        var layers = 4;
        for (var i = 0; i < layers; i++) {
            var div = document.createElement("div");
            var progress = (i + 1) / layers;
            var blurVal = Math.pow(2, progress * 3) * 0.0625 * 0.8;
            div.style.cssText = "position:absolute;inset:0;backdrop-filter:blur(" + blurVal.toFixed(3) + "rem);-webkit-backdrop-filter:blur(" + blurVal.toFixed(3) + "rem);z-index:" + (i + 1) + ";opacity:0;transition:opacity 0.6s ease-out;";
            blurOverlay.appendChild(div);
        }

        var blurDivs = blurOverlay.querySelectorAll("div");
        ScrollTrigger.create({
            trigger: wrapper,
            start: "top 90%",
            once: true,
            onEnter: function() {
                blurDivs.forEach(function(d, idx) {
                    setTimeout(function() {
                        d.style.opacity = "1";
                    }, idx * 40);
                });
                setTimeout(function() {
                    blurOverlay.style.opacity = "0";
                    blurOverlay.style.transition = "opacity 0.8s ease-out";
                    el.style.opacity = "1";
                    setTimeout(function() {
                        blurOverlay.style.display = "none";
                    }, 800);
                }, layers * 40 + 400);
            },
        });
    });

    // ================================================================
    //  11. Shape Blur - React Bits style radial blur on hover
    // ================================================================
    var shapeBlurStyle = document.createElement("style");
    shapeBlurStyle.textContent = ".shape-blur-el { position:relative; overflow:hidden; } .shape-blur-overlay { position:absolute; inset:0; pointer-events:none; z-index:10; opacity:0; transition:opacity 0.3s; backdrop-filter:blur(0px); -webkit-backdrop-filter:blur(0px); mask-image:radial-gradient(circle at var(--mx,50%) var(--my,50%), black var(--circleSize,0%), transparent calc(var(--circleSize,0%) + 20%)); -webkit-mask-image:radial-gradient(circle at var(--mx,50%) var(--my,50%), black var(--circleSize,0%), transparent calc(var(--circleSize,0%) + 20%)); } .shape-blur-el:hover .shape-blur-overlay { opacity:1; }";
    document.head.appendChild(shapeBlurStyle);

    document.querySelectorAll(".btn, .filter-btn, .portfolio-item").forEach(function(el) {
        el.className = (el.className || "") + " shape-blur-el";
        var overlay = document.createElement("div");
        overlay.className = "shape-blur-overlay";
        overlay.style.background = "rgba(255,255,255,0.3)";
        el.appendChild(overlay);

        el.addEventListener("mousemove", function(e) {
            var rect = el.getBoundingClientRect();
            var x = ((e.clientX - rect.left) / rect.width) * 100;
            var y = ((e.clientY - rect.top) / rect.height) * 100;
            overlay.style.setProperty("--mx", x + "%");
            overlay.style.setProperty("--my", y + "%");
            overlay.style.setProperty("--circleSize", "35%");
            overlay.style.backdropFilter = "blur(4px)";
            overlay.style.webkitBackdropFilter = "blur(4px)";
        });

        el.addEventListener("mouseleave", function() {
            overlay.style.setProperty("--circleSize", "0%");
            overlay.style.backdropFilter = "blur(0px)";
            overlay.style.webkitBackdropFilter = "blur(0px)";
        });
    });

    // ================================================================
    //  12. Hero Parallax - Mouse tracking
    // ================================================================
    const heroSection = document.querySelector(".hero");
    if (heroSection) {
        document.addEventListener("mousemove", function(e) {
            const rect = heroSection.getBoundingClientRect();
            if (e.clientY < rect.bottom && e.clientY > rect.top) {
                const x = (e.clientX / window.innerWidth - 0.5) * 2;
                const y = (e.clientY / window.innerHeight - 0.5) * 2;
                const bg = heroSection.querySelector(".hero-bg");
                if (bg) {
                    bg.style.transform = "translate(" + (x * -25) + "px, " + (y * -15) + "px)";
                }
            }
        });
    }
}

// Start when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAnimations);
} else {
    initAnimations();
}









