#!/usr/bin/env node
/**
 * 公共仓库的脱敏闸：仓库里不许出现业务字面量与凭据。
 * 只扫 git 跟踪的文件（改完先 git add，否则新文件不在扫描范围）。
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const RULES = [
  { name: '租户/应用标识', re: /cli_[a-z0-9]{8,}/g },
  { name: '私有域名', re: /daliybook/gi },
  { name: '私有接口路径', re: /\/api\/v1\//g },
  { name: '内部错误码', re: /\bODN\d{3,}\b/g },
  { name: '内网地址', re: /\b(?:10|127|172\.1[6-9]|192\.168)\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g },
  { name: '凭据关键字', re: /(?:app_?secret|client_?secret|api_?key|BEGIN [A-Z ]*PRIVATE KEY)/gi },
];

const files = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)
  // 闸自身写着这些规则串，必须排除，否则永远自举报
  .filter((file) => file !== 'scripts/check-public-safety.mjs')
  .filter((file) => !/^(?:LICENSE|package-lock\.json)$/.test(file));

const hits = [];
for (const file of files) {
  let text;
  try {
    text = readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  for (const rule of RULES) {
    for (const match of text.matchAll(rule.re)) {
      const line = text.slice(0, match.index ?? 0).split('\n').length;
      hits.push(`${file}:${line}  [${rule.name}] ${match[0]}`);
    }
  }
}

if (hits.length) {
  console.error('发现业务字面量或凭据，公共仓库不允许提交：');
  for (const hit of hits) console.error('  ' + hit);
  process.exit(1);
}

console.log(`脱敏闸通过：${files.length} 个文件，未发现业务字面量或凭据。`);
