"use client";
import React, {useEffect} from 'react'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from '@/app/ui/dashboard/users/createUser/createUser.module.css'

export default function CreateUserPage() {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;
  const router = useRouter();

  useEffect(() => {
          document.title = "Page Create User";
        }, []);
  const handleSubmit = async (event) => {
    event.preventDefault(); // Ngăn chặn hành động mặc định của form

    // Lấy dữ liệu từ form
    const formData = new FormData(event.target);
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      password: formData.get('password'),
      role: 0,
    };

    try {
      // Gửi dữ liệu qua API sử dụng axios
      const response = await axios.post(`${apiUrl}/users`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Xử lý kết quả
      if (response.data.success) {
        alert('User Created Successfully!');
        router.push("/dashboard/users");
      } else {
        alert('Failed To Create User.');
        console.error('API Error:', response.data);
      }
    } catch (error) {
      alert('An error occurred while submitting the form.');
      console.error('Error:', error);
    }
  };
  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" placeholder='Username' name='name' required />
        <input type="email" placeholder='Email' name='email' required />
        <input type="phone" placeholder='Phone' name='phone' required />
        <input type="password" placeholder='Password' name='password' required />
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}
