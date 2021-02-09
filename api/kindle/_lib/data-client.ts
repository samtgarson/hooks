import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
if (!supabaseKey || !supabaseUrl) throw new Error('Missing supabase credentials')
const client = createClient(supabaseUrl, supabaseKey)

export class DataClient {
	constructor (
		private supabase: SupabaseClient = client
	) {}

	async createArticle (title: string, content: string): Promise<void> {
		const { error } = await this.supabase
			.from('articles')
			.insert([
				{ title, content }
			], { returning: 'minimal' })

		if (error) throw error
	}
}
