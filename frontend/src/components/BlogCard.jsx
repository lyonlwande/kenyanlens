import React from "react";
import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const { title, description, category, image } = blog;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/blog/${blog.id}`)}
      className="w-full rounded-lg overflow-hidden border-[0.5px] border-black/30 shadow hover:scale-105 hover:shadow-purple-700/25 transition-transform duration-300 cursor-pointer"
    >
      <div className="w-full aspect-video bg-gray-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-fit aspect-video"
          style={{ display: 'block' }}
        />
      </div>
      <span className="ml-5 mt-4 px-3 py-1 inline-block bg-purple-500/40 rounded-full text-gray-700 text-xs">
        {category}
      </span>
      <div className="p-5">
        <h5 className="mb-2 font-medium text-gray-900">{title}</h5>
        <p className="mb-3 text-xs text-gray-600">{description.slice(0, 80)}</p>
      </div>
    </div>
  );
};

export default BlogCard;
