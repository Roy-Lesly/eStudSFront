'use client';

import React from 'react';
import { EdgeResult } from '@/Domain/schemas/interfaceGraphql';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import MyTableComp from '@/section-h/Table/MyTableComp';
import { JwtPayload } from '@/serverActions/interfaces';
import { jwtDecode } from 'jwt-decode';

const Students = ({ data, params }: { data: EdgeResult[], params: any }) => {

  const token = localStorage.getItem("token")
  const user: JwtPayload | null = token ? jwtDecode(token) : null
  console.log(user)
  console.log(user?.page)
  console.log(user?.page.includes("Result"))
  // console.log(data)
  const sortedData = [...data].sort((a, b) => {
    const infoA = JSON.parse(a.node.info || "{}");
    const infoB = JSON.parse(b.node.info || "{}");
  
    const hasAvgA = typeof infoA.average === "number";
    const hasAvgB = typeof infoB.average === "number";
  
    if (!hasAvgA && !hasAvgB) return 0;
    if (!hasAvgA) return 1;
    if (!hasAvgB) return -1;
  
    return infoB.average - infoA.average; // normal descending
  });

  console.log(sortedData)

  const Columns: TableColumn<EdgeResult>[] = [
    { header: "Rank", align: "center", render: (_item: EdgeResult, index: number) => index + 1, },
    { header: "Full Name", accessor: "node.student.user.fullName", align: "left" },
    { header: "Total", align: "center", hideColumn: (user?.page.map((item: string) => !item.toUpperCase()).includes("RESULT") || !user?.is_staff),
      render: (item: any) => {
        const info = JSON.parse(item.node.info);
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
