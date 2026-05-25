---
layout: page
---

# Knowledge Forge

ソフトウェアエンジニアリングにおける設計基準やベストプラクティスを一元管理するナレッジベースです。

<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from './index.data'

// カテゴリごとにナレッジをグループ化
const categories = computed(() => {
  // データがうまく読み込めなかった場合のフォールバック（エラー防止）
  if (!posts || !Array.isArray(posts)) return {}

  return posts.reduce((acc, post) => {
    const cat = post.category || 'unknown-category'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(post)
    return acc
  }, {})
})
</script>

<div v-for="(items, category) in categories" :key="category" class="category-section">
  <h2 style="text-transform: capitalize; border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 0.3em;">
    📁 {{ category.replace('-', ' ') }}
  </h2>
  <ul>
    <li v-for="item in items" :key="item.url" style="margin: 0.5rem 0;">
      <a :href="withBase(item.url)" style="font-weight: 500; color: var(--vp-c-brand-1);">
        {{ item.title }}
      </a>
    </li>
  </ul>
</div>