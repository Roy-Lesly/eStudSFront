'use client';

import React from 'react';
import { EdgeResult } from '@/Domain/schemas/interfaceGraphql';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import MyTableComp from '@/components/Table/MyTableComp';
import { JwtPayload } from '@/serverActions/interfaces';
import { jwtDecode } from 'jwt-decode';

const Students = ({ data, params }: { data: EdgeResult[], params: any }) => {

  const token = localStorage.getItem("token")
  const user: JwtPayload | null = token ? jwtDecode(token) : null

  const sortedData = [...data].sort((a, b) => {
    const infoA = JSON.parse(a.node.infoData || "{}");
    const infoB = JSON.parse(b.node.infoData || "{}");

    const hasAvgA = typeof infoA.average === "number";
    const hasAvgB = typeof infoB.average === "number";

    if (!hasAvgA && !hasAvgB) return 0;
    if (!hasAvgA) return 1;
    if (!hasAvgB) return -1;

    return infoB.average - infoA.average; // normal descending
  });


  const Columns: TableColumn<EdgeResult>[] = [
    { header: "Rank", align: "center", render: (_item: EdgeResult, index: number) => index + 1, },
    { header: "Full Name", accessor: "node.student.customuser.fullName", align: "left" },
    {
      header: "Total", align: "center", hideColumn: (user?.page.map((item: string) => !item.toUpperCase()).includes("RESULT") || !user?.is_staff),
      render: (item: any) => {
        const info = JSON.parse(item.node.infoData);
        return info.average;
      },
    },
  ];


  return (
    <div>
      <div>
        <MyTableComp
          data={sortedData}
          columns={Columns}
        />
      </div>
    </div>
  );
};

export default Students;
