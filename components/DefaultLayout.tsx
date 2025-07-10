"use client";

import { JwtPayload } from "@/serverActions/interfaces";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import NotAuthorized from "./NotAuthorized";
import SessionExpired from "./SessionExpired";

const DefaultLayout = ({
  domain,
  children,
  sidebar,
  headerbar,
  searchComponent,
  downloadComponent,
  pageType,
}: {
  domain: string;
  children?: React.ReactNode;
  sidebar?: React.ReactNode;
  headerbar?: React.ReactNode;
  searchComponent?: React.ReactNode;
  downloadComponent?: React.ReactNode;
  pageType?: "admin" | "teacher" | "student";
}) => {

  const [user, setUser] = useState<JwtPayload | null | any>(null)
  const [access, setAccess] = useState<boolean>(true)

  useEffect(() => {
    let decodedUser;
    const token = localStorage.getItem("token");
      decodedUser = token ? jwtDecode<JwtPayload>(token) : null;
      setUser(decodedUser);

    if (decodedUser) {
      try {
        const currentTime = Date.now() / 1000;

        if (decodedUser.exp && decodedUser.exp > currentTime) {
          if (pageType && pageType === "admin") {
            if (decodedUser.role !== "admin") {
              setAccess(false);
            }
          } 
          if (pageType && pageType === "teacher") {
            if (decodedUser.role !== "teacher" && decodedUser.role !== "admin") {
              setAccess(false);
            }
          } 
          if (pageType && pageType === "student") {
            if (decodedUser.role !== "student" && decodedUser.role !== "admin") {
              setAccess(false);
            }
          } else {
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        setUser(null);
      }
    }
  }, [access])


  return (
    <>
      <div className="flex">
        {sidebar}

        <div className={`flex flex-1 flex-col ${sidebar ? "lg:ml-72.5 " : ""} relative`}>
          {headerbar}

          <main>
            <div className="2xl:p-10 md:p-4 w-full">
              {user ?
                access ?
                  <div className="flex flex-col space-y-2 p-2">
                    <div className="flex gap-2 w-full shadow-xl rounded bg-white p-2">
                      {downloadComponent}
                      {searchComponent}
                    </div>
                    <div className="shadow-lg rounded p-2 bg-white">
                      {children}
                    </div>
                  </div>
                  :
                  <NotAuthorized domain={domain} />
                :
                <SessionExpired />
              }
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default DefaultLayout;
