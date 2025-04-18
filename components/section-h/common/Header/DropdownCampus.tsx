'use client';
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/serverActions/interfaces";


interface UserProps {
  id: string | undefined
  username: string | undefined
  school: string[] | undefined
  role: string | undefined
}
const DropdownCampus = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const domain = useParams().domain;
  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);
  const [count, setCount] = useState<number>(0)
  const [fetching, setFetching] = useState<boolean>(true)
  const [user, setUser] = useState<UserProps>()

  useEffect(() => {
    if (count == 0) {
      var access = localStorage.getItem("session")

      if (access) {
        var token: JwtPayload = jwtDecode(access)
        if (token) {
          setUser({
            id: token.user_id?.toString(),
            username: token.username,
            school: token.school,
            role: token.role,
          })
        }
      } else {
        setFetching(false)
      }
      setCount(1);
    }
  }, [count, user])

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex gap-2 items-center mr-2"
        href="#"
      >
        {user && <span className="text-right">
          <span className="block dark:text-white font-medium text-black text-sm">
            CAMPUS
          </span>
        </span>}

        <svg
          className="fill-current hidden sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {
        user && user.school && user.school.length > 1 &&
        <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-3 flex w-50 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen === true ? "block" : "hidden"
          }`}
      >
        <ul className="bg-slate-700 border-b border-stroke dark:bg-slate-100 dark:border-strokedark dark:text-black flex flex-col gap-2 px-3 py-3 rounded text-white">
          
            <li className="flex font-semibold items-center justify-center text-center tracking-wide">
              <Link href={`/${domain}/pageAuthentication/pageSelectSchool?role=${user.role}`}>Change Campus</Link>
          </li>
        </ul>
        

      </div>}

      
      {/* <!-- Dropdown End --> */}
    </div>
  );
};

export default DropdownCampus;
