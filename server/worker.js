import {accessConfigured,adminIdentity,deviceInfo,signVisitor,visitorId} from './identity.js';
const headers={'Cache-Control':'no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'};
function json(data,status=200){return Response.json(data,{status,headers});}
export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(!url.pathname.startsWith('/api/'))return env.ASSETS.fetch(request);
    try{
      if(url.pathname==='/api/admin/session'&&request.method==='GET'){
        const identity=await adminIdentity(request,env);
        return json({isAdmin:Boolean(identity),configured:accessConfigured(env),...(identity?{email:identity.email}:{})});
      }
      if(url.pathname==='/api/visit'&&request.method==='POST'){
        if(request.headers.get('Origin')!==url.origin)return json({error:'Origin not allowed'},403);
        const ua=request.headers.get('User-Agent')||'';
        if(/bot|crawler|spider|headless|slurp|lighthouse|preview/i.test(ua)||await adminIdentity(request,env))return new Response(null,{status:204,headers});
        if(!env.DB||!env.ANALYTICS_SECRET)return json({error:'Analytics is not connected'},503);
        const existing=await visitorId(request,env.ANALYTICS_SECRET);
        const id=existing||crypto.randomUUID(),now=Date.now();
        const {device,browser,os}=deviceInfo(ua,request.headers.get('Sec-CH-UA-Mobile'));
        await env.DB.prepare(`INSERT INTO visitors(id,first_seen,last_seen,device,browser,os) VALUES(?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET last_seen=excluded.last_seen,device=excluded.device,browser=excluded.browser,os=excluded.os`).bind(id,now,now,device,browser,os).run();
        return new Response(null,{status:204,headers:{...headers,...(!existing?{'Set-Cookie':`portfolio_visitor=${await signVisitor(id,env.ANALYTICS_SECRET)}; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax`}:{})}});
      }
      if(url.pathname.startsWith('/api/admin/')){
        const identity=await adminIdentity(request,env);
        if(!identity)return json({error:'Sign in to access Admin'},401);
        if(request.method!=='GET')return json({error:'Method not allowed'},405);
        if(url.pathname==='/api/admin/login'){
          const id=await visitorId(request,env.ANALYTICS_SECRET);
          if(id&&env.DB)await env.DB.prepare('DELETE FROM visitors WHERE id=?').bind(id).run();
          return new Response(null,{status:303,headers:{...headers,Location:'/'}});
        }
        if(url.pathname==='/api/admin/visitors'){
          if(!env.DB)return json({error:'Visitor history is not connected'},503);
          const page=Number(url.searchParams.get('page')||1),limit=50;
          if(!Number.isSafeInteger(page)||page<1||page>10000)return json({error:'Invalid page'},400);
          const results=await env.DB.batch([
            env.DB.prepare('SELECT COUNT(*) AS total FROM visitors'),
            env.DB.prepare('SELECT first_seen,last_seen,device,browser,os FROM visitors ORDER BY first_seen DESC,id LIMIT ? OFFSET ?').bind(limit,(page-1)*limit),
          ]);
          return json({totalVisitors:results[0].results[0].total,visitors:results[1].results,page,limit});
        }
      }
      return json({error:'Not found'},404);
    }catch(error){
      console.error('Portfolio API failed',error.name);
      return json({error:'Unable to load analytics right now'},503);
    }
  },
};
