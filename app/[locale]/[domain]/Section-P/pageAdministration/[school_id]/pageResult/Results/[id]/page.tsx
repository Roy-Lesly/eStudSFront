import { Metadata } from 'next'
import React from 'react'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'

const page = async ({
  params: any,
}: {
  params: any;
}) => {

  // const p = await params;

  return (
    <>
      <Breadcrumb
        pageName="Field"
        pageName1="Main Dashboard"
        link1="/Section-H/pageAdministration/pageResult"
      />

      <div>Results</div>

    </>

  )
}

export default page

export const metadata: Metadata = {
  title:
    "Field",
  description: "e-conneq School System. Result Page",
};