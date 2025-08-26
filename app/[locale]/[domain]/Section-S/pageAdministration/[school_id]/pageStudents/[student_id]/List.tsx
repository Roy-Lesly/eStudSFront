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
import { EdgeResultSecondary, EdgeSchoolFeesSec } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import { RefreshCcw } from 'lucide-react';
import { mutationCreateUpdateSchoolfees } from '@/utils/graphql/mutations/mutationCreateUpdateSchoolfees';


const List = ({ p, data, sp }: { p: any; data: any, sp: any }) => {
  const { t } = useTranslation();
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode<JwtPayload>(token) : null;

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(parseInt(sp?.tab) || 0);
  const hasMark = hasAnyMarks(data?.allResults?.edges);

  const createSchoolFees = async () => {
    try {
      const resId = await mutationCreateUpdateSchoolfees({
        section: "S",
        formData: {
          userprofilesecId: parseInt(decodeUrlID(p?.student_id)),
          // userprofilesecId: (decodeUrlID(p?.student_id)),
          delete: false,
        },
        p,
        router: null,
        routeToLink: "",
      })

      if (resId.length > 5) {
        alert(t("Operation Successful") + " " + `✅`)
        window.location.reload();
      }
    } catch (error) {
      errorLog(error);
    }
  }

  return (
    <DefaultLayout
      pageType='admin'
      domain={p.domain}
      searchComponent={null}
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
          searchComponent={null}
        />
      }
    >

      <div className="bg-slate-100 mx-auto rounded shadow w-full gap-4">
        {data ?
          data.allSchoolFeesSec?.edges.length ?
            <MyTabs
              tabs={[
                {
                  label: t("Info"),
                  content: <Info
                    searchParams={sp}
                    data={data.allSchoolFeesSec.edges.filter((item: EdgeSchoolFeesSec) => decodeUrlID(item.node.userprofilesec.id) === decodeUrlID(p.student_id))[0]}
                    params={p}
                    hasMark={hasMark}
                  />
                },
                {
                  label: t("Classes"),
                  content: <Classes data={data?.allSchoolFeesSec?.edges} params={p} />
                },
                ...(user?.is_staff || user?.page.map((item: string) => item.toUpperCase()).includes("FEES") ?
                  [
                    {
                      label: t("Fees"),
                      content: <Fees
                        p={p}
                        schoolFeesSec={data?.allSchoolFeesSec?.edges.length ? data?.allSchoolFeesSec?.edges[0].node : null}
                        data={data.allSchoolFeesSec?.edges.filter((item: EdgeSchoolFeesSec) => decodeUrlID(item.node.userprofilesec.id) === decodeUrlID(p.student_id))[0]}
                      />
                    }
                  ] : []),
                ...(user?.is_staff || user?.page.map((item: string) => item.toUpperCase()).includes("MORATOIRE") ?
                  [
                    {
                      label: t("Moratoire"),
                      content: <Moratoire
                        results={data.allResultsSec?.edges.sort((a: EdgeResultSecondary, b: EdgeResultSecondary) => {
                          const aName = a?.node?.subjectsec?.mainsubject?.subjectName || '';
                          const bName = b?.node?.subjectsec?.mainsubject?.subjectName || '';
                          return aName.localeCompare(bName);
                        })}
                        data={data?.allSchoolFeesSec?.edges.filter((item: EdgeSchoolFeesSec) => decodeUrlID(item.node.userprofilesec.id) === decodeUrlID(p.student_id))[0]}
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
                        fees={data.allSchoolFeesSec?.edges.filter((item: EdgeSchoolFeesSec) => decodeUrlID(item.node.userprofilesec.id) === decodeUrlID(p.student_id))[0]}
                        data={data.allResultsSec?.edges.sort((a: EdgeResultSecondary, b: EdgeResultSecondary) => {
                          const aName = a?.node?.subjectsec?.mainsubject?.subjectName || '';
                          const bName = b?.node?.subjectsec?.mainsubject?.subjectName || '';
                          return aName.localeCompare(bName);
                        })} />
                    }
                  ] : []),
              ]}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              source={`Section-S/pageAdministration/${p.school_id}/pageStudents/${p.student_id}/?user=${sp?.user}`}
            />
            :
            <div>
              <ServerError type="notFound" item={t("Student Info")} />
              <span className='flex items-center justify-center pb-4'>
                <button
                  className='flex font-semibold text-lg text-red gap-2'
                  onClick={() => createSchoolFees()}
                >
                  {t("Check School Fees")} <RefreshCcw color='blue' size={30} fontSize={20} fontWeight={3} />
                </button>
              </span>

            </div>
          :
          <ServerError type="network" item='' />}
      </div>
    </DefaultLayout>
  );
};

export default List;


function hasAnyMarks(results: EdgeResultSecondary[]) {
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