import * as THREE from 'three';
import {outfits,paintOutfit,finishClothing,shadeFabric} from './outfits';
let outfitIndex=0;
try{outfitIndex=Number(localStorage.getItem('andy-outfit'))||0;}catch{}
if(!outfits[outfitIndex])outfitIndex=0;

const letters={A:['010','101','111','101','101'],E:['111','100','110','100','111'],F:['111','100','110','100','100'],H:['101','101','111','101','101'],I:['111','010','010','010','111'],L:['100','100','100','100','111'],M:['101','111','111','101','101'],N:['101','111','111','111','101'],O:['111','101','101','101','111'],P:['110','101','110','100','100'],R:['110','101','110','101','101'],S:['111','100','111','001','111'],T:['111','010','010','010','010'],U:['101','101','101','101','111']};
function text(ctx,words,y,size=1,x){
  const width=words.length*4*size-size;x??=(ctx.canvas.width-width)/2;
  ctx.fillStyle='#eee7d6';
  [...words].forEach((ch,i)=>(letters[ch]||[]).forEach((row,j)=>[...row].forEach((bit,k)=>{if(bit==='1')ctx.fillRect(x+(i*4+k)*size,y+j*size,size,size);})))
}
function texture(w,h,kind,face){
  const canvas=document.createElement('canvas');canvas.width=w*8;canvas.height=h*8;
  const c=canvas.getContext('2d');
  const base=kind==='head'||kind==='arm'?'#bb875f':kind==='shirt'?'#303033':'#b7b8b9';
  c.fillStyle=base;c.fillRect(0,0,canvas.width,canvas.height);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    c.fillStyle=(Math.sin(x*31+y*17+face*7)>0?'#ffffff':'#000000')+'0a';c.fillRect(x*8,y*8,8,8);
  }
  if(kind==='head'){
    c.fillStyle='#090909';
    if(face===2)c.fillRect(0,0,w*8,h*8);
    else if(face===5){c.fillRect(0,0,64,48);}
    else if(face===4){
      c.fillRect(0,0,64,16);[0,1,2,4,5,6,7].forEach(x=>c.fillRect(x*8,16,8,8));[0,1,6,7].forEach(x=>c.fillRect(x*8,24,8,8));
      c.fillStyle='#f4f0e5';c.fillRect(8,32,8,8);c.fillRect(48,32,8,8);
      c.fillStyle='#141313';c.fillRect(16,32,8,8);c.fillRect(40,32,8,8);
      c.fillStyle='#b17b55';c.fillRect(24,40,16,8);
      c.fillStyle='#71472e';c.fillRect(24,48,16,8);
    }else if(face!==3){
      c.fillRect(0,0,64,24);
      // A shallow arch rises over the ear, then drops into the lower back hairline.
      const heights=face===0?[24,24,24,24,32,40,48,48]:[48,48,40,32,24,24,24,24];
      heights.forEach((height,x)=>c.fillRect(x*8,24,8,height-24));
    }
    c.fillStyle='#161616';
    if(face!==3)for(let y=0;y<3;y++)for(let x=0;x<8;x++)if((x*3+y*5)%7<2)c.fillRect(x*8,y*8,8,8);
  }
  if(kind==='shirt'){
    if(face===4){
      c.fillStyle='#bb875f';c.fillRect(24,0,16,8);c.fillStyle='#454447';c.fillRect(16,0,8,8);c.fillRect(40,0,8,8);
      text(c,'THE',18,1,43);text(c,'MET',25,1,43);
    }
    if(face===5){
      // Draw script at the texture's pixel resolution; nearest filtering preserves the steps.
      c.fillStyle='#eee7d6';c.textAlign='center';c.textBaseline='middle';
      c.font='italic 10px "Snell Roundhand", "Brush Script MT", cursive';
      ['The','Metropolitan','Museum of','Art'].forEach((line,i)=>c.fillText(line,32,23+i*11,54));
    }
    c.fillStyle='#242427';c.fillRect(0,88,64,8);
  }
  if(kind==='arm'){
    c.fillStyle='#303033';c.fillRect(0,0,canvas.width,40);c.fillStyle='#252528';c.fillRect(0,32,canvas.width,8);
    c.fillStyle='#a87451';c.fillRect(0,88,8,8);
  }
  if(kind==='pants'){
    c.fillStyle='#a1a3a6';c.fillRect(0,0,canvas.width,8);c.fillRect(face%2?24:0,8,8,64);
    c.fillStyle='#c5c6c7';c.fillRect(8,16,8,56);c.fillStyle='#97999c';c.fillRect(0,80,canvas.width,8);
    c.fillStyle='#a67c50';c.fillRect(0,88,canvas.width,8);
  }
  if(kind!=='head'){paintOutfit(c,kind,face,outfitIndex);finishClothing(c);}
  shadeFabric(c,kind,face);
  const map=new THREE.CanvasTexture(canvas);map.magFilter=THREE.NearestFilter;map.minFilter=THREE.NearestFilter;map.colorSpace=THREE.SRGBColorSpace;
  return new THREE.MeshLambertMaterial({map});
}
export function mountPlayer(host){
  if(!host)return()=>{};
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-13,13,19,-19,.1,200);
  camera.position.set(34,26,65);camera.lookAt(0,16,0);
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0,0);host.append(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xffffff,0x606a7d,1.7));const sun=new THREE.DirectionalLight(0xfff3df,2.2);sun.position.set(-20,40,35);scene.add(sun);
  const player=new THREE.Group();player.rotation.y=-.15;scene.add(player);
  const parts=[];
  function part(w,h,d,x,y,kind){
    const dims=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]];
    const materials=dims.map(([fw,fh],i)=>texture(fw,fh,kind,i));
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),materials);mesh.userData={w,h,d,kind};mesh.position.set(x,y,0);player.add(mesh);parts.push(mesh);return mesh;
  }
  const head=new THREE.Group();head.position.y=28;player.add(head);
  const headMesh=part(8,8,8,0,28,'head');headMesh.position.y=0;head.add(headMesh);
  const torso=part(8,12,4,0,18,'shirt');
  const left=part(4,12,4,-6,18,'arm'),right=part(4,12,4,6,18,'arm');left.rotation.z=-.035;right.rotation.z=.035;
  const legs=[part(4,12,4,-2,6,'pants'),part(4,12,4,2,6,'pants')];
  legs[0].rotation.x=-.035;legs[1].rotation.x=.035;
  const clothing=[];
  function clearClothing(){
    for(const mesh of clothing){mesh.removeFromParent();mesh.geometry.dispose();if(mesh.userData.ownMaterial)mesh.material.dispose();}
    clothing.length=0;
  }
  function layer(parent,w,h,d,x,y,z,color){
    const material=color?new THREE.MeshLambertMaterial({color}):parent.material;
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
    mesh.userData.ownMaterial=Boolean(color);mesh.position.set(x,y,z);parent.add(mesh);clothing.push(mesh);return mesh;
  }
  function dress(){
    clearClothing();
    const fit=outfits[outfitIndex],jacket=fit.jacket;
    layer(torso,8.5,12.2,4.5,0,0,0);
    // Each sleeve occupies the matching portion of the arm texture, not a stretched full arm.
    const sleeveHeight=[5,5,11.2,11.2,11.2,8.5,5.5][outfitIndex];
    for(const arm of [left,right]){
      // Offset sleeve fronts and caps from the torso and base arm surfaces.
      const sleeve=layer(arm,4.5,sleeveHeight+.16,4.6,0,6.08-sleeveHeight/2,0);
      const uv=sleeve.geometry.attributes.uv;
      for(const face of [0,1,4,5])for(let i=face*4;i<face*4+4;i++)uv.setY(i,1-(1-uv.getY(i))*sleeveHeight/12);
      uv.needsUpdate=true;
      layer(arm,4.75,.8,4.8,0,6-sleeveHeight+.3,0,outfitIndex===4?'#d6cbb4':fit.shirt);
    }
    // Raised hems and shoe soles create a layered silhouette from every angle.
    layer(torso,8.65,.8,4.65,0,-5.68,0,fit.shirt);
    for(const leg of legs){
      // Expand only outward: keep the legs touching, with distinct cuff, shoe, and sole side planes.
      const side=Math.sign(leg.position.x);
      layer(leg,4.08,.65,4.3,side*.04,-4.3,0,fit.pants);
      layer(leg,4.16,1.25,4.65,side*.08,-5.38,.18,fit.shoes==='birks'?'#a67c50':'#f2f0e8');
      layer(leg,4.24,.35,4.75,side*.12,-5.85,.18,fit.shoes==='birks'?'#534331':'#dcdad3');
    }
    if(jacket){
      // Actual cuboid collar pieces sit above the shirt and cast directional shading.
      for(const sign of [-1,1])layer(torso,2.1,1.25,.6,sign*2,5.5,2.5,fit.shirt);
      if(outfitIndex===2)layer(torso,6,2.8,1.4,0,5.4,-2.6,'#18191b');
      else for(const sign of [-1,1])layer(torso,1.8,2.8,.45,sign*1.6,4.2,2.5,fit.shirt);
    }
    host.dataset.clothingLayers=String(clothing.length);
  }
  dress();
  const outfitName=host.parentElement.querySelector('.outfit-name');
  if(outfitName)outfitName.textContent=outfits[outfitIndex].name;
  const outfitButtons=[...host.parentElement.querySelectorAll('[data-outfit-step]')];
  const changeOutfit=e=>{
    outfitIndex=(outfitIndex+Number(e.currentTarget.dataset.outfitStep)+outfits.length)%outfits.length;
    try{localStorage.setItem('andy-outfit',String(outfitIndex));}catch{}
    clearClothing();
    parts.filter(mesh=>mesh.userData.kind!=='head').forEach(mesh=>{
      mesh.material.forEach(material=>{material.map.dispose();material.dispose();});
      const{w,h,d,kind}=mesh.userData;
      mesh.material=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]].map(([fw,fh],i)=>texture(fw,fh,kind,i));
    });
    dress();host.parentElement.querySelector('.outfit-name').textContent=outfits[outfitIndex].name;draw();
  };
  outfitButtons.forEach(button=>button.addEventListener('click',changeOutfit));
  let dragging=null;
  const down=e=>{if(e.button!==0)return;dragging={x:e.clientX,y:e.clientY};host.setPointerCapture(e.pointerId);host.classList.add('rotating');};
  const move=e=>{if(!dragging)return;player.rotation.y+=(e.clientX-dragging.x)*.012;dragging={x:e.clientX,y:e.clientY};draw();};
  const up=()=>{dragging=null;host.classList.remove('rotating');};
  const key=e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();e.stopPropagation();player.rotation.y+=e.key==='ArrowLeft'?-.2:.2;draw();}};
  host.addEventListener('pointerdown',down);host.addEventListener('pointermove',move);host.addEventListener('pointerup',up);host.addEventListener('pointercancel',up);host.addEventListener('lostpointercapture',up);host.addEventListener('keydown',key);
  const follow=e=>{
    if(dragging||e.pointerType==='touch')return;
    const rect=host.getBoundingClientRect();
    const position=new THREE.Vector3(0,28,0).project(camera);
    const x=rect.left+(position.x+1)*rect.width/2,y=rect.top+(1-position.y)*rect.height/2;
    head.rotation.y=THREE.MathUtils.clamp(Math.atan((e.clientX-x)/250),-.65,.65);
    head.rotation.x=THREE.MathUtils.clamp(Math.atan((e.clientY-y)/250),-.35,.35);
    draw();
  };
  window.addEventListener('pointermove',follow);
  function draw(){renderer.render(scene,camera);host.classList.add('player-ready');host.dataset.rotation=player.rotation.y.toFixed(3);host.dataset.pitch=player.rotation.x.toFixed(3);host.dataset.headYaw=head.rotation.y.toFixed(3);}

  const resize=new ResizeObserver(()=>{const {width,height}=host.getBoundingClientRect();if(!width||!height)return;const aspect=width/height;const halfHeight=Math.max(19,10.5/aspect);camera.top=halfHeight;camera.bottom=-halfHeight;camera.left=-halfHeight*aspect;camera.right=halfHeight*aspect;camera.updateProjectionMatrix();renderer.setSize(width,height,false);
    const tag=host.parentElement.querySelector('.player-nametag');
    const top=new THREE.Vector3(0,33,0).project(camera);
    const headPixels=height*8/(halfHeight*2);
    tag.style.fontSize=`${Math.max(14,Math.min(30,headPixels*.42))}px`;
    tag.style.top=`${host.offsetTop+(1-top.y)*height/2-tag.offsetHeight-10}px`;
    draw();});resize.observe(host);draw();
  return()=>{outfitButtons.forEach(button=>button.removeEventListener('click',changeOutfit));window.removeEventListener('pointermove',follow);resize.disconnect();clearClothing();renderer.dispose();renderer.domElement.remove();parts.forEach(mesh=>{mesh.geometry.dispose();for(const material of Array.isArray(mesh.material)?mesh.material:[mesh.material]){material.map?.dispose();material.dispose();}});host.removeEventListener('pointerdown',down);host.removeEventListener('pointermove',move);host.removeEventListener('pointerup',up);host.removeEventListener('pointercancel',up);host.removeEventListener('lostpointercapture',up);host.removeEventListener('keydown',key);};
}
