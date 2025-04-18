'use client';
import SpecialtyCountAndLevelChart from "@/componentsTwo/SpecialtyCountAndLevelChart";
import CountChart from "@/componentsTwo/CountChart";
import UserCard from "@/componentsTwo/UserCard";
import { protocol } from "@/config";
import { GetDashCustomUserSexChartUrl, GetDashProfileSexChartUrl, GetDashSpecialtyLevelCountChartUrl, GetDashUserCardUrl } from "@/Domain/Utils-H/dashControl/dashConfig";
import { getData } from "@/functions";
import NotificationError from "@/section-h/common/NotificationError";
import DefaultLayout from "@/DefaultLayout";
import Sidebar from "@/section-h/Sidebar/Sidebar";
import { getMenuAdministration } from "@/section-h/Sidebar/MenuAdministration";
import Header from "@/section-h/Header/Header";
import { useState } from "react";


const List = ({
  children,
  params,
  searchParams,
}: {
  children: any,
  params: any;
  searchParams: any;
}) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const today = new Date()

  return (
    <DefaultLayout
      pageType='admin'
      domain={params?.domain}
      sidebar={
        <Sidebar
          params={params}
          menuGroups={getMenuAdministration(params)}
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


