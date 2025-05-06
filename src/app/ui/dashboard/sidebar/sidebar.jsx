"use client"
import React, { useEffect, useState } from 'react';
import styles from './sidebar.module.css'
import MenuLink from './menuLink/menuLink'
import { RiDashboardFill } from "react-icons/ri";
import { RiArticleFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import Image from 'next/image';
import { MdLogout } from 'react-icons/md';
import { BiSolidCart, BiSolidCategory } from "react-icons/bi";
import { useRouter } from 'next/navigation';
import { FaSitemap } from "react-icons/fa";


const menuItems = [
    {
        title: "Pages",
        list: [
            {
                title: "Dashboard",
                icon: <RiDashboardFill />,
                path: "/dashboard",
                active: true
            },
            {
                title: "Users",
                icon: <FaUser />,
                path: "/dashboard/users",
                active: false
            },
            {
                title: "Products",
                icon: <RiArticleFill />,
                path: "/dashboard/products",
                active: false
            },{
                title: "Categories",
                icon: <BiSolidCategory />,
                path: "/dashboard/categories",
                active: false
            },
           // {
               // title: "Cart",
                //icon: <BiSolidCart />,
                //path: "/dashboard/cart",
                //active: false
           // }
        ]
    }
]
export default function Sidebar() {
    const [username, setUsername] = useState('Admin'); // Mặc định là 'Admin'
    const router = useRouter();

    // Lấy thông tin người dùng từ session khi component được mount
    useEffect(() => {
        const sessionName = localStorage.getItem('name'); // Lấy tên từ session
        if (sessionName) {
            setUsername(sessionName); // Cập nhật state với tên từ session
        }
    }, []);
    const handleLogout = () => {
        localStorage.removeItem('sessionId'); // Xóa session ID
        localStorage.removeItem('name'); // Xóa tên người dùng
        router.push('/'); // Điều hướng về trang đăng nhập
    };
    return (
        <div className={styles.container}>
            <div className={styles.user}>
                <Image src="/noavatar.png" alt="" width={40} height={40} className={styles.avatar} />
                <div className={styles.userDetail}>
                    <span className={styles.username}>{username}</span>
                    <span className={styles.userTitle}>Administrator</span>
                </div>
            </div>
            <ul className={styles.list}>
                {menuItems.map(cat => (
                    <li key={cat.title}>
                        <span className={styles.cat}>{cat.title}</span>
                        {cat.list.map(item => (
                            <MenuLink key={item.title} item={item} />
                        ))}
                    </li>
                ))}
            </ul>
            <button className={styles.logout} onClick={handleLogout}>
                <MdLogout />Logout
            </button>
        </div>
    )
}
