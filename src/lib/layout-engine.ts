import { Article } from '@/types';

export type LayoutTemplate = 'Standard' | 'Feature' | 'Interview' | 'Scientific' | 'Review';

export interface LayoutConfig {
  template: LayoutTemplate;
  heroSize: 'small' | 'medium' | 'large' | 'split';
  columnCount: 1 | 2 | 3;
  imagePlacement: 'top' | 'inline' | 'floating' | 'background';
  quoteStyle: 'minimal' | 'callout' | 'pullquote' | 'neon';
  fontSizeScale: 'compact' | 'normal' | 'relaxed';
  enableDropCap: boolean;
  tableOfContents: boolean;
  accentColor: string;
}

export function extractTextFromTipTap(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (node.text) return node.text;
  if (Array.isArray(node.content)) {
    return node.content.map(extractTextFromTipTap).join(' ');
  }
  if (node.content && typeof node.content === 'object') {
    return extractTextFromTipTap(node.content);
  }
  return '';
}

export function countHeadings(node: any, rawString: string): number {
  if (typeof rawString === 'string') {
    const matches = rawString.match(/<h2|heading",\s*"attrs":\s*{\s*"level":\s*2/gi);
    if (matches) return matches.length;
  }
  let count = 0;
  function traverse(n: any) {
    if (!n) return;
    if (n.type === 'heading' && n.attrs?.level === 2) {
      count++;
    }
    if (Array.isArray(n.content)) {
      n.content.forEach(traverse);
    }
  }
  traverse(node);
  return count;
}

export function countQuotes(node: any, rawString: string): number {
  if (typeof rawString === 'string') {
    const matches = rawString.match(/<blockquote|blockquote"/gi);
    if (matches) return matches.length;
  }
  let count = 0;
  function traverse(n: any) {
    if (!n) return;
    if (n.type === 'blockquote') count++;
    if (Array.isArray(n.content)) n.content.forEach(traverse);
  }
  traverse(node);
  return count;
}

export function countImages(node: any, rawString: string): number {
  if (typeof rawString === 'string') {
    const matches = rawString.match(/<img|image"/gi);
    if (matches) return matches.length;
  }
  let count = 0;
  function traverse(n: any) {
    if (!n) return;
    if (n.type === 'image') count++;
    if (Array.isArray(n.content)) n.content.forEach(traverse);
  }
  traverse(node);
  return count;
}

export function generateLayout(
  article: Partial<Article> | string | any,
  optionalCategory?: string
): LayoutConfig {
  let contentObj: any = null;
  let rawText = '';
  let category = optionalCategory ? optionalCategory.toUpperCase() : '';

  if (typeof article === 'string') {
    rawText = article;
  } else if (article && typeof article === 'object') {
    category = category || (article.category || '').toUpperCase();
    if (typeof article.content === 'string') {
      try {
        contentObj = JSON.parse(article.content);
        rawText = extractTextFromTipTap(contentObj);
      } catch {
        rawText = article.content;
      }
    } else if (article.content && typeof article.content === 'object') {
      contentObj = article.content;
      rawText = extractTextFromTipTap(contentObj);
    }
  }

  const rawJsonString = contentObj ? JSON.stringify(contentObj) : rawText;
  const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).filter(Boolean).length : 0;
  const h2Count = countHeadings(contentObj, rawJsonString);
  const quoteCount = countQuotes(contentObj, rawJsonString);
  const imageCount = countImages(contentObj, rawJsonString);

  const isInterview = quoteCount > 2 || rawText.toLowerCase().includes('interviewer:') || rawText.toLowerCase().includes('q:');
  const isScienceCategory = category === 'SCIENCE' || category.includes('SCIENCE');
  const hasMultipleHeadings = h2Count > 3;

  // 1. Interview styling if > 2 quotes or interview format
  if (isInterview) {
    return {
      template: 'Interview',
      heroSize: 'split',
      columnCount: 1,
      imagePlacement: imageCount > 1 ? 'floating' : 'inline',
      quoteStyle: 'callout',
      fontSizeScale: 'relaxed',
      enableDropCap: true,
      tableOfContents: hasMultipleHeadings,
      accentColor: '#7C5CFC', // Purple
    };
  }

  // 2. Science Category template
  if (isScienceCategory) {
    return {
      template: 'Scientific',
      heroSize: 'large',
      columnCount: wordCount > 800 ? 2 : 1,
      imagePlacement: imageCount > 1 ? 'floating' : 'top',
      quoteStyle: 'pullquote',
      fontSizeScale: 'normal',
      enableDropCap: true,
      tableOfContents: hasMultipleHeadings,
      accentColor: '#00A896', // Teal
    };
  }

  // 3. Feature Article if Word Count > 1000
  if (wordCount > 1000 || hasMultipleHeadings) {
    return {
      template: 'Feature',
      heroSize: 'large',
      columnCount: 2,
      imagePlacement: imageCount > 1 ? 'floating' : 'top',
      quoteStyle: 'pullquote',
      fontSizeScale: 'relaxed',
      enableDropCap: true,
      tableOfContents: hasMultipleHeadings,
      accentColor: '#0077ED', // Deep Electric Blue
    };
  }

  // 4. Standard Layout for < 500 or default
  return {
    template: 'Standard',
    heroSize: 'medium',
    columnCount: 1,
    imagePlacement: imageCount > 1 ? 'floating' : 'top',
    quoteStyle: 'minimal',
    fontSizeScale: 'normal',
    enableDropCap: false,
    tableOfContents: false,
    accentColor: '#0077ED',
  };
}
