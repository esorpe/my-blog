import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import DOMPurify from 'dompurify';

export async function renderMarkdown(markdown: string): Promise<string> {
  try {
    const processor = unified()
      .use(remarkParse)
      .use(remarkHtml);
    
    const result = await processor.process(markdown);
    const html = String(result);
    
    // Sanitize HTML to prevent XSS attacks
    const clean = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'code', 'pre', 'blockquote'],
      ALLOWED_ATTR: ['href', 'title', 'src', 'alt'],
      KEEP_CONTENT: true,
    });
    
    return clean;
  } catch (error) {
    console.error('Error rendering markdown:', error);
    return `<p>${DOMPurify.sanitize(markdown)}</p>`;
  }
}
