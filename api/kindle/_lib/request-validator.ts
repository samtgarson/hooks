import type { VercelRequest } from "@vercel/node"

type ValidatorResult = {
  success: true
  body: string
  title: string
} | {
  success: false
  status: 400 | 401
  message: string
}

type RequestBody = {
  title?: string
  body?: string
}

export const validateRequest = (req: VercelRequest): ValidatorResult => {
  const { body, title } = req.body ?? {} as RequestBody

  if (!body || !title) return { success: false, status: 400, message: 'Missing required params' }

  return { success: true, body, title }
}

