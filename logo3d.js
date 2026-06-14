/**
 * 3D 光影 Logo - 球形 + 柔和边缘
 * 鼠标按住拖拽旋转，松手后匀速自转
 */
(function(){function init(){if(typeof THREE==="undefined"){var s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";s.onload=start;document.head.appendChild(s)}else{start()}}function start(){var el=document.getElementById("cubeContainer");if(!el||el._loaded)return;el._loaded=1;while(el.firstChild)el.removeChild(el.firstChild);var size=Math.min(Math.min(el.clientWidth||300,window.innerWidth*0.4),350);if(size<100)size=300;el.style.width=size+"px";el.style.height=size+"px";el.style.margin="0 auto";var scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(50,1,0.1,50);camera.position.set(0,0.5,5);camera.lookAt(0,0,0);var renderer=new THREE.WebGLRenderer({alpha:!0,antialias:!0});renderer.setSize(size,size);renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.setClearColor(0,0);el.appendChild(renderer.domElement);var group=new THREE.Group();scene.add(group)

// ===== 1. 主球体（占大部分透明度，接近100不透明） =====
var sphereMat=new THREE.MeshPhysicalMaterial({
    color:0x00f0ff,emissive:0x00f0ff,emissiveIntensity:0.25,
    metalness:0.3,roughness:0.05,clearcoat:0.4,clearcoatRoughness:0.3,
    transparent:!0,opacity:0.97
})
var sphere=new THREE.Mesh(new THREE.SphereGeometry(1.2,48,48),sphereMat)
group.add(sphere)

// ===== 2. 发光内核心 =====
var coreMat=new THREE.MeshBasicMaterial({
    color:0xff2d95,transparent:!0,opacity:0.35
})
var core=new THREE.Mesh(new THREE.SphereGeometry(0.6,24,24),coreMat)
group.add(core)

// ===== 3. 外层光晕（边缘柔和过渡 0→几乎100） =====
var glowMat=new THREE.MeshPhysicalMaterial({
    color:0x00f0ff,emissive:0x00f0ff,emissiveIntensity:0.1,
    transparent:!0,opacity:0.25,
    metalness:0,roughness:0.4,
    side:THREE.BackSide
})
var glow=new THREE.Mesh(new THREE.SphereGeometry(1.6,32,32),glowMat)
group.add(glow)

// ===== 4. 外层半透明壳（从边缘到内，透明度0→100渐变，但大部分区域不透明） =====
// 用两个半径略有差异的球壳制造柔和边缘雾化效果
for(var i=0;i<3;i++){
    var r=1.25+i*0.12
    var op=0.5-i*0.15
    var shellMat=new THREE.MeshPhysicalMaterial({
        color:0x00f0ff,emissive:0x00f0ff,emissiveIntensity:0.05,
        transparent:!0,opacity:Math.max(0,op),
        metalness:0.2,roughness:0.3,
        side:THREE.DoubleSide,depthWrite:!1
    })
    var shell=new THREE.Mesh(new THREE.SphereGeometry(r,32,32),shellMat)
    group.add(shell)
}

// ===== 5. 轨道光环 =====
function ring(r,tr,col,rx,ry){
    var m=new THREE.Mesh(new THREE.TorusGeometry(r,tr,24,48),
        new THREE.MeshPhysicalMaterial({color:col,emissive:col,emissiveIntensity:0.4,metalness:0.6,roughness:0.3,transparent:!0,opacity:0.5}))
    m.rotation.x=rx;m.rotation.y=ry;return m
}
var rings=[
    ring(1.8,0.025,0x00f0ff,Math.PI/3,0),
    ring(2.1,0.02,0xff2d95,Math.PI/1.5,Math.PI/4),
    ring(1.5,0.015,0xffea00,Math.PI/2.5,-Math.PI/3)
]
rings.forEach(function(r){group.add(r)})

// ===== 6. 粒子 =====
var pc=100,g=new THREE.BufferGeometry(),pos=new Float32Array(pc*3),cols=new Float32Array(pc*3)
var pal=[new THREE.Color(0x00f0ff),new THREE.Color(0xff2d95),new THREE.Color(0xffea00)]
for(var i=0;i<pc;i++){
    var t=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1),r=2.5+Math.random()*2
    pos[i*3]=r*Math.sin(p)*Math.cos(t);pos[i*3+1]=r*Math.sin(p)*Math.sin(t);pos[i*3+2]=r*Math.cos(p)
    var c=pal[Math.floor(Math.random()*3)]
    cols[i*3]=c.r;cols[i*3+1]=c.g;cols[i*3+2]=c.b
}
g.setAttribute("position",new THREE.BufferAttribute(pos,3))
g.setAttribute("color",new THREE.BufferAttribute(cols,3))
var pts=new THREE.Points(g,new THREE.PointsMaterial({size:0.05,vertexColors:!0,transparent:!0,opacity:0.6,blending:THREE.AdditiveBlending,sizeAttenuation:!0}))
group.add(pts)

// ===== 灯光 =====
var l1=new THREE.PointLight(0x00f0ff,1.2,8);l1.position.set(2.5,2,2);scene.add(l1)
var l2=new THREE.PointLight(0xff2d95,1.2,8);l2.position.set(-2,-1.5,2.5);scene.add(l2)
scene.add(new THREE.AmbientLight(0x334466,0.4))

// ===== 鼠标拖拽 =====
var isDragging=!1,prevX=0,prevY=0,dragRotX=0,dragRotY=0,velX=0,velY=0,autoRotY=0
el.style.cursor="grab"
function onDown(e){isDragging=!0;el.style.cursor="grabbing";var p=getPos(e);prevX=p.x;prevY=p.y;velX=0;velY=0}
function onMove(e){if(!isDragging)return;var p=getPos(e),dx=p.x-prevX,dy=p.y-prevY;dragRotY+=dx*0.005;dragRotX+=dy*0.005;dragRotX=Math.max(-1.2,Math.min(1.2,dragRotX));velX=dy*0.005;velY=dx*0.005;prevX=p.x;prevY=p.y}
function onUp(){isDragging=!1;el.style.cursor="grab"}
function getPos(e){return e.touches?{x:e.touches[0].clientX,y:e.touches[0].clientY}:{x:e.clientX,y:e.clientY}}
el.addEventListener("mousedown",onDown)
document.addEventListener("mousemove",onMove)
document.addEventListener("mouseup",onUp)
el.addEventListener("touchstart",function(e){e.preventDefault();onDown(e)},{passive:!1})
document.addEventListener("touchmove",function(e){if(isDragging)e.preventDefault();onMove(e)},{passive:!1})
document.addEventListener("touchend",onUp)

// ===== 动画 =====
var time=0;
(function loop(){requestAnimationFrame(loop);time+=0.01
if(!isDragging){if(Math.abs(velY)>0.0001||Math.abs(velX)>0.0001){dragRotY+=velY;dragRotX+=velX;dragRotX=Math.max(-1.2,Math.min(1.2,dragRotX));velY*=0.95;velX*=0.95}else{velY=0;velX=0};autoRotY+=0.003}
group.rotation.y=autoRotY+dragRotY;group.rotation.x=dragRotX

// 球体脉冲
var p=Math.sin(time)*0.1+0.9
sphereMat.emissiveIntensity=0.2+p*0.2
coreMat.opacity=0.25+Math.sin(time*1.5)*0.12

// 光环自转
rings[0].rotation.z+=0.01;rings[1].rotation.x+=0.008;rings[1].rotation.z+=0.005
rings[2].rotation.y+=0.012;rings[2].rotation.x+=0.006

// 颜色渐变
var hue=0.55+Math.sin(time*0.25)*0.12
var hc=new THREE.Color().setHSL(hue,0.85,0.5)
sphereMat.color.copy(hc);sphereMat.emissive.copy(hc)
glowMat.color.copy(hc);glowMat.emissive.copy(hc)

// 灯光环绕
l1.position.set(Math.sin(time*0.6)*2.5,1.5+Math.sin(time*0.4)*0.5,Math.cos(time*0.6)*2.5)
l2.position.set(Math.sin(time*0.4+2)*2.5,-1+Math.sin(time*0.3)*0.5,Math.cos(time*0.4+2)*2.5)

pts.rotation.y+=0.001;renderer.render(scene,camera)})()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init()})();