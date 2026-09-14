"use client";
import {useEffect,useState} from 'react';
import {CheckCircle2} from 'lucide-react';
import CorporateHeader from '../../corporate';
import {RadioGroup,RadioGroupItem} from '@/components/ui/radio-group';
export default function Vote({id}:{id:string}){
 const [data,setData]=useState<any>(null),[choice,setChoice]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>{let stopped=false;async function load(){try{const r=await fetch('/api/vote/'+id);const d:any=await r.json();if(!r.ok)throw Error(d.error);if(!stopped){setData(d);setError('')}}catch(e){if(!stopped)setError((e as Error).message)}}void load();const timer=setInterval(load,5000);return()=>{stopped=true;clearInterval(timer)}},[id]);
 async function vote(){setBusy(true);setError('');try{const r=await fetch('/api/vote/'+id,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({optionId:choice})});const d:any=await r.json();if(!r.ok)throw Error(d.error);setData((old:any)=>({...old,voted:true}));}catch(e){setError((e as Error).message)}finally{setBusy(false)}}
 return <><CorporateHeader/><main className="votecontainer">{error&&<p role="alert" className="notice">{error}</p>}{!data?<p>Carregant la pregunta…</p>:data.voted?<div className="success"><CheckCircle2 size={60}/><h1>Resposta enviada</h1><p>La teva resposta s’ha desat.</p><p className="muted">Pots seguir els resultats a la pantalla.</p></div>:<><p className="eyebrow">{data.session.title}</p><h1>{data.session.question}</h1>{data.session.status!=='open'?<p className="notice">{data.session.status==='draft'?'La votació encara no ha començat. La pantalla s’actualitzarà automàticament.':'La votació està tancada.'}</p>:<><p className="muted">Tria una opció.</p><RadioGroup value={choice} onValueChange={setChoice} aria-label="Opcions de resposta" disabled={busy}>{data.options.map((o:any)=><label className="voteoption" key={o.id}><RadioGroupItem value={o.id}/><span>{o.label}</span></label>)}</RadioGroup><button className="primary" onClick={vote} disabled={!choice||busy}>{busy?'Desant la resposta…':'Envia la resposta'}</button><p className="muted" style={{textAlign:'center',marginTop:20}}>Una resposta per navegador. No et demanem el nom.</p></>}</>}</main></>
}

