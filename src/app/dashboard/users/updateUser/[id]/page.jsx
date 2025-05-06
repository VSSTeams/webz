"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from '@/app/ui/dashboard/users/updateUser/updateUser.module.css'
import { GrUserAdmin } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa";


export default function UpdateUserPage({ params: paramsPromise }) {
    const params = React.use(paramsPromise); // Unwrap the params Promise
    const { id } = params; // Lấy userId từ URL
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 0
    });
    const apiUrl = process.env.NEXT_PUBLIC_SERVER_API;
    const router = useRouter();

    // Lấy thông tin người dùng từ backend
    useEffect(() => {
        document.title = "Page Update User";
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${apiUrl}/users/${id}`);
                if (response.data.success) {
                    setUser(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, [id, apiUrl]);

    // Xử lý thay đổi giá trị trong form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleRoleChange = (role) => {
        setUser((prevUser) => ({
            ...prevUser,
            role: role,
        }));
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.patch(`${apiUrl}/users/${id}`, user);
            if (response.data.success) {
                alert("User updated successfully!");
                router.push("/dashboard/users"); // Chuyển hướng về trang danh sách người dùng
            } else {
                alert("Failed to update user.");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("An error occurred while updating the user.");
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    placeholder="Username"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="phone"
                    placeholder="Phone"
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                />
                <div className={`${styles.role} w-[200px] p-2 rounded-lg shadow flex flex-col items-center justify-center gap-2`}>
                    <p className={`${styles.title} capitalize font-semibold self-start`}>Role</p>
                    {/* Admin Option */}
                    <label
                        className={`inline-flex justify-between w-full items-center rounded-lg p-2 border transition-all cursor-pointer ${user.role === 1 ? "border-indigo-500 font-bold" : "border-transparent"
                            }`}
                        onClick={() => handleRoleChange(1)}
                    >
                        <div className="inline-flex items-center gap-2 pointer-events-none">
                            <GrUserAdmin />
                        </div>
                        <p
                            className={`font-semibold whitespace-nowrap transition-all duration-700 pointer-events-none ${user.role === 1
                                ? "translate-x-0 opacity-100"
                                : "translate-x-[110%] opacity-0"
                                }`}
                        >
                            Admin
                        </p>
                        <input
                            type="radio"
                            name="role"
                            value={1}
                            checked={user.role === 1}
                            onChange={() => handleRoleChange(1)}
                            className="opacity-0 absolute pointer-events-none"
                        />
                    </label>
                    {/* User Option */}
                    <label
                        className={`inline-flex justify-between w-full items-center rounded-lg p-2 border transition-all cursor-pointer ${user.role === 0 ? "border-indigo-500 font-bold" : "border-transparent"
                            }`}
                        onClick={() => handleRoleChange(0)}
                    >
                        <div className="inline-flex items-center gap-2 pointer-events-none">
                            <FaRegUser />
                        </div>
                        <p
                            className={`font-semibold whitespace-nowrap transition-all duration-700 pointer-events-none ${user.role === 0
                                ? "translate-x-0 opacity-100"
                                : "translate-x-[110%] opacity-0"
                                }`}
                        >
                            User
                        </p>
                        <input
                            type="radio"
                            name="role"
                            value={0}
                            checked={user.role === 0}
                            onChange={() => handleRoleChange(0)}
                            className="opacity-0 absolute pointer-events-none"
                        />
                    </label>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
