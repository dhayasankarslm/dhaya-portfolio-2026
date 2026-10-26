import {test} from 'node:test';
import assert from 'node:assert/strict';
import {companionPath,GUIDE_STOPS} from './companion-path.mjs';
test('the entire route stays within the reserved margin at phone, tablet and desktop sizes',()=>{for(const width of [320,375,414,768,1024,1440,1920])for(const height of [600,740,896,1000,1200])for(let i=0;i<=1000;i++){const p=companionPath(i/1000,width,height);assert.ok(p.x>=0);assert.ok(p.x+p.size*.72<=p.lane,`${width}: ${JSON.stringify(p)}`);assert.ok(p.y>=80);assert.ok(p.y+p.size<height-90);}});
test('route transitions are continuous and deterministic, without random positions',()=>{for(const stop of GUIDE_STOPS.slice(1,-1)){const a=companionPath(stop.at-1e-6,1440,1000),b=companionPath(stop.at+1e-6,1440,1000);assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<.01);}for(const p of [0,.2,.5,.9,1])assert.deepEqual(companionPath(p,375,812),companionPath(p,375,812));});
test('progress clamps to route endpoints',()=>{assert.deepEqual(companionPath(-1,1440,1000),companionPath(0,1440,1000));assert.deepEqual(companionPath(2,1440,1000),companionPath(1,1440,1000));});
