"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LogoHeader from "../common/Header/LogoHeader";
import { UserProps } from "../compAdministration/SidebarAdmin";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/serverActions/interfaces";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const SidebarAccounting = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  const trigger = useRef<any>(null);
  const SidebarProc = useRef<any>(null);
  const [count, setCount] = useState(0);
  const [user, setUser] = useState<UserProps>()

  let storedSidebarProcExpanded = "true";

  const [SidebarProcExpanded, setSidebarProcExpanded] = useState(
    storedSidebarProcExpanded === null ? false : storedSidebarProcExpanded === "true",
  );

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!SidebarProc.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        SidebarProc.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("SidebarProc-expanded", SidebarProcExpanded.toString());
    if (SidebarProcExpanded) {
      document.querySelector("body")?.classList.add("SidebarProc-expanded");
    } else {
      document.querySelector("body")?.classList.remove("SidebarProc-expanded");
    }
  }, [SidebarProcExpanded]);

  useEffect(() => {
    if (count == 0) {
      var access = localStorage.getItem("token")
      var school = localStorage.getItem("school")
      setCount(1);


      if (access && school) {
        var token: JwtPayload = jwtDecode(access)
        if (token) {
          setUser({
            id: token.user_id?.toString(),
            username: token.username,
            role: token.role,
            is_superuser: token.is_superuser,
            dept: token.dept,
            school: school
          })
        }
      } else {

      }
      setCount(1);
    }
  }, [count])

  return (
    <aside
      ref={SidebarProc}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black dark:bg-boxdark duration-300 ease-linear lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >

      {/* <!-- SidebarProc HEADER --> */}
      <LogoHeader
        trigger={trigger}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        home={`/Section-H/pageAccounting/${user?.school}`}
      />
      {/* <!-- SidebarProc HEADER --> */}


      <div className="duration-300 ease-linear flex flex-col no-scrollbar overflow-y-auto">
        {/* <!-- SidebarProc Menu --> */}
        <nav className="lg:mt-9 lg:px-6 mt-5 px-4 py-4">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="font-semibold mb-4 ml-4 text-bodydark2 text-sm">
              MENU
            </h3>

            <ul className="flex flex-col gap-1.5 mb-6">



              <li>
                <Link
                  href={`/Section-H/pageAccounting/${user?.school}/pageDashboard`}
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === `/Section-H/pageAccounting/${user?.school}/pageDashboard` &&
                    "bg-graydark dark:bg-meta-4"
                    }`}
                >
                  Home
                </Link>
              </li>


              <li>
                <Link
                  href={`/Section-H/pageAccounting/${user?.school}/AnalysisSystemCounts`}
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === `/Section-H/pageAccounting/${user?.school}/AnalysisSystemCounts` &&
                    "bg-graydark dark:bg-meta-4"
                    }`}
                >
                  System Counts
                </Link>
              </li>


              <li>
                <Link
                  href={`/Section-H/pageAccounting/${user?.school}/AnalysisSystemIncomeDomain`}
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === `/Section-H/pageAccounting/${user?.school}/AnalysisSystemIncomeDomain` &&
                    "bg-graydark dark:bg-meta-4"
                    }`}
                >
                  Income Domain
                </Link>
              </li>


              <li>
                <Link
                  href={`/Section-H/pageAccounting/${user?.school}/AnalysisSystemIncomeSpecialty`}
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname === `/Section-H/pageAccounting/${user?.school}/AnalysisSystemIncomeSpecialty` &&
                    "bg-graydark dark:bg-meta-4"
                    }`}
                >
                  Income Specialty
                </Link>
              </li>



            </ul>
          </div>

        </nav>
      </div>



    </aside>
  );
};

export default SidebarAccounting;
