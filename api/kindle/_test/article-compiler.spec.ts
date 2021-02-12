import { ArticleCompiler } from '../_lib/article-compiler'
import { Article } from '../_lib/data-client'
import Fixture1 from '../../../fixtures/kindle/01.json'
import Fixture2 from '../../../fixtures/kindle/02.json'
import EPub from 'html-to-epub'

jest.mock('html-to-epub')

describe('compile articles', () => {
  const articles = [Fixture1, Fixture2] as unknown as Article[]
  const date = { toLocaleString: jest.fn(() => 'locale string'), toISOString: jest.fn(() => 'iso stringTfoo') } as unknown as Date

  const compiler = new ArticleCompiler('/path')

  it('returns the path', async () => {
    const result = await compiler.compile(date, articles)

    expect(result).toEqual('/path/iso string.txt')
  })

  it('compiles the articles', () => {
    expect(EPub).toHaveBeenCalledWith({
      author: 'Robot',
      output: '/path/iso string.txt',
      tempDir: '/path/temp',
      title: 'Articles (locale string)',
      content: [
        { title: Fixture1.title, author: Fixture1.author, data: Fixture1.content },
        { title: Fixture2.title, author: Fixture2.author, data: Fixture2.content }
      ]
    })
  })

  it('has a default value for output dir', () => {
    const compiler = new ArticleCompiler()

    expect(compiler).toHaveProperty('outputDir', process.env.KINDLE_OUTPUT_DIR)
  })
})

