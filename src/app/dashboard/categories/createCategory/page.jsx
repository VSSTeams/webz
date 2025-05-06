"use client";
import React, { useEffect} from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from '@/app/ui/dashboard/categories/actionCategory/actionCategory.module.css'

export default function CreateCategoryPage() {
    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;
    const router = useRouter();

    useEffect(() => {
        document.title = "Page Create Category";
      }, []);
    const handleSubmit = async (event) => {
        event.preventDefault(); // Ngăn chặn hành động mặc định của form

        // Lấy dữ liệu từ form
        const formData = new FormData(event.target);
        const categoryData = {
            name: formData.get('name'),
        };

        try {
            // Gửi dữ liệu qua API sử dụng axios
            const response = await axios.post(`${apiUrl}/categories`, categoryData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Xử lý kết quả
            if (response.data.success) {
                alert('Category Created Successfully!');
                router.push("/dashboard/categories");
            } else {
                alert('Failed To Create Category.');
                console.error('API Error:', response.data);
            }
        } catch (error) {
            alert('An error occurred while submitting the form.');
            console.error('Error:', error);
        }
    };
    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input type="text" placeholder='Category name' name='name' required />
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}
