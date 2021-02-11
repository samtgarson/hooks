import Process from '../process'
import * as DataClient from '../_lib/data-client'
import * as MockDataClient from '../_lib/__mocks__/data-client'
import * as Mailer from '../_lib/mailer'
import * as MockMailer from '../_lib/__mocks__/mailer'
import * as ArticleCompiler from '../_lib/article-compiler'
import * as MockArticleCompiler from '../_lib/__mocks__/article-compiler'
import { Article } from '../_lib/data-client'
import { VercelRequest, VercelResponse } from '@vercel/node'

jest.mock('../_lib/data-client')
jest.mock('../_lib/mailer')
jest.mock('../_lib/article-compiler')

const { getUnprocessedArticlesMock, destroyProcessedArticlesMock } =  DataClient as unknown as typeof MockDataClient
const { sendEmailMock } =  Mailer as unknown as typeof MockMailer
const { compileMock } =  ArticleCompiler as unknown as typeof MockArticleCompiler

describe('process', () => {
  const articles = ['foo'] as unknown as Article[]
  const path = 'path'
  const req = {} as VercelRequest
  const res = { status: jest.fn().mockReturnThis(), end: jest.fn() } as unknown as VercelResponse

  beforeEach(async () => {
    jest.clearAllMocks()
  })

  describe('when there are articles', () => {
    beforeEach(async () => {
      getUnprocessedArticlesMock.mockResolvedValue(articles)
      compileMock.mockReturnValue(path)
      await Process(req, res)
    })

    it('fetches the unprocessed articles', () => {
      expect(getUnprocessedArticlesMock).toHaveBeenCalled()
    })

    it('compiles the articles', () => {
      expect(compileMock).toHaveBeenCalledWith(expect.any(Date), articles)
    })

    it('sends the email', () => {
      expect(sendEmailMock).toHaveBeenCalledWith(path)
    })

    it('destroys the articles', () => {
      expect(destroyProcessedArticlesMock).toHaveBeenCalledWith(articles)
    })

    it('ends the request', () => {
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.end).toHaveBeenCalled()
    })
  })

  describe('when there are no articles', () => {
    beforeEach(async () => {
      getUnprocessedArticlesMock.mockResolvedValue([])
      await Process(req, res)
    })

    it('fetches the unprocessed articles', () => {
      expect(getUnprocessedArticlesMock).toHaveBeenCalled()
    })

    it('halts after fetching', () => {
      expect(compileMock).not.toHaveBeenCalled()
      expect(sendEmailMock).not.toHaveBeenCalled()
      expect(destroyProcessedArticlesMock).not.toHaveBeenCalled()
    })

    it('ends the request', () => {
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.end).toHaveBeenCalled()
    })
  })
})
