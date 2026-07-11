import { getPagination, buildMeta } from '../utils/pagination'
import type { Request }             from 'express'

const mockReq = (q: Record<string,string> = {}): Request => ({ query: q } as any)

describe('pagination utils', () => {
  it('usa default page=1, limit=20', () => {
    const { page, limit, skip } = getPagination(mockReq())
    expect(page).toBe(1); expect(limit).toBe(20); expect(skip).toBe(0)
  })

  it('calcola skip correttamente (page 3, limit 10)', () => {
    expect(getPagination(mockReq({ page:'3', limit:'10' })).skip).toBe(20)
  })

  it('limita limit a 100', () => {
    expect(getPagination(mockReq({ limit:'999' })).limit).toBeLessThanOrEqual(100)
  })

  it('buildMeta calcola pages', () => {
    const m = buildMeta(95, 1, 20)
    expect(m.pages).toBe(5); expect(m.hasNext).toBe(true); expect(m.hasPrev).toBe(false)
  })

  it('ultima pagina: hasNext=false hasPrev=true', () => {
    const m = buildMeta(95, 5, 20)
    expect(m.hasNext).toBe(false); expect(m.hasPrev).toBe(true)
  })
})
