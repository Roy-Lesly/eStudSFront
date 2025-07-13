'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { decodeUrlID } from '@/functions';
import { Metadata } from 'next';
import Info from './Info';
import Fees from './Fees';
import Results from './Results';
import Classes from './Classes';
import DefaultLayout from '@/DefaultLayout';
import { EdgeResult, EdgeSchoolFees } from '@/Domain/schemas/interfaceGraphql';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import MyTabs from '@/MyTabs';
import { jwtDecode } from 'jwt-decode';
import Moratoire from './Moratoire';
import { useTranslation } from 'react-i18next';
import { JwtPayload } from '@/serverActions/interfaces';
import ServerError from '@/ServerError';
import { errorLog } from '@/utils/graphql/GetAppolloClient';


export const metadata: Metadata = {
  title: "Main-Subject Page",
  description: "This is Main-Subject Page Admin Settings",
};

const List = ({ p, data, s }: { p: any; data: any, s: any }) => {
  const { t } = useTranslation();
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode<JwtPayload>(token) : null;

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(0);
  const hasMark = hasAnyMarks(data?.allResults?.edges);

  return (
    <DefaultLayout
      pageType='admin'
      domain={p.domain}
      searchComponent={<></>}
      sidebar={
        <Sidebar
          params={p}
          menuGroups={GetMenuAdministration()}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      }
      headerbar={
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          searchComponent={<></>}
        />
      }
    >
      <Breadcrumb
        department={t("Details")}
        subRoute={t("List")}
        pageName={t("Student Details")}
        mainLink={`${p.domain}/Section-H/pageAdministration/${p.school_id}/Settings/Students/${p.profile_id}`}
        subLink={`${p.domain}/Section-H/pageAdministration/${p.school_id}/Settings/Students/${p.profile_id}`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">
        <div className="bg-white mt-2 mx-auto rounded shadow w-full">
          {data ?
            data.allSchoolFees ?
              <MyTabs
                tabs={[
                  {
                    label: t("Info"),
                    content: <Info
                      searchParams={s}
                      data={data.allSchoolFees.edges.filter((item: EdgeSchoolFees) => decodeUrlID(item.node.userprofile.id) === decodeUrlID(p.student_id))[0]}
                      params={p}
                      hasMark={hasMark}
                    />
                  },
                  {
                    label: t("Classes"),
                    content: <Classes data={data?.allSchoolFees?.edges} params={p} />
                  },
                  ...(user?.is_staff || user?.page.map((item: string) => item.toUpperCase()).includes("FEES") ?
                    [
                      {
                        label: t("Fees"),
                        content: <Fees
                          p={p}
                          schoolFees={data?.allSchoolFees?.edges.length ? data?.allSchoolFees?.edges[0].node : null}
                          data={data.allSchoolFees?.edges.filter((item: EdgeSchoolFees) => decodeUrlID(item.node.userprofile.id) === decodeUrlID(p.student_id))[0]}
                        />
                      }
                    ] : []),
                  ...(user?.is_staff || user?.page.map((item: string) => item.toUpperCase()).includes("MORATOIRE") ?
                    [
                      {
                        label: t("Moratoire"),
                        content: <Moratoire
                          results={data.allResults?.edges.sort((a: EdgeResult, b: EdgeResult) => a.node.course.mainCourse.courseName > b.node.course.mainCourse.courseName ? 1 : a.node.course.mainCourse.courseName < b.node.course.mainCourse.courseName ? -1 : 0)}
                          data={data?.allSchoolFees?.edges.filter((item: EdgeSchoolFees) => decodeUrlID(item.node.userprofile.id) === decodeUrlID(p.student_id))[0]}
                          params={p}
                        />
                      },
                    ] : []),
                  ...(user?.is_staff || user?.page.map((item: string) => item.toUpperCase()).includes("RESULT") ?
                    [
                      {
                        label: t("Results"),
                        content: <Results
                          params={p}
                          fees={data.allSchoolFees?.edges.filter((item: EdgeSchoolFees) => decodeUrlID(item.node.userprofile.id) === decodeUrlID(p.student_id))[0]}
                          data={data.allResults?.edges.sort((a: EdgeResult, b: EdgeResult) => a.node.course.mainCourse.courseName > b.node.course.mainCourse.courseName ? 1 : a.node.course.mainCourse.courseName < b.node.course.mainCourse.courseName ? -1 : 0)}
                        />
                      }
                    ] : []),
                ]}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                source={`/${p.locale}/${p.domain}/Section-S/pageAdministration/${p.school_id}/pageStudents/${p.student_id}`}
              />
              :
              <ServerError type="notFound" item={t("Student Info")} />
            :
            <ServerError type="network" item='' />}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default List;


function hasAnyMarks(results: EdgeResult[]) {
  if (!results) return false;
  return results?.some(result => {
    try {
      const info = JSON.parse(result?.node.infoData);
      return (
        info.hasOwnProperty("ca") ||
        info.hasOwnProperty("exam") ||
        info.hasOwnProperty("average")
      );
    } catch (e) {
      errorLog(result?.node.infoData);
      return false;
    }
  });
}