// 'use client';
import DropdownCampus from "@/section-h/common/Header/DropdownCampus";
import DropdownNotification from "@/section-h/common/Header/DropdownNotification";
import DropdownMessage from "@/section-h/common/Header/DropdownMessage";
import CampusInfo from "@/section-h/common/Header/CampusInfo";
import DarkModeSwitcher from "@/section-h/common/Header/DarkModeSwitcher";
import DropdownUser from "@/section-h/Header/DropdownUser";

const HeaderTenant = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {

  return (
    <header className="bg-white dark:bg-boxdark dark:drop-shadow-none drop-shadow-1 flex sticky top-0 w-full z-999">
      <div className="flex flex-grow items-center justify-between md:pr-4 px-4 py-4 shadow-2">
        <div className="flex gap-2 items-center lg:hidden sm:gap-4">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="bg-white block border border-stroke dark:bg-boxdark dark:border-strokedark lg:hidden p-1.5 rounded-sm shadow-sm z-99999"
          >
            <span className="block cursor-pointer h-5.5 relative w-5.5">
              <span className="absolute du-block h-full right-0 w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!w-full delay-300"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "delay-400 !w-full"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!w-full delay-500"
                  }`}
                ></span>
              </span>
              <span className="absolute h-full right-0 rotate-45 w-full">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!h-0 !delay-[0]"
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!h-0 !delay-200"
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

        </div>

        <div className="hidden sm:block">
            <div className="relative">
              {/* <DropdownCampus /> */}
              <CampusInfo />

            </div>
        </div>

        <div className="2xsm:gap-7 flex gap-3 items-center">
          <ul className="2xsm:gap-4 flex gap-2 items-center">
            {/* <!-- Dark Mode Toggler --> */}
            <DropdownCampus />
            
            {/* <!-- Dark Mode Toggler --> */}
            <DarkModeSwitcher />
            {/* <!-- Dark Mode Toggler --> */}

            {/* <!-- Notification Menu Area --> */}
            <DropdownNotification />
            {/* <!-- Notification Menu Area --> */}

            {/* <!-- Chat Notification Area --> */}
            <DropdownMessage />
            {/* <!-- Chat Notification Area --> */}
          </ul>

          <DropdownUser />

        </div>
      </div>
    </header>
  );
};

export default HeaderTenant;
