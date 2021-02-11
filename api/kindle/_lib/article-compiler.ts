import { Article } from './data-client'
import Epub, { Chapter, EPubOptions } from 'html-to-epub'

const outputDir = process.env.KINDLE_OUTPUT_DIR

if (!outputDir) throw new Error('missing KINDLE_OUTPUT_DIR')

export class ArticleCompiler {
	constructor (
		private outputDir: string = outputDir
	) {}

	async compile (date: Date, articles: Article[]): Promise<string> {
		const today = this.dateString(date)
		const title = `Articles (${today})`
		const content = this.chapters(articles)

		const output =  `${this.outputDir}/${this.fileName(date)}.txt`
		const epubOptions: EPubOptions = {
			title,
			content,
			author: 'Robot',
			output
		}

		await new Epub(epubOptions)

		return output
	}

	private dateString (date: Date) {
		return date.toLocaleString('default', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		})
	}

	private fileName (date: Date) {
		const str = date.toISOString()
		return str.substr(0, str.indexOf('T'))
	}

	private chapters (articles: Article[]): Chapter[] {
		return articles.map(article => ({
			data: article.content,
			title: article.title,
			author: article.author
		}))
	}
}
