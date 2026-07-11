import { R } from '../utils/response'

const mockRes = () => {
  const res: any = {}
  res.status  = jest.fn().mockReturnValue(res)
  res.json    = jest.fn().mockReturnValue(res)
  return res
}

describe('R (response utils)', () => {
  it('R.ok restituisce 200 con success:true', () => {
    const res = mockRes()
    R.ok(res, { id: 1 })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: { id: 1 } }))
  })

  it('R.created restituisce 201', () => {
    const res = mockRes()
    R.created(res, { id: 2 })
    expect(res.status).toHaveBeenCalledWith(201)
  })

  it('R.notFound restituisce 404', () => {
    const res = mockRes()
    R.notFound(res, 'non trovato')
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }))
  })

  it('R.unauthorized restituisce 401', () => {
    const res = mockRes()
    R.unauthorized(res)
    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('R.serverError restituisce 500', () => {
    const res = mockRes()
    R.serverError(res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }))
  })
})
