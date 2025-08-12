'use client';

import React, { useState } from 'react'; // Importing icons
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-p/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { useTranslation } from 'react-i18next';
import { EdgeClassRoomPrim, NodeClassRoomPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';
import { ArrowLeft, ArrowRight } from 'lucide-react';


const List = (
  { params, data, searchParams }:
    { params: any; data: any, searchParams: any }
) => {

  const { t } = useTranslation("common");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [myClasses, setMyClasses] = useState<NodeClassRoomPrim[]>(data?.allCustomusers?.edges[0].node?.classroomprim || [])
  const [allClasses, setAllClasses] = useState<NodeClassRoomPrim[]>(data?.allClassroomsPrim?.edges?.map((ce: EdgeClassRoomPrim) => ce.node))

  const getColumnsWithActions = (
    type: "my" | "all",
    onAdd: (item: NodeClassRoomPrim) => void,
    onRemove: (item: NodeClassRoomPrim) => void,
    myClassIds: string[]
  ): TableColumn<NodeClassRoomPrim>[] => [
      {
        header: `${t("Year")}`,
        accessor: "academicYear",
        hideColumn: type === "all",
        align: "left",
      },
      {
        header: `${t("Class")}`,
        accessor: "level",
        align: "left",
      },
      {
        header: `${t("Action")}`,
        accessor: "id",
        align: "center",
        render: (item: NodeClassRoomPrim) => {
          if (type === "all") {
            const alreadyAdded = myClassIds.includes(item.id);
            return (
              <button
                className={`w-full ${alreadyAdded ? "opacity-50" : "font-semibold text-xl rounded-xl px-4 py-1 bg-blue-100"} flex justify-center items-center text-blue-800 hover:underline`}
                onClick={() => onAdd(item)}
                disabled={alreadyAdded}
              >
                <ArrowLeft size={26} className="mr-2" />
                {alreadyAdded ? t("Added") : t("Add")}

              </button>
            );
          } else if (type === "my") {
            return (
              <button
                className="w-full justify-center bg-red rounded-lg py-1 px-4 font-semibold text-lg text-white items-center flex hover:underline"
                onClick={() => onRemove(item)}
              >
                {t("Remove")}
                <ArrowRight className="h-6 w-6 ml-2" />
              </button>
            );
          }
        },
      },
    ];

  const handleAddToMyClasses = (item: NodeClassRoomPrim) => {
    if (!myClasses.some(c => c.id === item.id)) {
      setMyClasses([...myClasses, item]);
    }
  };

  const handleRemoveFromMyClasses = (item: NodeClassRoomPrim) => {
    setMyClasses(myClasses.filter(c => c.id !== item.id));
  };

  const ColumnsMyClasses = getColumnsWithActions("my", handleAddToMyClasses, handleRemoveFromMyClasses, myClasses.map(c => c.id));
  const ColumnsAllClasses = getColumnsWithActions("all", handleAddToMyClasses, handleRemoveFromMyClasses, myClasses.map(c => c.id));


  return (
    <DefaultLayout
      pageType='admin'
      domain={params.domain}
      searchComponent={null}
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
          searchComponent={null}
        />
      }
    >

      <div className="bg-gray-50 flex flex-col gap-4 md:gap-2 items-center justify-center md:p-2">
        {data ?
          <div className='flex flex-col md:flex-row w-full gap-4 md:gap-2 items-center justify-center'>

            <MyTableComp
              columns={ColumnsMyClasses}
              data={myClasses}
            />

            <MyTableComp
              columns={ColumnsAllClasses}
              data={allClasses}
            />

          </div>
          :
          <ServerError type="notFound" item="Classroom List" />
        }
      </div>

    </DefaultLayout>
  );
};

export default List;




