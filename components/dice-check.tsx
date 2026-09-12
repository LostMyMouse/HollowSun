'use client';
import {useEffect,useRef,useState} from 'react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import type {Roll} from '@/lib/game';

export function DiceCheck({roll,onComplete}:{roll:Roll;onComplete:()=>void}){
 const [revealed,setRevealed]=useState(false);
 const complete=useRef(onComplete);complete.current=onComplete;
 useEffect(()=>{const timer=setTimeout(()=>setRevealed(true),window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:1200);return()=>clearTimeout(timer);},[]);
 useEffect(()=>{const key=(event:KeyboardEvent)=>{if(!['Space','Enter'].includes(event.code))return;event.preventDefault();event.stopImmediatePropagation();if(event.repeat)return;if(revealed)complete.current();else setRevealed(true);};window.addEventListener('keydown',key,true);return()=>window.removeEventListener('keydown',key,true);},[revealed]);
 const advance=()=>revealed?complete.current():setRevealed(true);
 return <Dialog open onOpenChange={open=>{if(!open)advance();}}><DialogContent className={`dice-check ${revealed?'revealed':'rolling'} ${roll.success?'passed':'missed'}`} onPointerDownOutside={event=>event.preventDefault()}>
 <span className="eyebrow">{roll.skill==='Combat'?'ATTACK CHECK':'SKILL CHECK'}</span>
 <DialogTitle>{roll.skill}</DialogTitle>
 <DialogDescription>Difficulty <strong>{roll.dc}</strong> · Roll a d20 and add your bonus.</DialogDescription>
 <div className="dice-stage" aria-hidden="true"><div className="dice-orbit"/><div className="hero-die"><svg viewBox="0 0 200 220"><path d="M100 4 190 57 190 163 100 216 10 163 10 57Z M100 4 48 82 152 82 100 4 M10 57 48 82 10 163 100 174 190 163 152 82 190 57 M48 82 100 174 152 82 M100 174 100 216"/></svg><span>{revealed?roll.die:'✦'}</span></div></div>
 <div className="dice-result" role="status" aria-live="polite">{revealed?<><p className="dice-equation">{roll.die} <span>{roll.bonus<0?'−':'+'} {Math.abs(roll.bonus)}</span> = <strong>{roll.die+roll.bonus}</strong></p><h3>{roll.success?'SUCCESS':'CHECK FAILED'}</h3><p>{roll.die+roll.bonus} {roll.success?'meets':'falls short of'} difficulty {roll.dc}</p></>:<><h3>ROLLING…</h3><p>Your bonus: {roll.bonus>=0?'+':''}{roll.bonus}</p></>}</div>
 <Button onClick={advance}>{revealed?'Continue':'Reveal result'} <span className="dice-key">Space</span></Button>
 </DialogContent></Dialog>;
}
