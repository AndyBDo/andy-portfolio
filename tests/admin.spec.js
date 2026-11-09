import {test,expect} from '@playwright/test';
async function session(page,isAdmin){
  await page.route('**/api/admin/session',route=>route.fulfill({json:{isAdmin,configured:true,...(isAdmin?{email:'doa12967@gmail.com'}:{})}}));
  await page.route('**/api/visit',route=>route.fulfill({status:204}));
}

test('anonymous visitors cannot see Admin and direct access requests sign-in',async({page})=>{
  await session(page,false);await page.goto('/');
  await expect(page.locator('#loading-screen')).toHaveCount(0,{timeout:60000});
  await expect(page.getByRole('button',{name:'Admin',exact:true})).toHaveCount(0);
  await page.goto('/#admin');await expect(page.getByRole('link',{name:'Sign in to Admin'})).toHaveAttribute('href','/api/admin/login');
  await expect(page.locator('table')).toHaveCount(0);
});

test('verified owner sees Admin above About Me, history, device details, then unique count',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await session(page,true);
  await page.route('**/api/admin/visitors?*',route=>route.fulfill({json:{totalVisitors:2,page:1,limit:50,visitors:[
    {first_seen:1794232800000,last_seen:1794236400000,device:'Mobile',browser:'Safari',os:'iOS'},
    {first_seen:1794229200000,last_seen:1794232800000,device:'Desktop',browser:'Chrome',os:'Windows'},
  ]}}));
  await page.goto('/');await expect(page.locator('#loading-screen')).toHaveCount(0,{timeout:60000});
  const admin=page.getByRole('button',{name:'Admin',exact:true}),about=page.getByRole('button',{name:'About Me',exact:true});
  await expect(admin).toBeVisible();expect((await admin.boundingBox()).y).toBeLessThan((await about.boundingBox()).y);
  await admin.click();await expect(page.getByRole('heading',{name:'Visitor history'})).toBeVisible();
  await expect(page.getByRole('row')).toHaveCount(3);
  await expect(page.getByRole('cell',{name:'Mobile',exact:true})).toBeVisible();
  await expect(page.getByRole('cell',{name:'Windows',exact:true})).toBeVisible();
  await expect(page.locator('.admin-summary strong')).toHaveText('2');
  expect((await page.locator('.admin-summary').boundingBox()).y).toBeGreaterThan((await page.locator('table').boundingBox()).y);
  await page.setViewportSize({width:390,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('button',{name:'Done',exact:true}).click();await expect(admin).toBeVisible();
});

test('empty history shows zero and expired sessions never show visitor data',async({page})=>{
  await session(page,true);let expired=false;
  await page.route('**/api/admin/visitors?*',route=>expired?route.fulfill({status:401,json:{error:'Unauthorized'}}):route.fulfill({json:{totalVisitors:0,page:1,limit:50,visitors:[]}}));
  await page.goto('/#admin');await expect(page.locator('#loading-screen')).toHaveCount(0,{timeout:60000});
  await expect(page.getByText('No visitors yet. New visitors will appear here.')).toBeVisible();await expect(page.locator('.admin-summary strong')).toHaveText('0');
  expired=true;await page.getByRole('button',{name:'Refresh',exact:true}).click();await expect(page.getByRole('alert')).toContainText('session has expired');
  await expect(page.locator('table')).toHaveCount(0);
});
