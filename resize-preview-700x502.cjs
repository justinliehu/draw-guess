/**
 * 把图片裁成 700×502（dApp 商店某类预览图要求）
 * 用法：node resize-preview-700x502.cjs [输入图片路径]
 * 输出：preview-700x502.png
 */

const fs = require('fs');
const path = require('path');

async function main() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.error('请先运行：npm install sharp');
    process.exit(1);
  }
  const input = process.argv[2];
  if (!input || !fs.existsSync(input)) {
    console.error('用法：node resize-preview-700x502.cjs <图片路径>');
    console.error('例如：node resize-preview-700x502.cjs 截图/某张图.png');
    process.exit(1);
  }
  const outPath = path.join(__dirname, 'preview-700x502.png');
  await sharp(input)
    .resize(700, 502, { fit: 'cover', position: 'center' })
    .png()
    .toFile(outPath);
  console.log('已生成：', outPath, '(700×502)');
}

main().catch(e => { console.error(e); process.exit(1); });
