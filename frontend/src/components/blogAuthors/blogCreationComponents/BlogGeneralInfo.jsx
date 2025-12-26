import React from 'react';


const BlogGeneralInfo = ({
  thumbnail, setThumbnail, title, setTitle, subTitle, setSubTitle, description, setDescription, category, setCategory, isPublished, setIsPublished
}) => {
  return (
    <section className="bg-purple-50 rounded-lg p-4 sm:p-6 mb-2 flex flex-col gap-4 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start">
        <div className="flex flex-col items-center w-full md:w-auto">
          <p className="mb-2 font-semibold">Upload Thumbnail</p>
          <label htmlFor="thumbnail" className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-purple-400 rounded-lg p-4 sm:p-6 hover:bg-blue-100 transition mb-2 w-32 h-32">
            {thumbnail ? (
              <img
                src={
                  typeof thumbnail === 'string'
                    ? thumbnail
                    : thumbnail instanceof File
                      ? URL.createObjectURL(thumbnail)
                      : undefined
                }
                alt="Thumbnail Preview"
                className="w-28 h-28 object-cover rounded shadow mb-2"
              />
            ) : (
              <>
                {/* You may want to import FaCloudUploadAlt here if not already */}
                <span className="text-gray-500 text-xs sm:text-sm text-center">Click to upload image</span>
              </>
            )}
            <input
              onChange={e => {
                if (e.target.files && e.target.files[0]) setThumbnail(e.target.files[0]);
              }}
              type="file"
              id="thumbnail"
              accept="image/*"
              hidden
              required
            />
          </label>
        </div>
        <div className="flex-1 flex flex-col gap-3 sm:gap-4 w-full">
          <div>
            <label className="font-semibold">Blog Title</label>
            <input
              type="text"
              placeholder="Type here"
              required
              className="w-full p-2 border border-purple-400 outline-none rounded mt-1 text-sm sm:text-base"
              onChange={e => setTitle(e.target.value)}
              value={title}
            />
          </div>
          <div>
            <label className="font-semibold">Sub Title</label>
            <input
              type="text"
              placeholder="Type here"
              required
              className="w-full p-2 border border-purple-400 outline-none rounded mt-1 text-sm sm:text-base"
              onChange={e => setSubTitle(e.target.value)}
              value={subTitle}
            />
          </div>
          <div>
            <label className="font-semibold">Description</label>
            <textarea
              placeholder="Enter a short summary (max 300 chars)"
              required
              className="w-full p-2 border border-purple-400 outline-none rounded mt-1 min-h-[60px] text-sm sm:text-base"
              maxLength={300}
              onChange={e => setDescription(e.target.value)}
              value={description}
            />
          </div>
          <div>
            <label className="font-semibold">Blog Category</label>
            <input
              type="text"
              placeholder="Enter category (e.g. Finance, Tech, etc.)"
              required
              className="w-full p-2 border border-purple-400 outline-none rounded mt-1 text-sm sm:text-base"
              onChange={e => setCategory(e.target.value)}
              value={category}
            />
          </div>
          <div className="flex gap-2 items-center mt-2">
            <label className="font-semibold">Publish now</label>
            <input
              type="checkbox"
              checked={isPublished}
              className="scale-125 cursor-pointer"
              onChange={e => setIsPublished(e.target.checked)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogGeneralInfo;
