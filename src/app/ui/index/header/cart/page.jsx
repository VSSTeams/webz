import React, { useState, useEffect, useCallback } from 'react';
import { IoMdCart } from "react-icons/io";
import styles from "./cart.module.css";
import axios from 'axios';
import Link from 'next/link';

export default function Cart({ cartItems: propCartItems, fetchCartItems: propFetchCartItems }) {
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;
  const userId = typeof window !== 'undefined' ? localStorage.getItem("sessionId") : null;
  const [cartDetails, setCartDetails] = useState(propCartItems || []);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setCartDetails(propCartItems || []);
  }, [propCartItems]);

  useEffect(() => {
    calculateCartSummary(cartDetails);
  }, [cartDetails]);

  const calculateCartSummary = useCallback((details) => {
    let quantity = 0;
    let price = 0;
    details.forEach(item => {
      quantity += item.quantity;
      price += item.product?.price * item.quantity;
    });
    setTotalQuantity(quantity);
    setTotalPrice(price);
  }, []);

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
    if (price === null || price === undefined) return "N/A";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const toggleCartDropdown = () => {
    setShowCartDropdown(!showCartDropdown);
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
        cart_id: cartId, // Include cart_id
        product_id: productId, // Include product_id
      });
      if (response.data.success) {
        console.log("Cart item quantity updated.");
        if (propFetchCartItems) {
          propFetchCartItems(userId); // Re-fetch cart items in Header
        }
        // Update local state
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
        if (propFetchCartItems) {
          propFetchCartItems(userId); // Re-fetch cart items in Header
        }
        // Update local state
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

  const incrementQuantity = (item) => {
    updateCartItemQuantity(item.id, item.quantity + 1, item.cart_id, item.product_id); // Pass cart_id and product_id
  };

  const decrementQuantity = (item) => {
    updateCartItemQuantity(item.id, item.quantity - 1, item.cart_id, item.product_id); // Pass cart_id and product_id
  };

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cart} onClick={toggleCartDropdown}>
        <IoMdCart />
        {totalQuantity > 0 && <span className={styles.cartQuantity}>{totalQuantity}</span>}
      </div>
      {showCartDropdown && (
        <div className={styles.cartDropdown}>
          <div className={styles.cartDropdownHeader}> {/* Phần cố định trên */}
            Total Price: <span className={styles.cartTotal}>{formatPrice(totalPrice)}</span>
          </div>
          <div className={styles.cartItemsScroll}> {/* Phần cuộn */}
            {cartDetails.length > 0 ? (
              cartDetails.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <Link href={productDetailSlug(item.product?.name, item.product?.id)}>
                    <img src={item.product?.image} alt={item.product?.name} className={styles.cartItemImage} />
                  </Link>
                  <div className={styles.cartItemDetails}>
                    <Link href={productDetailSlug(item.product?.name, item.product?.id)}>
                      <span className={styles.cartItemName}>{item.product?.name}</span>
                    </Link>
                    <div className={styles.cartItemDescription}>
                      <span className={styles.cartItemPrice}>{formatPrice(item.product?.price)}</span>
                      <div className={styles.cartQuantityControls}>
                        <button onClick={() => decrementQuantity(item)}>-</button>
                        <span className={styles.cartItemQuantity}>x{item.quantity}</span>
                        <button onClick={() => incrementQuantity(item)}>+</button>
                      </div>
                    </div>
                    <span className={styles.cartItemTotal}>Total: {formatPrice(item.product?.price * item.quantity)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>Giỏ hàng trống.</p>
            )}
          </div>
          {cartDetails.length > 0 && (
            <div className={styles.cartDropdownFooter}> {/* Phần cố định dưới */}
              <Link href="/cart">
                <button className={styles.viewCartButton} onClick={toggleCartDropdown}>Xem giỏ hàng</button>
              </Link>
              {/* Thêm nút thanh toán nếu cần */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}