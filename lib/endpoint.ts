import type { VercelApiHandler, VercelRequest, VercelResponse } from '@vercel/node'

export default (handler: VercelApiHandler) => async (req: VercelRequest, res: VercelResponse): Promise<void | VercelResponse> => {
  if (process.env.NODE_ENV === 'development') {
    const logger = await import('../lib/dev-logger')
    return logger.default(handler)(req, res)
  }

	if (req.body?.secret !== process.env.WEBHOOK_SECRET) return res
    .status(401)
    .send({ error: 'Not Authorized' })


  return handler(req, res)
}


