import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { invitation, invitationId } from './data'
import { Cover } from './components/Envelope'
import { Brand, Icon } from './components/Ornaments'
import { InvitationContent } from './components/Invitation'
import './styles.css'
import './envelope.css'
import './sections.css'

const storageKey='luxelancer.opened.'+invitationId
function hasOpened(){try{return localStorage.getItem(storageKey)==='yes'}catch{return false}}

function Music(){
  const audio=useRef<HTMLAudioElement>(null)
  const [playing,setPlaying]=useState(false),[error,setError]=useState('')
  const music=invitation.music
  if(!music.enabled||!music.source)return null
  async function toggle(){
    const player=audio.current
    if(!player)return
    if(!player.paused){player.pause();return}
    try{player.volume=.33;await player.play();setError('')}catch{setError('Music could not play. Tap to try again.')}
  }
  return <><audio ref={audio} src={music.source} loop preload="none" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}/><button className={'music round '+(playing?'playing':'')} onClick={toggle} aria-label={playing?'Pause music':'Play music'} title={playing?'Pause music':'Play music'} aria-pressed={playing}><Icon name="music" size={18}/></button><span className="music-error" role="status">{error}</span></>
}
function App(){
  const [opened,setOpened]=useState(hasOpened),[opening,setOpening]=useState(false)
  const timer=useRef<number|undefined>(undefined),focusNext=useRef(false)
  useEffect(()=>()=>clearTimeout(timer.current),[])
  useEffect(()=>{
    if(!focusNext.current)return
    window.scrollTo({top:0,behavior:'instant'}); document.getElementById(opened?'announcement':'cover-start')?.focus({preventScroll:true})
    focusNext.current=false
  },[opened])
  function enter(){
    clearTimeout(timer.current);focusNext.current=true
    try{localStorage.setItem(storageKey,'yes')}catch{}
    setOpened(true);setOpening(false)
  }
  function open(){
    if(opening)return
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){enter();return}
    setOpening(true);timer.current=window.setTimeout(enter,3900)
  }
  function replay(){
    try{localStorage.removeItem(storageKey)}catch{}
    focusNext.current=true;setOpened(false)
    history.replaceState(null,'',location.pathname+location.search)
  }
  return <div className={opened?'opened-site':'sealed-site'}>
    <header className="masthead">{opened && <Brand/>}
      <div className="header-controls"><Music/>{!opened&&<button className="skip" onClick={enter}>Skip intro <Icon name="right" size={15}/></button>}</div>
    </header>
    {opened?<InvitationContent replay={replay}/>:<Cover opening={opening} open={open}/>}
  </div>
}
createRoot(document.getElementById('root')!).render(<App/>)

