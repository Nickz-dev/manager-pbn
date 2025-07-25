import axios from 'axios'

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'

const strapi = axios.create({
  baseURL: STRAPI_URL + '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const strapiAPI = {
  // Категории
  async getCategories() {
    const res = await strapi.get('/content-categories?pagination[pageSize]=100')
    console.log('STRAPI getCategories:', res.data)
    return (res.data.data || []).map((item: any) => item)
  },
  async createCategory(data: any) {
    const res = await strapi.post('/content-categories', { data })
    return { id: res.data.data.id, ...res.data.data.attributes }
  },
  async deleteCategory(id: string) {
    await strapi.delete(`/content-categories/${id}`)
  },

  // Авторы
  async getAuthors() {
    const res = await strapi.get('/content-authors?pagination[pageSize]=100')
    console.log('STRAPI getAuthors:', res.data)
    return (res.data.data || []).map((item: any) => item)
  },
  async createAuthor(data: any) {
    const res = await strapi.post('/content-authors', { data })
    return { id: res.data.data.id, ...res.data.data.attributes }
  },
  async deleteAuthor(id: string) {
    await strapi.delete(`/content-authors/${id}`)
  },

  // Статьи
  async getArticles() {
    const res = await strapi.get('/content-articles?populate=content_categories&pagination[pageSize]=100')
    return (res.data.data || []).map((item: any) => {
      return {
        id: item.id,
        documentId: item.documentId,
        title: item.title,
        slug: item.slug,
        content: item.content,
        excerpt: item.excerpt,
        featured_image: item.featured_image,
        meta_title: item.meta_title,
        meta_description: item.meta_description,
        statusarticles: item.statusarticles,
        published: item.published,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        publishedAt: item.publishedAt,
        content_categories: (item.content_categories || []).map((cat: any) => ({
          id: cat.id,
          ...cat
        })),
      }
    })
  },

  // Статьи (только delete, остальное уже реализовано)
  async deleteArticle(id: string) {
    await strapi.delete(`/content-articles/${id}`)
  },
} 