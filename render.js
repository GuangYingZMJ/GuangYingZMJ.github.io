/**
 * ========================================
 *  🎨  渲染引擎 — 从 config.js 读取数据填充页面
 *  📦  你只需要改 config.js，这里不用动
 * ========================================
 */

(function() {
    const C = SITE_CONFIG;

    // ----- 浏览器标签 -----
    document.title = C.pageTitle || C.brand + " · 作品集";
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) favicon.href = C.favicon;

    // ----- 导航栏 -----
    document.getElementById('navLogo').innerHTML = C.brand || C.name;
    const navMenu = document.getElementById('navMenu');
    navMenu.innerHTML = C.nav.map(item =>
        `<li><a href="${item.href}" class="nav-link">${item.label}</a></li>`
    ).join('');

    // ----- Hero -----
    document.getElementById('heroName').textContent = C.brand;
    document.getElementById('heroTagline').innerHTML = C.title.replace(/\|/g, '<span class="divider">|</span>');
    document.getElementById('heroDesc').innerHTML = C.tagline + '<br/>' + C.description;

    // ----- Hero 按钮 -----
    const heroActions = document.getElementById("heroActions");
    if (heroActions && C.heroButtons) {
        heroActions.innerHTML = C.heroButtons.map(function(btn) {
            var a = document.createElement("a");
            a.href = btn.href;
            a.className = "btn btn-" + btn.type;
            a.textContent = btn.label;
            return a.outerHTML;
        }).join("");
    }

    // ----- 关于我 -----
    const aboutGrid = document.getElementById('aboutGrid');
    aboutGrid.innerHTML = `
        <div class="about-card info-card">
            <div class="card-icon">👤</div>
            <h3>基本信息</h3>
            <ul class="info-list">
                <li><span class="label">品牌</span>${C.brand}</li>
                <li><span class="label">领域</span>AE 特效 / Blender 3D 建模</li>
                <li><span class="label">现居</span>${C.profile.location || "湖南长沙"}</li>
            </ul>
        </div>
        <div class="about-card target-card">
            <div class="card-icon">🎯</div>
            <h3>求职意向</h3>
            <div class="target-tags">
                ${C.jobTargets.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
            <p class="target-desc">${C.jobDesc}</p>
        </div>
        <div class="about-card self-eval-card">
            <div class="card-icon">💡</div>
            <h3>自我评价</h3>
            <p>${C.selfEval}</p>
        </div>
    `;

    // ----- 技能 -----
    const skillsGrid = document.getElementById('skillsGrid');
    skillsGrid.innerHTML = C.skills.map(cat => `
        <div class="skill-category">
            <div class="skill-cat-header ${cat.class}">
                <span class="skill-icon">${cat.icon}</span>
                <h3>${cat.category}</h3>
            </div>
            <div class="skill-items">
                ${cat.items.map(skill => `
                    <div class="skill-item" data-level="${skill.level}">
                        <span class="skill-name">${skill.name}</span>
                        <div class="skill-bar-wrap">
                            <div class="skill-bar"><div class="skill-fill"></div></div>
                        </div>
                        <span class="skill-level-label">${skill.level}%</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    // ----- 作品筛选按钮 -----
    const filterContainer = document.getElementById('portfolioFilter');
    filterContainer.innerHTML = C.portfolioCategories.map((cat, i) =>
        `<button class="filter-btn${i === 0 ? ' active' : ''}" data-filter="${cat.value}">${cat.label}</button>`
    ).join('');

    // ----- 作品卡片 -----
    const portfolioGrid = document.getElementById('portfolioGrid');
    portfolioGrid.innerHTML = C.portfolioItems.map(item => {
        const imgTag = item.image
            ? `<img src="${item.image}" alt="${item.label}" style="width:100%;height:100%;object-fit:cover;" />`
            : `<div class="placeholder-thumb ${item.thumbClass}"><span>${item.icon}</span><p>${item.label}</p></div>`;
        return `
            <div class="portfolio-item" data-category="${item.category}">
                <div class="portfolio-thumb">
                    ${imgTag}
                    <div class="portfolio-overlay">
                        <span class="overlay-cat">${C.portfolioCategories.find(c => c.value === item.category)?.label || item.category}</span>
                        <p class="overlay-desc">${item.desc}</p>
                    </div>
                </div>
                <div class="portfolio-info">
                    <h4>${item.label}</h4>
                    <p>${item.desc}</p>
                </div>
            </div>
        `;
    }).join('');

    // ----- Footer -----
    const year = new Date().getFullYear();
    document.getElementById('footerText').innerHTML = `&copy; ${year} ${C.name} · ${C.footer}`;

})();




