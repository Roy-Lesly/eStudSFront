import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { Metadata } from 'next'
import React from 'react'

const page = () => {
  console.log("Batch Page Here !!!")
  
  return (
    <LayoutAdmin>
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
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "Batch Operation",
  description: "This is Batch Operation Page",
};