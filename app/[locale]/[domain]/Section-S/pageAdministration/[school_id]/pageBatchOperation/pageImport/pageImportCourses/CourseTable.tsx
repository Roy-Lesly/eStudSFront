import { protocol } from '@/config';
import { CourseUrl } from '@/Domain/Utils-H/appControl/appConfig';
import { GetCourseInter } from '@/Domain/Utils-H/appControl/appInter'
import { SchemaCreateEditCourse } from '@/Domain/schemas/schemas';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaArrowDown } from 'react-icons/fa6';

const CourseTable = ({ params, selectedYearCourses, setToImportCourses, toImportCourses, toImportSpecialty }: GetCourseInter[] | any) => {

    const router = useRouter();
    const [count, setCount] = useState<number>(0);
    const [addedCourses, setAddedCourses] = useState<GetCourseInter[]>();
    const [copyExistingYearCourses, setCopyExistingYearCourses] = useState<GetCourseInter[]>();
    const [addedCoursesIDs, setAddedCoursesIDs] = useState<number[]>();
    const [importClicked, setImportClicked] = useState<boolean>(false);
    const [newAdded, setNewAdded] = useState<boolean>(false);

    useEffect(() => {
        if (count == 0 && selectedYearCourses) {
            setCopyExistingYearCourses(selectedYearCourses);
            setCount(1)
        }
        if (count == 1) {

        }
    }, [selectedYearCourses, count])


    const addCourse = (cou: GetCourseInter) => {
        if (selectedYearCourses) {
            if (!toImportCourses || toImportCourses.length < 1) {
                setToImportCourses([cou]);
                setAddedCourses([cou]);
                setAddedCoursesIDs([cou.id]);
                setNewAdded(true);
                return
            } else {
                var found = toImportCourses.find((item: GetCourseInter) => (item.course_name == cou.course_name))
                if (found) { return }
                if (!found && toImportCourses) {
                    setToImportCourses([...toImportCourses, cou])
                    setNewAdded(true)
                }
                if (!found && !toImportCourses) {
                    setToImportCourses([cou])
                    setNewAdded(true)
                }
                var foundAdded = addedCourses?.find((item: GetCourseInter) => (item.course_name == cou.course_name))
                if (!foundAdded && addedCourses) {
                    setAddedCourses([...addedCourses, cou]);
                }
                if (!foundAdded && !addedCourses) {
                    setAddedCourses([cou]);
                }
                if (!foundAdded && addedCoursesIDs) {
                    setAddedCoursesIDs([...addedCoursesIDs, cou.id]);
                }
                if (!foundAdded && !addedCoursesIDs) {
                    setAddedCoursesIDs([cou.id]);
                }
            }
        }
        else {
            setAddedCourses([cou]);
            setToImportCourses([cou])
            setAddedCoursesIDs([cou.id]);
        }
    }

    const removeCourse = (cou: any) => {
        if (addedCourses && selectedYearCourses) {
            var found = addedCourses.find((item: GetCourseInter) => item.id == cou.id)
            if (found) {
                const filA = addedCourses.filter((item: GetCourseInter) => item.id != cou.id);
                const filB = addedCoursesIDs?.filter((item: number) => item != cou.id)
                const filC = toImportCourses?.filter((item: GetCourseInter) => item.id != cou.id);
                setAddedCourses(filA);
                setAddedCoursesIDs(filB);
                setToImportCourses(filC);
            }
        }
    }

    const importCourses = async () => {
        setImportClicked(true);
        if (addedCourses && addedCourses.length > 0) {
            await Promise.allSettled(addedCourses.map((item: GetCourseInter, index: number) => {
                const data = {
                    school_id: params.school_id,
                    main_course_id: item.main_course_id,
                    specialty_id: toImportSpecialty.id,
                    course_code: item.course_code,
                    course_credit: item.course_credit,
                    course_type: item.course_type,
                    semester: item.semester,
                    hours: item.hours,
                    hours_left: item.hours,
                    assigned_to_id: item.assigned_to_id,
                    assigned: item.assigned,
                    paid: false,
                    completed: false,
                }
                return (
                    ActionCreate(data, SchemaCreateEditCourse, protocol + "api" + params.domain + CourseUrl)
                )
            }))
                .then(res => {
                    if (res && res.length > 0) {
                        const t = res.map(item => item.status)
                        if (t[0] == "fulfilled") { router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageImport?updated=SUCCESSFULLY !!!`); }
                        else { router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageImport/pageImportCourses?error=${t[0]}`); }
                    }
                })
                .catch((error: any) => {
                    errorLog(error);
                })
            return
        } else {
        }
    }

    return (
        <div className='flex flex-col gap-2 w-full'>
            <div className='flex flex-col gap-2 md:flex-row w-full'>


                <div className='flex flex-col md:w-1/2 w-full'>
                    <div className='bg-blue-800 font-medium grid grid-cols-12 px-2 py-1 rounded text-white w-full'>
                        <div className='col-span-1'>No</div>
                        <div className='col-span-8'>Course</div>
                        <div className='col-span-1'>Level</div>
                        <div className='col-span-2 flex justify-center'>Action</div>
                    </div>
                    {selectedYearCourses && selectedYearCourses.map((item: GetCourseInter, index: number) => <div key={item.id} className='font-medium grid grid-cols-12 px-2 py-1 rounded w-full'>
                        <div className='col-span-1'>{index + 1}</div>
                        <div className='col-span-8'>{item.course_name}</div>
                        <div className='col-span-2 flex justify-center'>
                            {!addedCoursesIDs?.includes(item.id) ? <button onClick={() => addCourse(item)} className='bg-bluedark px-4 py-1 rounded text-white'>Select</button>
                                :
                                <button onClick={() => removeCourse(item)} className='bg-bluedark px-4 py-1 rounded text-white'>-</button>}
                        </div>
                    </div>)}
                </div>


                <div className='flex flex-col md:w-1/2 w-full'>
                    <div className='bg-blue-800 font-medium grid grid-cols-12 px-2 py-1 rounded text-white w-full'>
                        <div className='col-span-1'>No</div>
                        <div className='col-span-9'>Course</div>
                        <div className='col-span-2'>Level</div>
                    </div>
                    {toImportCourses && toImportCourses.map((item: GetCourseInter, index: number) => <div key={item.id} className='font-medium grid grid-cols-12 px-2 py-1 rounded w-full'>
                        <div className='col-span-1'>{index + 1}</div>
                        <div className='col-span-9'>{item.course_name}</div>
                    </div>)}
                </div>


            </div>

            <div className='flex items-center justify-center mb-4 mt-10'>
                {selectedYearCourses && toImportCourses && toImportCourses.length && newAdded ?
                    !importClicked ?
                        <button onClick={() => importCourses()} className="bg-green-500 flex font-medium gap-4 items-center justify-center px-10 py-2 rounded text-lg text-white">
                            Import <FaArrowDown />
                        </button>
                        :
                        <div className='flex items-center justify-center mb-2 mt-10'>
                            <div className="animate-spin border-4 border-primary border-solid border-t-transparent flex h-[30px] items-center justify-center rounded-full w-[30px]"></div>
                        </div>
                    :
                    null}
            </div>
        </div>
    )
}

export default CourseTable


