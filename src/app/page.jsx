"use client";
import Image from "next/image";
import Link from "next/link";
import IndexLayout from './index/layout'; // Import layout của index
import IndexPage from './index/page';

export default function Home() {
  return (
    <IndexLayout>
      <IndexPage />
    </IndexLayout>
  );
}
