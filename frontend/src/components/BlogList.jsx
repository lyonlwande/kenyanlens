import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { blog_data, blogCartegories } from "../assets/assets";
import BlogCard from "./BlogCard";

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  return (
    <section className="px-2 sm:px-4 md:px-8 lg:px-16 xl:px-24 w-full">
      {/* Horizontally scrollable category list */}
      <div
        className="flex gap-2 sm:gap-3 justify-start items-center rounded-full my-6 sm:my-8 relative overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent px-1 sm:px-2"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {blogCartegories.map((category) => (
          <div key={category} className="relative flex-shrink-0">
            <button
              onClick={() => setMenu(category)}
              className={`px-3 sm:px-4 py-2 rounded-full transition-colors duration-200 text-xs sm:text-sm font-medium focus:outline-none ${
                menu === category ? "text-white" : "text-gray-700"
              } bg-gray-100 hover:bg-purple-100`}
              style={{ position: "relative", zIndex: 1 }}
            >
              <span style={{ position: "relative", zIndex: 2 }}>
                {category}
              </span>
              <AnimatePresence>
                {menu === category && (
                  <motion.div
                    layoutId="categoryHighlight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-purple-700 shadow-md"
                    style={{ zIndex: 0 }}
                  />
                )}
              </AnimatePresence>
            </button>
          </div>
        ))}
      </div>

      {/*--- Blog Cards ---*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mb-16 sm:mb-24 mx-2 sm:mx-8 xl:mx-10">
        {blog_data
          .filter((blog) => (menu === "All" ? true : blog.category === menu))
          .map((blog) => (
            <BlogCard blog={blog} key={blog.id} />
          ))}
      </div>
    </section>
  );
};

export default BlogList;
