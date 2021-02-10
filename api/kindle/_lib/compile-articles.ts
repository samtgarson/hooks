import { Article } from "./data-client"

export const compileArticles = (date: Date, articles: Article[]): { title: string, content: string } => {
	const today = date.toLocaleString('default', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	})

	const title = `Articles (${today})`
	const content = articles.reduce((doc, { title, content }) =>
		[doc, `<h2>${title}</h2>`, content].join('\n'),
		`<h1>${title}</h1>`
	)

	return { title, content }
}
