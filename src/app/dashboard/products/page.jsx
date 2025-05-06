"use client";

import React, { useEffect, useState } from "react";
import styles from "@/app/ui/dashboard/articles/articles.module.css";
import Search from "@/app/ui/dashboard/search/search";
import { AiFillEdit } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

export default function ProductsPage() {
  // Khai báo state
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Từ khóa tìm kiếm
  const [hasData, setHasData] = useState(true);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredArticles, setFilteredArticles] = useState([]); // Trạng thái lọc sản phẩm

  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;

  // Hàm lấy dữ liệu sản phẩm và danh mục từ API
  const fetchArticles = async (query = "", page = 1) => {
    setLoading(true);
    try {
      const articlesResponse = await axios.get(`${apiUrl}/products`, { params: { q: query, page } });
      const categoriesResponse = await axios.get(`${apiUrl}/categories`);

      if (articlesResponse.data.success) {
        const articlesData = articlesResponse.data.data.data || [];
        setArticles(articlesData);
        setTotalPages(articlesResponse.data.data.last_page || 1);
        setHasData(articlesData.length > 0);
      } else {
        setArticles([]);
        setTotalPages(1);
        setHasData(false);
      }

      if (categoriesResponse.data.success) {
        setCategories(categoriesResponse.data.data.data || []);
      } else {
        setCategories([]);
      }

      // Delay nhỏ để mượt hơn
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error.response?.data || error.message);
      setArticles([]);
      setTotalPages(1);
      setHasData(false);
    } finally {
      setLoading(false);
    }
  };

  // Khi component load lần đầu hoặc search / chuyển trang
  useEffect(() => {
    document.title = "Page Articles";
    fetchArticles(searchQuery, currentPage);
  }, [searchQuery, currentPage]);

  // Hàm tìm tên danh mục theo id_category
  const findCategoryNameById = (id) => {
    const category = categories.find((item) => item.id === id);
    return category ? category.name : "Không xác định";
  };

  // Hàm xóa sản phẩm
  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        const response = await axios.delete(`${apiUrl}/products/${id}`);
        if (response.data.success) {
          alert("Xóa sản phẩm thành công!");
          fetchArticles(searchQuery, currentPage); // Refresh lại danh sách
        } else {
          alert("Xóa sản phẩm thất bại.");
        }
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        alert("Đã xảy ra lỗi khi xóa sản phẩm.");
      }
    }
  };

  // Hàm định dạng giá tiền (VNĐ)
  const formatPrice = (price) => {
    if (price === null || price === undefined) return "N/A";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Hàm rút gọn nội dung mô tả
  const truncateContent = (content) => {
    if (!content) return "Không có mô tả";
    const maxLength = 100;
    if (content.length <= maxLength) return content;

    let truncated = content.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(" ");
    if (lastSpaceIndex > -1) truncated = truncated.substring(0, lastSpaceIndex);

    return truncated + "...";
  };

  // Hàm định dạng ngày giờ
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

  // Điều hướng (dùng cho hiệu ứng loading nhẹ khi chuyển trang)
  const handleNavigation = () => {
    setIsPageTransitioning(true);
    setTimeout(() => { }, 500);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Hiển thị phân trang
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

  // Hàm lọc sản phẩm khi bấm nút "Lọc"
  const handleFilter = () => {
    const filtered = articles.filter((article) =>
      article.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredArticles(filtered);
    setCurrentPage(1); // Reset về trang 1 khi lọc
  };

  return (
    <div className={styles.container}>
      {isPageTransitioning && (
        <div className={styles.pageTransitionLoader}>
          <div className={styles.loader}></div>
        </div>
      )}

      {/* thêm mới */}
      <div className={styles.top}>
        <Search
          placeholder="nhap san pham can loc"
          onSearch={(query) => {
            setSearchQuery(query);
            setCurrentPage(1); // Quay lại trang 1 khi tìm kiếm
          }}
        />

        <button className={styles.addButton} onClick={handleFilter}>
          Lọc
        </button>

        <Link href="/dashboard/products/createProduct" className={styles.link} onClick={handleNavigation}>
          <button className={styles.addButton}>Thêm mới</button>
        </Link>
      </div>

      {/* Phần loader hoặc không có dữ liệu */}
      {loading ? (
        <div className={styles.loader}></div>
      ) : !hasData ? (
        <div className={styles.noResults}>
          <p>Không có dữ liệu</p>
        </div>
      ) : (
        <>
          {/* Bảng hiển thị sản phẩm */}
          <table className={styles.table}>
            <thead>
              <tr>
                <td>#</td>
                <td>Hình ảnh</td>
                <td>Tên</td>
                <td>Giá</td>
                <td>Mô tả</td>
                <td>Danh mục</td>
                <td>Ngày tạo</td>
                <td>Hành động</td>
              </tr>
            </thead>
            <tbody>
              {(filteredArticles.length > 0 ? filteredArticles : articles).map((article, index) => (
                <tr key={article.id}>
                  <td>{(currentPage - 1) * 8 + index + 1}</td>
                  <td className={styles.tdImage}>
                    {article.image ? (
                      <img src={article.image} alt={article.name} className={styles.articleImage} />
                    ) : (
                      "Không có hình"
                    )}
                  </td>
                  <td>
                    <div className={styles.user}>{article.name}</div>
                  </td>
                  <td>{formatPrice(article.price)}</td>
                  <td title={article.description}>{truncateContent(article.description)}</td>
                  <td>{findCategoryNameById(article.id_category)}</td>
                  <td>{formatDate(article.created_at)}</td>
                  <td>
                    <div className={styles.buttons}>
                      {/* Nút chỉnh sửa */}
                      <Link
                        href={`/dashboard/products/updateProduct/${article.id}`}
                        className={styles.link}
                        onClick={() => handleNavigation()}
                      >
                        <button className={`${styles.edit} ${styles.button}`}>
                          <AiFillEdit />
                        </button>
                      </Link>

                      {/* Nút xóa */}
                      <button
                        className={`${styles.delete} ${styles.button}`}
                        onClick={() => handleDelete(article.id)}
                        title="Xóa sản phẩm"
                      >
                        <MdDeleteForever />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phân trang nếu có nhiều trang */}
          {totalPages > 1 && renderPagination()}
        </>
      )}
    </div>
  );
}
