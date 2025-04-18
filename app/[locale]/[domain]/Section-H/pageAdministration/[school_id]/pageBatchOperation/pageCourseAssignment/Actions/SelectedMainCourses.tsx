import React, { FC, useState} from 'react'
import { FaRightLong } from 'react-icons/fa6'
import { SelectedMainCousesAssignProps } from './CourseAssignAction'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ActionCreate } from '@/serverActions/actionGeneral'
import { CourseUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { SchemaCreateEditCourse } from '@/Domain/schemas/schemas'
import { protocol } from '@/config'


interface PageProps {
    selectedMainCoursesAssign: any
    setData: any
    setPage: any
    page: number
}
const SelectedMainCourses: FC<PageProps> = ({ selectedMainCoursesAssign, setPage, page, setData }) => {

    return (
        <div>
            <List data={selectedMainCoursesAssign} setPage={setPage} page={page} setData={setData} />
        </div>
    )
}

export default SelectedMainCourses



interface ListProps {
    data: SelectedMainCousesAssignProps[]
    setData?: any
    setPage: any
    page: number
}

const List: FC<ListProps> = ({ data, setPage, page, setData }) => {

    const [ loading, setLoading ] = useState<boolean>(false);
    const router = useRouter();
    const domain = useParams().domain;
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const removeItem = (main_course_id: number) => {
        var found = data.find((item: SelectedMainCousesAssignProps) => item.mainCourseId == main_course_id)
        if (found) {
            var newData = data.filter((d: SelectedMainCousesAssignProps) => d.mainCourseId != main_course_id);
            setData([...newData])
        }
    }
    const submit = async () => {
        var checkCode = data.filter((item: SelectedMainCousesAssignProps) => !item.courseCode)
        var checkCredit = data.filter((item: SelectedMainCousesAssignProps) => !item.courseCredit)
        var checkHours = data.filter((item: SelectedMainCousesAssignProps) => !item.hours)
        var checkType = data.filter((item: SelectedMainCousesAssignProps) => !item.courseType)
        if (checkCode.length < 1 && checkCredit.length < 1 && checkHours.length < 1 && checkType.length < 1 && pathname) {
            var pn = pathname.toString().match(/\d+/g)
            setLoading(true)
            if (data && data.length > 0 && pn) {
                await Promise.allSettled(data.map((item: SelectedMainCousesAssignProps, index: number) => {
                    return (
                        ActionCreate(item, SchemaCreateEditCourse, protocol  + "api" + domain + CourseUrl)
                    )
                }))
                .then(res => {
                    console.log(103, res)
                    if (res && res.length > 0 && pn) {
                        const t = res.map(item => item.status)
                        console.log(t)
                        if (!t.includes("fulfilled")){
                            router.push(`/${domain}/Section-H/pageAdministration/${pn[0]}/pageBatchOperation/pageCourseAssignment?error=Operation Successful`);
                        } else {
                            router.push(`/${domain}/Section-H/pageAdministration/${pn[0]}/pageBatchOperation/pageCourseAssignment?created=Operation Successful`);
                        }
                        setLoading(false);
                    }
                })
                .catch(err => {
                    if (pn){
                        router.push(`/${domain}/Section-H/pageAdministration/${pn[0]}/pageBatchOperation/pageCourseAssignment?specialty_id=${searchParams.get("specialty_id")}&semester=${searchParams.get("semester")}&error=${JSON.stringify(err)}`);

                    }
                })
                return
            } else {
                // console.log(103, "Not Logged In")
            }
            const response = await ActionCreate(data[0], SchemaCreateEditCourse, protocol  + "api" + domain + CourseUrl)
            if (response?.error) {
            }
            if (response?.detail) { alert(response.detail) }
            setLoading(false)
        }
        return
    }

    return (
        <>
            <div className="2xl:px-6 bg-teal-900 border-stroke border-t dark:border-strokedark grid grid-cols-5 md:px-4 px-2 py-1 text-teal-50">

                <div className="col-span-4 items-center justify-start md:flex">
                    <span className="font-medium">COURSE NAME</span>
                </div>

                <div className="hidden items-center justify-center md:flex">
                    <span className="font-medium">Remove</span>
                </div>

            </div>
            {
                data && data.length > 0 && data.map((item: SelectedMainCousesAssignProps, index: number) => (
                    <div
                        className="2xl:px-6.5 bg-white border-stroke border-t dark:bg-slate-700 dark:border-strokedark font-semibold grid grid-cols-5 md:px-4 px-3 py-2 text-sm tracking-widest"
                        key={index}
                    >

                        <div className="col-span-4 items-center justify-start md:flex">
                            <span className="dark:text-white text-black">
                                {item.courseName}
                            </span>
                        </div>

                        <div className="hidden items-center justify-center md:flex">
                            <button onClick={(e) => { removeItem(item.mainCourseId)}} className='border font-bold px-2.5 rounded text-red text-xl'>x</button>
                        </div>

                    </div>
                ))
            }

            <div className='bg-white dark:bg-slate-300 flex flex-row font-semibold gap-4 justify-center mt-2 p-4 text-black text-lg tracking-widest'>
                
                <span className='flex items-center justify-end md:ml-20'>
                    {data && data.length > 0 && page == 1 && !loading && <button onClick={() => { setPage(2) }} className='bg-red flex gap-2 items-center justify-center px-6 py-2 rounded text-white'>
                        Next
                        <FaRightLong />
                    </button>}
                </span>


            </div>
        </>
    )
}