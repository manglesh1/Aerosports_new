export function getDataByParentId(data, path) {
  return data?.filter((item) => item.path === path);
}
export function getDataByBlogId(data, slug) {
  return data.find((item) => item.path === slug);
}

/**
 * Sanitize CMS HTML: downgrade <h1> to <h2> to ensure only one h1 per page.
 * Use this on any HTML from Google Sheets rendered via dangerouslySetInnerHTML.
 */
export function sanitizeCmsHtml(html) {
  if (!html) return "";
  return html
    .replace(/<h1(\s|>)/gi, '<h2$1')
    .replace(/<\/h1>/gi, '</h2>');
}
