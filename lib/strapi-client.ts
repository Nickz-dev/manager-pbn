import axios from 'axios'
import { getStrapiUrl } from './url-utils'

const strapi = axios.create({
  baseURL: getStrapiUrl() + '/api',
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
      domain: item.domain,
      template: item.template,
      statuspbn: item.statuspbn,
      description: item.description,
      config: item.config,
      selectedArticles: item.selectedArticles,
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

  async getPbnSiteById(id: string) {
    console.log('🔍 Searching for site with ID:', id)
    
    // Сначала пробуем найти по прямому ID
    try {
      const res = await strapi.get(`/pbn-sites/${id}`)
      if (res.data.data) {
        console.log('✅ Found by direct ID:', res.data.data.id)
        return {
          id: res.data.data.id,
          documentId: res.data.data.documentId,
          name: res.data.data.name,
          siteName: res.data.data.siteName || res.data.data.name,
          domain: res.data.data.domain,
          template: res.data.data.template,
          statuspbn: res.data.data.statuspbn,
          description: res.data.data.description,
          config: res.data.data.config,
          selectedArticles: res.data.data.selectedArticles,
          url: res.data.data.url,
          status: res.data.data.status,
          createdAt: res.data.data.createdAt,
          updatedAt: res.data.data.updatedAt,
          publishedAt: res.data.data.publishedAt,
        }
      }
    } catch (error) {
      console.log('❌ Error searching by direct ID:', error instanceof Error ? error.message : String(error))
    }
    
    // Если не найдено по ID, пробуем найти по documentId
    try {
      const res = await strapi.get(`/pbn-sites?filters[documentId][$eq]=${id}`)
      if (res.data.data && res.data.data.length > 0) {
        console.log('✅ Found by documentId:', res.data.data[0].id)
        return {
          id: res.data.data[0].id,
          documentId: res.data.data[0].documentId,
          name: res.data.data[0].name,
          siteName: res.data.data[0].siteName || res.data.data[0].name,
          domain: res.data.data[0].domain,
          template: res.data.data[0].template,
          statuspbn: res.data.data[0].statuspbn,
          description: res.data.data[0].description,
          config: res.data.data[0].config,
          selectedArticles: res.data.data[0].selectedArticles,
          url: res.data.data[0].url,
          status: res.data.data[0].status,
          createdAt: res.data.data[0].createdAt,
          updatedAt: res.data.data[0].updatedAt,
          publishedAt: res.data.data[0].publishedAt,
        }
      }
    } catch (error) {
      console.log('❌ Error searching by documentId:', error instanceof Error ? error.message : String(error))
    }
    
    // Если ничего не найдено, пробуем найти среди всех сайтов
    try {
      const allSites = await this.getPbnSites()
      const foundSite = allSites.find((site: any) => 
        site.id.toString() === id || site.documentId === id
      )
      
      if (foundSite) {
        console.log('✅ Found among all sites:', foundSite.id)
        return foundSite
      }
    } catch (error) {
      console.log('❌ Error searching among all sites:', error instanceof Error ? error.message : String(error))
    }
    
    console.log('❌ Site not found')
    return null
  },

  async updatePbnSite(id: string, data: any) {
    // Сначала найдем сайт по ID, чтобы получить documentId
    const site = await this.getPbnSiteById(id)
    if (!site) {
      throw new Error(`Site with id ${id} not found`)
    }
    
    const res = await strapi.put(`/pbn-sites/${site.documentId}`, { data })
    return { id: res.data.data.id, ...res.data.data.attributes }
  },

  async deletePbnSite(id: string) {
    // Сначала найдем сайт по ID, чтобы получить documentId
    const site = await this.getPbnSiteById(id)
    if (!site) {
      throw new Error(`Site with id ${id} not found`)
    }
    
    await strapi.delete(`/pbn-sites/${site.documentId}`)
    return { success: true, deletedSite: site }
  },

  async getArticlesBySite(siteId: string) {
    const res = await strapi.get(`/content-articles?filters[pbn_site][documentId][$eq]=${siteId}&populate=*`)
    return (res.data.data || []).map((item: any) => ({
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
    }))
  },

  async getArticlesByIds(articleIds: number[]) {
    if (!articleIds || articleIds.length === 0) {
      return []
    }
    
    // Создаем фильтр для поиска статей по ID
    const filterQuery = articleIds.map(id => `filters[id][$in][]=${id}`).join('&')
    const res = await strapi.get(`/content-articles?${filterQuery}&populate=*`)
    
    return (res.data.data || []).map((item: any) => ({
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
    }))
  },
} 