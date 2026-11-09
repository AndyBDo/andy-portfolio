import {experience, projects} from './data';
import fiservLogo from './assets/fiserv-logo.webp';
import cdsLogo from './assets/cds-logo-updated.webp';
import iu13Logo from './assets/iu13-logo.webp';
import projectIcons from './assets/project-icons.webp';
import safestepMap from './assets/safestep-map.webp';
const logos = {Fiserv:fiservLogo,'Cornell Data Science':cdsLogo,'Lancaster Lebanon IU13':iu13Logo,SafeStep:safestepMap};
const iconViews={Loci:'30 20 590 550',CodeLens:'615 60 470 510',Alloc:'1110 65 410 520',PokerCaml:'330 580 370 440',Lambda:'755 575 455 449'};
function thumbnail(item){
  if(logos[item.title])return `<img src="${logos[item.title]}" alt="">`;
  if(iconViews[item.title])return `<svg class="project-icon" viewBox="${iconViews[item.title]}" aria-hidden="true"><image href="${projectIcons}" width="1536" height="1024"/></svg>`;
  return item.icon;
}
const destinations = {
  Fiserv:'https://www.fiserv.com/',
  'Lancaster Lebanon IU13':'https://www.iu13.org/',
  'Cornell Data Science':'https://cornelldata.science/',
  CodeLens:'https://github.com/AndyBDo/CodeLens',
  Lambda:'https://github.com/Glioh/lambda',
};
export function worldMenu(app, page) {
  const data = page === 'work' ? experience : projects;
  const noun = page === 'work' ? 'Experience' : 'Project';
  let selected = null;
  app.innerHTML = `<section class="screen world-screen"><header><h1>Select ${noun}</h1></header><div class="content"><div class="worlds" role="listbox" aria-label="${noun}s"></div></div><nav class="actions"><div class="world-actions"><a class="button play" aria-disabled="true">Join ${noun}</a><button class="details" disabled>${page==='work'?'Visit Site <svg class="contact-arrow" viewBox="0 0 9 9" aria-hidden="true"><path d="M2 0H9V7H7V3H6V4H5V5H4V6H3V7H2V6H1V5H2V4H3V3H4V2H2Z" fill="currentColor"/></svg>':'View Details'}</button><button data-action="home">Cancel</button></div><span class="destination-note" aria-live="polite"></span></nav></section>`;
  const list = app.querySelector('.worlds'), play = app.querySelector('.play'), details = app.querySelector('.details');
  function select(i) {
    selected = i;
    list.querySelectorAll('.world').forEach(el=>{const active=Number(el.dataset.index)===i;el.classList.toggle('selected',active);el.setAttribute('aria-selected',String(active));});
    const url = data[i]?.url || destinations[data[i]?.title];
    if(i!==null&&page==='work'){
      play.href=`#work/${i}`;play.removeAttribute('target');play.removeAttribute('rel');
    }else if(url){play.href=url;play.target='_blank';play.rel='noopener noreferrer';}else play.removeAttribute('href');
    play.setAttribute('aria-disabled',String(i===null||!play.hasAttribute('href')));details.disabled=i===null;
    app.querySelector('.destination-note').textContent=i!==null&&!url?'Repository link not provided yet.':'';
  }
  function rows(query='') {
    list.innerHTML=data.map((p,i)=>({p,i})).filter(({p})=>(p.title+' '+p.role).toLowerCase().includes(query.toLowerCase())).map(({p,i})=>`<button class="world" data-index="${i}" role="option" aria-selected="false"><span class="thumbnail thumb-${i}${logos[p.title]||iconViews[p.title]||p.title==='SafeStep'?' thumb-logo':''}" aria-hidden="true">${thumbnail(p)}</span><span><strong>${p.title}</strong><span>${p.date}</span><span>${p.role}</span></span></button>`).join('') || '<p class="empty-worlds">No matching worlds.</p>';
    list.querySelectorAll('.thumbnail').forEach(thumbnail=>{
      thumbnail.insertAdjacentHTML('beforeend','<svg class="play-hit" viewBox="0 0 32 32" aria-hidden="true"><polygon points="10,5 14,5 14,7 16,7 16,9 18,9 18,11 20,11 20,13 22,13 22,15 24,15 24,17 22,17 22,19 20,19 20,21 18,21 18,23 16,23 16,25 14,25 14,27 10,27"/></svg>');
    });
    select(null);
  }
  list.addEventListener('click',e=>{const row=e.target.closest('[data-index]');if(row){select(Number(row.dataset.index));if(e.target.closest('.play-hit polygon')&&play.hasAttribute('href'))play.click();}});
  list.addEventListener('dblclick',e=>{if(e.target.closest('[data-index]')&&play.hasAttribute('href'))play.click();});
  details.addEventListener('click',()=>{
    if(selected===null)return;
    if(page==='work')window.open(destinations[data[selected].title],'_blank','noopener,noreferrer');
    else location.hash=`projects/${selected}`;
  });
  play.addEventListener('click',e=>{if(!play.hasAttribute('href'))e.preventDefault();});
  rows();
  app.querySelector('h1').tabIndex=-1;app.querySelector('h1').focus();
}
