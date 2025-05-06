"use client";
import React from 'react'
import styles from '@/app/ui/dashboard/categories/categories.module.css'
import Search from '@/app/ui/dashboard/search/search'
import { AiFillEdit } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import Link from 'next/link'
import { useEffect, useState } from "react";
import axios from "axios";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;

  // Hàm fetchArticles để lấy dữ liệu bài viết từ API
  const fetchCategories = async (query = "") => {
    setLoading(true);
    try {
      const categoriesResponse = await axios.get(`${apiUrl}/categories`, {
        params: { q: query }, // Thêm query vào params
      });

      // Cập nhật state với dữ liệu từ API
      if (categoriesResponse.data.success) {
        setCategories(categoriesResponse.data.data.data); // Sửa lại từ articlesResponse thành categoriesResponse
      }

      await new Promise((resolve) => setTimeout(resolve, 500)); // Giả lập loading
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  // Gọi API khi component được mount hoặc searchQuery thay đổi
  useEffect(() => {
    document.title = "Page Categories";
    fetchCategories(searchQuery);
  }, [searchQuery]);

  // Hàm xử lý tìm kiếm
  const handleSearch = (query) => {
    setSearchQuery(query); // Cập nhật giá trị tìm kiếm
  };
  const handleDelete = async (categoryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category? This will also delete all related subitems and articles."
    );
    if (!confirmDelete) return;

    try {
      // Bước 1: Lấy tất cả subitems có id_category = categoryId
      const productsResponse = await axios.get(`${apiUrl}/products`, {
        params: { id_category: categoryId },
      });
      const productsToDelete = productsResponse.data.success ? productsResponse.data.data.data : [];

      // Bước 2: Xóa tất cả bài viết và subitem liên quan
      for (const subitem of productsToDelete) {
        // Xóa subitem
        await axios.delete(`${apiUrl}/products/${subitem.id}`);
        console.log(`Deleted subitem with ID: ${subitem.id}`);
      }

      // Bước 3: Xóa category
      const response = await axios.delete(`${apiUrl}/categories/${categoryId}`);
      if (response.data.success) {
        // Cập nhật lại danh sách categories sau khi xóa
        setCategories(categories.filter((category) => category.id !== categoryId));
        alert("Category and all related subitems and articles deleted successfully!");
      } else {
        alert("Failed to delete category.");
      }

      // Cập nhật lại danh sách categories sau khi xóa
      fetchCategories(searchQuery);
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("An error occurred while deleting the category.");
    }
  };

  const handleNavigation = () => {
    setIsPageTransitioning(true); // Bật loading
    setTimeout(() => {
    }, 500); // Thời gian loading (có thể điều chỉnh)
  };

  return (
    <div className={styles.container}>
      {isPageTransitioning && (
        <div className={styles.pageTransitionLoader}>
          <div className={styles.loader}></div>
        </div>
      )}
      <div className={styles.top}>
        {/* <Search placeholder="Search for categories" onSearch={handleSearch} /> */}
        <Link href="/dashboard/categories/createCategory" className={styles.link}  onClick={() => handleNavigation()}>
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      {loading ? (
        <div className={styles.loader}></div>
      ) : categories.length === 0 ? (
        <div className={styles.noResults}>
          <p>No categories found.</p>
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <td>#</td>
              <td>Category</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.id}>
                <td>{index + 1}</td>
                <td>
                  <div className={styles.user}>{category.name}</div>
                </td>
                <td>
                  <div className={styles.buttons}>
                    <Link href={`/dashboard/categories/updateCategory/${category.id}`} className={styles.link}  onClick={() => handleNavigation()}>
                      <button className={`${styles.edit} ${styles.button}`}>
                        <AiFillEdit />
                      </button>
                    </Link>
                    <button
                      className={`${styles.delete} ${styles.button}`}
                      onClick={() => handleDelete(category.id)}
                    >
                      <MdDeleteForever />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
