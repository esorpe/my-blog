import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/posts');

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  [key: string]: any;
}

/**
 * Get all markdown posts from the local posts directory
 * Note: This is a utility for static site generation. For runtime post retrieval,
 * use Supabase directly from src/lib/supabase.ts
 */
export function getAllPosts(): Post[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const posts = fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        return getPostBySlug(slug);
      })
      .sort((post1, post2) => new Date(post2.date).getTime() - new Date(post1.date).getTime());

    return posts;
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

export function getPostBySlug(slug: string): Post {
  try {
    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, `${realSlug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Post file not found: ${fullPath}`);
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Ensure date is a string
    let dateStr = data.date || new Date().toISOString().split('T')[0];
    if (dateStr instanceof Date) {
      dateStr = dateStr.toISOString().split('T')[0];
    } else {
      dateStr = String(dateStr);
    }

    return {
      slug: realSlug,
      title: data.title || 'Untitled',
      date: dateStr,
      excerpt: data.excerpt || '',
      content: content,
      ...data,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    throw error;
  }
}

export function getSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading slugs:', error);
    return [];
  }
}

