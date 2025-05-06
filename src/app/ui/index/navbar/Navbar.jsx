// app/layout/navbar/Navbar.jsx
"use client";
import React, { useEffect, useState } from "react";
import styles from "./navbar.module.css"; // Đảm bảo đường dẫn CSS đúng
import Link from "next/link";
import axios from "axios";

export default function Navbar() {
    const [categories, setCategories] = useState([]);
    // const [subitems, setSubitems] = useState([]); // --- Bỏ subitems state
    const [products, setProducts] = useState([]);   // --- Thay articles bằng products state
    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;

    // Hàm chuyển đổi tên thành kebab-case (không đổi)
    const toKebabCase = (str) => {
        if (!str) return ''; // Thêm kiểm tra null/undefined
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    // Fetch categories và products từ API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const categoriesResponse = await axios.get(`${apiUrl}/categories`);
                if (categoriesResponse.data.success) {
                    setCategories(categoriesResponse.data.data.data || []); // Thêm fallback []
                } else {
                    setCategories([]); // Reset nếu API không success
                }

                // --- Fetch products thay vì articles ---
                const productsResponse = await axios.get(`${apiUrl}/products`);
                if (productsResponse.data.success) {
                    setProducts(productsResponse.data.data.data || []); // Thêm fallback []
                } else {
                    setProducts([]); // Reset nếu API không success
                }

            } catch (error) {
                console.error("Error fetching navbar data:", error);
                setCategories([]); // Reset state khi có lỗi
                setProducts([]);   // Reset state khi có lỗi
            }
        };

        fetchData();
    }, [apiUrl]); // Phụ thuộc vào apiUrl

    // --- Thay thế hasValidSubitems bằng hasProducts ---
    const hasProducts = (categoryId) => {
        // Kiểm tra xem mảng products có tồn tại và có phần tử không
        if (!products || products.length === 0) {
            return false;
        }
        // Kiểm tra xem có sản phẩm nào thuộc categoryId này không
        return products.some((product) => product.id_category === categoryId);
    };

    return (
        <nav className={styles.navbar}>
            <ul className={styles.navList}>
                {/* Có thể thêm link Trang chủ ở đây nếu muốn */}
                <li className={styles.navItem}>
                    <Link href="/" className={styles.navLink}>
                        Trang chủ
                    </Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/all-products" className={styles.navLink}>
                        Tất cả sản phẩm
                    </Link>
                </li>
                {/* Lặp qua các categories */}
                {categories.map((category) => {
                    // Kiểm tra xem category này có sản phẩm không
                    if (!hasProducts(category.id)) {
                        // Nếu không có sản phẩm thì không hiển thị category này trên navbar
                        return null;
                    }

                    // Chỉ hiển thị category nếu có sản phẩm
                    const categorySlug = toKebabCase(category.name);

                    return (
                        <li key={category.id} className={styles.navItem}>
                            <Link
                                href={`/${categorySlug}`}
                                className={styles.navLink}
                            >
                                {category.name || "Unnamed Category"}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}