import { compileArticles } from '../_lib/compile-articles'
import { Article } from '../_lib/data-client'

describe('compile articles', () => {
  const articles = [
    { title: 'title1', content: 'content1' },
    { title: 'title2', content: 'content2' }
  ] as Article[]

  it('compiles the articles', () => {
    const date = new Date(2021, 1, 10, 13, 15)
    const result = compileArticles(date, articles)

    expect(result.title).toEqual('Articles (10 Feb 2021)')
    expect(result.content).toEqual('<h1>Articles (10 Feb 2021)</h1>\n<h2>title1</h2>\ncontent1\n<h2>title2</h2>\ncontent2')
  })
})

