import { insertReply, replyFields } from './replies.mjs'
import { mkdirSync } from 'node:fs'
import path from 'node:path'
let database
async function getDatabase() {
  if (database) return database
  const { DatabaseSync } = await import('node:sqlite')
  if (database) return database
  const directory = path.resolve(process.env.RSVP_DATA_DIR || '.data')
  mkdirSync(directory, {recursive:true})
  database = new DatabaseSync(path.join(directory, 'responses.sqlite'))
  database.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=3000; CREATE TABLE IF NOT EXISTS responses (id TEXT PRIMARY KEY, name TEXT NOT NULL, phone TEXT, attending INTEGER NOT NULL, guests INTEGER NOT NULL, message TEXT, created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)')
  return database
}
export async function handleRsvp(req,res) {
  const send=(status,body)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(body))}
  if(req.method!=='POST') {res.setHeader('Allow','POST'); return send(405,{error:'Submit your response using the form.'})}
  if(!req.headers['content-type']?.startsWith('application/json')) return send(415,{error:'Expected a JSON response.'})
  let bytes=0
  const chunks=[]
  try {
    for await(const chunk of req){bytes+=chunk.length;if(bytes>8192)return send(413,{error:'Your response is too long.'});chunks.push(chunk)}
    const data=JSON.parse(Buffer.concat(chunks).toString())
    const fields=replyFields(data)
    if(!fields) return send(422,{error:'Please check the form fields.'})
    const db=await getDatabase()
    db.prepare(insertReply).run(...fields)
    return send(200,{received:true})
  } catch(error){return send(error instanceof SyntaxError?400:503,{error:error instanceof SyntaxError?'Please check your response.':'Your response could not be saved. Please try again.'})}
}
export const rsvpMiddleware=(req,res,next)=>req.url?.split('?')[0]==='/api/rsvp'?handleRsvp(req,res):next()


