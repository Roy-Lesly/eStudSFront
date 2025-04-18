'use client';
import { EdgeCustomUser } from '@/Domain/schemas/interfaceGraphql';
import React, { useState } from 'react';
import { SelectedMainCousesAssignProps } from './CourseAssignAction';
import { decodeUrlID } from '@/functions';

const SearchLecturer = ({ apiLecturer, updateCourseAssignedTo, item }: { updateCourseAssignedTo: any, apiLecturer: any, item: SelectedMainCousesAssignProps}) => {
    const [ newData, setNewData ] = useState<EdgeCustomUser[]>(apiLecturer);
    const onSearch = (text: string) => {
        if (text.length > 1){
            const fil = apiLecturer.filter((item: EdgeCustomUser) => item.node.fullName.toLowerCase().includes(text.toLowerCase()))
            setNewData(fil)
        }
        else { setNewData(apiLecturer)}
    }

    return (
        <div className="col-span-2 flex-col items-center justify-center md:flex mx-0 px-0">
            <input
                type="text"
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search Lecturer"
                className="active:border-primary bg-transparent border-[1.5px] border-stroke dark:bg-form-input dark:border-form-strokedark dark:focus:border-primary dark:text-white disabled:bg-whiter disabled:cursor-default focus:border-primary outline-none px-2 py-1 rounded-lg text-black transition w-40"
            />
            <select defaultValue={item.assignedToId} onChange={(e) => { updateCourseAssignedTo(item.mainCourseId, parseInt(decodeUrlID(e.target.value))) }} className='border-2 px-1 py-1 rounded w-40'>
                <option value={0}>------------------</option>
                {newData && newData.map((item: EdgeCustomUser) => (<option key={item.node.id} value={item.node.id} className="dark:text-bodydark my-2 text-body">
                    {item.node.fullName.slice(0, 15)}
                    </option>)
                )}
            </select>
        </div>
    )
}

export default SearchLecturer