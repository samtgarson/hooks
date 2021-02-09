import { SupabaseClient } from '@supabase/supabase-js'
import { DataClient } from '../_lib/data-client'

const from = jest.fn()
const insert = jest.fn()
const mockSupabase = {
  from: from.mockReturnThis(),
  insert: insert.mockResolvedValue({})
} as unknown as SupabaseClient

describe('data client', () => {
  let sot: DataClient
  const title = 'i am a title'
  const content = 'i am a content'

  beforeEach(() => {
    sot = new DataClient(mockSupabase)
  })

  describe('createArticle', () => {
    it('creates the resource', async () => {
      await sot.createArticle(title, content)

      expect(from).toHaveBeenCalledWith('articles')
      expect(insert).toHaveBeenCalledWith([{ title, content }], { returning: 'minimal' })
    })

    describe('when it fails', () => {
      const error = new Error('foo')
      beforeEach(() => {
        insert.mockResolvedValueOnce({ error })
      })

      it('throws the error', () => {
        expect(() => sot.createArticle(title, content)).rejects.toEqual(error)
      })
    })
  })
})
