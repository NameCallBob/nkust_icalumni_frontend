/**
 * SEO 輔助函數。
 *
 * 這些是純函數，但它們的輸出會直接進到 <title>、<meta>、JSON-LD 與 sitemap——
 * 錯了不會有任何 runtime 錯誤，只會安靜地讓搜尋結果變差好幾個月才被發現。
 * 純函數又特別好測，所以這裡是投報率最高的測試之一。
 */
import {
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
  validateSeoFields,
} from '../seoHelper';

describe('slugify', () => {
  it('把空白與特殊字元轉成連字符', () => {
    expect(slugify('Hello World')).toBe('hello-world');
    expect(slugify('Front End & Back End')).toBe('front-end-back-end');
  });

  it('移除開頭與結尾多餘的連字符', () => {
    expect(slugify('  spaced out  ')).toBe('spaced-out');
    expect(slugify('---weird---')).toBe('weird');
  });

  it('對空值回傳空字串而不是崩潰', () => {
    // 資料庫裡的 title 是 nullable，這條路徑實際會被走到。
    expect(slugify('')).toBe('');
    expect(slugify(null)).toBe('');
    expect(slugify(undefined)).toBe('');
  });

  it('接受非字串輸入（例如純數字的 id）', () => {
    expect(slugify(12345)).toBe('12345');
  });
});

describe('truncateText', () => {
  it('短於上限時原樣回傳', () => {
    expect(truncateText('短文字', 100)).toBe('短文字');
  });

  it('超過上限時截斷並補上省略號，且總長度不超過上限', () => {
    const result = truncateText('a'.repeat(200), 50);
    expect(result).toHaveLength(50);
    expect(result.endsWith('...')).toBe(true);
  });

  it('預設上限為 160（Google 的 meta description 建議值）', () => {
    expect(truncateText('a'.repeat(300))).toHaveLength(160);
  });

  it('對空值回傳空字串', () => {
    expect(truncateText(null)).toBe('');
    expect(truncateText(undefined)).toBe('');
  });
});

describe('generateMetaDescription', () => {
  it('description 為空時退回 fallback', () => {
    expect(generateMetaDescription('', '備用描述')).toBe('備用描述');
    expect(generateMetaDescription(null, '備用描述')).toBe('備用描述');
  });

  it('兩者皆空時回傳空字串（不得回傳 "null" 或 "undefined"）', () => {
    expect(generateMetaDescription(null, null)).toBe('');
  });

  it('結果永遠不超過 160 字元', () => {
    expect(generateMetaDescription('長'.repeat(500)).length).toBeLessThanOrEqual(160);
  });
});

describe('generatePageTitle', () => {
  it('沒有頁面標題時只回傳站名', () => {
    expect(generatePageTitle('')).toBe('國立高雄科技大學智慧商務系系友會');
    expect(generatePageTitle(null)).toBe('國立高雄科技大學智慧商務系系友會');
  });

  it('組合出「頁面標題 | 站名」', () => {
    expect(generatePageTitle('系友登入', '站名')).toBe('系友登入 | 站名');
  });

  it('完整標題超過 60 字元時改用縮寫站名', () => {
    // Google 的搜尋結果標題大約在 60 字元處截斷，超過的部分等於白寫。
    const longTitle = '這是一個非常非常長的頁面標題用來測試當標題與站名合併之後超過六十個字元時是否會改用縮寫站名';
    const result = generatePageTitle(longTitle);
    expect(result).toContain('智商系友會');
    expect(result).not.toContain('國立高雄科技大學智慧商務系系友會');
  });
});

describe('generateStructuredData', () => {
  it('每種型別都帶上 schema.org 的 @context', () => {
    for (const type of ['organization', 'person', 'article', 'jobPosting', 'breadcrumb']) {
      const data = generateStructuredData(type, { items: [] });
      expect(data['@context']).toBe('https://schema.org');
    }
  });

  it('未知型別只回傳 @context，不得崩潰', () => {
    expect(generateStructuredData('unknown-type', {})).toEqual({
      '@context': 'https://schema.org',
    });
  });

  it('person 一律標註畢業自智慧商務系', () => {
    const data = generateStructuredData('person', { name: '王小明', position: '工程師' });
    expect(data['@type']).toBe('Person');
    expect(data.alumniOf.name).toBe('國立高雄科技大學智慧商務系');
  });

  it('person 沒有公司時 worksFor 為 undefined 而不是空物件', () => {
    // JSON-LD 裡出現 {"@type":"Organization","name":undefined} 會被驗證工具判為無效。
    const data = generateStructuredData('person', { name: '王小明' });
    expect(data.worksFor).toBeUndefined();
  });

  it('article 未提供 dateModified 時退回 datePublished', () => {
    const data = generateStructuredData('article', {
      title: '公告',
      publishDate: '2026-01-01',
    });
    expect(data.dateModified).toBe('2026-01-01');
  });

  it('jobPosting 的 breadcrumb 位置從 1 開始（schema.org 規定不是 0）', () => {
    const data = generateStructuredData('breadcrumb', {
      items: [{ name: '首頁', url: '/' }, { name: '職缺', url: '/recruit' }],
    });
    expect(data.itemListElement[0].position).toBe(1);
    expect(data.itemListElement[1].position).toBe(2);
  });

  it('jobPosting 沒有薪資時不得產生空的 baseSalary', () => {
    const data = generateStructuredData('jobPosting', { title: '工程師', company: 'X 公司' });
    expect(data.baseSalary).toBeUndefined();
    expect(data.employmentType).toBe('FULL_TIME');
  });
});

