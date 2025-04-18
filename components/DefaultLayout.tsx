"use client";

import { JwtPayload } from "@/serverActions/interfaces";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import SessionExpired from "./SessionExpired";
import NotAuthorized from "./NotAuthorized";

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
  pageType?: "admin" | "lecturer" | "student";
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
          } if (pageType && pageType === "lecturer") {
            if (decodedUser.role === "student") {
              setAccess(false);
            }
          } else {
            // setUser(decodedToken);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        setUser(null);
      }
    }
  }, [])



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
                  <>
                    <div className="flex gap-2 w-full">
                      {downloadComponent}
                      {searchComponent}
                    </div>
                    {children}
                  </>
                  :
                  <NotAuthorized domain={domain} />
                :
                <SessionExpired domain={domain} />
              }
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default DefaultLayout;
