import { validateRequest } from './_lib/request-validator'
import type { VercelApiHandler } from '@vercel/node'
import endpoint from '../../lib/endpoint'
import { DataClient } from './_lib/data-client'

const data = new DataClient()

const handler: VercelApiHandler = async (req, res) => {
  const result = validateRequest(req)

  if (!result.success) return res.status(result.status).json({ error: result.message })
  const { body, title } = result

  try {
    await data.createArticle(title, body)

    res.status(201).end()
  } catch (err) {
    console.error(err)
    res.status(500).end()
  }
}

export default endpoint(handler)


