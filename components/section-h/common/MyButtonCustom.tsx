'use client';
import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react';


interface Props {
    href: string
    title: string
    type?: string
}

const MyButtonCustom:FC<Props> = ({ href, title, type }) => {
    const [ count, setCount ] = useState(0);
    const [ color, setColor ] = useState("greendark");

    useEffect(() => {
        if (count == 0){
            if (type == "add"){ setColor("greendark")}
            if (type == "edit"){ setColor("bluedark")}
            if (type == "delete"){ setColor("reddark")}
            if (type == "save"){ setColor("greendark")}
            if (type == "update"){ setColor("bluedark")}
            if (type == "view"){ setColor("bluedark")}
            // setCount(1)
        }
    }, [ count, type ])
    return (
      <button className={`bg-${color} rounded text-whte tracking-wider text-white font-semibold`}>
          <Link href={href} className='flex md:px-6 md:py-2 px-4 py-1'>
              {title}
          </Link>
      </button>
    )
}

export default MyButtonCustom