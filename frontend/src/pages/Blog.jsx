import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { blog_data } from "../assets/assets";
import Navbar from "../components/Navbar";
import GradientCircle from "../components/GradientCircle";
import Moment from "moment";
import { FaFacebook, FaTwitter, FaPinterest, FaLinkedin } from "react-icons/fa";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
const Blog = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const fetchBlogData = async () => {
    const data = blog_data.find((blog) => blog.id === parseInt(id));
    setData(data);
  };
  useEffect(() => {
    fetchBlogData();
  }, []);

  return data ? (
    <div className="relative min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 pt-20 pb-12 w-full">
        {/* ...existing code... */}
        <section className="w-full max-w-4xl text-center mb-8 text-gray-600">
          <p className=" text-purple-700 py-4 font-medium"> Published on {Moment(data.createdAt).format("MMMM Do YYYY")}</p>
          <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800">
            {data.title}
          </h1>
          <h2 className="text-lg sm:text-2xl text-gray-600 font-medium mb-6 break-words">
            {data.subTitle}
          </h2>
          <p className="inline-block py-1 px-4 mx-auto rounded-full mb-6 border text-sm font-semibold text-purple-700/75 shadow-sm  border-purple-700/35  bg-purple-700/5 ">
            Ndoski
          </p>
        </section>
        <section className="w-full max-w-3xl flex justify-center mb-10">
          <img
            src={data.image}
            alt={data.title}
            className="rounded-3xl w-full h-auto object-cover shadow-lg transition-transform duration-300 hover:scale-105"
            style={{ maxHeight: "450px" }}
          />
        </section>
        <section className="w-full max-w-3xl text-left prose prose-lg prose-purple break-words">
          <div dangerouslySetInnerHTML={{ __html: data.description }}></div>
        </section>
        <section className="mt-12 mb-10 w-full max-w-3xl mx-auto ">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Comments</h3>
          <div className="space-y-4">
            {/* Comment 1 */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-2">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="User"
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium text-gray-800">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <p className="text-gray-700">
                This is a great article! I learned a lot from it. Thanks for sharing.
              </p>
            </div>
          </div>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Leave a Comment</h3>
          <form className="space-y-4">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="4"
              placeholder="Write your comment here..."
            ></textarea>
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Post Comment
            </button>
          </form>
        </section>
        {/* Social Share Buttons */}
        <section className="mt-12 w-full max-w-3xl mx-auto flex items-center gap-4">
          <p className="font-medium text-gray-800">Share this article:</p>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-blue-600 hover:text-blue-800">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="text-blue-400 hover:text-blue-600">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="text-red-600 hover:text-red-800">
              <FaPinterest size={20} />
            </a>
            <a href="#" className="text-gray-800 hover:text-gray-900">
              <FaLinkedin size={20} />
            </a>
          </div>
        </section>
        {/* ...existing code... */}
      </main>
      {/* Footer outside main, full width */}
      <div className="w-full">
        <Footer />
      </div>
    </div>
  ) : (
    <div>
      <Loader />
    </div>
  );
};

export default Blog;
