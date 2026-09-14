import {env} from 'cloudflare:workers';
import {requests} from './request-context';
export class HttpError extends Error { constructor(public status:number,message:string){super(message)} }
export function db(){if(!env.DB)throw new HttpError(503,'El almacenamiento no está disponible. Inténtalo de nuevo.');return env.DB;}
export async function owner(){const u=requests.getStore()?.headers.get('oai-authenticated-user-id');if(!u)throw new HttpError(401,'Inicia sesión para continuar.');return u;}
export function json(value:unknown,status=200){return Response.json(value,{status,headers:{'Cache-Control':'no-store'}})}
export async function safe(action:()=>Promise<Response>){try{return await action()}catch(e){if(e instanceof HttpError)return json({error:e.message},e.status);console.error('Request failed',e);return json({error:'No se ha podido guardar o recuperar la información. Inténtalo de nuevo.'},503)}}
export async function body(request:Request){const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)throw new HttpError(403,'Origen no permitido.');if(!request.headers.get('content-type')?.includes('application/json'))throw new HttpError(415,'Se requiere JSON.');const text=await request.text();if(text.length>10000)throw new HttpError(413,'La solicitud es demasiado grande.');try{return JSON.parse(text)}catch{throw new HttpError(400,'Datos no válidos.')}}
export function validate(p:any){if(typeof p.title!=='string'||!p.title.trim()||p.title.trim().length>100||typeof p.question!=='string'||!p.question.trim()||p.question.trim().length>200||!Array.isArray(p.options)||p.options.length<2||p.options.length>100||p.options.some((x:unknown)=>typeof x!=='string'||!x.trim()||x.trim().length>40))throw new HttpError(400,'Introduce título, pregunta y entre 2 y 100 opciones de hasta 40 caracteres.');const options=p.options.map((s:string)=>s.trim());if(new Set(options.map((s:string)=>s.toLocaleLowerCase('es'))).size!==options.length)throw new HttpError(400,'Las opciones no pueden repetirse.');return {title:p.title.trim(),question:p.question.trim(),options};}
export async function session(id:string,user?:string){const s=await db().prepare('SELECT s.*, (SELECT COUNT(*) FROM votes WHERE session_id=s.id) AS total FROM sessions s WHERE s.id=?'+(user?' AND s.owner_id=?':'')).bind(...(user?[id,user]:[id])).first<any>();if(!s)throw new HttpError(404,'No se ha encontrado esta sesión.');return s;}
export async function options(id:string){const r=await db().prepare('SELECT o.id,o.label,COUNT(v.id) AS count FROM options o LEFT JOIN votes v ON v.option_id=o.id WHERE o.session_id=? GROUP BY o.id ORDER BY o.position').bind(id).all();return r.results;}
export function publicSession(s:any){const {owner_id,...rest}=s;return rest;}


