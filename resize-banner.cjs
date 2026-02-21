/**
 * 把任意图片裁成 dApp 商店要求的 1200×600
 * 用法：node resize-banner.cjs [输入图片路径]
 * 例如：node resize-banner.cjs 我的横幅.png
 * 输出：banner-1200x600.png（在项目根目录）
 */

const fs = require('fs');
const path = require('path');

const W = 1200;
const H = 600;

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
    console.error('用法：node resize-banner.cjs <你的图片路径>');
    console.error('例如：node resize-banner.cjs 我的图.png');
    process.exit(1);
  }
  const outPath = path.join(__dirname, 'banner-1200x600.png');
  await sharp(input)
    .resize(W, H, { fit: 'cover', position: 'center' })
    .png()
    .toFile(outPath);
  console.log('已生成：', outPath, '(' + W + '×' + H + ')');
}

main().catch(e => { console.error(e); process.exit(1); });
