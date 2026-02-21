/**
 * 一键把「截图」文件夹里所有图转成 dApp 商店需要的两种尺寸：
 * - 1920×1080 → dapp-preview（列表/详情用，至少4张）
 * - 700×502   → dapp-preview-700x502（预览位用）
 * 使用：npm install sharp  然后  node prepare-dapp-screenshots.cjs
 */

const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '截图');
const OUT_1080 = path.join(__dirname, 'dapp-preview');           // 1920×1080
const OUT_702 = path.join(__dirname, 'dapp-preview-700x502');    // 700×502
const W1 = 1920;
const H1 = 1080;
const W2 = 700;
const H2 = 502;
const MAX_BYTES = 3 * 1024 * 1024; // 3MB
const MIN_COUNT = 4;

async function main() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.error('请先安装 sharp：npm install sharp');
    process.exit(1);
  }

  if (!fs.existsSync(INPUT_DIR)) {
    console.error('找不到文件夹：', INPUT_DIR);
    process.exit(1);
  }

  const exts = ['.png', '.jpg', '.jpeg', '.webp'];
  const files = fs.readdirSync(INPUT_DIR)
    .filter(f => exts.includes(path.extname(f).toLowerCase()))
    .map(f => path.join(INPUT_DIR, f))
    .filter(f => fs.statSync(f).isFile());

  if (files.length < MIN_COUNT) {
    console.error('至少需要 4 张截图，当前只有', files.length, '张。');
    process.exit(1);
  }

  [OUT_1080, OUT_702].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

  console.log('正在处理', files.length, '张截图 → 生成两种尺寸 ...\n');
  for (let i = 0; i < files.length; i++) {
    const base = `screenshot-${i + 1}.png`;
    // 1920×1080
    let buf = await sharp(files[i])
      .resize(W1, H1, { fit: 'cover', position: 'center' })
      .png({ quality: 90, compressionLevel: 6 })
      .toBuffer();
    if (buf.length > MAX_BYTES) buf = await sharp(buf).png({ quality: 75, compressionLevel: 9 }).toBuffer();
    fs.writeFileSync(path.join(OUT_1080, base), buf);
    console.log('  ', base, '→', W1 + '×' + H1, (buf.length / 1024).toFixed(1) + ' KB');
    // 700×502
    const buf702 = await sharp(files[i])
      .resize(W2, H2, { fit: 'cover', position: 'center' })
      .png()
      .toBuffer();
    fs.writeFileSync(path.join(OUT_702, base), buf702);
    console.log('       →', W2 + '×' + H2, (buf702.length / 1024).toFixed(1) + ' KB');
  }
  console.log('\n完成。');
  console.log('  ', OUT_1080, '  → 上传到需要 1920×1080 的位置（至少4张）');
  console.log('  ', OUT_702, '  → 上传到需要 700×502 的位置');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
