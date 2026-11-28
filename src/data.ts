import config from './invitation.json'

export interface Celebration {
  title: string
  occasion: string
  /** Absolute ISO timestamps with an explicit UTC offset. */
  date: string
  end: string
  timezone: string
  city: string
  venueName: string
  venueAddress: string
  mapUrl: string
  dressCode: string
}

interface Invitation {
  couple: {
    brideName: string
    groomName: string
    initials: string
    bridePortrait: string
    groomPortrait: string
    brideIntroduction: string
    groomIntroduction: string
  }
  event: Celebration
  events: Celebration[]
  story: { title: string; text: string; image: number }[]
  gallery: { src: string; alt: string }[]
  rsvp: { enabled: boolean; endpoint: string }
  music: { enabled: boolean; source: string }
  siteUrl: string
  socialImage: string
}

export const invitation: Invitation = config
export const names = [invitation.couple.brideName, invitation.couple.groomName].join(' & ')
export const invitationId = names + '-' + invitation.event.date

export function displayDate(event: Celebration = invitation.event, weekday = false) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: event.timezone, day:'numeric', month:'long', year:'numeric',
    weekday: weekday ? 'long' : undefined
  }).format(new Date(event.date))
}

export function displayTime(event: Celebration = invitation.event) {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: event.timezone, hour:'numeric', minute:'2-digit', hour12:true
  }).format(new Date(event.date)).toUpperCase()
}
