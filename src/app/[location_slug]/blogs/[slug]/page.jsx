'use client'

import { useRouter } from "next/navigation";
// import "./blog.css";

const blogPosts = {
  "blog-post-1": {
    title: "Blog Post 1",
    content: "This is the full content of the first blog post.",
  },
  "blog-post-2": {
    title: "Blog Post 2",
    content: "This is the full content of the second blog post.",
  },
  "blog-post-3": {
    title: "Blog Post 3",
    content: "This is the full content of the third blog post.",
  },
};

export default function BlogDetail() {
  // const router = useRouter();
  // const { slug } = router.query;

  // const post = blogPosts[slug];

  // if (!post) {
  //   return <div>Blog post not found</div>;
  // }

  return (
    <div className="blog-detail">
      {/* <h1>{post.title}</h1>
      <p>{post.content}</p>
      <button onClick={() => router.back()} className="back-button">
        Back to Blog List
      </button> */}
      yogesh
    </div>
  );
}
