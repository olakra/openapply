import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SCAN_DIRS = ['src', 'packages', 'apps'];
const EXEMPT_EXTENSIONS = ['.yml', '.yaml', '.json', '.properties', '.md'];
const CONFIG_FILE_PATTERNS = [/vite\.config/, /tailwind\.config/, /tsconfig/, /\.config\./];

let errorsFound = false;

/**
 * Checks if a file path is a configuration or non-code asset file exempt from inline comment rules.
 * @param {string} filePath - Absolute path to file
 * @returns {boolean} True if exempt
 */
function isExemptFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (EXEMPT_EXTENSIONS.includes(ext)) return true;
  const basename = path.basename(filePath);
  if (CONFIG_FILE_PATTERNS.some((pattern) => pattern.test(basename))) return true;
  return false;
}

/**
 * Recursively gets all relevant files in a directory.
 * @param {string} dirPath - Directory path
 * @returns {string[]} File paths
 */
function getAllFiles(dirPath) {
  let results = [];
  if (!fs.existsSync(dirPath)) return results;
  const list = fs.readdirSync(dirPath);

  for (const file of list) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist' && file !== 'coverage') {
        results = results.concat(getAllFiles(fullPath));
      }
    } else {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Validates documentation and inline comments for code files.
 * @param {string} filePath - Absolute path to file
 */
function validateFile(filePath) {
  const relativePath = path.relative(ROOT_DIR, filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  if (/\.(ts|tsx|js|jsx)$/.test(filePath) && !isExemptFile(filePath)) {
    let inTemplateLiteral = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Track multi-line template literal strings (` ... `)
      const backtickCount = (lines[i].match(/`/g) || []).length;
      if (backtickCount % 2 !== 0) {
        inTemplateLiteral = !inTemplateLiteral;
      }

      // Ignore lines inside multi-line template literals (e.g. code string constants)
      if (inTemplateLiteral) {
        continue;
      }

      // Check 1: Public Export JSDoc Requirement for top-level TS/JS exports
      if (/^export\s+(interface|class|function|type|enum|const\s+[A-Z])/.test(line)) {
        let hasJSDoc = false;
        for (let j = i - 1; j >= 0; j--) {
          const prevLine = lines[j].trim();
          if (prevLine === '') continue;
          if (prevLine.endsWith('*/')) {
            hasJSDoc = true;
            break;
          }
          break;
        }

        if (!hasJSDoc) {
          console.error(
            `❌ [Missing Public JSDoc] ${relativePath}:${i + 1} -> Exported entity lacks JSDoc documentation ("/** ... */")`
          );
          errorsFound = true;
        }
      }

      // Check 2: Inline comment check in implementation files (Excludes YAML, JSON, config files)
      if (line.startsWith('//') && !line.startsWith('///') && !isExemptFile(filePath)) {
        console.error(
          `❌ [Prohibited Inline Comment] ${relativePath}:${i + 1} -> Inline "//" comment found. Implementation code must rely on clean, self-documenting code and public JSDoc headers.`
        );
        errorsFound = true;
      }
    }
  }
}

console.log('🔍 Running OpenApply Public API Documentation & Clean Code Audit...');

let totalFiles = 0;
for (const dir of SCAN_DIRS) {
  const fullDirPath = path.join(ROOT_DIR, dir);
  const files = getAllFiles(fullDirPath);
  for (const file of files) {
    totalFiles++;
    validateFile(file);
  }
}

console.log(`\nChecked ${totalFiles} file(s).`);

if (errorsFound) {
  console.error(
    '\n💥 Documentation & Code Quality Audit Failed! Please add required JSDoc comments to public exports and remove inline comments before committing.'
  );
  process.exit(1);
} else {
  console.log('✅ All public APIs are documented and code quality standards are met.');
  process.exit(0);
}
