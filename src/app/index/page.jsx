// app/index/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import BottomContent from "./bottomContent/page";
import styles from "@/app/ui/index/index.module.css";
import BannerPage from "./banner/page";
import IndexLayout from './layout';
import Navbar from '../ui/index/navbar/Navbar'
import Header from '../ui/index/header/header'
import Footer from "../ui/index/footer/footer";

export default function IndexPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;
    const [localCartItems, setLocalCartItems] = useState([]); // State giỏ hàng ở IndexPage

    const handleCartUpdate = (updatedCart) => {
        setLocalCartItems(updatedCart);
        // Bạn có thể cần lưu trạng thái này vào localStorage hoặc Redux nếu cần duy trì
        // khi người dùng chuyển trang hoặc refresh.
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            // Sử dụng endpoint hiện tại hoặc endpoint mới
            const productsResponse = await axios.get(`${apiUrl}/featured-products`);
            const categoriesResponse = await axios.get(`${apiUrl}/categories`);

            if (productsResponse.data.success) {
                const productsData = productsResponse.data.data || [];
                const sortedProducts = productsData
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setProducts(sortedProducts);
            } else {
                setProducts([]);
            }

            if (categoriesResponse.data.success) {
                setCategories(categoriesResponse.data.data.data || []);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error.response?.data || error.message);
            setProducts([]);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Trang Chủ - Hiển thị Sản phẩm theo Danh mục";
        fetchData();
    }, []);

    return (
        <>
            <Header cartItems={localCartItems} /> {/* Render Header và truyền cartItems */}
            <Navbar /> {/* Render Navbar */}
            {loading ? (
                <div className={styles.loader}></div>
            ) : (
                <>
                    <BannerPage />
                    <BottomContent
                        products={products}
                        categories={categories}
                        loading={loading}
                        updateCartInParent={handleCartUpdate}
                    />
                </>
            )}
            <Footer />
        </>
    );
}