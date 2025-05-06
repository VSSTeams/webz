"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from '@/app/ui/login/login.module.css';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/login`, {
        email: email,
        password: password,
      });

      const { access_token, user } = response.data;

      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', access_token);
        localStorage.setItem('sessionId', user.id);
        localStorage.setItem('userPassword', user.password);
        localStorage.setItem('role', user.role);
        localStorage.setItem('name', user.name);
      }

      if (user.role === 1) {
        router.push('/dashboard');
      } else if (user.role === 0) {
        router.push('/');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid email or password');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    const result = await signIn('google', { redirect: false });
    if (result?.error) {
      console.error("Google Sign-in error", result.error);
      setError('Lỗi khi đăng nhập bằng Google');
      return;
    }
    // Lưu ý: Phần này có lỗi logic trong mã gốc (status và session không được định nghĩa).
    // Tôi sẽ giả định bạn sẽ sửa nó sau, giữ nguyên để khớp yêu cầu.
    if (status !== 'authenticated' || !session?.idToken) {
      console.error("Không tìm thấy idToken");
      setError('Không tìm thấy thông tin xác thực');
      return;
    }
    try {
      const response = await axios.post(`${apiUrl}/login/google`, { idToken: session.idToken });
      const { access_token, user } = response.data;
      localStorage.setItem('authToken', access_token);
      localStorage.setItem('sessionId', user.id);
      localStorage.setItem('role', user.role);
      localStorage.setItem('name', user.name);
      router.push(user.role === 1 ? '/dashboard' : '/');
    } catch (error) {
      console.error("Lỗi gửi idToken về Laravel", error);
      setError(error.response?.data?.message || 'Lỗi khi đăng nhập bằng Google');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Login</h2>
      <p className={styles.description}>Enter details below.</p>
      <form className={styles.form} onSubmit={handleLogin}>
        <div>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            className={`${styles.input} ${error ? styles['input-error'] : ''}`}
            placeholder="Email"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            className={`${styles.input} ${error ? styles['input-error'] : ''}`}
            placeholder="Password"
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles['checkbox-container']}>
          <div className="flex items-center">
            <input className={styles.checkbox} id="remember" name="remember" type="checkbox" />
            <span>Remember me</span>
          </div>
          <a className={styles.link} href="#">Forgot Password</a>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.button} id="login" name="login" type="submit">
          Login
        </button>
      </form>
      <div className="mt-4">
        <button className={styles['google-button']} onClick={handleGoogleLogin}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.48 10.92v2.94h4.74c-.21 1.26-.81 2.34-1.71 3.06v2.52h2.73c1.59-1.47 2.52-3.66 2.52-6.18 0-.57-.06-1.14-.15-1.68h-8.13z" fill="#4285F4" />
            <path d="M12 21.75c3.15 0 5.79-1.05 7.71-2.85l-3.66-2.82c-1.05.69-2.37 1.11-4.05 1.11-3.12 0-5.76-2.1-6.72-4.92H1.47v3.09C3.39 19.35 7.35 21.75 12 21.75z" fill="#34A853" />
            <path d="M5.28 14.25c-.24-.69-.39-1.44-.39-2.25s.15-1.56.39-2.25V6.66H1.47C.54 8.46 0 10.14 0 12s.54 3.54 1.47 5.34l3.81-3.09z" fill="#FBBC05" />
            <path d="M12 5.64c1.71 0 3.24.57 4.44 1.68l3.33-3.33C17.79 2.19 15.15 1.25 12 1.25 7.35 1.25 3.39 3.65 1.47 7.65l3.81 3.09c.96-2.82 3.6-4.95 6.72-4.95z" fill="#EA4335" />
          </svg>
          Login with Google
        </button>
      </div>
      <p className={styles.footer}>
        Don’t have an account? <a className={styles.link} href="/register">Sign Up</a>
      </p>
    </div>
  );
}