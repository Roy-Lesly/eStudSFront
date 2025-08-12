'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { decodeUrlID } from '@/functions';
import { FaRightLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { EdgeSchoolFeesPrim } from '@/utils/Domain/schemas/interfaceGraphqlPrimary';
import { TableColumn } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import MyTableComp from '@/components/section-h/Table/MyTableComp';

const Children = ({ data, params }: { data: EdgeSchoolFeesPrim[], params: any }) => {

    const router = useRouter();
    const { t } = useTranslation("common");

  const Columns: TableColumn<EdgeSchoolFeesPrim>[] = [
    { header: "#", align: "center", render: (_item: EdgeSchoolFeesPrim, index: number) => index + 1, },
    { header: `${t("Student")}`, align: "left", render: (item) => <div className="flex flex-col">
        <span>{item.node.userprofileprim?.customuser?.firstName}</span>
        <span>{item.node.userprofileprim?.customuser?.lastName}</span>
      </div>,
    },
    { header: `${t("Class Info")}`, align: "left", render: (item) => <div className="flex flex-col">
        <span>{item.node.userprofileprim.classroomprim?.level}</span>
        <span>{item.node.userprofileprim.classroomprim?.academicYear}</span>
      </div>,
    },
    { header: `${t("Fees Info")}`, align: "left", render: (item) => <div className="flex flex-col">
        <span>Reg: {item.node.userprofileprim.classroomprim?.registration?.toLocaleString()}</span>
        <span>Tui: {item.node.userprofileprim.classroomprim?.tuition?.toLocaleString()}</span>
      </div>,
    },
    // { header: `${t("Fees Transactions")}`, align: "left", render: (item) => <div className="flex flex-col">
    { header: `${t("Balance")}`, align: "left", render: (item) => <div className="flex flex-col">
        {/* <span>{item.node.userprofileprim.classroomprim?.level}</span> */}
        {/* <span>{item.node.userprofileprim.classroomprim?.academicYear}</span> */}
        <span>Bal: {item.node.balance}</span>
      </div>,
    },
    // {
    //   header: `${t("View")}`, align: "center",
    //   render: (item) => <button
    //     // onClick={() => router.push(`/${params.domain}/Section-P/pageAdministration/${params.school_id}/pageUsers/parents/${item.node.id}/?user=${item.node.customuser.id}&ft=${item.node.customuser?.fatherTelephone}&mt=${item.node.customuser?.motherTelephone}`)}
    //     className="bg-green-200 p-2 rounded-full"
    //   >
    //     <FaRightLong color="green" size={21} />
    //   </button>,
    // },
  ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            className="bg-white overflow-x-auto rounded-lg shadow-md"
        >
           {data ?
           <MyTableComp
            data={
              data?.sort((a: EdgeSchoolFeesPrim, b: EdgeSchoolFeesPrim) => {
                const academicYearA = a.node?.userprofileprim?.classroomprim.academicYear;
                const academicYearB = b.node?.userprofileprim?.classroomprim.academicYear;
                const fullNameA = a.node?.userprofileprim?.customuser?.fatherName.toLowerCase();
                const fullNameB = b.node?.userprofileprim?.customuser?.fatherName.toLowerCase();

                if (academicYearA > academicYearB) return -1;
                if (academicYearA < academicYearB) return 1;

                return fullNameA.localeCompare(fullNameB);
              })}
            columns={Columns}
            // table_title={`${t("Parents List")}`}
            // button_action={() => router.push(`/${params.locale}/${params.domain}/Section-P/pageAdministration/${params.school_id}/pageStudents/pageNewPreinscription`)}
            // button_type={"add"}
          />
        :
        null
        } 
        </motion.div>
    );
};

export default Children;
