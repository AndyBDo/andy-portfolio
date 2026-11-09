import * as T from 'three';
export function panorama(){
const canvas=document.querySelector('#panorama');let renderer;try{renderer=new T.WebGLRenderer({canvas,antialias:false});}catch{return;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));const scene=new T.Scene();scene.background=new T.Color('#91b5d9');scene.fog=new T.Fog('#a8c4d7',48,115);
scene.add(new T.HemisphereLight(0xdcefff,0x5f5131,2));const sun=new T.DirectionalLight(0xfff0ca,2.3);sun.position.set(-30,50,20);scene.add(sun);
let seed=42;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
const blocks=[];const add=(x,y,z,sx,sy,sz,c)=>blocks.push({x,y,z,sx,sy,sz,c});
for(let x=-64;x<64;x++)for(let z=-64;z<64;z++){
const river=Math.sin(z*.045)*13;const distance=Math.abs(x-river);const h=Math.floor(2+Math.sin(x*.12)*2+Math.cos(z*.10)*2+Math.sin((x+z)*.07)*3+Math.max(0,distance-25)*.19);const height=distance<9?0:Math.max(1,h);
add(x,height/2-2,z,1,height+3,1,height>9?'#777e70':height<2?'#b2ac7d':'#637d39');
if(height>2&&rand()<.025){add(x,height+1,z,.65,4,.65,'#645039');for(let k=0;k<3;k++)add(x,height+3+k,z,4-k,1.4,4-k,['#49652e','#527634','#608239'][k]);}}
const mesh=new T.InstancedMesh(new T.BoxGeometry(),new T.MeshLambertMaterial(),blocks.length);const obj=new T.Object3D();blocks.forEach((b,i)=>{obj.position.set(b.x,b.y,b.z);obj.scale.set(b.sx,b.sy,b.sz);obj.updateMatrix();mesh.setMatrixAt(i,obj.matrix);mesh.setColorAt(i,new T.Color(b.c).multiplyScalar(.86+rand()*.25));});scene.add(mesh);
const water=new T.Mesh(new T.PlaneGeometry(130,130),new T.MeshLambertMaterial({color:0x3879ac,transparent:true,opacity:.8}));water.rotation.x=-Math.PI/2;water.position.y=.1;scene.add(water);
for(let i=0;i<22;i++){const cloud=new T.Mesh(new T.BoxGeometry(8+rand()*12,.7,4+rand()*6),new T.MeshBasicMaterial({color:0xf1f3ef}));cloud.position.set(rand()*140-70,28+rand()*6,rand()*140-70);scene.add(cloud);}
const camera=new T.PerspectiveCamera(70,1,.1,170);camera.position.set(0,13,18);const reduced=matchMedia('(prefers-reduced-motion: reduce)');let angle=.35,last=0;function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}addEventListener('resize',resize);resize();renderer.setAnimationLoop(t=>{if(!document.hidden){if(!reduced.matches)angle+=Math.min((t-last)/1000,.05)*.018;camera.lookAt(Math.sin(angle)*60,7,18-Math.cos(angle)*60);renderer.render(scene,camera);}last=t;});}
