"use client";
import React, { useEffect, useState } from "react";
import styles from "@/app/ui/product/product.module.css"; // Import new CSS module
import axios from "axios";
import Header from "../../ui/index/header/header";
import Navbar from "../../ui/index/navbar/Navbar";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { MdOutlineHome, MdNavigateNext } from "react-icons/md";
import Footer from "@/app/ui/index/footer/footer";
dayjs.locale("vi");

export default function ProductDetailPage({ params }) {
  const productSlug = React.use(params).articleSlug;
  const [userId, setUserId] = useState(null);
  const [productData, setProductData] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;
  const [localCartItems, setLocalCartItems] = useState([]);
  const [notification, setNotification] = useState({
    message: '',
    type: '', // 'success', 'error', etc.
    isVisible: false,
  });

  const handleCartUpdate = (updatedCart) => {
    setLocalCartItems(updatedCart);
    // Bạn có thể cần lưu trạng thái này vào localStorage hoặc Redux nếu cần duy trì
    // khi người dùng chuyển trang hoặc refresh.
  };

  useEffect(() => {
    const storedId = localStorage.getItem("sessionId");
    if (storedId) {
      setUserId(storedId);
      fetchCartItems(storedId); // Gọi fetch giỏ hàng khi component mount
    }
  }, []);

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

  const extractIdFromSlug = (slug) => {
    if (!slug || typeof slug !== "string") {
      console.error("Invalid slug: slug is undefined or not a string", slug);
      return null;
    }
    const parts = slug.split("-");
    const lastPart = parts[parts.length - 1];
    return lastPart.replace(".html", "");
  };

  useEffect(() => {
    const storedId = localStorage.getItem("sessionId");
    if (storedId) {
      setUserId(storedId);
    }
  }, []);

  const toKebabCase = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .normalize("NFD") // Chuẩn hóa để tách dấu
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
      .replace(/[^a-z0-9]+/g, "-") // Thay khoảng trắng và ký tự đặc biệt bằng "-"
      .replace(/^-+|-+$/g, ""); // Loại bỏ "-" ở đầu và cuối
  };

  const formatPrice = (price) => {
    if (typeof price !== 'number') return 'Giá liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const productId = extractIdFromSlug(productSlug);
      if (!productId) {
        throw new Error("Cannot extract product ID from slug");
      }
      const response = await axios.get(`${apiUrl}/products/${productId}`);
      if (response.data.success) {
        setProductData(response.data.data || null);
      } else {
        setProductData(null);
      }
    } catch (error) {
      console.error("Error fetching product:", error.message || error);
      setProductData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategory = async () => {
    if (!productData) return;
    try {
      const categoryResponse = await axios.get(`${apiUrl}/categories/${productData.id_category}`);
      if (categoryResponse.data.success) {
        setCategory(categoryResponse.data.data);
      } else {
        setCategory(null);
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      setCategory(null);
    }
  };

  useEffect(() => {
    if (productSlug) {
      fetchProduct();
    } else {
      console.error("No product slug provided in params:", params);
      setLoading(false);
      setProductData(null);
    }
  }, [productSlug]);

  useEffect(() => {
    document.title = productData?.name || "Chi tiết sản phẩm";
    if (productData) {
      fetchCategory();
    }
  }, [productData]);

  const renderContent = (content) => {
    if (!content) return null;
    return content.split("\n\n").map((paragraph, index) => (
      <p className={styles.normal} key={index}>{paragraph}</p>
    ));
  };

  const handleAddToCart = async (productId) => {
    if (!userId) {
      console.error("User ID not available.");
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
            message: 'Lỗi khi tạo giỏ hàng!',
            type: 'error',
            isVisible: true,
          });
          setTimeout(() => {
            setNotification(prevState => ({ ...prevState, isVisible: false }));
          }, 3500);
          return;
        }
      }

      const existingCartDetailResponse = await axios.get(`${apiUrl}/carts_detail?cart_id=${cartId}&product_id=${productId}`);
      let success = false;
      if (existingCartDetailResponse.data.success && existingCartDetailResponse.data.data.length > 0) {
        const existingCartDetail = existingCartDetailResponse.data.data[0];
        const updatedQuantity = existingCartDetail.quantity + 1;
        const updateCartDetailResponse = await axios.put(`${apiUrl}/carts_detail/${existingCartDetail.id}`, {
          cart_id: existingCartDetail.cart_id,
          product_id: existingCartDetail.product_id,
          quantity: updatedQuantity,
        });
        if (updateCartDetailResponse.data.success) {
          success = true;
        } else {
          console.error("Failed to update product quantity:", updateCartDetailResponse.data.message);
          setNotification({
            message: updateCartDetailResponse.data.message || 'Lỗi khi cập nhật giỏ hàng!',
            type: 'error',
            isVisible: true,
          });
          setTimeout(() => {
            setNotification(prevState => ({ ...prevState, isVisible: false }));
          }, 3500);
        }
      } else {
        const cartDetailResponse = await axios.post(`${apiUrl}/carts_detail`, {
          cart_id: cartId,
          product_id: productId,
          quantity: 1
        });
        if (cartDetailResponse.data.success) {
          success = true;
        } else {
          console.error("Failed to add product to cart detail:", cartDetailResponse.data.message);
          setNotification({
            message: cartDetailResponse.data.message || 'Lỗi khi thêm vào giỏ hàng!',
            type: 'error',
            isVisible: true,
          });
          setTimeout(() => {
            setNotification(prevState => ({ ...prevState, isVisible: false }));
          }, 3500);
        }
      }

      if (success) {
        // Gọi fetchCartItems để đồng bộ dữ liệu từ server
        await fetchCartItems(userId);
        setNotification({
          message: 'Thêm sản phẩm vào giỏ thành công!',
          type: 'success',
          isVisible: true,
        });
        setTimeout(() => {
          setNotification(prevState => ({ ...prevState, isVisible: false }));
        }, 3500);
      }
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
      setNotification({
        message: 'Đã xảy ra lỗi khi thêm vào giỏ hàng!',
        type: 'error',
        isVisible: true,
      });
      setTimeout(() => {
        setNotification(prevState => ({ ...prevState, isVisible: false }));
      }, 3500);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prevState => ({ ...prevState, isVisible: false }));
  };

  return (
    <>
      <Header cartItems={localCartItems} />
      <Navbar />
      {notification.isVisible && (
        <ul className={styles["notification-container"]}>
          <li className={`${styles["notification-item"]} ${styles[notification.type]}`}>
            <div className={styles["notification-content"]}>
              <div className={styles["notification-icon"]}>
                {notification.type === 'success' && (
                  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                  </svg>
                )}
                {notification.type === 'error' && (
                  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 6 12 12M6 18 18 6" />
                  </svg>
                )}
              </div>
              <div className={styles["notification-text"]}>{notification.message}</div>
              <div className={`${styles["notification-icon"]} ${styles["notification-close"]}`} onClick={handleCloseNotification}>
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"></path>
                </svg>
              </div>
            </div>
            <div className={styles["notification-progress-bar"]}></div>
          </li>
        </ul>
      )}
      <div className={styles.container}>
        {loading ? (
          <div className={styles.loader}></div>
        ) : productData ? (
          <>
            <div className={styles.productDetailHeader}>
              <div className={styles.breadcrumbContainer}>
                <div className={styles.breadcrumb}>
                  <Link href="/" className={styles.home}><MdOutlineHome /></Link>
                  <MdNavigateNext />
                  <Link href={`/${toKebabCase(category?.name)}`} className={styles.category}>{category?.name || "Danh mục"}</Link>
                  <MdNavigateNext className={styles.navigate} />
                  <span className={styles.current}>{productData.name || "Sản phẩm"}</span>
                </div>
              </div>
            </div>
            <div className={styles.productImageContainer}>
              <img
                src={productData.image || "/images/image.png"}
                alt={productData.name || "Product Image"}
                className={styles.productImage}
              />
              <div className={styles.productInfoRight}>
                <h3 className={styles.productTitle}>{productData.name || "No name available"}</h3>
                <p className={styles.productPrice}>{formatPrice(productData.price)}</p>
                <button onClick={() => handleAddToCart(productData.id)}>Thêm vào giỏ hàng</button>
              </div>
            </div>
            <div className={styles.productInfo}>
              <div className={styles.productDescription}>
                <h3>Mô tả sản phẩm</h3>
                {renderContent(productData.description || "No description available")}
              </div>
            </div>
          </>
        ) : (
          <p>Không tìm thấy sản phẩm</p>
        )}
      </div>
      <Footer />
    </>
  );
}