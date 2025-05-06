import React, { useState, useEffect } from 'react';
import styles from "@/app/ui/index/banner/banner.module.css"; // Import CSS module for styling

export default function BannerPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Replace with your actual image URLs
  const bannerImages = [
    "https://lylyphukienthucung.com/gw-content/images/untitled101-eHqBS.jpg",
    "https://lylyphukienthucung.com/gw-content/images/untitled102-QDkvF.jpg",
    "https://lylyphukienthucung.com/gw-content/images/untitled103-W0nRy.jpg",
    // Add more image URLs here
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [bannerImages.length]);

  return (
    <div className={styles.bannerContainer}>
      <img
        src={bannerImages[currentIndex]}
        alt={`Banner ${currentIndex + 1}`}
        className={styles.bannerImage}
      />
      {/* Optional: Add indicators for the slides */}
      <div className={styles.indicators}>
        {bannerImages.map((_, index) => (
          <button
            key={index}
            className={index === currentIndex ? styles.active : ''}
            onClick={() => setCurrentIndex(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}