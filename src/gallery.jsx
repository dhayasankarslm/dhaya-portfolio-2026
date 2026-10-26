import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import CircularGallery from './components/CircularGallery';
const descriptions=['A candid smile in the crowd','Friends, paused for a moment','Night traffic in motion','A street portrait, caught in the light','Headlights passing through the dark','A glow against the night','A quiet afternoon companion','Look up, sometimes','An Interceptor, parked for a pause','Details from the road','Two cats and a quiet corner','A temple beyond the shadows','Carved against the sky','A doorway, framed differently','The long walk home','A path through the palms','Two wheels, open country','Parked among the green','The road can wait','Taking the long way','Royal Enfield, in the details','A favourite kind of machine','A roadside rest, after dark','A small light in the dark','Stone, light and perspective','A very good companion','The view beyond the everyday','Quiet company on the steps','A good day to be outside','An overgrown corner','One more night on the street','A day out','A little room to breathe','The sea, taking its time'];
const order=[7,32,3,14,33,24,22,8,13,15,25,30,27,10,12,16,0,1,2,4,5,6,9,11,17,18,19,20,21,23,26,28,29,31];
const items=order.map(i=>({image:`assets/photography/photo-${String(i+1).padStart(2,'0')}.jpg`,text:descriptions[i],description:`Photograph ${i+1} of 34 · Dhayasankar Vasudevan`}));
function Gallery(){
 const [night,setNight]=useState(document.body.classList.contains('night'));
 const [reduced,setReduced]=useState(matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{const observer=new MutationObserver(()=>setNight(document.body.classList.contains('night')));observer.observe(document.body,{attributes:true,attributeFilter:['class']});const media=matchMedia('(prefers-reduced-motion: reduce)');const changed=e=>setReduced(e.matches);media.addEventListener('change',changed);return()=>{observer.disconnect();media.removeEventListener('change',changed);};},[]);
 if(reduced)return <div className="dh-reduced-gallery">{items.map(item=><button key={item.image} onClick={()=>window.dispatchEvent(new CustomEvent('dhaya:photo',{detail:Number(item.image.match(/photo-(\d+)/)[1])}))}><img src={item.image} alt={item.text} loading="lazy"/><span>{item.text}</span></button>)}</div>;
 return <CircularGallery items={items} bend={2} textColor={night?'#fff9f1':'#060606'} borderRadius={0.035} font="500 24px Space Grotesk" fontUrl="assets/fonts/SpaceGrotesk.ttf" scrollSpeed={1.6} scrollEase={0.055} itemSize={0.9} itemAspect={0.78} wave={0.65} gap={0.22} fadeEdges={0.09} shadow={0.15} autoScroll={0} openOnClick intro aria-label="Drag through Dhaya’s photographs. Use left and right arrows to browse; Enter to open."/>;
}
const target=document.getElementById('reactbits-gallery');let mounted=false;
function mount(){if(!mounted){mounted=true;createRoot(target).render(<Gallery/>);}}
if(target){window.addEventListener('dhaya:playground',mount);if(location.hash==='#playground')mount();}
