"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../ui/dashboard/sidebar/sidebar';
import Navbar from '../ui/dashboard/navbar/navbar';
import styles from '../ui/dashboard/dashboard.module.css';

export default function Layout({ children }) {
    const router = useRouter();

    useEffect(() => {
        // Kiểm tra session và role
        const sessionId = localStorage.getItem('sessionId');
        const role = localStorage.getItem('role');

        if (!sessionId || role !== '1') {
            // Nếu không có session hoặc role không phải là 1, chuyển hướng về trang chủ
            router.push('/login');
        }
    }, [router]);
    return (
        <div className={styles.container}>
            <div className={styles.menu}>
                <Sidebar />
            </div>
            <div className={styles.content}>
                <Navbar />
                {children}
            </div>
        </div>
    )
}
