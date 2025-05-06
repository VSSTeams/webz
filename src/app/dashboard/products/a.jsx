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
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasData, setHasData] = useState(true);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    category: "",
    stockStatus: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "",
    sortOrder: "",
    createdFrom: "",
    createdTo: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;

  const fetchArticles = async (query = "", page = 1) => {
    setLoading(true);
    try {
      const params = {
        q: query,
        page,
        ...filters,
      };

      const [articlesResponse, categoriesResponse] = await Promise.all([
        axios.get(`${apiUrl}/products`, { params }),
        axios.get(`${apiUrl}/categories`),
      ]);

      if (articlesResponse.data.success) {
        const articlesData = articlesResponse.data.data.data || [];
        setArticles(articlesData);
        setTotalPages(articlesResponse.data.data.last_page || 1);
        setHasData(articlesData.length > 0);
      } else {
        setArticles([]);
        setHasData(false);
      }

      if (categoriesResponse.data.success) {
        setCategories(categoriesResponse.data.data.data || []);
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
      setArticles([]);
      setHasData(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Page Articles";
    fetchArticles(searchQuery, currentPage);
  }, [searchQuery, currentPage]);

  const findCategoryNameById = (id) => {
    const category = categories.find((item) => item.id === id);
    return category ? category.name : "Không xác định";
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        const response = await axios.delete(`${apiUrl}/products/${id}`);
        if (response.data.success) {
          alert("Xóa sản phẩm thành công!");
          fetchArticles(searchQuery, currentPage);
        } else {
          alert("Xóa sản phẩm thất bại.");
        }
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        alert("Đã xảy ra lỗi khi xóa sản phẩm.");
      }
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "N/A";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  const truncateContent = (content) => {
    if (!content) return "Không có mô tả";
    const maxLength = 100;
    if (content.length <= maxLength) return content;
    let truncated = content.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(" ");
    if (lastSpaceIndex > -1) truncated = truncated.substring(0, lastSpaceIndex);
    return truncated + "...";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

  const handleNavigation = () => {
    setIsPageTransitioning(true);
    setTimeout(() => {}, 500);
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
      {isPageTransitioning && (
        <div className={styles.pageTransitionLoader}>
          <div className={styles.loader}></div>
        </div>
      )}

      {/* Tìm kiếm và thêm mới */}
      <div className={styles.top}>
        <Search
          placeholder="Tìm kiếm sản phẩm"
          onSearch={(query) => {
            setSearchQuery(query);
            setCurrentPage(1);
          }}
        />
        <Link href="/dashboard/products/createProduct" className={styles.link} onClick={handleNavigation}>
          <button className={styles.addButton}>Thêm mới</button>
        </Link>
      </div>

      {/* Bộ lọc nâng cao */}
      <div className={styles.filters}>
        <select onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value })}>
          <option value="">Tất cả trạng thái</option>
          <option value="in_stock">Còn hàng</option>
          <option value="out_of_stock">Hết hàng</option>
        </select>

        <input
          type="number"
          placeholder="Giá từ"
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        />
        <input
          type="number"
          placeholder="Giá đến"
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />

        <input
          type="date"
          onChange={(e) => setFilters({ ...filters, createdFrom: e.target.value })}
        />
        <input
          type="date"
          onChange={(e) => setFilters({ ...filters, createdTo: e.target.value })}
        />

        <select onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}>
          <option value="">Sắp xếp theo</option>
          <option value="name">Tên</option>
          <option value="price">Giá</option>
          <option value="created_at">Ngày tạo</option>
        </select>

        <select onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}>
          <option value="asc">Tăng dần</option>
          <option value="desc">Giảm dần</option>
        </select>

        <button onClick={() => fetchArticles(searchQuery, 1)}>Áp dụng lọc</button>
      </div>

      {/* Loader hoặc không có dữ liệu */}
      {loading ? (
        <div className={styles.loader}></div>
      ) : !hasData ? (
        <div className={styles.noResults}>
          <p>Không có dữ liệu</p>
        </div>
      ) : (
        <>
          {/* Bảng sản phẩm */}
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
              {articles.map((article, index) => (
                <tr key={article.id}>
                  <td>{(currentPage - 1) * 8 + index + 1}</td>
                  <td className={styles.tdImage}>
                    {article.image ? (
                      <img src={article.image} alt={article.title} className={styles.articleImage} />
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
                      <Link
                        href={`/dashboard/products/updateProduct/${article.id}`}
                        className={styles.link}
                        onClick={handleNavigation}
                      >
                        <button className={`${styles.edit} ${styles.button}`}>
                          <AiFillEdit />
                        </button>
                      </Link>
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

          {/* Phân trang */}
          {totalPages > 1 && renderPagination()}
        </>
      )}
    </div>
  );
}
