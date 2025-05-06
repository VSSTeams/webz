"use client";
import React from 'react'
import styles from '@/app/ui/dashboard/users/users.module.css'
import Search from '@/app/ui/dashboard/search/search'
import { AiFillEdit } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import Link from 'next/link'
import { useEffect, useState } from "react";
import axios from "axios";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;

  const fetchUsers = async (query = "") => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/users`, {
        params: { q: query }, // Thêm query vào params
      });
      const data = response.data;

      if (data.success) {
        setUsers(data.data.data); // Lưu trữ danh sách người dùng vào state
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  // Gọi API khi component được mount hoặc searchQuery thay đổi
  useEffect(() => {
    document.title = "Page Users";
    fetchUsers(searchQuery);
  }, [searchQuery]);

  // Hàm xử lý tìm kiếm
  const handleSearch = (query) => {
    setSearchQuery(query); // Cập nhật giá trị tìm kiếm
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${apiUrl}/users/${userId}`);
      if (response.data.success) {
        // Cập nhật lại danh sách người dùng sau khi xóa
        setUsers(users.filter((user) => user.id !== userId));
        alert("User deleted successfully!");
      } else {
        alert("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user.");
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
        {/* <Search placeholder="Search for users" onSearch={handleSearch} /> */}
        <Link href="/dashboard/users/createUser" className={styles.link} onClick={() => handleNavigation()}>
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      {loading ? (
        <div className={styles.loader}></div>
      ) : users.length === 0 ? ( // Kiểm tra nếu không có người dùng nào
        <div className={styles.noResults}>
          <p>No users found.</p>
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <td>#</td>
              <td>Name</td>
              <td>Email</td>
              <td>Phone</td>
              <td>Role</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>
                  <div className={styles.user}>{user.name}</div>
                </td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role == 1 ? "Admin" : "User"}</td>
                <td>
                  <div className={styles.buttons}>
                    <Link href={`/dashboard/users/updateUser/${user.id}`} className={styles.link} onClick={() => handleNavigation()}>
                      <button className={`${styles.edit} ${styles.button}`}>
                        <AiFillEdit />
                      </button>
                    </Link>
                    <button
                      className={`${styles.delete} ${styles.button}`}
                      onClick={() => handleDelete(user.id)}
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
