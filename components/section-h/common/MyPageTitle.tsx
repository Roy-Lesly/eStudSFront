import React from 'react'

const MyPageTitle = ({ title }: any) => {
  return (
    <h1 className="font-semibold md:block md:text-2xl text-black text-lg w-full">{title}</h1>
  )
}

export default MyPageTitle