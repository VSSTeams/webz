// app/ui/dashboard/articles/actionArticle/UpdateArticlePage.jsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import styles from "@/app/ui/dashboard/articles/actionArticle/actionArticle.module.css";
import { BiSolidCategory, BiUser } from "react-icons/bi";

export default function UpdateProductPage({ params: paramsPromise }) {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;
  const router = useRouter();
  const params = React.use(paramsPromise); // Unwrap the params Promise
  const { id } = params; // Lấy ID bài viết từ URL
  const [product, setProduct] = useState({
    name: '',
    description: '',
    image: '',
    price: '',
    id_category: null,
  });
  const [categories, setCategories] = useState([]);
  const roleRef = useRef(null);

  // Lấy dữ liệu ban đầu của bài viết, tác giả, danh mục, và mục con khi component mount
  useEffect(() => {
    document.title = "Page Update Article";

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${apiUrl}/products/${id}`);
        if (response.data.success) {
          setProduct(response.data.data);
        }
        const categoriesResponse = await axios.get(`${apiUrl}/categories`);
        if (categoriesResponse.data.success) {
          setCategories(categoriesResponse.data.data.data); // Cập nhật state categories
        }
      } catch (error) {
        console.error("Error fetching subitem:", error);
      }
    };

    fetchProduct();
  }, [id, apiUrl]);

  // Cuộn lên đầu danh sách khi dữ liệu thay đổi
  useEffect(() => {
    if (roleRef.current) {
      setTimeout(() => {
        roleRef.current.scrollTo(0, 0);
      }, 0);
    }
  }, [categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevSubitem) => ({
      ...prevSubitem,
      [name]: value,
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setProduct((prevSubitem) => ({
      ...prevSubitem,
      id_category: categoryId,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.patch(`${apiUrl}/products/${id}`, product);
      if (response.data.success) {
        alert("Product updated successfully!");
        router.push("/dashboard/products"); // Chuyển hướng về trang danh sách người dùng
      } else {
        alert("Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("An error occurred while updating the product.");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name='name'
          placeholder="Name"
          value={product.name}
          onChange={handleChange}
          required
        />

        <div className={styles.imageUpdate}>
          <div className={styles.currentImage}>
            <label>Current Image:</label>
            {product.image ? (
              <img src={product.image} alt="Current article image" />
            ) : (
              <p>No image available</p>
            )}
          </div>
          <input
            className={styles.inputImage}
            type="text"
            placeholder="Enter image URL"
            name='image'
            value={product.image}
            onChange={handleChange}
          />
        </div>

        <input
          type="text"
          name='price'
          placeholder="price"
          value={product.price}
          onChange={handleChange}
          required
        />

        <textarea
          placeholder="Description"
          name='description'
          value={product.description}
          onChange={handleChange}
          required
        />

        <div className={styles.role} ref={roleRef}>
          {categories.map((category) => (
            <label
              key={category.id}
              className={`${styles.categoryLabel} ${product.id_category === category.id ? styles.selected : ''}`}

              onClick={() => handleCategoryChange(category.id)}
            >
              <div className={styles.categoryContent}>
                <BiSolidCategory />
                <p>{category.name}</p>
              </div>
              <input
                type="radio"
                name="id_category"
                value={category.id}
                checked={product.id_category === category.id}
                onChange={() => handleCategoryChange(category.id)}
                className="opacity-0 absolute pointer-events-none"
              />
            </label>
          ))}
        </div>
        <button type="submit">Update Article</button>
      </form>
    </div>
  );
}