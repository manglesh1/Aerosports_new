

import { fetchData } from '@/utils/fetchData';
import '../../styles/blogs.css'
import React from "react";
import { getDataByParentId } from '@/utils/customFunctions';
import Link from 'next/link';

const data = [
  {
    id: 1,
    title: "Article 1",
    image:
      "https://escapefromthe6.com/wp-content/uploads/2024/10/What-Makes-a-Great-Escape-Room-Leader_.jpg",
    content: "What Makes a Great Escape Room Leader?",
  },
  {
    id: 2,
    title: "Article 1",
    image:
      "https://escapefromthe6.com/wp-content/uploads/2024/09/Common-Escape-Room-Team-Member-Roles-768x512.jpg",
    content: "Common Escape Room Team Member Roles",
  },
  {
    id: 3,
    title: "Article 1",
    image:
      "https://escapefromthe6.com/wp-content/uploads/2024/08/The-Power-of-Immersive-Storytelling-in-Escape-Rooms.jpg",
    content: "The Power of Immersive Storytelling in Escape Rooms",
  },
  {
    id: 4,
    title: "Article 1",
    image:
      "https://escapefromthe6.com/wp-content/uploads/2024/10/What-Makes-a-Great-Escape-Room-Leader_.jpg",
    content: "What Makes a Great Escape Room Leader?",
  },
  {
    id: 5,
    title: "Article 1",
    image:
      "https://escapefromthe6.com/wp-content/uploads/2024/09/Common-Escape-Room-Team-Member-Roles-768x512.jpg",
    content: "Common Escape Room Team Member Roles",
  },
  {
    id: 6,
    title: "Article 1",
    image:
      "https://escapefromthe6.com/wp-content/uploads/2024/08/The-Power-of-Immersive-Storytelling-in-Escape-Rooms.jpg",
    content: "The Power of Immersive Storytelling in Escape Rooms",
  },
  {
    id: 7,
    title: "Article 1",
    image:
      "https://escapefromthe6.com/wp-content/uploads/2024/10/What-Makes-a-Great-Escape-Room-Leader_.jpg",
    content: "What Makes a Great Escape Room Leader?",
  },
  {
    id: 8,
    title: "Article 1",
    image:
      "https://escapefromthe6.com/wp-content/uploads/2024/09/Common-Escape-Room-Team-Member-Roles-768x512.jpg",
    content: "Common Escape Room Team Member Roles",
  },
  {
    id: 9,
    title: "Article 1",
    image:
      "https://escapefromthe6.com/wp-content/uploads/2024/08/The-Power-of-Immersive-Storytelling-in-Escape-Rooms.jpg",
    content: "The Power of Immersive Storytelling in Escape Rooms",
  },
  {
    id: 10,
    title: "Article 1",
    image:
      "https://escapefromthe6.com/wp-content/uploads/2024/10/What-Makes-a-Great-Escape-Room-Leader_.jpg",
    content: "What Makes a Great Escape Room Leader?",
  },
  {
    id: 11,
    title: "Article 1",
    image:
      "https://escapefromthe6.com/wp-content/uploads/2024/09/Common-Escape-Room-Team-Member-Roles-768x512.jpg",
    content: "Common Escape Room Team Member Roles",
  },
  {
    id: 12,
    title: "Article 1",
    image:
      "https://escapefromthe6.com/wp-content/uploads/2024/08/The-Power-of-Immersive-Storytelling-in-Escape-Rooms.jpg",
    content: "The Power of Immersive Storytelling in Escape Rooms",
  },
  {
    id: 13,
    title: "Article 1",
    image:
      "https://escapefromthe6.com/wp-content/uploads/2024/10/What-Makes-a-Great-Escape-Room-Leader_.jpg",
    content: "What Makes a Great Escape Room Leader?",
  },
  {
    id: 14,
    title: "Article 1",
    image:
      "https://escapefromthe6.com/wp-content/uploads/2024/09/Common-Escape-Room-Team-Member-Roles-768x512.jpg",
    content: "Common Escape Room Team Member Roles",
  },
  {
    id: 15,
    title: "Article 1",
    image:
      "https://escapefromthe6.com/wp-content/uploads/2024/08/The-Power-of-Immersive-Storytelling-in-Escape-Rooms.jpg",
    content: "The Power of Immersive Storytelling in Escape Rooms",
  },
  {
    id: 16,
    title: "Article 1",
    image:
      "https://escapefromthe6.com/wp-content/uploads/2024/10/What-Makes-a-Great-Escape-Room-Leader_.jpg",
    content: "What Makes a Great Escape Room Leader?",
  },
  {
    id: 17,
    title: "Article 1",
    image:
      "https://escapefromthe6.com/wp-content/uploads/2024/09/Common-Escape-Room-Team-Member-Roles-768x512.jpg",
    content: "Common Escape Room Team Member Roles",
  },
  {
    id: 18,
    title: "Article 1",
    image:
      "https://escapefromthe6.com/wp-content/uploads/2024/08/The-Power-of-Immersive-Storytelling-in-Escape-Rooms.jpg",
    content: "The Power of Immersive Storytelling in Escape Rooms",
  },
  {
    id: 19,
    title: "Article 1",
    image:
      "https://escapefromthe6.com/wp-content/uploads/2024/10/What-Makes-a-Great-Escape-Room-Leader_.jpg",
    content: "What Makes a Great Escape Room Leader?",
  },
  {
    id: 20,
    title: "Article 1",
    image:
      "https://escapefromthe6.com/wp-content/uploads/2024/09/Common-Escape-Room-Team-Member-Roles-768x512.jpg",
    content: "Common Escape Room Team Member Roles",
  },
  {
    id: 21,
    title: "Article 1",
    image:
      "https://escapefromthe6.com/wp-content/uploads/2024/08/The-Power-of-Immersive-Storytelling-in-Escape-Rooms.jpg",
    content: "The Power of Immersive Storytelling in Escape Rooms",
  },
];

const page = async({params}) => {
  const location_slug = params?.location_slug;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const data = await fetchData(`${API_URL}/fetchmenudata1?location=${location_slug}`);
  const blogsData = getDataByParentId(data, "blogs");
  const extractBlogData = blogsData[0]?.children
  console.log(extractBlogData)
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
