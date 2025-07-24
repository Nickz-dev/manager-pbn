// ============= ОСНОВНЫЕ ТИПЫ =============

export interface PBNSite {
  id: string;
  name: string;
  domain: string;
  siteType: 'pbn' | 'brand';
  status: 'active' | 'inactive' | 'building' | 'error';
  vpsId: string;
  createdAt: string;
  updatedAt: string;
  config: SiteConfig;
}

export interface SiteConfig {
  template: string;
  theme: string;
  language: string;
  seoConfig: SEOConfig;
  aiConfig?: AIConfig;
  linkConfig?: LinkConfig;
  brandConfig?: BrandConfig;
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  favicon: string;
  ogImage?: string;
}

export interface AIConfig {
  enabled: boolean;
  model: string;
  maxTokens: number;
  temperature: number;
  prompts: {
    articles: string;
    pages: string;
    meta: string;
  };
}

export interface LinkConfig {
  clusterId?: string;
  internalLinksCount: number;
  externalLinksCount: number;
  crossLinksEnabled: boolean;
  anchorStrategy: 'keyword' | 'branded' | 'mixed';
}

export interface BrandConfig {
  features: string[];
  paymentEnabled: boolean;
  authEnabled: boolean;
  contactForm: boolean;
  analytics: boolean;
}

// ============= VPS И ИНФРАСТРУКТУРА =============

export interface VPSServer {
  id: string;
  name: string;
  ip: string;
  hostname: string;
  provider: string;
  sshUser: string;
  sshPort: number;
  sshKeyPath?: string;
  status: 'active' | 'inactive' | 'maintenance';
  specs: {
    cpu: string;
    ram: string;
    storage: string;
    bandwidth: string;
  };
  sites: string[];
  createdAt: string;
  lastChecked?: string;
}

export interface Domain {
  id: string;
  name: string;
  registrar: string;
  expiresAt: string;
  status: 'active' | 'pending' | 'expired';
  vpsId: string;
  cloudflareAccountId?: string;
  dnsRecords: DNSRecord[];
  sslEnabled: boolean;
  createdAt: string;
}

export interface DNSRecord {
  type: 'A' | 'CNAME' | 'MX' | 'TXT';
  name: string;
  value: string;
  ttl: number;
  proxied?: boolean;
}

// ============= АККАУНТЫ =============

export interface CloudflareAccount {
  id: string;
  email: string;
  apiKey: string;
  accountName: string;
  zonesCount: number;
  status: 'active' | 'suspended' | 'limited';
  lastUsed?: string;
  createdAt: string;
}

export interface GoogleSearchConsoleAccount {
  id: string;
  email: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  sitesCount: number;
  quotaUsed: number;
  quotaLimit: number;
  status: 'active' | 'suspended' | 'quota_exceeded';
  lastUsed?: string;
  createdAt: string;
}

export interface YandexWebmasterAccount {
  id: string;
  userId: string;
  apiKey: string;
  accountName: string;
  sitesCount: number;
  quotaUsed: number;
  quotaLimit: number;
  status: 'active' | 'suspended' | 'quota_exceeded';
  lastUsed?: string;
  createdAt: string;
}

// ============= ИНДЕКСАЦИЯ =============

export interface IndexingTask {
  id: string;
  siteId: string;
  type: 'sitemap' | 'url_list' | 'single_url';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  urls: IndexingUrl[];
  gscAccountId?: string;
  yandexAccountId?: string;
  createdAt: string;
  completedAt?: string;
  errors?: string[];
}

export interface IndexingUrl {
  url: string;
  status: 'pending' | 'submitted' | 'indexed' | 'error';
  submittedAt?: string;
  indexedAt?: string;
  error?: string;
}

// ============= КОНТЕНТ И ГЕНЕРАЦИЯ =============

export interface GeneratedContent {
  id: string;
  siteId: string;
  type: 'article' | 'page' | 'product';
  title: string;
  content: string;
  slug: string;
  meta: {
    description: string;
    keywords: string[];
  };
  aiGenerated: boolean;
  aiModel?: string;
  aiPrompt?: string;
  status: 'draft' | 'published';
  createdAt: string;
}

export interface GenerationTask {
  id: string;
  siteId: string;
  type: 'content' | 'site' | 'rebuild';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  params: Record<string, any>;
  result?: any;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

// ============= STRAPI ИНТЕГРАЦИЯ =============

export interface StrapiConfig {
  id: string;
  name: string;
  url: string;
  apiToken: string;
  collections: {
    articles: string;
    pages: string;
    domains: string;
    crossLinks: string;
  };
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  createdAt: string;
}

export interface CrossLink {
  id: string;
  fromSiteId: string;
  toSiteId: string;
  fromUrl: string;
  toUrl: string;
  anchorText: string;
  linkType: 'internal' | 'external' | 'cross_domain';
  clusterId?: string;
  weight: number;
  position: 'content' | 'sidebar' | 'footer';
  context: string;
  isActive: boolean;
  createdAt: string;
}

export interface LinkCluster {
  id: string;
  name: string;
  description: string;
  siteIds: string[];
  strategy: 'wheel' | 'pyramid' | 'network' | 'custom';
  rules: LinkRule[];
  isActive: boolean;
  createdAt: string;
}

export interface LinkRule {
  fromSiteType: 'pbn' | 'brand' | 'any';
  toSiteType: 'pbn' | 'brand' | 'any';
  maxLinksPerSite: number;
  anchorStrategy: 'keyword' | 'branded' | 'mixed';
  weight: number;
}

// ============= УВЕДОМЛЕНИЯ И МОНИТОРИНГ =============

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedEntity?: {
    type: 'site' | 'vps' | 'domain' | 'task';
    id: string;
  };
}

export interface SystemMonitoring {
  timestamp: string;
  metrics: {
    totalSites: number;
    activeSites: number;
    buildQueue: number;
    indexingQueue: number;
    vpsStatus: Record<string, 'online' | 'offline'>;
    accountsStatus: {
      cloudflare: number;
      gsc: number;
      yandex: number;
    };
  };
}

// ============= РАЗВЕРТЫВАНИЕ =============

export interface DeploymentTask {
  id: string;
  siteId: string;
  vpsId: string;
  type: 'initial' | 'update' | 'rebuild';
  status: 'pending' | 'deploying' | 'completed' | 'failed';
  steps: DeploymentStep[];
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface DeploymentStep {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  logs?: string[];
  error?: string;
}

// ============= БАЗЫ ДАННЫХ =============

export interface DatabaseCollections {
  sites: PBNSite[];
  vpsServers: VPSServer[];
  domains: Domain[];
  content: GeneratedContent[];
  tasks: GenerationTask[];
  indexingTasks: IndexingTask[];
  deploymentTasks: DeploymentTask[];
  notifications: Notification[];
  cloudflareAccounts: CloudflareAccount[];
  gscAccounts: GoogleSearchConsoleAccount[];
  yandexAccounts: YandexWebmasterAccount[];
  strapiConfigs: StrapiConfig[];
  crossLinks: CrossLink[];
  linkClusters: LinkCluster[];
} 