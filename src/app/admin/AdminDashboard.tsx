'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    content: '',
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        throw error;
      }
      setPosts(data || []);
    } catch (error) {
      const err = error as Error;
      setMessage({ type: 'error', text: `글 로딩 실패: ${err.message}` });
      console.error('Error fetching posts:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      if (editingPost) {
        // Update existing post
        const { error } = await supabase
          .from('posts')
          .update(formData)
          .eq('id', editingPost.id);
        
        if (error) throw error;
        setMessage({ type: 'success', text: '글이 수정되었습니다!' });
      } else {
        // Create new post
        const { error } = await supabase
          .from('posts')
          .insert([formData]);
        
        if (error) throw error;
        setMessage({ type: 'success', text: '글이 작성되었습니다!' });
      }
      
      resetForm();
      await fetchPosts();
    } catch (error) {
      const err = error as Error;
      setMessage({ type: 'error', text: `오류: ${err.message}` });
      console.error('Error saving post:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('정말 이 글을 삭제하시겠습니까?')) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setMessage({ type: 'success', text: '글이 삭제되었습니다!' });
      await fetchPosts();
    } catch (error) {
      const err = error as Error;
      setMessage({ type: 'error', text: `삭제 실패: ${err.message}` });
      console.error('Error deleting post:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(post: Post) {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      date: post.date,
      excerpt: post.excerpt,
      content: post.content,
    });
    setIsEditing(true);
    setMessage(null);
  }

  function resetForm() {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      date: new Date().toISOString().split('T')[0],
      excerpt: '',
      content: '',
    });
    setIsEditing(false);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold">관리자 대시보드</h1>
        <Link href="/blog" className="text-blue-600 hover:text-blue-800">
          블로그로 이동 →
        </Link>
      </div>

      {message && (
        <div className={`mb-8 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">
          {editingPost ? '글 수정' : '새 글 작성'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">제목</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Slug (URL)</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="my-first-post"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">날짜</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">요약</label>
            <input
              type="text"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="글의 짧은 요약"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">내용 (Markdown)</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full border rounded px-3 py-2 h-64 font-mono text-sm"
              placeholder="# 제목&#10;&#10;마크다운 형식으로 작성하세요..."
              required
              disabled={loading}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? '처리 중...' : (editingPost ? '수정하기' : '작성하기')}
            </button>
            {editingPost && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
                disabled={loading}
              >
                취소
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Posts List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">글 목록 ({posts.length})</h2>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{post.title}</h3>
                  <p className="text-sm text-gray-500">{post.date} · /blog/{post.slug}</p>
                  <p className="text-gray-700 mt-2 line-clamp-2">{post.excerpt}</p>
                </div>
                <div className="flex gap-2 ml-4 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(post)}
                    className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 text-sm disabled:opacity-50"
                    disabled={loading}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm disabled:opacity-50"
                    disabled={loading}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="text-gray-500">아직 작성된 글이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
