#!/usr/bin/env node
/**
 * SEO 驗證和檢查工具
 * 檢查智慧商務系系友會網站的 SEO 實施狀況
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

class SEOValidator {
  constructor(buildPath = './build') {
    this.buildPath = buildPath;
    this.errors = [];
    this.warnings = [];
    this.results = {
      metaTags: {},
      structuredData: {},
      performance: {},
      keywords: {},
      technical: {}
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'error': '❌',
      'warning': '⚠️',
      'success': '✅',
      'info': 'ℹ️'
    }[type] || 'ℹ️';

    console.log(`${prefix} [${timestamp}] ${message}`);

    if (type === 'error') this.errors.push(message);
    if (type === 'warning') this.warnings.push(message);
  }

  // 檢查 index.html 的 Meta 標籤
  validateMetaTags() {
    this.log('開始檢查 Meta 標籤...', 'info');

    const indexPath = path.join(this.buildPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
      this.log('找不到 index.html 文件', 'error');
      return false;
    }

    const html = fs.readFileSync(indexPath, 'utf8');
    const $ = cheerio.load(html);

    // 檢查基本 Meta 標籤
    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content');
    const keywords = $('meta[name="keywords"]').attr('content');
    const viewport = $('meta[name="viewport"]').attr('content');
    const charset = $('meta[charset]').attr('charset');

    this.results.metaTags = {
      title: {
        content: title,
        length: title.length,
        hasKeywords: title.includes('智慧商務系') || title.includes('智商系')
      },
      description: {
        content: description,
        length: description?.length || 0,
        hasKeywords: description?.includes('智慧商務系') || description?.includes('智商系')
      },
      keywords: {
        content: keywords,
        count: keywords?.split(',').length || 0,
        hasTargetKeywords: keywords?.includes('智慧商務系') && keywords?.includes('智商系')
      },
      viewport: !!viewport,
      charset: !!charset
    };

    // 檢查標題長度
    if (title.length > 60) {
      this.log(`標題過長 (${title.length} 字符)，建議控制在 60 字符內`, 'warning');
    } else if (title.length < 30) {
      this.log(`標題過短 (${title.length} 字符)，建議增加到 30-60 字符`, 'warning');
    } else {
      this.log('標題長度適當', 'success');
    }

    // 檢查描述長度
    if (description && description.length > 160) {
      this.log(`描述過長 (${description.length} 字符)，建議控制在 150-160 字符內`, 'warning');
    } else if (!description || description.length < 120) {
      this.log(`描述過短 (${description?.length || 0} 字符)，建議增加到 120-160 字符`, 'warning');
    } else {
      this.log('描述長度適當', 'success');
    }

    // 檢查關鍵字
    if (!this.results.metaTags.title.hasKeywords) {
      this.log('標題中未包含目標關鍵字「智慧商務系」或「智商系」', 'warning');
    } else {
      this.log('標題包含目標關鍵字', 'success');
    }

    if (!this.results.metaTags.description.hasKeywords) {
      this.log('描述中未包含目標關鍵字「智慧商務系」或「智商系」', 'warning');
    } else {
      this.log('描述包含目標關鍵字', 'success');
    }

    // 檢查 Open Graph 標籤
    const ogTitle = $('meta[property="og:title"]').attr('content');
    const ogDescription = $('meta[property="og:description"]').attr('content');
    const ogImage = $('meta[property="og:image"]').attr('content');
    const ogUrl = $('meta[property="og:url"]').attr('content');

    if (ogTitle && ogDescription && ogImage && ogUrl) {
      this.log('Open Graph 標籤完整', 'success');
    } else {
      this.log('Open Graph 標籤不完整', 'warning');
    }

    // 檢查 Twitter Cards
    const twitterCard = $('meta[name="twitter:card"]').attr('content');
    const twitterTitle = $('meta[name="twitter:title"]').attr('content');
    const twitterDescription = $('meta[name="twitter:description"]').attr('content');
    const twitterImage = $('meta[name="twitter:image"]').attr('content');

    if (twitterCard && twitterTitle && twitterDescription && twitterImage) {
      this.log('Twitter Cards 標籤完整', 'success');
    } else {
      this.log('Twitter Cards 標籤不完整', 'warning');
    }

    return true;
  }

  // 驗證結構化數據
  validateStructuredData() {
    this.log('開始檢查結構化數據...', 'info');

    const indexPath = path.join(this.buildPath, 'index.html');
    const html = fs.readFileSync(indexPath, 'utf8');
    const $ = cheerio.load(html);

    const jsonLdScripts = $('script[type="application/ld+json"]');
    this.results.structuredData = {
      count: jsonLdScripts.length,
      schemas: []
    };

    jsonLdScripts.each((index, element) => {
      try {
        const jsonContent = $(element).html();
        const parsedData = JSON.parse(jsonContent);

        this.results.structuredData.schemas.push({
          type: parsedData['@type'],
          valid: true,
          data: parsedData
        });

        this.log(`發現有效的結構化數據: ${parsedData['@type']}`, 'success');
      } catch (error) {
        this.log(`結構化數據解析錯誤: ${error.message}`, 'error');
        this.results.structuredData.schemas.push({
          valid: false,
          error: error.message
        });
      }
    });

    // 檢查必要的結構化數據類型
    const requiredSchemas = [
      'EducationalOrganization',
      'Organization',
      'LocalBusiness',
      'FAQPage',
      'WebSite'
    ];

    const presentSchemas = this.results.structuredData.schemas
      .filter(s => s.valid)
      .map(s => s.type);

    requiredSchemas.forEach(schema => {
      if (presentSchemas.includes(schema)) {
        this.log(`包含 ${schema} 結構化數據`, 'success');
      } else {
        this.log(`缺少 ${schema} 結構化數據`, 'warning');
      }
    });

    return true;
  }

  // 檢查關鍵字密度和分佈
  analyzeKeywordOptimization() {
    this.log('開始分析關鍵字優化...', 'info');

    const targetKeywords = ['智慧商務系', '智商系', 'NKUST智慧商務系', '高科大智商系'];
    const indexPath = path.join(this.buildPath, 'index.html');
    const html = fs.readFileSync(indexPath, 'utf8');
    const $ = cheerio.load(html);

    // 移除腳本和樣式標籤
    $('script, style').remove();
    const textContent = $('body').text().toLowerCase();
    const totalWords = textContent.split(/\s+/).length;

    this.results.keywords = {
      totalWords,
      density: {},
      positions: {}
    };

    targetKeywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const matches = textContent.match(regex) || [];
      const density = (matches.length / totalWords) * 100;

      this.results.keywords.density[keyword] = {
        count: matches.length,
        density: density.toFixed(2)
      };

      // 檢查關鍵字是否出現在重要位置
      const inTitle = $('title').text().includes(keyword);
      const inH1 = $('h1').text().includes(keyword);
      const inH2 = $('h2').text().includes(keyword);
      const inMeta = $('meta[name="description"]').attr('content')?.includes(keyword);

      this.results.keywords.positions[keyword] = {
        inTitle,
        inH1,
        inH2,
        inMeta
      };

      this.log(`關鍵字「${keyword}」: ${matches.length} 次, 密度 ${density.toFixed(2)}%`, 'info');

      if (density < 1) {
        this.log(`關鍵字「${keyword}」密度過低，建議增加到 1-3%`, 'warning');
      } else if (density > 4) {
        this.log(`關鍵字「${keyword}」密度過高，可能被視為關鍵字堆砌`, 'warning');
      } else {
        this.log(`關鍵字「${keyword}」密度適當`, 'success');
      }
    });

    return true;
  }

  // 檢查技術 SEO
  validateTechnicalSEO() {
    this.log('開始檢查技術 SEO...', 'info');

    // 檢查 robots.txt
    const robotsPath = path.join(this.buildPath, 'robots.txt');
    const hasSitemap = fs.existsSync(path.join(this.buildPath, 'sitemap.xml'));
    const hasRobots = fs.existsSync(robotsPath);

    this.results.technical = {
      robots: hasRobots,
      sitemap: hasSitemap,
      canonical: false,
      hreflang: false,
      favicon: fs.existsSync(path.join(this.buildPath, 'favicon.ico')),
      manifest: fs.existsSync(path.join(this.buildPath, 'manifest.json'))
    };

    if (hasRobots) {
      this.log('robots.txt 文件存在', 'success');
      const robotsContent = fs.readFileSync(robotsPath, 'utf8');
      if (robotsContent.includes('Sitemap:')) {
        this.log('robots.txt 包含 Sitemap 聲明', 'success');
      } else {
        this.log('robots.txt 缺少 Sitemap 聲明', 'warning');
      }
    } else {
      this.log('缺少 robots.txt 文件', 'warning');
    }

    if (hasSitemap) {
      this.log('sitemap.xml 文件存在', 'success');
    } else {
      this.log('缺少 sitemap.xml 文件', 'error');
    }

    // 檢查 index.html 中的技術元素
    const indexPath = path.join(this.buildPath, 'index.html');
    const html = fs.readFileSync(indexPath, 'utf8');
    const $ = cheerio.load(html);

    // 檢查 canonical URL
    const canonical = $('link[rel="canonical"]').attr('href');
    this.results.technical.canonical = !!canonical;
    if (canonical) {
      this.log('包含 canonical URL', 'success');
    } else {
      this.log('缺少 canonical URL', 'warning');
    }

    // 檢查 hreflang
    const hreflang = $('link[rel="alternate"][hreflang]').length > 0;
    this.results.technical.hreflang = hreflang;
    if (hreflang) {
      this.log('包含 hreflang 標籤', 'success');
    } else {
      this.log('缺少 hreflang 標籤', 'warning');
    }

    return true;
  }

  // 分析構建性能
  analyzePerformance() {
    this.log('開始分析性能指標...', 'info');

    const staticPath = path.join(this.buildPath, 'static');
    const jsPath = path.join(staticPath, 'js');
    const cssPath = path.join(staticPath, 'css');

    let totalJsSize = 0;
    let totalCssSize = 0;
    let jsFiles = 0;
    let cssFiles = 0;

    // 分析 JS 文件
    if (fs.existsSync(jsPath)) {
      const jsFileList = fs.readdirSync(jsPath);
      jsFileList.forEach(file => {
        if (file.endsWith('.js')) {
          const filePath = path.join(jsPath, file);
          const stats = fs.statSync(filePath);
          totalJsSize += stats.size;
          jsFiles++;
        }
      });
    }

    // 分析 CSS 文件
    if (fs.existsSync(cssPath)) {
      const cssFileList = fs.readdirSync(cssPath);
      cssFileList.forEach(file => {
        if (file.endsWith('.css')) {
          const filePath = path.join(cssPath, file);
          const stats = fs.statSync(filePath);
          totalCssSize += stats.size;
          cssFiles++;
        }
      });
    }

    this.results.performance = {
      jsSize: (totalJsSize / 1024).toFixed(2) + ' KB',
      cssSize: (totalCssSize / 1024).toFixed(2) + ' KB',
      jsFiles,
      cssFiles,
      totalSize: ((totalJsSize + totalCssSize) / 1024).toFixed(2) + ' KB'
    };

    this.log(`JavaScript 總大小: ${this.results.performance.jsSize} (${jsFiles} 文件)`, 'info');
    this.log(`CSS 總大小: ${this.results.performance.cssSize} (${cssFiles} 文件)`, 'info');
    this.log(`總資源大小: ${this.results.performance.totalSize}`, 'info');

    // 性能建議
    if (totalJsSize > 500 * 1024) { // > 500KB
      this.log('JavaScript 檔案過大，建議進行代碼分割優化', 'warning');
    } else {
      this.log('JavaScript 檔案大小適當', 'success');
    }

    if (totalCssSize > 100 * 1024) { // > 100KB
      this.log('CSS 檔案較大，建議檢查是否有未使用的樣式', 'warning');
    } else {
      this.log('CSS 檔案大小適當', 'success');
    }

    return true;
  }

  // 生成 SEO 報告
  generateReport() {
    this.log('生成 SEO 檢查報告...', 'info');

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalErrors: this.errors.length,
        totalWarnings: this.warnings.length,
        overallScore: this.calculateSEOScore()
      },
      results: this.results,
      errors: this.errors,
      warnings: this.warnings,
      recommendations: this.generateRecommendations()
    };

    const reportPath = path.join(process.cwd(), 'seo-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

    this.log(`SEO 報告已保存至: ${reportPath}`, 'success');
    return report;
  }

  // 計算 SEO 分數
  calculateSEOScore() {
    let score = 100;

    // 錯誤扣分
    score -= this.errors.length * 10;

    // 警告扣分
    score -= this.warnings.length * 5;

    return Math.max(0, score);
  }

  // 生成建議
  generateRecommendations() {
    const recommendations = [];

    if (this.results.metaTags.title.length > 60) {
      recommendations.push('縮短頁面標題至 60 字符以內');
    }

    if (this.results.metaTags.description.length > 160) {
      recommendations.push('縮短 meta description 至 160 字符以內');
    }

    if (this.results.structuredData.count < 5) {
      recommendations.push('增加更多類型的結構化數據');
    }

    if (!this.results.technical.sitemap) {
      recommendations.push('添加 sitemap.xml 文件');
    }

    if (!this.results.technical.canonical) {
      recommendations.push('為所有頁面添加 canonical URL');
    }

    // 關鍵字密度檢查
    Object.entries(this.results.keywords.density || {}).forEach(([keyword, data]) => {
      if (data.density < 1) {
        recommendations.push(`增加關鍵字「${keyword}」的使用頻率`);
      } else if (data.density > 4) {
        recommendations.push(`減少關鍵字「${keyword}」的使用頻率，避免過度優化`);
      }
    });

    return recommendations;
  }

  // 執行完整的 SEO 檢查
  async runFullAudit() {
    this.log('開始執行完整的 SEO 檢查...', 'info');
    this.log('='.repeat(50), 'info');

    try {
      this.validateMetaTags();
      this.validateStructuredData();
      this.analyzeKeywordOptimization();
      this.validateTechnicalSEO();
      this.analyzePerformance();

      this.log('='.repeat(50), 'info');
      this.log('SEO 檢查完成！', 'success');
      this.log(`總錯誤數: ${this.errors.length}`, this.errors.length > 0 ? 'error' : 'success');
      this.log(`總警告數: ${this.warnings.length}`, this.warnings.length > 0 ? 'warning' : 'success');
      this.log(`SEO 分數: ${this.calculateSEOScore()}/100`, 'info');

      return this.generateReport();
    } catch (error) {
      this.log(`SEO 檢查過程中發生錯誤: ${error.message}`, 'error');
      throw error;
    }
  }
}

// 主執行函數
async function main() {
  const buildPath = process.argv[2] || './build';

  if (!fs.existsSync(buildPath)) {
    console.error(`❌ 找不到構建目錄: ${buildPath}`);
    console.error('請先執行 npm run build 或指定正確的構建目錄路徑');
    process.exit(1);
  }

  const validator = new SEOValidator(buildPath);

  try {
    const report = await validator.runFullAudit();

    console.log('\n📊 SEO 檢查摘要:');
    console.log(`✅ SEO 分數: ${report.summary.overallScore}/100`);
    console.log(`❌ 錯誤: ${report.summary.totalErrors}`);
    console.log(`⚠️  警告: ${report.summary.totalWarnings}`);

    if (report.recommendations.length > 0) {
      console.log('\n💡 優化建議:');
      report.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }

    console.log(`\n📄 詳細報告已保存至: seo-report.json`);

  } catch (error) {
    console.error(`❌ 執行失敗: ${error.message}`);
    process.exit(1);
  }
}

// 如果直接執行此文件，則運行主函數
if (require.main === module) {
  main();
}

module.exports = SEOValidator;