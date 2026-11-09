export function startLoading(app){
  const screen=document.querySelector('#loading-screen'),bar=screen.querySelector('[role=progressbar]');
  const fill=screen.querySelector('.experience-fill');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Animate the estimate on the compositor, including while Three.js builds the scene.
  const motion=fill.animate([{clipPath:'inset(0 98% 0 0)'},{clipPath:'inset(0 6% 0 0)'}],{
    duration:14000,easing:'cubic-bezier(.1,.6,.2,1)',fill:'forwards',
  });
  if(reduced)motion.pause();
  let rendered=false,assets=false,fonts=false,finished=false;
  document.fonts.ready.then(()=>{fonts=true;update();});
  const observer=new MutationObserver(update);
  observer.observe(app,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-loading-error']});
  observer.observe(document.querySelector('#panorama'),{attributes:true,attributeFilter:['data-textures','data-progress']});
  function fail(){
    finished=true;observer.disconnect();motion.pause();
    screen.querySelector('.loading-error').hidden=false;
    screen.querySelector('.loading-retry').hidden=false;
  }
  function update(){
    if(finished)return;
    const world=document.querySelector('#panorama').dataset.textures;
    const player=app.querySelector('.player-stage');
    if(world==='failed'||player?.dataset.loadingError){fail();return;}
    const playerReady=rendered&&(!player||player.classList.contains('player-ready'));
    const progress=(rendered?10:0)+(fonts?10:0)+(assets?20:0)+(playerReady?20:0)+(world==='ready'?40:Math.floor(Number(document.querySelector('#panorama').dataset.progress||0)*35));
    bar.setAttribute('aria-valuenow',String(progress));
    if(progress===100){
      finished=true;observer.disconnect();
      const clip=getComputedStyle(fill).clipPath;
      fill.style.clipPath=clip;motion.cancel();
      fill.animate([{clipPath:clip},{clipPath:'inset(0 0% 0 0)'}],{duration:reduced?0:450,fill:'forwards'}).finished.then(()=>{
        screen.classList.add('loading-complete');
        setTimeout(()=>{screen.remove();app.inert=false;},200);
      });
    }
  }
  return{async rendered(){
    rendered=true;update();
    const urls=[...app.querySelectorAll('img,svg image'),...screen.querySelectorAll('img')].map(image=>image.getAttribute('src')||image.getAttribute('href'));
    urls.push('/campus-preview.webp');
    try{
      await Promise.all([...new Set(urls)].filter(Boolean).map(url=>{const image=new Image();image.src=url;return image.decode();}));
      assets=true;update();
    }catch{if(!finished)fail();}
  }};
}
