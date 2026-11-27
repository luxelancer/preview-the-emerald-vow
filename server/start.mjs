import http from 'node:http'
import {createReadStream,existsSync,statSync} from 'node:fs'
import path from 'node:path'
import {rsvpMiddleware} from './rsvp.mjs'
const root=path.resolve('dist')
if(!existsSync(path.join(root,'index.html')))throw new Error('Run npm run build first.')
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.wav':'audio/wav','.woff2':'font/woff2'}
http.createServer((req,res)=>rsvpMiddleware(req,res,()=>{
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return}
  let url
  try{url=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);res.end();return}
  const file=path.resolve(root,'.'+(url==='/'?'/index.html':url))
  if(!file.startsWith(root+path.sep)||!existsSync(file)||!statSync(file).isFile()){res.writeHead(404);res.end();return}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'})
  if(req.method==='HEAD'){res.end();return}
  createReadStream(file).on('error',()=>res.destroy()).pipe(res)
})).listen(Number(process.env.PORT||4173),'0.0.0.0',()=>console.log('Invitation server ready'))

