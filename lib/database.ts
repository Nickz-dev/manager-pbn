import fs from 'fs-extra'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import type {
  PBNSite,
  VPSServer,
  Domain,
  GeneratedContent,
  GenerationTask,
  IndexingTask,
  Notification,
  CloudflareAccount,
  GoogleSearchConsoleAccount,
  YandexWebmasterAccount
} from '@/types'

const DATABASE_PATH = process.env.DATABASE_PATH || './data'

// Ensure database directory exists
async function ensureDbDir() {
  await fs.ensureDir(DATABASE_PATH)
}

// Load data from JSON file
async function loadData<T>(collection: string): Promise<T[]> {
  try {
    await ensureDbDir()
    const filePath = path.join(DATABASE_PATH, `${collection}.json`)
    
    if (!(await fs.pathExists(filePath))) {
      await fs.writeJson(filePath, [])
      return []
    }
    
    return await fs.readJson(filePath)
  } catch (error) {
    console.error(`Error loading ${collection}:`, error)
    return []
  }
}

// Save data to JSON file
async function saveData<T>(collection: string, data: T[]): Promise<void> {
  try {
    await ensureDbDir()
    const filePath = path.join(DATABASE_PATH, `${collection}.json`)
    await fs.writeJson(filePath, data, { spaces: 2 })
  } catch (error) {
    console.error(`Error saving ${collection}:`, error)
    throw error
  }
}

// Database class with CRUD operations
export class Database {
  // Sites operations
  static async getSites(): Promise<PBNSite[]> {
    return loadData<PBNSite>('sites')
  }

  static async getSiteById(id: string): Promise<PBNSite | null> {
    const sites = await this.getSites()
    return sites.find(site => site.id === id) || null
  }

  static async createSite(siteData: Omit<PBNSite, 'id' | 'createdAt' | 'updatedAt'>): Promise<PBNSite> {
    const sites = await this.getSites()
    const newSite: PBNSite = {
      ...siteData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    sites.push(newSite)
    await saveData('sites', sites)
    return newSite
  }

  static async updateSite(id: string, updates: Partial<PBNSite>): Promise<PBNSite | null> {
    const sites = await this.getSites()
    const index = sites.findIndex(site => site.id === id)
    if (index === -1) return null

    sites[index] = {
      ...sites[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    await saveData('sites', sites)
    return sites[index]
  }

  // VPS operations
  static async getVPSServers(): Promise<VPSServer[]> {
    return loadData<VPSServer>('vps-servers')
  }

  static async createVPS(vpsData: Omit<VPSServer, 'id' | 'createdAt'>): Promise<VPSServer> {
    const servers = await this.getVPSServers()
    const newVPS: VPSServer = {
      ...vpsData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    }
    servers.push(newVPS)
    await saveData('vps-servers', servers)
    return newVPS
  }

  // Domains operations
  static async getDomains(): Promise<Domain[]> {
    return loadData<Domain>('domains')
  }

  static async createDomain(domainData: Omit<Domain, 'id' | 'createdAt'>): Promise<Domain> {
    const domains = await this.getDomains()
    const newDomain: Domain = {
      ...domainData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    }
    domains.push(newDomain)
    await saveData('domains', domains)
    return newDomain
  }

  // Content operations
  static async getContent(): Promise<GeneratedContent[]> {
    return loadData<GeneratedContent>('content')
  }

  static async createContent(contentData: Omit<GeneratedContent, 'id' | 'createdAt'>): Promise<GeneratedContent> {
    const content = await this.getContent()
    const newContent: GeneratedContent = {
      ...contentData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    }
    content.push(newContent)
    await saveData('content', content)
    return newContent
  }

  // Tasks operations
  static async getTasks(): Promise<GenerationTask[]> {
    return loadData<GenerationTask>('tasks')
  }

  static async createTask(taskData: Omit<GenerationTask, 'id' | 'createdAt'>): Promise<GenerationTask> {
    const tasks = await this.getTasks()
    const newTask: GenerationTask = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    }
    tasks.push(newTask)
    await saveData('tasks', tasks)
    return newTask
  }

  // Notifications operations
  static async getNotifications(): Promise<Notification[]> {
    return loadData<Notification>('notifications')
  }

  static async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const notifications = await this.getNotifications()
    const newNotification: Notification = {
      ...notificationData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    }
    notifications.push(newNotification)
    await saveData('notifications', notifications)
    return newNotification
  }

  // Accounts operations
  static async getCloudflareAccounts(): Promise<CloudflareAccount[]> {
    return loadData<CloudflareAccount>('cloudflare-accounts')
  }

  static async getGoogleSearchConsoleAccounts(): Promise<GoogleSearchConsoleAccount[]> {
    return loadData<GoogleSearchConsoleAccount>('gsc-accounts')
  }

  static async getYandexWebmasterAccounts(): Promise<YandexWebmasterAccount[]> {
    return loadData<YandexWebmasterAccount>('yandex-accounts')
  }

  // Statistics for dashboard
  static async getStats() {
    const [sites, vpsServers, tasks, notifications] = await Promise.all([
      this.getSites(),
      this.getVPSServers(),
      this.getTasks(),
      this.getNotifications()
    ])

    return {
      totalSites: sites.length,
      activeSites: sites.filter(site => site.status === 'active').length,
      totalVPS: vpsServers.length,
      activeVPS: vpsServers.filter(server => server.status === 'active').length,
      pendingTasks: tasks.filter(task => task.status === 'pending').length,
      unreadNotifications: notifications.filter(n => !n.isRead).length
    }
  }
} 