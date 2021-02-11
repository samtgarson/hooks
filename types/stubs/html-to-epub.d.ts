declare module 'html-to-epub' {
  export interface Chapter {
    title?: string
    author?: string
    data: string
    excludeFromToc?: boolean
    beforeToc?: boolean
    filename?: string
  }

  export interface EPubOptions {
    appendChapterTitles?: boolean,
    author: string | string[]
    cover?: string
    customHtmlTocTemplatePath?: string
    customNcxTocTemplatePath?: string
    customOpfTemplatePath?: string
    fonts?: string[]
    output?: string
    lang?: string
    publisher?: string
    title: string
    tocTitle?: string
    version?: number
    verbose?: boolean
    content: Chapter[]
  }

  interface EPubConstructor {
    new (options: EPubOptions, output?: string): Promise<void>
  }

  const EPub: EPubConstructor

  export default EPub
}
