import SessionExpired from '@/section-h/common/SessionExpired'
import React from 'react'

const page = async ({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  return (
    // <div>Test</div>
    <SessionExpired  params={params} />
  )
}

export default page
