import {analyticsSession} from './analytics';
const date=value=>new Date(value).toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'});
export async function mountAdmin(app){
  app.innerHTML=`<section class="admin-screen screen"><header><p class="admin-eyebrow">PRIVATE · ADMIN</p><h1 tabindex="-1">Visitor history</h1></header><div class="admin-body"><p role="status">Loading your visitor history…</p></div><nav class="admin-actions"><button data-action="home">Done</button></nav></section>`;
  const screen=app.querySelector('.admin-screen'),body=screen.querySelector('.admin-body');
  screen.querySelector('h1').focus({preventScroll:true});
  const session=await analyticsSession();if(!screen.isConnected)return;
  if(!session?.isAdmin){
    body.innerHTML=`<div class="admin-empty"><h2>Private dashboard</h2><p>${session?.configured?'Sign in to view your visitor history.':'Private analytics is not connected yet.'}</p>${session?.configured?'<a class="button" href="/api/admin/login">Sign in to Admin</a>':''}</div>`;
    return;
  }
  body.innerHTML=`<div class="admin-toolbar"><span>Newest visitors first</span><div><button class="admin-refresh">Refresh</button><a class="button" href="/cdn-cgi/access/logout">Sign out</a></div></div><div class="admin-history" aria-live="polite"></div><div class="admin-summary"><span>Unique visitors</span><strong>—</strong><p>Each browser is counted once. Returning visits update the latest visit. Your signed-in visits are excluded.</p></div><nav class="admin-pages" aria-label="Visitor history pages"><button class="admin-previous" disabled>Previous</button><span>Page 1</span><button class="admin-next" disabled>Next</button></nav><p class="admin-footnote">Counts start when tracking is enabled. A different browser or cleared browser data can count as another visitor. Device information is reported by the browser.</p>`;
  let page=1,busy=false;
  const history=body.querySelector('.admin-history'),count=body.querySelector('.admin-summary strong'),previous=body.querySelector('.admin-previous'),next=body.querySelector('.admin-next'),refresh=body.querySelector('.admin-refresh');
  async function load(target){
    if(busy)return;
    busy=true;refresh.disabled=true;previous.disabled=true;next.disabled=true;history.setAttribute('aria-busy','true');
    try{
      const response=await fetch(`/api/admin/visitors?page=${target}`,{credentials:'same-origin',cache:'no-store'});
      if(!response.ok)throw new Error(response.status===401?'Your session has expired. Sign in again.':'Visitor history could not load. Please try Refresh.');
      const data=await response.json();if(!screen.isConnected)return;
      page=target;count.textContent=Number(data.totalVisitors).toLocaleString();history.replaceChildren();
      if(!data.visitors.length){const empty=document.createElement('p');empty.className='admin-empty';empty.textContent='No visitors yet. New visitors will appear here.';history.append(empty);}
      else{
        const table=document.createElement('table');table.innerHTML='<thead><tr><th scope="col">First visit</th><th scope="col">Latest visit</th><th scope="col">Device</th><th scope="col">Browser</th><th scope="col">System</th></tr></thead><tbody></tbody>';
        for(const visitor of data.visitors){
          const row=document.createElement('tr');
          for(const value of [date(visitor.first_seen),date(visitor.last_seen),visitor.device,visitor.browser,visitor.os]){const cell=document.createElement('td');cell.textContent=value;row.append(cell);}
          table.tBodies[0].append(row);
        }
        history.append(table);
      }
      previous.disabled=page<=1;next.disabled=page*data.limit>=data.totalVisitors;
      body.querySelector('.admin-pages span').textContent=`Page ${page}`;
    }catch(error){
      if(!screen.isConnected)return;
      const message=document.createElement('p');message.className='admin-empty';message.setAttribute('role','alert');message.textContent=error.message;history.replaceChildren(message);
    }finally{busy=false;refresh.disabled=false;history.removeAttribute('aria-busy');}
  }
  refresh.addEventListener('click',()=>load(1));previous.addEventListener('click',()=>load(page-1));next.addEventListener('click',()=>load(page+1));
  await load(1);
}
