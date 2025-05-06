"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "@/app/ui/dashboard/articles/actionArticle/actionArticle.module.css";
import { BiSolidCategory, BiUser } from "react-icons/bi";

export default function CreateProductPage() {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;
  const router = useRouter();
  const [name, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setContent] = useState("");
  const [image, setImage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const roleRef = useRef(null);

  useEffect(() => {
    document.title = "Page Create Product";

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/categories`);
        if (response.data.success) {
          setCategories(response.data.data.data); // Lưu danh sách categories vào state
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [apiUrl]);

  useEffect(() => {
    if (roleRef.current) {
      setTimeout(() => {
        roleRef.current.scrollTo(0, 0);
      }, 0);
    }
  }, [categories]);

  const handleImageChange = (e) => {
    setImage(e.target.value); // Lưu URL dưới dạng chuỗi
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Dữ liệu bài viết
      const articleData = {
        name,
        price,
        description,
        image: image || null,
        id_category: selectedCategory, // Sử dụng trực tiếp URL, hoặc null nếu không có
      };

      console.log("Sending article data to backend:", articleData);
      const response = await axios.post(`${apiUrl}/products`, articleData);

      if (response.data.success) {
        alert("Article Created Successfully!");
        router.push("/dashboard/products");
      } else {
        alert("Failed To Create Article.");
      }
    } catch (error) {
      console.error("Error creating article:", error);
      if (error.response) {
        alert(`Server error: ${error.response.status} - ${error.response.data.message || error.message}`);
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          className={styles.inputImage}
          type="url"
          placeholder="Image URL (e.g., https://example.com/image.jpg)"
          value={image}
          onChange={handleImageChange}
        />

        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <textarea
          placeholder="Content"
          value={description}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <div className={styles.role} ref={roleRef}> {/* Thêm ref để tham chiếu */}
          {categories.map((category) => (
            <label
              key={category.id}
              className={`${styles.categoryLabel} ${selectedCategory === category.id ? styles.selected : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className={styles.categoryContent}>
                <BiSolidCategory />
                <p>{category.name}</p>
              </div>
              <input
                type="radio"
                name="id_category"
                value={category.id}
                checked={selectedCategory === category.id}
                onChange={() => setSelectedCategory(category.id)}
                className="opacity-0 absolute pointer-events-none"
              />
            </label>
          ))}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}