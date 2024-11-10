// app/blog/page.js
import Link from "next/link";
import "../../styles/blogs.css"; 

const blogPosts = [
  {
    title: "Blog Post 1",
    slug: "blog-post-1",
    excerpt: "This is the first blog post.",
  },
  {
    title: "Blog Post 2",
    slug: "blog-post-2",
    excerpt: "This is the second blog post.",
  },
  {
    title: "Blog Post 3",
    slug: "blog-post-3",
    excerpt: "This is the third blog post.",
  },
];

export default function BlogList({location_slug}) {
  return (
    <div className="blog-list">
      <h1>All Blog Posts</h1>
      <ul>
        {blogPosts.map((post) => (
          <li key={post.slug}>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <Link href={`blogs/${post.slug}`}>
              <button className="read-more">Read More</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
