"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from '@/app/ui/dashboard/categories/actionCategory/actionCategory.module.css'

export default function UpdateCategoryPage({ params: paramsPromise }) {
    const params = React.use(paramsPromise); // Unwrap the params Promise
    const { id } = params;
    const [category, setCategory] = useState({
        name: '',
    });
    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;
    const router = useRouter();

    useEffect(() => {
        document.title = "Page Update Category";
        const fetchCategory = async () => {
            try {
                const response = await axios.get(`${apiUrl}/categories/${id}`);
                if (response.data.success) {
                    setCategory(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchCategory();
    }, [id, apiUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory((prevCategory) => ({
            ...prevCategory,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.patch(`${apiUrl}/categories/${id}`, category);
            if (response.data.success) {
                alert("Category updated successfully!");
                router.push("/dashboard/categories"); // Chuyển hướng về trang danh sách người dùng
            } else {
                alert("Failed to update category.");
            }
        } catch (error) {
            console.error("Error updating category:", error);
            alert("An error occurred while updating the category.");
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input type="text" placeholder='Category name' name='name' value={category.name}
                    onChange={handleChange} required />
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}
