import React from 'react';


const BlogLivePreview = ({ blocks, renderBlockPreview }) => {
  return (
    <div className="w-full md:w-72 bg-white/90 border-l-2 border-purple-100 p-4 rounded-xl shadow-md mt-6 md:mt-0">
      <div className="font-bold text-xs mb-3 text-purple-700">Live Preview</div>
      {blocks.map((block, i) => renderBlockPreview(block, i, true))}
    </div>
  );
};

export default BlogLivePreview;
