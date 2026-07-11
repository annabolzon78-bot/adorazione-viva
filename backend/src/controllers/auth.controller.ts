import { tokenBlacklist } from '../services/tokenBlacklist'
import type { Request, Response } from 'express'
import type { AuthRequest } from '../types'
import { authService } from '../services/auth.service'
import { R } from '../utils/response'
import { logger } from '../utils/logger'

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body)
      return R.created(res, user, 'Registrazione completata. Controlla la tua email.')
    } catch (err: any) {
      if (err.code === 'EMAIL_EXISTS')  return R.conflict(res, err.message)
      if (err.code === 'WEAK_PASSWORD') return R.unprocessable(res, err.message)
      logger.error({ message: 'Register error', err })
      return R.serverError(res)
    }
  },

  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body.email, req.body.password)
      return R.ok(res, result, 'Login effettuato')
    } catch (err: any) {
      if (err.code === 'INVALID_CREDENTIALS') return R.unauthorized(res, err.message)
      return R.serverError(res)
    }
  },

  async refresh(req: Request, res: Response) {
    try {
      const tokens = await authService.refresh(req.body.refreshToken)
      return R.ok(res, tokens)
    } catch {
      return R.unauthorized(res, 'Refresh token non valido o scaduto')
    }
  },

  async me(req: AuthRequest, res: Response) {
    return R.ok(res, req.user)
  },

  async changePassword(req: AuthRequest, res: Response) {
    try {
      await authService.changePassword(req.user!.id, req.body.currentPassword, req.body.newPassword)
      return R.ok(res, null, 'Password aggiornata')
    } catch (err: any) {
      if (err.code === 'WRONG_PASSWORD') return R.unprocessable(res, err.message)
      if (err.code === 'WEAK_PASSWORD')  return R.unprocessable(res, err.message)
      return R.serverError(res)
    }
  },

  async logout(_req: Request, res: Response) {
    // Con JWT stateless il logout è client-side; qui invalidare refresh token se si usa una blacklist
    return R.ok(res, null, 'Logout effettuato')
  },
}
