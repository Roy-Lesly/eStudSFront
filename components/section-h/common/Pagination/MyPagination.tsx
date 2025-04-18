import { calculatePagination, getNumFromStr } from '@/functions'
import Link from 'next/link'
import React, { FC } from 'react'


interface Props {
    prevLink: string | null
    nextLink: string | null
    count: number
    thisUrl: string
}
const MyPagination:FC<Props> = ({ prevLink, nextLink, count, thisUrl}) => {

  return (
    <div className="flex flex-row items-center justify-between md:mt-4 mt-2 p-2">
        <div> 
          {prevLink && <button className='flex flex-row gap-4'>
            <Link
              className='bg-stroke md:px-6 md:py-2 px-4 py-1 text-red-500'
              href={`${thisUrl}?page=${getNumFromStr(prevLink, "page")}`}
            >
              Prev
            </Link>
            {!nextLink && <span className='flex items-center justify-center text-center'>{calculatePagination( count, 50, getNumFromStr(prevLink, "page")+1 )}</span>}

          </button>}
        </div>
        <div>
          {nextLink && <button className='flex flex-row gap-4'>
            <span className='flex items-center justify-center text-center'>{calculatePagination( count, 50, getNumFromStr(nextLink, "page")-1 )}</span>
            <Link
              className='bg-stroke md:px-6 md:py-2 px-4 py-1 text-red-500'
              href={`${thisUrl}?page=${getNumFromStr(nextLink, "page")}`}
            >
              Next
            </Link>
          </button>}
        </div>
      </div>
  )
}

export default MyPagination