import assert from 'node:assert/strict';import{readFileSync}from'node:fs';
const base='http://127.0.0.1:4173';const r=await fetch(base+'/signin-with-chatgpt',{method:'POST',redirect:'manual',body:new URLSearchParams({password:readFileSync('.local/admin-key','utf8').trim()})});const cookie=r.headers.get('set-cookie').split(';')[0];
const words=Array.from({length:100},(_,i)=>'Opció '+(i+1));
const response=await fetch(base+'/api/sessions',{method:'POST',headers:{cookie,'Content-Type':'application/json'},body:JSON.stringify({title:'Prova de 100 opcions',question:'Quina paraula tries?',options:words})});assert.equal(response.status,201);const created=await response.json();const detail=await(await fetch(base+'/api/sessions/'+created.session.id,{headers:{cookie}})).json();assert.equal(detail.options.length,100);
const invalid=await fetch(base+'/api/sessions',{method:'POST',headers:{cookie,'Content-Type':'application/json'},body:JSON.stringify({title:'Límit',question:'Pregunta',options:[...words,'Opció 101']})});assert.equal(invalid.status,400);
for(const path of ['/ajuntament.png','/comunicacio-referencia.png'])assert.equal((await fetch(base+path)).status,200);
console.log('Correcte: 100 opcions desades, 101 rebutjades, dos logotips disponibles.');
