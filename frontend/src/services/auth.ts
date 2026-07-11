const API = (import.meta as any).env?.VITE_API_URL ?? '/api'

interface RegisterPayload {
  name: string; email: string; password: string; role: string
  parish?: { name: string; city: string; country: string }
}

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('av_token')
  const res = await fetch(`${API}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...opts,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? `HTTP ${res.status}`)
  return data
}

export const authService = {
  async login(email: string, password: string) {
    const data: any = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    localStorage.setItem('av_token',         data.data.accessToken)
    localStorage.setItem('av_refresh_token', data.data.refreshToken)
    return data.data
  },

  async register(payload: RegisterPayload) {
    return request('/auth/register', { method:'POST', body:JSON.stringify(payload) })
  },

  async refresh() {
    const rt = localStorage.getItem('av_refresh_token')
    if (!rt) throw new Error('No refresh token')
    const data: any = await request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: rt }),
    })
    localStorage.setItem('av_token',         data.data.accessToken)
    localStorage.setItem('av_refresh_token', data.data.refreshToken)
    return data.data.accessToken
  },

  async logout() {
    const rt = localStorage.getItem('av_refresh_token')
    try {
      await request('/auth/logout', { method:'POST', body: JSON.stringify({ refreshToken: rt }) })
    } catch {}
    localStorage.removeItem('av_token')
    localStorage.removeItem('av_refresh_token')
  },

  async me() {
    return request('/auth/me')
  },

  async changePassword(currentPassword: string, newPassword: string) {
    return request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  },

  isAuthenticated: () => !!localStorage.getItem('av_token'),
}
