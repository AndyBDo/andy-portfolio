import iconSheet from './assets/skill-icons.png';
import springLeaf from './assets/spring-leaf.png';
import devopsSheet from './assets/devops-icons.png';
import pythonFrameworkSheet from './assets/python-framework-icons.png';

const groups=[['Docker',['Kubernetes','Helm','Argo CD','AWS']],['Java',['Spring','Spring Boot']],['JavaScript',['Node.js','Next.js','React','TanStack','TypeScript']],['Python',['Flask','FastAPI']],['C',[]],['C#',['ASP.NET Core']],['SQL',['Prisma','JPA','SQLAlchemy']],['HTML',[]],['CSS',['Bootstrap','Tailwind CSS']],['OCaml',[]],['Machine Learning',['Pandas','NumPy','Matplotlib','Scikit-learn']]];
const icons={
  Java:[28,165,145,185],Python:[185,179,151,161],'C#':[347,179,136,160],C:[494,179,136,160],JavaScript:[636,178,144,163],TypeScript:[786,179,134,162],SQL:[931,181,133,159],HTML:[1074,180,132,161],CSS:[1217,180,126,160],OCaml:[1356,202,151,136],
  React:[27,418,157,150],'Node.js':[187,418,157,148],'Next.js':[350,421,124,141],TanStack:[491,422,136,141],JPA:[642,421,136,151],Spring:[790,419,136,147],'Spring Boot':[936,421,141,143],Bootstrap:[1090,428,131,132],'ASP.NET Core':[1378,426,144,136],
  SQLAlchemy:[27,669,171,162],Prisma:[207,668,129,159],Pandas:[371,658,125,174],NumPy:[510,668,166,166],Matplotlib:[695,676,174,153],'Scikit-learn':[874,686,182,137],'Machine Learning':[1070,645,218,203],'Technical Skills':[1314,646,188,202],
};
icons['Spring Boot']=icons.Spring;
icons['Tailwind CSS']=icons.CSS;
const devops={Docker:[95,205,400,320],Kubernetes:[510,185,365,345],Helm:[904,167,340,365],'Argo CD':[1305,170,335,375],AWS:[1675,198,435,320]};
const treeHeight=groups.length*58+44;
const pythonFrameworks={Flask:[225,150,595,595],FastAPI:[965,160,565,615]};
const icon=name=>name==='Spring'?`<svg class="skill-art" viewBox="188 119 938 980" aria-hidden="true"><image href="${springLeaf}" width="1312" height="1199"/></svg>`:pythonFrameworks[name]?`<svg class="skill-art" viewBox="${pythonFrameworks[name].join(' ')}" aria-hidden="true"><image href="${pythonFrameworkSheet}" width="1774" height="887"/></svg>`:devops[name]?`<svg class="skill-art" viewBox="${devops[name].join(' ')}" aria-hidden="true"><image href="${devopsSheet}" width="2172" height="724" preserveAspectRatio="none"/></svg>`:`<svg class="skill-art" viewBox="${icons[name].join(' ')}" aria-hidden="true"><image href="${iconSheet}" width="1536" height="1024"/></svg>`;

