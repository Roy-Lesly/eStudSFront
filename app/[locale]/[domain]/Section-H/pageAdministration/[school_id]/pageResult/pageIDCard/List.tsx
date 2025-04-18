'use client';

import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import ServerError from '@/ServerError';
import SearchMultiple from '@/section-h/Search/SearchMultiple';
import { EdgeLevel, EdgeSpecialty, EdgeTranscriptApplications, EdgeUserProfile } from '@/Domain/schemas/interfaceGraphql';
import { FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { FaRightLong } from 'react-icons/fa6';
import ExcelExporter from '@/ExcelExporter';
import MyTabs from '@/MyTabs';
import MessageModal from '@/componentsTwo/MessageModal';
import MyInputField from '@/MyInputField';
import { decodeUrlID } from '@/functions';

const List = ({ params, data, dataExtra, searchParams }: { params: any, dataExtra: any; data: any, searchParams: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [level, setLevel] = useState<number>(0);
  const [academicYear, setAcademicYear] = useState<string>('');


  const Columns: TableColumn<EdgeSpecialty>[] = [
    { header: "#", align: "center", render: (_item: EdgeSpecialty, index: number) => index + 1, },
    { header: "Class", accessor: "node.mainSpecialty.specialtyName", align: "left" },
    { header: "Level", accessor: "node.level.level", align: "center" },
    { header: "Year", accessor: "node.academicYear", align: "center" },
    {
      header: "Action", align: "center", hideColumn: activeTab > 0 ? true : false,
      render: (item) => <button
        onClick={() => router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pageIDCard/${item.node.id}`)}
        className='flex items-center justify-center w-full'
      >
        <FaRightLong color="green" size={21} />
      </button>,
    },
  ];

  useEffect(() => {
    let q = searchParams
    if (level && academicYear) {
      q["level"] = level
      q["academicYear"] = academicYear
    } else if (level) {
      q["level"] = level
    } else if (academicYear) {
      q["academicYear"] = academicYear
    }
    const query = new URLSearchParams(q).toString();
    router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pageIDCard?${query}`)
  }, [level, academicYear])

  return (
    <DefaultLayout
      pageType='admin'
      domain={params.domain}
      searchComponent={
        <SearchMultiple
          names={['specialtyName']}
          link={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pageIDCard`}
          extraSearch={searchParams}
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
      <Breadcrumb
        department="Student ID Card"
        subRoute="List"
        pageName="Student ID Card"
        mainLink={`${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pageTranscript`}
      />

      <div className="bg-gray-50 flex flex-col gap-2 items-center justify-center w-full">

        <div className='flex flex-row gap-2 w-full'>
          <MyInputField
            id=""
            name=""
            value={searchParams?.level ? decodeUrlID(dataExtra?.allLevels?.edges?.filter((item: EdgeLevel) => decodeUrlID(item.node.id) === searchParams?.level)[0]?.node?.id) : level.toString()}
            label=""
            placeholder="Select Level"
            onChange={(e) => setLevel(parseInt(e.target.value))}
            type='select'
            options={dataExtra?.allLevels?.edges?.map((item: EdgeLevel) => { return { id: parseInt(decodeUrlID(item.node.id)), name: item.node.level } })}
          />
          <MyInputField
            id=""
            name=""
            value={searchParams?.academicYear ? searchParams?.academicYear : academicYear}
            label=""
            placeholder="Select Academic Year"
            onChange={(e) => setAcademicYear(e.target.value)}
            type='select'
            options={dataExtra?.allAcademicYears}
          />
        </div>

        {data ?
          <MyTableComp
            data={data.allSpecialties?.edges}
            columns={Columns}
          />
          :
          searchParams ?
            <ServerError type="network" item="ID Card" />
            :
            <ServerError type="notFound" item="ID Card" />
        }


      </div>
    </DefaultLayout>
  );
};

export default List;



const Table = ({ data, columns }: { data: any, columns: any }) => {

  return <div className='flex flex-col gap-2 items-center justify-center w-full'>
    <MyTableComp
      data={data}
      columns={columns}
    />
  </div>
}