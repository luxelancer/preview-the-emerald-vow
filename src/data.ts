import config from './invitation.json'
export type Celebration = typeof config.event
export interface Invitation extends Omit<typeof config, 'events'> { events: Celebration[] }
export const invitation: Invitation = config
export const names = [config.couple.brideName, config.couple.groomName].join(' & ')
export const displayDate = (event: Celebration = invitation.event, weekday = false) =>
  new Intl.DateTimeFormat('en-GB', {timeZone: event.timezone, day:'numeric', month:'long', year:'numeric', ...(weekday ? {weekday:'long'} as const : {})}).format(new Date(event.date))
export const displayTime = (event: Celebration = invitation.event) => new Intl.DateTimeFormat('en-IN', {timeZone:event.timezone,hour:'numeric',minute:'2-digit',hour12:true}).format(new Date(event.date)).toUpperCase()
export const invitationId = names+'-'+invitation.event.date

