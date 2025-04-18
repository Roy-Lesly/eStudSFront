import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import Specialty from './Specialty'

const page = async ({
  params,
  searchParams,
}: {
  params: { id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  
  return (
    <LayoutAdmin >
      <>
        <Breadcrumb
          pageName="Specialty" 
          pageName1="Main Dashboard" 
          link1="/pageAdministration/pageResult" 
        />

        <Specialty params={params} />
      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "Specialty",
  description: "This is Result Page",
};