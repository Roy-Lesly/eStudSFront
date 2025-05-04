'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import DefaultLayout from '@/DefaultLayout';
import SearchMultiple from '@/section-h/Search/SearchMultiple';
import MyTabs from '@/MyTabs';
import ServerError from '@/ServerError';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { EdgePreInscription } from '@/Domain/schemas/interfaceGraphql';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import ButtonAction from '@/section-h/Buttons/ButtonAction';
import { FaArrowRightLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';


const List = ({ params, data, dataPending }: { params: any; data: any, dataPending: any, searchParams: any }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(0);


  const Columns: TableColumn<EdgePreInscription>[] = [
    { header: "#", align: "center", responsiveHidden: true, render: (_item: EdgePreInscription, index: number) => index + 1, },
    { header: `${t("Registration N°")}`, accessor: "node.registrationNumber", align: "left", responsiveHidden: true },
    { header: `${t("Full Name")}`, accessor: "node.fullName", align: "left" },
    { header: `${t("Gender")}`, accessor: "node.sex", align: "center", responsiveHidden: true },
    { header: `${t("Address")}`, accessor: "node.address", align: "center", responsiveHidden: true },
    { header: "Campus", accessor: "node.campus", align: "center", responsiveHidden: true },
    { header: "Telephone", accessor: "node.telephone", align: "center", responsiveHidden: true },
    {
      header: `${t("View")}`, align: "center", responsiveHidden: true,
      render: (item) => <button
        className="gap-2 items-center justify-center p-1 rounded-full x-row"
      >
        {activeTab === 0 || activeTab === 2 ? <div className='flex flex-row gap-2'>
          <ButtonAction data={item} type='edit' action={() => { }} />
          <ButtonAction data={item} type='delete' action={() => { }} />
        </div>
          :
          (activeTab === 1) ? <div className='flex flex-row gap-2'>
            <span>{t("Admitted")}</span>
          </div> : null}
      </button>,
    },
    {
      header: "Admit", align: "center", hideColumn: activeTab == 1 ? true : false, render: (item) => <button
        className="bg-green-400 gap-2 items-center justify-center p-2 rounded-full"
        onClick={() => router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/pageAdmission/?id=${item.node.id}`)}
      >
        <FaArrowRightLong size={22} color='black' />
      </button>,
    },
  ];

  return (
    <DefaultLayout
      pageType='admin'
      domain={params.domain}
      searchComponent={
        <SearchMultiple
          names={["fullName", "registrationNumber"]}
          link={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/PreInscription`}
          select={[
            { type: 'select', name: 'academicYear', dataSelect: dataPending?.allAcademicYears },
          ]}
        />
      }
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

      <div className="bg-gray-50 mt-10 flex flex-col items-center justify-center">
        {data && dataPending && data.allSchoolInfos?.edges.length ? <MyTabs
          tabs={[
            {
              label: `${('Pending')}`, content: dataPending?.allPreinscriptions?.edges.length ?
                <MyTableComp
                  data={
                    dataPending?.allPreinscriptions?.edges.filter((i: EdgePreInscription) => i.node.campus.toUpperCase().replace("-", "_") === data.allSchoolInfos.edges[0].node.campus.toUpperCase().replace("-", "_"))
                      .sort((a: EdgePreInscription, b: EdgePreInscription) => {
                        const fullNameNameA = a.node.fullName.toLowerCase();
                        const fullNameNameB = b.node.fullName.toLowerCase();
                        const registrationNumberA = a.node.registrationNumber;
                        const registrationNumberB = b.node.registrationNumber;
                        if (fullNameNameA > fullNameNameB) return 1;
                        if (fullNameNameA < fullNameNameB) return -1;
                        if (registrationNumberA > registrationNumberB) return 1;
                        if (registrationNumberA < registrationNumberB) return -1;
                      })}
                  columns={Columns}
                />
                :
                <ServerError type="notFound" item={t("Pending")} />
            },
            {
              label: `${('Admitted')}`, content: data?.allPreinscriptions?.edges.length ?
                <MyTableComp
                  data={
                    data?.allPreinscriptions?.edges.filter((i: EdgePreInscription) => i.node.campus.toUpperCase().replace("-", "_") === data.allSchoolInfos.edges[0].node.campus.toUpperCase().replace("-", "_")).sort((a: EdgePreInscription, b: EdgePreInscription) => {
                      const fullNameNameA = a.node.fullName.toLowerCase();
                      const fullNameNameB = b.node.fullName.toLowerCase();
                      const registrationNumberA = a.node.registrationNumber;
                      const registrationNumberB = b.node.registrationNumber;
                      if (fullNameNameA > fullNameNameB) return 1;
                      if (fullNameNameA < fullNameNameB) return -1;
                      if (registrationNumberA > registrationNumberB) return 1;
                      if (registrationNumberA < registrationNumberB) return -1;
                    })}
                  columns={Columns}
                />
                :
                <ServerError type="notFound" item={t("Admitted")} />
            },
            {
              label: `${t("Other Campus")}`, content: data?.allPreinscriptions?.edges.length ?
                <MyTableComp
                  data={
                    dataPending?.allPreinscriptions?.edges.filter((i: EdgePreInscription) => i.node.campus.toUpperCase().replace("-", "_") !== data.allSchoolInfos.edges[0].node.campus.toUpperCase().replace("-", "_"))
                      .sort((a: EdgePreInscription, b: EdgePreInscription) => {
                        const fullNameNameA = a.node.fullName.toLowerCase();
                        const fullNameNameB = b.node.fullName.toLowerCase();
                        const registrationNumberA = a.node.registrationNumber;
                        const registrationNumberB = b.node.registrationNumber;
                        if (fullNameNameA > fullNameNameB) return 1;
                        if (fullNameNameA < fullNameNameB) return -1;
                        if (registrationNumberA > registrationNumberB) return 1;
                        if (registrationNumberA < registrationNumberB) return -1;
                      })}
                  columns={Columns}
                />
                :
                <ServerError type="notFound" item={t("Admitted")} />
            },
          ]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
          :
          <ServerError type="network" item="PreInscription" />
        }



      </div>
    </DefaultLayout>
  );
};

export default List;
