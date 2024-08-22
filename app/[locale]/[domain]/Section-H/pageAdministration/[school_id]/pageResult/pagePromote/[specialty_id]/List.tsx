'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import { EdgeSpecialty, EdgeUserProfile } from '@/Domain/schemas/interfaceGraphql';
import { FaRightLong } from 'react-icons/fa6';
import MyTableComp from '@/components/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { FaCheck } from 'react-icons/fa';
import ModalPromote from './ModalPromote';
import { gql } from '@apollo/client';
import { JwtPayload } from '@/serverActions/interfaces';
import { jwtDecode } from 'jwt-decode';
import { capitalizeFirstLetter, decodeUrlID } from '@/functions';
import { useTranslation } from 'react-i18next';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import { useRouter, useSearchParams } from 'next/navigation';


export const metadata: Metadata = {
  title: "Fields Page",
  description: "e-conneq School System. Fields Page Admin Settings",
};

const List = ({ params, data, dataNextSpec }: { params: any; data: any, dataNextSpec: any, searchParams: any }) => {
  const { t } = useTranslation("common");
  const sp = useSearchParams();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [loadingNextStudents, setLoadingNextStudents] = useState<boolean>(false);
  const [profilesToPromote, setProfilesToPromote] = useState<EdgeUserProfile[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [selectedSpecialtyNext, setSelectedSpecialtyNext] = useState<EdgeSpecialty>();


  const Columns: TableColumn<EdgeUserProfile>[] = [
    { header: "#", align: "center", render: (_item: EdgeUserProfile, index: number) => index + 1, },
    { header: "Full Name", accessor: "node.customuser.fullName", align: "left" },
    {
      header: "View", align: "center",
      render: (item) => {
        const isSelected = profilesToPromote.some((profile) => profile.node.id === item.node.id);
        const info = item.node.infoData ? JSON.parse(item.node.infoData.toString()) : {}; // Parse the info JSON field
        const isPromoted = info.status === "promoted";
        const foundInNext = dataNextSpec?.allUserProfiles?.edges.some(
          (nextItem: EdgeUserProfile) => nextItem.node.customuser.fullName === item.node.customuser.fullName
        );
        return (isPromoted || foundInNext) ?
          <span className="font-semibold text-green-500">{t("Promotted")}</span>
          :
          <button
            onClick={() => toggleProfileSelection(item)}
            className={`p-1 rounded-full ${isSelected ? 'bg-green-500' : 'bg-green-200'}`}
          >
            {isSelected ? <FaCheck color="white" size={21} /> : <FaRightLong color="green" size={21} />}
          </button>
          ;
      },
    },
  ];
  const ColumnsNext: TableColumn<EdgeUserProfile>[] = [
    { header: "#", align: "center", render: (_item: EdgeUserProfile, index: number) => index + 1, },
    { header: "Full Name", accessor: "node.customuser.fullName", align: "left" },
    {
      header: "View", align: "center",
      render: (item) => {
        const foundInNext = data?.allUserProfiles?.edges.some(
          (nextItem: EdgeUserProfile) => nextItem.node.customuser.fullName === item.node.customuser.fullName
        );
        return foundInNext ? (
          <span className="font-semibold text-blue-500"></span>
        ) : (
          <span className="font-semibold text-blue-500">New</span>
        );
      },
    },
  ];

  const toggleProfileSelection = (profile: EdgeUserProfile) => {
    if (profilesToPromote.some((p) => p.node.id === profile.node.id)) {
      setProfilesToPromote(profilesToPromote.filter((p) => p.node.id !== profile.node.id));
    } else {
      setProfilesToPromote([...profilesToPromote, profile]);
    }
  };

  const confirmPromotion = async () => {

    const token = localStorage.getItem("token")
    const user: JwtPayload | any = jwtDecode(token ? token : "")
    if (profilesToPromote.length > 0 && user.user_id && selectedSpecialtyNext?.node?.id) {
      let count = 0
      for (let index = 0; index < profilesToPromote.length; index++) {
        const prof = profilesToPromote[index].node;
        const newData = {
          specialtyId: parseInt(decodeUrlID(selectedSpecialtyNext.node.id)),
          customuserId: parseInt(decodeUrlID(prof.customuser.id)),
          programId: parseInt(decodeUrlID(prof.program.id)),
          session: capitalizeFirstLetter(prof.session),
          infoData: "{}",
          delete: false
        }
        const res = await ApiFactory({
          newData,
          mutationName: "createUpdateDeleteUserProfile",
          modelName: "userprofile",
          successField: "id",
          query,
          router: null,
          params: params,
          redirect: false,
          reload: false,
          returnResponseField: true,
          redirectPath: ``,
          actionLabel: "processing",
        });
        count = count + (res ? 1 : 0)
      }
      if (count === profilesToPromote.length) {
        alert(t("Operation Completed"))
        window.location.reload();
      } else {
        alert(t("Operation Failed"))
      }
    }
    setShowConfirmModal(false);
    setProfilesToPromote([]);
  };

  useEffect(() => {
    if (selectedSpecialtyNext?.node?.id) {
      setLoadingNextStudents(false);
    }
  }, [dataNextSpec])


  const onChangeNextSpecialty = (nextId: string) => {
    setLoadingNextStudents(true)
    const ns: EdgeSpecialty = dataNextSpec?.allSpecialties?.edges?.find(
      (item: any) => item.node.id === nextId
    );
    if (!ns || !ns?.node?.id) return;
    setSelectedSpecialtyNext(ns);
    const newParams: Record<string, string> = {};
    sp.forEach((value, key) => {
      newParams[key] = value;
    });
    newParams.spec = ns.node.mainSpecialty?.specialtyName || '';
    const queryString = new URLSearchParams(newParams).toString();
    router.push(
      `/${params.locale}/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pagePromote/${params.specialty_id}/?${queryString}`
    );
  };


  return (
    <DefaultLayout
      domain={params.domain}
      searchComponent={
        <></>
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
      <Breadcrumb
        department="Promotion"
        subRoute="List"
        pageName={`${t("Promotion - Select Students")}`}
        mainLink={`${params.domain}/Section-H/pageAdministration/${params.school_id}/Result/pagePromote/${params.profile_id}`}
      />

      <div className="bg-gray-50 flex flex-col items-center justify-center">

        <h1 className='font-bold text-2xl text-black'>{data?.allSpecialties?.edges[0]?.node.mainSpecialty.specialtyName}</h1>


        <div className="bg-white m-2 rounded shadow w-full">
          <div className='flex flex-col gap-2 lg:flex-row w-full'>
            <div className='w-full'>
              <div className='flex flex-row font-semibold gap-4 items-center justify-center py-1 text-xl tracking-widest'>
                <span>{data?.allSpecialties?.edges[0]?.node.academicYear}</span>
                <span>Level: </span>
                <span>{data?.allSpecialties?.edges[0]?.node.level.level}</span>
              </div>
              {data ? (
                data?.allUserProfiles?.edges.length ?
                  <MyTableComp
                    data={
                      data?.allUserProfiles?.edges.sort((a: EdgeUserProfile, b: EdgeUserProfile) => {
                        const fullNameA = a.node.customuser.fullName.toLowerCase();
                        const fullNameB = b.node.customuser.fullName.toLowerCase();
                        if (fullNameA > fullNameB) return 1;
                        if (fullNameA < fullNameB) return -1;
                      })}
                    columns={Columns}
                  />
                  :
                  <ServerError type="notFound" item="Student" />
              ) : (
                <ServerError type="network" item="Promotion" />
              )}

              {!loadingNextStudents && profilesToPromote.length > 0 && selectedSpecialtyNext?.node?.id && (
                <div className="flex items-center justify-center m-4">
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="bg-blue-500 px-4 py-2 rounded text-white"
                  >
                    {t("Promote")}
                  </button>
                </div>
              )}
            </div>


            <div className='w-full'>
              <div className='flex flex-row font-medium gap-4 items-center justify-center py-1'>
                <select
                  className="px-2 py-1"
                  onChange={(e) => onChangeNextSpecialty(e.target.value)}
                >
                  <option value={''}>------------------</option>
                  {dataNextSpec?.allSpecialties?.edges?.map((item: EdgeSpecialty) => <option key={item.node.id} value={item.node.id}>
                    {item.node.mainSpecialty.specialtyName} - {item.node.level.level}
                  </option>)}
                </select>
              </div>
              {!loadingNextStudents ?
                dataNextSpec ?
                  dataNextSpec?.allUserProfiles?.edges.length ?
                    <MyTableComp
                      data={
                        dataNextSpec?.allUserProfiles?.edges.sort((a: EdgeUserProfile, b: EdgeUserProfile) => {
                          const fullNameA = a.node.customuser.fullName.toLowerCase();
                          const fullNameB = b.node.customuser.fullName.toLowerCase();
                          if (fullNameA > fullNameB) return 1;
                          if (fullNameA < fullNameB) return -1;
                        })}
                      columns={ColumnsNext}
                    />
                    :
                    <ServerError type="notFound" item="Students" />
                  :
                  <ServerError type="network" item="Promotion" />
                :
                <span className="bg-white dark:bg-black flex items-center justify-center w-full py-10">
                  <span className="animate-spin border-4 border-primary border-solid border-t-transparent h-16 rounded-full w-16"></span>
                </span>
              }
            </div>

          </div>

        </div>

        {showConfirmModal && selectedSpecialtyNext?.node?.id && profilesToPromote.length && (
          <ModalPromote
            onCancel={() => setShowConfirmModal(false)}
            onPromote={confirmPromotion}
            profilesToPromote={profilesToPromote}
          />
        )}

      </div>
    </DefaultLayout>
  );
};

export default List;


const query = gql`
mutation CreateProfiles(
    $customuserId: ID!, 
    $session: String!, 
    $programId: ID!, 
    $specialtyId: ID!, 
    $infoData: JSONString!,
    $delete: Boolean!, 
) {
    createUpdateDeleteUserProfile(
        customuserId: $customuserId 
        session: $session
        programId: $programId 
        specialtyId: $specialtyId 
        infoData: $infoData
        delete: $delete
    ) {
        userprofile {
            id customuser { fullName }
        }
    }
}
`;