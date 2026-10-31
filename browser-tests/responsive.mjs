// Browser regression with synthetic data. All network requests are intercepted.
// PLAYWRIGHT_MODULE and CHROMIUM_PATH can point to an existing browser install.
import assert from 'node:assert/strict';
import {readFileSync, existsSync, statSync} from 'node:fs';
import {resolve, extname} from 'node:path';
import {fileURLToPath} from 'node:url';
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || undefined,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const sizes = [[320,740],[390,844],[600,900],[768,1024],[820,1180],[900,700],[1024,768],[1280,720],[1440,900],[1920,1080],[2560,1440],[844,390]];
async function intercept(page, root, api) {
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.hostname !== 'layout.test') return route.abort();
    if (url.pathname.startsWith('/api/')) return route.fulfill({json:api(url.pathname)});
    const file = resolve(root, '.' + (extname(url.pathname) ? url.pathname : '/index.html'));
    if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) return route.fulfill({status:404,body:''});
    const type = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.wasm':'application/wasm'}[extname(file)] || 'application/octet-stream';
    return route.fulfill({contentType:type,body:readFileSync(file)});
  });
}
async function contained(page, selector) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no page overflow');
  for (const element of await page.locator(selector).all()) {
    if (!await element.isVisible()) continue;
    const r = await element.boundingBox();
    const width = page.viewportSize().width;
    assert.ok(r.x >= -1 && r.x + r.width <= width + 1, `${selector} fits at ${width}px`);
  }
}
const root=fileURLToPath(new URL('../web/',import.meta.url));
try{
  const page=await browser.newPage();
  await intercept(page,root,()=>({}));await page.goto('http://layout.test/');
  await page.evaluate(()=>window.DuneAddon={request:async(action)=>{if(action!=='players.summary.list')throw new Error('Unexpected action');return {capabilities:{},rows:[{name:'A_Long_Community_Character_Name',guild:'A_Long_Community_Guild_Name_Without_Spaces',faction:'Atreides',level:100}]};}});
  await page.getByRole('button',{name:'Load Players'}).click();
  await page.getByText('A_Long_Community_Character_Name',{exact:true}).waitFor();
  for(const [width,height]of sizes){
    await page.setViewportSize({width,height});await contained(page,'.card,.card h3,.card dd,.header button');
    assert.ok((await page.getByRole('button',{name:'Load Players'}).boundingBox()).height>=44,'touch-sized action');
  }
  console.log('PASS populated addon cards and touch controls at twelve viewport sizes');
}finally{await browser.close();}
