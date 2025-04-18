'use client';

import React, { useState } from 'react';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { getMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import ServerError from '@/ServerError';
import DefaultLayout from '@/DefaultLayout';
import { EdgeSpecialty, EdgeUserProfile } from '@/Domain/schemas/interfaceGraphql';
import { FaRightLong } from 'react-icons/fa6';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { FaCheck } from 'react-icons/fa';
import ModalPromote from './ModalPromote';
import { gql, useMutation } from '@apollo/client';
import { JwtPayload } from '@/serverActions/interfaces';
import { jwtDecode } from 'jwt-decode';
import { capitalizeFirstLetter, decodeUrlID } from '@/functions';


export const metadata: Metadata = {
  title: "Fields Page",
  description: "This is Fields Page Admin Settings",
};

const List = ({ params, data, dataNextSpec }: { params: any; data: any, dataNextSpec: any, searchParams: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [profilesToPromote, setProfilesToPromote] = useState<EdgeUserProfile[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [selectedSpecialtyNextID, setSelectedSpecialtyNextID] = useState<string | null>(null);

  const Columns: TableColumn<EdgeUserProfile>[] = [
    { header: "#", align: "center", render: (_item: EdgeUserProfile, index: number) => index + 1, },
    { header: "Full Name", accessor: "node.user.fullName", align: "left" },
    {
      header: "View", align: "center",
      render: (item) => {
        const isSelected = profilesToPromote.some((profile) => profile.node.id === item.node.id);
        const info = item.node.info ? JSON.parse(item.node.info.toString()) : {}; // Parse the info JSON field
        const isPromoted = info.status === "promoted";
        return isPromoted ? (
          <span className="font-semibold text-green-500">Promoted</span>
        ) : (
          <button
            onClick={() => toggleProfileSelection(item)}
            className={`p-1 rounded-full ${isSelected ? 'bg-green-500' : 'bg-green-200'}`}
          >
            {isSelected ? <FaCheck color="white" size={21} /> : <FaRightLong color="green" size={21} />}
          </button>
        );
      },
    },
  ];
  const ColumnsNext: TableColumn<EdgeUserProfile>[] = [
    { header: "#", align: "center", render: (_item: EdgeUserProfile, index: number) => index + 1, },
    { header: "Full Name", accessor: "node.user.fullName", align: "left" },
    {
      header: "View", align: "center",
      render: (item) => {
        const foundInNext = data?.allUserProfiles?.edges.some(
          (nextItem: EdgeUserProfile) => nextItem.node.user.fullName === item.node.user.fullName
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

  const [createUserProfile] = useMutation(CREATE_PROFILES);
  const [updateUserProfile] = useMutation(UPDATE_PROFILE);

  const confirmPromotion = async () => {

    const token = localStorage.getItem("token")
    const user: JwtPayload | any = jwtDecode(token ? token : "")
    if (profilesToPromote.length > 0 && user.user_id && selectedSpecialtyNextID) {
      const successMessages: string[] = [];
      const errorMessages: string[] = [];
      for (let index = 0; index < profilesToPromote.length; index++) {
        const prof = profilesToPromote[index].node;
        const data = {
          specialtyId: parseInt(decodeUrlID(selectedSpecialtyNextID)),
          userId: parseInt(decodeUrlID(prof.user.id)),
          programId: parseInt(decodeUrlID(prof.program.id)),
          session: capitalizeFirstLetter(prof.session),
          infoField: JSON.stringify({"status": "N/A"}),
          delete: false
        }
        console.log(data)
        try {
          const result = await createUserProfile({
            variables: {
              ...data,
              createdById: user.user_id
            }
          });

          if (result.data.createUpdateDeleteUserProfile.userprofile.id) {
            successMessages.push(
              `${result.data.createUpdateDeleteUserProfile.userprofile.user.fullName} - ${result.data.createUpdateDeleteUserProfile.userprofile.user.fullName}`
            );
            let currentInfo = {};
            try {
              currentInfo = JSON.parse(prof.info.toString() || '{}');
            } catch (e) {
              console.error("Error parsing info field", e);
            }
  
            const updatedInfo = {
              ...currentInfo,
              status: 'promoted',
            };

            await updateUserProfile({
              variables: {
                id: parseInt(decodeUrlID(prof.id)),
                infoField: JSON.stringify(updatedInfo),
                updatedById: user.user_id
              }
            });
          }
        } catch (err: any) {
          errorMessages.push(`Error Creating ${prof.user?.fullName}: ${err.message}`);
        }
      }

      let alertMessage = "";
      if (successMessages.length > 0) {
        alertMessage += `✅ Successfully Promotted`;
        window.location.reload();
      }
      if (errorMessages.length > 0) {
        alertMessage += `❌ Errors occurred:\n${errorMessages.join("\n")}`;
      }
      alert(alertMessage);
    }
    setShowConfirmModal(false);
    setProfilesToPromote([]);
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
        department="Promotion"
        subRoute="List"
        pageName="Promotion - Select Students"
        mainLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Result/pagePromote/${params.profile_id}`}
        subLink={`${params.domain}/Section-S/pageAdministration/${params.school_id}/Result/pagePromote/${params.profile_id}`}
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
                        const fullNameA = a.node.user.fullName.toLowerCase();
                        const fullNameB = b.node.user.fullName.toLowerCase();
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

              {profilesToPromote.length > 0 && selectedSpecialtyNextID && (
                <div className="flex items-center justify-center m-4">
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="bg-blue-500 px-4 py-2 rounded text-white"
                  >
                    Promote
                  </button>
                </div>
              )}
            </div>


            <div className='w-full'>
              <div className='flex flex-row font-medium gap-4 items-center justify-center py-1'>
                <select
                  className="px-2 py-1"
                  onChange={(e) => setSelectedSpecialtyNextID(e.target.value)}
                >
                  <option value={''}>------------------</option>
                  {dataNextSpec?.allSpecialties?.edges?.map((item: EdgeSpecialty) => <option key={item.node.id} value={item.node.id}>
                    {item.node.mainSpecialty.specialtyName} - {item.node.level.level}
                  </option>)}
                </select>
              </div>
              {dataNextSpec ? (
                dataNextSpec?.allUserProfiles?.edges.length ?
                  <MyTableComp
                    data={
                      dataNextSpec?.allUserProfiles?.edges.sort((a: EdgeUserProfile, b: EdgeUserProfile) => {
                        const fullNameA = a.node.user.fullName.toLowerCase();
                        const fullNameB = b.node.user.fullName.toLowerCase();
                        if (fullNameA > fullNameB) return 1;
                        if (fullNameA < fullNameB) return -1;
                      })}
                    columns={ColumnsNext}
                  />
                  :
                  <ServerError type="notFound" item="Classes" />
              ) : (
                <ServerError type="network" item="Promotion" />
              )}
            </div>

          </div>

        </div>

        {showConfirmModal && selectedSpecialtyNextID && profilesToPromote.length && (
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



const UPDATE_PROFILE = gql`
mutation UpdateProfiles(
    $id: ID!,
    $infoField: JSONString!,
    $updatedById: ID!,
    $delete: Boolean!,
) {
    updateUserProfile(
        id: $id 
        infoField: $infoField
        updatedById: $updatedById
        delete: $delete
    ) {
        userprofile {
            id
            user { fullName matricle }
            specialty { 
              academicYear 
              level{ level}
              mainSpecialty{ specialtyName}
            }
        }
    }
}
`;

const CREATE_PROFILES = gql`
mutation CreateProfiles(
    $userId: ID!, 
    $session: String!, 
    $programId: ID!, 
    $specialtyId: ID!, 
    $infoField: JSONString!, 
    $createdById: ID!, 
    $delete: Boolean!, 
) {
    createUpdateDeleteUserProfile(
        userId: $userId 
        session: $session
        programId: $programId 
        specialtyId: $specialtyId 
        infoField: $infoField
        createdById: $createdById
        delete: $delete
    ) {
        userprofile {
            id user { fullName }
        }
    }
}
`;