# 🔗 Схема отношений между коллекциями Strapi (ОБНОВЛЕНО)

## 🚨 **ВАЖНО: Правильные API ID имена**

**❌ ЗАПРЕЩЕННЫЕ имена в Strapi:**
- `sites` → используем `pbn-sites`
- `categories` → используем `content-categories` 
- `articles` → используем `content-articles`
- `authors` → можно, но лучше `content-authors`

---

## 📋 **ОСНОВНЫЕ КОЛЛЕКЦИИ (с правильными API ID):**

1. **`content-categories`** - Категории контента
2. **`content-authors`** - Авторы  
3. **`pbn-sites`** - PBN сайты
4. **`content-articles`** - Статьи

---

## 🔗 **СХЕМА ОТНОШЕНИЙ:**

### 1. **CONTENT-ARTICLES → CONTENT-CATEGORIES**
```
Отношение: Many to One (Много статей → Одна категория)

В коллекции CONTENT-ARTICLES добавить поле:
┌─────────────────────────────────────┐
│ Field name: category                │
│ Field type: Relation                │
│ Relation type: Many to One          │
│ Target: Content Categories          │
│ Display name: Category              │
└─────────────────────────────────────┘
```

### 2. **CONTENT-ARTICLES → CONTENT-AUTHORS**
```
Отношение: Many to One (Много статей → Один автор)

В коллекции CONTENT-ARTICLES добавить поле:
┌─────────────────────────────────────┐
│ Field name: author                  │
│ Field type: Relation                │
│ Relation type: Many to One          │
│ Target: Content Authors             │
│ Display name: Author                │
└─────────────────────────────────────┘
```

### 3. **CONTENT-ARTICLES → PBN-SITES**
```
Отношение: Many to One (Много статей → Один сайт)

В коллекции CONTENT-ARTICLES добавить поле:
┌─────────────────────────────────────┐
│ Field name: site                    │
│ Field type: Relation                │
│ Relation type: Many to One          │
│ Target: Pbn Sites                   │
│ Display name: Site                  │
└─────────────────────────────────────┘
```

### 4. **PBN-SITES → CONTENT-AUTHORS** (Опционально)
```
Отношение: Many to Many (Много сайтов ↔ Много авторов)

В коллекции PBN-SITES добавить поле:
┌─────────────────────────────────────┐
│ Field name: authors                 │
│ Field type: Relation                │
│ Relation type: Many to Many         │
│ Target: Content Authors             │
│ Display name: Authors               │
└─────────────────────────────────────┘
```

---

## 🎯 **ДЕТАЛЬНАЯ СТРУКТУРА КОЛЛЕКЦИЙ:**

### **📄 CONTENT-ARTICLES (главная коллекция)**
```
Display name: Content Article
API ID (Singular): content-article
API ID (Plural): content-articles

Fields:
├── title (Text, Required, Max: 255)
├── slug (Text, Required, Unique, Max: 255)
├── content (Rich text, Required)
├── excerpt (Long text, Max: 500)
├── featured_image (Text, Max: 500)
├── meta_title (Text, Max: 60)
├── meta_description (Text, Max: 160)
├── statusArticles (Enumeration, Required, Default: draft)
│   └── Values: draft, published, archived
├── published_at (DateTime)
├── created_at (DateTime, автоматически)
├── updated_at (DateTime, автоматически)
├── category (Relation → Content Categories)
├── author (Relation → Content Authors)
└── site (Relation → Pbn Sites)
```

### **🏷️ CONTENT-CATEGORIES**
```
Display name: Content Category
API ID (Singular): content-category
API ID (Plural): content-categories

Fields:
├── name (Text, Required, Unique, Max: 100)
├── slug (Text, Required, Unique, Max: 100)
├── color (Text, Default: #3B82F6, Max: 7)
├── description (Long text, Max: 300)
├── icon (Text, Max: 50)
├── sort_order (Number, Default: 0)
├── is_active (Boolean, Default: true)
├── created_at (DateTime, автоматически)
├── updated_at (DateTime, автоматически)
└── content_articles (автоматически - обратная связь)
```

### **👤 CONTENT-AUTHORS**
```
Display name: Content Author
API ID (Singular): content-author
API ID (Plural): content-authors

Fields:
├── name (Text, Required, Max: 100)
├── slug (Text, Required, Unique, Max: 100)
├── email (Email, Required, Unique)
├── bio (Long text, Max: 1000)
├── avatar (Text, Max: 500)
├── website (Text, Max: 255)
├── social_links (JSON)
├── specialization (Enumeration)
│   └── Values: casino, sports, crypto, finance, general
├── is_active (Boolean, Default: true)
├── experience_years (Number, Default: 0)
├── created_at (DateTime, автоматически)
├── updated_at (DateTime, автоматически)
├── content_articles (автоматически - обратная связь)
└── pbn_sites (Relation → Pbn Sites, если Many to Many)
```

### **🌐 PBN-SITES**
```
Display name: PBN Site
API ID (Singular): pbn-site
API ID (Plural): pbn-sites

Fields:
├── name (Text, Required, Max: 100)
├── slug (Text, Required, Unique, Max: 100)
├── domain (Text, Required, Unique, Max: 255)
├── template (Enumeration, Required, Default: blog)
│   └── Values: blog, news, review, casino-premium, casino-standard
├── status (Enumeration, Required, Default: draft)
│   └── Values: draft, building, deployed, error, maintenance
├── config (JSON)
├── description (Long text, Max: 500)
├── language (Text, Default: en, Max: 5)
├── timezone (Text, Default: UTC, Max: 50)
├── analytics_id (Text, Max: 50)
├── ssl_enabled (Boolean, Default: true)
├── cdn_enabled (Boolean, Default: false)
├── backup_enabled (Boolean, Default: true)
├── created_at (DateTime, автоматически)
├── updated_at (DateTime, автоматически)
├── deployed_at (DateTime)
├── last_build_at (DateTime)
├── content_articles (автоматически - обратная связь)
└── content_authors (Relation → Content Authors, Many to Many)
```

