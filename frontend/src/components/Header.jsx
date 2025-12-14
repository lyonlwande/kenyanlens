import React from 'react'
import { assets } from '../assets/assets.js';
import { FaStar } from "react-icons/fa";
import GradientCircle from "./GradientCircle";
const Header = () => {
  return (
    <div className="mx-8 sm:mx-16  xl:mx-24 relative min-h-[300px] mt-10 flex items-center justify-center">
           <div className="text-center mt-20 mb-8">
        <div className="inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4 border border-black/20 rounded-full text-sm text-black/65">
           <div className="flex items-center justify-center gap-2"> <p> New :  Ai Feature intergrated  </p> <FaStar/></div>
        </div>
        <h1 className='text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-700'> Your own <span className='text-[#a323b4]'>blogging</span> <br /> platform.</h1>
        <p className='my-10 sm:my-8 max-w-2xl m-auto max-sm:text-sm'>
           <span className='font-semibold text-purple-900 font-sans'>KenyanLens </span> is a digital Kenyan space where conversations, ideas, experiences, and culture come together. We highlight real issues, explore practical solutions, and share authentic stories that inspire the 254. Dive into a platform built for genuine voices, meaningful discussions, and a true reflection of Kenyan life.
        </p>
        
        <form className="flex justify-between max-w-lg max-sm:scale-75 mx-auto border border-gray-300 bg-white rounded overflow-hidden">
            <input type="text" placeholder='Search for blogs' required 
            className='w-full pl-4 outline-none
            '/>
            <button type='submit' className='bg-gray-700 text-white px-8 py-2 m-1.5 rounded hover:scale-105 transition-all cursor-pointer'>search</button>
        </form>

      </div>
      <GradientCircle />
         
    </div>
  )
}

export default Header
