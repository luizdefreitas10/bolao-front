'use server'

export async function syncWc2026Results(): Promise<{
  updated: number
  skipped: number
  total: number
}> {
  const apiUrl = process.env.NEXT_PUBLIC_DOMAIN ?? 'https://bolao-back-api.onrender.com/v1'
  const syncSecret = process.env.SYNC_SECRET ?? ''

  const res = await fetch(`${apiUrl}/sync-results`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-sync-secret': syncSecret,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(body || `HTTP ${res.status}`)
  }

  return res.json()
}
