// blog.utils.js

// Generate a URL-friendly slug from a blog title
export function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Validate if a string is a Cloudinary image URL
export function isCloudinaryUrl(url) {
  return /^https?:\/\/res\.cloudinary\.com\//.test(url);
}

// Extract unique tags from blog content blocks
export function extractTagsFromContent(contentBlocks) {
  const tags = new Set();
  contentBlocks.forEach(block => {
    if (Array.isArray(block.tags)) {
      block.tags.forEach(tag => tags.add(tag.trim().toLowerCase()));
    }
  });
  return Array.from(tags);
}

// Format blog description to a safe length
export function formatDescription(desc, maxLength = 300) {
  if (desc.length <= maxLength) return desc;
  return desc.slice(0, maxLength - 3) + '...';
}

// Check if a blog post is published
export function isPublished(blog) {
  return blog.status === 'published' && blog.active;
}

// Get keywords from title, description, and tags
export function extractKeywords(blog) {
  const keywords = [];
  if (blog.title) keywords.push(...blog.title.split(' '));
  if (blog.description) keywords.push(...blog.description.split(' '));
  if (Array.isArray(blog.tags)) keywords.push(...blog.tags);
  return Array.from(new Set(keywords.map(k => k.toLowerCase())));
}
