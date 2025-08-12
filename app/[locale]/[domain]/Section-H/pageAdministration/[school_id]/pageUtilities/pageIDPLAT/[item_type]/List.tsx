'use client';

import React, { useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import SearchMultiple from '@/section-h/Search/SearchMultiple';
import { EdgeSchoolHigherInfo, EdgeTransactions } from '@/Domain/schemas/interfaceGraphql';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { FaRightLong } from 'react-icons/fa6';
import ServerError from '@/ServerError';
import { useTranslation } from 'react-i18next';
import { FaMoneyBillWave } from 'react-icons/fa';
import PaymentIDPLATTransaction from '@/components/componentsTwo/formsAdmin/PaymentIDPLATTransaction';


export const metadata: Metadata = {
  title: "ID Card Page",
  description: "e-conneq School System. ID Card Page Admin Settings",
};

const List = ({ p, data, sp, school }: { p: any; data: EdgeTransactions[], sp: any, school: EdgeSchoolHigherInfo }) => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<"single" | "multiple">();
  const [selectedFees, setSelectedFees] = useState<EdgeTransactions | null>(null);

  const Columns: TableColumn<EdgeTransactions>[] = [
    { header: "#", align: "center", render: (_item: EdgeTransactions, index: number) => index + 1, },
    { header: `${t("Matricle")}`, accessor: "node.schoolfees.userprofile.customuser.matricle", align: "left" },
    { header: `${t("Full Name")}`, accessor: "node.schoolfees.userprofile.customuser.fullName", align: "left" },
    { header: `${t("Class")}`, accessor: "node.schoolfees.userprofile.specialty.mainSpecialty.specialtyName", align: "left" },
    {
      header: `${t("Year / Level")}`, align: "left", render: (item) => <button
        className=""
      >
        {item.node?.schoolfees?.userprofile?.specialty.academicYear} / {item.node?.schoolfees?.userprofile?.specialty?.level.level}
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
          className='flex items-center gap-3 rounded-xl py-2 px-6 bg-blue-200 font-semibold text-lg'
          onClick={() => { setModalOpen("multiple"); }}
        >
          <FaMoneyBillWave size={20} /> Pay All
        </button>}
      />

      <div className="bg-gray-50 flex flex-col gap-2 items-center justify-center w-full">

        {data ?
          <MyTableComp
            data={
              data.sort((a: EdgeTransactions, b: EdgeTransactions) => {
                const academicYearA = a.node?.schoolfees?.userprofile?.specialty?.academicYear;
                const academicYearB = b.node?.schoolfees?.userprofile?.specialty?.academicYear;
                const fullNameA = a.node?.schoolfees?.userprofile?.customuser.fullName.toLowerCase();
                const fullNameB = b.node?.schoolfees?.userprofile?.customuser.fullName.toLowerCase();

                if (academicYearA > academicYearB) return -1;
                if (academicYearA < academicYearB) return 1;

                return fullNameA.localeCompare(fullNameB);
              })}
            columns={Columns}
          />
          :
          <ServerError type="network" item="ID cards" />
        }

        {(modalOpen === "single" && selectedFees) || modalOpen === "multiple" ?
          <PaymentIDPLATTransaction
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