/**
 * 从文章的文件路径中提取slug
 * 例如: "2026-06-01-bluetooth-earphone-guide.md" → "bluetooth-earphone-guide"
 */
export function getSlug(postId: string): string {
  // 去掉日期前缀 (YYYY-MM-DD-)
  const withoutDate = postId.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  // 去掉 .md 扩展名
  const withoutExt = withoutDate.replace(/\.md$/, '');
  return withoutExt;
}
