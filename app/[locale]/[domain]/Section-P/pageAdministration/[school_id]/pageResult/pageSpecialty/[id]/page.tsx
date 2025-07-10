import { Metadata } from 'next'
import React from 'react'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import Specialty from './Specialty'

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams?: any
}) => {

  const p = await params;
  const sp = await searchParams;
  
  return (
      <>
        <Breadcrumb
          pageName="Specialty" 
          pageName1="Main Dashboard" 
          link1="/pageAdministration/pageResult" 
        />

        <Specialty params={p} />
      </>
    
  )
}

export default page

export const metadata: Metadata = {
  title:
    "Specialty",
  description: "This is Result Page",
};