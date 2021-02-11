import { VercelRequest } from '@vercel/node'
import { validateRequest } from '../_lib/request-validator'

describe('validate request', () => {
  const content = 'content'
  const title = 'title'
  const author = 'author'
  const req = {
    body: { content, title, author }
  } as VercelRequest

  describe('when valid', () => {
    it('returns the content', () => {
      const result = validateRequest(req)

      expect(result).toEqual({ success: true, content, title, author })
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

