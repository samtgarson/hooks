import { CronJob } from "quirrel/vercel"
import { ArticleCompiler } from "./_lib/article-compiler"
import { DataClient } from "./_lib/data-client"
import { Digest } from "./_lib/digest"
import { Mailer } from "./_lib/mailer"

const data = new DataClient()
const compiler = new ArticleCompiler()
const mailer = new Mailer()

export default CronJob(
  'api/kindle/queue',
  '0 0 * * *',
  async () => {
    const articles = await data.getUnprocessedArticles()

    if (!articles.length) {
      console.log("No articles today")
      return
    }

    const digest = new Digest(articles, new Date())

    const path = await compiler.compile(digest)

    await mailer.sendEmail(path)

    await data.destroyProcessedArticles(articles)
  }
)
