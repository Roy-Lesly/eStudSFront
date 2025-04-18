import React from 'react';
import RoleHandle from '../../RoleHandle';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Administration Page",
  description: "This is Administration Page",
};

const page = async ({
  params,
  searchParams,
}: {
  params: any,
  searchParams?: any
}) => {

    const par = await params
    const ser = await searchParams

  return <>
    {par && <RoleHandle params={{...par, pageTitle: "Administration"}} searchParams={ser} />}
  </>;
};


export default page;
