import {useRef,useState} from 'react'
import {submitReply} from '../services/rsvp'
import {Bouquet,Divider,Icon} from './Ornaments'
export function Rsvp(){
 const [attendance,setAttendance]=useState('yes'),[status,setStatus]=useState<'idle'|'sending'|'saved'|'error'>('idle')
 const request=useRef({id:'',content:''})
 async function send(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();if(status==='sending')return
  const form=e.currentTarget,fields=new FormData(form),nameInput=form.elements.namedItem('name') as HTMLInputElement
  if(!nameInput.value.trim()){nameInput.setCustomValidity('Please enter your name.');nameInput.reportValidity();return}
  const content={name:nameInput.value.trim(),phone:String(fields.get('phone')||'').trim(),guests:attendance==='yes'?Number(fields.get('guests')):0,attendance,message:String(fields.get('message')||'').trim()}
  const serialized=JSON.stringify(content)
  if(request.current.content!==serialized){const bytes=crypto.getRandomValues(new Uint8Array(16));const hex=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');request.current={content:serialized,id:hex.slice(0,8)+'-'+hex.slice(8,12)+'-'+hex.slice(12,16)+'-'+hex.slice(16,20)+'-'+hex.slice(20)}}
  setStatus('sending')
  try{await submitReply({...content,id:request.current.id});setStatus('saved')}catch{setStatus('error')}
 }
 return <section id="rsvp" className="panel rsvp-section"><Bouquet className="section-corner"/><div className="form-paper"><h2>RSVP</h2><Divider/>{status==='saved'?<div className="confirmation" role="status"><span><Icon name="check" size={34}/></span><h3>Thank you!</h3><p>Your response has been recorded with love.</p><a href="#closing" className="gold-button">Close <Icon name="right" size={16}/></a></div>:<><p>We would be delighted to celebrate with you.</p><form onSubmit={send}><fieldset disabled={status==='sending'}><div className="fields"><label>Your name <span>*</span><input name="name" autoComplete="name" required maxLength={120} onInput={e=>e.currentTarget.setCustomValidity('')} placeholder="Enter your name"/></label><label>Phone <small>(optional)</small><input name="phone" type="tel" autoComplete="tel" maxLength={24} pattern={'[+0-9\\(\\) .\\-]{6,24}'} title="Enter a phone number with 6 to 24 characters." placeholder="Phone number"/></label></div>
 <fieldset className="attendance"><legend>Will you be joining us?</legend>{[['yes','Joyfully attending'],['no','Regretfully unable to attend']].map(([v,t])=><label key={v}><input type="radio" name="attendance" value={v} checked={attendance===v} onChange={()=>setAttendance(v)}/>{t}</label>)}</fieldset>
 {attendance==='yes'&&<label>Number of guests<select name="guests" defaultValue="1">{Array.from({length:20},(_,i)=><option key={i}>{i+1}</option>)}</select></label>}
 <label>Message <small>(optional)</small><textarea name="message" rows={3} maxLength={1200} placeholder="A note for the couple…"/></label>
 {status==='error'&&<p className="form-error" role="alert">Your response could not be saved. Please try again.</p>}
 <button type="submit" className="gold-button"><Icon name="envelope"/>{status==='sending'?'Sending…':'Submit RSVP'}</button></fieldset></form></>}</div></section>
}

