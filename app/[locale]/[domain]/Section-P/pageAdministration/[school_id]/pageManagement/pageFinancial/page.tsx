import React from 'react'
import SelectTenant from '../SelectTenant'

const page = async (
  {params}:
  { params: any; }
) => {

  const p = await params;
  return (
      <SelectTenant params={p} />
  )
}

export default page
