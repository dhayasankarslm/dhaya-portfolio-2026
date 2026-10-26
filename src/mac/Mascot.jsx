import React,{useRef,useState,useEffect} from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
gsap.registerPlugin(useGSAP);
const lines={home:'Hey, I’m Dhaya. This is my desktop. The tabs are mostly under control.',work:'These folders hold a bit of everything: brands, products, and some very good questions.',about:'Plot twist: I started with physics. I kept the curiosity. Changed the canvas.',photos:'I take the long way home. There’s usually a photograph hiding somewhere.',extras:'Music, films, books, bike trips. Curiosity doesn’t really clock out.',arcade:'My shift as your tour guide ends here. My shift as a game character is about to start.'};
export function Caricature({expression='smile'}){return <span className="mascot-sprite" data-expression={expression} aria-hidden="true"/>;}
export function Mascot({scene,progressRef,gameMotion,gameActive,visible=true}){
 const host=useRef(null),props=useRef({scene,gameActive}),[expression,setExpression]=useState('smile'),[speech,setSpeech]=useState(lines.home),[talking,setTalking]=useState(true);
 const pointer=useRef({x:-1000,y:-1000}),current=useRef({x:300,y:500,face:1}),lastReact=useRef(0),expiry=useRef(0),expressionRef=useRef(expression),talkUntil=useRef(performance.now()+4500),lastScene=useRef(''),lastEvent=useRef(-1);
 props.current={scene,gameActive};expressionRef.current=expression;
 useEffect(()=>{if(lastScene.current===scene)return;lastScene.current=scene;setSpeech(lines[scene]||lines.home);setTalking(true);talkUntil.current=performance.now()+6000;setExpression(scene==='about'?'think':scene==='arcade'?'surprise':'smile');expiry.current=performance.now()+2400;},[scene]);
 useGSAP(()=>{
  const el=host.current;if(!el)return;const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let previous=performance.now(),blinkAt=previous+3500,blinkUntil=0,randomAt=previous+5000;
  const move=e=>{pointer.current={x:e.clientX,y:e.clientY};};
  const leave=()=>{pointer.current={x:-1000,y:-1000};};
  const hint=e=>{const text=e.target.closest?.('[data-mascot-hint]')?.dataset.mascotHint;if(text&&performance.now()-lastReact.current>5000){lastReact.current=performance.now();setSpeech(text);setTalking(true);talkUntil.current=performance.now()+4000;setExpression('think');expiry.current=performance.now()+1800;}};
  window.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerleave',leave);document.addEventListener('pointerover',hint,{passive:true});
  const tick=()=>{
   if(document.hidden||!visible)return;const now=performance.now(),dt=Math.min((now-previous)/1000,.05);previous=now;const {scene:stage,gameActive:inGame}=props.current;
   const small=innerWidth<650;let size=small?82:105,tx,ty,walking=false,face=current.current.face;
   const live=gameMotion.current;
   if(inGame&&live){size=68;tx=live.x;ty=live.y;walking=Math.abs(live.vx)>12;face=live.vx< -2?-1:live.vx>2?1:face;if(lastEvent.current!==live.eventId){lastEvent.current=live.eventId;setExpression(live.phase==='won'?'laugh':live.phase==='lost'?'surprise':live.event==='hurt'?'surprise':live.event==='jump'?'jump':'smile');}}
   else{
    const panel=document.querySelector(`#${stage} [data-character-path]`),rect=panel?.getBoundingClientRect(),p=progressRef.current[stage]??0;
    if(stage==='home'&&rect){tx=small?innerWidth-100:innerWidth*.16;ty=small?innerHeight-190:innerHeight-50-size;}
    else if(stage==='arcade'){const r=document.querySelector('.game-stage')?.getBoundingClientRect();tx=r?r.left+45:40;ty=r?r.bottom-size-64:innerHeight-size-100;}
    else if(rect){const margin=small?12:28;tx=rect.left+margin+(rect.width-size*.8-margin*2)*(.12+.7*p);ty=rect.top-size+3;}
    else{tx=innerWidth*.6;ty=innerHeight-size-130;}
    tx=Math.max(12,Math.min(innerWidth-size*.8-12,tx));ty=Math.max(small?42:65,Math.min(innerHeight-size-(small?158:85),ty));
    const dx=tx-current.current.x;walking=Math.abs(dx)>3;face=dx< -2?-1:dx>2?1:face;
    if(!reduce.matches){current.current.x+=Math.sign(dx)*Math.min(Math.abs(dx),dt*330);current.current.y+=(ty-current.current.y)*Math.min(1,dt*9);}else{current.current.x=tx;current.current.y=ty;walking=false;}
   }
   if(inGame&&live){current.current.x=tx;current.current.y=ty;}
   current.current.face=face;el.style.transform=`translate3d(${current.current.x}px,${current.current.y}px,0)`;el.style.width=`${size*.75}px`;el.style.height=`${size}px`;el.dataset.facing=String(face);el.dataset.walking=String(walking&&!reduce.matches);el.dataset.game=String(inGame);el.dataset.bubbleSide=current.current.x>innerWidth-270?'left':'right';el.dataset.bubbleBelow=String(current.current.y<160);
   const px=pointer.current.x-(current.current.x+size*.4),py=pointer.current.y-(current.current.y+size*.25),distance=Math.hypot(px,py);
   el.style.setProperty('--mascot-lean',`${pointer.current.x>0?Math.max(-3,Math.min(3,px/170)):0}deg`);el.style.setProperty('--walk-frame',Math.floor(now/165)%2?'33.333%':'66.666%');el.style.setProperty('--sprite-bob',`${walking&&!reduce.matches?Math.abs(Math.sin(now/150))*-3:0}px`);el.style.setProperty('--gaze-x',`${Math.max(-4,Math.min(4,px/60*face))}px`);el.style.setProperty('--gaze-y',`${Math.max(-2.5,Math.min(2.5,py/90))}px`);
   el.style.setProperty('--head-tilt',`${pointer.current.x>0?Math.max(-6,Math.min(6,px/100*face)):0}deg`);
   const cycle=now/1000*13;el.style.setProperty('--leg-left',`${walking&&!reduce.matches?Math.sin(cycle)*23:0}deg`);el.style.setProperty('--leg-right',`${walking&&!reduce.matches?-Math.sin(cycle)*23:0}deg`);el.style.setProperty('--arm-left',`${walking&&!reduce.matches?-Math.sin(cycle)*18:expressionRef.current==='surprise'?-110:expressionRef.current==='think'?135:3}deg`);el.style.setProperty('--arm-right',`${walking&&!reduce.matches?Math.sin(cycle)*18:expressionRef.current==='laugh'?-80:expressionRef.current==='surprise'?110:-4}deg`);el.style.setProperty('--bob',`${walking&&!reduce.matches?Math.abs(Math.sin(cycle))*-2:0}px`);
   if(!reduce.matches&&now>blinkAt){blinkUntil=now+135;blinkAt=now+2800+Math.random()*4600;}el.style.setProperty('--blink',now<blinkUntil?'.07':'1');
   const isTalk=now<talkUntil.current&&!inGame;el.style.setProperty('--talk',isTalk&&!reduce.matches?String(.88+Math.sin(now/90)*.14):'1');if(!isTalk)setTalking(previous=>previous?false:previous);
   if(!inGame&&distance<85&&now-lastReact.current>3300){lastReact.current=now;setExpression('surprise');expiry.current=now+1200;setSpeech('Personal space? Never heard of it.');setTalking(true);talkUntil.current=now+2400;}
   else if(!inGame&&now>expiry.current&&expiry.current>0){setExpression('smile');expiry.current=0;}
   if(!inGame&&now>randomAt&&!reduce.matches){randomAt=now+4300+Math.random()*6000;if(now>expiry.current){setExpression(['smile','think','laugh','sleep'][Math.floor(Math.random()*4)]);expiry.current=now+1200+Math.random()*900;}}
  };
  gsap.ticker.add(tick);return()=>{gsap.ticker.remove(tick);window.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',leave);document.removeEventListener('pointerover',hint);};
 },{scope:host,dependencies:[visible]});
 if(!visible)return null;
 return <div ref={host} className={`roaming-dhaya ${talking?'is-talking':''}`} style={{transform:'translate3d(300px,500px,0)'}}><div className="mascot-bubble" role="note"><strong>Dhaya</strong><p>{speech}</p></div><button className="mascot-body-button" aria-label="Say hello to Dhaya" onClick={()=>{lastReact.current=performance.now();setExpression('laugh');expiry.current=performance.now()+2300;setSpeech('Okay, okay. I’m working. Mostly.');setTalking(true);talkUntil.current=performance.now()+3500;}}><Caricature expression={expression}/></button></div>;
}
