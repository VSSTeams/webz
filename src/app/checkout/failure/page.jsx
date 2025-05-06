"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/ui/checkout/checkout.module.css';

export default function FailurePage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/'); // Chuyển hướng về trang chủ sau 3 giây
        }, 3000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className={styles.container}>
            <h1>Thanh toán thất bại</h1>
            <p>Đã có lỗi xảy ra. Bạn sẽ được chuyển hướng về trang chủ trong giây lát...</p>
        </div>
    );
}