import { useEffect, useState } from 'react'

export default function NetworkGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [online, setOnline] = useState(true)

  async function probe() {
    setLoading(true)
    try {
      let ok = false
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3000)
      const tryPaths = ['/api/health', '/api/healthz', '/api/status']
      for (const p of tryPaths) {
        if (ok) break
        try {
          const res = await fetch(p, { cache: 'no-store', signal: controller.signal })
          ok = res.ok
        } catch {}
      }
      clearTimeout(timeout)
      if (!ok) {
        const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001'
        const candidates = [`${base}/api/health`, `${base}/api/healthz`, `${base}/api/status`, `${base}/health`]
        for (const url of candidates) {
          if (ok) break
          try {
            const res = await fetch(url, { cache: 'no-store' })
            ok = res.ok
          } catch {}
        }
      }
      setOnline(ok)
    } catch {
      setOnline(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { probe() }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-fade-in text-center">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading application…</p>
        </div>
      </div>
    )
  }

  if (!online) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-xl font-bold">Backend Unavailable</h1>
          <p className="text-sm text-muted-foreground">Could not reach the server. Check your network or server status.</p>
          <button onClick={probe} className="bg-primary text-primary-foreground rounded px-4 py-2">Retry</button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
