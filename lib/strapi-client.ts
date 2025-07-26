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
    return (res.data.data || []).map((item: any) => ({
      id: item.id,
      documentId: item.documentId,
      name: item.name,
      slug: item.slug,
      color: item.color,
      description: item.description,
      icon: item.icon,
      sort_order: item.sort_order,
      is_active: item.is_active,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      publishedAt: item.publishedAt,
    }))
  },
  async createCategory(data: any) {
    const res = await strapi.post('/content-categories', { data })
    return { id: res.data.data.id, ...res.data.data.attributes }
  },
  async updateCategory(documentId: string, data: any) {
    // Исключаем поля, которые не должны обновляться
    const { id: _, documentId: __, createdAt: ___, updatedAt: ____, publishedAt: _____, ...updateData } = data
    const res = await strapi.put(`/content-categories/${documentId}`, { data: updateData })
    return { id: res.data.data.id, ...res.data.data.attributes }
  },
  async deleteCategory(documentId: string) {
    await strapi.delete(`/content-categories/${documentId}`)
  },

  // Авторы
  async getAuthors() {
    const res = await strapi.get('/content-authors?pagination[pageSize]=100')
    return (res.data.data || []).map((item: any) => ({
      id: item.id,
      documentId: item.documentId,
      name: item.name,
      slug: item.slug,
      email: item.email,
      bio: item.bio,
      avatar: item.avatar,
      website: item.website,
      social_links: item.social_links,
      specialization: item.specialization,
      is_active: item.is_active,
      experience_years: item.experience_years,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      publishedAt: item.publishedAt,
    }))
  },
  async createAuthor(data: any) {
    const res = await strapi.post('/content-authors', { data })
    return { id: res.data.data.id, ...res.data.data.attributes }
  },
  async updateAuthor(documentId: string, data: any) {
    // Исключаем поля, которые не должны обновляться
    const { id: _, documentId: __, createdAt: ___, updatedAt: ____, publishedAt: _____, ...updateData } = data
    const res = await strapi.put(`/content-authors/${documentId}`, { data: updateData })
    return { id: res.data.data.id, ...res.data.data.attributes }
  },
  async deleteAuthor(documentId: string) {
    await strapi.delete(`/content-authors/${documentId}`)
  },

  // Статьи
  async getArticles() {
    const res = await strapi.get('/content-articles?populate=*&pagination[pageSize]=100')
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
        content_author: item.content_author ? {
          id: item.content_author.id,
          ...item.content_author
        } : null,
        pbn_site: item.pbn_site ? {
          id: item.pbn_site.id,
          documentId: item.pbn_site.documentId,
          ...item.pbn_site
        } : null,
      }
    })
  },

  async createArticle(data: any) {
    const res = await strapi.post('/content-articles', { data })
    return { id: res.data.data.id, ...res.data.data.attributes }
  },

  async updateArticle(documentId: string, data: any) {
    // Исключаем поля, которые не должны обновляться
    const { id: _, documentId: __, createdAt: ___, updatedAt: ____, publishedAt: _____, ...updateData } = data
    const res = await strapi.put(`/content-articles/${documentId}`, { data: updateData })
    return { id: res.data.data.id, ...res.data.data.attributes }
  },
  async deleteArticle(documentId: string) {
    const res = await strapi.delete(`/content-articles/${documentId}`)
    return res
  },

  // PBN сайты для привязки к статьям
  async getPbnSites() {
    const res = await strapi.get('/pbn-sites?pagination[pageSize]=100')
    return (res.data.data || []).map((item: any) => ({
      id: item.id,
      documentId: item.documentId,
      name: item.name,
      siteName: item.siteName || item.name, // Добавляем siteName для совместимости
      url: item.url,
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      publishedAt: item.publishedAt,
    }))
  },

  async createPbnSite(data: any) {
    const res = await strapi.post('/pbn-sites', { data })
    return { id: res.data.data.id, ...res.data.data.attributes }
  },
} 