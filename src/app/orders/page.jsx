// app/orders/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import styles from "@/app/ui/orders/orders.module.css";
import axios from "axios";
import Header from "@/app/ui/index/header/header";
import Navbar from "@/app/ui/index/navbar/Navbar";
import Link from "next/link";
import { MdOutlineHome, MdNavigateNext } from "react-icons/md";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useRouter } from "next/navigation";
import Footer from "../ui/index/footer/footer";

dayjs.locale("vi");

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [localCartItems, setLocalCartItems] = useState([]);
    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;
    const router = useRouter();

    // Kiểm tra đăng nhập và lấy userId
    useEffect(() => {
        const storedId = localStorage.getItem("sessionId");
        const token = localStorage.getItem("authToken");

        if (storedId && token) {
            setUserId(storedId);
            fetchCartItems(storedId);
        } else {
            setError("Vui lòng đăng nhập để xem đơn hàng của bạn");
            setLoading(false);
            router.push("/login");
        }
    }, [router]);

    // Lấy giỏ hàng
    const fetchCartItems = async (userId) => {
        try {
            const cartResponse = await axios.get(`${apiUrl}/carts?user_id=${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            if (cartResponse.data.success && cartResponse.data.data.length > 0) {
                const cartId = cartResponse.data.data[0].id;
                const cartDetailsResponse = await axios.get(`${apiUrl}/carts_detail?cart_id=${cartId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });
                if (cartDetailsResponse.data.success) {
                    const details = cartDetailsResponse.data.data.data;
                    const productDetails = await Promise.all(
                        details.map(async (item) => {
                            const productResponse = await axios.get(`${apiUrl}/products/${item.product_id}`, {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                                },
                            });
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

    // Lấy danh sách đơn hàng
    const fetchOrders = async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${apiUrl}/orders`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
            if (response.data.success) {
                setOrders(response.data.data || []);
            } else {
                setError("Không thể lấy danh sách đơn hàng");
            }
        } catch (error) {
            console.error("Error fetching orders:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                localStorage.removeItem("authToken");
                localStorage.removeItem("sessionId");
                router.push("/login");
            } else {
                setError("Đã xảy ra lỗi khi lấy đơn hàng");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchOrders();
        }
    }, [userId]);

    // Format giá tiền
    const formatPrice = (price) => {
        if (price === null || price === undefined) return "Liên hệ";
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    };

    // Format ngày
    const formatDate = (date) => {
        return dayjs(date).format("DD MMMM YYYY, HH:mm");
    };

    // Trạng thái đơn hàng
    const getStatusText = (status) => {
        switch (status) {
            case 0:
                return "Chưa thanh toán, chờ giao hàng";
            case 1:
                return "Đã thanh toán, chờ giao hàng";
            case 2:
                return "Đang giao hàng";
            case 3:
                return "Hoàn thành";
            case 4:
                return "Đã hủy";
            default:
                return "Không xác định";
        }
    };

    // Mở modal chi tiết đơn hàng
    const openOrderDetails = (order) => {
        setSelectedOrder(order);
    };

    // Đóng modal
    const closeOrderDetails = () => {
        setSelectedOrder(null);
    };

    return (
        <>
            <Header cartItems={localCartItems} />
            <Navbar />
            <div className={styles.container}>
                <div className={styles.breadcrumbContainer}>
                    <div className={styles.breadcrumb}>
                        <Link href="/" className={styles.home}>
                            <MdOutlineHome />
                        </Link>
                        <MdNavigateNext className={styles.navigate} />
                        <span className={styles.category}>Đơn hàng của tôi</span>
                    </div>
                </div>
                <h1 className={styles.pageTitle}>Đơn hàng của tôi</h1>
                {loading ? (
                    <div className={styles.loader}></div>
                ) : error ? (
                    <p className={styles.error}>{error}</p>
                ) : orders.length > 0 ? (
                    <div className={styles.ordersList}>
                        {orders.map((order, index) => (
                            <div key={order.id} className={styles.orderItem}>
                                <div className={styles.orderHeader}>
                                    <span>Đơn hàng #{index + 1}</span>
                                    <span>{formatDate(order.created_at)}</span>
                                </div>
                                <div className={styles.orderInfo}>
                                    <p>
                                        <strong>Tổng tiền:</strong>{" "}
                                        {formatPrice(
                                            order.order_details?.reduce(
                                                (sum, detail) => sum + detail.price,
                                                0
                                            ) || 0
                                        )}
                                    </p>
                                    <p>
                                        <strong>Trạng thái:</strong> {getStatusText(order.status)}
                                    </p>
                                    <p>
                                        <strong>Phương thức thanh toán:</strong> {order.payment_method || "Không xác định"}
                                    </p>
                                    <button
                                        className={styles.viewDetailsButton}
                                        onClick={() => openOrderDetails(order)}
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={styles.noOrders}>Bạn chưa có đơn hàng nào.</p>
                )}

                {/* Modal chi tiết đơn hàng */}
                {selectedOrder && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <h2 className={styles.modalTitle}>
                                Chi tiết đơn hàng #{orders.findIndex(o => o.id === selectedOrder.id) + 1}
                            </h2>
                            <p>
                                <strong>Ngày đặt:</strong> {formatDate(selectedOrder.created_at)}
                            </p>
                            <p>
                                <strong>Tên:</strong> {selectedOrder.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {selectedOrder.email}
                            </p>
                            <p>
                                <strong>Số điện thoại:</strong> {selectedOrder.phone}
                            </p>
                            <p>
                                <strong>Địa chỉ:</strong> {selectedOrder.address}
                            </p>
                            <p>
                                <strong>Phương thức thanh toán:</strong>{" "}
                                {selectedOrder.payment_method || "Không xác định"}
                            </p>
                            <p>
                                <strong>Trạng thái:</strong> {getStatusText(selectedOrder.status)}
                            </p>
                            <h3>Sản phẩm</h3>
                            <div className={styles.orderDetailsList}>
                                {selectedOrder.order_details?.length > 0 ? (
                                    selectedOrder.order_details.map((detail) => (
                                        <div key={detail.id} className={styles.orderDetailItem}>
                                            <img
                                                src={detail.product?.image || "/images/placeholder.png"}
                                                alt={detail.product?.name || "Sản phẩm không xác định"}
                                                className={styles.productImage}
                                            />
                                            <div className={styles.detailInfo}>
                                                <p>
                                                    <strong>{detail.product?.name || "Sản phẩm không xác định"}</strong>
                                                </p>
                                                <p>Số lượng: {detail.quantity}</p>
                                                <p>Giá: {formatPrice(detail.price)}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Không có sản phẩm trong đơn hàng này.</p>
                                )}
                            </div>
                            <p className={styles.totalPrice}>
                                <strong>Tổng tiền:</strong>{" "}
                                {formatPrice(
                                    selectedOrder.order_details?.reduce(
                                        (sum, detail) => sum + detail.price,
                                        0
                                    ) || 0
                                )}
                            </p>
                            <button
                                className={styles.closeModalButton}
                                onClick={closeOrderDetails}
                            >
                                x
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}