/**
 * ========================================
 *  🔧  网站配置文件 — 改这里就能更新全站
 *  📍  修改后刷新页面即可看到效果
 * ========================================
 */
const SITE_CONFIG = {

    // ===== 基本信息 =====
    name: "光影造梦局",
    initials: "GY",
    nameShort: "造梦局",
    title: "AE 特效师 | Blender 3D 建模",
    tagline: "视觉设计师 · AE 特效 / Blender 3D",
    description: "深耕影视后期与三维设计，擅长 AE 特效 + 3D 建模 + 视觉可视化创作",
    brand: "光影造梦局",

    // ===== 个人资料（关于我） =====
    profile: {
        location: "湖南长沙",
    },

    // ===== 求职意向 =====
    jobTargets: [
        "AE 特效师",
        "Blender 3D 建模师",
    ],
    jobDesc: "可全职配合岗位工作，致力于长期深耕影视后期与三维可视化领域。",

    // ===== 自我评价 =====
    selfEval: "专注于 AE 特效与 Blender 3D 建模，擅长将空间数据与视觉创意结合。严谨注重细节，自主学习能力强，善于团队协作与沟通，致力于创造有影响力的视觉作品。",

    // ===== 社交链接（改这里！） =====
    social: {
        // 去掉左边的 // 即可启用，填入你的链接
        // wechat: "你的微信ID",
        // bilibili: "https://space.bilibili.com/你的UID",
        // artstation: "https://www.artstation.com/你的用户名",
        // github: "https://github.com/你的用户名",
        // behance: "https://www.behance.net/你的用户名",
    },

    // ===== 导航菜单 =====
    nav: [
        { label: "首页",     href: "#home" },
        { label: "关于",     href: "#about" },
        { label: "技能",     href: "#skills" },
        { label: "作品",     href: "#portfolio" },
        
    ],

    // ===== Hero 按钮链接（可改为外部链接，如作品集页面） =====
    heroButtons: [
        { label: "查看作品", href: "#portfolio", type: "primary" },
        { label: "了解更多", href: "#about", type: "outline" },
    ],

    // ===== 技能数据 =====
    skills: [
        {
            category: "AE 特效合成",
            icon: "⚡",
            class: "ae-header",
            items: [
                { name: "特效合成 / MG 动画",       level: 95 },
                { name: "关键帧 / 蒙版抠像 / 跟踪",  level: 90 },
                { name: "粒子光效 / 视频调色",       level: 85 },
                { name: "Element 3D / Particular", level: 88 },
                { name: "蓝宝石插件 / 表达式",       level: 80 },
            ],
        },
        {
            category: "Blender 3D 建模",
            icon: "🧊",
            class: "blender-header",
            items: [
                { name: "多边形 / 硬表面建模",        level: 90 },
                { name: "UV 拆分 / 纹理绘制 / PBR",   level: 85 },
                { name: "Cycles / Eevee 渲染",        level: 80 },
                { name: "地形建模 / 测绘可视化",      level: 88 },
                { name: "Substance 3D Painter",       level: 75 },
            ],
        },
        {
            category: "软件生态联动",
            icon: "🛠️",
            class: "software-header",
            items: [
                { name: "Adobe Substance 3D Painter", level: 85 },
                { name: "Photoshop",              level: 80 },
                { name: "C4D / 3DMAX",            level: 75 },
                { name: "Unreal Engine 5",         level: 70 },
                { name: "ArcGIS / 剪映",            level: 70 },
            ],
        },
    ],

    // ===== 作品集分类 =====
    portfolioCategories: [
        { value: "all",     label: "全部" },
        { value: "ae",      label: "AE 特效" },
        { value: "blender", label: "Blender 3D" },
        { value: "viz",     label: "测绘可视化" },
    ],

    // ===== 作品卡片（改这里！上传作品后替换占位符） =====
    portfolioItems: [
        {
            category: "ae",
            icon: "🎬",
            label: "AE 特效合成",
            desc: "MG 动画 / 粒子光效 / 片头包装",
            thumbClass: "ae-placeholder",

        },
        {
            category: "blender",
            icon: "🧊",
            label: "Blender 3D 建模",
            desc: "硬表面建模 / 场景渲染 / PBR 贴图",
            thumbClass: "blender-placeholder",
        },
        {
            category: "viz",
            icon: "🗺️",
            label: "地形可视化",
            desc: "点云数据 / 地形建模 / 实景还原",
            thumbClass: "viz-placeholder",
        },
        {
            category: "ae",
            icon: "🎥",
            label: "视频调色",
            desc: "达芬奇调色 / 风格化色彩",
            thumbClass: "ae-placeholder",
        },
        {
            category: "blender",
            icon: "🏔️",
            label: "三维场景搭建",
            desc: "地形建模 / 场景布局 / 灯光渲染",
            thumbClass: "blender-placeholder",
        },
        {
            category: "viz",
            icon: "📐",
            label: "GIS 数据可视化",
            desc: "ArcGIS 数据处理 / 空间分析展示",
            thumbClass: "viz-placeholder",
        },
    ],

    // ===== 页脚 =====
    footer: "用 ❤️ 打造",

    // ===== SEO / 浏览器标签 =====
    pageTitle: "光影造梦局 · 视觉作品集",
    favicon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22><text y=%2228%22 font-size=%2228%22>✨</text></svg>',
};







