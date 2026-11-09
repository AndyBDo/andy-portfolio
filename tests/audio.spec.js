import {test,expect} from '@playwright/test';
test.use({launchOptions:{args:['--autoplay-policy=no-user-gesture-required']}});

test('Sweden starts automatically when the Three.js world is ready and keeps playing between sections',async({page})=>{
  let release;const gate=new Promise(resolve=>{release=resolve;});
  await page.route('**/src/cornell*',async route=>{await gate;await route.continue();});
  const requests=[];page.on('request',r=>{if(r.url().includes('/audio/sweden.ogg'))requests.push(r.url());});
  await page.goto('/',{waitUntil:'domcontentloaded'});await expect(page.locator('#loading-screen')).toBeVisible();
  const music=page.locator('#background-music');await expect(music).toHaveCount(1);
  expect(await music.evaluate(audio=>audio.paused)).toBe(true);
  await expect.poll(()=>requests.length).toBeGreaterThan(0);
  release();
  await expect.poll(()=>page.locator('#panorama').evaluate(canvas=>canvas.dataset.textures),{timeout:60000}).toBe('ready');
  await expect.poll(()=>music.evaluate(audio=>!audio.paused&&audio.currentTime>0),{timeout:15000}).toBe(true);
  await expect(page.locator('#loading-screen')).toHaveCount(0,{timeout:60000});
  await expect(page.getByRole('button',{name:'Mute music',exact:true})).toHaveAttribute('aria-pressed','true');
  expect(await music.evaluate(audio=>audio.loop&&audio.duration>180)).toBe(true);
  await expect(page.getByRole('button',{name:'Mute music',exact:true})).toHaveAttribute('aria-pressed','true');
  const before=await music.evaluate(audio=>audio.currentTime);
  await page.getByRole('button',{name:'About Me',exact:true}).click();await page.getByRole('button',{name:'Done',exact:true}).click();
  expect(await music.evaluate(audio=>audio.currentTime)).toBeGreaterThanOrEqual(before);
});

test('autoplay is attempted at Three.js readiness without requiring a click',async({page})=>{
  await page.addInitScript(()=>{
    window.musicPlayAttempts=0;
    const play=HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play=function(){if(this.id==='background-music'){window.musicPlayAttempts++;return Promise.reject(new DOMException('Autoplay blocked','NotAllowedError'));}return play.call(this);};
  });
  await page.goto('/');
  await expect.poll(()=>page.locator('#panorama').evaluate(canvas=>canvas.dataset.textures),{timeout:60000}).toBe('ready');
  const music=page.locator('#background-music');expect(await music.evaluate(audio=>audio.paused)).toBe(true);
  await expect.poll(()=>page.evaluate(()=>window.musicPlayAttempts)).toBeGreaterThan(0);
  await expect(page.getByRole('button',{name:'Mute music',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'About Me',exact:true}).click();
  expect(await music.evaluate(audio=>audio.paused)).toBe(true);
  await page.reload();
  await expect.poll(()=>page.locator('#panorama').evaluate(canvas=>canvas.dataset.textures),{timeout:60000}).toBe('ready');
  expect(await music.evaluate(audio=>audio.paused)).toBe(true);
  await expect.poll(()=>page.evaluate(()=>window.musicPlayAttempts)).toBeGreaterThan(0);
});

test('sound effects toggle is independent from music and remembers its setting',async({page})=>{
  await page.goto('/');await expect(page.locator('#loading-screen')).toHaveCount(0,{timeout:60000});
  const music=page.locator('#background-music'),effects=page.locator('#interface-sound');
  await expect.poll(()=>music.evaluate(audio=>!audio.paused),{timeout:15000}).toBe(true);
  await page.getByRole('button',{name:'Mute sound effects',exact:true}).click();
  await page.getByRole('button',{name:'About Me',exact:true}).click();
  expect(await effects.evaluate(audio=>audio.paused&&audio.currentTime===0)).toBe(true);expect(await music.evaluate(audio=>!audio.paused)).toBe(true);
  await page.getByRole('button',{name:'Enable sound effects',exact:true}).click();
  await expect.poll(()=>effects.evaluate(audio=>audio.played.length)).toBeGreaterThan(0);
  await page.getByRole('button',{name:'Mute sound effects',exact:true}).click();
  await page.reload();await expect(page.locator('#loading-screen')).toHaveCount(0,{timeout:60000});
  await expect(page.getByRole('button',{name:'Enable sound effects',exact:true})).toHaveAttribute('aria-pressed','false');
});
