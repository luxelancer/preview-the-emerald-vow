import { Bouquet, Divider, Icon, Specks } from './Ornaments'
import { invitation, names, displayDate } from '../data'

const flap = 'M2 3H598V169 Q592 190 562 189 Q550 212 518 207 Q499 231 468 224 Q443 250 412 242 Q391 269 354 261 Q323 277 300 302 Q277 277 246 261 Q209 269 188 242 Q157 250 132 224 Q101 231 82 207 Q50 212 38 189 Q8 190 2 169Z'
type Props = {opening: boolean; open: () => void}

export function Envelope({opening,open}: Props) {
  return <button className={'stationery '+(opening?'opening':'')} aria-label={'Open the invitation for '+names} onClick={open} aria-disabled={opening}>
    <span className="back-sheet" />
    <span className="envelope-object">
      <span className="back-paper"/>
      <span className="inner-card"><small>Together with our families</small><b>{names}</b><span>{displayDate()}</span></span>
      <span className="pocket"><span className="pocket-inner"/><Bouquet className="pocket-flower"/>
        <span className="envelope-message"><span>An Invitation to Celebrate</span><span className="envelope-rule">✧</span><small>Tap to open</small><Icon name="hand" size={23}/></span>
      </span>
      <span className="flap"><svg className="flap-art" viewBox="0 0 600 306" preserveAspectRatio="none" aria-hidden="true"><defs>
        <linearGradient id="paper" x2=".8" y2="1"><stop stopColor="#354831"/><stop offset=".48" stopColor="#233923"/><stop offset="1" stopColor="#15261b"/></linearGradient>
        <linearGradient id="foil"><stop stopColor="#a4773e"/><stop offset=".26" stopColor="#f2d096"/><stop offset=".62" stopColor="#ae8245"/><stop offset="1" stopColor="#dfb877"/></linearGradient>
        <clipPath id="flapclip"><path d={flap}/></clipPath>
        <pattern id="flap-grain" patternUnits="userSpaceOnUse" width="210" height="140"><image href="/assets/textures/grain.png" width="210" height="140" preserveAspectRatio="none"/></pattern></defs>
        <path d={flap} fill="url(#paper)" stroke="url(#foil)" strokeWidth="5"/>
        <g clipPath="url(#flapclip)"><path d={flap} fill="url(#flap-grain)" opacity=".75"/>
          <image href="/assets/botanical/engraving.svg" x="-12" y="-12" width="330" height="173" preserveAspectRatio="none"/>
          <image href="/assets/botanical/hibiscus.webp" x="-20" y="-145" width="375" height="225" transform="rotate(80 60 36)" preserveAspectRatio="none"/>
          <path d={flap} transform="translate(5 -1) scale(.984 .984)" fill="none" stroke="#c4a064" strokeWidth="1"/>
        </g>
      </svg></span>
      <span className="wax"><span>{invitation.couple.initials}</span></span>
    </span><Specks/>
  </button>
}

export function Cover({opening,open}:Props){
  const {couple,event}=invitation
  return <main className={'cover '+(opening?'is-opening':'')} id="cover">
    <div className="cover-frame" aria-hidden="true"><i/><i/><i/><i/></div>
    <Bouquet className="cover-flower top"/><Bouquet className="cover-flower bottom"/>
    <div className="cover-layout">
      <div className="cover-type">
        <div className="eyebrow"><i/>An Invitation to Celebrate<i/></div>
        <h1><span>{couple.brideName}</span><em>&amp;</em><span>{couple.groomName}</span></h1>
        <Divider/><p className="occasion">{event.title}</p>
        <p className="cover-date">{displayDate()} <span>·</span> {event.city}</p>
        <button className="gold-button open-button" onClick={open} aria-disabled={opening}><Icon name="envelope"/>{opening?'Opening…':'Open invitation'}<Icon name="right" size={16}/></button>
      </div>
      <div className="art-stage"><Envelope opening={opening} open={open}/></div>
    </div>
  </main>
}
