import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {generateKeyPair,exportJWK,SignJWT} from 'jose';
import worker from '../server/worker.js';
import {adminIdentity,deviceInfo,signVisitor,visitorId} from '../server/identity.js';
const origin='https://andybdo.com',issuer='https://portfolio-test.cloudflareaccess.com';
const settings={ACCESS_TEAM_DOMAIN:issuer,ACCESS_AUD:'test-audience',ADMIN_EMAIL:'doa12967@gmail.com',ANALYTICS_SECRET:'local-test-secret-that-is-never-used-in-production'};
let privateKey,originalFetch;
before(async()=>{
  const keys=await generateKeyPair('RS256');privateKey=keys.privateKey;
  const jwk=await exportJWK(keys.publicKey);jwk.kid='test';jwk.alg='RS256';
  originalFetch=globalThis.fetch;
  globalThis.fetch=async(input,options)=>String(input)===issuer+'/cdn-cgi/access/certs'?Response.json({keys:[jwk]}):originalFetch(input,options);
});
after(()=>{globalThis.fetch=originalFetch;});
async function token(email=settings.ADMIN_EMAIL,options={}){
  return new SignJWT({email}).setProtectedHeader({alg:'RS256',kid:'test'}).setSubject('test-user').setIssuer(options.issuer||issuer).setAudience(options.audience||settings.ACCESS_AUD).setIssuedAt().setExpirationTime(options.expires||'1h').sign(privateKey);
}
function database(){
  const db=new DatabaseSync(':memory:');db.exec(readFileSync(new URL('../migrations/0001_visitors.sql',import.meta.url),'utf8'));
  return {db,binding:{prepare(sql){const statement=db.prepare(sql);const bound=values=>({run:async()=>statement.run(...values),all:async()=>({results:statement.all(...values)})});return {...bound([]),bind:(...values)=>bound(values)};},batch:async statements=>Promise.all(statements.map(s=>s.all()))}};
}
const agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/145.0.0.0 Safari/537.36';
function visit(cookieValue,more={}){return new Request(origin+'/api/visit',{method:'POST',headers:{Origin:origin,'User-Agent':agent,...(cookieValue?{Cookie:cookieValue}:{}),...more}});}

test('anonymous and forged sessions cannot read viewer history',async()=>{
  for(const cookie of ['', 'CF_Authorization=forged.token.value']){
    const response=await worker.fetch(new Request(origin+'/api/admin/visitors',{headers:{Cookie:cookie}}),settings);
    assert.equal(response.status,401);assert.equal(response.headers.get('Cache-Control'),'no-store');
  }
  const response=await worker.fetch(new Request(origin+'/api/admin/session'),settings);
  assert.deepEqual(await response.json(),{isAdmin:false,configured:true});
});

test('only the allowlisted email with a valid signed, unexpired application token is accepted',async()=>{
  const valid=await token();assert.equal((await adminIdentity(new Request(origin,{headers:{Cookie:'CF_Authorization='+valid}}),settings)).email,settings.ADMIN_EMAIL);
  for(const jwt of [await token('other@example.com'),await token(settings.ADMIN_EMAIL,{audience:'another-app'}),await token(settings.ADMIN_EMAIL,{issuer:'https://other.cloudflareaccess.com'}),await token(settings.ADMIN_EMAIL,{expires:'-1h'}),valid.slice(0,-10)+'bad-signature']){
    assert.equal(await adminIdentity(new Request(origin,{headers:{'Cf-Access-Jwt-Assertion':jwt}}),settings),null);
  }
});

test('returning browsers update history without increasing the unique count',async()=>{
  const {db,binding}=database(),env={...settings,DB:binding};
  const first=await worker.fetch(visit(),env);assert.equal(first.status,204);
  const cookie=first.headers.get('Set-Cookie');assert.match(cookie,/HttpOnly; Secure; SameSite=Lax/);
  assert.equal((await worker.fetch(visit(cookie.split(';')[0]),env)).status,204);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM visitors').get().n,1);
  assert.equal((await worker.fetch(visit(null,{'User-Agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Version/18.0 Mobile/15E148 Safari/604.1'}),env)).status,204);
  const response=await worker.fetch(new Request(origin+'/api/admin/visitors',{headers:{'Cf-Access-Jwt-Assertion':await token()}}),env);
  const data=await response.json();assert.equal(data.totalVisitors,2);assert.equal(data.visitors.length,2);
  assert.ok(data.visitors.some(v=>v.device==='Mobile'&&v.browser==='Safari'));
  assert.ok(data.visitors.every(v=>!('id' in v)));db.close();
});

test('visitor cookies reject tampering instead of trusting a supplied identifier',async()=>{
  const id=crypto.randomUUID(),signed=await signVisitor(id,settings.ANALYTICS_SECRET);
  assert.equal(await visitorId(new Request(origin,{headers:{Cookie:'portfolio_visitor='+signed}}),settings.ANALYTICS_SECRET),id);
  assert.equal(await visitorId(new Request(origin,{headers:{Cookie:'portfolio_visitor='+signed.replace(id,crypto.randomUUID())}}),settings.ANALYTICS_SECRET),null);
});

test('cross-site writes, bots, and signed-in owner visits do not create visitor records',async()=>{
  const {db,binding}=database(),env={...settings,DB:binding};
  assert.equal((await worker.fetch(visit(null,{Origin:'https://other.example'}),env)).status,403);
  assert.equal((await worker.fetch(visit(null,{'User-Agent':'Googlebot'}),env)).status,204);
  assert.equal((await worker.fetch(visit(null,{'Cf-Access-Jwt-Assertion':await token()}),env)).status,204);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM visitors').get().n,0);db.close();
});

test('signing in removes the owner browser’s earlier anonymous entry',async()=>{
  const {db,binding}=database(),env={...settings,DB:binding};const response=await worker.fetch(visit(),env);
  const login=await worker.fetch(new Request(origin+'/api/admin/login',{headers:{Cookie:response.headers.get('Set-Cookie').split(';')[0],'Cf-Access-Jwt-Assertion':await token()}}),env);
  assert.equal(login.status,303);assert.equal(login.headers.get('Location'),'/');assert.equal(db.prepare('SELECT COUNT(*) AS n FROM visitors').get().n,0);db.close();
});

test('browser/device classification and invalid pagination are bounded',async()=>{
  assert.deepEqual(deviceInfo(agent),{device:'Desktop',browser:'Chrome',os:'Windows'});
  assert.equal(deviceInfo('Mozilla/5.0 (Linux; Android 14; Tablet) Chrome/145 Safari/537').device,'Tablet');
  const {db,binding}=database();const response=await worker.fetch(new Request(origin+'/api/admin/visitors?page=-1',{headers:{'Cf-Access-Jwt-Assertion':await token()}}),{...settings,DB:binding});
  assert.equal(response.status,400);db.close();
});
