import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./dist', import.meta.url));
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf','.pdf':'application/pdf'};
let weatherCache=null;
let weatherFetched=0;
async function weather(){
  if(weatherCache&&Date.now()-weatherFetched<900000)return weatherCache;
  const upstream='https://api.open-meteo.com/v1/forecast?latitude=53.5511&longitude=9.9937&current=temperature_2m,apparent_temperature,weather_code,is_day,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=5';
  try{
    const result=await fetch(upstream,{signal:AbortSignal.timeout(8000)});
    if(!result.ok)throw new Error('Weather upstream unavailable');
    const payload=await result.json();
    if(!payload.current||!payload.daily)throw new Error('Invalid forecast');
    weatherCache={current:payload.current,daily:payload.daily,timezone:payload.timezone,city:'Hamburg',fetchedAt:new Date().toISOString(),stale:false};weatherFetched=Date.now();return weatherCache;
  }catch(error){if(weatherCache)return {...weatherCache,stale:true};throw error;}
}
createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    if(url.pathname==='/api/weather'){
      try{const data=await weather();response.writeHead(200,{'Content-Type':'application/json','Cache-Control':'public, max-age=600'});response.end(JSON.stringify(data));}
      catch{response.writeHead(503,{'Content-Type':'application/json'});response.end(JSON.stringify({available:false,message:'The Hamburg forecast is temporarily unavailable.'}));}
      return;
    }
    const path = resolve(root, '.' + decodeURIComponent(url.pathname));
    if (path !== root && !path.startsWith(root + sep)) {response.writeHead(403); response.end('Forbidden'); return;}
    const info = await stat(path);
    const file = info.isDirectory() ? resolve(path, 'index.html') : path;
    const body = await readFile(file);
    response.writeHead(200, {'Content-Type':types[extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});
    response.end(body);
  } catch { response.writeHead(404); response.end('Not found'); }
}).listen(4173, '127.0.0.1', () => process.stdout.write('Local: http://127.0.0.1:4173\n'));
