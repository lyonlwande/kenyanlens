import React from "react";

const NewsLetter = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center space-y-2 my-20 sm:my-28 md:my-32 px-4 sm:px-8 w-full">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 sm:mb-4">Never Miss A Blog!</h1>
      <p className="text-base sm:text-lg md:text-xl text-gray-500/70 pb-6 sm:pb-8">
        Subscribe to our newsletter to get the latest
        <span className="inline-block font-bold text-xl sm:text-2xl md:text-3xl mx-1 align-middle">
          <span className="text-red-600">2</span>
          <span className="text-black">5</span>
          <span className="text-green-600">4</span>
        </span>
        updates directly in your inbox.
      </p>
      <form className="flex flex-col sm:flex-row items-center justify-center w-full max-w-lg sm:max-w-2xl gap-3 sm:gap-0">
        <input
          className="border border-gray-300 rounded-md sm:rounded-r-none h-12 sm:h-13 outline-none w-full px-3 text-gray-500 text-base focus:border-purple-500 transition"
          type="email"
          placeholder="Enter your email id"
          required
        />
        <button
          type="submit"
          className="w-full sm:w-auto h-12 sm:h-13 md:px-12 px-8 text-white bg-purple-700/80 hover:bg-purple-700 transition-all cursor-pointer rounded-md sm:rounded-l-none font-semibold text-base"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
};

export default NewsLetter;
