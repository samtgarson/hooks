import Index from '../index'
import { VercelApiHandler, VercelRequest, VercelResponse } from '@vercel/node'
import { validateRequest } from '../_lib/request-validator'
import { mocked } from 'ts-jest/utils'

jest.mock('../_lib/request-validator')
jest.mock('../../../lib/endpoint', () => (fn: VercelApiHandler) => fn)

const mockValidator = mocked(validateRequest)

describe('index', () => {
  const body = 'body'
  const title = 'title'
  const req = {} as VercelRequest
  const res = { end: jest.fn(), json: jest.fn(), status: jest.fn().mockReturnThis() } as unknown as VercelResponse

  beforeEach(() => {
    mockValidator.mockReturnValue({ success: true, body, title })
  })

  it('succeeds', async () => {
    await Index(req, res)

    expect(res.status).toHaveBeenCalledWith(202)
    expect(res.end).toHaveBeenCalled()
  })

  describe('when invalid params', () => {
    const message = 'message'

    beforeEach(() => {
      mockValidator.mockReturnValue({ success: false, status: 400, message })
    })

    it('fails', async () => {
      await Index(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: message })
    })
  })
})

