
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useBlogStore from '../../zustandStores/blogStore';
// Try to use BlogCard if it exists, else render inline
import BlogCard from '../../components/BlogCard';

const ListBlog = () => {
  const navigate = useNavigate();
  const { blogs, loading, error, fetchBlogs } = useBlogStore();

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line
  }, []);

  const handleBlogClick = (id) => {
    navigate(`/blog/${id}`);
  };

  const handleEditClick = (id) => {
    navigate(`/author/editBlog/${id}`);
  };

  return (
    <div className="w-full p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6 text-purple-800">Your Blogs</h2>
      {loading && (
        <div className="flex justify-center items-center h-32">
          <span className="text-purple-700">Loading blogs...</span>
        </div>
      )}
      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}
      {!loading && !error && blogs.length === 0 && (
        <div className="text-gray-500">You have not created any blogs yet.</div>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          BlogCard ? (
            <div key={blog._id} className="relative group">
              <div className="cursor-pointer" onClick={() => handleBlogClick(blog._id)}>
                <BlogCard blog={blog} />
              </div>
              <button
                className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded opacity-90 hover:opacity-100 z-10"
                onClick={(e) => { e.stopPropagation(); handleEditClick(blog._id); }}
              >
                Edit
              </button>
            </div>
          ) : (
            <div
              key={blog._id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer bg-white relative group"
              onClick={() => handleBlogClick(blog._id)}
            >
              <h3 className="font-semibold text-lg text-purple-900 mb-2">{blog.title}</h3>
              <p className="text-gray-700 mb-1">{blog.excerpt || blog.content?.slice(0, 100) + '...'}</p>
              <div className="text-xs text-gray-400">{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ''}</div>
              <button
                className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded opacity-90 hover:opacity-100 z-10"
                onClick={(e) => { e.stopPropagation(); handleEditClick(blog._id); }}
              >
                Edit
              </button>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default ListBlog;
