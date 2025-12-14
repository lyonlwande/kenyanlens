import React from 'react'
import { useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
const AddBlog = () => {
    const [image, setImage] = useState(null);
    const [title,setTitle]=useState("");
    const [subTitle,setSubTitle]=useState("");
    const [category,setCategory]=useState("startup");
    const [isPublished,setIsPublished]=useState(false);
    
    const onSubmitHandler=(e)=>{
        e.preventDefault();
    }
  return (
    <form onSubmit={onSubmitHandler} className=' flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll '>
      <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>
       
       <p className="mb-2">Upload thumbnail</p>
       <label htmlFor="image" className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-purple-400 rounded-lg p-6 hover:bg-blue-100 transition mb-4">
         {image ? (
           <img
             src={URL.createObjectURL(image)}
             alt="Thumbnail Preview"
             className="w-40 h-40 object-cover rounded shadow mb-2"
           />
         ) : (
           <>
             <FaCloudUploadAlt size={48} className="text-blue-400 mb-2" />
             <span className="text-gray-500">Click to upload image</span>
           </>
         )}
         <input
           onChange={e => {
             if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
           }}
           type="file"
           id="image"
           accept="image/*"
           hidden
           required
         />
       </label>

       <p className='mt-4'> Blog title</p>
       <input type="text" placeholder='Type here' required className='w-full max-w-lg p-2 border border-purple-400 outline-none rounded' onChange={e => setTitle}/>
      </div>
    </form>
  )
}

export default AddBlog