describe('generateOpenGraphTags', () => {
  it('沒有指定圖片時使用預設 og:image', () => {
    // 社群分享沒有圖等於點擊率砍半，預設圖是必要的保底。
    const tags = generateOpenGraphTags({ title: 'T', description: 'D', url: 'https://x.test' });
    expect(tags['og:image']).toBe('https://nkusticalumni.org/og-image.jpg');
  });

  it('locale 固定為 zh_TW', () => {
    expect(generateOpenGraphTags({})['og:locale']).toBe('zh_TW');
  });
});

describe('optimizeKeywords', () => {
  it('接受逗號分隔字串並修剪每個關鍵字前後的空白', () => {
    // 輸出是以 ', ' 串接，所以要拆開來檢查個別關鍵字，不能直接比對整串。
    const keywords = optimizeKeywords('系友, 招募 ,活動').split(', ');
    expect(keywords).toEqual(expect.arrayContaining(['系友', '招募', '活動']));
    expect(keywords.every((k) => k === k.trim())).toBe(true);
  });

  it('接受陣列', () => {
    expect(optimizeKeywords(['系友', '招募'])).toContain('系友');
  });

  it('自動附上站方基礎關鍵字', () => {
    expect(optimizeKeywords('系友')).toContain('NKUST');
  });

  it('去除重複', () => {
    const result = optimizeKeywords(['NKUST', 'NKUST']);
    expect(result.split(', ').filter((k) => k === 'NKUST')).toHaveLength(1);
  });

  it('最多輸出 10 個關鍵字（過多關鍵字會被視為 keyword stuffing）', () => {
    const many = Array.from({ length: 30 }, (_, i) => `關鍵字${i}`);
    expect(optimizeKeywords(many).split(', ')).toHaveLength(10);
  });

  it('輸入為空或非預期型別時仍回傳基礎關鍵字', () => {
    expect(optimizeKeywords(null)).toContain('NKUST');
    expect(optimizeKeywords(undefined)).toContain('NKUST');
  });
});

describe('isAbsoluteUrl', () => {
  it.each([
    ['https://example.test', true],
    ['http://example.test', true],
    ['/relative/path', false],
    ['relative/path', false],
    ['//protocol-relative.test', false],
  ])('%s → %s', (url, expected) => {
    expect(isAbsoluteUrl(url)).toBe(expected);
  });
});

describe('generateCanonicalUrl', () => {
  it('相對路徑會被補上站台網域', () => {
    expect(generateCanonicalUrl('/alumni')).toBe('https://nkusticalumni.org/alumni');
  });

  it('缺少開頭斜線時自動補上', () => {
    expect(generateCanonicalUrl('alumni')).toBe('https://nkusticalumni.org/alumni');
  });

  it('移除尾端斜線，避免同一頁產生兩個 canonical', () => {
    // /alumni 與 /alumni/ 若同時存在 canonical，搜尋引擎會判定為重複內容。
    expect(generateCanonicalUrl('/alumni/')).toBe('https://nkusticalumni.org/alumni');
  });

  it('根路徑保留斜線', () => {
    expect(generateCanonicalUrl('/')).toBe('https://nkusticalumni.org/');
  });

  it('已是絕對網址時原樣回傳', () => {
    expect(generateCanonicalUrl('https://other.test/page')).toBe('https://other.test/page');
  });
});

describe('generateShareUrl', () => {
  it('對 URL 與標題做百分比編碼', () => {
    // 沒編碼的話，標題裡的 & 或中文會把分享連結整個打斷。
    const url = generateShareUrl('facebook', {
      url: 'https://nkusticalumni.org/article/1',
      title: '公告 & 通知',
    });
    expect(url).toContain(encodeURIComponent('https://nkusticalumni.org/article/1'));
    expect(url).not.toContain(' ');
  });
});

describe('validateSeoFields', () => {
  it('完整且長度合理的資料回傳空陣列', () => {
    expect(
      validateSeoFields({ title: '標題', description: '描述', keywords: '關鍵字' })
    ).toEqual([]);
  });

  it('列出所有缺少的必填欄位', () => {
    const missing = validateSeoFields({ title: '', description: '', keywords: '' });
    expect(missing).toEqual(expect.arrayContaining(['title', 'description', 'keywords']));
  });

  it('標題過長會被標記', () => {
    const missing = validateSeoFields({
      title: 'a'.repeat(61),
      description: '描述',
      keywords: '關鍵字',
    });
    expect(missing).toContain('title_too_long');
  });

  it('描述過長會被標記', () => {
    const missing = validateSeoFields({
      title: '標題',
      description: 'a'.repeat(161),
      keywords: '關鍵字',
    });
    expect(missing).toContain('description_too_long');
  });
});
