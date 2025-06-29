import SessionExpired from '@/section-h/common/SessionExpired'
import React from 'react'

const page = async ({
  params,
  searchParams,
}: {
    params: any;
    searchParams?: any;
}) => {
  const p = await params;
  const sp = await searchParams;

  return (
    <SessionExpired  params={p} />
  )
}

export default page
