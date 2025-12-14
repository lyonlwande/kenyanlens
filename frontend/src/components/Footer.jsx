import React from "react";
import { assets, footer_data } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 bg-purple-700/10 w-full">
      <div className="flex flex-col md:flex-row md:items-start items-center justify-between gap-10 py-10 border-b border-gray-300/30 text-gray-500">
        <div className="w-full md:w-auto flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={assets.egaTradeLogo}
              alt="logo"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            />
            <span className="text-purple-900 font-bold text-xl sm:text-2xl lg:text-3xl">KenyanLens</span>
          </div>
          <p className="max-w-[410px] mt-4 text-sm sm:text-base lg:text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
            repellat maxime voluptatibus, cumque ipsam aspernatur quidem dolorem
            alias deserunt a laboriosam amet est quo totam eum aperiam doloribus
            recusandae natus.
          </p>
        </div>

        <div className="w-full md:w-[55%] grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-6">
          {footer_data.map((section, index) => (
            <div key={index} className="min-w-[120px]">
              <h3 className="font-semibold text-base text-gray-900 mb-2 sm:mb-4 lg:mb-5">
                {section.title}
              </h3>
              <ul className="text-sm space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href="#" className="hover:underline transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="py-4 text-center text-xs sm:text-sm md:text-base text-gray-500">
        Copyright © 2025 KenyanLens — Celebrating Kenyan voices. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
