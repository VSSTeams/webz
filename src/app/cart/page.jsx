// app/cart/page.jsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import styles from "@/app/ui/cart/cart.module.css";
import { IoMdClose } from "react-icons/io";
import Header from "../ui/index/header/header";
import Navbar from "../ui/index/navbar/Navbar";
import { MdOutlineHome, MdNavigateNext } from "react-icons/md";
import { useRouter } from 'next/navigation'; // Import useRouter
import Footer from "../ui/index/footer/footer";


export default function CartPage() {
    const [cartDetails, setCartDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;
    const [localCartItems, setLocalCartItems] = useState([]); // State giỏ hàng ở IndexPage
    const router = useRouter();

    const handleCartUpdate = (updatedCart) => {
        setLocalCartItems(updatedCart);
        // Bạn có thể cần lưu trạng thái này vào localStorage hoặc Redux nếu cần duy trì
        // khi người dùng chuyển trang hoặc refresh.
    };

    useEffect(() => {
        const storedId = localStorage.getItem("sessionId");
        if (storedId) {
            setUserId(storedId);
            fetchCartItems(storedId);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchCartItems = useCallback(async (userId) => {
        setLoading(true);
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
                    setCartDetails(productDetails);
                } else {
                    setCartDetails([]);
                }
            } else {
                setCartDetails([]);
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
            setCartDetails([]);
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

    const formatPrice = (price) => {
        if (price === null || price === undefined) return "N/A";
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const updateCartItemQuantity = async (cartDetailId, newQuantity, cartId, productId) => {
        if (!userId) {
            console.error("User ID not available.");
            return;
        }
        if (newQuantity < 1) {
            await removeCartItem(cartDetailId);
            return;
        }
        try {
            const response = await axios.put(`${apiUrl}/carts_detail/${cartDetailId}`, {
                quantity: newQuantity,
                cart_id: cartId,
                product_id: productId,
            });
            if (response.data.success) {
                console.log("Cart item quantity updated.");
                // Cập nhật state cartDetails trực tiếp
                setCartDetails(currentDetails =>
                    currentDetails.map(item =>
                        item.id === cartDetailId ? { ...item, quantity: newQuantity } : item
                    )
                );
            } else {
                console.error("Failed to update cart item quantity:", response.data.message);
            }
        } catch (error) {
            console.error("Error updating cart item quantity:", error.response?.data || error.message);
        }
    };

    const removeCartItem = async (cartDetailId) => {
        if (!userId) {
            console.error("User ID not available.");
            return;
        }
        try {
            const response = await axios.delete(`${apiUrl}/carts_detail/${cartDetailId}`);
            if (response.data.success) {
                console.log("Cart item removed.");
                // Cập nhật state cartDetails trực tiếp
                setCartDetails(currentDetails =>
                    currentDetails.filter(item => item.id !== cartDetailId)
                );
            } else {
                console.error("Failed to remove cart item:", response.data.message);
            }
        } catch (error) {
            console.error("Error removing cart item:", error.response?.data || error.message);
        }
    };

    function handleIncrement(item) {
        updateCartItemQuantity(item.id, item.quantity + 1, item.cart_id, item.product_id);
    }

    function handleDecrement(item) {
        updateCartItemQuantity(item.id, item.quantity - 1, item.cart_id, item.product_id);
    }

    const calculateTotalPrice = () => {
        return cartDetails.reduce((total, item) => total + item.product?.price * item.quantity, 0);
    };

    const handleCheckoutClick = () => {
        router.push('/checkout');
    };

    if (loading) {
        return <div>Đang tải giỏ hàng...</div>;
    }

    return (
        <>
            <Header cartItems={localCartItems} /> {/* Render Header và truyền cartItems */}
            <Navbar />
            <div className={styles.container}>
                <h1 className={styles.categoryTitle}>Giỏ hàng của bạn</h1>
                <div className={styles.breadcrumbContainer}> {/* Bọc breadcrumb lại */}
                    <div className={styles.breadcrumb}>
                        <Link href="/" className={styles.home}><MdOutlineHome /></Link>
                        <MdNavigateNext className={styles.navigate} />
                        {/* Link breadcrumb nên giống link Navbar */}
                        <span>Cart</span>
                    </div>
                </div>
                <div className={styles.cartPage}>
                    {cartDetails.length > 0 ? (
                        <div className={styles.cartContainer}>
                            <ul className={styles.cartItemList}>
                                {cartDetails.map((item) => (
                                    <li key={item.id} className={styles.cartItem}>
                                        <Link href={`/p/${item.product?.name.toLowerCase().replace(/ /g, '-')}-${item.product?.id}.html`} className={styles.productLink}>
                                            <img src={item.product?.image} alt={item.product?.name} className={styles.productImage} />
                                            <span className={styles.productName}>{item.product?.name}</span>
                                        </Link>
                                        <div className={styles.quantityControls}>
                                            <button onClick={() => handleDecrement(item)}>-</button>
                                            <span className={styles.quantity}>{item.quantity}</span>
                                            <button onClick={() => handleIncrement(item)}>+</button>
                                        </div>
                                        <span className={styles.price}>{formatPrice(item.product?.price)}</span>
                                        <span className={styles.total}>{formatPrice(item.product?.price * item.quantity)}</span>
                                        <button onClick={() => removeCartItem(item.id)} className={styles.removeButton}>
                                            <IoMdClose />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className={styles.cartSummary}>
                                <p className={styles.totalPrice}>Tổng cộng: {formatPrice(calculateTotalPrice())}</p>
                                <button onClick={handleCheckoutClick} className={styles.checkoutButton}>Tiến hành thanh toán</button>
                                <Link href="/" className={styles.continueShopping}>Tiếp tục mua sắm</Link>
                            </div>
                        </div>
                    ) : (
                        <p>Giỏ hàng của bạn đang trống. <Link href="/">Tiếp tục mua sắm</Link>.</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}