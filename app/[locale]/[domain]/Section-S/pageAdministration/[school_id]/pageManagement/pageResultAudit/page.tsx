import React from 'react'
import SelectTenant from '../SelectTenant'

const page = async ({ params }: {  params: any;
  // searchParams: any;
}) => {

  const p = await params;
  // const sp = await searchParams;

  return (
    // <>d</>
    <SelectTenant params={p} />
  )

}

export default page
