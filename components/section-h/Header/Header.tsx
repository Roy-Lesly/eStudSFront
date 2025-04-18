import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import CampusInfo from "@/section-h/common/Header/CampusInfo";
import DropdownCampus from "@/section-h/common/Header/DropdownCampus";
import DropdownUser from "./DropdownUser";
import DeviceInfo from "./DeviceInfo";
import LanguageSwitcher from "@/LanguageSwitcher";
import { useParams } from "next/navigation";

const Header = ({sidebarOpen, setSidebarOpen, searchComponent}: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
  searchComponent?: ReactNode;
}) => {

  const params: { locale: string } = useParams()

    return (
    <header className="bg-white dark:bg-boxdark dark:drop-shadow-none drop-shadow-1 flex sticky top-0 w-full z-999">
      <div className="2xl:px-11 flex flex-grow items-center justify-between px-4 py-2 shadow-2">
        <div className="flex gap-2 items-center lg:hidden sm:gap-4">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="bg-white block border border-stroke dark:bg-boxdark dark:border-strokedark lg:hidden p-1.5 rounded-sm shadow-sm z-99999"
          >
            <span className="block cursor-pointer h-5.5 relative w-5.5">
              <span className="absolute du-block h-full right-0 w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "!w-full delay-300"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "delay-400 !w-full"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "!w-full delay-500"
                  }`}
                ></span>
              </span>
              <span className="absolute h-full right-0 rotate-45 w-full">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "!h-0 !delay-[0]"
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "!h-0 !delay-200"
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link className="flex-shrink-0 hidden" href="/">
            <Image
              width={32}
              height={32}
              src={"/images/logo/logo-icon.svg"}
              alt="Logo"
            />
          </Link>
        </div>

        <div className="hidden sm:block">
            <div className="relative">
              {/* <DropdownCampus /> */}
              <CampusInfo />

            </div>
        </div>

        <div className="sm:block">

          {searchComponent}
          <DeviceInfo />

        </div>


        <div className="2xsm:gap-7 flex gap-3 items-center">
       
          <ul className="2xsm:gap-4 flex gap-2 items-center justify-center">
                  
                  <LanguageSwitcher currentLocale={params?.locale || "en"} />

            {/* <!-- Dark Mode Toggler --> */}
            <DropdownCampus />


            {/* <!-- Notification Menu Area --> */}
            {/* <DropdownNotification /> */}
            {/* <!-- Notification Menu Area --> */}

            {/* <!-- Chat Notification Area --> */}
            {/* <DropdownMessage /> */}
            {/* <!-- Chat Notification Area --> */}
          </ul>

          {/* <!-- User Area --> */}
          <DropdownUser />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
