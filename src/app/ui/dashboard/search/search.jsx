import React from 'react'
import styles from './search.module.css'
import { MdSearch } from 'react-icons/md'

export default function Search({placeholder, onSearch}) {
  const handleInputChange = (event) => {
    const value = event.target.value;
    onSearch(value); // Gọi hàm onSearch với giá trị nhập vào
  };
  
  return (
    <div className={styles.container}>
        <MdSearch size={20}/>
        <input type="text" placeholder={placeholder} className={styles.input} onChange={handleInputChange}/>
    </div>
  )
}