export function advancements(){
  const rootY=28+(groups.length-1)*29;
  const nodes=[{name:'Technical Skills',x:22,y:rootY}],paths=[];
  groups.forEach(([name,children],row)=>{
    const y=28+row*58;nodes.push({name,x:174,y});
    paths.push(`M58 ${rootY+18} H128 V${y+18} H174`);
    children.forEach((child,i)=>{
      const x=320+i*88;nodes.push({name:child,x,y});
      paths.push(`M${i?320+(i-1)*88+36:210} ${y+18} H${x}`);
    });
  });
  return `<section class="advancement-screen"><div class="advancement-shell"><div class="advancement-tabs"><button class="advancement-tab active" aria-label="Technical Skills">${icon('Technical Skills')}</button></div><div class="advancement-window"><header class="advancement-title"><h1>Advancements</h1></header><div class="advancement-canvas-frame"><div class="advancement-viewport" aria-label="Skills advancement tree"><div class="advancement-fit"><div class="advancement-tree"><svg class="advancement-lines" width="760" height="${treeHeight}" aria-hidden="true"><path class="line-shadow" d="${paths.join(' ')}"/><path class="line-light" d="${paths.join(' ')}"/></svg>${nodes.map(n=>`<button class="skill-node" style="left:${n.x}px;top:${n.y}px" aria-label="${n.name}" data-skill="${n.name}"><span class="skill-icon${['ASP.NET Core','JPA'].includes(n.name)?' skill-icon-offset':''}">${icon(n.name)}</span><span class="skill-caption">${n.name}</span></button>`).join('')}</div></div></div></div><nav class="advancement-footer"><button data-action="home">Done</button></nav><div class="compact-skill-tooltip" role="tooltip" hidden></div></div></div></section>`;
}

export function mountAdvancements(app){
  app.innerHTML=advancements();
  const viewport=app.querySelector('.advancement-viewport'),fit=app.querySelector('.advancement-fit'),tree=app.querySelector('.advancement-tree'),tip=app.querySelector('[role=tooltip]');
  const scale=1.6;
  tree.style.height=`${treeHeight}px`;
  const canvasPadding=70;
  tree.style.transform=`scale(${scale})`;
  tree.style.left=`${canvasPadding}px`;tree.style.top=`${canvasPadding}px`;
  fit.style.width=`${760*scale+canvasPadding*2}px`;
  fit.style.height=`${treeHeight*scale+canvasPadding*2}px`;
  viewport.scrollLeft=0;viewport.scrollTop=0;
  let drag=null;
  viewport.addEventListener('pointerdown',event=>{
    if(event.button!==0||!event.isPrimary)return;
    drag={id:event.pointerId,x:event.clientX,y:event.clientY,left:viewport.scrollLeft,top:viewport.scrollTop,moved:false};
    viewport.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener('pointermove',event=>{
    if(!drag||event.pointerId!==drag.id)return;
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
    if(!drag.moved&&Math.hypot(dx,dy)<4)return;
    drag.moved=true;tip.hidden=true;viewport.classList.add('dragging');
    viewport.scrollLeft=drag.left-dx;viewport.scrollTop=drag.top-dy;
    event.preventDefault();
  });
  const endDrag=()=>{drag=null;viewport.classList.remove('dragging');};
  viewport.addEventListener('pointerup',endDrag);
  viewport.addEventListener('pointercancel',endDrag);
  viewport.addEventListener('lostpointercapture',endDrag);
  viewport.addEventListener('scroll',()=>tip.hidden=true);
  const show=event=>{
    if(drag?.moved)return;
    const node=event.target.closest('[data-skill]');if(!node){tip.hidden=true;return;}
    tip.textContent=node.dataset.skill;tip.hidden=false;
    const panel=app.querySelector('.advancement-window');
    const rect=node.getBoundingClientRect(),bounds=panel.getBoundingClientRect();
    const left=rect.left-bounds.left-panel.clientLeft+(rect.width-tip.offsetWidth)/2;
    tip.style.left=`${Math.max(0,Math.min(left,panel.clientWidth-tip.offsetWidth))}px`;
    tip.style.top=`${Math.max(0,rect.top-bounds.top-panel.clientTop-tip.offsetHeight+1)}px`;
  };
  viewport.addEventListener('pointerover',show);viewport.addEventListener('focusin',show);
  viewport.addEventListener('pointerout',event=>{
    const node=event.target.closest('[data-skill]');
    if(node&&!node.contains(event.relatedTarget))tip.hidden=true;
  });
  viewport.addEventListener('pointerleave',()=>tip.hidden=true);viewport.addEventListener('focusout',()=>tip.hidden=true);
  const heading=app.querySelector('h1');heading.tabIndex=-1;heading.focus({preventScroll:true});
}
