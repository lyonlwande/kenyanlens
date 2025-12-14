import React, { useEffect } from "react";
import { useState } from "react";

const DashBoard = () => {
  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: [],
  });
  const fetchBlogData = async () => { 
    setDashboardData();
  }
  useEffect(() => {
    fetchBlogData();
  }, []);
  return (
    <div className="flex-1 p-4 md:p-10 bg-blue-50/50">
      <div className="flex flex-wrap gap-4">
        // DASHBOAR ICON GOES HERE 
        <div className="">
            <p>{/*dashboardData.blogs*/}</p>
            
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
