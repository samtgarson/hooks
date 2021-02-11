import { ArticleCompiler } from '../_lib/article-compiler'
import { Article } from '../_lib/data-client'
import Fixture1 from '../../../fixtures/kindle/01.json'
import Fixture2 from '../../../fixtures/kindle/02.json'
import EPub from 'html-to-epub'

jest.mock('html-to-epub')

describe('compile articles', () => {
  const articles = [Fixture1, Fixture2] as unknown as Article[]

  const compiler = new ArticleCompiler('/path')

  it('returns the path', async () => {
    const date = new Date(2021, 1, 10, 13, 15)
    const result = await compiler.compile(date, articles)

    expect(result).toEqual('/path/2021-02-10.txt')
  })

  it('compiles the articles', () => {
    expect(EPub).toHaveBeenCalledWith({
      author: 'Robot',
      output: '/path/2021-02-10.txt',
      title: 'Articles (10 Feb 2021)',
      content: [
        { title: Fixture1.title, author: Fixture1.author, data: Fixture1.content },
        { title: Fixture2.title, author: Fixture2.author, data: Fixture2.content }
      ]
    })
  })
})

