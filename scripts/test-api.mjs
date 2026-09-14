import assert from 'node:assert/strict';import{readFileSync,writeFileSync}from'node:fs';
const base='http://127.0.0.1:4173';
let passed=0;function ok(v,name){assert.ok(v,name);passed++;console.log('OK '+name)}
const login=await fetch(base+'/signin-with-chatgpt',{method:'POST',redirect:'manual',body:new URLSearchParams({password:readFileSync('.local/admin-key','utf8').trim()})});
const admin=login.headers.get('set-cookie').split(';')[0];
async function req(path,method='GET',body,cookie=admin,extra={}){const r=await fetch(base+path,{method,headers:{cookie,...(body?{'Content-Type':'application/json'}:{}),...extra},body:body?JSON.stringify(body):undefined});let data;try{data=await r.clone().json()}catch{}return{r,data};}
ok((await req('/api/sessions','GET',null,'',{'oai-authenticated-user-id':'local-owner'})).r.status===401,'Rechazo de acceso anónimo y cabeceras falsificadas');
ok((await req('/api/sessions','POST',{title:'x',question:'x',options:['A','a']})).r.status===400,'Opciones duplicadas rechazadas');
let {data:d}=await req('/api/sessions','POST',{title:'PRUEBA AUTOMÁTICA',question:'¿Qué opción eliges?',options:['Confianza','Comunicación','=SUM(1+1)','Sin votos']});
const id=d.session.id;
ok(d.session.status==='draft','Creación en borrador');
ok((await req('/api/sessions/'+id,'PATCH',{title:'PRUEBA AUTOMÁTICA',question:'¿Qué hace que un equipo funcione?',options:['Confianza','Comunicación','=SUM(1+1)','Sin votos']})).r.ok,'Edición de borrador');
let detail=(await req('/api/sessions/'+id)).data;const opts=detail.options;
const visitor=await req('/api/vote/'+id,'GET',null,'');const cookie=visitor.r.headers.get('set-cookie').split(';')[0];
ok(visitor.data.session.owner_id===undefined&&visitor.data.options.every(o=>o.count===undefined),'Participantes sin acceso a identidad ni resultados privados');
ok((await req('/api/vote/'+id,'POST',{optionId:opts[0].id},cookie)).r.status===409,'No votar antes de abrir');
await req('/api/sessions/'+id,'PATCH',{status:'open'});
ok((await req('/api/vote/'+id,'POST',{optionId:'invalid'},cookie)).r.status===400,'Opción ajena rechazada');
const dup=await Promise.all(Array.from({length:10},()=>req('/api/vote/'+id,'POST',{optionId:opts[0].id},cookie)));
ok(dup.every(x=>x.r.ok)&&(await req('/api/sessions/'+id)).data.session.total===1,'Diez reintentos simultáneos cuentan un solo voto');
await Promise.all(Array.from({length:24},async(_,i)=>{const v=await req('/api/vote/'+id,'GET',null,'');const c=v.r.headers.get('set-cookie').split(';')[0];return req('/api/vote/'+id,'POST',{optionId:opts[i%2].id},c)}));
detail=(await req('/api/sessions/'+id)).data;
ok(detail.session.total===25&&detail.options.reduce((n,o)=>n+o.count,0)===25,'24 participantes simultáneos sin pérdida de votos');
ok((await req('/api/vote/'+id,'GET',null,cookie)).data.voted,'Voto recordado por el servidor');
ok((await req('/api/sessions/'+id,'PATCH',{title:'x',question:'x',options:['A','B']})).r.status===409,'Opciones bloqueadas tras abrir');
ok((await req('/api/sessions/'+id,'PATCH',{status:'closed'},admin,{origin:'https://otro.example'})).r.status===403,'Protección de origen en cambios');
await req('/api/sessions/'+id,'PATCH',{status:'closed'});
const fresh=await req('/api/vote/'+id,'GET',null,'');ok((await req('/api/vote/'+id,'POST',{optionId:opts[0].id},fresh.r.headers.get('set-cookie').split(';')[0])).r.status===409,'Votación cerrada rechaza nuevos votos');
const csv=await fetch(base+'/api/sessions/'+id+'?export=csv',{headers:{cookie:admin}});const text=await csv.text();
ok(text.includes('Sin votos";"0";"0.00')&&text.includes("'=SUM")&&text.includes('Comunicación'),'CSV conserva ceros, acentos y neutraliza fórmulas');
ok((await req('/api/sessions/'+id+'?export=csv','GET',null,'')).r.status===401,'Exportación privada');
const qr=await fetch(base+'/api/qr?text='+encodeURIComponent(base+'/v/'+id));ok(qr.ok&&(await qr.text()).includes('<svg'),'QR SVG generado');
writeFileSync('.local/test-session.json',JSON.stringify({id,total:25,passed}));console.log(passed+' pruebas superadas.');

