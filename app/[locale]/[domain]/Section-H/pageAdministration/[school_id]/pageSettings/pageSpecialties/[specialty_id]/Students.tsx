'use client';

import React from 'react';
import { EdgeSchoolFees } from '@/Domain/schemas/interfaceGraphql';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { FaRightLong } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { JwtPayload } from '@/serverActions/interfaces';
import { jwtDecode } from 'jwt-decode';

const Students = ({ data, params }: { data: EdgeSchoolFees[], params: any }) => {

  const token = localStorage.getItem("token");
  const user: JwtPayload | null = token ? jwtDecode(token) : null;
  const router = useRouter();

  const Columns: TableColumn<EdgeSchoolFees>[] = [
    { header: "#", align: "center", render: (_item: EdgeSchoolFees, index: number) => index + 1, },
    { header: "Matricle", accessor: "node.userprofile.user.matricle", align: "left" },
    { header: "Full Name", accessor: "node.userprofile.user.fullName", align: "left" },
    {
      header: "Print", hideColumn: user?.is_staff || user?.page.includes("DOCUMENT"), align: "center", render: (item: EdgeSchoolFees, index: number) => <button
        onClick={() => router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pageTranscript/${item.node.id}`)}
        className="bg-green-200 p-1 rounded-full"
      >
        <FaRightLong color="green" size={21} />
      </button>,
    },
  ];


  return (
    <div>
      <div>
        <MyTableComp
          data={data}
          columns={Columns}
        />
      </div>
    </div>
  );
};

export default Students;
