// app/search/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import styles from "@/app/ui/search/search.module.css";
import axios from "axios";
import Link from "next/link";
import Header from "../ui/index/header/header";
import Navbar from "../ui/index/navbar/Navbar";
import { MdOutlineHome, MdNavigateNext } from "react-icons/md";
import { useSearchParams } from "next/navigation";
import Footer from "../ui/index/footer/footer";

export default function SearchPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;
  const [userId, setUserId] = useState(null);
  const [localCartItems, setLocalCartItems] = useState([]);
  const [notification, setNotification] = useState({
    message: '',
    type: '',
    isVisible: false,
  });
  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleCartUpdate = (updatedCart) => {
    setLocalCartItems(updatedCart);
  };

  useEffect(() => {
    const storedId = localStorage.getItem("sessionId");
    if (storedId) {
      setUserId(storedId);
      fetchCartItems(storedId);
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

  const productDetailSlug = (name, id) => {
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
    if (price === null || price === undefined) return "Liên hệ";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddToCart = async (productId) => {
    if (!userId) {
      console.error("User ID not available.");
      return;
    }

    const productToAdd = products.find(p => p.id === productId);
    if (!productToAdd) {
      console.error("Product not found.");
      return;
    }

    let updatedCartItems = [...localCartItems];
    const existingItemIndex = localCartItems.findIndex(item => item.product?.id === productId);
    if (existingItemIndex > -1) {
      updatedCartItems[existingItemIndex] = {
        ...updatedCartItems[existingItemIndex],
        quantity: (updatedCartItems[existingItemIndex].quantity || 0) + 1,
      };
    } else {
      updatedCartItems = [...updatedCartItems, { product: productToAdd, quantity: 1 }];
    }
    setLocalCartItems(updatedCartItems);

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

  // Cập nhật fetchData để hỗ trợ phân trang
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Lấy danh sách categories (dùng để hiển thị tên danh mục nếu cần)
      const categoriesResponse = await axios.get(`${apiUrl}/categories`);
      if (categoriesResponse.data.success) {
        setCategories(categoriesResponse.data.data.data || []);
      }

      // Lấy danh sách products với phân trang và từ khóa tìm kiếm
      const productsResponse = await axios.get(`${apiUrl}/products`, {
        params: {
          q: query,
          page: currentPage, // Thêm tham số page
        },
      });

      if (productsResponse.data.success) {
        const productsData = productsResponse.data.data.data || [];
        setProducts(productsData);
        setTotalPages(productsResponse.data.data.last_page || 1); // Lấy tổng số trang
      } else {
        setError("Failed to fetch products");
        setProducts([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching data:", error.response?.data || error.message);
      setError("An error occurred while fetching data");
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      fetchData();
    } else {
      setLoading(false);
      setError("Please enter a search keyword");
    }
  }, [query, currentPage]); // Thêm currentPage vào dependency

  useEffect(() => {
    document.title = `Kết quả tìm kiếm cho: "${query}"`;
  }, [query]);

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
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <>
            <h1 className={styles.categoryTitle}>
              Kết quả tìm kiếm cho: "{query}"
            </h1>
            <div className={styles.articleContentHeader}>
              <div className={styles.breadcrumb}>
                <Link href="/" className={styles.home}>
                  <MdOutlineHome />
                </Link>
                <MdNavigateNext className={styles.navigate} />
                <span className={styles.category}>Tìm kiếm</span>
              </div>
            </div>
            {products.length > 0 ? (
              <div className={styles.productList}>
                {products.map((product) => (
                  <div key={product.id} className={styles.productItem}>
                    <div className={styles.image}>
                      <Link href={productDetailSlug(product.name, product.id)}>
                        <img
                          src={product.image || "/images/placeholder.png"}
                          alt={product.name}
                          className={styles.articleImage}
                        />
                      </Link>
                    </div>
                    <div className={styles.text}>
                      <h5 className={styles.title}>
                        <Link href={productDetailSlug(product.name, product.id)}>
                          {product.name || "No name available"}
                        </Link>
                      </h5>
                      <div className={styles.price}>
                        {formatPrice(product.price)}
                      </div>
                      <div className={styles.addToCart}>
                        <button onClick={() => handleAddToCart(product.id)}>Thêm vào giỏ hàng</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.error}>
                Không tìm thấy sản phẩm nào phù hợp với từ khóa "{query}"
              </p>
            )}
            {/* Thêm phân trang */}
            {totalPages > 1 && renderPagination()}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}