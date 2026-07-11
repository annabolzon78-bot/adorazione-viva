import { Router }    from 'express'
import { prisma }    from '../config/database'
import { R }         from '../utils/response'
import { authenticate, isAdmin } from '../middleware/auth'
import { validate }  from '../middleware/validate'
import { createDioceseSchema, updateDioceseSchema } from '../validators/diocese.validator'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const dioceses = await prisma.diocese.findMany({
      where: req.query.countryId ? { countryId: req.query.countryId as string } : {},
      include: {
        country: { select: { nameIt: true, flagEmoji: true } },
        city:    { select: { name: true } },
        _count:  { select: { parishes: true } },
      },
      orderBy: { name: 'asc' },
    })
    return R.ok(res, dioceses)
  } catch { return R.serverError(res) }
})

router.get('/:id', async (req, res) => {
  try {
    const diocese = await prisma.diocese.findUniqueOrThrow({
      where:   { id: req.params.id },
      include: {
        country:  true,
        city:     true,
        parishes: { select: { id: true, name: true, hasAdoration: true, status: true } },
      },
    })
    return R.ok(res, diocese)
  } catch { return R.notFound(res, 'Diocesi non trovata') }
})

router.post('/', authenticate, isAdmin,
  validate(createDioceseSchema),
  async (req, res) => {
    try { return R.created(res, await prisma.diocese.create({ data: req.body })) }
    catch { return R.serverError(res) }
  }
)

router.patch('/:id', authenticate, isAdmin,
  validate(updateDioceseSchema),
  async (req, res) => {
    try {
      return R.ok(res, await prisma.diocese.update({
        where: { id: req.params.id },
        data:  req.body,
      }))
    } catch { return R.notFound(res, 'Diocesi non trovata') }
  }
)

export default router
