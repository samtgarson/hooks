import { VercelRequest } from '@vercel/node'
import { validateRequest } from '../_lib/request-validator'

describe('validate request', () => {
  const body = 'body'
  const title = 'title'
  const req = {
    body: { body, title }
  } as VercelRequest

  describe('when valid', () => {
    it('returns the body', () => {
      const result = validateRequest(req)

      expect(result).toEqual({ success: true, body, title })
    })
  })

  describe('when invalid', () => {
    const req = {} as VercelRequest

    it('has the correct status code', () => {
      const result = validateRequest(req)

      expect(result).toEqual({ success: false, status: 400, message: 'Missing required params' })
    })
  })
})

