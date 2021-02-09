import { validateRequest } from './_lib/request-validator'
import { VercelApiHandler, VercelRequest, VercelResponse } from '@vercel/node'
import endpoint from '../../lib/endpoint'
import { Mailer } from './_lib/mailer'

const mailer = new Mailer()

const handler: VercelApiHandler = async (req, res) => {
  const result = validateRequest(req)

  if (!result.success) return res.status(result.status).json({ error: result.message })
  const { body, title } = result

  await mailer.sendEmail(title, body)

  res.status(202).end()
}

export default endpoint(handler)


