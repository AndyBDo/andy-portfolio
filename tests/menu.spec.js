import {test,expect} from '@playwright/test';
test('panorama renders, orbits, and respects reduced motion', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto('http://localhost:5173');
  const canvas = page.locator('#panorama');
  await expect(canvas).toHaveAttribute('data-textures','ready');
  const first = await canvas.screenshot();
  // Catch a sky-only render even when WebGL initializes and textures all load.
  const greenPixels = await page.evaluate(async encoded => {
    const bitmap=await createImageBitmap(await (await fetch(`data:image/png;base64,${encoded}`)).blob());
    const sample=new OffscreenCanvas(160,100),ctx=sample.getContext('2d');
    ctx.drawImage(bitmap,0,0,160,100);bitmap.close();
    const pixels=ctx.getImageData(0,0,160,100).data;
    let green=0;
    for(let i=0;i<pixels.length;i+=4)if(pixels[i+1]>pixels[i]*1.1&&pixels[i+1]>pixels[i+2]*1.25)green++;
    return green;
  },first.toString('base64'));
  expect(greenPixels).toBeGreaterThan(100);
  await page.waitForTimeout(500);
  expect((await canvas.screenshot()).equals(first)).toBe(false);
  await page.emulateMedia({reducedMotion:'reduce'});
  const still = await canvas.screenshot();
  await page.waitForTimeout(250);
  expect((await canvas.screenshot()).equals(still)).toBe(true);
  await expect(page.locator('.brand img')).toHaveAttribute('alt','Andy Do — Portfolio Edition');
  await expect.poll(()=>page.locator('.brand img').evaluate(img=>img.complete && img.naturalWidth > 0)).toBe(true);
  expect(await page.locator('.splash').evaluate(el=>getComputedStyle(el).fontFamily)).toContain('Minecraft');
});
test('menu, selection, details, escape, sound and mobile layout',async({page})=>{const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://localhost:5173');await expect(page.getByRole('button',{name:'About Me',exact:true})).toBeVisible();await page.getByRole('button',{name:'Projects',exact:true}).click();await page.getByRole('option').nth(1).click();await page.getByRole('button',{name:'View Details'}).click();await expect(page.getByRole('heading',{name:'Lambda'})).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('heading',{name:'Select Project'})).toBeVisible();await page.keyboard.press('Escape');await page.getByRole('button',{name:'Sound: OFF'}).click();await expect(page.getByRole('button',{name:'Sound: ON'})).toBeVisible();await page.setViewportSize({width:1440,height:900});await page.screenshot({path:'desktop.png'});await page.setViewportSize({width:390,height:844});await page.screenshot({path:'mobile.png'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();expect(errors).toEqual([]);});
