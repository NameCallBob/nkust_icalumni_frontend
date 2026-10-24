/**
 * 模組解析檢查：每一個 import 都指得到真實存在的檔案嗎？
 *
 * 為什麼需要這支測試
 * ------------------
 * `npm run build` 也會抓到同樣的問題，但它要跑一分鐘以上，而且錯誤訊息一次
 * 只顯示第一個失敗的模組。這支測試在幾十毫秒內掃完整個 src/，一次列出**全部**
 * 解析不到的 import，並指出是哪些檔案引用了它們。
 *
 * 曆史：`ui-rebuild-shadcn` 分支曾有 6 個檔案 import 一組從未進版控的模組
 * （@/components/ui、@/services、@/lib/utils、@/hooks/useMediaQuery、
 * utils/validatePassword），導致分支無法建置。這些模組已重新撰寫補上，
 * `KNOWN_MISSING_MODULES` 因此清空；日後若有新的斷掉 import，第一個測試會立刻失敗。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SRC_DIR = path.resolve(__dirname, '..');
const SOURCE_EXTENSIONS = ['.js', '.jsx'];
const RESOLVE_EXTENSIONS = ['', '.js', '.jsx', '.json', '/index.js', '/index.jsx'];

/**
 * 已知缺漏的模組——UI 重構過程中被引用、但檔案從未進版控。
 *
 * 這份清單只能變短。補齊檔案後請一併把它從這裡移除。
 */
const KNOWN_MISSING_MODULES = new Set([]);

/** 遞迴列出 src/ 底下所有原始碼檔案（略過測試與靜態資源）。 */
function collectSourceFiles(dir, collected = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['__tests__', 'assets', 'node_modules'].includes(entry.name)) continue;
      collectSourceFiles(fullPath, collected);
    } else if (
      SOURCE_EXTENSIONS.includes(path.extname(entry.name)) &&
      !/\.test\.jsx?$/.test(entry.name)
    ) {
      collected.push(fullPath);
    }
  }
  return collected;
}

/** 取出一個檔案裡所有 import / require 的模組路徑。 */
function extractImports(fileContent) {
  const specifiers = [];
  const patterns = [
    /(?:^|\n)\s*import\s+[^'"]*?from\s+['"]([^'"]+)['"]/g,
    /(?:^|\n)\s*import\s+['"]([^'"]+)['"]/g,
    /require\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];
  for (const pattern of patterns) {
    let match = pattern.exec(fileContent);
    while (match) {
      specifiers.push(match[1]);
      match = pattern.exec(fileContent);
    }
  }
  return specifiers;
}

/**
 * 判斷這個 import 是否為專案內部模組。
 *
 * 本專案有兩種內部寫法：
 *   - `@/xxx`   — shadcn 慣用的別名（craco/jsconfig 需設定對應到 src/）
 *   - `common/Axios`、`SEO` — jsconfig 的 baseUrl=src 帶來的絕對路徑寫法
 *   - `./x`、`../x` — 相對路徑
 * 其他一律視為 node_modules 的套件，不在本測試的守備範圍。
 */
function isInternalModule(specifier) {
  if (specifier.startsWith('@/')) return true;
  if (specifier.startsWith('.')) return true;
  // 絕對路徑寫法：第一段必須對應到 src/ 底下真實存在的資料夾或檔案。
  const firstSegment = specifier.split('/')[0];
  if (specifier.startsWith('@')) return false; // scoped npm package，例如 @emotion/react
  return (
    fs.existsSync(path.join(SRC_DIR, firstSegment)) ||
    SOURCE_EXTENSIONS.some((ext) => fs.existsSync(path.join(SRC_DIR, firstSegment + ext)))
  );
}

/** 把 import 路徑換算成磁碟上的絕對路徑候選。 */
function resolveInternal(specifier, fromFile) {
  const base = specifier.startsWith('@/')
    ? path.join(SRC_DIR, specifier.slice(2))
    : specifier.startsWith('.')
      ? path.resolve(path.dirname(fromFile), specifier)
      : path.join(SRC_DIR, specifier);

  return RESOLVE_EXTENSIONS.some((ext) => {
    const candidate = base + ext;
    return fs.existsSync(candidate) && fs.statSync(candidate).isFile();
  });
}

/** 掃描全部原始碼，回傳 Map<模組路徑, 引用它的檔案清單>。 */
function findUnresolvedImports() {
  const unresolved = new Map();

  for (const file of collectSourceFiles(SRC_DIR)) {
    const content = fs.readFileSync(file, 'utf8');
    for (const specifier of extractImports(content)) {
      // CSS / 圖片等資源由 webpack loader 處理，不在此檢查。
      if (/\.(css|scss|sass|less|png|jpe?g|svg|gif|webp|woff2?)$/.test(specifier)) continue;
      if (!isInternalModule(specifier)) continue;
      if (resolveInternal(specifier, file)) continue;

      const relative = path.relative(SRC_DIR, file);
      if (!unresolved.has(specifier)) unresolved.set(specifier, []);
      unresolved.get(specifier).push(relative);
    }
  }

  return unresolved;
}

describe('模組解析', () => {
  let unresolved;

  beforeAll(() => {
    unresolved = findUnresolvedImports();
  });

  it('沒有新增任何解析不到的 import', () => {
    const newlyBroken = [...unresolved.entries()].filter(
      ([specifier]) => !KNOWN_MISSING_MODULES.has(specifier)
    );

    // Jest 27 的 expect() 不支援第二個訊息參數（那是 Playwright / Vitest 的 API），
    // 所以把說明放進被斷言的值本身，失敗時 diff 會直接顯示完整清單。
    const report = newlyBroken
      .map(([specifier, files]) => `  ${specifier}\n${files.map((f) => `      ← ${f}`).join('\n')}`)
      .join('\n');

    expect(
      report === ''
        ? ''
        : `以下 import 解析不到任何檔案，production build 會直接失敗：\n${report}`
    ).toBe('');
  });

  it('已知缺漏清單沒有過期（補齊檔案後請把它移除）', () => {
    const stillMissing = new Set([...unresolved.keys()]);
    const alreadyFixed = [...KNOWN_MISSING_MODULES].filter((m) => !stillMissing.has(m));

    // 空陣列代表清單仍然精確；有內容時 diff 會直接列出該刪掉哪幾行。
    expect(alreadyFixed).toEqual([]);
  });

  it('把目前的建置阻礙完整列出來（診斷用，不會失敗）', () => {
    const blockers = [...unresolved.entries()].filter(([specifier]) =>
      KNOWN_MISSING_MODULES.has(specifier)
    );

    if (blockers.length > 0) {
      const report = blockers
        .map(([specifier, files]) => `  ${specifier}  ← ${files.join(', ')}`)
        .join('\n');
      // 用 console.warn 而不是失敗：這個狀態已經由 npm run build 明確報告，
      // 這裡的用途是讓開發者在跑單元測試時就看到完整清單。
      // eslint-disable-next-line no-console
      console.warn(
        `\n⚠️  這個分支目前無法建置。以下模組被引用但檔案不存在（從未進版控）：\n${report}\n`
      );
    }

    expect(true).toBe(true);
  });
});
