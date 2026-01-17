'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminDashboard from './AdminDashboard';
import { User } from '@supabase/supabase-js';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });
    return () => subscription?.unsubscribe();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user || null);
    setLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-4">관리자 로그인</h1>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              로그인
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            계정이 없으신가요? Supabase 대시보드에서 사용자를 생성하세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gray-100 border-b py-3 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <p className="text-sm text-gray-600">로그인됨: <span className="font-semibold">{user.email}</span></p>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            로그아웃
          </button>
        </div>
      </div>
      <AdminDashboard />
    </div>
  );
}
