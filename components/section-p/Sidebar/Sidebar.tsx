"use client";

import React, { useEffect, useRef, useState } from "react";
import SidebarItem from "./SidebarItem";
import ClickOutside from "@/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import LogoHeader from "@/components/section-h/common/Header/LogoHeader";

interface SidebarProps {
  menuGroups: any;
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  params: any;
}


const Sidebar = ({ sidebarOpen, setSidebarOpen, menuGroups, params }: SidebarProps) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const trigger = useRef<any>(null);
  const [school, setSchool] = useState<string | null>(null);

  useEffect(() => {
    if (!school && typeof window !== "undefined") {
      const schoolFromLocalStorage = localStorage.getItem("school");
      setSchool(schoolFromLocalStorage);
    }
  }, []); 

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex gap-2 items-center justify-center px-6 py-2">
          <LogoHeader
            trigger={trigger}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            home={`/${params.domain}/Section-H/pageAdministration/${school}`}
          />
        </div>

        <div className="duration-300 ease-linear flex flex-col no-scrollbar overflow-y-auto">
          {/* <!-- Sidebar Menu --> */}
          <nav className="lg:px-6 px-4 py-4">
            {menuGroups.map((group: any, groupIndex: number) => (
              <div key={groupIndex}>
                <h3 className="font-semibold mb-6 ml-4 text-bodydark2 text-sm">
                  {group.name}
                </h3>

                <ul className="flex flex-col gap-1 mb-10">
                  {group.menuItems.map((menuItem: any, menuIndex: number) => (
                    <SidebarItem
                      params={params}
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
