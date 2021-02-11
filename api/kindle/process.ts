import { ArticleCompiler } from "./_lib/article-compiler"
import { DataClient } from "./_lib/data-client"
import { Mailer } from "./_lib/mailer"

const data = new DataClient()
const compiler = new ArticleCompiler()
const mailer = new Mailer()

export default async (): Promise<void> => {
  const articles = await data.getUnprocessedArticles()

  const path = await compiler.compile(new Date(), articles)

  await mailer.sendEmail(path)

  await data.destroyProcessedArticles(articles)
}
