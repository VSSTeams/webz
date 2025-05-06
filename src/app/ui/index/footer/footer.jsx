"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Footer() {
    const [categories, setCategories] = useState([]);
    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;

    // Hàm chuyển tên danh mục thành slug
    const toSlug = (name) => {
        return name
            .toLowerCase()
            .normalize("NFD") // Chuyển ký tự có dấu thành không dấu
            .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
            .replace(/[^a-z0-9\s-]/g, "") // Xóa ký tự đặc biệt
            .trim()
            .replace(/\s+/g, "-"); // Thay khoảng trắng bằng dấu gạch ngang
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${apiUrl}/categories`);
                const allCategories = response.data.data.data; // Truy cập mảng categories
                // Chọn ngẫu nhiên 4 danh mục
                const shuffled = allCategories.sort(() => 0.5 - Math.random());
                setCategories(shuffled.slice(0, 4));
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, [apiUrl]);

    return (
        <footer className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Cột 1: Thông tin cửa hàng */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Pet Accessories</h3>
                        <p className="text-sm">
                            Cung cấp các sản phẩm chất lượng cao cho thú cưng của bạn, từ đồ chơi, quần áo đến phụ kiện chăm sóc.
                        </p>
                    </div>

                    {/* Cột 2: Danh mục ngẫu nhiên */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Danh Mục Nổi Bật</h3>
                        <ul className="space-y-2">
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <li key={category.id}>
                                        <Link href={`/${toSlug(category.name)}`} className="hover:underline text-sm">
                                            {category.name}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li className="text-sm">Đang tải danh mục...</li>
                            )}
                        </ul>
                    </div>

                    {/* Cột 3: Liên hệ */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Liên Hệ</h3>
                        <p className="text-sm">Email: support@petaccessories.com</p>
                        <p className="text-sm">Hotline: 0123 456 789</p>
                    </div>
                </div>

                {/* Bản quyền */}
                <div className="mt-8 pt-8 border-t border-white/20 text-center">
                    <p className="text-sm">
                        © {new Date().getFullYear()} Pet Accessories. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}