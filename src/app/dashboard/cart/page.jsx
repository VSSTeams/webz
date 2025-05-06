"use client";

import React, { useState, useEffect } from "react";
import styles from "@/app/ui/dashboard/articles/articles.module.css";
import Search from "@/app/ui/dashboard/search/search";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasData, setHasData] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;

  useEffect(() => {
    document.title = "Danh sách Đơn hàng";
    fetchOrders();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [searchQuery, currentPage]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/orders`, {
        params: { q: searchQuery, page: currentPage },
      });

      if (response.data.success) {
        const ordersData = response.data.data.data || [];
        setOrders(ordersData);
        setTotalPages(response.data.data.last_page || 1);
        setHasData(ordersData.length > 0);
      } else {
        setOrders([]);
        setHasData(false);
      }
    } catch (error) {
      console.error("Lỗi lấy đơn hàng:", error.response?.data || error.message);
      setOrders([]);
      setHasData(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/categories`);
      if (response.data.success) {
        setCategories(response.data.data.data || []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error.response?.data || error.message);
      setCategories([]);
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "N/A";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

  const truncateContent = (content) => {
    if (!content) return "Không có mô tả";
    const maxLength = 100;
    if (content.length <= maxLength) return content;
    const truncated = content.substring(0, content.lastIndexOf(" ", maxLength));
    return truncated + "...";
  };

  const findCategoryNameById = (id) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : "Không xác định";
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.paginationButton} ${currentPage === i ? styles.active : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return <div className={styles.pagination}>{pages}</div>;
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search
          placeholder="Tìm kiếm đơn hàng"
          onSearch={(query) => {
            setSearchQuery(query);
            setCurrentPage(1);
          }}
        />
      </div>

      {loading ? (
        <div className={styles.loader}></div>
      ) : !hasData ? (
        <div className={styles.noResults}>
          <p>Không có đơn hàng</p>
        </div>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <td>#</td>
                <td>Hình ảnh</td>
                <td>Tên sản phẩm</td>
                <td>Giá</td>
                <td>Mô tả</td>
                <td>Danh mục</td>
                <td>Ngày tạo</td>
                <td>Hành động</td>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr>
                    <td colSpan="8" className={styles.orderRow}>
                      <strong>Đơn hàng #{order.id}</strong> - Khách: {order.customer_name || "Ẩn danh"} - Ngày đặt: {formatDate(order.created_at)}
                    </td>
                  </tr>
                  {order.products?.length > 0 ? (
                    order.products.map((product, idx) => (
                      <tr key={product.id}>
                        <td>{idx + 1}</td>
                        <td className={styles.tdImage}>
                          {product.image ? (
                            <img src={product.image} alt={product.name} className={styles.articleImage} />
                          ) : (
                            "Không có hình"
                          )}
                        </td>
                        <td>{product.name}</td>
                        <td>{formatPrice(product.price)}</td>
                        <td title={product.description}>{truncateContent(product.description)}</td>
                        <td>{findCategoryNameById(product.id_category)}</td>
                        <td>{formatDate(product.created_at)}</td>
                        <td>
                          <div className={styles.buttons}>
                            {/* Nút Edit hoặc Delete nếu cần */}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center" }}>
                        (Không có sản phẩm trong đơn)
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && renderPagination()}
        </>
      )}
    </div>
  );
}
