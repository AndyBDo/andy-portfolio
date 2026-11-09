import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {VoxelModel} from './voxel-model';
import {campusBuildings} from './campus-buildings';
import {campusSky} from './campus-sky';

// X is east, Z is south; the tower is the origin. The scene remains live 3D.
export function panorama() {
  let renderer;
  const canvas=document.querySelector('#panorama');
  try {renderer=new T.WebGLRenderer({canvas,antialias:true});} catch {canvas.dataset.textures='failed';return;}
  // The blurred backdrop renders at display resolution; menu text stays native.
  renderer.setPixelRatio(1);
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  const scene=new T.Scene();scene.background=new T.Color('#d9a18c');scene.fog=new T.Fog('#d9a18c',350,1050);scene.add(campusSky());
  scene.add(new T.HemisphereLight('#b5b9e2','#79513d',1.2));
  const sun=new T.DirectionalLight('#ffb969',3.1);sun.position.set(-180,65,65);sun.target.position.set(15,0,-30);
  sun.castShadow=true;sun.shadow.mapSize.set(4096,4096);
  Object.assign(sun.shadow.camera,{left:-185,right:185,top:185,bottom:-185,near:1,far:500});
  // Keep façade ledges clear of their own shadow-map samples at grazing angles.
  sun.shadow.normalBias=.4;sun.shadow.bias=-.0007;sun.shadow.radius=2.5;scene.add(sun,sun.target);
  const bounce=new T.DirectionalLight('#a9b6e2',.45);bounce.position.set(120,70,100);scene.add(bounce);
  let loadedTextures=0;
  const loads=[],failed=[],loader=new T.TextureLoader(),maps=new Map();
  function material(name,tint='#ffffff',cutout=false) {
    let map=maps.get(name);
    if(!map){
      let resolve;loads.push(new Promise(done=>{resolve=()=>{loadedTextures++;canvas.dataset.progress=String(loadedTextures/loads.length);done();};}));
      map=loader.load(`/minecraft/assets/minecraft/textures/block/${name}.png`,resolve,undefined,()=>{failed.push(name);resolve();});
      map.colorSpace=T.SRGBColorSpace;map.magFilter=T.NearestFilter;map.minFilter=T.LinearMipmapLinearFilter;
      map.wrapS=map.wrapT=T.RepeatWrapping;map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());maps.set(name,map);
    }
    return new T.MeshLambertMaterial({map,color:tint,alphaTest:cutout?.5:0,side:cutout?T.DoubleSide:T.FrontSide});
  }
  const materials={
    towerStone:material('sandstone_top','#f7e6b5'),limestone:material('sandstone_top','#fff7de'),
    urisStone:material('sandstone','#d5c9b1'),stoneShade:material('brown_terracotta','#cfb57f'),
    olinStone:material('quartz_block_side','#ece2cb'),oldStone:material('andesite','#a7a69d'),
    stoneTrim:material('smooth_stone','#d7d5c8'),gothicStone:material('andesite','#b5bcb9'),
    sageBrick:material('bricks'),chapelBrick:material('red_terracotta','#f6d9cd'),
    redStone:material('bricks','#d8c6bc'),slate:material('light_gray_concrete','#d4d8da'),
    roofGravel:material('smooth_stone','#bdbbb2'),baseStone:material('stone_bricks','#a2a49a'),
    window:material('gray_concrete','#465665'),roseGlass:material('red_terracotta','#655272'),
    glassWall:material('light_gray_concrete','#86aab5'),copper:material('gray_concrete','#7baca1'),
    bronze:material('brown_terracotta','#b99378'),gold:material('gold_block'),oak:material('oak_planks','#9d835c'),
    grass:material('grass_block_top','#b0cc6b'),dirt:material('grass_block_side'),path:material('smooth_stone','#d4d3c4'),
    road:material('gray_concrete','#9d9c93'),yellow:material('yellow_concrete'),white:material('white_concrete'),
    leaves:material('oak_leaves','#b7d96b',true),leavesLight:material('birch_leaves','#d0df89',true),
    leavesDark:material('spruce_leaves','#81a96c',true),wood:material('oak_log'),birch:material('birch_log'),
    hedge:material('moss_block','#71984c'),shortGrass:material('short_grass','#91b74d',true),
    fern:material('fern','#8eaf4a',true),daisy:material('oxeye_daisy','#ffffff',true),poppy:material('poppy','#ffffff',true),
  };
  const batches=new Map();
  function collect(name,geometry) {
    if(!materials[name])throw new Error(`Missing campus material ${name}`);
    if(!batches.has(name))batches.set(name,[]);batches.get(name).push(geometry);
  }
  function addModel(model,x=0,y=0,z=0,turn=0) {
    const matrix=new T.Matrix4().makeRotationY(turn);matrix.setPosition(x,y,z);
    for(const result of model.build()) {
      const geometry=new T.BufferGeometry();
      geometry.setAttribute('position',new T.Float32BufferAttribute(result.positions,3));
      geometry.setAttribute('normal',new T.Float32BufferAttribute(result.normals,3));
      geometry.setAttribute('uv',new T.Float32BufferAttribute(result.uvs,2));
      geometry.setIndex(result.indices);geometry.applyMatrix4(matrix);collect(result.material,geometry);
    }
  }
  function box(mat,x,y,z,w,h,d,openTop=false) {
    const geo=new T.BoxGeometry(w,h,d),uv=geo.attributes.uv;
    if(openTop)geo.setIndex(Array.from(geo.index.array).filter((_,i)=>i<12||i>=18));
    for(let i=0;i<uv.count;i++){
      const face=Math.floor(i/4);uv.setXY(i,uv.getX(i)*(face<2?d:w),uv.getY(i)*(face===2||face===3?d:h));
    }
    geo.translate(x,y,z);collect(mat,geo);
  }
  function elevation(x,z){
    // The crest wraps around Uris, then reaches Ho Plaza beside the tower.
    const crest=-32-12*Math.exp(-(((z+16)/24)**2))+22*Math.exp(-(((z-25)/30)**2));
    // Keep the broad lawn open down to West Avenue, then level the housing sites.
    const westDrop=Math.min(55,Math.max(0,crest-x)*.21);
    return Math.floor(-westDrop+Math.max(0,-z-170)*.025);
  }
  // Sample objects from the terrain cells so paving cannot sink below the lawn.
  const ground=(x,z)=>elevation(Math.floor(x/2)*2+1,Math.floor(z/2)*2+1);
  const footprints=campusBuildings(addModel,ground);
  function inBuilding(x,z,padding=2){
    return footprints.some(f=>{
      const a=x-f.x,b=z-f.z,c=Math.cos(f.turn),s=Math.sin(f.turn),u=a*c-b*s,v=a*s+b*c;
      return u>f.lo[0]-padding&&u<f.hi[0]+padding&&v>f.lo[1]-padding&&v<f.hi[1]+padding;
    });
  }
  const paving=new Map();
  function path(ax,az,bx,bz,width=3,mat='path'){
    const dx=bx-ax,dz=bz-az,len=dx*dx+dz*dz;
    for(let x=Math.floor(Math.min(ax,bx)-width/2);x<Math.ceil(Math.max(ax,bx)+width/2);x++)
      for(let z=Math.floor(Math.min(az,bz)-width/2);z<Math.ceil(Math.max(az,bz)+width/2);z++){
        const t=len?T.MathUtils.clamp(((x+.5-ax)*dx+(z+.5-az)*dz)/len,0,1):0;
        if(Math.hypot(x+.5-ax-dx*t,z+.5-az-dz*t)<width/2)paving.set(`${x},${z}`,mat);
      }
  }
  for(const [a,b,c,d,w] of [[-6,-39,96,-39,4],[-6,-39,-6,-222,4],[96,-39,96,-222,4],[-6,-222,96,-222,4],[-6,-39,96,-222,3],[-6,-222,96,-39,3],[-6,-127,96,-127,3],[45,-39,45,-222,3],[-6,-127,96,-222,3],[-6,-127,96,-39,3],[4,10,4,135,9],[4,15,119,15,5],[119,15,119,-246,5],[4,59,91,59,4],[4,122,139,122,5],[-32,-220,-32,40,3],[-32,-48,-181,-15,3],[-32,-100,-177,-76,3],[-32,24,-181,-15,3],[-180,-110,-180,74,3],[-8,-31,-32,-31,5]])path(a,b,c,d,w);
  path(140,-270,140,220,11,'road');path(-30,134,220,134,11,'road');path(140,11,240,11,10,'road');
  // Curved library terrace and the diagonal junctions visible in the 3D reference.
  for(const [ax,az,bx,bz] of [[-6,10,-16,18],[-16,18,-34,21],[-34,21,-48,12],[-48,12,-51,-9],[-51,-9,-45,-34],[-34,21,-68,42],[-68,42,-155,2],[-68,42,-125,100],[-45,-34,-155,2],[-155,2,-125,100]])path(ax,az,bx,bz,3);
  // West Avenue follows the foot of the slope. Campus Road bends southeast
  // around Willard Straight and the Engineering Quad toward South Campus.
  const campusRoad=[[-275,-290],[-275,-180],[-275,-55],[-260,35],[-225,103],[-170,151],[-103,183],[-79,249],[-42,316],[36,354],[132,355],[223,324]];
  for(let i=1;i<campusRoad.length;i++){
    const [ax,az]=campusRoad[i-1],[bx,bz]=campusRoad[i];path(ax,az,bx,bz,11,'road');
    path(ax-8,az,bx-8,bz,3);path(ax+8,az,bx+8,bz,3);
  }
  path(-275,-55,-419,-55,8,'road');path(-419,-255,-419,224,8,'road');
  for(const z of [-200,-118,-35,47,127])path(-45,z,-268,z+25,3);
  path(-45,-180,-268,47,3);path(-45,24,-268,-118,3);
  for(const z of [-217,-138,-55,31,116])path(-280,z,-371,z,4);
  for(const x of [132,148])path(x,-270,x,220,3);
  for(let x=-7;x<11;x++)for(let z=-7;z<15;z++)paving.set(`${x},${z}`,'path');
  for(let z=-262;z<214;z+=9)for(let k=0;k<4;k++)paving.set(`140,${z+k}`,'yellow');
  for(let x=-20;x<215;x+=9)for(let k=0;k<4;k++)paving.set(`${x+k},134`,'yellow');
  for(const z of [-30,26,119,146])for(let x=135;x<146;x+=2)for(let k=0;k<3;k++)paving.set(`${x},${z+k}`,'white');
  // Coalesce level lawn cells into strips, extending detailed terrain without
  // allocating hundreds of thousands of separate grass meshes.
  for(let z=-576;z<576;z+=2){
    for(let x=-576;x<576;){
      const y=ground(x+1,z+1);let end=x+2;
      while(end<576&&ground(end+1,z+1)===y)end+=2;
      const plane=new T.PlaneGeometry(end-x,2);plane.rotateX(-Math.PI/2);plane.translate((x+end)/2,y,z+1);
      const uv=plane.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*(end-x),uv.getY(i)*2);collect('grass',plane);x=end;
    }
    for(let x=-576;x<576;x+=2){
    const y=ground(x+1,z+1);
    for(const [dx,dz] of [[2,0],[0,2]]){
      const other=ground(x+1+dx,z+1+dz);
      if(other!==y){
        const height=Math.abs(y-other),wall=new T.PlaneGeometry(2,height);
        wall.rotateY(dx?(y>other?Math.PI/2:-Math.PI/2):(y>other?0:Math.PI));
        wall.translate(x+1+dx/2,(y+other)/2,z+1+dz/2);
        const uv=wall.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*2,uv.getY(i)*height);
        collect('dirt',wall);
      }
    }
    }
  }
  for(let x=-1280;x<1280;x+=32)for(let z=-1280;z<1280;z+=32){
    if(x>=-576&&x<576&&z>=-576&&z<576)continue;
    // Deep adjoining columns keep the steep western slope solid between tiles.
    const top=elevation(x+16,z+16),bottom=-400;
    box('dirt',x+16,(top+bottom)/2,z+16,32,top-bottom,32,true);
    const surface=new T.PlaneGeometry(32,32);surface.rotateX(-Math.PI/2);surface.translate(x+16,top,z+16);
    const uv=surface.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*32,uv.getY(i)*32);collect('grass',surface);
  }
  for(const [key,mat] of paving){const [x,z]=key.split(',').map(Number);box(mat,x+.5,ground(x+.5,z+.5)+.055,z+.5,1,.11,1);}
  const dial=document.createElement('canvas');dial.width=dial.height=64;
  const ctx=dial.getContext('2d');
  for(let y=0;y<64;y++)for(let x=0;x<64;x++){
    const radius=Math.hypot(x-31.5,y-31.5);
    if(radius<30){ctx.fillStyle=radius>27?'#766b59':'#f0ece2';ctx.fillRect(x,y,1,1);}
  }
  ctx.fillStyle='#292b32';
  for(let i=0;i<12;i++){const a=i*Math.PI/6;ctx.fillRect(Math.round(30+Math.sin(a)*23),Math.round(30-Math.cos(a)*23),3,4);}
  ctx.fillRect(30,11,4,22);ctx.fillRect(31,30,13,4);ctx.fillRect(28,28,7,7);
  const dialMap=new T.CanvasTexture(dial);dialMap.colorSpace=T.SRGBColorSpace;dialMap.magFilter=T.NearestFilter;
  const dialMaterial=new T.MeshLambertMaterial({map:dialMap,alphaTest:.5});
  for(let side=0;side<4;side++){
    const a=side*Math.PI/2,clock=new T.Mesh(new T.PlaneGeometry(5.5,5.5),dialMaterial);
    clock.position.set(Math.sin(a)*5.12,33,Math.cos(a)*5.12);clock.rotation.y=a;scene.add(clock);
  }
  let seed=1482;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const treePositions=[];
  function tree(x,z,height=12,birch=false){
    if(inBuilding(x,z,4)||paving.has(`${Math.floor(x)},${Math.floor(z)}`))return;
    treePositions.push([x,z,height]);
    const model=new VoxelModel(1),trunk=Math.floor(height*.65),radius=Math.floor(height*.35);
    model.box(birch?'birch':'wood',0,trunk/2,0,1,trunk,1);
    const leaf=birch?'leavesLight':random()<.18?'leavesDark':'leaves';
    for(const [cx,cy,cz,r] of [[0,trunk+1,0,radius],[-radius*.65,trunk-1,1,radius*.7],[radius*.6,trunk,0,radius*.8],[0,trunk-2,-radius*.65,radius*.7]]){
      model.box(birch?'birch':'wood',cx/2,cy-2,cz/2,Math.max(1,Math.abs(cx)),1,Math.max(1,Math.abs(cz)));
      for(let dx=-Math.ceil(r);dx<=r;dx++)for(let dz=-Math.ceil(r);dz<=r;dz++)for(let dy=-Math.ceil(r*.65);dy<=r*.8;dy++){
        if(dx*dx+dz*dz+dy*dy*1.3>r*r||random()<.035)continue;
        model.box(leaf,Math.round(cx+dx),Math.round(cy+dy),Math.round(cz+dz),1,1,1);
      }
    }
    addModel(model,x,ground(x,z),z);
  }
  for(const [x,z] of [[-49,-18],[-53,-41],[-48,5],[-34,26],[-18,25],[18,24],[20,47],[18,72],[17,87],[16,118],[29,58],[56,57],[74,53],[88,76],[83,96],[78,116],[81,131],[114,97],[122,118],[115,174],[71,181],[-61,57],[-58,86],[-56,116],[-9,128],[15,-58],[26,-88],[68,-62],[81,-85],[17,-110],[27,-147],[79,-149],[63,-181],[18,-194],[73,-208],[-42,-68],[-43,-103],[-43,-152],[-43,-192],[-44,-219]])tree(x,z,10+Math.floor(random()*6),random()<.3);
  for(let z=-250;z<230;z+=13)for(const x of [126,153])tree(x,z,9+Math.floor(random()*5),true);
  for(let i=0;i<65;i++){
    const x=Math.round(10+random()*79),z=Math.round(-215+random()*165);
    if(treePositions.some(([a,b])=>Math.hypot(a-x,b-z)<12))continue;
    tree(x,z,11+Math.floor(random()*6),random()<.3);
  }
  for(let i=0;i<230;i++){
    const x=Math.round(random()*480-240),z=Math.round(random()*510-275);
    if(x>-48&&x<123&&z>-250&&z<195)continue;
    if(treePositions.some(([a,b])=>Math.hypot(a-x,b-z)<9))continue;
    tree(x,z,9+Math.floor(random()*8),random()<.25);
  }
  for(let i=0;i<130;i++){
    const x=Math.round(random()*660-330),z=Math.round(random()*660-330);
    if(x>-220&&x<220&&z>-260&&z<220)continue;
    tree(x,z,11+Math.floor(random()*7),random()<.2);
  }
  for(const [x,z,w,d] of [[20,19,15,2],[33,19,2,9],[70,20,15,2],[25,50,15,2],[62,48,13,2],[-12,26,2,9],[68,127,18,2],[118,83,2,12]]){
    box('baseStone',x,.3,z,w+1,.6,d+1);box('hedge',x,1.2,z,w,1.8,d);
  }
  const plants={shortGrass:[],fern:[],daisy:[],poppy:[]};
  for(let i=0;i<6000;i++){
    const x=random()*420-210,z=random()*470-260;
    if(inBuilding(x,z,1)||paving.has(`${Math.floor(x)},${Math.floor(z)}`))continue;
    const kind=i%29===0?'daisy':i%41===0?'poppy':i%9===0?'fern':'shortGrass';
    plants[kind].push([x,ground(x,z),z,.4+random()*.55]);
  }
  const crossed=new T.PlaneGeometry(1,1);crossed.translate(0,.5,0);
  const crossed2=crossed.clone();crossed2.rotateY(Math.PI/2);
  const plantGeometry=mergeGeometries([crossed,crossed2]),dummy=new T.Object3D();
  for(const [kind,positions] of Object.entries(plants)){
    const mesh=new T.InstancedMesh(plantGeometry,materials[kind],positions.length);
    positions.forEach(([x,y,z,s],i)=>{dummy.position.set(x,y+.03,z);dummy.scale.setScalar(s);dummy.rotation.y=random()*Math.PI;dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});
    mesh.receiveShadow=true;scene.add(mesh);
  }
  for(const z of [24,48,72,104,125])for(const x of [-3,11]){
    box('window',x,2.5,z,.25,5,.25);box('limestone',x,5.2,z,.75,.75,.75);box('slate',x,5.7,z,1,.25,1);
  }
  for(const z of [-62,-104,-158,-202])for(const x of [0,90]){
    box('oak',x,1,z,3,.25,1);box('oak',x,1.6,z-.5,3,1,.25);
    for(const dx of [-1,1])box('window',x+dx,.5,z,.25,1,1);
  }
  for(let z=-37;z<40;z+=2)box('baseStone',-36,ground(-36,z)+.5,z,1,1,2);
  // Low-detail neighborhood blocks continue the city beyond the modeled campus.
  // Keep this layer outside Libe Slope and the named academic/residential sites.
  const districtGround=(x,z)=>Math.abs(x)<576&&Math.abs(z)<576?ground(x,z):elevation(Math.floor(x/32)*32+16,Math.floor(z/32)*32+16);
  for(let gx=-960;gx<=960;gx+=80)for(let gz=-960;gz<=960;gz+=80){
    if(Math.abs(gx)<560&&Math.abs(gz)<560)continue;
    const walls=['sageBrick','redStone','oldStone','olinStone'];
    for(const offset of [-19,19]){
      const x=gx+offset,z=gz+Math.round(random()*12-6),y=districtGround(x,z);
      const width=16+Math.floor(random()*9),depth=16+Math.floor(random()*7),height=9+Math.floor(random()*10);
      const wall=walls[Math.floor(random()*walls.length)];
      box(wall,x,y+height/2,z,width,height,depth);
      box('baseStone',x,y+.6,z,width+.5,1.2,depth+.5);
      for(let k=0;k<5;k++)box('slate',x,y+height+k*.8+.4,z,width+1-k*2,.8,depth+1-k*2);
      for(const side of [-1,1])for(let u=-width/2+3;u<width/2-1;u+=5)for(let h=3;h<height-1;h+=4){
        box('window',x+u,y+h,z+side*(depth/2+.2),1.8,2,.3);
      }
      const tx=x+width/2+6,tz=z+depth/2+5,ty=districtGround(tx,tz);
      box('wood',tx,ty+3,tz,1,6,1);box('leaves',tx,ty+7,tz,7,6,7);
    }
    // Short road tiles follow the sampled land rather than float above hills.
    for(let k=-40;k<40;k+=8){
      const x=gx+k,z=gz+34;
      box('road',x,districtGround(x,z)+.08,z,8,.16,7);
    }
  }
  for(const [name,geometries] of batches){
    const normalized=geometries.map(g=>g.index?g.toNonIndexed():g),merged=mergeGeometries(normalized);
    const mesh=new T.Mesh(merged,materials[name]);
    // Fine façade ledges shimmer under grazing self-shadow samples; retain their
    // directional lighting and cast shadows onto the ground instead.
    mesh.receiveShadow=['grass','path','road','yellow','white','dirt','leaves','leavesLight','leavesDark','hedge','wood','birch'].includes(name);
    mesh.castShadow=!['grass','path','road','yellow','white','dirt'].includes(name);
    scene.add(mesh);for(const geo of new Set([...geometries,...normalized]))geo.dispose();
  }
  const camera=new T.PerspectiveCamera(57,1,2,2400);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),query=import.meta.env.DEV?new URLSearchParams(location.search):null;
  const preview=query?.get('campusAngle');
  let angle=preview!==null&&preview!==undefined&&Number.isFinite(Number(preview))?Number(preview):-2.3,last=0,dirty=true,texturesReady=false;
  function resize(){
    renderer.setSize(innerWidth,innerHeight);
    camera.aspect=innerWidth/innerHeight;camera.filmOffset=innerWidth>800?9:0;camera.updateProjectionMatrix();
    dirty=true;
  }
  addEventListener('resize',resize);reduced.addEventListener('change',()=>{dirty=true;});resize();
  renderer.setAnimationLoop(time=>{
    if(!dirty&&time-last<1000/30)return;
    if(!document.hidden&&(!reduced.matches||dirty)){
      if(!reduced.matches)angle+=Math.min((time-last)/1000,.05)*.015;
      camera.position.set(Math.sin(angle)*94,40,Math.cos(angle)*94);camera.lookAt(0,25,0);renderer.render(scene,camera);dirty=false;
      if(texturesReady)canvas.dataset.textures=failed.length?'failed':'ready';
    }
    last=time;
  });
  Promise.all(loads).then(()=>{
    // Refresh the programs after texture upload, including the static shadow pass.
    for(const mat of [...Object.values(materials),dialMaterial])mat.needsUpdate=true;
    renderer.shadowMap.needsUpdate=true;dirty=true;texturesReady=true;
    if(import.meta.env.DEV)canvas.dataset.campusBuildings=String(footprints.length);
  });
}
