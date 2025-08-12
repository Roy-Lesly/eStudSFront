import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import { Metadata } from 'next'
import React from 'react'

const page = () => {
  console.log("Batch Page Here !!!")

  return (

    <>
      <Breadcrumb
        pageName="Batch Operation"
        pageName1="Dashboard"
        link1="/${params.domain}/Section-H/pageAdministration"
      />

      <div>
        Batch Operation Page
      </div>
    </>

  )
}

export default page

export const metadata: Metadata = {
  title:
    "Batch Operation",
  description: "e-conneq School System. Batch Operation Page",
};