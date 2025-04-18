import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'

const page = ({
  params: { id },
}: {
  params: { id: string };
}) => {
  console.log("Result Page Here !!!")
  
  return (
    <LayoutAdmin >
        <>
            <Breadcrumb
                pageName="Field" 
                pageName1="Main Dashboard" 
                link1="/Section-H/pageAdministration/pageResult" 
            />

            <div>Results</div>
            
        </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "Field",
  description: "This is Result Page",
};