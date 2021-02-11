import Index from '../index'
import { VercelApiHandler, VercelRequest, VercelResponse } from '@vercel/node'
import { validateRequest } from '../_lib/request-validator'
import { mocked } from 'ts-jest/utils'
import * as DataClient from '../_lib/data-client'
import * as MockDataClient from '../_lib/__mocks__/data-client'

jest.mock('../_lib/request-validator')
jest.mock('../_lib/data-client')
jest.mock('../../../lib/endpoint', () => (fn: VercelApiHandler) => fn)

const mockValidator = mocked(validateRequest)
const { createArticleMock } =  DataClient as unknown as typeof MockDataClient

describe('index', () => {
  const content = 'body'
  const title = 'title'
  const author = 'author'
  const req = {} as VercelRequest
  const res = { end: jest.fn(), json: jest.fn(), status: jest.fn().mockReturnThis() } as unknown as VercelResponse

  beforeEach(() => {
    mockValidator.mockReturnValue({ success: true, content, title, author })
  })

  it('succeeds', async () => {
    await Index(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.end).toHaveBeenCalled()
  })

  describe('when db fails', () => {
    beforeEach(() => {
      createArticleMock.mockRejectedValue('oh no')
    })

    it('fails', async () => {
      await Index(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.end).toHaveBeenCalled()
    })
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

