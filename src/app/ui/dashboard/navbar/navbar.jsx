"use client"
import React from 'react'
import styles from './navbar.module.css'
import { usePathname } from 'next/navigation'
import { RiDashboardFill } from "react-icons/ri";
import { RiArticleFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { MdNotifications, MdOutlineChat, MdPublic, MdSearch } from "react-icons/md";

export default function Navbar() {
    const pathname = usePathname();
    return (
        <div className={styles.container}>
            <div className={styles.title}>{pathname.split("/").pop()}</div>
            <div className={styles.menu}>
                
                <div className={styles.icons}>
                    <MdOutlineChat size={20}/>
                    <MdNotifications size={20}/>
                    <MdPublic size={20}/>
                </div>
            </div>
        </div>
    )
}
