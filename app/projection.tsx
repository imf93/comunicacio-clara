"use client";
import {useEffect,useRef,useState} from 'react';
import CorporateHeader from './corporate';
type Option={id:string,label:string,count:number};
export default function Projection({question,options,link}:{question:string,options:Option[],link:string}){
return <section className="corporate-projection" id="projection"><CorporateHeader/><h2 className="projection-question">{question}</h2><div className="projection-content"><WordCloud options={options}/><aside className="projection-qr"><p className="qr-callout">PARTICIPA</p><img src={'/api/qr?text='+encodeURIComponent(link)} alt="Codi QR per participar" width="220" height="220"/></aside></div></section>;
}
export function WordCloud({options}:{options:Option[]}){
const ref=useRef<HTMLDivElement>(null);const [box,setBox]=useState({width:1000,height:530});
useEffect(()=>{if(!ref.current)return;const observer=new ResizeObserver(([entry])=>{const {width,height}=entry.contentRect;if(width&&height)setBox({width,height})});observer.observe(ref.current);return()=>observer.disconnect()},[]);
const selected=options.filter(o=>o.count>0).sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label,'ca'));
const canvas=typeof document!=='undefined'?document.createElement('canvas'):null;
const context=canvas?.getContext('2d');const max=Math.max(1,...selected.map(o=>o.count));
const width=1000,height=Math.max(360,1000*box.height/Math.max(1,box.width));
let placed:Array<Option&{x:number,y:number,size:number}>= [];
for(let scale=1;scale>=.01;scale*=.9){
let rows:Array<Array<Option&{w:number,h:number,size:number}>>=[[]],used=0;let tooWide=false;
for(const word of selected){const size=(22+76*Math.sqrt(word.count/max))*scale;if(context)context.font='700 '+size+'px Arial';const w=(context?.measureText(word.label).width||word.label.length*size*.6)+18*scale;if(w>width-24)tooWide=true;const h=size*1.3+14*scale;if(used+w>width-24&&rows.at(-1)!.length){rows.push([]);used=0}rows.at(-1)!.push({...word,w,h,size});used+=w;}
const rowHeights=rows.map(row=>Math.max(0,...row.map(w=>w.h)));const totalHeight=rowHeights.reduce((a,b)=>a+b,0);
if(tooWide||totalHeight>height-24)continue;
let y=(height-totalHeight)/2;placed=[];rows.forEach((row,i)=>{let x=(width-row.reduce((n,w)=>n+w.w,0))/2;for(const word of row){placed.push({...word,x:x+word.w/2,y:y+rowHeights[i]/2,size:word.size});x+=word.w}y+=rowHeights[i]});break;
}
return <div className="corporate-cloud" ref={ref} aria-label="Núvol de paraules"><svg viewBox={'0 0 '+width+' '+height} role="img" aria-label={selected.length?selected.map(o=>o.label+': '+o.count+(o.count===1?' vot':' vots')).join('; '):'Núvol de paraules sense respostes'}>{placed.map((word,i)=><text key={word.id} x={word.x} y={word.y} textAnchor="middle" dominantBaseline="central" fontFamily="Arial, sans-serif" fontWeight="700" fontSize={word.size} fill={['#1a73e8','#2d5596','#17457c','#4c82c5'][i%4]}><title>{word.label}: {word.count} {word.count===1?'vot':'vots'}</title>{word.label}</text>)}</svg></div>
}

