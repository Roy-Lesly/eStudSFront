'use client';

import React, { useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import SearchMultiple from '@/Search/SearchMultiple';
import { EdgeSchoolFees, EdgeSchoolHigherInfo } from '@/Domain/schemas/interfaceGraphql';
import MyTableComp from '@/components/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { FaRightLong } from 'react-icons/fa6';
import ServerError from '@/ServerError';
import { useTranslation } from 'react-i18next';
import { FaMoneyBillWave } from 'react-icons/fa';
import PaymentIDPLAT from '@/components/componentsTwo/formsAdmin/PaymentIDPLAT';


export const metadata: Metadata = {
  title: "ID Card Page",
  description: "e-conneq School System. ID Card Page Admin Settings",
};

const List = ({ p, data, sp, school }: { p: any; data: EdgeSchoolFees[], sp: any, school: EdgeSchoolHigherInfo }) => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<"single" | "multiple">();
  const [selectedFees, setSelectedFees] = useState<EdgeSchoolFees | null>(null);

  const Columns: TableColumn<EdgeSchoolFees>[] = [
    { header: "#", align: "center", render: (_item: EdgeSchoolFees, index: number) => index + 1, },
    { header: `${t("Matricle")}`, accessor: "node.userprofile.customuser.matricle", align: "left" },
    { header: `${t("Full Name")}`, accessor: "node.userprofile.customuser.fullName", align: "left" },
    { header: `${t("Class")}`, accessor: "node.userprofile.specialty.mainSpecialty.specialtyName", align: "left" },
    {
      header: `${t("Year / Level")}`, align: "left", render: (item) => <button
        className=""
      >
        {item.node?.userprofile?.specialty.academicYear} / {item.node?.userprofile?.specialty?.level.level}
      </button>,
    },
    {
      header: `${t("View")}`, align: "center",
      render: (item) => <button
        onClick={() => { setModalOpen("single"); setSelectedFees(item) }}
        className="bg-green-200 p-2 rounded-full"
      >
        <FaRightLong color="green" size={21} />
      </button>,
    },
  ];

  return (
    <DefaultLayout
      pageType='admin'
      domain={p.domain}
      //   downloadComponent={<ExcelExporter
      //     data={data ? data : []}
      //     title="ClassList"
      //     type="EdgeTransactions"
      //     page="list_transactions"
      //     searchParams={sp}
      //   />}
      searchComponent={
        <SearchMultiple
          names={['fullName', 'specialtyName', 'level', 'academicYear']}
          link={`/${p.domain}/Section-H/pageAdministration/${p.school_id}/pageUtilities/pageIDPLAT/${p.item_type}`}
          select={[
            // { type: 'select', name: 'sex', dataSelect: ['MALE', 'FEMALE'] },
            // { type: 'select', name: 'academicYear', dataSelect: data?.allAcademicYears },
          ]}
        />
      }
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
          searchComponent={
            <></>
          }
        />
      }
    >
      <Breadcrumb
        department={t(p?.item_type)}
        subRoute="List"
        pageName={t(p?.item_type) + " PAGE"}
        component={<button
          className='flex gap-2 rounded-xl py-2 px-6 bg-blue-200 font-semibold text-lg'
          onClick={() => { setModalOpen("multiple"); }}
        >
          <FaMoneyBillWave size={20} /> Pay All
        </button>}
      />

      <div className="bg-gray-50 flex flex-col gap-2 items-center justify-center w-full">

        {data ? (
          data.length ? (
            <MyTableComp
              data={
                data.sort((a: EdgeSchoolFees, b: EdgeSchoolFees) => {
                  const academicYearA = a.node?.userprofile?.specialty?.academicYear;
                  const academicYearB = b.node?.userprofile?.specialty?.academicYear;
                  const fullNameA = a.node?.userprofile?.customuser.fullName.toLowerCase();
                  const fullNameB = b.node?.userprofile?.customuser.fullName.toLowerCase();

                  if (academicYearA > academicYearB) return -1;
                  if (academicYearA < academicYearB) return 1;

                  return fullNameA.localeCompare(fullNameB);
                })}
              columns={Columns}
            />
          ) : (
            <ServerError type="notFound" item="ID cards" />
          )
        ) : (
          <ServerError type="network" item="ID cards" />
        )}

        {(modalOpen === "single" && selectedFees) || modalOpen === "multiple" ?
          <PaymentIDPLAT
            source={"admin"}
            setModalOpen={setModalOpen}
            data={
              modalOpen === "single"
                ? selectedFees
                  ? [selectedFees]
                  : []
                : data
            }
            title={modalOpen}
            p={p}
            school={school.node}
          />
          :
          null}


      </div>
    </DefaultLayout>
  );
};

export default List;