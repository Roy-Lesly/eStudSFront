'use client';
import { useRouter } from 'next/navigation';
import React, { FC } from 'react';


interface Props {
    id?: number
    link: string
}
const MyButtonView:FC<Props> = ({ id, link}) => {

    const router = useRouter();
    // function handleClick() {
    //     router.push(`/${link}/${id}`)
    // }

    return (
        <>
            {id ? 
                <button onClick={() => {router.push(`/${link}/${id}`)}}>View</button> 
                    : 
                <button onClick={() => {router.push(`/${link}`)}}>View</button>
            }
        </>
    )
}

export default MyButtonView