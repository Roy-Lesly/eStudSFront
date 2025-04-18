'use client';
import React, { FC, useState } from 'react'
import Swal from 'sweetalert2';
import swal from 'sweetalert2'

interface NotificationProps {
    searchParams: any
}
const Notification: FC<NotificationProps> = ({ searchParams }) => {

    const [state, setState] = useState<boolean>(true)
    const onClose = () => {
        setState(false)
    }

    const types = [ 'error', 'created', 'updated', 'deleted' ]

    return (
        <div>
            {!state ?
                <></>
                :
                Object.keys(searchParams).some(item => types.includes(item)) && <div className='m-2 p-1 text-black'>
                    <div className='flex flex-row font-medium gap-1 items justify-between rounded text-center tracking-widest'>
                        {searchParams.error && <span className='bg-notired italic md:px-4 px-2 py-2 rounded w-full'>{searchParams.error}</span>}
                        {searchParams.created && <span className='bg-notigreen italic md:px-4 px-2 py-2 rounded w-full'>{searchParams.created}</span>}
                        {searchParams.updated && <span className='bg-notiblue italic md:px-4 px-2 py-2 rounded w-full'>{searchParams.updated}</span>}
                        {searchParams.deleted && <span className='bg-notired italic md:px-4 px-2 py-2 rounded w-full'>{searchParams.deleted}</span>}
                        <button onClick={onClose} className='bg-redlight font-semibold px-4 rounded'>X</button>
                    </div>
                </div>
            }
        </div>
    )

}

export default Notification