export async function analyticsSession(){
  try{
    const response=await fetch('/api/admin/session',{credentials:'same-origin',cache:'no-store'});
    if(!response.ok||!response.headers.get('Content-Type')?.includes('application/json'))return null;
    return await response.json();
  }catch{return null;}
}
export async function initAnalytics(onSession){
  const session=await analyticsSession();
  if(!session)return;
  onSession(Boolean(session.isAdmin));
  if(!session.isAdmin)fetch('/api/visit',{method:'POST',credentials:'same-origin',keepalive:true}).catch(()=>{});
}
