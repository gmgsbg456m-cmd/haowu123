/**
 * 🤖 全自动AI内容生成管道
 *
 * 5个阶段：
 * 1. 话题研究 → 从话题队列选择最佳话题
 * 2. 大纲生成 → AI生成SEO优化大纲
 * 3. 文章写作 → AI写完整文章
 * 4. SEO优化 → 关键词优化、元描述生成
 * 5. 自动发布 → 写入Markdown文件
 *
 * 用法: node scripts/generate-content.js [topic]
 * 环境变量: ANTHROPIC_API_KEY (DeepSeek密钥)
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..');

// ============================================================
// 配置
// ============================================================
const CONFIG = {
  siteName: '好物123',
  siteUrl: 'https://haowu123.com',
  category: 'digital',
  minWords: 1500,
  model: 'deepseek-chat',  // DeepSeek V3，中文写作优秀
  apiBase: 'https://api.deepseek.com/v1',
};
  language: 'zh-CN',
};

// 分类配置
const CATEGORIES = {
  digital: { name: '数码好物', tags: ['数码', '电子产品', '测评', '性价比'] },
  home: { name: '家居好物', tags: ['家居', '收纳', '家具', '生活'] },
  kitchen: { name: '厨房好物', tags: ['厨房', '厨具', '料理', '美食'] },
  office: { name: '办公好物', tags: ['办公', '效率', '桌面', '文具'] },
  travel: { name: '出行好物', tags: ['出行', '旅行', '户外', '运动'] },
  'personal-care': { name: '个护好物', tags: ['护肤', '洗护', '美容', '健康'] },
};

// ============================================================
// 话题队列
// ============================================================
function loadTopicQueue() {
  const path = join(rootDir, 'data', 'topic-queue.json');
  if (existsSync(path)) {
    return JSON.parse(readFileSync(path, 'utf-8'));
  }
  return [
    { topic: '2025年性价比最高的智能手表推荐', category: 'digital', priority: 8 },
    { topic: '租房党必备的20件实用好物', category: 'home', priority: 9 },
    { topic: '2025空气炸锅推荐：从入门到高端', category: 'kitchen', priority: 7 },
    { topic: '远程办公效率工具推荐', category: 'office', priority: 8 },
    { topic: '露营新手装备清单', category: 'travel', priority: 7 },
    { topic: '男士护肤品推荐：从零开始的护肤指南', category: 'personal-care', priority: 8 },
    { topic: '手机配件推荐：充电器、手机壳、贴膜', category: 'digital', priority: 7 },
    { topic: '小户型收纳神器推荐', category: 'home', priority: 8 },
    { topic: '电饭煲选购指南：IH还是普通？', category: 'kitchen', priority: 6 },
    { topic: '人体工学椅选购终极指南', category: 'office', priority: 9 },
    { topic: '行李箱推荐：20寸登机箱选购指南', category: 'travel', priority: 7 },
    { topic: '电动牙刷推荐：从入门到旗舰', category: 'personal-care', priority: 8 },
  ];
}

function saveTopicQueue(queue) {
  const dir = join(rootDir, 'data');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'topic-queue.json'), JSON.stringify(queue, null, 2));
}

// ============================================================
// DeepSeek API 客户端 (OpenAI兼容格式)
// ============================================================
async function callAI(systemPrompt, userMessage, options = {}) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('❌ 缺少 ANTHROPIC_API_KEY 环境变量（DeepSeek密钥）');
    console.error('请设置: export ANTHROPIC_API_KEY=sk-xxx');
    process.exit(1);
  }

  const url = `${CONFIG.apiBase}/chat/completions`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ];

  const body = {
    model: options.model || CONFIG.model,
    messages,
    max_tokens: options.maxTokens || 4096,
    temperature: options.temperature || 0.7,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`DeepSeek API 错误 (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';

  return {
    text,
    usage: data.usage,
  };
}

// ============================================================
// 阶段1: 话题研究
// ============================================================
async function stage1TopicResearch(specifiedTopic) {
  console.log('🔍 阶段1: 话题研究...');

  if (specifiedTopic) {
    console.log(`  使用指定话题: ${specifiedTopic}`);
    return {
      topic: specifiedTopic,
      category: 'digital',
      tags: ['好物推荐', '测评'],
      priority: 8,
    };
  }

  const queue = loadTopicQueue();
  if (queue.length === 0) {
    console.log('  ⚠️ 话题队列为空，使用默认话题');
    return {
      topic: '2025年值得入手的好物推荐',
      category: 'digital',
      tags: ['好物推荐'],
      priority: 5,
    };
  }

  // 选择优先级最高的话题
  queue.sort((a, b) => b.priority - a.priority);
  const selected = queue.shift();
  saveTopicQueue(queue);

  console.log(`  选中话题: ${selected.topic} (优先级: ${selected.priority})`);
  return selected;
}

// ============================================================
// 阶段2: 大纲生成
// ============================================================
async function stage2Outline(topicData) {
  console.log('📝 阶段2: 生成文章大纲...');

  const catInfo = CATEGORIES[topicData.category] || CATEGORIES['digital'];

  const systemPrompt = `你是一位专业的好物推荐博主，擅长写中文好物测评和推荐文章。
你的文章风格：客观真实、有数据支撑、排版清晰、对读者购买决策有帮助。

你需要为给定的文章主题生成一个详细的SEO优化大纲。
大纲要求：
1. 包含H2和H3标题层级
2. 每个章节简要说明内容要点
3. 包含一个FAQ章节（有助于获得搜索引擎"人们还问"的展示位置）
4. 建议3-5个目标关键词
5. 建议内部链接的文章主题（2-3个）

输出JSON格式。`;

  const userMessage = `请为以下文章主题生成详细大纲：

主题：${topicData.topic}
分类：${catInfo.name}
目标读者：对生活品质有追求的25-40岁消费者

请输出JSON格式，包含 outline（数组，每项含level/heading/content）、keywords（关键词数组）、internalLinks（内部链接主题数组）、faqQuestions（3-5个FAQ问题）。`;

  const result = await callAI(systemPrompt, userMessage, { temperature: 0.6 });
  console.log(`  大纲生成完成 (tokens: ${result.usage?.input_tokens + result.usage?.output_tokens})`);

  try {
    const jsonMatch = result.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.log('  ⚠️ JSON解析失败，使用文本作为大纲');
  }

  return { outlineRaw: result.text, keywords: topicData.tags || [], internalLinks: [], faqQuestions: [] };
}

// ============================================================
// 阶段3: 文章写作
// ============================================================
async function stage3Write(topicData, outline) {
  console.log('✍️  阶段3: AI写作中...');

  const catInfo = CATEGORIES[topicData.category] || CATEGORIES['digital'];

  const systemPrompt = `你是一位资深的好物推荐博主，拥有10年消费品测评经验。
你的写作风格特点：
- 开头用真实场景引入，让读者产生共鸣
- 每个推荐都包含具体的理由和数据支撑
- 使用 emoji 增强可读性但不过度
- 语气亲切自然，像朋友在分享购物心得
- 客观中立，优点缺点都写清楚

重要规则：
1. 文章总字数至少1500字（中文），越长越好
2. 使用Markdown格式（## 标题、**加粗**、- 列表、| 表格）
3. 每个推荐的产品包含：产品名、参考价格、推荐指数（⭐1-5）、优点、缺点
4. 文末加总结段落
5. 自然融入联盟营销链接的占位符（用[购买链接]标记）
6. 避免使用"作为一个AI"、"根据我的训练数据"等暴露AI身份的表达
7. 文章要有个人化的口吻，读起来像真实的人在分享经验
8. 包含实用的购买建议和避坑指南`;

  let outlineText = '';
  if (outline.outline && Array.isArray(outline.outline)) {
    outlineText = outline.outline.map(item =>
      `${'#'.repeat(item.level)} ${item.heading}\n${item.content || ''}`
    ).join('\n\n');
  } else if (outline.outlineRaw) {
    outlineText = outline.outlineRaw;
  }

  const userMessage = `请写一篇高质量的中文好物推荐文章。

主题：${topicData.topic}
分类：${catInfo.name}
目标关键词：${(outline.keywords || topicData.tags || ['好物推荐']).join(', ')}

大纲参考：
${outlineText}

FAQ需包含：
${(outline.faqQuestions || ['这个产品值得买吗？', '如何选择最适合自己的？']).join('\n')}

请直接输出完整的Markdown文章，包含frontmatter。`;

  const result = await callAI(systemPrompt, userMessage, { maxTokens: 8192 });
  console.log(`  文章写作完成 (${result.text.length} 字符)`);

  return result.text;
}

// ============================================================
// 阶段4: SEO优化
// ============================================================
async function stage4SEO(article, topicData, outline) {
  console.log('🔧 阶段4: SEO优化...');

  const systemPrompt = `你是一位SEO专家。你的任务是对给定的中文文章进行SEO优化分析。
请检查以下方面：
1. 标题是否包含目标关键词（50-60字符最佳）
2. 元描述是否吸引点击（120-160字符）
3. 文章是否自然使用了关键词（不要堆砌）
4. 是否有利于Featured Snippet的段落（清晰的定义或列表）
5. 是否有合适的H2/H3层级结构

输出JSON格式。`;

  const userMessage = `分析以下文章的SEO表现，生成优化后的元数据：

文章主题：${topicData.topic}
目标关键词：${(outline.keywords || ['好物推荐']).join(', ')}

文章内容摘要（前800字符）：
${article.substring(0, 800)}...

请输出JSON：
{
  "seoTitle": "SEO优化后的标题（50-60字符）",
  "metaDescription": "吸引点击的元描述（120-160字符）",
  "slug": "url友好的slug",
  "tags": ["标签1", "标签2", ...],
  "score": 85,
  "suggestions": ["改进建议1", "改进建议2"]
}`;

  try {
    const result = await callAI(systemPrompt, userMessage, { temperature: 0.4, maxTokens: 2048 });
    const jsonMatch = result.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const seo = JSON.parse(jsonMatch[0]);
      console.log(`  SEO得分: ${seo.score}/100`);
      return seo;
    }
  } catch (e) {
    console.log('  ⚠️ SEO分析失败，使用默认元数据');
  }

  return {
    seoTitle: topicData.topic,
    metaDescription: `精选${topicData.topic}相关好物推荐，真实测评帮你做出明智选择。`,
    slug: topicData.topic.replace(/[^\w一-鿿]+/g, '-').toLowerCase().substring(0, 80),
    tags: topicData.tags || ['好物推荐'],
    score: 70,
    suggestions: [],
  };
}

// ============================================================
// 阶段5: 发布
// ============================================================
async function stage5Publish(article, topicData, seoData) {
  console.log('📦 阶段5: 发布文章...');

  // 提取文章正文（去掉可能的frontmatter）
  let cleanArticle = article;
  if (article.startsWith('---')) {
    const endIdx = article.indexOf('---', 3);
    if (endIdx !== -1) {
      cleanArticle = article.substring(endIdx + 3).trim();
    }
  }

  // 生成文件名
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const slug = seoData.slug || topicData.topic.replace(/[^\w一-鿿]+/g, '-').toLowerCase().substring(0, 60);
  const filename = `${dateStr}-${slug}.md`;

  // 构建frontmatter
  const frontmatter = {
    title: seoData.seoTitle || topicData.topic,
    description: seoData.metaDescription || `关于${topicData.topic}的详细推荐指南`,
    pubDate: today.toISOString(),
    tags: seoData.tags || topicData.tags || ['好物推荐'],
    category: topicData.category || 'digital',
    focusKeyword: (seoData.tags || topicData.tags || ['好物推荐'])[0],
  };

  // 构建完整的Markdown文件
  const frontmatterYaml = Object.entries(frontmatter)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
      }
      return `${key}: "${value}"`;
    })
    .join('\n');

  const fullContent = `---\n${frontmatterYaml}\n---\n\n${cleanArticle}`;

  // 写入文件
  const blogDir = join(rootDir, 'src', 'content', 'blog');
  const filePath = join(blogDir, filename);

  writeFileSync(filePath, fullContent, 'utf-8');
  console.log(`  ✅ 文章已保存: src/content/blog/${filename}`);
  console.log(`  📊 文章字数: ${cleanArticle.length} 字符`);

  return { filename, filePath, frontmatter };
}

// ============================================================
// 主流程
// ============================================================
async function main() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║  🤖 全自动AI内容生成管道 v1.0     ║');
  console.log('╚══════════════════════════════════════╝');
  console.log('');

  const specifiedTopic = process.argv[2];

  try {
    // 阶段1: 话题研究
    const topicData = await stage1TopicResearch(specifiedTopic);

    // 阶段2: 大纲生成
    const outline = await stage2Outline(topicData);

    // 阶段3: 文章写作
    const article = await stage3Write(topicData, outline);

    // 阶段4: SEO优化
    const seoData = await stage4SEO(article, topicData, outline);

    // 阶段5: 发布
    const publishResult = await stage5Publish(article, topicData, seoData);

    console.log('');
    console.log('╔══════════════════════════════════════╗');
    console.log('║  ✅ 全流程完成！文章已自动发布    ║');
    console.log('╚══════════════════════════════════════╝');
    console.log('');
    console.log(`  📄 文件: ${publishResult.filename}`);
    console.log(`  🏷️  分类: ${publishResult.frontmatter.category}`);
    console.log(`  🔑 关键词: ${publishResult.frontmatter.focusKeyword}`);

    return publishResult;
  } catch (error) {
    console.error('');
    console.error('❌ 流程失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// 运行
main();
