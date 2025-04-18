import React from 'react'
import SelectTenant from '../SelectTenant'

const page = ({params}:{params:any}) => {
  return (
      <SelectTenant params={params} />
  )
}

export default page
