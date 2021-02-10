import '../queue'
import { CronJob } from 'quirrel/vercel'
import * as DataClient from '../_lib/data-client'
import * as MockDataClient from '../_lib/__mocks__/data-client'
import * as Mailer from '../_lib/mailer'
import * as MockMailer from '../_lib/__mocks__/mailer'
import { Article } from '../_lib/data-client'
import { compileArticles } from '../_lib/compile-articles'
import { mocked } from 'ts-jest/utils'

jest.mock('quirrel/vercel')
jest.mock('../_lib/data-client')
jest.mock('../_lib/mailer')
jest.mock('../_lib/compile-articles')

const { getUnprocessedArticlesMock, destroyProcessedArticlesMock } =  DataClient as unknown as typeof MockDataClient
const { sendEmailMock } =  Mailer as unknown as typeof MockMailer
const compileArticlesMock = mocked(compileArticles)

describe('queue', () => {
  let path: string
  let cron: string
  let job:() => Promise<void>

  beforeEach(() => {
    const res = (CronJob as jest.MockedFunction<typeof CronJob>).mock.calls[0]

    path = res[0]
    cron = res[1]
    job = res[2]
  })

  it('has the correct API path', () => {
    expect(path).toEqual('api/kindle/queue')
  })

  it('has the correct cron schedule', () => {
    expect(cron).toEqual('0 0 * * *')
  })

  describe('job', () => {
    const articles = [] as Article[]
    const title = 'title'
    const content = 'content'

    beforeEach(async () => {
      getUnprocessedArticlesMock.mockResolvedValue(articles)
      compileArticlesMock.mockReturnValue({ title, content })
      await job()
    })

    it('fetches the unprocessed articles', () => {
      expect(getUnprocessedArticlesMock).toHaveBeenCalled()
    })

    it('compiles the articles', () => {
      expect(compileArticles).toHaveBeenCalledWith(expect.any(Date), articles)
    })

    it('sends the email', () => {
      expect(sendEmailMock).toHaveBeenCalledWith(title, content)
    })

    it('destroys the articles', () => {
      expect(destroyProcessedArticlesMock).toHaveBeenCalledWith(articles)
    })
  })
})
