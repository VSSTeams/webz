"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    document.title = "Page Dashboard";
    // Kiểm tra session và role
    const sessionId = localStorage.getItem('sessionId');
    const role = localStorage.getItem('role');

    if (!sessionId || role !== '1') {
      // Nếu không có session hoặc role không phải là 1, chuyển hướng về trang chủ
      router.push('/login');
    }
  }, [router]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the admin dashboard!</p>
    </div>
  )
}
