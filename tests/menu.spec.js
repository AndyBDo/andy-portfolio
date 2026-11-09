import {test,expect} from '@playwright/test';

test.beforeEach(async({page},testInfo)=>{
  if(testInfo.title.startsWith('loading screen'))return;
  await page.goto('/');
  await expect(page.locator('#loading-screen')).toHaveCount(0,{timeout:60000});
});

test('loading screen waits for world textures and first rendered frame',async({page})=>{
  let release;const gate=new Promise(resolve=>{release=resolve;});
  await page.route('**/textures/block/*.png',async route=>{await gate;await route.continue();});
  await page.goto('/');
  await expect(page.locator('#loading-screen')).toBeVisible();
  await expect(page.locator('#app')).toHaveAttribute('inert','');
  expect(Number(await page.getByRole('progressbar').getAttribute('aria-valuenow'))).toBeLessThan(100);
  release();
  await expect(page.locator('#loading-screen')).toHaveCount(0,{timeout:60000});
  await expect(page.locator('#panorama')).toHaveAttribute('data-textures','ready');
  await expect(page.locator('.player-stage')).toHaveClass(/player-ready/);
  await expect(page.locator('#app')).not.toHaveAttribute('inert','');
});

test('loading screen offers retry when the world fails to load',async({page})=>{
  await page.route('**/src/cornell*',route=>route.abort());
  await page.goto('/');
  await expect(page.getByRole('button',{name:'Try again'})).toBeVisible();
  await expect(page.locator('#loading-screen')).toBeVisible();
});

test('about outfits, wardrobe, routes and mobile layout',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width:1440,height:900});await page.goto('/#about');
  await expect(page.locator('.player-ready')).toBeVisible({timeout:20000});
  await expect(page.getByRole('button',{name:'Next outfit'})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Previous outfit'})).toHaveCount(0);
  await page.getByRole('button',{name:'Wardrobe',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Wardrobe'})).toBeVisible();
  await expect(page.locator('.outfit-name')).not.toBeEmpty();
  const outfit=await page.locator('.outfit-name').textContent();
  await page.getByRole('button',{name:'Next outfit'}).click();
  await expect(page.locator('.outfit-name')).not.toHaveText(outfit);
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Projects',exact:true}).click();
  await page.getByRole('option').nth(1).click();
  await page.getByRole('button',{name:'View Details'}).click();
  await expect(page.getByRole('heading',{name:'Lambda'})).toBeVisible();
  await page.keyboard.press('Escape');await expect(page.getByRole('heading',{name:'Select Project'})).toBeVisible();
  await page.goto('/#about');await page.setViewportSize({width:390,height:844});
  await expect(page.locator('.about-bio')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('button',{name:'Done',exact:true}).click();
  await expect(page.getByRole('button',{name:'About Me',exact:true})).toBeVisible();
  expect(errors).toEqual([]);
});

test('icons use WebP assets and load without errors',async({page})=>{
  const failed=[];page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
  await page.goto('/#advancements');
  await expect(page.getByRole('heading',{name:'Advancements'})).toBeVisible();
  const icons=page.locator('.skill-art image');expect(await icons.count()).toBeGreaterThan(20);
  expect(await icons.evaluateAll(images=>images.every(img=>img.getAttribute('href').includes('.webp')))).toBe(true);
  await page.waitForLoadState('networkidle');expect(failed).toEqual([]);
});

test('live panorama rotates automatically and respects reduced motion',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await page.goto('/');
  await expect(page.getByRole('button',{name:'Animate background'})).toHaveCount(0);
  const canvas=page.locator('#panorama');await expect(canvas).toHaveAttribute('data-textures','ready',{timeout:60000});
  const first=await canvas.screenshot();await page.waitForTimeout(500);
  expect((await canvas.screenshot()).equals(first)).toBe(false);
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);
  const still=await canvas.screenshot();await page.waitForTimeout(250);
  expect((await canvas.screenshot()).equals(still)).toBe(true);
});


test('each skill shows its usage on hover and keyboard focus',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await page.goto('/#advancements');
  const usage={
    Fiserv:['Docker','Kubernetes','Helm','Argo CD','AWS','Java','Spring','Spring Boot','SQL','JPA'],
    IU13:['JavaScript','C#','ASP.NET Core','HTML','CSS','Bootstrap'],
    'Personal projects':['Node.js','Next.js','React','TanStack','TypeScript','Flask','FastAPI','Prisma','SQLAlchemy','Tailwind CSS'],
    'Cornell Data Science':['Python','Pandas','NumPy','Matplotlib','Scikit-learn'],
    CS3410:['C'],CS3110:['OCaml'],CS3780:['Machine Learning'],
  };
  const tooltip=page.getByRole('tooltip');
  for(const [place,skills] of Object.entries(usage))for(const skill of skills){
    const node=page.getByRole('button',{name:skill,exact:true});
    await node.hover();await expect(tooltip).toHaveText(`Used in: ${place}`);
  }
  await page.getByRole('button',{name:'Java',exact:true}).focus();
  await expect(tooltip).toHaveText('Used in: Fiserv');
  await page.getByRole('heading',{name:'Advancements'}).focus();await expect(tooltip).toBeHidden();
});


test('saved outfit survives reload without a default-fit placeholder',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('andy-outfit','3'));
  await page.goto('/?saved-outfit-test=1#wardrobe');
  await expect(page.locator('.outfit-name')).toHaveText('Cornell sweatshirt + black pants + white vans',{timeout:20000});
  await expect(page.locator('.player-stage img')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('.outfit-name')).toHaveText('Cornell sweatshirt + black pants + white vans',{timeout:20000});
  await expect(page.locator('.player-stage img')).toHaveCount(0);
});
