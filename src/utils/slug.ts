/**
 * 生成URL友好的slug
 */
export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^一-鿿㐀-䶿a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

/**
 * 从标题生成文件名：YYYY-MM-DD-slug.md
 */
export function generateFilename(date: Date, title: string): string {
  const d = date.toISOString().split('T')[0];
  const slug = slugify(title) || 'article';
  return `${d}-${slug}.md`;
}
