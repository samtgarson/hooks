import { CronJob } from "quirrel/vercel"
import { compileArticles } from "./_lib/compile-articles"
import { DataClient } from "./_lib/data-client"
import { Mailer } from "./_lib/mailer"

const data = new DataClient()
const mailer = new Mailer()

export default CronJob(
  'api/kindle/queue',
  '0 0 * * *',
  async () => {
    const articles = await data.getUnprocessedArticles()

    const { title, content } = compileArticles(new Date(), articles)

    await mailer.sendEmail(title, content)

    await data.destroyProcessedArticles(articles)
  }
)
