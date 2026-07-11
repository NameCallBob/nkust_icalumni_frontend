/**
 * SEO 輔助工具
 * 提供 SEO 相關的實用函數
 */

/**
 * 生成 SEO 友善的 URL slug
 * @param {string} text - 要轉換的文字
 * @returns {string} URL slug
 */
export const slugify = (text) => {
  if (!text) return '';

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')  // 替換空白和特殊字符為連字符
    .replace(/^-+|-+$/g, '');    // 移除開頭和結尾的連字符
};

/**
 * 截斷文字並加上省略號
 * @param {string} text - 要截斷的文字
 * @param {number} maxLength - 最大長度
 * @returns {string} 截斷後的文字
 */
export const truncateText = (text, maxLength = 160) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * 生成 meta description
 * @param {string} description - 描述文字
 * @param {string} fallback - 備用文字
 * @returns {string} 優化的 meta description
 */
export const generateMetaDescription = (description, fallback = '') => {
  const text = description || fallback;
  return truncateText(text, 160); // Google 建議 160 字符以內
};

/**
 * 生成頁面標題
 * @param {string} pageTitle - 頁面標題
 * @param {string} siteName - 網站名稱
 * @returns {string} 完整的頁面標題
 */
export const generatePageTitle = (pageTitle, siteName = '國立高雄科技大學智慧商務系系友會') => {
  if (!pageTitle) return siteName;

  // 檢查標題長度，Google 建議 60 字符以內
  const fullTitle = `${pageTitle} | ${siteName}`;
  if (fullTitle.length > 60) {
    return `${pageTitle} | 智商系友會`;
  }
  return fullTitle;
};

/**
 * 生成結構化數據
 * @param {string} type - 數據類型
 * @param {object} data - 數據內容
 * @returns {object} JSON-LD 格式的結構化數據
 */
export const generateStructuredData = (type, data) => {
  const baseContext = {
    "@context": "https://schema.org"
  };

  switch (type) {
    case 'organization':
      return {
        ...baseContext,
        "@type": "Organization",
        "name": data.name,
        "url": data.website,
        "logo": data.logo,
        "description": data.description,
        "address": data.address ? {
          "@type": "PostalAddress",
          "streetAddress": data.address
        } : undefined,
        "telephone": data.phone,
        "email": data.email
      };

    case 'person':
      return {
        ...baseContext,
        "@type": "Person",
        "name": data.name,
        "jobTitle": data.position,
        "worksFor": data.company ? {
          "@type": "Organization",
          "name": data.company
        } : undefined,
        "alumniOf": {
          "@type": "EducationalOrganization",
          "name": "國立高雄科技大學智慧商務系"
        }
      };

    case 'article':
      return {
        ...baseContext,
        "@type": "Article",
        "headline": data.title,
        "description": data.description,
        "datePublished": data.publishDate,
        "dateModified": data.modifiedDate || data.publishDate,
        "author": {
          "@type": "Organization",
          "name": "國立高雄科技大學智慧商務系系友會"
        },
        "publisher": {
          "@type": "Organization",
          "name": "國立高雄科技大學智慧商務系系友會",
          "logo": {
            "@type": "ImageObject",
            "url": "https://nkusticalumni.org/logo.png"
          }
        },
        "image": data.image
      };

    case 'jobPosting':
      return {
        ...baseContext,
        "@type": "JobPosting",
        "title": data.title,
        "description": data.description,
        "datePosted": data.postDate,
        "validThrough": data.expiryDate,
        "employmentType": data.employmentType || "FULL_TIME",
        "hiringOrganization": {
          "@type": "Organization",
          "name": data.company
        },
        "jobLocation": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": data.location
          }
        },
        "baseSalary": data.salary ? {
          "@type": "MonetaryAmount",
          "currency": "TWD",
          "value": {
            "@type": "QuantitativeValue",
            "value": data.salary
          }
        } : undefined
      };

    case 'breadcrumb':
      return {
        ...baseContext,
        "@type": "BreadcrumbList",
        "itemListElement": data.items.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": item.url
        }))
      };

    default:
      return baseContext;
  }
};

