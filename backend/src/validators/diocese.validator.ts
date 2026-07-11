import { z } from 'zod'

export const createDioceseSchema = z.object({
  name:       z.string().min(2).max(200).trim(),
  countryId:  z.string().optional(),
  cityId:     z.string().optional(),
  bishopName: z.string().max(200).optional(),
  email:      z.string().email().optional(),
  websiteUrl: z.string().url().optional(),
})

export const updateDioceseSchema = createDioceseSchema.partial()
