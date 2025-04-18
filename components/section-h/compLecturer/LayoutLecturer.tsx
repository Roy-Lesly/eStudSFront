"use client";
import React, { useState } from "react";
import SidebarLecturer from "./SidebarLecturer";
import HeaderLecturer from "./HeaderLecturer";

const LayoutLecturer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <SidebarLecturer sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto relative">
          {/* <!-- ===== Header Start ===== --> */}
          <HeaderLecturer sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main className="">
            <div className="flex flex-col md:p-4 mx-auto p-2">
              {children}
            </div>
            <div className="flex items-center justify-center mb-2">Powered By Econneq</div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}

export default LayoutLecturer;