

import { fetchData } from '@/utils/fetchData';
import '../../styles/blogs.css'
import React from "react";
import { getDataByParentId } from '@/utils/customFunctions';
import Link from 'next/link';
import { fetchsheetdata, fetchMenuData, fetchPageData } from "@/lib/sheets";


const page = async({params}) => {
  const location_slug = params?.location_slug;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
const data = await fetchMenuData(location_slug);
 // const data = await fetchData(`${API_URL}/fetchmenudata1?location=${location_slug}`);
  const blogsData = getDataByParentId(data, "blogs");
  const extractBlogData = blogsData[0]?.children
  // console.log(extractBlogData)
  return (
    <main className="aero-blog-main-section">
      <section className='aero-max-container'>
      <h1 className="aero-blog-main-heading">Our Latest News</h1>
      <section className="aero-blog-main-article-wrapper">
        {extractBlogData?.map((item,i) => (
          <article className="aero-blog-main-article-card" key={i}>
            <div className="aero-blog-img-section">
              <Link href={`blogs/${item?.path}`} prefetch>
              <img src={item.smallimage} alt="Article Image" />
              </Link>
            </div>
            <div className="aero-blog-content-section">
              <span className='aero-blog-updated-time'>October 31, 2024</span>
              <Link href={`blogs/${item?.path}`} prefetch><h2 className='aero-blog-second-heading'>{item.title}</h2></Link>
              <Link href={`blogs/${item?.path}`} prefetch className='aero-blog-readmore-btn'>READ MORE</Link>
            </div>
          </article>
        ))}
      </section>

      </section>
    </main>
  );
};

export default page;
