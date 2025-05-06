"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from '@/app/ui/login/login.module.css';

export default function RegisterPage() {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: ['Mật khẩu xác nhận không khớp.'] });
      return;
    }
    if (password.length < 6) {
      setErrors({ password: ['Mật khẩu phải có ít nhất 6 ký tự.'] });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/users`, {
        name: name,
        email: email,
        phone: phone,
        password: password,
        role: 0,
      });

      setSuccessMessage('Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.');
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          setErrors(error.response.data.errors);
          setGeneralError('Vui lòng kiểm tra lại các thông tin đã nhập.');
        } else if (error.response.status === 400 && error.response.data.message === 'Email already exists') {
          setErrors({ email: ['Email này đã được sử dụng.'] });
          setGeneralError('Email này đã được sử dụng.');
        } else {
          setGeneralError('Đã có lỗi xảy ra phía máy chủ. Vui lòng thử lại sau.');
        }
      } else if (error.request) {
        setGeneralError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.');
      } else {
        setGeneralError('Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Đăng Ký Tài Khoản</h2>
      <p className={styles.description}>Nhập thông tin để tạo tài khoản mới.</p>
      <form className={styles.form} onSubmit={handleRegister}>
        <div>
          <label htmlFor="name" className={styles.label}>Họ và tên</label>
          <input
            className={`${styles.input} ${errors.name ? styles['input-error'] : ''}`}
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
          {errors.name && <p className={styles['error-field']}>{errors.name[0]}</p>}
        </div>
        <div>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            className={`${styles.input} ${errors.email ? styles['input-error'] : ''}`}
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          {errors.email && <p className={styles['error-field']}>{errors.email[0]}</p>}
        </div>
        <div>
          <label htmlFor="phone" className={styles.label}>Số điện thoại</label>
          <input
            className={`${styles.input} ${errors.phone ? styles['input-error'] : ''}`}
            id="phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            disabled={isLoading}
          />
          {errors.phone && <p className={styles['error-field']}>{errors.phone[0]}</p>}
        </div>
        <div>
          <label htmlFor="password" className={styles.label}>Mật khẩu</label>
          <input
            className={`${styles.input} ${errors.password ? styles['input-error'] : ''}`}
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={isLoading}
          />
          {errors.password && <p className={styles['error-field']}>{errors.password[0]}</p>}
        </div>
        <div>
          <label htmlFor="confirmPassword" className={styles.label}>Xác nhận mật khẩu</label>
          <input
            className={`${styles.input} ${errors.confirmPassword ? styles['input-error'] : ''}`}
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          {errors.confirmPassword && <p className={styles['error-field']}>{errors.confirmPassword[0]}</p>}
        </div>
        {generalError && <p className={styles.error}>{generalError}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
        <button className={styles.button} type="submit" disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
        </button>
      </form>
      <p className={styles.footer}>
        Đã có tài khoản? <a className={styles.link} href="/login">Đăng nhập ngay</a>
      </p>
    </div>
  );
}