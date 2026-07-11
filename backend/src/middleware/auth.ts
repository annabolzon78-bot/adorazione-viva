import { tokenBlacklist } from '../services/tokenBlacklist'
import type { Response, NextFunction } from 'express'
import type { AuthRequest } from '../types'
import { jwtUtils } from '../utils/jwt'
import { R } from '../utils/response'
import type { Role } from '../types'

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return R.unauthorized(res)
  try {
    const payload = jwtUtils.verifyAccess(header.slice(7))
    req.user = { id: payload.sub, email: payload.email, role: payload.role as Role }
    next()
  } catch (err: any) {
    if (err?.name === 'TokenExpiredError') return R.unauthorized(res, 'Token scaduto')
    return R.unauthorized(res, 'Token non valido')
  }
}

export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (header?.startsWith('Bearer ')) {
    try {
      const payload = jwtUtils.verifyAccess(header.slice(7))
      req.user = { id: payload.sub, email: payload.email, role: payload.role as Role }
    } catch { /* ignore */ }
  }
  next()
}

export function requireRole(...roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user)                        return R.unauthorized(res)
    if (!roles.includes(req.user.role))   return R.forbidden(res)
    next()
  }
}

export const isAdmin        = requireRole('ADMIN', 'SUPER_ADMIN')
export const isParishAdmin  = requireRole('PARISH_ADMIN', 'ADMIN', 'SUPER_ADMIN')
export const isDioceseAdmin = requireRole('DIOCESE_ADMIN', 'ADMIN', 'SUPER_ADMIN')
