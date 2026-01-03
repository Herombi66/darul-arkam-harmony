import { io, Socket } from 'socket.io-client'

export type Message = {
  id: string
  thread_id: string
  from_user_id: string
  from_role: string
  to_user_id: string
  to_role: string
  subject?: string | null
  content: string
  created_at: string
  delivered_at?: string | null
  read_at?: string | null
}

export type Thread = { id: string; subject: string | null; last_message_at: string }

type ServiceErrorCode = 'NETWORK' | 'AUTH' | 'FORBIDDEN' | 'PARSE' | 'API'
class ServiceError extends Error {
  code: ServiceErrorCode
  status?: number
  constructor(code: ServiceErrorCode, message: string, status?: number) {
    super(message)
    this.code = code
    this.status = status
  }
}

async function requestJson(url: string, init?: RequestInit) {
  try {
    const res = await fetch(url, init)
    let data: unknown = null
    try {
      data = await res.json()
    } catch (e) {
      throw new ServiceError('PARSE', 'Invalid server response', res.status)
    }
    if (!res.ok) {
      const msg = typeof data === 'object' && data !== null && 'message' in (data as Record<string, unknown>)
        ? (data as Record<string, unknown>).message as string
        : undefined
      if (res.status === 401) throw new ServiceError('AUTH', msg || 'Authentication required', res.status)
      if (res.status === 403) throw new ServiceError('FORBIDDEN', msg || 'Not authorized', res.status)
      throw new ServiceError('API', msg || `Request failed (HTTP ${res.status})`, res.status)
    }
    return { res, data }
  } catch (e: unknown) {
    if (e instanceof ServiceError) throw e
    throw new ServiceError('NETWORK', 'Network error: Check your connection')
  }
}

const API_BASE = import.meta.env.VITE_BACKEND_URL ? import.meta.env.VITE_BACKEND_URL : ''
const WS_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001'

export async function getThreads(token: string): Promise<Thread[]> {
  const { data } = await requestJson(`${API_BASE}/api/messages/threads`, { headers: { Authorization: `Bearer ${token}` } })
  const payload = data as { data?: unknown }
  const list = Array.isArray(payload.data) ? (payload.data as Thread[]) : []
  return list
}

export async function getThread(token: string, threadId: string): Promise<{ thread: Thread; participants: { user_id: string; role: string }[]; messages: Message[] }> {
  const { data } = await requestJson(`${API_BASE}/api/messages/threads/${threadId}`, { headers: { Authorization: `Bearer ${token}` } })
  const payload = data as { data?: { thread: Thread; participants: { user_id: string; role: string }[]; messages: Message[] } }
  return payload.data as { thread: Thread; participants: { user_id: string; role: string }[]; messages: Message[] }
}

export async function createThread(token: string, subject: string | null, participants: { id: string; role: string }[]): Promise<string> {
  const { data } = await requestJson(`${API_BASE}/api/messages/threads`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ subject, participants })
  })
  const payload = data as { data?: { id: string } }
  return (payload.data?.id as string) || ''
}

export async function sendToThread(token: string, threadId: string, subject: string | null, content: string, sensitive?: boolean): Promise<Message | Message[]> {
  const { data } = await requestJson(`${API_BASE}/api/messages/send`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ threadId, subject, content, sensitive })
  })
  const payload = data as { data?: Message | Message[] }
  return payload.data as Message | Message[]
}

export async function attachFiles(token: string, messageId: string, files: { name: string; mime: string; base64: string }[]) {
  const { data } = await requestJson(`${API_BASE}/api/messages/attach`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ messageId, files })
  })
  const payload = data as { data?: unknown }
  return payload.data
}

export async function searchMessages(token: string, q: string): Promise<Message[]> {
  const { data } = await requestJson(`${API_BASE}/api/messages/search?q=${encodeURIComponent(q)}`, { headers: { Authorization: `Bearer ${token}` } })
  const payload = data as { data?: unknown }
  const list = Array.isArray(payload.data) ? (payload.data as Message[]) : []
  return list
}

export async function flagMessage(token: string, messageId: string): Promise<void> { await fetch(`${API_BASE}/api/messages/flag`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ messageId }) }) }
export async function unflagMessage(token: string, messageId: string): Promise<void> { await fetch(`${API_BASE}/api/messages/flag`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ messageId }) }) }
export async function archiveThread(token: string, threadId: string): Promise<void> { await fetch(`${API_BASE}/api/messages/archive`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ threadId }) }) }
export async function unarchiveThread(token: string, threadId: string): Promise<void> { await fetch(`${API_BASE}/api/messages/archive`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ threadId }) }) }

export function startTyping(threadId: string, userId: string) { getSocket().emit('typing:start', { threadId, userId }) }
export function stopTyping(threadId: string, userId: string) { getSocket().emit('typing:stop', { threadId, userId }) }

export async function sendMessage(token: string, toRole: string, toId: string, subject: string | null, content: string): Promise<Message> {
  const { data } = await requestJson(`${API_BASE}/api/messages/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ toRole, toId, subject, content })
  })
  const payload = data as { data?: Message }
  return payload.data as Message
}

export async function markRead(token: string, messageId: string): Promise<void> {
  const { res } = await requestJson(`${API_BASE}/api/messages/${messageId}/read`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new ServiceError('API', 'Failed to mark read', res.status)
}

let socket: Socket | null = null
export function getSocket(): Socket {
  if (socket) return socket
  socket = io(WS_BASE, { transports: ['websocket', 'polling'] })
  return socket
}

export type PresenceUser = { user_id: string; role: string; class_id?: string | null; is_online: boolean; last_seen?: string }
export async function getActiveUsers(token: string, role?: string, classId?: string): Promise<PresenceUser[]> {
  const url = new URL(`${API_BASE}/api/presence/active-users`)
  if (role) url.searchParams.set('role', role)
  if (classId) url.searchParams.set('classId', classId)
  const { data } = await requestJson(url.toString(), { headers: { Authorization: `Bearer ${token}` } })
  const payload = data as { data?: PresenceUser[] }
  return Array.isArray(payload.data) ? payload.data : []
}
export async function setOnline(token: string, classId?: string) {
  await requestJson(`${API_BASE}/api/presence/online`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ classId }) })
}
export async function setOffline(token: string) {
  await requestJson(`${API_BASE}/api/presence/offline`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
}
