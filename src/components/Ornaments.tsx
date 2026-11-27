import type { CSSProperties } from 'react'
type IconName = 'hand'|'music'|'muted'|'right'|'left'|'down'|'envelope'|'heart'|'flower'|'calendar'|'gallery'|'feather'|'check'|'close'|'copy'|'share'|'replay'|'pin'|'clock'|'spark'|'expand'
const paths:Record<IconName,React.ReactNode> = {
 hand:<><path d="M9 13V6a1.4 1.4 0 0 1 2.8 0v5-1a1.4 1.4 0 0 1 2.8 0v1a1.3 1.3 0 0 1 2.6 0v1.2a1.3 1.3 0 0 1 2.6 0v4c0 3.8-2.1 5.8-5.4 5.8h-1.2c-2 0-3.8-1.4-5.2-3.5l-3.4-5a1.5 1.5 0 0 1 2.2-1.9L9 14"/><path d="M5.3 7a5 5 0 1 1 10 0"/></>,
 music:<><path d="M9 17V5l11-2v12M9 8l11-2"/><ellipse cx="6" cy="18" rx="3" ry="2"/><ellipse cx="17" cy="16" rx="3" ry="2"/></>,
 muted:<><path d="M9 17V5l11-2v9M9 8l11-2"/><ellipse cx="6" cy="18" rx="3" ry="2"/><path d="m16 16 5 5m0-5-5 5"/></>,
 right:<path d="M4 12h15m-6-6 6 6-6 6"/>,left:<path d="M20 12H5m6-6-6 6 6 6"/>,down:<path d="M12 3v17m-6-6 6 6 6-6"/>,
 envelope:<><rect x="2.5" y="5" width="19" height="14" rx="1.5"/><path d="m3 6 9 7 9-7"/></>,
 heart:<path d="M12 20 3.5 12C-2 5.5 7.5-.5 12 7c5-7.5 14-1.5 8.5 5Z"/>,
 flower:<>{[0,72,144,216,288].map(x=><path key={x} transform={'rotate('+x+' 12 12)'} d="M12 11C5 7 9 2 12 2s7 5 0 9Z"/>)}<circle cx="12" cy="12" r="2"/></>,
 calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 10h18m-13 5h2m4 0h2"/></>,
 gallery:<><rect x="2.5" y="4" width="19" height="16" rx="2"/><circle cx="8" cy="9" r="1.5"/><path d="m4 18 5-5 4 3 4-6 4 5"/></>,
 feather:<><path d="M4 21 17 7m-9 9C4 7 14 1 21 3c1 10-7 17-13 13Zm4-5h5"/></>,
 check:<path d="m4 12 5 5L20 6"/>,close:<path d="m5 5 14 14M19 5 5 19"/>,copy:<><rect x="8" y="7" width="12" height="15" rx="2"/><path d="M16 7V2H3v15h5"/></>,
 share:<><circle cx="18" cy="5" r="3"/><circle cx="5" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8 11 7-5m-7 7 7 5"/></>,
 replay:<><path d="M4 10a8 8 0 1 1 0 5m0-11v6h6"/></>,pin:<><path d="M12 22s8-8 8-14A8 8 0 0 0 4 8c0 6 8 14 8 14Z"/><circle cx="12" cy="8" r="2.5"/></>,
 clock:<><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,spark:<path d="m12 2 2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4Z"/>,expand:<path d="M3 9V3h6m6 0h6v6M3 15v6h6m6 0h6v-6"/>
}
export function Icon({name,size=18}:{name:IconName,size?:number}) { return <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg> }
export function Divider() {return <div className="divider" aria-hidden="true"><i/><svg width="50" height="16" viewBox="0 0 50 16" fill="none" stroke="currentColor"><path d="M1 8c9-8 13 10 21 0C15 1 10 5 13 8s7 0 10-3m4 0c4 3 7 6 10 3s-2-7-9 0c8 10 12-8 21 0"/><path d="m25 4 3 4-3 4-3-4z"/></svg><i/></div>}
export function Bouquet({className=''}:{className?:string}){return <img className={'bouquet '+className} src="/assets/botanical/hibiscus.webp" alt="" aria-hidden="true" draggable="false"/>}
export function Brand(){return <span className="brand"><svg width="34" height="35" viewBox="0 0 40 42" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.15"><path d="M20 36C4 31 3 17 3 12c10 0 15 9 17 16C21 17 28 12 37 12c-1 14-8 21-17 24Z"/><path d="M20 33C8 22 13 10 20 3c8 10 11 20 0 30Zm0 3C8 36 3 31 1 25c8 0 13 5 19 11Zm0 0c12 0 17-5 19-11-8 0-13 5-19 11Z"/></svg>Luxelancer</span>}
export function Specks(){return <div aria-hidden="true" className="specks">{Array.from({length:16},(_,i)=><i key={i} style={{'--x':(i*37%97)+'%','--y':(i*53%93)+'%','--delay':i*.055+'s'} as CSSProperties}/>)}</div>}

