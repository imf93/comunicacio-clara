import{env}from'cloudflare:workers';
import{requests}from'../lib/request-context';
import * as sessions from '../app/api/sessions/route';
import * as detail from '../app/api/sessions/[id]/route';
import * as vote from '../app/api/vote/[id]/route';
import * as qr from '../app/api/qr/route';
export default {async fetch(request:Request){return requests.run(request,async()=>{
const url=new URL(request.url),path=url.pathname,method=request.method;
if(path==='/api/sessions'){if(method==='GET')return sessions.GET();if(method==='POST')return sessions.POST(request);}
let match=path.match(/^\/api\/sessions\/([^/]+)$/);
if(match){const c={params:Promise.resolve({id:match[1]})};if(method==='GET')return detail.GET(request,c);if(method==='PATCH')return detail.PATCH(request,c);}
match=path.match(/^\/api\/vote\/([^/]+)$/);
if(match){const c={params:Promise.resolve({id:match[1]})};if(method==='GET')return vote.GET(request,{params:Promise.resolve({id:match[1]})});if(method==='POST')return vote.POST(request,c);}
if(path==='/api/qr'&&method==='GET')return qr.GET(request);
if(path.startsWith('/api/'))return Response.json({error:'Ruta o método no permitido.'},{status:404});
if(path==='/'||/^\/v\/[^/]+$/.test(path))return (env as any).ASSETS.fetch(new Request(new URL('/index.html',request.url),request));
return (env as any).ASSETS.fetch(request);
})}};



