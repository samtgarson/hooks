import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ArticleCompiler } from "./_lib/article-compiler"
import { DataClient } from "./_lib/data-client"
import { Mailer } from "./_lib/mailer"

const data = new DataClient()
const compiler = new ArticleCompiler()
const mailer = new Mailer()

const handler = async (_: VercelRequest, res: VercelResponse): Promise<void> => {
  const articles = await data.getUnprocessedArticles()

  if (!articles.length) return res.status(200).end()

  const path = await compiler.compile(new Date(), articles)
  await mailer.sendEmail(path)
  await data.destroyProcessedArticles(articles)

  res.status(200).end()
}

export default handler
