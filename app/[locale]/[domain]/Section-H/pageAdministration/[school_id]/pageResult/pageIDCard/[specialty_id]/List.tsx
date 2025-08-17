'use client';

import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/DefaultLayout';
import Sidebar from '@/section-h/Sidebar/Sidebar';
import { GetMenuAdministration } from '@/section-h/Sidebar/MenuAdministration';
import Header from '@/section-h/Header/Header';
import Breadcrumb from '@/Breadcrumbs/Breadcrumb';
import { EdgeSchoolFees } from '@/Domain/schemas/interfaceGraphql';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import { FaLeftLong, FaRightLong } from 'react-icons/fa6';
import ServerError from '@/ServerError';
import { FaCheck } from 'react-icons/fa';
import { GrClose } from 'react-icons/gr';
import IDComp2 from './IDComp2';
import { protocol, RootApi } from '@/utils/config';
import { decodeUrlID } from '@/utils/functions';
import { QrCodeBase64 } from '@/components/QrCodeBase64';
// import IDComp1 from './IDComp1';
// import IDComp2 from './IDComp2';


const List = ({ params, data, searchParams }: { params: any; data: EdgeSchoolFees[], searchParams: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [print, setPrint] = useState<boolean>(false);
  const [dataToPrint, setDataToPrint] = useState<EdgeSchoolFees[]>();
  // const [qrCodeMap, setQrCodeMap] = useState<Record<string, string>>({});
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<Record<string, string>>({});

  useEffect(() => {
    if (dataToPrint?.length) {
      const generateQRCodes = async () => {
        const newQrCodes: Record<string, string> = {};

        for (const item of dataToPrint) {
          const userID = decodeUrlID(item.node.userprofile.id);
          const url = `${protocol}${params.domain}${RootApi}/check/H/${userID}/idcard/?n=1`;
          const qr = await QrCodeBase64(url);
          newQrCodes[item.node.userprofile.id] = qr;
        }

        setQrCodeDataUrl(newQrCodes); // now a map of userprofile.id → base64
      };

      generateQRCodes();
    }
  }, [dataToPrint]);


  const Columns: TableColumn<EdgeSchoolFees>[] = [
    { header: "#", align: "center", render: (_item: EdgeSchoolFees, index: number) => index + 1, },
    { header: "Name", accessor: "node.userprofile.customuser.fullName", align: "left" },
    { header: "Gender", accessor: "node.userprofile.customuser.sex", align: "center" },
    { header: "Telephone", accessor: "node.userprofile.customuser.telephone", align: "center" },
    { header: "Platform Status", align: "center", render: (item: EdgeSchoolFees, index: number) => <span className='flex items-center justify-center w-full'>{item.node.platformPaid ? <FaCheck size={22} color='green' /> : <GrClose size={22} color='red' />}</span> },
    {
      header: "Action", align: "center",
      render: (item) => <button
        onClick={() => { setPrint(true); item.node.platformPaid ? setDataToPrint([item]) : null }}
        className='flex items-center justify-center w-full'
      >
        <FaRightLong color="green" size={21} />
      </button>,
    },
  ];

  console.log(qrCodeDataUrl);

  return (
    <DefaultLayout
      pageType='admin'
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
        department="IDCard"
        subRoute="List"
        pageName={`IDCard ${data && data.length ? (data[0].node.userprofile.specialty.mainSpecialty.specialtyName + " - " + data[0].node.userprofile.specialty.academicYear + " - " + data[0].node.userprofile.specialty.level?.level) : ""}`}
        mainLink={`${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pageIDCard`}
      />

      <div className="bg-gray-50 flex flex-col gap-2 items-center justify-center w-full">

        {data ?
          data?.length > 0 ?
            print ?
              dataToPrint?.length ?


                <div className='flex flex-col justify-center w-full'>
                  <div className='flex items-center justify-center'>
                    <button
                      onClick={() => { setPrint(false); }}
                      className='bg-blue-800 flex flex-row font-bold gap-2 m-2 px-6 py-2 rounded-lg text-white'
                    >
                      Back <FaLeftLong color='red' size={27} />
                    </button>
                  </div>
                    {/* <IDComp2
                      data={dataToPrint} // still an array, but just one item
                      params={params}
                      searchParams={searchParams}
                      qrCodeDataUrl={qrCodeDataUrl} // just that user's QR
                    /> */}
                </div>


                :
                <div className='flex flex-col font-bold gap-6 items-center justify-center my-20 py-4 text-2xl text-black'>
                  <span>No Active ID To Print</span>
                  <button
                    onClick={() => { setPrint(false); }}
                    className='bg-blue-200 px-6 py-2 rounded-lg'
                  >
                    <FaLeftLong color='red' size={27} />
                  </button>
                </div>
              :
              <MyTableComp
                data={data}
                columns={Columns}
                table_title='Students'
                custom_button={<button onClick={() => { setPrint(true); setDataToPrint(data.filter((i: EdgeSchoolFees) => i.node.platformPaid)) }} className='bg-red border flex flex-row font-bold gap-2 items-center justify-center px-4 py-2 rounded-xl text-white text-xl'>Print All <FaRightLong color="white" size={21} /></button>}
              />
            :
            <div className='flex font-semibold italic items-center justify-center my-16 py-10 text-xl'>
              <ServerError
                item='Students'
                type='notFound'
              />
            </div>
          :
          <ServerError
            item='Students'
            type='network'
          />
        }
      </div>
    </DefaultLayout>
  );
};

export default List;