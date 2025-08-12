'use client';
import DefaultLayout from "@/DefaultLayout";
import Sidebar from "@/section-h/Sidebar/Sidebar";
import Header from "@/section-h/Header/Header";
import { useState } from "react";
import { GetMenuAccounting } from "@/components/section-h/Sidebar/MenuAccounting";


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
          menuGroups={GetMenuAccounting()}
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


