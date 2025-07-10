'use client';
import DefaultLayout from "@/DefaultLayout";
import Sidebar from "@/section-s/Sidebar/Sidebar";
import { GetMenuAdministration } from "@/section-s/Sidebar/MenuAdministration";
import Header from "@/section-h/Header/Header";
import { useState } from "react";


const List = ({
  children,
  params,
}: {
  children: any,
  params: any;
  searchParams: any;
}) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  

  return (
    <DefaultLayout
      pageType='admin'
      domain={params?.domain}
      sidebar={
        <Sidebar
          params={params}
          menuGroups={GetMenuAdministration()}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      }
      headerbar={
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          searchComponent={
            <></>
          }
        />
      }
    >
      {children}
    </DefaultLayout>
  )
}

export default List


