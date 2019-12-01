import morgan from 'morgan'
import { Request, Response } from 'express'

const LOG_FORMAT = '[:date] :method :url :status - :body'
const logger = morgan(LOG_FORMAT)

morgan.token('body', (req: Request) => `user:${req.body.user},status:${req.body.status}`)

export default (fn: Function) => async (req: Request, res: Response) => {
  await new Promise(resolve => logger(req, res, resolve))
  return fn(req, res)
}