---

## 🔧 **ПРАВИЛЬНЫЙ ПОРЯДОК СОЗДАНИЯ:**

### **ШАГ 1: Создать базовые коллекции БЕЗ отношений**

#### 1.1 **content-categories**
```
Display name: Content Category
API ID (Singular): content-category
API ID (Plural): content-categories

Поля:
- name (Text, Required, Unique)
- slug (Text, Required, Unique) 
- color (Text, Default: #3B82F6)
- description (Long text)
- icon (Text)
- sort_order (Number, Default: 0)
- is_active (Boolean, Default: true)
```

#### 1.2 **content-authors**
```
Display name: Content Author
API ID (Singular): content-author
API ID (Plural): content-authors

Поля:
- name (Text, Required)
- slug (Text, Required, Unique)
- email (Email, Required, Unique)
- bio (Long text)
- avatar (Text)
- website (Text)
- social_links (JSON)
- specialization (Enumeration: casino, sports, crypto, finance, general)
- is_active (Boolean, Default: true)
- experience_years (Number, Default: 0)
```

#### 1.3 **pbn-sites**
```
Display name: PBN Site
API ID (Singular): pbn-site  
API ID (Plural): pbn-sites

Поля:
- name (Text, Required)
- slug (Text, Required, Unique)
- domain (Text, Required, Unique)
- template (Enumeration: blog, news, review, casino-premium, casino-standard)
- statuspbn (Enumeration: draft, building, deployed, error, maintenance)
- config (JSON)
- description (Long text)
- language (Text, Default: en)
- timezone (Text, Default: UTC)
- analytics_id (Text)
- ssl_enabled (Boolean, Default: true)
- cdn_enabled (Boolean, Default: false)
- backup_enabled (Boolean, Default: true)
- deployed_at (DateTime)
- last_build_at (DateTime)
```

#### 1.4 **content-articles**
```
Display name: Content Article
API ID (Singular): content-article
API ID (Plural): content-articles

Поля:
- title (Text, Required)
- slug (Text, Required, Unique)
- content (Rich text, Required)
- excerpt (Long text)
- featured_image (Text)
- meta_title (Text)
- meta_description (Text)
- statusarticles (Enumeration: draft, published, archived, Default: draft)
- published (DateTime)
```

### **ШАГ 2: Добавить отношения в CONTENT-ARTICLES**
1. Редактировать `content-articles` → добавить `category` (Many to One → Content Categories)
2. Редактировать `content-articles` → добавить `author` (Many to One → Content Authors)
3. Редактировать `content-articles` → добавить `site` (Many to One → Pbn Sites)

### **ШАГ 3: Добавить дополнительные отношения**
1. Редактировать `pbn-sites` → добавить `content_authors` (Many to Many → Content Authors)

---

## 📝 **КОНКРЕТНЫЕ НАСТРОЙКИ В UI:**

### **Enumeration поля:**

#### Template (в pbn-sites):
```
Values:
- blog (Blog Template)
- news (News Template)  
- review (Review Template)
- casino-premium (Casino Premium)
- casino-standard (Casino Standard)
```

#### Status (в pbn-sites):
```
Values:
- draft (Draft)
- building (Building)
- deployed (Deployed)
- error (Error)
- maintenance (Maintenance)
```

#### Status (в content-articles):
```
Values:
- draft (Draft)
- published (Published)
- archived (Archived)
```

#### Specialization (в content-authors):
```
Values:
- casino (Casino Expert)
- sports (Sports Analyst)
- crypto (Crypto Expert)
- finance (Finance Writer)
- general (General Writer)
```

---

## 📊 **РЕЗУЛЬТИРУЮЩИЙ API:**

### **Правильные endpoints:**
```
GET /api/content-categories
GET /api/content-authors
GET /api/pbn-sites
GET /api/content-articles
```

### **API с populate:**
```
GET /api/content-articles?populate[category]=*&populate[author]=*&populate[site]=*
```

### **Ответ API:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Лучшие казино 2024",
        "slug": "best-casinos-2024",
        "content": "...",
        "status": "published",
        "category": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "Casino",
              "slug": "casino",
              "color": "#FF6B6B"
            }
          }
        },
        "author": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "John Doe",
              "email": "john@example.com",
              "specialization": "casino"
            }
          }
        },
        "site": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "Casino Blog",
              "domain": "casino-blog.com",
              "template": "casino-premium",
              "status": "deployed"
            }
          }
        }
      }
    }
  ]
}
```

---

## 🚨 **КРИТИЧЕСКИЕ МОМЕНТЫ:**

1. **🔥 ОБЯЗАТЕЛЬНО использовать правильные API ID!**
2. **📝 Все имена в kebab-case**
3. **🚫 Избегать зарезервированных слов Strapi**
4. **✅ Добавлять slug поля для SEO**
5. **🔗 Создавать отношения ПОСЛЕ базовых коллекций**
6. **📊 Использовать JSON для сложных конфигов**

---

**Теперь API будет работать правильно с этими именами! 🚀** 