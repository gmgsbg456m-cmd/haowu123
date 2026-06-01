/**
 * 计算中文文章的阅读时间
 * 中文阅读速度约 400字/分钟
 */
export function getReadingTime(text: string): number {
  const chineseChars = (text.match(/[一-鿿]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  // 每个英文单词约等于2个中文字符
  const totalChars = chineseChars + englishWords * 2;
  const minutes = Math.ceil(totalChars / 400);
  return Math.max(1, minutes);
}

export function getWordCount(text: string): number {
  const chineseChars = (text.match(/[一-鿿]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  return chineseChars + englishWords;
}
