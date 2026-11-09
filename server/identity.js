import {createRemoteJWKSet,jwtVerify} from 'jose';
const keySets=new Map();
export function cookie(request,name){
  const value=(request.headers.get('Cookie')||'').split(';').map(part=>part.trim()).find(part=>part.startsWith(name+'='));
  return value?.slice(name.length+1)||null;
}
export function accessConfigured(env){return Boolean(env.ACCESS_TEAM_DOMAIN&&env.ACCESS_AUD&&env.ADMIN_EMAIL);}
export async function adminIdentity(request,env,keys){
  if(!accessConfigured(env))return null;
  const token=request.headers.get('Cf-Access-Jwt-Assertion')||cookie(request,'CF_Authorization');
  if(!token)return null;
  try{
    const issuer=new URL(env.ACCESS_TEAM_DOMAIN).origin;
    if(!issuer.startsWith('https://')||!new URL(issuer).hostname.endsWith('.cloudflareaccess.com'))return null;
    if(!keys){
      if(!keySets.has(issuer))keySets.set(issuer,createRemoteJWKSet(new URL('/cdn-cgi/access/certs',issuer)));
      keys=keySets.get(issuer);
    }
    const {payload}=await jwtVerify(token,keys,{issuer,audience:env.ACCESS_AUD,algorithms:['RS256'],requiredClaims:['email','sub','iat','exp']});
    return typeof payload.email==='string'&&payload.email.toLowerCase()===env.ADMIN_EMAIL.toLowerCase()?payload:null;
  }catch{return null;}
}
const encoder=new TextEncoder();
async function key(secret){return crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);}
function base64(bytes){return btoa(String.fromCharCode(...new Uint8Array(bytes))).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');}
export async function signVisitor(id,secret){
  const signature=await crypto.subtle.sign('HMAC',await key(secret),encoder.encode(id));
  return `${id}.${base64(signature)}`;
}
export async function visitorId(request,secret){
  if(!secret)return null;
  const value=cookie(request,'portfolio_visitor');if(!value)return null;
  const [id,signature,...extra]=value.split('.');
  if(extra.length||!/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/.test(id)||!signature||signature.length!==43)return null;
  try{
    const bytes=Uint8Array.from(atob(signature.replaceAll('-','+').replaceAll('_','/')+'='),char=>char.charCodeAt(0));
    return await crypto.subtle.verify('HMAC',await key(secret),bytes,encoder.encode(id))?id:null;
  }catch{return null;}
}
export function deviceInfo(ua,mobileHint){
  const device=/iPad|Tablet|Android(?!.*Mobile)/i.test(ua)?'Tablet':mobileHint==='?1'||/Mobi|iPhone|iPod/i.test(ua)?'Mobile':'Desktop';
  const browser=/Edg\//.test(ua)?'Edge':/OPR\//.test(ua)?'Opera':/Firefox\//.test(ua)?'Firefox':/Chrome\/|CriOS\//.test(ua)?'Chrome':/Safari\//.test(ua)?'Safari':'Other';
  const os=/iPhone|iPad|iPod/.test(ua)?'iOS':/Android/.test(ua)?'Android':/Windows/.test(ua)?'Windows':/Macintosh|Mac OS X/.test(ua)?'macOS':/Linux/.test(ua)?'Linux':'Other';
  return {device,browser,os};
}
