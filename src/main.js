import {startLoading} from './loading';
import {favoriteMusic} from './music';
import {playerMarkup} from './player-ui';
import {randomSplash} from './splashes';
import './style.css';
import logoUrl from './assets/logo-portfolio.webp';
const app=document.querySelector('#app');const loading=startLoading(app);let selected=0,disposePlayer=()=>{};const splash=randomSplash();
const button=(text,action)=>action==='resume'?`<a class="button resume-link" href="/Andy_Do_Resume.pdf" target="_blank" rel="noopener" aria-label="Resume (opens in a new tab)">${text}<svg class="contact-arrow" viewBox="0 0 9 9" aria-hidden="true"><path d="M2 0H9V7H7V3H6V4H5V5H4V6H3V7H2V6H1V5H2V4H3V3H4V2H2Z" fill="currentColor"/></svg></a>`:`<button data-action="${action}">${text}</button>`;const links=`<a class="button" href="mailto:doandyb@gmail.com">Email</a><a class="button" href="https://www.linkedin.com/in/andybdo/" target="_blank" rel="noopener">LinkedIn ↗</a><a class="button" href="https://github.com/AndyBDo" target="_blank" rel="noopener">GitHub ↗</a>`;
function fitHomeSplash(){
  const label=app.querySelector('.splash');if(!label)return;
  const fit=()=>{
    if(!label.isConnected)return;
    const width=innerWidth,margin=24;
    const logo=app.querySelector('.brand img').getBoundingClientRect();
    label.style.animation='none';label.style.scale='1';
    label.style.fontSize=`${Math.min(56,width*.044)}px`;
    label.style.transform='rotate(-20deg)';
    label.style.right='auto';label.style.left='0px';label.style.top='0px';
    const natural=label.getBoundingClientRect();
    const available=Math.min(logo.width*.65,width-margin*2);
    const ratio=Math.min(1,available/(natural.width*1.06));
    label.style.fontSize=`${Math.min(56,width*.044)*ratio}px`;
    // Match the reference: the splash crosses the logo’s lower-right quarter.
    const centerX=logo.left+logo.width*.87;
    const centerY=logo.top+logo.height*.70;
    label.style.left=`${centerX-label.offsetWidth/2}px`;
    label.style.top=`${centerY-label.offsetHeight/2}px`;
    // Fit and clamp at the pulse's largest scale so animation cannot clip the text.
    label.style.scale='1.06';
    let bounds=label.getBoundingClientRect();
    const screenFit=Math.min(1,(width-margin*2)/bounds.width,(innerHeight-margin*2)/bounds.height);
    if(screenFit<1){
      label.style.fontSize=`${parseFloat(label.style.fontSize)*screenFit}px`;
      label.style.left=`${centerX-label.offsetWidth/2}px`;
      label.style.top=`${centerY-label.offsetHeight/2}px`;
      bounds=label.getBoundingClientRect();
    }
    const dx=Math.max(margin-bounds.left,Math.min(0,width-margin-bounds.right));
    const dy=Math.max(margin-bounds.top,Math.min(0,innerHeight-margin-bounds.bottom));
    label.style.left=`${parseFloat(label.style.left)+dx}px`;
    label.style.top=`${parseFloat(label.style.top)+dy}px`;
    label.style.scale='';
    label.style.animation='';
  };
  fit();document.fonts.ready.then(fit);
  app.querySelector('.brand img').addEventListener('load',fit,{once:true});
}
addEventListener('resize',fitHomeSplash);
function go(route){location.hash=route;}
function mountPlayer(host){
  let cancelled=false,dispose=()=>{};
  // Paint the WebP preview and menu before downloading or creating a WebGL context.
  const frame=requestAnimationFrame(()=>requestAnimationFrame(async()=>{
    if(cancelled||!host?.isConnected)return;
    try{
      const {mountPlayer}=await import('./player');
      if(!cancelled&&host.isConnected)dispose=mountPlayer(host);
    }catch{host.dataset.loadingError='true';host?.setAttribute('aria-label','Minecraft skin of Andy Do');}
  }));
  return()=>{cancelled=true;cancelAnimationFrame(frame);dispose();};
}
// Let the menu paint first, then start the rotating campus automatically.
requestAnimationFrame(()=>requestAnimationFrame(()=>{
  import('./cornell').then(({panorama})=>panorama()).catch(error=>{document.querySelector('#panorama').dataset.textures='failed';console.error('Campus panorama could not start',error);});
}));
const routes={
  work:()=>import('./world-menu'),projects:()=>import('./world-menu'),
  advancements:()=>import('./advancements'),
};
app.addEventListener('pointerover',event=>routes[event.target.closest('[data-action]')?.dataset.action]?.());
app.addEventListener('focusin',event=>routes[event.target.closest('[data-action]')?.dataset.action]?.());
async function render(){disposePlayer();disposePlayer=()=>{};const [page='home',id]=location.hash.slice(1).split('/');const home=page==='home'||!page;document.body.classList.toggle('secondary',!home);
if(home){app.innerHTML=`<section class="home"><div class="brand"><img src="${logoUrl}" alt="Andy Do — Portfolio Edition"><span class="splash">${splash}</span></div><nav class="menu" aria-label="Main menu">${['About Me','Work Experience','Projects','Advancements','Contact','Resume'].map((s,i)=>button(s,['about','work','projects','advancements','contact','resume'][i])).join('')}</nav>${playerMarkup()}</section><footer><span>Andy Do 1.0</span><span>Copyright Andy Do. Please DO distribute!</span></footer>`;fitHomeSplash();disposePlayer=mountPlayer(app.querySelector('.player-stage'));return;}
if(page==='wardrobe'){app.innerHTML=`<section class="wardrobe-screen"><h1>Wardrobe</h1><p class="wardrobe-subtitle">(my favorite fits!)</p>${playerMarkup(true)}</section>`;disposePlayer=mountPlayer(app.querySelector('.player-stage'));return;}
let title='',body='',actions='';
if((page==='work'||page==='projects')&&id===undefined){const {worldMenu}=await import('./world-menu');if(location.hash.slice(1)!==page)return;worldMenu(app,page);return;}
if((page==='work'||page==='projects')&&id!==undefined){const {experienceBook}=await import('./experience-book');if(location.hash.slice(1)!==`${page}/${id}`)return;experienceBook(app,Number(id),page);return;}
else if(page==='about'){
  app.innerHTML=`<section class="wardrobe-screen about-wardrobe" aria-label="About Me"><header class="about-heading"><h1>About Me</h1><p>A little about the player.</p></header><div class="about-layout">${playerMarkup().replace('class="player-preview"','class="player-preview player-large"').replace('</aside>','<span class="wardrobe-callout" aria-hidden="true"><svg viewBox="0 0 28 12"><path d="M27 6H2M8 1L2 6L8 11"/></svg><span>Explore my fits!</span></span></aside>')}<article class="about-bio"><p class="bio-eyebrow">CORNELL UNIVERSITY · CLASS OF 2028</p><h2>Hi, I'm Andy Do.</h2><p>I'm a Computer Science student at Cornell University graduating in May 2028. If it wasn't obvious, I enjoy Minecraft. I also like playing ROBLOX horror games.</p><p>But don't worry, staying inside isn't my only hobby. I like playing pickleball with the boys, tennis, ping pong, lowkey just any racket sport.</p><p>I also love anime (JJK fan), played clarinet and competed in all states, and I love eating (shrimp tempura sushi is the best).</p><p class="bio-postscript">I also bench 225 by the way (no flex)</p></article></div>${favoriteMusic()}</section><nav class="about-done" aria-label="About Me navigation">${button('Done','home')}</nav>`;
  disposePlayer=mountPlayer(app.querySelector('.player-stage'));
  const heading=app.querySelector('h1');heading.tabIndex=-1;heading.focus({preventScroll:true});return;
}
else if(page==='contact'){
  const arrow=`<svg class="contact-arrow" viewBox="0 0 9 9" aria-hidden="true"><path d="M2 0H9V7H7V3H6V4H5V5H4V6H3V7H2V6H1V5H2V4H3V3H4V2H2Z" fill="currentColor"/></svg>`;
  app.innerHTML=`<section class="contact-screen"><h1 tabindex="-1">Contact</h1><nav class="contact-menu" aria-label="Contact links"><a class="button" href="mailto:doandyb@gmail.com">doandyb@gmail.com</a><a class="button" href="https://www.linkedin.com/in/andybdo/" target="_blank" rel="noopener">LinkedIn ${arrow}</a><a class="button" href="https://github.com/AndyBDo" target="_blank" rel="noopener">GitHub ${arrow}</a><a class="button" href="tel:+17178082649">(717) 808-2649</a></nav><nav class="contact-done">${button('Done','home')}</nav></section>`;
  app.querySelector('h1').focus({preventScroll:true});return;
}
else if(page==='advancements'){const {mountAdvancements}=await import('./advancements');if(location.hash!=='#advancements')return;mountAdvancements(app);return;}

else{go('home');return;}
app.innerHTML=`<section class="screen"><header><h1>${title}</h1></header><div class="content">${body}</div><nav class="actions">${actions||button('Done','home')}</nav></section>`;app.querySelector('h1').tabIndex=-1;app.querySelector('h1').focus();}
const clickSound=new Audio('/audio/minecraft-click.ogg');
clickSound.preload='none';clickSound.volume=.3;
app.addEventListener('click',event=>{
  const control=event.target.closest('button,a.button');
  if(!event.isTrusted||!control||control.disabled||control.getAttribute('aria-disabled')==='true')return;
  clickSound.currentTime=0;clickSound.play().catch(()=>{});
},true);
app.addEventListener('click',e=>{const el=e.target.closest('[data-action],[data-select],a');if(!el)return;if(el.dataset.select!==undefined){selected=Number(el.dataset.select);render();app.querySelectorAll('.world')[selected]?.focus();return;}const action=el.dataset.action;if(action==='print')window.print();else if(action)go(action);});
app.addEventListener('dblclick',e=>{const el=e.target.closest('[data-select]');if(el)go(`${location.hash.slice(1).split('/')[0]}/${el.dataset.select}`);});
addEventListener('keydown',e=>{if(e.key==='Escape'){const parts=location.hash.slice(1).split('/');go(parts.length>1?parts[0]:'home');}if(['ArrowDown','ArrowUp'].includes(e.key)){const controls=[...app.querySelectorAll('button,a.button')];const index=controls.indexOf(document.activeElement);e.preventDefault();controls[(index+(e.key==='ArrowDown'?1:-1)+controls.length)%controls.length]?.focus();}});addEventListener('hashchange',render);render().then(()=>loading.rendered());
