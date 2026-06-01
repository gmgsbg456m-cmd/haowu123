/**
 * 🔍 关键词研究脚本
 * 使用 DeepSeek AI 分析热门话题，生成话题队列
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..');

async function research() {
  console.log('🔍 开始关键词研究...');

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.log('⚠️ 无API Key，使用默认话题库');
    return;
  }

  const systemPrompt = `你是SEO关键词研究专家，专注于中国市场和中文搜索引擎优化。
你需要分析当前消费趋势，生成高价值的好物推荐文章话题。

要求：
1. 话题必须具体（不要泛泛的"耳机推荐"，要"2025年200元以下蓝牙耳机推荐"）
2. 优先长尾关键词（竞争小、转化率高）
3. 结合季节性需求（如夏季防晒、冬季保暖）
4. 覆盖多个品类（数码、家居、厨房、办公等）

输出JSON格式：{ "topics": [ { "topic": "...", "category": "...", "priority": 1-10, "reason": "..." } ] }`;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 4096,
        temperature: 0.8,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `请生成20个适合好物推荐博客的文章话题。今天是${new Date().toLocaleDateString('zh-CN')}。
覆盖品类：数码好物、家居好物、厨房好物、办公好物、出行好物、个护好物。
每个话题标注优先级(1-10)，10为最高。优先考虑当前季节和热点的需求。` },
        ],
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const dir = join(rootDir, 'data');
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

      const queuePath = join(dir, 'topic-queue.json');
      let existing = [];
      if (existsSync(queuePath)) {
        existing = JSON.parse(readFileSync(queuePath, 'utf-8'));
      }

      const existingTopics = new Set(existing.map(t => t.topic));
      const newTopics = (parsed.topics || []).filter(t => !existingTopics.has(t.topic));
      const merged = [...existing, ...newTopics];

      writeFileSync(queuePath, JSON.stringify(merged, null, 2));
      console.log(`✅ 新增 ${newTopics.length} 个话题，总计 ${merged.length} 个`);
    }
  } catch (error) {
    console.error('❌ 关键词研究失败:', error.message);
  }
}

research();
