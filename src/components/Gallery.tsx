import { useEffect, useRef, useState } from 'react'
import { invitation } from '../data'
import { Bouquet, Divider, Icon } from './Ornaments'

export function Gallery(){
  const photos=invitation.gallery
  const [first,setFirst]=useState(0)
  const [active,setActive]=useState<number|null>(null)
  const dialog=useRef<HTMLDialogElement>(null)
  const touch=useRef({x:0,y:0})
  const wrap=(n:number)=>(n+photos.length)%photos.length
  const change=(step:number)=>setActive(i=>i===null?null:wrap(i+step))
  const opened=active!==null
  useEffect(()=>{
    if(!opened)return
    const modal=dialog.current
    modal?.showModal()
    const previous=document.body.style.overflow
    document.body.style.overflow='hidden'
    return ()=>{modal?.close();document.body.style.overflow=previous}
  },[opened])
  if(!photos.length)return null
  return <section className="panel gallery-section" id="gallery">
    <Bouquet className="section-corner"/><h2>Our Gallery</h2><Divider/>
    <div className="gallery-stage reveal"><div className="gallery-grid">
      {Array.from({length:Math.min(3,photos.length)},(_,offset)=>{
        const index=wrap(first+offset),photo=photos[index]
        return <button key={offset} onClick={()=>setActive(index)} aria-label={'Enlarge photo: '+photo.alt}><img key={index} src={photo.src} alt={photo.alt} loading="lazy" width="500" height="620"/><span><Icon name="expand" size={17}/></span></button>
      })}
    </div>{photos.length>1&&<><button className="round gallery-prev" aria-label="Previous gallery arrangement" onClick={()=>setFirst(wrap(first-1))}><Icon name="left"/></button><button className="round gallery-next" aria-label="Next gallery arrangement" onClick={()=>setFirst(wrap(first+1))}><Icon name="right"/></button></>}</div>
    <div className="gallery-dots">{photos.map((photo,i)=><button aria-label={'Start gallery with '+photo.alt} aria-pressed={i===first} onClick={()=>setFirst(i)} key={photo.src}><i/></button>)}</div>
    <dialog ref={dialog} className="lightbox" aria-label="Invitation photo gallery" onCancel={()=>setActive(null)} onClose={()=>setActive(null)} onClick={e=>{if(e.target===dialog.current)setActive(null)}} onKeyDown={e=>{if(e.key==='ArrowRight')change(1);if(e.key==='ArrowLeft')change(-1)}}>
      {active!==null&&<div className="lightbox-content" onTouchStart={e=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY}}} onTouchEnd={e=>{const dx=e.changedTouches[0].clientX-touch.current.x,dy=e.changedTouches[0].clientY-touch.current.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))change(dx>0?-1:1)}}>
        <button autoFocus className="round modal-close" aria-label="Close photo gallery" onClick={()=>setActive(null)}><Icon name="close"/></button>
        <img key={active} src={photos[active].src} alt={photos[active].alt}/>
        <div className="lightbox-nav"><button className="round" aria-label="Previous photo" onClick={()=>change(-1)}><Icon name="left"/></button><p aria-live="polite">{active+1} / {photos.length}</p><button className="round" aria-label="Next photo" onClick={()=>change(1)}><Icon name="right"/></button></div>
      </div>}
    </dialog>
  </section>
}
