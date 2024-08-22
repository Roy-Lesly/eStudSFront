'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-s/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import DefaultLayout from '@/DefaultLayout';
import SearchMultiple from '@/Search/SearchMultiple';
import MyTabs from '@/MyTabs';
import ServerError from '@/ServerError';
import MyTableComp from '@/components/Table/MyTableComp';
import { EdgePreInscription } from '@/Domain/schemas/interfaceGraphql';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import ButtonAction from '@/Buttons/ButtonAction';
import { FaArrowRightLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { decodeUrlID } from '@/utils/functions';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';


const List = (
  { params, dataYears, dataPending, sp }:
    { params: any, dataYears: string[], dataPending: EdgePreInscription[], sp: any }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(sp?.tab || 0);

  const Columns: TableColumn<EdgePreInscription>[] = [
    { header: "#", align: "center", responsiveHidden: true, render: (_item: EdgePreInscription, index: number) => index + 1, },
    { header: `${t("Registration N°")}`, accessor: "node.registrationNumber", align: "left", responsiveHidden: true },
    { header: `${t("Full Name")}`, accessor: "node.fullName", align: "left" },
    { header: `${t("Gender")}`, accessor: "node.sex", align: "center", responsiveHidden: true },
    { header: `${t("Address")}`, accessor: "node.address", align: "center", responsiveHidden: true },
    { header: "Campus", accessor: "node.campus.campus", align: "center", responsiveHidden: true },
    { header: "Telephone", accessor: "node.fatherTelephone", align: "center", responsiveHidden: true },
    {
      header: `${t("View")}`, align: "center", responsiveHidden: true,
      render: (item) => <div
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
      </div>,
    },
    {
      header: "Admit", align: "center", hideColumn: activeTab == 1 ? true : false, render: (item) => <button
        className="bg-green-400 gap-2 items-center justify-center p-2 rounded-full"
        onClick={() => router.push(`/${params.domain}/Section-S/pageAdministration/${params.school_id}/pageStudents/pageAdmission/?preId=${item.node.id}`)}
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
          link={`/${params.domain}/Section-S/pageAdministration/${params.school_id}/pageStudents/PreInscription`}
          select={[
            { type: 'select', name: 'academicYear', dataSelect: dataYears },
          ]}
        />
      }
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

      <div className="bg-gray-50 flex flex-col items-center justify-center gap-2">

        <div className='flex justify-end items-center w-full'>

          <Link
            className='w-1/2 md:w-1/4 rounded-lg shadow-lg bg-teal-100 px-4 py-2 cursor-pointer flex items-center justify-center gap-2 font-bold text-xl'
            href={`/${params.locale}/${params.domain}/Section-S/pageAdministration/${params.school_id}/pageStudents/pageNewPreinscription`}
          >
            <span>{t("New Student")}</span>
            <button className='bg-green-500 p-1 rounded-full'><FaPlus size={25} color="white" /></button>
          </Link>
        </div>

        {dataPending ? <MyTabs
          tabs={[
            {
              label: `${t("Pending")}`, content: dataPending?.length ?
                <MyTableComp
                  data={
                    dataPending.filter((i: EdgePreInscription) => decodeUrlID(i.node.campus.id) === params.school_id)
                      .sort((a: EdgePreInscription, b: EdgePreInscription) => {
                        const fullNameNameA = a.node.fullName.toLowerCase();
                        const fullNameNameB = b.node.fullName.toLowerCase();
                        const registrationNumberA = a.node.registrationNumber;
                        const registrationNumberB = b.node.registrationNumber;
                        if (fullNameNameA > fullNameNameB) return 1;
                        if (fullNameNameA < fullNameNameB) return -1;
                        if (registrationNumberA > registrationNumberB) return 1;
                        if (registrationNumberA < registrationNumberB) return -1;
                        return 0;
                      })}
                  columns={Columns}
                />
                :
                <ServerError type="notFound" item={t("Pending")} />
            },
            {
              label: `${t("Other Campus")}`, content: dataPending?.length ?
                <MyTableComp
                  data={
                    dataPending.filter((i: EdgePreInscription) => decodeUrlID(i.node.campus.id) !== params.school_id)
                      .sort((a: EdgePreInscription, b: EdgePreInscription) => {
                        const fullNameNameA = a.node?.fullName?.toLowerCase();
                        const fullNameNameB = b.node.fullName?.toLowerCase();
                        const registrationNumberA = a.node?.registrationNumber;
                        const registrationNumberB = b.node?.registrationNumber;
                        if (fullNameNameA > fullNameNameB) return 1;
                        if (fullNameNameA < fullNameNameB) return -1;
                        if (registrationNumberA > registrationNumberB) return 1;
                        if (registrationNumberA < registrationNumberB) return -1;
                        return 0;
                      })}
                  columns={Columns}
                />
                :
                <ServerError type="notFound" item={t("Admitted")} />
            },
          ]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          source={`Section-S/pageAdministration/${params.school_id}/pageStudents/PreInscription/?`}
        />
          :
          <ServerError type="network" item="PreInscription" />
        }



      </div>

    </DefaultLayout>
  );
};

export default List;
