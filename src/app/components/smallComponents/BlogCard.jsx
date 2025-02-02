import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const BlogCard = ({ blogsData, location_slug }) => {
  return (
    <section className="aero_home_article_card-wrapper">
      {blogsData?.children &&
        blogsData?.children.map((item, i) => {
          return (
            <Link
              key={i}
              href={`/${location_slug}/${item?.parentid}/${item?.path}`}
            >
              <article className="aero_home_article_card">
                <Image
                  src={item?.smallimage}
                  width={120}
                  height={120}
                  alt="article image"
                  title="article image"
                  unoptimized
                />
                <div className="aero_home_article_desc">
                  <div>{i + 1}</div>
                  <h3>{item?.title}</h3>
                  <p>Continue Reading...</p>
                </div>
              </article>
            </Link>
          );
        })}
    </section>
  );
};

export default BlogCard