import React, { FC, useState } from 'react'
import { FaLeftLong, FaRightLong } from 'react-icons/fa6'
import { SelectedMainCousesAssignProps } from './CourseAssignAction'
import MyButtonLoading from '@/section-h/common/MyButtons/MyButtonLoading'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import SearchLecturer from './SearchLecturer'
import { SchemaCreateEditCourse } from '@/Domain/schemas/schemas'
import { ActionCreate } from '@/serverActions/actionGeneral'
import { GetCustomUserInter } from '@/Domain/Utils-H/userControl/userInter'
import { CourseUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { protocol } from '@/config'
import { gql, useMutation } from '@apollo/client'
import { FaPlus } from 'react-icons/fa'


interface PageProps {
    selectedMainCoursesAssign: any
    setData: any
    setPage: any
    page: number
    apiLecturer: any
    apiAdmin: any
}
const EditSelectedMainCourses: FC<PageProps> = ({ selectedMainCoursesAssign, setPage, page, setData, apiLecturer, apiAdmin }) => {

    return (
        <div>
            <List data={selectedMainCoursesAssign} setPage={setPage} page={page} setData={setData} apiLecturer={apiLecturer} apiAdmin={apiAdmin} />
        </div>
    )
}

export default EditSelectedMainCourses



interface ListProps {
    data: SelectedMainCousesAssignProps[]
    setData?: any
    setPage: any
    page: number
    apiLecturer: GetCustomUserInter[]
    apiAdmin: GetCustomUserInter[]
}

const List: FC<ListProps> = ({ data, setPage, page, setData, apiLecturer, apiAdmin }) => {

    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const domain = useParams().domain;

    const updateCourseCode = (main_course_id: number, code: string) => {
        var found = data.find((item: SelectedMainCousesAssignProps) => item.mainCourseId == main_course_id)
        if (found) {
            var index = data.findIndex((d) => d.mainCourseId === main_course_id);
            found.courseCode = code.toUpperCase()
            data[index] = found
        }
    }
    const updateCourseCredit = (main_course_id: number, credit: number) => {
        var found = data.find((item: SelectedMainCousesAssignProps) => item.mainCourseId == main_course_id)
        if (found) {
            var index = data.findIndex((d) => d.mainCourseId === main_course_id);
            found.courseCredit = credit
            data[index] = found
        }
    }
    const updateCourseType = (main_course_id: number, type: string) => {
        var found = data.find((item: SelectedMainCousesAssignProps) => item.mainCourseId == main_course_id)
        if (found) {
            var index = data.findIndex((d) => d.mainCourseId === main_course_id);
            found.courseType = type
            data[index] = found
        }
    }
    const updateCourseHours = (main_course_id: number, hours: number) => {
        var found = data.find((item: SelectedMainCousesAssignProps) => item.mainCourseId == main_course_id)
        if (found) {
            var index = data.findIndex((d) => d.mainCourseId === main_course_id);
            found.hours = hours
            found.hoursLeft = hours
            data[index] = found
        }
    }
    const updateCourseAssignedTo = (main_course_id: number, lecturer_id: number) => {
        var found = data.find((item: SelectedMainCousesAssignProps) => item.mainCourseId == main_course_id)
        if (found) {
            console.log(found, 83)
            var index = data.findIndex((d) => d.mainCourseId === main_course_id);
            found.assignedToId = lecturer_id
            data[index] = found
        }
    }
    const removeItem = (main_course_id: number) => {
        var found = data.find((item: SelectedMainCousesAssignProps) => item.mainCourseId == main_course_id)
        if (found) {
            var newData = data.filter((d: SelectedMainCousesAssignProps) => d.mainCourseId != main_course_id);
            setData([...newData])
        }
    }

    const [createUpdateDeleteCourse] = useMutation(CREATE_UPDATE_DELETE_COURSE);

    const submit = async () => {
        const isInvalid = data.some(
            (item: SelectedMainCousesAssignProps) =>
                !item.courseCode || !item.courseCredit || !item.hours || !item.courseType
        );
    
        if (isInvalid || !pathname) return;
    
        console.log(data, 114)
        // return
        setLoading(true);
    
        try {
            // Create an array of promises
            const promises = data.map(async (dataToSubmit) => {
                console.log(dataToSubmit, 118);
                return createUpdateDeleteCourse({
                    variables: {
                        ...dataToSubmit,
                        hoursLeft: parseInt(dataToSubmit?.hoursLeft.toString()),
                        delete: false
                    }
                });
            });
    
            // Execute all promises and get their statuses
            const results = await Promise.allSettled(promises);
    
            // Separate successful and failed courses
            let successCourses: string[] = [];
            let failedCourses: string[] = [];
    
            results.forEach((result, index) => {
                if (result.status === "fulfilled") {
                    const courseName = result.value?.data?.createUpdateDeleteCourse?.course?.mainCourse?.courseName || "Unknown";
                    successCourses.push(courseName);
                } else {
                    const failedCourse = data[index]?.courseName || "Unknown";
                    failedCourses.push(failedCourse);
                }
            });
    
            // Build alert message
            let message = "";
            if (successCourses.length) {
                message += `✅ Successfully Created:\n${successCourses.join("\n")}\n\n`;
            }
            if (failedCourses.length) {
                message += `❌ Failed to Create:\n${failedCourses.join("\n")}`;
            }
    
            alert(message.trim());
            window.location.reload()
        } catch (err) {
            console.error("Error in submission:", err);
            alert(`Error domain: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    // console.log(pathname, 128)

    return (
        <>
            <div className="2xl:px-6 bg-teal-900 border-stroke border-t dark:border-strokedark grid grid-cols-10 md:px-4 px-2 py-1 text-teal-50">

                <div className="col-span-3 items-center justify-start md:col-span-3 md:flex">
                    <span className="font-medium">COURSE NAME</span>
                </div>

                <div className="hidden items-center justify-center md:flex">
                    <span className="font-medium">Code</span>
                </div>

                <div className="hidden items-center justify-center md:flex">
                    <span className="font-medium">Credit</span>
                </div>

                <div className="hidden items-center justify-center md:flex">
                    <span className="font-medium">Hours</span>
                </div>

                <div className="hidden items-center justify-center md:flex">
                    <span className="font-medium">Type</span>
                </div>

                <div className="col-span-2 hidden items-center justify-center md:flex">
                    <span className="font-medium">Lecturer</span>
                </div>

                <div className="hidden items-center justify-center md:flex">
                    <span className="font-medium">Remove</span>
                </div>

            </div>
            {
                data && data.length > 0 && data.map((item: SelectedMainCousesAssignProps, index: number) => (
                    <div
                        className="2xl:px-6.5 bg-white border-stroke border-t dark:bg-slate-700 dark:border-strokedark font-semibold grid grid-cols-10 md:px-4 px-3 py-2 text-sm tracking-widest"
                        key={index}
                    >

                        <div className="col-span-3 items-center justify-start md:flex">
                            <span className="dark:text-white text-black">
                                {item.courseName}
                            </span>
                        </div>

                        <div className="hidden items-center justify-center md:flex">
                            <input
                                defaultValue={item.courseCode}
                                type='text'
                                onChange={(e) => { updateCourseCode(item.mainCourseId, e.target.value) }}
                                className='border-2 px-2 py-1 text-black w-20'
                            />
                        </div>

                        <div className="hidden items-center justify-center md:flex">
                            <input
                                defaultValue={item.courseCredit}
                                type='number'
                                onChange={(e) => { updateCourseCredit(item.mainCourseId, parseInt(e.target.value)) }}
                                className='border-2 px-2 py-1 text-black w-16'
                            />
                        </div>

                        <div className="hidden items-center justify-center md:flex">
                            <input
                                defaultValue={item.hours}
                                type='number'
                                onChange={(e) => { updateCourseHours(item.mainCourseId, parseInt(e.target.value)) }}
                                className='border-2 px-2 py-1 text-black w-16'
                            />
                        </div>

                        <div className="items-center justify-center md:flex">
                            <select defaultValue={item.courseType} onChange={(e) => { updateCourseType(item.mainCourseId, e.target.value) }} className='border-2 px-1 py-1 rounded'>
                                <option value={""}>-------------</option>
                                <option value={"Transversal"}>Transversal</option>
                                <option value={"Fundamental"}>Fundamental</option>
                                <option value={"Professional"}>Professional</option>
                            </select>
                        </div>

                        <>
                            <SearchLecturer apiLecturer={[...apiLecturer, ...apiAdmin]} updateCourseAssignedTo={updateCourseAssignedTo} item={item} />
                        </>

                        <div className="hidden items-center justify-center md:flex">
                            <button onClick={(e) => { removeItem(item.mainCourseId) }} className='font-bold text-xl'>-</button>
                        </div>

                    </div>
                ))
            }

            <div className='bg-white dark:bg-slate-300 flex flex-row font-semibold gap-4 justify-center mt-2 p-4 text-black text-lg tracking-widest'>
                {page == 2 && <div className='flex items-center justify-start'>
                    <button onClick={() => { setPage(1) }} className='bg-green-400 flex gap-2 items-center justify-center px-6 py-2 rounded'>
                        {/* <FaLeftLong /> */}
                        <FaPlus />
                        Add
                    </button>
                </div>}

                <span className='flex items-center justify-end md:ml-20'>
                    {page == 2 && !loading ? <button onClick={() => { submit(); }} className='bg-red flex gap-2 items-center justify-center px-6 py-2 rounded text-white'>
                        Confirm And Save
                        <FaRightLong />
                    </button>
                        :
                        <MyButtonLoading title="Saving ..." />
                    }
                </span>


            </div>
        </>
    )
}




const CREATE_UPDATE_DELETE_COURSE = gql`
  mutation Update(
    $id: ID,
    $mainCourseId: ID!,
    $specialtyId: ID!,
    $courseCode: String!,
    $courseCredit: Int!,
    $courseType: String!,
    $semester: String!,
    $hours: Int!,
    $hoursLeft: Int!,
    $assigned: Boolean,
    $assignedToId: ID,
    $delete: Boolean!,
    $createdById: ID,
    $updatedById: ID

  ) {
    createUpdateDeleteCourse(
      id: $id
      mainCourseId: $mainCourseId
      specialtyId: $specialtyId
      courseCode: $courseCode
      courseCredit: $courseCredit
      courseType: $courseType
      semester: $semester
      hours: $hours
      hoursLeft: $hoursLeft
      assigned: $assigned
      assignedToId: $assignedToId
      delete: $delete
      createdById: $createdById
      updatedById: $updatedById
    ) {
      course {
        id mainCourse { courseName}
      }
    }
  }
`;
