import { getData } from '@/functions'
import { GetMainCourseUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { MainCourseInter } from '@/Domain/Utils-H/appControl/appInter'
import { useParams, usePathname } from 'next/navigation'
import React, { FC, useEffect, useState } from 'react'
import { protocol } from '@/config'


interface DepartmentDrugListProps {
    data: MainCourseInter[]
    addMainCourseItems: any
}

const MainCoursesList: FC<DepartmentDrugListProps> = ({ data, addMainCourseItems }) => {
    return (
        <div className='flex flex-col'>
            <List data={data} addMainCourseItems={addMainCourseItems} />
        </div>
    )
}

export default MainCoursesList


interface ListProps {
    data: MainCourseInter[]
    addMainCourseItems: any
}
const List: FC<ListProps> = ({ data, addMainCourseItems }) => {

    const domain = useParams().domain;
    const [ count, setCount ] = useState<number>(0)
    const [ searchText, setSearchText ] = useState<string>()
    const [ tableData, setTableData ] = useState<MainCourseInter[]>()
    const [ mainCoursesToAssign, setMainCoursesToAssign ] = useState<MainCourseInter[]>(data)

    const pathUrl = usePathname()

    useEffect(() => {
        if (count == 1 && searchText && searchText.length > 2) {
            const searchBack = async () => {
                const res = await getData(protocol  + "api" + domain + GetMainCourseUrl, { course_name: searchText, nopage: true }, Array.isArray(domain) ? domain[0] : domain)
                if (res){
                    setMainCoursesToAssign(res)
                    setCount(2)
                }
            }
            searchBack()             
        } 
        if (count == 1 && searchText && searchText.length < 2) {
            setMainCoursesToAssign(data)
        }
    }, [ count, tableData, pathUrl, data, searchText, domain ]);

    return (
        <div className='flex flex-col'>

            <input
                placeholder='Search Course Name Here ...' className='border-2 dark:bg-slate-700 dark:border-slate-300 dark:text-white flex font-semibold mb-2 px-6 py-2 w-full' 
                onChange={ (e) => { setSearchText(e.target.value); setCount(1) } }
            />

            <div className="2xl:px-6 bg-teal-900 border-stroke border-t dark:border-strokedark grid grid-cols-7 md:px-4 px-2 py-1 text-teal-50">

                <div className="col-span-1 items-center justify-center md:flex">
                    <span className="font-medium">No</span>
                </div>

                <div className="col-span-6 items-center justify-start md:flex">
                    <span className="font-medium">COURSE NAME</span>
                </div>
            </div>
            {
                mainCoursesToAssign && mainCoursesToAssign.length > 0 && mainCoursesToAssign.map((item: MainCourseInter, index: number) => (
                    <div
                        className="2xl:px-6.5 bg-white border-stroke border-t cursor-pointer dark:bg-slate-700 dark:border-strokedark dark:hover:bg-teal-700 font-semibold grid grid-cols-7 hover:bg-teal-300 md:px-4 px-3 py-2 text-sm tracking-widest"
                        key={index}
                        onClick={() => { addMainCourseItems(item); }}
                    >

                        <div className="col-span-1 items-center justify-center md:flex">
                            <span className="dark:text-white text-black">
                                {index + 1}
                            </span>
                        </div>

                        <div className="col-span-6 items-center justify-start md:flex">
                            <span className="dark:text-white text-black">
                                {item.course_name}
                            </span>
                        </div>

                    </div>
                ))
            }
        </div>
    )
}