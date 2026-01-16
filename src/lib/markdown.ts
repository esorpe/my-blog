import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/posts');

let md: any;
try {
  const MarkdownIt = require('markdown-it');
  md = new MarkdownIt();
} catch (e) {
  md = null;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  [key: string]: any;
}

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      return getPostBySlug(slug);
    })
    .sort((post1, post2) => new Date(post2.date).getTime() - new Date(post1.date).getTime());

  return posts;
}

export function getPostBySlug(slug: string): Post {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // Ensure date is a string
  let dateStr = data.date || new Date().toISOString().split('T')[0];
  if (dateStr instanceof Date) {
    dateStr = dateStr.toISOString().split('T')[0];
  } else {
    dateStr = String(dateStr);
  }

  const renderedContent = md ? md.render(content) : `<p>${content}</p>`;

  return {
    slug: realSlug,
    title: data.title || 'Untitled',
    date: dateStr,
    excerpt: data.excerpt || '',
    content: renderedContent,
    ...data,
  };
}

export function getSlugs(): string[] {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}
