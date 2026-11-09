import {VoxelModel} from './voxel-model.js';

// Dimensions are reconstructed from the tour, not an imported CornellCraft save.
export function campusBuildings(addModel, ground) {
  const footprints=[];
  const structures=[];
  function site(name,x,z,turn,build) {
    const model=new VoxelModel(.5);
    build(model);
    const solid=model.boxes.filter(b=>b.material);
    const lo=[0,2].map(i=>Math.min(...solid.map(b=>b.min[i]))*.5);
    const hi=[0,2].map(i=>Math.max(...solid.map(b=>b.max[i]))*.5);
    let lowest=ground(x,z);
    for(const a of [lo[0],hi[0]])for(const b of [lo[1],hi[1]])lowest=Math.min(lowest,ground(x+a*Math.cos(turn)+b*Math.sin(turn),z+b*Math.cos(turn)-a*Math.sin(turn)));
    const foundation=ground(x,z)-lowest;
    if(foundation>0)model.box('baseStone',(lo[0]+hi[0])/2,(.5-foundation)/2,(lo[1]+hi[1])/2,hi[0]-lo[0]-1,foundation+.5,hi[1]-lo[1]-1);
    structures.push({model,x,y:ground(x,z),z,turn,name});
    footprints.push({x,z,turn,lo,hi});
  }
  const at=(m,x,z,turn=0)=>({box(mat,a,y,c,w,h,d){
    const s=Math.round(Math.sin(turn)),co=Math.round(Math.cos(turn));
    m.box(mat,x+a*co+c*s,y,z+c*co-a*s,co?w:d,h,co?d:w);
  }});
  function face(m,mat,side,u,y,depth,w,h,d=.5) {
    const a=side*Math.PI/2,s=Math.round(Math.sin(a)),c=Math.round(Math.cos(a));
    m.box(mat,u*c+depth*s,y,depth*c-u*s,side%2?d:w,h,side%2?w:d);
  }
  function window(m,side,u,y,depth,w=1.5,h=3,arched=false,trim='limestone') {
    face(m,trim,side,u,y,depth,w+1,h+1,1);
    face(m,'window',side,u,y,depth+.5,w,h,.5);
    face(m,trim,side,u,y,depth+1,.5,h,.5);
    face(m,trim,side,u,y-.25,depth+1,w,.5,.5);
    face(m,trim,side,u,y-h/2-.5,depth+1,w+1.5,.5,1);
    if(arched) {
      face(m,trim,side,u,y+h/2+.5,depth,Math.max(1,w),1,1);
      face(m,'window',side,u,y+h/2+.25,depth+.5,Math.max(.5,w-1),.5,.5);
      face(m,trim,side,u,y+h/2+1,depth+.5,.5,.5,1);
    }
  }
  function roof(m,w,d,y,style='gable',material='slate',rise=.75) {
    if(style==='flat') {
      m.box('roofGravel',0,y+.5,0,w+1,1,d+1);
      for(const s of [-1,1]){m.box('limestone',0,y+1,s*d/2,w+1,1,.5);m.box('limestone',s*w/2,y+1,0,.5,1,d);}
      return;
    }
    const count=Math.ceil(Math.min(style==='hip'?w:d,d)/2);
    for(let k=0;k<count;k++)m.box(material,0,y+.5+k*rise,0,style==='hip'?w+2-k*2:w+2,rise,d+2-k*2);
    m.box(material,0,y+count*rise,0,style==='hip'?Math.max(1,w-d+2):w+2,.5,1);
  }
  function wing(m,w,d,h,wall,style='gable',floors=3,sides=[0,1,2,3]) {
    m.box(wall,0,h/2,0,w,h,d);
    m.box('baseStone',0,.75,0,w+.5,1.5,d+.5);
    m.box('limestone',0,h-.5,0,w+1,1,d+1);
    roof(m,w,d,h,style);
    for(let f=0;f<floors;f++) {
      const y=3.5+f*(h-6.5)/Math.max(1,floors-1);
      for(const side of sides) {
        const length=side%2?d:w,depth=(side%2?w:d)/2;
        for(let u=-length/2+3;u<length/2-1.5;u+=4)window(m,side,u,y,depth,1.5,2.5,f===floors-1&&style!=='flat');
      }
    }
    for(const a of [-1,1])for(const c of [-1,1])for(let y=2;y<h-1;y+=2) {
      m.box('limestone',a*(w/2-.25),y,c*(d/2-.25),1,1,1);
    }
  }
  function gable(m,side,depth,base,width,height,wall) {
    for(let k=0;k<height;k++) {
      const span=Math.max(1,width*(1-k/height));
      face(m,wall,side,0,base+k+.5,depth,span,1,1);
      for(const s of [-1,1])face(m,'limestone',side,s*(span/2),base+k+1,depth+.5,1,1,1);
    }
  }
  function spire(m,x,z,y,width,height) {
    const count=Math.ceil(height);
    for(let k=0;k<count;k++)m.box('slate',x,y+k+.5,z,Math.max(.5,width*(1-k/count)),1,Math.max(.5,width*(1-k/count)));
    m.box('gold',x,y+height+.5,z,.5,1,.5);
  }

  site('McGraw Tower',0,0,0,m=>{
    m.box('towerStone',0,23,0,9,46,9);
    for(let k=0;k<3;k++)m.box('limestone',0,k*.5+.25,0,12-k,.5,12-k);
    for(const y of [1.5,34,43,46])m.box('limestone',0,y,0,9.5,.5,9.5);
    for(let side=0;side<4;side++) {
      for(const y of [6,12,18,24,28])for(const u of (y===6||y===18?[-1.5,0,1.5]:[0])){
        face(m,'stoneShade',side,u,y,4.5,.5,2.5,.5);
        face(m,'window',side,u,y,4.75,.5,2,.5);
      }
      for(const u of [-2,0,2]) {
        face(m,'window',side,u,40.5,4.5,1,4.5,.5);
        face(m,'limestone',side,u-.75,40.5,5,.5,5,1);
        face(m,'limestone',side,u,43,4.75,1,.5,1);
      }
      face(m,'limestone',side,0,37.75,5,7,.5,1.5);
      for(const u of [-2.5,-1.25,0,1.25,2.5])face(m,'limestone',side,u,37,4.75,.5,1,1);
      // Stepped masonry surround for the circular clock face.
      for(let dy=-3;dy<=3;dy+=.5) {
        const span=Math.round(Math.sqrt(Math.max(0,9-dy*dy))*4)/2;
        if(span>0)face(m,'limestone',side,0,33+dy,4.5,span+.5,.5,.5);
      }
    }
    m.box('limestone',0,46.25,0,10.5,.5,10.5);
    spire(m,0,0,46.5,10.5,14);
  });

  site('Uris Library',-20,-12,0,m=>{
    // Build the connected shell first; decorate only its exposed elevations.
    m.box('urisStone',0,5.5,-5,30,11,25);
    m.box('baseStone',0,.75,-5,30.5,1.5,25.5);
    roof(at(m,0,-5,Math.PI/2),25,30,11,'gable','slate',.5);
    m.box('urisStone',-18,4.5,-4,12,9,18);
    m.box('redStone',-18,1.25,-4,12,2.5,18);
    roof(at(m,-18,-4),12,18,9,'hip');
    m.box('urisStone',-3,5,-23,23,10,12);
    roof(at(m,-3,-23),23,12,10,'hip');
    m.box('urisStone',17,3.5,6,8,7,8);
    roof(at(m,17,6),8,8,7,'hip');
    for(const y of [3.5,8]){
      for(const u of [-10,-5,0,5,10])window(m,0,u,y,7.5,1.5,2.5,false);
      for(const u of [-8,-3,2,7])window(at(m,0,-5),1,u,y,15,1.5,2.5,false);
      for(const u of [-8,-3,2,7])window(at(m,-3,-23),2,u,y,6,1.5,2.5,false);
    }
    for(const u of [-6,0,6])window(at(m,0,-4),3,u,5.5,24,2,4,true);
    for(const z of [-11,3])m.box('limestone',-24.5,4,z,1,8,1);
    for(const [x,z] of [[-10,-8],[9,-17]])m.box('urisStone',x,14,z,1.5,12,1.5);
  });

  site('Olin Library',52,-16,0,m=>{
    m.box('olinStone',0,8.5,0,62,17,34);
    m.box('baseStone',0,1,0,63,2,35);
    for(const side of [0,2])for(const y of [3,6.5,10,13.5]) {
      face(m,'window',side,0,y,17,59,2,.5);
      face(m,'limestone',side,0,y-1.5,17.5,63,1,1);
      for(let x=-28;x<=28;x+=2)face(m,'olinStone',side,x,y,17.5,.5,2,1);
    }
    for(const side of [1,3])for(let z=-13;z<=13;z+=4)for(const y of [3,6.5,10,13.5])window(m,side,z,y,31,1.5,2);
    roof(m,62,34,17,'flat');
    m.box('limestone',0,17,0,64,1,36);
    // Lower northern stacks block gives Olin its stepped rectangular footprint.
    wing(at(m,0,-23),60,11,11,'olinStone','flat',2);
    m.box('limestone',0,4,18.5,15,1,4);
    for(const x of [-6,0,6])m.box('olinStone',x,2,19,.5,4,.5);
    for(const x of [-16,-9,-2])m.box('roofGravel',x,19,0,4,2,7);
  });

  site('Sage Chapel',39,32,0,m=>{
    // Red nave, intersecting transept, stepped limestone gables and west rose window.
    const nave=at(m,0,0);
    wing(nave,39,15,9,'chapelBrick','gable',1,[0,2]);
    wing(at(m,8,-4,Math.PI/2),25,12,10,'chapelBrick','gable',1);
    // The north-side annex is lower than the nave and offset from the transept.
    m.box('chapelBrick',-5,3.5,-11,11,7,8);
    roof(at(m,-5,-11),11,8,7,'hip');
    // Stepped eastern apse, rather than a second full-height rectangular end.
    for(let k=0;k<3;k++){
      m.box('chapelBrick',20+k,4,0,1,8,13-k*3);
      m.box('slate',20+k,9-k*.5,0,1,1,14-k*3);
    }
    gable(nave,1,21,9,15,9,'chapelBrick');
    gable(nave,3,21,9,15,9,'chapelBrick');
    // Continue the gable plane down to grade; portal details attach to this wall.
    face(nave,'chapelBrick',3,0,4.5,20.5,15,9,2);
    for(const side of [0,2])for(const u of [-14,-8,-2,4,10,16]) {
      window(nave,side,u,5.5,7.5,1.5,4,true);
      face(nave,'limestone',side,u+2,3.5,8,1,7,2);
    }
    // Filled rows form one continuous stepped circle, without detached stone chips.
    for(let dy=-1.75;dy<=1.75;dy+=.5){
      const outside=Math.round(4*Math.sqrt(4-dy*dy))/2;
      face(nave,'limestone',3,0,12+dy,21.5,outside,.5,.5);
      if(Math.abs(dy)<1.5){
        const inside=Math.max(.5,Math.round(4*Math.sqrt(2.25-dy*dy))/2);
        face(nave,'roseGlass',3,0,12+dy,21.5,inside,.5,.5);
      }
    }
    face(nave,'limestone',3,0,12,22,.5,2.5,.5);
    face(nave,'limestone',3,0,12,22,2.5,.5,.5);
    // A smaller double door sits within its masonry portal, above a stone threshold.
    face(nave,'limestone',3,0,2.25,21.5,3,4.5,.5);
    face(nave,'oak',3,0,1.75,21.5,2,3,.5);
    face(nave,'window',3,0,1.75,21.5,.5,3,.5);
    for(const u of [-4,4]){
      face(nave,'limestone',3,u,4.5,21.5,2,4,.5);
      face(nave,'window',3,u,4.5,21.5,1,3,.5);
      face(nave,'limestone',3,u,6.75,21.5,1,1,.5);
      face(nave,'window',3,u,6.25,21.5,.5,.5,.5);
    }
    m.box('limestone',-22,.25,0,2,.5,4);
    m.box('limestone',-21.5,18.75,0,.5,2,.5);
    m.box('limestone',-21.5,19,0,.5,.5,1.5);
  });

  site('Sage Hall',93,150,0,m=>{
    // The red-brick landmark in the tour: central campanile and paired corner towers.
    wing(m,62,21,20,'sageBrick','hip',4);
    for(const x of [-25,25]) {
      const tower=at(m,x,-3);
      wing(tower,13,25,24,'sageBrick','hip',4);
      m.box('limestone',x,23.5,-3,15,1,27);
      for(const y of [5.5,10.5,15.5,20.5])m.box('limestone',x,y,-3,13.5,.5,25.5);
    }
    wing(at(m,0,-5),12,23,29,'sageBrick','hip',4);
    const bell=at(m,0,-5);
    bell.box('sageBrick',0,31,0,7,6,7);
    for(let side=0;side<4;side++)for(const u of [-1.5,1.5])window(bell,side,u,31.5,3.5,1,3,true);
    bell.box('limestone',0,34.5,0,9,1,9);
    spire(bell,0,0,35,8,9);
    for(const x of [-14,14]){
      const dormer=at(m,x,-8);dormer.box('sageBrick',0,22,0,6,5,7);
      gable(dormer,2,3.5,24,7,4,'sageBrick');window(dormer,2,0,22,3.5,2,3,true);
    }
    for(const y of [6,11,16])m.box('limestone',0,y,-10.75,62,.5,.5);
    for(let k=0;k<5;k++)m.box('limestone',0,k*.5+.25,-17+k*.5,8,.5,5-k*.5);
    m.box('oak',0,3,-16.5,4,6,.5);
  });

  for(const [name,z,w,h] of [['Morrill Hall',-73,35,16],['McGraw Hall',-127,40,17],['White Hall',-182,34,16]])site(name,-20,z,Math.PI/2,m=>{
    wing(m,w,18,h,'oldStone','hip',3);
    for(const y of [2,7,12])m.box('stoneTrim',0,y,0,w+.5,.5,18.5);
    for(const s of [-1,1])for(const x of [-w/2+3,w/2-3])m.box('oldStone',x,h+5,s*3,1.5,5,2);
    if(name==='McGraw Hall'){
      wing(at(m,0,0),12,19,24,'oldStone','hip',4);
      m.box('stoneTrim',0,28,0,7,3,7);spire(m,0,0,29.5,8,7);
    }
  });

  site('Goldwin Smith Hall',109,-119,Math.PI/2,m=>{
    wing(m,76,17,16,'limestone','hip',3);
    wing(at(m,-35,9,Math.PI/2),34,16,16,'limestone','hip',3);
    wing(at(m,35,9,Math.PI/2),34,16,16,'limestone','hip',3);
    m.box('limestone',0,12,14,29,1,10);
    for(const x of [-12,-8,-4,4,8,12]){m.box('limestone',x,6,17,1.5,12,1.5);m.box('limestone',x,11.5,17,2.5,1,2.5);}
    for(let k=0;k<6;k++)m.box('limestone',0,13+k*.5,14,30-k*5,.5,10);
    for(let k=0;k<4;k++)m.box('limestone',0,k*.5,19,32-k,.5,5-k*.5);
  });

  site('Stimson Hall',111,-11,0,m=>{
    wing(m,27,29,17,'redStone','hip',3);
    for(const y of [3,8,13,17])m.box('limestone',0,y,0,28,.5,30);
    for(const x of [-8,8])for(const s of [-1,1]){const d=at(m,x,s*11);d.box('redStone',0,20,0,5,5,5);roof(d,5,5,22,'hip');}
  });
  site('Day Hall',105,46,0,m=>{
    wing(m,30,17,17,'olinStone','flat',4);wing(at(m,12,17,Math.PI/2),22,14,17,'olinStone','flat',4);
    for(const x of [-9,-3,3,9])m.box('limestone',x,8.5,-8.75,.5,17,.5);
  });
  site('Willard Straight Hall',-27,91,0,m=>{
    wing(at(m,0,-15),46,17,20,'gothicStone','gable',3);
    wing(at(m,-17,5,Math.PI/2),32,14,18,'gothicStone','gable',3);
    wing(at(m,17,5,Math.PI/2),32,14,18,'gothicStone','gable',3);
    wing(at(m,0,21),46,13,18,'gothicStone','gable',3);
    for(const x of [-19,19]){
      wing(at(m,x,-18),9,11,28,'gothicStone','flat',4);
      for(const dx of [-4,0,4])for(const dz of [-5,5])m.box('stoneTrim',x+dx,30,-18+dz,1.5,2,1.5);
      for(const side of [0,2])window(at(m,x,-18),side,0,24,5.5,3,5,true,'stoneTrim');
    }
    gable(at(m,0,-15),2,8.5,20,14,9,'gothicStone');
    window(at(m,0,-15),2,0,20,8.5,4,6,true,'stoneTrim');
  });
  site('Barnes Hall',28,104,0,m=>{
    wing(m,22,16,14,'chapelBrick','gable',2);
    wing(at(m,-7,-6,Math.PI/2),22,8,17,'chapelBrick','gable',3);
    gable(m,0,8,14,22,9,'chapelBrick');window(m,0,0,16,8,3,4,true);
    wing(at(m,8,-3),7,8,23,'chapelBrick','hip',3);
  });
  site('Cornell Store',45,73,0,m=>{
    m.box('olinStone',0,1,0,44,2,28);m.box('grass',0,2.25,0,44,.5,28);
    m.box('window',0,1,14,25,2,.5);m.box('limestone',0,2.5,14,28,.5,2);
    m.box('limestone',0,2.75,0,9,.5,7);m.box('window',0,3,0,7,.5,5);
  });
  site('Sibley Hall',43,-241,0,m=>{
    wing(m,87,20,15,'limestone','hip',3);
    wing(m,17,25,19,'limestone','hip',3);
    for(let y=0;y<8;y++)m.box('copper',0,22+y*.5,0,Math.max(2,14-y*1.5),.5,Math.max(2,14-y*1.5));
    m.box('limestone',0,26.5,0,3,3,3);roof(m,4,4,28,'hip','copper');
  });
  site('Tjaden Hall',-14,-233,0,m=>{wing(m,26,22,20,'sageBrick','hip',4);wing(at(m,0,-8),9,9,30,'sageBrick','hip',4);spire(m,0,-8,34,7,9);});
  site('Lincoln Hall',108,-211,Math.PI/2,m=>{wing(m,37,20,20,'redStone','hip',3);gable(m,0,10,20,13,5,'redStone');});

  // Surrounding blocks frame the main campus rather than ending in an empty lawn.
  for(const [name,x,z,w,d,h,mat,style] of [
    ['Uris Hall',164,40,36,32,31,'bronze','flat'],['Statler Hall',167,121,60,25,24,'olinStone','flat'],
    ['Barton Hall',180,195,65,38,22,'sageBrick','gable'],['Ives Hall',203,75,45,17,18,'redStone','hip'],
    ['Baker Laboratory',175,-174,58,25,23,'limestone','flat'],['Physical Sciences',174,-119,59,25,25,'glassWall','flat'],
    ['Klarman Hall',145,-85,30,35,9,'glassWall','flat'],
    ['Cornell Health',-13,149,30,22,18,'olinStone','flat'],['Olin Hall',35,190,46,25,21,'sageBrick','hip'],
    ['Rockefeller Hall',178,-49,40,20,18,'oldStone','hip'],
    ['Bailey Hall',236,-115,36,28,20,'limestone','hip'],
    ['Malott Hall',238,-48,41,25,20,'olinStone','flat'],
    ['Warren Hall',303,-127,57,24,21,'limestone','hip'],
    ['Mann Library',360,-174,49,27,23,'olinStone','flat'],
    ['Roberts Hall',302,-62,51,25,24,'sageBrick','hip'],
    ['Caldwell Hall',358,-60,35,23,19,'redStone','hip'],
    ['Kennedy Hall',304,5,50,26,27,'olinStone','flat'],
    ['Duffield Hall',105,230,55,32,20,'glassWall','flat'],
    ['Phillips Hall',35,250,47,22,20,'sageBrick','flat'],
    ['Upson Hall',112,299,60,25,24,'olinStone','flat'],
    ['Rhodes Hall',192,303,48,30,29,'sageBrick','flat'],
    ['Kimball Hall',-22,230,35,21,17,'sageBrick','hip'],
    ['Thurston Hall',-19,292,41,23,18,'redStone','flat'],
    ['Rand Hall',104,-282,31,21,17,'sageBrick','flat'],
    ['Milstein Hall',68,-287,29,25,11,'glassWall','flat'],
    ['Northern academic block',180,-289,47,28,22,'limestone','hip'],
    ['Eastern academic block',286,100,58,30,22,'sageBrick','flat'],
    ['Eastern academic wing',310,189,55,25,24,'olinStone','flat'],
  ])site(name,x,z,0,m=>wing(m,w,d,h,mat,style,Math.max(2,Math.floor(h/5))));
  // Lower western campus and houses continue beyond the foot of Libe Slope.
  for(const x of [-435,-495])for(const z of [-238,-178,-118,-58,2,62,122,182]){
    site('Western neighborhood',x,z,0,m=>wing(m,25,17,12,(z+238)%120?'redStone':'gothicStone','gable',2));
  }
  for(const [name,x,z] of [['Cook House',-331,-217],['Becker House',-365,-138],['Bethe House',-328,-55],['Rose House',-363,31],['Keeton House',-325,116]])site(name,x,z,0,m=>{
    wing(at(m,0,-19),55,14,18,'gothicStone','gable',3);
    wing(at(m,-21,5,Math.PI/2),34,13,17,'gothicStone','gable',3);
    wing(at(m,21,5,Math.PI/2),34,13,17,'gothicStone','gable',3);
  });
  site('Noyes Community Center',-319,189,0,m=>{
    wing(m,37,25,10,'olinStone','flat',2);
    m.box('window',0,4,13,29,5,.5);
  });
  for(const [name,x,z,w,d,h,mat] of [
    ['Hollister Hall',-65,193,34,24,19,'gothicStone'],
    ['Teagle Hall',260,264,55,31,23,'sageBrick'],
    ['Snee Hall',-83,276,34,29,24,'olinStone'],
    ['Grumman Hall',-60,337,39,22,18,'sageBrick'],
    ['Human Ecology',302,-298,63,35,26,'olinStone'],
    ['Comstock Hall',361,90,40,28,23,'sageBrick'],
    ['Wing Hall',397,-5,33,23,21,'redStone'],
  ])site(name,x,z,0,m=>wing(m,w,d,h,mat,'hip',3));
  // Extend the academic and residential fabric beyond the immediate landmarks.
  for(const z of [-370,-443])for(const x of [-30,55,145,235,325])site('Northern campus backdrop',x,z,0,m=>wing(m,42,26,18+(x%3)*2,x<100?'redStone':'olinStone','hip',3));
  for(const z of [385,452])for(const x of [-70,5,82,160,240])site('Southern campus backdrop',x,z,0,m=>wing(m,38,24,17,x<100?'sageBrick':'olinStone','flat',3));
  for(const z of [-280,-185,-92,25,130,230,330])site('Eastern campus backdrop',455,z,0,m=>wing(m,48,29,22,'limestone','hip',4));
  // Mesh touching buildings together so their shared faces cannot z-fight.
  const groups=[];
  for(const structure of structures){
    const model=new VoxelModel(.5),{x,y,z,turn}=structure;
    const c=Math.round(Math.cos(turn)),s=Math.round(Math.sin(turn));
    for(const box of structure.model.boxes){
      const center=box.min.map((v,i)=>(v+box.max[i])*.25);
      const size=box.max.map((v,i)=>(v-box.min[i])*.5);
      model.box(box.material,x+center[0]*c+center[2]*s,y+center[1],z+center[2]*c-center[0]*s,c?size[0]:size[2],size[1],c?size[2]:size[0]);
    }
    const bounds=m=>[0,1,2].map(i=>[Math.min(...m.boxes.map(b=>b.min[i])),Math.max(...m.boxes.map(b=>b.max[i]))]);
    let group={model,names:[structure.name],parts:[bounds(model)]};
    for(let i=0;i<groups.length;){
      if(group.parts.some(a=>groups[i].parts.some(b=>a.every(([lo,hi],axis)=>lo<=b[axis][1]&&hi>=b[axis][0])))){
        group.model.boxes.push(...groups[i].model.boxes);group.names.push(...groups[i].names);group.parts.push(...groups[i].parts);groups.splice(i,1);i=0;
      }else i++;
    }
    groups.push(group);
  }
  for(const group of groups){
    let model=group.model;
    // Distant buildings use full Minecraft blocks; the tower retains half-block detail.
    if(group.parts.every(b=>b[0][0]>400||b[0][1]<-400||b[2][0]>400||b[2][1]<-400)){
      model=new VoxelModel(1);
      for(const box of group.model.boxes){
        const center=box.min.map((v,i)=>(v+box.max[i])*.25),size=box.max.map((v,i)=>(v-box.min[i])*.5);
        model.box(box.material,...center,...size);
      }
    }
    addModel(model,0,0,0,0,group.names.join(' + '));
  }
  return footprints;
}
