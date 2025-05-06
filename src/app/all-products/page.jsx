// app/all-products/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import styles from "@/app/ui/all-products/all-products.module.css";
import Header from "../ui/index/header/header";
import Navbar from "../ui/index/navbar/Navbar";
import { FaFilter } from "react-icons/fa";
import Footer from "../ui/index/footer/footer";

export default function AllProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); // Thêm state cho tổng số trang
    const [notification, setNotification] = useState({
        message: "",
        type: "",
        isVisible: false,
    });
    const [userId, setUserId] = useState(null);
    const [localCartItems, setLocalCartItems] = useState([]);
    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;

    // Lấy userId và giỏ hàng
    useEffect(() => {
        const storedId = localStorage.getItem("sessionId");
        if (storedId) {
            setUserId(storedId);
            fetchCartItems(storedId);
        }
    }, []);

    // Lấy dữ liệu sản phẩm và danh mục
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const categoriesResponse = await axios.get(`${apiUrl}/categories`);
                if (categoriesResponse.data.success) {
                    setCategories(categoriesResponse.data.data.data || []);
                } else {
                    setCategories([]);
                }

                // Lấy sản phẩm với tham số page và id_category (nếu có)
                const productsResponse = await axios.get(`${apiUrl}/products`, {
                    params: {
                        id_category: selectedCategory || undefined, // Gửi id_category nếu có
                        page: currentPage, // Gửi trang hiện tại
                    },
                });
                if (productsResponse.data.success) {
                    const productsData = productsResponse.data.data.data || [];
                    setProducts(productsData);
                    setTotalPages(productsResponse.data.data.last_page || 1); // Lấy tổng số trang
                } else {
                    setProducts([]);
                    setTotalPages(1);
                }
            } catch (error) {
                console.error("Error fetching data:", error.response?.data || error.message);
                setProducts([]);
                setCategories([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiUrl, selectedCategory, currentPage]); // Thêm currentPage và selectedCategory vào dependency

    // Lấy giỏ hàng
    const fetchCartItems = async (userId) => {
        try {
            const cartResponse = await axios.get(`${apiUrl}/carts?user_id=${userId}`);
            if (cartResponse.data.success && cartResponse.data.data.length > 0) {
                const cartId = cartResponse.data.data[0].id;
                const cartDetailsResponse = await axios.get(`${apiUrl}/carts_detail?cart_id=${cartId}`);
                if (cartDetailsResponse.data.success) {
                    const details = cartDetailsResponse.data.data.data;
                    const productDetails = await Promise.all(
                        details.map(async (item) => {
                            const productResponse = await axios.get(`${apiUrl}/products/${item.product_id}`);
                            return { ...item, product: productResponse.data.data };
                        })
                    );
                    setLocalCartItems(productDetails);
                } else {
                    setLocalCartItems([]);
                }
            } else {
                setLocalCartItems([]);
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    // Hàm xử lý thêm vào giỏ hàng
    const handleAddToCart = async (productId) => {
        if (!userId) {
            console.error("User ID not available.");
            setNotification({
                message: "Vui lòng đăng nhập để thêm vào giỏ hàng!",
                type: "error",
                isVisible: true,
            });
            setTimeout(() => {
                setNotification(prevState => ({ ...prevState, isVisible: false }));
            }, 3500);
            return;
        }

        try {
            const existingCartResponse = await axios.get(`${apiUrl}/carts?user_id=${userId}`);
            let cartId;
            if (existingCartResponse.data.success && existingCartResponse.data.data.length > 0) {
                cartId = existingCartResponse.data.data[0].id;
            } else {
                const newCartResponse = await axios.post(`${apiUrl}/carts`, { user_id: userId });
                if (newCartResponse.data.success) {
                    cartId = newCartResponse.data.data.id;
                } else {
                    console.error("Failed to create cart:", newCartResponse.data.message);
                    setNotification({
                        message: "Lỗi khi tạo giỏ hàng!",
                        type: "error",
                        isVisible: true,
                    });
                    setTimeout(() => {
                        setNotification(prevState => ({ ...prevState, isVisible: false }));
                    }, 3500);
                    return;
                }
            }

            const existingCartDetailResponse = await axios.get(
                `${apiUrl}/carts_detail?cart_id=${cartId}&product_id=${productId}`
            );
            let success = false;
            if (existingCartDetailResponse.data.success && existingCartDetailResponse.data.data.length > 0) {
                const existingCartDetail = existingCartDetailResponse.data.data[0];
                const updatedQuantity = existingCartDetail.quantity + 1;
                const updateCartDetailResponse = await axios.put(
                    `${apiUrl}/carts_detail/${existingCartDetail.id}`,
                    {
                        cart_id: existingCartDetail.cart_id,
                        product_id: existingCartDetail.product_id,
                        quantity: updatedQuantity,
                    }
                );
                if (updateCartDetailResponse.data.success) {
                    success = true;
                }
            } else {
                const cartDetailResponse = await axios.post(`${apiUrl}/carts_detail`, {
                    cart_id: cartId,
                    product_id: productId,
                    quantity: 1,
                });
                if (cartDetailResponse.data.success) {
                    success = true;
                }
            }

            if (success) {
                await fetchCartItems(userId);
                setNotification({
                    message: "Thêm sản phẩm vào giỏ thành công!",
                    type: "success",
                    isVisible: true,
                });
                setTimeout(() => {
                    setNotification(prevState => ({ ...prevState, isVisible: false }));
                }, 3500);
            }
        } catch (error) {
            console.error("Error adding to cart:", error.response?.data || error.message);
            setNotification({
                message: "Đã xảy ra lỗi khi thêm vào giỏ hàng!",
                type: "error",
                isVisible: true,
            });
            setTimeout(() => {
                setNotification(prevState => ({ ...prevState, isVisible: false }));
            }, 3500);
        }
    };

    const productSlug = (name, id) => {
        if (!name) return `/p/unknown-product-${id}.html`;
        return (
            "/p/" +
            name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "") +
            `-${id}.html`
        );
    };

    const formatPrice = (price) => {
        if (price === null || price === undefined) return "N/A";
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    };

    const handleCloseNotification = () => {
        setNotification(prevState => ({ ...prevState, isVisible: false }));
    };

    // Hàm xử lý chuyển trang
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Hàm render phân trang
    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    className={`${styles.paginationButton} ${currentPage === i ? styles.active : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }
        return <div className={styles.pagination}>{pages}</div>;
    };

    return (
        <>
            <Header cartItems={localCartItems} />
            <Navbar />
            <div className={styles.container}>
                <h1 className={styles.title}>Tất cả sản phẩm</h1>

                {/* Thanh lọc danh mục */}
                <div className={styles.filterSection}>
                    <div className={styles.filterHeader}>
                        <FaFilter /> <span>Lọc theo danh mục</span>
                    </div>
                    <div className={styles.categoryList}>
                        <button
                            className={`${styles.categoryButton} ${!selectedCategory ? styles.active : ""}`}
                            onClick={() => {
                                setSelectedCategory(null);
                                setCurrentPage(1);
                            }}
                        >
                            Tất cả
                        </button>
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`${styles.categoryButton} ${selectedCategory === category.id ? styles.active : ""
                                    }`}
                                onClick={() => {
                                    setSelectedCategory(category.id);
                                    setCurrentPage(1);
                                }}
                            >
                                {category.name || "Unnamed Category"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Thông báo */}
                {notification.isVisible && (
                    <ul className={styles.notificationContainer}>
                        <li className={`${styles.notificationItem} ${styles[notification.type]}`}>
                            <div className={styles.notificationContent}>
                                <div className={styles.notificationIcon}>
                                    {notification.type === "success" && (
                                        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                            ></path>
                                        </svg>
                                    )}
                                    {notification.type === "error" && (
                                        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m6 6 12 12M6 18 18 6"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <div className={styles.notificationText}>{notification.message}</div>
                                <div
                                    className={`${styles.notificationIcon} ${styles.notificationClose}`}
                                    onClick={handleCloseNotification}
                                >
                                    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18 17.94 6M18 18 6.06 6"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                            <div className={styles.notificationProgressBar}></div>
                        </li>
                    </ul>
                )}

                {/* Danh sách sản phẩm */}
                {loading ? (
                    <div className={styles.loader}></div>
                ) : products.length > 0 ? (
                    <>
                        <div className={styles.productList}>
                            {products.map(product => (
                                <div key={product.id} className={styles.productItem}>
                                    <Link
                                        href={productSlug(product.name, product.id)}
                                        className={styles.productImageLink}
                                    >
                                        <img
                                            src={product.image || "/images/placeholder.png"}
                                            alt={product.name || "Product Image"}
                                            className={styles.productImage}
                                        />
                                    </Link>
                                    <div className={styles.productContent}>
                                        <Link href={productSlug(product.name, product.id)}>
                                            <h2 className={styles.productTitle}>
                                                {product.name || "Không có tên"}
                                            </h2>
                                        </Link>
                                        <p className={styles.productPrice}>
                                            {formatPrice(product.price)}
                                        </p>
                                        <div className={styles.addToCart}>
                                            <button onClick={() => handleAddToCart(product.id)}>
                                                Thêm vào giỏ hàng
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Phân trang */}
                        {totalPages > 1 && renderPagination()}
                    </>
                ) : (
                    <p>Không có sản phẩm nào để hiển thị.</p>
                )}
            </div>
            <Footer />
        </>
    );
}