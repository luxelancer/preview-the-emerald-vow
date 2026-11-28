import { Bouquet, Icon, Specks } from './Ornaments'
import { invitation, names, displayDate } from '../data'

const flap = 'M2 3H598V169 Q592 190 562 189 Q550 212 518 207 Q499 231 468 224 Q443 250 412 242 Q391 269 354 261 Q323 277 300 302 Q277 277 246 261 Q209 269 188 242 Q157 250 132 224 Q101 231 82 207 Q50 212 38 189 Q8 190 2 169Z'
type Props = { opening: boolean; open: () => void }

function Flap() {
  return (
    <span className="flap" aria-hidden="true">
      <span className="flap-surface">
        <img className="flap-leaves" src="/assets/botanical/engraving.svg" alt="" />
        <Bouquet className="flap-flower" />
      </span>
      <svg className="flap-art" viewBox="0 0 600 306" preserveAspectRatio="none">
        <defs>
          <clipPath id="flap-clip" clipPathUnits="objectBoundingBox">
            <path d={flap} transform={`scale(${1 / 600} ${1 / 306})`} />
          </clipPath>
          <linearGradient id="foil">
            <stop stopColor="#a4773e" /><stop offset=".26" stopColor="#f2d096" />
            <stop offset=".62" stopColor="#ae8245" /><stop offset="1" stopColor="#dfb877" />
          </linearGradient>
        </defs>
        <path d={flap} fill="none" stroke="url(#foil)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        <path d={flap} transform="translate(3 1) scale(.99 .984)" fill="none" stroke="#c4a064" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  )
}

export function Cover({ opening, open }: Props) {
  return (
    <main className={'cover' + (opening ? ' is-opening' : '')} aria-label={names + ' invitation'} id="cover">
      <button id="cover-start" className={'stationery' + (opening ? ' opening' : '')}
        aria-label={'Open the invitation for ' + names} aria-disabled={opening} onClick={open}>
        <span className="envelope-object">
          <span className="back-paper" />
          <span className="inner-card">
            <small>Together with our families</small><b>{names}</b><span>{displayDate()}</span>
          </span>
          <span className="pocket">
            <span className="pocket-inner" />
            <Bouquet className="pocket-flower" />
            <span className="envelope-message">
              <span>An Invitation to Celebrate</span><span className="envelope-rule" aria-hidden="true">✧</span>
              <small>Tap to open</small><Icon name="hand" size={23} />
            </span>
          </span>
          <Flap />
          <span className="wax"><span>{invitation.couple.initials}</span></span>
        </span>
        <Specks />
      </button>
    </main>
  )
}

