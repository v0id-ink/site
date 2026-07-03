// 解析友链申请类型的 Issue，下载图片并更新 settings.json
// 运行环境：GitHub Actions (Node 20+)
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync, appendFileSync } from 'node:fs';
import path from 'node:path';

const ISSUE_NUMBER = process.env.ISSUE_NUMBER;
const ISSUE_BODY = process.env.ISSUE_BODY || '';
const ISSUE_AUTHOR = process.env.ISSUE_AUTHOR || 'unknown';
const GITHUB_OUTPUT = process.env.GITHUB_OUTPUT;

const IMAGES_DIR = path.join('public', 'images');
const SETTINGS_PATH = path.join('settings.json');
const PR_BODY_PATH = path.join('pr-body.md');

// 从 Issue 正文（表单格式）中提取指定小节内容
function extractSection(body, label) {
  const regex = new RegExp(
    `^###\\s+${label}\\s*\\r?\\n([\\s\\S]*?)(?=\\r?\\n###\\s|(?![\\s\\S]))`,
    'im'
  );
  const match = body.match(regex);
  if (!match) return '';
  return match[1].trim();
}

// 从文本中提取图片 URL：优先 Markdown 图片语法，其次裸链接
function parseImageUrl(text) {
  const mdMatch = text.match(/!\[[^\]]*\]\((https:\/\/[^\s)]+)\)/);
  if (mdMatch) return mdMatch[1];
  const urlMatch = text.match(/(https:\/\/[^\s)]+)/);
  if (urlMatch) return urlMatch[1];
  return null;
}

// 根据文件名提示、URL 路径或 Content-Type 推断扩展名
function getExtension(nameHint, url, contentType) {
  if (nameHint) {
    const ext = path.extname(nameHint).toLowerCase();
    if (ext) return ext;
  }
  if (url) {
    try {
      const ext = path.extname(new URL(url).pathname).toLowerCase();
      if (ext) return ext;
    } catch {}
  }
  const map = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'image/avif': '.avif',
  };
  if (contentType && map[contentType.toLowerCase()]) return map[contentType.toLowerCase()];
  return '.png';
}

function setOutput(key, value) {
  if (!GITHUB_OUTPUT) return;
  appendFileSync(GITHUB_OUTPUT, `${key}=${value}\n`);
}

async function main() {
  if (!ISSUE_NUMBER) throw new Error('ISSUE_NUMBER 环境变量未设置');

  const name = extractSection(ISSUE_BODY, '站点名称');
  const url = extractSection(ISSUE_BODY, '站点链接');
  const desc = extractSection(ISSUE_BODY, '描述（可选）');
  const imageSection = extractSection(ISSUE_BODY, '站点截图 / 头像');

  if (!name || !url) {
    setOutput('has-friend', 'false');
    console.log('缺少站点名称或链接，跳过。');
    return;
  }

  const imageUrl = parseImageUrl(imageSection);
  if (!imageUrl) {
    setOutput('has-friend', 'false');
    console.log('未在 Issue 中找到图片。');
    return;
  }

  console.log(`友链申请：${name} (${url})`);

  if (!existsSync(IMAGES_DIR)) {
    await mkdir(IMAGES_DIR, { recursive: true });
  }

  // 构建友链条目
  const friend = { name, url };
  if (desc) friend.desc = desc;

  // githubusercontent 链接下载到本地；其余直接作为外链记录
  let isGithubHosted = false;
  try {
    isGithubHosted = new URL(imageUrl).hostname.includes('githubusercontent');
  } catch {}

  if (isGithubHosted) {
    console.log(`下载图片: ${imageUrl}`);
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`下载失败 ${imageUrl}: ${res.status}`);

    const contentType = res.headers.get('content-type') || '';
    const ext = getExtension(null, imageUrl, contentType);
    const filename = `friend-${ISSUE_NUMBER}${ext}`;

    const buffer = Buffer.from(await res.arrayBuffer());
    await writeFile(path.join(IMAGES_DIR, filename), buffer);

    friend.image = `/images/${filename}`;
    console.log(`  -> 保存为 ${filename}`);
  } else {
    console.log(`外链图片: ${imageUrl}`);
    friend.image = imageUrl;
  }

  // 读取 settings.json 并添加友链
  const settingsRaw = await readFile(SETTINGS_PATH, 'utf8');
  const settings = JSON.parse(settingsRaw);
  if (!Array.isArray(settings.friends)) settings.friends = [];

  settings.friends.push(friend);

  // 写回 settings.json（保持 4 空格缩进 + 末尾换行）
  await writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 4) + '\n', 'utf8');

  // 生成 PR 正文
  const prBody = [
    `本 PR 添加了 Issue #${ISSUE_NUMBER} 中的友链申请。`,
    '',
    `提交者：@${ISSUE_AUTHOR}`,
    '',
    `| 字段 | 值 |`,
    `| --- | --- |`,
    `| 站点名称 | ${name} |`,
    `| 站点链接 | ${url} |`,
    `| 描述 | ${desc || '—'} |`,
    `| 图片 | \`${friend.image}\` |`,
    '',
    `Closes #${ISSUE_NUMBER}`,
  ].join('\n');

  await writeFile(PR_BODY_PATH, prBody, 'utf8');

  setOutput('has-friend', 'true');
  console.log('完成。已添加友链：', friend);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
