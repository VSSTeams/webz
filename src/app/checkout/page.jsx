// page.jsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from "@/app/ui/checkout/checkout.module.css";
import Header from '../ui/index/header/header';
import Navbar from '../ui/index/navbar/Navbar';
import { MdOutlineHome, MdNavigateNext } from 'react-icons/md';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SuccessAnimation from '../ui/index/successAnimation/page';
import Footer from '../ui/index/footer/footer';

export default function CheckoutPage() {
    const [cartDetails, setCartDetails] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [userId, setUserId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading
    const [isOrderSuccessful, setIsOrderSuccessful] = useState(false); // Trạng thái đặt hàng thành công
    const [paymentWindow, setPaymentWindow] = useState(null); // Lưu trữ tab MoMo
    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;
    const router = useRouter();

    useEffect(() => {
        const storedId = localStorage.getItem("sessionId");
        if (storedId) {
            setUserId(storedId);
            fetchCartDetails(storedId);
        }

        const urlParams = new URLSearchParams(window.location.search);
        const success = urlParams.get('success');
        if (success === 'true') {
            setIsOrderSuccessful(true);
            setIsLoading(false);
            localStorage.removeItem('pendingOrderId');
        } else if (success === 'false') {
            setIsLoading(false);
            alert("Thanh toán MoMo thất bại. Vui lòng thử lại.");
        }
    }, []);

    const fetchCartDetails = async (userId) => {
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
                    calculateTotal(productDetails);
                }
            }
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết giỏ hàng:", error);
            setCartDetails([]);
            setTotalPrice(0);
        }
    };

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => sum + item.product?.price * item.quantity, 0);
        setTotalPrice(total);
    };

    const formatPrice = (price) => {
        return price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price) : "N/A";
    };

    const handlePlaceOrder = async () => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            alert("Bạn cần đăng nhập để thực hiện thanh toán.");
            router.push('/login');
            return;
        }

        if (!userId || cartDetails.length === 0) {
            alert("Giỏ hàng trống hoặc không có thông tin người dùng.");
            return;
        }

        const formData = new FormData(document.querySelector('form'));
        const orderData = {
            email: formData.get('email'),
            name: formData.get('name'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            payment_method: paymentMethod,
            cart_items: cartDetails.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.product?.price,
            })),
        };

        try {
            setIsLoading(true); // Bật loading
            const response = await axios.post(`${apiUrl}/checkout`, orderData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (paymentMethod === 'COD' && (response.data.success || response.status === 201)) {
                setIsOrderSuccessful(true);
                setCartDetails([]);
                setTotalPrice(0);
                setIsLoading(false);
            } else if (paymentMethod === 'MoMo' && response.data.payUrl) {
                // Mở tab mới cho MoMo
                const newWindow = window.open(response.data.payUrl, '_blank');
                setPaymentWindow(newWindow);

                // Lưu order_id để kiểm tra trạng thái
                localStorage.setItem('pendingOrderId', response.data.order_id);

                // Kiểm tra trạng thái thanh toán
                const interval = setInterval(async () => {
                    try {
                        const orderStatus = await axios.get(`${apiUrl}/orders/${response.data.order_id}`, {
                            headers: { Authorization: `Bearer ${authToken}` },
                        });
                        if (orderStatus.data.status === 1) { // Giả sử status = 1 là thành công
                            clearInterval(interval);
                            setIsOrderSuccessful(true);
                            setIsLoading(false);
                            setCartDetails([]);
                            setTotalPrice(0);
                            localStorage.removeItem('pendingOrderId');
                            if (newWindow) newWindow.close(); // Đóng tab MoMo
                        }
                    } catch (error) {
                        console.error("Lỗi kiểm tra trạng thái đơn hàng:", error);
                    }
                }, 2000); // Kiểm tra mỗi 2 giây
            } else {
                alert(`Đặt hàng thất bại: ${response.data?.message || 'Lỗi không xác định'}`);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Lỗi khi đặt hàng:", error);
            alert("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOrderSuccessful) {
            const timer = setTimeout(() => {
                router.push('/');
            }, 2000); // Chuyển về trang chủ sau 2 giây
            return () => clearTimeout(timer);
        }
    }, [isOrderSuccessful, router]);

    return (
        <>
            <Header />
            <Navbar />
            <div className={styles.container}>
                <h1 className={styles.title}>Thanh toán</h1>
                <div className={styles.breadcrumbContainer}>
                    <div className={styles.breadcrumb}>
                        <Link href="/" className={styles.home}><MdOutlineHome /></Link>
                        <MdNavigateNext className={styles.navigate} />
                        <Link href="/cart" className={styles.cart}>Giỏ hàng</Link>
                        <MdNavigateNext className={styles.navigate} />
                        <span className={styles.checkout}>Thanh toán</span>
                    </div>
                </div>
                <div className={styles.checkoutPage}>
                    <div className={styles.checkoutContainer}>
                        <div className={styles.orderDetails}>
                            <h2>Chi tiết đơn hàng</h2>
                            <ul className={styles.orderItemList}>
                                {cartDetails.map(item => (
                                    <li key={item.id} className={styles.orderItem}>
                                        <span className={styles.productName}>{item.product?.name}</span>
                                        <span className={styles.quantity}>x {item.quantity}</span>
                                        <span className={styles.price}>{formatPrice(item.product?.price * item.quantity)}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className={styles.total}>Tổng cộng: {formatPrice(totalPrice)}</p>
                        </div>
                        <div className={styles.customerInfo}>
                            <h2>Thông tin khách hàng</h2>
                            {isLoading && (
                                <div className={styles.loadingOverlay}>
                                    <div className={styles.loadingContent}>
                                        <div className={styles.spinner}></div>
                                        <p className={styles.loadingText}>Đang chờ thanh toán...</p>
                                    </div>
                                </div>
                            )}
                            {isOrderSuccessful && (
                                <div className={styles.successAnimationOverlay}>
                                    <div className={styles.loadingContent}>
                                        <SuccessAnimation />
                                        <p className={styles.successText}>Đặt hàng thành công!</p>
                                    </div>
                                </div>
                            )}
                            {!isLoading && !isOrderSuccessful && (
                                <form>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="name">Tên:</label>
                                        <input type="text" id="name" name="name" required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="email">Email:</label>
                                        <input type="email" id="email" name="email" required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="phone">Số điện thoại:</label>
                                        <input type="text" id="phone" name="phone" required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="address">Địa chỉ:</label>
                                        <textarea id="address" name="address" required></textarea>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Phương thức thanh toán:</label>
                                        <div className={styles.paymentMethod}>
                                            <input
                                                type="radio"
                                                id="cod"
                                                name="payment_method"
                                                value="COD"
                                                checked={paymentMethod === 'COD'}
                                                onChange={() => setPaymentMethod('COD')}
                                            />
                                            <label htmlFor="cod">Thanh toán khi nhận hàng (COD)</label>
                                        </div>
                                        <div className={styles.paymentMethod}>
                                            <input
                                                type="radio"
                                                id="momo"
                                                name="payment_method"
                                                value="MoMo"
                                                checked={paymentMethod === 'MoMo'}
                                                onChange={() => setPaymentMethod('MoMo')}
                                            />
                                            <label htmlFor="momo" id={styles.momo}>Thanh toán qua <img src="/momo.png" alt="" className={styles.momoLogo} /></label>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.placeOrderButton}
                                        onClick={handlePlaceOrder}
                                        disabled={isLoading || isOrderSuccessful}
                                    >
                                        {isOrderSuccessful ? 'Đã đặt hàng!' : 'Đặt hàng'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                    {cartDetails.length === 0 && !isOrderSuccessful && !isLoading && (
                        <p>Không có sản phẩm nào trong giỏ hàng để thanh toán. <Link href="/cart">Quay lại giỏ hàng</Link>.</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}