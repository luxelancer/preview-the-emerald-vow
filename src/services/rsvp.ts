import {invitation} from '../data'
export interface Reply {id:string;name:string;phone:string;guests:number;attendance:string;message:string}
export async function submitReply(reply:Reply) {
 const controller=new AbortController()
 const timeout=window.setTimeout(()=>controller.abort(),12000)
 try{
  const response=await fetch(invitation.rsvp.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(reply),signal:controller.signal})
  const result=await response.json()
  if(!response.ok||result.received!==true)throw new Error('Could not save')
 }finally{clearTimeout(timeout)}
}

