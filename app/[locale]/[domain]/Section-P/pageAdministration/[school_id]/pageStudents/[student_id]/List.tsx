'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-s/Sidebar/Sidebar';
import Header from '@/section-s/Header/Header';
import { decodeUrlID } from '@/functions';
import Info from './Info';
import Fees from './Fees';
import Results from './Results';
import Classes from './Classes';
import DefaultLayout from '@/DefaultLayout';
import { GetMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import MyTabs from '@/MyTabs';
import { jwtDecode } from 'jwt-decode';
import Moratoire from './Moratoire';
import { useTranslation } from 'react-i18next';
import { JwtPayload } from '@/serverActions/interfaces';
import ServerError from '@/ServerError';
import { errorLog } from '@/utils/graphql/GetAppolloClient';
import { EdgeResultPrimary, EdgeSchoolFeesPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';


const List = ({ p, data, sp }: { p: any; data: any, sp: any }) => {
  console.log(data);
  // console.log(sp);
  const { t } = useTranslation();
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode<JwtPayload>(token) : null;

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(parseInt(sp?.tab) || 0);
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

      <div className="bg-gray-50 flex flex-col items-center justify-center">
        <div className="bg-white mt-2 mx-auto rounded shadow w-full">
          {data ?
            data.allSchoolFeesPrim ?
              <MyTabs
                tabs={[
                  {
                    label: t("Info"),
                    content: <Info
                      searchParams={sp}
                      data={data.allSchoolFeesPrim.edges.filter((item: EdgeSchoolFeesPrim) => decodeUrlID(item.node.userprofileprim.id) === decodeUrlID(p.student_id))[0]}
                      params={p}
                      hasMark={hasMark}
                    />
                  },
                  {
                    label: t("Classes"),
                    content: <Classes data={data?.allSchoolFeesPrim?.edges} params={p} />
                  },
                  ...(user?.is_staff || user?.page.map((item: string) => item.toUpperCase()).includes("FEES") ?
                    [
                      {
                        label: t("Fees"),
                        content: <Fees
                          p={p}
                          schoolFeesPrim={data?.allSchoolFeesPrim?.edges.length ? data?.allSchoolFeesPrim?.edges[0].node : null}
                          data={data.allSchoolFeesPrim?.edges.filter((item: EdgeSchoolFeesPrim) => decodeUrlID(item.node.userprofileprim.id) === decodeUrlID(p.student_id))[0]}
                        />
                      }
                    ] : []),
                  ...(user?.is_staff || user?.page.map((item: string) => item.toUpperCase()).includes("MORATOIRE") ?
                    [
                      {
                        label: t("Moratoire"),
                        content: <Moratoire
                          results={data.allResultsPrim?.edges.sort((a: EdgeResultPrimary, b: EdgeResultPrimary) => {
                            const aName = a?.node?.subjectprim?.mainsubjectprim?.subjectName || '';
                            const bName = b?.node?.subjectprim?.mainsubjectprim?.subjectName || '';
                            return aName.localeCompare(bName);
                          })}
                          data={data?.allSchoolFeesPrim?.edges.filter((item: EdgeSchoolFeesPrim) => decodeUrlID(item.node.userprofileprim.id) === decodeUrlID(p.student_id))[0]}
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
                          fees={data.allSchoolFeesPrim?.edges.filter((item: EdgeSchoolFeesPrim) => decodeUrlID(item.node.userprofileprim.id) === decodeUrlID(p.student_id))[0]}
                          data={data.allResultsPrim?.edges.sort((a: EdgeResultPrimary, b: EdgeResultPrimary) => {
                            const aName = a?.node?.subjectprim?.mainsubjectprim?.subjectName || '';
                            const bName = b?.node?.subjectprim?.mainsubjectprim?.subjectName || '';
                            return aName.localeCompare(bName);
                          })} />
                      }
                    ] : []),
                ]}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                source={`Section-P/pageAdministration/${p.school_id}/pageStudents/${p.student_id}?`}
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


function hasAnyMarks(results: EdgeResultPrimary[]) {
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