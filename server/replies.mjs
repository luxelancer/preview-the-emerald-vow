export const insertReply = 'INSERT INTO responses (id,name,phone,attending,guests,message) VALUES (?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING'

export function replyFields(data) {
  if (!data || typeof data !== 'object') return null
  const { id, name, phone, attendance, guests, message } = data
  if (typeof id !== 'string' || !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(id)) return null
  if (typeof name !== 'string' || !name.trim() || name.length > 120) return null
  if (typeof phone !== 'string' || (phone && !/^\+?[0-9() .-]{6,24}$/.test(phone))) return null
  if (typeof message !== 'string' || message.length > 1200) return null
  if (!['yes','no'].includes(attendance) || !Number.isInteger(guests)) return null
  if (attendance === 'yes' ? guests < 1 || guests > 20 : guests !== 0) return null
  return [id, name.trim(), phone, attendance === 'yes' ? 1 : 0, guests, message.trim()]
}
