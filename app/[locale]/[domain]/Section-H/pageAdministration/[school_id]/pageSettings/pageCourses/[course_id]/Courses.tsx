'use client';

import React from 'react';
import { EdgeCourse } from '@/Domain/schemas/interfaceGraphql';
import { TableColumn } from '@/Domain/schemas/interfaceGraphqlSecondary';
import MyTableComp from '@/components/Table/MyTableComp';

const Courses = ({ data, params }: { data: EdgeCourse[], params: any }) => {

  console.log(data, 22)

  const Columns: TableColumn<EdgeCourse>[] = [
    { header: "#", align: "center", render: (_item: EdgeCourse, index: number) => index + 1, },
    { header: "Code", accessor: "node.courseCode", align: "left" },
    { header: "Course Name", accessor: "node.mainCourse.courseName", align: "left" },
    { header: "semester", accessor: "node.semester", align: "left" },
    { header: "Credit", accessor: "node.courseCredit", align: "left" },
    { header: "Type", accessor: "node.courseType", align: "left" },
    { header: "Lecturer", accessor: "node.assignedTo.fullName", align: "left" },
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
