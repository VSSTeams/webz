// app/[categorySlug]/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import styles from "@/app/ui/category/category.module.css";
import Link from "next/link";
import axios from "axios";
import Header from "@/app/ui/index/header/header";
import Navbar from "@/app/ui/index/navbar/Navbar";
import { MdOutlineHome, MdNavigateNext } from "react-icons/md";
import Footer from "../ui/index/footer/footer";

export default function CategoryPage({ params }) {
  const categorySlug = React.use(params).categorySlug;
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;
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
    if (!name) return `/news/unknown-product-${id}.html`;
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

  const toKebabCase = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
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

  // Cập nhật fetchData để hỗ trợ phân trang
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoriesResponse = await axios.get(`${apiUrl}/categories`);
        let fetchedCategories = [];
        if (categoriesResponse.data.success) {
          fetchedCategories = categoriesResponse.data.data.data || [];
          setCategories(fetchedCategories);

          const foundCategory = fetchedCategories.find(
            (cat) => toKebabCase(cat.name) === categorySlug
          );
          setCurrentCategory(foundCategory || null);

          if (foundCategory) {
            const productsResponse = await axios.get(`${apiUrl}/products`, {
              params: {
                id_category: foundCategory.id,
                page: currentPage, // Thêm tham số page
              },
            });
            if (productsResponse.data.success) {
              const allProducts = productsResponse.data.data.data || [];
              setProducts(allProducts);
              setTotalPages(productsResponse.data.data.last_page || 1); // Lấy tổng số trang
            } else {
              setProducts([]);
              setTotalPages(1);
            }
          } else {
            setProducts([]);
            setTotalPages(1);
            console.warn(`Category not found for slug: ${categorySlug}`);
          }
        } else {
          setCategories([]);
          setCurrentCategory(null);
          setProducts([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching data for category page:", error.response?.data || error.message);
        setProducts([]);
        setCategories([]);
        setCurrentCategory(null);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [categorySlug, currentPage, apiUrl]); // Thêm currentPage vào dependency

  const categoryName = currentCategory ? currentCategory.name : "Không tìm thấy danh mục";

  useEffect(() => {
    document.title = categoryName + " - Sản phẩm" || "Danh mục sản phẩm";
  }, [categoryName]);

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
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    ></path>
                  </svg>
                )}
                {notification.type === 'error' && (
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
              <div className={styles["notification-text"]}>{notification.message}</div>
              <div className={`${styles["notification-icon"]} ${styles["notification-close"]}`} onClick={handleCloseNotification}>
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
            <div className={styles["notification-progress-bar"]}></div>
          </li>
        </ul>
      )}
      <div className={styles.container}>
        {loading ? (
          <div className={styles.loader}></div>
        ) : currentCategory ? (
          <>
            <h1 className={styles.categoryTitle}>{categoryName}</h1>
            <div className

              ={styles.breadcrumbContainer}>
              <div className={styles.breadcrumb}>
                <Link href="/" className={styles.home}><MdOutlineHome /></Link>
                <MdNavigateNext className={styles.navigate} />
                <Link href={`/${categorySlug}`} className={styles.category}>
                  {categoryName}
                </Link>
              </div>
            </div>

            {products.length > 0 ? (
              <div className={styles.productList}>
                {products.map((product) => (
                  <div key={product.id} className={styles.productItem}>
                    <Link href={productDetailSlug(product.name, product.id)} className={styles.productImageLink}>
                      <img
                        src={product.image || "/images/placeholder.png"}
                        alt={product.name || "Product Image"}
                        className={styles.productImage}
                      />
                    </Link>
                    <div className={styles.productContent}>
                      <Link href={productDetailSlug(product.name, product.id)}>
                        <h2 className={styles.productTitle}>
                          {product.name || "No name available"}
                        </h2>
                      </Link>
                      <p className={styles.productPrice}>
                        {formatPrice(product.price)}
                      </p>
                      <div className={styles.addToCart}>
                        <button onClick={() => handleAddToCart(product.id)}>Thêm vào giỏ hàng</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noProductsMessage}>Chưa có sản phẩm nào trong danh mục này.</p>
            )}
            {/* Thêm phân trang */}
            {totalPages > 1 && renderPagination()}
          </>
        ) : (
          <p className={styles.categoryNotFound}>Danh mục "{categorySlug}" không tồn tại.</p>
        )}
      </div>
      <Footer />
    </>
  );
}