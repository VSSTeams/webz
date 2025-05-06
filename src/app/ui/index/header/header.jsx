"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import styles from "./header.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Thêm useRouter để điều hướng
import { FaSearch, FaUser, FaBell, FaBars, FaTimes } from "react-icons/fa";
import axios from "axios";
import Cart from "./cart/page";

export default function Header({ cartItems: propCartItems }) {
  const [userName, setUserName] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);   // --- Thay articles bằng products state
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;
  const router = useRouter(); // Sử dụng useRouter để điều hướng
  const [cartItems, setCartItems] = useState([]);
  const [localCartItems, setLocalCartItems] = useState(propCartItems || []);

  useEffect(() => {
    setLocalCartItems(propCartItems || []);
  }, [propCartItems]);

  const toKebabCase = (str) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setUserName(storedName);
    }
    const storedId = localStorage.getItem("sessionId");
    if (storedId) {
      fetchCartItems(storedId);
    }
  }, []);

  const fetchCartItems = useCallback(async (userId) => {
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
          setCartItems(productDetails);
        } else {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart items in header:", error);
      setCartItems([]);
    }
  }, [apiUrl]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await axios.get(`${apiUrl}/categories`);
        if (categoriesResponse.data.success) {
          setCategories(categoriesResponse.data.data.data || []); // Thêm fallback []
        } else {
          setCategories([]); // Đảm bảo reset nếu API không success
        }
        // --- Fetch products thay vì articles ---
        const productsResponse = await axios.get(`${apiUrl}/products`);
        if (productsResponse.data.success) {
          setProducts(productsResponse.data.data.data || []); // Thêm fallback []
        } else {
          setProducts([]); // Đảm bảo reset nếu API không success
        }

      } catch (error) {
        console.error("Error fetching header data:", error);
        setCategories([]); // Reset state khi có lỗi
        setProducts([]);   // Reset state khi có lỗi
      }
    };

    fetchData();
  }, [apiUrl]);

  const handleAddToCartHeader = useCallback(async (productId) => {
    const userId = localStorage.getItem("sessionId");
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
        const newCartResponse = await axios.post(`${apiUrl}/carts`, {
          user_id: userId,
        });
        if (newCartResponse.data.success) {
          cartId = newCartResponse.data.data.id;
        } else {
          console.error("Failed to create cart:", newCartResponse.data.message);
          return;
        }
      }
      const existingCartDetailResponse = await axios.get(`${apiUrl}/carts_detail?cart_id=${cartId}&product_id=${productId}`);
      if (existingCartDetailResponse.data.success && existingCartDetailResponse.data.data.length > 0) {
        const existingCartDetail = existingCartDetailResponse.data.data[0];
        const updatedQuantity = existingCartDetail.quantity + 1;
        const updateCartDetailResponse = await axios.put(`${apiUrl}/carts_detail/${existingCartDetail.id}`, {
          cart_id: existingCartDetail.cart_id, // Thêm cart_id
          product_id: existingCartDetail.product_id,
          quantity: updatedQuantity,
        });
        if (updateCartDetailResponse.data.success) {
          console.log("Product quantity updated successfully in header.");
          fetchCartItems(userId); // Re-fetch cart items to update UI
        } else {
          console.error("Failed to update product quantity in header:", updateCartDetailResponse.data.message);
        }
      } else {
        const cartDetailResponse = await axios.post(`${apiUrl}/carts_detail`, {
          cart_id: cartId,
          product_id: productId,
          quantity: 1
        });

        if (cartDetailResponse.data.success) {
          console.log("Product added to cart successfully in header.");
          fetchCartItems(userId); // Re-fetch cart items to update UI
        } else {
          console.error("Failed to add product to cart detail in header:", cartDetailResponse.data.message);
        }
      }
    } catch (error) {
      console.error("Error adding to cart in header:", error.response?.data || error.message);
    }
  }, [apiUrl, fetchCartItems]);

  const hasProducts = (categoryId) => {
    // Kiểm tra xem mảng products có tồn tại và có phần tử không
    if (!products || products.length === 0) {
      return false;
    }
    // Kiểm tra xem có sản phẩm nào thuộc categoryId này không
    return products.some((product) => product.id_category === categoryId);
  };

  // useEffect xử lý click outside dropdown không đổi
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Các hàm xử lý UI và logic khác không đổi (currentDate, getInitial, toggles, handleLogout, handleSearch, handleKeyDown)
  const currentDate = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "numeric",
    year: "numeric",
  });

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  const toggleDropdown = (event) => {
    // Ngăn sự kiện click lan ra document listener ngay lập tức
    event.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery(""); // Clear search query when opening mobile search
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("token"); // Cũng nên xóa token nếu có
    localStorage.removeItem("sessionId");
    setUserName(null);
    setIsDropdownOpen(false);
    setCartItems([]); // Clear cart items on logout
    // Có thể chuyển hướng về trang chủ hoặc login
    router.push('/'); // Ví dụ chuyển về trang chủ
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false); // Đóng thanh tìm kiếm mobile
      setIsMenuOpen(false); // Đóng menu mobile nếu đang mở
      setSearchQuery(""); // Xóa input sau khi tìm kiếm
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Logic chia categories thành cặp không đổi
  const pairedCategories = [];
  for (let i = 0; i < categories.length; i += 2) {
    pairedCategories.push(categories.slice(i, i + 2));
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <div className={styles.hamburger} onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
          <div className={styles.logo}>
            <Link href="/">
              <img src="/logo.jpg" alt="Logo" />
            </Link>
          </div>
          <div className={styles.info}>
            <span>{currentDate}</span>
          </div>
        </div>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <FaSearch className={styles.searchIcon} onClick={handleSearch} />
        </div>
        <div className={styles.rightSection}>
          <div className={styles.searchIconMobile}>
            <FaSearch onClick={toggleSearch} className={styles.icon} />
            {isSearchOpen && (
              <div className={styles.searchBarMobile}>
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className={styles.searchInputMobile}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
                <FaSearch
                  className={styles.searchIconMobileInner}
                  onClick={handleSearch}
                />
                <FaTimes className={styles.closeSearchMobile} onClick={toggleSearch} /> {/* Nút đóng search mobile */}
              </div>
            )}
          </div>
          <div className={styles.userContainer}>
            {userName ? (
              <div className={styles.userWrapper} ref={dropdownRef}>
                <span
                  className={styles.userInitial}
                  onClick={toggleDropdown}
                  style={{ cursor: "pointer" }}
                >
                  {getInitial(userName)}
                </span>
                {isDropdownOpen && (
                  <ul className={`${styles.dropdown} ${styles.open}`}>
                    <li>
                      <Link
                        href="/orders"
                        className={styles.dropdownItem}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Orders
                      </Link>
                    </li>
                    <li>
                      <button className={styles.dropdownItem} onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <Link href="/login" className={styles.icon}>
                <FaUser />
              </Link>
            )}
          </div>
          <Cart cartItems={localCartItems} fetchCartItems={fetchCartItems} /> {/* Pass cartItems and fetch function */}
        </div>
      </div>
      <div className={`${styles.sidebar} ${isMenuOpen ? styles.open : ""}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/" onClick={toggleMenu}>
            <img src="/logo.jpg" alt="" className={styles.sidebarLogo} />
          </Link>
          <FaTimes className={styles.closeIcon} onClick={toggleMenu} />
        </div>
        <ul className={styles.sidebarList}>
          <li className={styles.sidebarRow}>
            <div className={styles.sidebarColumnFull}>
              <Link href="/all-products" className={styles.sidebarLink} onClick={toggleMenu}>
                Tất cả sản phẩm
              </Link>
            </div>
          </li>
          {pairedCategories.map((pair, index) => (
            <li key={`pair-${index}`} className={styles.sidebarRow}>
              {pair.map((category) => {
                if (!hasProducts(category.id)) {
                  return <div key={category.id} className={styles.sidebarColumn}></div>;
                }
                const categorySlug = toKebabCase(category.name);
                return (
                  <div key={category.id} className={styles.sidebarColumn}>
                    <Link
                      href={`/${categorySlug}-${category.id}`}
                      className={styles.sidebarLink}
                      onClick={toggleMenu}
                    >
                      {category.name || "Unnamed Category"}
                    </Link>
                  </div>
                );
              })}
              {pair.length === 1 && <div className={styles.sidebarColumn}></div>}
            </li>
          ))}
        </ul>
        <div className={styles.sidebarFooter}>
          {userName ? (
            <button className={styles.sidebarAuthButton} onClick={() => { handleLogout(); toggleMenu(); }}>
              Đăng xuất ({userName})
            </button>
          ) : (
            <Link href="/login" className={styles.sidebarAuthButton} onClick={toggleMenu}>
              <FaUser /> Đăng nhập
            </Link>
          )}
        </div>
      </div>
      {isMenuOpen && <div className={styles.overlay} onClick={toggleMenu}></div>}
    </header>
  );
}