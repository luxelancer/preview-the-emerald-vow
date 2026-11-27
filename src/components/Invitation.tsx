import { useEffect, useState } from 'react'
import { invitation, displayDate, displayTime, names, type Celebration } from '../data'
import { Brand, Bouquet, Divider, Icon } from './Ornaments'
import { Gallery } from './Gallery'
import { Rsvp } from './Rsvp'

function Countdown({event=invitation.event}:{event?:Celebration}){
  const [now,setNow]=useState(Date.now)
  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return ()=>clearInterval(timer)},[])
  const seconds=Math.max(0,Math.floor((Date.parse(event.date)-now)/1000))
  if(now>=Date.parse(event.date))return <p className="event-state">{now>=Date.parse(event.end)?'Thank you for celebrating with us.':'The celebration has begun.'}</p>
  const values=[Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60]
  return <div className="countdown" role="timer" aria-label={'Time until '+event.title}>{['Days','Hours','Minutes','Seconds'].map((label,i)=><span key={label}><b key={values[i]}>{String(values[i]).padStart(2,'0')}</b><small>{label}</small></span>)}</div>
}

function Hero(){
  const {couple,event}=invitation
  return <section id="announcement" className="hero ivory panel" tabIndex={-1}>
    <Bouquet className="corner-tl"/><Bouquet className="corner-br"/>
    <div className="hero-copy"><p>Together with our families</p><h1><span>{couple.brideName}</span><em>&amp;</em><span>{couple.groomName}</span></h1><p>Invite you to celebrate<br/> their {event.occasion}</p><Divider/><Countdown/>
    <div className="hero-details"><span><Icon name="calendar"/>{displayDate(event,true)}</span><span><Icon name="clock"/>{displayTime()} onwards</span><span><Icon name="pin"/>{event.city}</span></div>
    <a className="explore" href="#couple"><span><Icon name="down"/></span>Scroll to explore</a></div>
  </section>
}
function Couple(){
  const c=invitation.couple
  return <section id="couple" className="panel couple-section"><Bouquet className="corner-tl"/><h2>Our Couple</h2><Divider/>
    <div className="portraits">{[[c.brideName,c.bridePortrait,c.brideIntroduction],[c.groomName,c.groomPortrait,c.groomIntroduction]].map(([name,src,intro])=><figure key={src} className="reveal"><div className="portrait-frame"><img src={src} alt={name} width="460" height="600" loading="lazy"/></div><figcaption><h3>{name}</h3><p>{intro}</p></figcaption></figure>)}</div>
  </section>
}
function Story(){
  const icons=['heart','spark','flower','feather'] as const
  return <section id="story" className="story-section panel"><h2>Our Story</h2><Divider/><ol className="timeline">{invitation.story.map((item,i)=>{
    const photo=invitation.gallery[item.image]
    return <li className="reveal" key={item.title}>{photo&&<div className="polaroid"><img src={photo.src} alt={photo.alt} width="200" height="240" loading="lazy"/></div>}<span className="milestone"><Icon name={icons[i%icons.length]}/></span><div><h3>{item.title}</h3><p>{item.text}</p></div></li>
  })}</ol><Bouquet className="section-corner"/></section>
}
function Events(){
  return <section id="celebration" className="events-section panel"><Bouquet className="corner-br"/>{[invitation.event,...invitation.events].map(event=><article className="event-card ivory reveal" key={event.title+event.date}><span className="event-flourish" aria-hidden="true">❧</span><h2>Save the Date</h2><Divider/><p className="event-title">{event.title}</p><h3>{displayDate(event,true)}</h3><p className="time"><Icon name="clock"/>{displayTime(event)} onwards</p><Icon name="pin" size={25}/><h3>{event.venueName}</h3><p>{event.venueAddress}</p>{event.dressCode&&<p>Dress code · {event.dressCode}</p>}{event.mapUrl&&<a className="dark-button" target="_blank" rel="noreferrer" href={event.mapUrl}>Open in Google Maps <Icon name="right"/></a>}<Countdown event={event}/></article>)}</section>
}
function Message(){
  return <section className="message ivory panel"><Bouquet className="corner-tl"/><Bouquet className="corner-br"/><div className="reveal"><p>With love and the blessings<br/>of our families</p><Divider/><blockquote>“We joyfully invite you to join us as we celebrate the beginning of our forever.”</blockquote><h2>{names}</h2><p className="message-date">{displayDate()}</p></div></section>
}

async function copy(text:string){
  try{await navigator.clipboard.writeText(text);return}catch{
    const box=document.createElement('textarea')
    box.value=text;box.style.cssText='position:fixed;top:0;left:-9999px'
    document.body.append(box);box.select()
    const ok=document.execCommand('copy');box.remove()
    if(!ok)throw new Error('Clipboard unavailable')
  }
}
function Closing({replay}:{replay:()=>void}){
  const [feedback,setFeedback]=useState('')
  const url=invitation.siteUrl||location.origin+location.pathname
  async function share(linkOnly:boolean){
    const text=names+' invite you to celebrate their '+invitation.event.occasion+' on '+displayDate()+'.'
    try{
      if(!linkOnly&&navigator.share){await navigator.share({title:names+' | Invitation',text,url});setFeedback('Invitation shared.')}
      else {await copy(linkOnly?url:text+' '+url);setFeedback(linkOnly?'Invitation link copied.':'Invitation copied and ready to share.')}
    }catch(e){if(!(e instanceof DOMException&&e.name==='AbortError'))setFeedback('Sharing is unavailable. You can copy this link: '+url)}
  }
  return <footer id="closing" className="closing panel"><Bouquet className="corner-tl"/><Bouquet className="corner-br"/><p>Your presence will make our celebration even more special.</p><h2>{names}</h2><p>With love, we look forward to celebrating with you.</p><Divider/>
    <div className="closing-actions"><button onClick={()=>share(false)}><Icon name="share"/>Share invitation</button><button onClick={()=>share(true)}><Icon name="copy"/>Copy link</button><button onClick={replay}><Icon name="replay"/>Replay invitation</button></div><p className="feedback" role="status">{feedback}</p><Brand/></footer>
}

export function InvitationContent({replay}:{replay:()=>void}){
  useEffect(()=>{
    if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return
    const elements=[...document.querySelectorAll<HTMLElement>('.reveal')]
    const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}},{threshold:.07})
    elements.forEach(el=>{el.classList.add('observed');observer.observe(el)})
    return ()=>observer.disconnect()
  },[])
  return <><main className="invitation"><Hero/><div className="spread"><Couple/><Story/></div><div className="spread"><Events/><Gallery/></div><Message/>{invitation.rsvp.enabled&&<Rsvp/>}</main><Closing replay={replay}/></>
}
