import type { VercelRequest } from "@vercel/node"

type ValidatorResult = {
  success: true
  content: string
  title: string
  author: string
} | {
  success: false
  status: 400 | 401
  message: string
}

type RequestBody = {
  title?: string
  content?: string
  author?: string
}

export const validateRequest = (req: VercelRequest): ValidatorResult => {
  const { content, title, author } = req.body ?? {} as RequestBody

  if (!content || !title || !author) return { success: false, status: 400, message: 'Missing required params' }

  return { success: true, content, title, author }
}

