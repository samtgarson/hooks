import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
if (!supabaseKey || !supabaseUrl) throw new Error('Missing supabase credentials')
const client = createClient(supabaseUrl, supabaseKey)

export interface Article {
	id: string
	title: string
	content: string
	processed_at: Date
	created_at: Date
}

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

	async getUnprocessedArticles (): Promise<Article[]> {
		const { data, error } = await this.supabase
			.from<Article>('articles')
			.select('*')

		if (error) throw error

		return data ?? []
	}

	async destroyProcessedArticles (articles: Article[]): Promise<void> {
		const { error } = await this.supabase
			.from('articles')
			.delete({ returning: "minimal" })
			.in('id', articles.map(a => a.id))

		if (error) throw error
	}
}
