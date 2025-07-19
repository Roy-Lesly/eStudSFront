'use client';

import React from 'react';
import { EdgeCourse } from '@/Domain/schemas/interfaceGraphql';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import MyTableComp from '@/section-h/Table/MyTableComp';

const Courses = ({ data, params }: { data: EdgeCourse[], params: any }) => {
console.log(data);
  const Columns: TableColumn<EdgeCourse>[] = [
    { header: "#", align: "center", render: (_item: EdgeCourse, index: number) => index + 1, },
    { header: "Code", accessor: "node.courseCode", align: "left" },
    { header: "Course Name", accessor: "node.mainCourse.courseName", align: "left" },
    { header: "Sem", accessor: "node.semester", align: "center" },
    { header: "Credit", accessor: "node.courseCredit", align: "center" },
    { header: "Resit", accessor: "node.resitCount.resitCount", align: "center" },
    {
      header: "Submit %", align: "center", render: (item) => <button
        className="flex font-semibold gap-1 justify-between text-sm w-full"
      >
        <span className='bg-green-400 flex h-8 items-center justify-center rounded-full text-center w-8'>{Math.floor(item.node.percentageCa)}</span>
        <span className='bg-green-400 flex h-8 items-center justify-center rounded-full text-center w-8 px-1'>{Math.floor(item.node.percentageExam)}</span>
        <span className='bg-green-400 flex h-8 items-center justify-center rounded-full text-center w-8'>{Math.floor(item.node.percentageResit)}</span>
      </button>,
    },
    { header: "Lecturer", accessor: "node.assignedTo.fullName", align: "left" },
    // { header: "Type", accessor: "node.courseType", align: "left" },
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

export default Courses;
