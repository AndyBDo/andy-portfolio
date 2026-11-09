import musicIcon from './assets/audio-music.webp';
import soundIcon from './assets/audio-sound.webp';
export function initBackgroundMusic(app){
  const music=new Audio('/audio/sweden.ogg');
  music.id='background-music';music.loop=true;music.preload='auto';music.volume=.35;music.hidden=true;
  const effects=new Audio('/audio/minecraft-click.ogg');
  effects.id='interface-sound';effects.preload='none';effects.volume=.3;effects.hidden=true;
  document.body.append(music,effects);
  let musicEnabled=true,soundEnabled=true;
  try{soundEnabled=localStorage.getItem('andy-sound')!=='off';}catch{}
  music.load();
  const controls=document.createElement('div');controls.className='audio-controls';controls.setAttribute('role','group');controls.setAttribute('aria-label','Audio controls');
  const slash='<svg class="audio-off" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3L21 21" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  controls.innerHTML=`<button type="button" class="music-toggle"><img class="audio-icon" src="${musicIcon}" alt="" width="28" height="28">${slash}</button><button type="button" class="sound-toggle"><img class="audio-icon" src="${soundIcon}" alt="" width="28" height="28">${slash}</button>`;
  document.body.append(controls);
  const musicButton=controls.querySelector('.music-toggle'),soundButton=controls.querySelector('.sound-toggle');
  function save(key,enabled){try{localStorage.setItem(key,enabled?'on':'off');}catch{}}
  function syncMusic(){
    musicButton.setAttribute('aria-pressed',String(musicEnabled));musicButton.setAttribute('aria-label',musicEnabled?'Mute music':'Play music');musicButton.title=musicEnabled?'Mute Sweden — C418':'Play Sweden — C418';
  }
  function syncSound(){
    soundButton.setAttribute('aria-pressed',String(soundEnabled));soundButton.setAttribute('aria-label',soundEnabled?'Mute sound effects':'Enable sound effects');soundButton.title=soundEnabled?'Mute sound effects':'Enable sound effects';
  }
  function start(){
    if(!musicEnabled)return;
    if(music.error)music.load();
    music.play().then(syncMusic).catch(syncMusic);
  }
  function playClick(event){
    const control=event.target.closest('button,a.button');
    if(!soundEnabled||!event.isTrusted||!control||control.disabled||control.getAttribute('aria-disabled')==='true')return;
    effects.currentTime=0;effects.play().catch(()=>{});
  }
  musicButton.addEventListener('click',()=>{
    musicEnabled=!musicEnabled;
    if(musicEnabled)start();else music.pause();
    save('andy-music',musicEnabled);
    syncMusic();
  });
  soundButton.addEventListener('click',()=>{
    soundEnabled=!soundEnabled;save('andy-sound',soundEnabled);
    if(!soundEnabled){effects.pause();effects.currentTime=0;}
    syncSound();
  });
  controls.addEventListener('click',playClick);app.addEventListener('click',playClick,true);
  music.addEventListener('playing',syncMusic);music.addEventListener('pause',syncMusic);music.addEventListener('error',()=>{syncMusic();musicButton.title='Music could not load. Click to retry.';});
  syncMusic();syncSound();
  const world=document.querySelector('#panorama');
  const worldObserver=new MutationObserver(()=>{
    if(world.dataset.textures==='ready'){worldObserver.disconnect();start();}
    else if(world.dataset.textures==='failed')worldObserver.disconnect();
  });
  worldObserver.observe(world,{attributes:true,attributeFilter:['data-textures']});
  if(world.dataset.textures==='ready')start();
}
