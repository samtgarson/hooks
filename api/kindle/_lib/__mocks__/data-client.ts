export const createArticleMock = jest.fn()

export const DataClient = jest.fn(() => ({
	createArticle: createArticleMock
}))