/**
 * 生成 Open Graph 標籤數據
 * @param {object} data - OG 標籤數據
 * @returns {object} Open Graph 標籤對象
 */
export const generateOpenGraphTags = (data) => {
  return {
    'og:title': data.title,
    'og:description': data.description,
    'og:image': data.image || 'https://nkusticalumni.org/og-image.jpg',
    'og:url': data.url,
    'og:type': data.type || 'website',
    'og:site_name': '國立高雄科技大學智慧商務系系友會',
    'og:locale': 'zh_TW'
  };
};

/**
 * 解析和優化關鍵字
 * @param {string|array} keywords - 關鍵字
 * @returns {string} 優化的關鍵字字串
 */
export const optimizeKeywords = (keywords) => {
  const baseKeywords = ['國立高雄科技大學', '智慧商務系', '智商系', '系友會', 'NKUST'];

  let keywordArray = [];

  if (typeof keywords === 'string') {
    keywordArray = keywords.split(',').map(k => k.trim());
  } else if (Array.isArray(keywords)) {
    keywordArray = keywords;
  }

  // 合併並去重
  const allKeywords = [...new Set([...keywordArray, ...baseKeywords])];

  // 限制關鍵字數量（建議不超過 10 個）
  return allKeywords.slice(0, 10).join(', ');
};

/**
 * 檢查 URL 是否為絕對路徑
 * @param {string} url - URL 字串
 * @returns {boolean} 是否為絕對路徑
 */
export const isAbsoluteUrl = (url) => {
  return /^https?:\/\//.test(url);
};

/**
 * 生成規範化 URL
 * @param {string} path - 路徑
 * @param {string} baseUrl - 基礎 URL
 * @returns {string} 完整的規範化 URL
 */
export const generateCanonicalUrl = (path, baseUrl = 'https://nkusticalumni.org') => {
  if (isAbsoluteUrl(path)) return path;

  // 確保路徑以 / 開頭
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // 移除尾部斜線（除了根路徑）
  const finalPath = cleanPath.length > 1 && cleanPath.endsWith('/')
    ? cleanPath.slice(0, -1)
    : cleanPath;

  return `${baseUrl}${finalPath}`;
};

/**
 * 生成社交媒體分享連結
 * @param {string} platform - 平台名稱
 * @param {object} data - 分享數據
 * @returns {string} 分享連結
 */
export const generateShareUrl = (platform, data) => {
  const encodedUrl = encodeURIComponent(data.url);
  const encodedTitle = encodeURIComponent(data.title);
  const encodedDescription = encodeURIComponent(data.description || '');

  switch (platform) {
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;

    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`;

    case 'line':
      return `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`;

    case 'email':
      return `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`;

    default:
      return data.url;
  }
};

/**
 * 驗證 SEO 必要欄位
 * @param {object} seoData - SEO 數據
 * @returns {array} 缺失的欄位列表
 */
export const validateSeoFields = (seoData) => {
  const requiredFields = ['title', 'description', 'keywords'];
  const missingFields = [];

  requiredFields.forEach(field => {
    if (!seoData[field] || seoData[field].length === 0) {
      missingFields.push(field);
    }
  });

  // 檢查標題長度
  if (seoData.title && seoData.title.length > 60) {
    missingFields.push('title_too_long');
  }

  // 檢查描述長度
  if (seoData.description && seoData.description.length > 160) {
    missingFields.push('description_too_long');
  }

  return missingFields;
};

const seoHelper = {
  slugify,
  truncateText,
  generateMetaDescription,
  generatePageTitle,
  generateStructuredData,
  generateOpenGraphTags,
  optimizeKeywords,
  isAbsoluteUrl,
  generateCanonicalUrl,
  generateShareUrl,
  validateSeoFields
};

export default seoHelper;