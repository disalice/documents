import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  url: string
  category: string
}

declare const data: Post[]
export { data }

export default createContentLoader('**/*.md', {
  includeSrc: false, // 本文は不要なのでメタデータのみ取得
  render: false,
  transform(raw): Post[] {
    return raw
      .filter(({ url }) => url !== '/') // トップページ自身は除外
      .map(({ url, frontmatter }) => ({
        title: frontmatter.title || url,
        url,
        category: frontmatter.category || 'unknown-category'
      }))
  }
})