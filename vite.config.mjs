import {defineConfig} from 'vite'
import {readFileSync} from 'node:fs'
import {rsvpMiddleware} from './server/rsvp.mjs'
const data=JSON.parse(readFileSync(new URL('./src/invitation.json',import.meta.url),'utf8'))
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;')
export default defineConfig({
 plugins:[{name:'invitation',configureServer(server){server.middlewares.use(rsvpMiddleware)},configurePreviewServer(server){server.middlewares.use(rsvpMiddleware)},transformIndexHtml(html){
  const names=data.couple.brideName+' & '+data.couple.groomName
  const date=new Intl.DateTimeFormat('en-GB',{timeZone:data.event.timezone,dateStyle:'long'}).format(new Date(data.event.date))
  const title=names+' | '+data.event.title
  const description='Join '+names+' to celebrate their '+data.event.occasion+' on '+date+' in '+data.event.city+'. Open your invitation and RSVP.'
  return html.replaceAll('__TITLE__',escape(title)).replaceAll('__DESCRIPTION__',escape(description)).replaceAll('__IMAGE__',escape(data.siteUrl?new URL(data.socialImage,data.siteUrl).href:data.socialImage)).replace('<!--canonical-->',data.siteUrl?'<link rel="canonical" href="'+escape(data.siteUrl)+'"><meta property="og:url" content="'+escape(data.siteUrl)+'">':'')
 }}]
})

