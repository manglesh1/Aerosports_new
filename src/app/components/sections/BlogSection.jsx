import Link from 'next/link';
import React from 'react';
import '../../styles/blog-section.css';

/**
 * Keywords associated with each page category/path for blog relevance matching
 */
const PAGE_KEYWORDS = {
  'attractions': ['attractions', 'fun', 'activities', 'adventure', 'indoor', 'playground', 'trampoline', 'park'],
  'open-jump': ['trampoline', 'jump', 'jumping', 'bounce'],
  'kids-birthday-parties': ['birthday', 'party', 'parties', 'celebration', 'celebrate', 'kids'],
  'groups-events': ['group', 'team', 'team-building', 'corporate', 'events', 'outing'],
  'membership': ['membership', 'member', 'pass', 'unlimited'],
  'about-us': ['aerosports', 'about', 'family', 'community'],
  'pricing-promos': ['pricing', 'deals', 'promo', 'discount'],
  'programs': ['camp', 'program', 'march-break', 'summer', 'school'],
  'rock-climbing': ['climbing', 'rock', 'climb', 'wall'],
  'full-arcade': ['arcade', 'games', 'gaming'],
  'axe-throw': ['axe', 'throwing', 'throw'],
  'escape-room': ['escape', 'room', 'puzzle'],
  'golf-glow-dark-mini-putt': ['golf', 'mini', 'putt', 'glow'],
  'archery': ['archery', 'bow', 'arrow'],
  'vr-virtual-reality': ['vr', 'virtual', 'reality', 'gaming'],
  'slam-basketball': ['basketball', 'slam', 'dunk', 'jump-basketball'],
  'dodgeball': ['dodgeball', 'dodge'],
  'ninja-obstacle-course': ['ninja', 'obstacle', 'course', 'warrior'],
};

function getRelevanceScore(blog, currentCategory) {
  const keywords = PAGE_KEYWORDS[currentCategory] || [currentCategory?.replace(/-/g, ' ')];
  if (!keywords.length) return 0;

  const blogText = `${blog.title || ''} ${blog.path || ''} ${blog.metadescription || ''} ${blog.category || ''}`.toLowerCase();
  let score = 0;

  // Exact category match is highest priority
  if (blog.category && blog.category === currentCategory) score += 10;

  // Keyword matches in blog title/path/description
  for (const kw of keywords) {
    if (blogText.includes(kw)) score += 2;
  }

  return score;
}

/**
 * BlogSection - Displays 3 relevant blog cards on any page
 * @param {Object} props
 * @param {Array} props.blogs - Array of blog items (children of the blogs parent)
 * @param {string} props.location_slug - Current location slug
 * @param {string} props.currentCategory - Current page category to match blogs against
 */
const BlogSection = ({ blogs, location_slug, currentCategory }) => {
  if (!blogs || blogs.length === 0) return null;

  // Score and sort blogs by relevance to current page
  const scored = blogs.map((blog) => ({
    blog,
    score: getRelevanceScore(blog, currentCategory),
  }));
  scored.sort((a, b) => b.score - a.score);

  let relevantBlogs = scored.slice(0, 3).map((s) => s.blog);

  if (relevantBlogs.length === 0) return null;

  return (
    <section className="aero-blog-section">
      <div className="aero-blog-section-container aero-max-container">
        <div className="aero-blog-section-header">
          <h2 className="aero-blog-section-title">Latest From Our Blog</h2>
          <Link
            href={`/${location_slug}/blogs`}
            className="aero-blog-section-viewall"
          >
            View All Articles →
          </Link>
        </div>

        <div className="aero-blog-section-grid">
          {relevantBlogs.map((blog, index) => (
            <Link
              key={blog.pageid || index}
              href={`/${location_slug}/blogs/${blog.path}`}
              className="aero-blog-section-card"
            >
              <div className="aero-blog-section-card-image">
                <img
                  src={
                    blog.smallimage ||
                    `https://storage.googleapis.com/aerosports/webp/${location_slug}/gallery-thummbnail-wall-climbwall.webp`
                  }
                  width={400}
                  height={250}
                  alt={blog.title || 'Blog article'}
                  title={blog.title}
                  loading="lazy"
                />
              </div>
              <div className="aero-blog-section-card-content">
                {blog.category && (
                  <span className="aero-blog-section-card-category">
                    {blog.category.replace(/-/g, ' ')}
                  </span>
                )}
                <h3 className="aero-blog-section-card-title">{blog.title}</h3>
                <p className="aero-blog-section-card-excerpt">
                  {blog.metadescription
                    ? blog.metadescription.length > 120
                      ? blog.metadescription.substring(0, 120) + '...'
                      : blog.metadescription
                    : 'Read more about this topic...'}
                </p>
                <span className="aero-blog-section-card-link" aria-label={`Read more about ${blog.title}`}>
                  Read More: {blog.title} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
