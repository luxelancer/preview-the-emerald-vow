import assets from 'virtual:invitation-assets'
import { insertReply, replyFields } from './replies.mjs'

function json(status, value) {
  return Response.json(value, { status, headers: { 'Cache-Control': 'no-store' } })
}

async function saveResponse(request, env) {
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } })
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json(415, { error: 'Expected JSON.' })
  const reader = request.body?.getReader()
  if (!reader) return json(400, { error: 'Your response is empty.' })
  let size = 0, body = ''
  const decoder = new TextDecoder()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 8192) {
        await reader.cancel()
        return json(413, { error: 'Your response is too long.' })
      }
      body += decoder.decode(value, { stream: true })
    }
    const fields = replyFields(JSON.parse(body + decoder.decode()))
    if (!fields) return json(422, { error: 'Please check the form fields.' })
    await env.DB.prepare(insertReply).bind(...fields).run()
    return json(200, { received: true })
  } catch (error) {
    return json(error instanceof SyntaxError ? 400 : 503, { error: 'Your response could not be saved.' })
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname === '/api/rsvp') return saveResponse(request, env)
    if (!['GET','HEAD'].includes(request.method)) return new Response(null, {status:405,headers:{Allow:'GET, HEAD'}})
    const file = assets[url.pathname === '/' ? '/index.html' : url.pathname]
    if (!Array.isArray(file)) return new Response('Page not found', {status:404})
    let body = Uint8Array.from(atob(file[1]), c => c.charCodeAt(0))
    const headers = { 'Content-Type': file[0], 'X-Content-Type-Options':'nosniff','Cache-Control':'public, max-age=3600' }
    if (file[0].startsWith('text/html')) {
      body = new TextDecoder().decode(body).replace(/(property="og:image" content=")\/(?!\/)/, '$1'+url.origin+'/')
      headers['Cache-Control'] = 'no-cache'
    }
    return new Response(request.method==='HEAD'?null:body,{headers})
  }
}

