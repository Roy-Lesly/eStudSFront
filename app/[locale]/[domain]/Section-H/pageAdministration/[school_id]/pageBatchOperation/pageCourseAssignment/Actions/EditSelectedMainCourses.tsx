import React, { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { FaRightLong, FaPlus } from 'react-icons/fa6';
import MyButtonLoading from '@/section-h/common/MyButtons/MyButtonLoading';
import { EdgeCustomUser } from '@/utils/Domain/schemas/interfaceGraphql';
import Select from "react-select";
import { decodeUrlID } from '@/utils/functions';
import { SelectedMainCousesAssignProps } from './List';
import { gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ApiFactory } from '@/utils/graphql/ApiFactory';



const List = (
    { data, setPage, page, apiLecturer, apiAdmin, params, searchParams }:
        { data: SelectedMainCousesAssignProps[], setPage: any, page: number, apiLecturer: EdgeCustomUser[], apiAdmin: EdgeCustomUser[], params: any, searchParams: any }
) => {

    const router = useRouter();
    const { t } = useTranslation("common");
    const [loading, setLoading] = useState<boolean>(false);

    const updateField = (id: number, field: string, value: any) => {
        const index = data.findIndex(d => d.mainCourseId === id);
        if (index !== -1) {
            (data[index] as any)[field] = value;
            if (field === "hours") {
                (data[index] as any)["hoursLeft"] = value;
            }
            if (field === "assignedToId") {
                (data[index] as any)["assigned"] = true;
            }
            if (field === "courseCode") {
                (data[index] as any)["courseCode"] = value.toUpperCase();
            }
        }
    };

    const submit = async () => {
        setLoading(true);

        try {
            let count = 0
            for (const course of data) {
                if (
                    !course?.courseType ||
                    !course?.courseCode ||
                    course.courseCredit < 1 ||
                    course.hours < 1
                ) {
                    alert(`${course.courseName} ${t("is missing required fields")}.`);
                    continue;
                }
                const res = await ApiFactory({
                    newData: { ...course, delete: false },
                    mutationName: "createUpdateDeleteCourse",
                    modelName: "course",
                    successField: "courseCode",
                    query,
                    router,
                    params,
                    redirect: false,
                    redirectPath: `/${params.locale}/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageCourseAssignment`,
                    actionLabel: "processing",
                });
                count = count + (res || 0)
            }
            if (count === data.length) {
                router.push(
                    `/${params.locale}/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageCourseAssignment`
                );
            }
        } catch (error) {
            console.error("Error submitting courses:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2 w-full text-black">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-7 gap-2 px-4 py-2 bg-teal-900 text-white rounded-lg shadow-md"
            >
                <span className="font-semibold col-span-2">Course Name</span>
                <span className="hidden md:block">Code</span>
                <span className="hidden md:block">Credit</span>
                <span className="hidden md:block">Hours</span>
                <span className="hidden md:block">Type</span>
                <span className="hidden md:block">Lecturer</span>
            </motion.div>

            {data?.map((item, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="grid grid-cols-2 md:grid-cols-8 gap-2 items-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow hover:shadow-lg transition-all duration-300"
                >
                    <span className="col-span-2 font-medium dark:text-white">{item.courseName}</span>
                    <input
                        type="text"
                        defaultValue={item.courseCode}
                        onChange={e => updateField(item.mainCourseId, 'courseCode', e.target.value)}
                        className="hidden md:block px-2 py-1 rounded border w-full"
                    />
                    <input
                        type="number"
                        defaultValue={item.courseCredit}
                        onChange={e => updateField(item.mainCourseId, 'courseCredit', parseInt(e.target.value))}
                        className="hidden md:block px-2 py-1 rounded border w-full"
                    />
                    <input
                        type="number"
                        defaultValue={item.hours}
                        onChange={e => updateField(item.mainCourseId, 'hours', parseInt(e.target.value))}
                        className="hidden md:block px-2 py-1 rounded border w-full"
                    />
                    <select
                        defaultValue={item.courseType}
                        onChange={e => updateField(item.mainCourseId, 'courseType', e.target.value)}
                        className="hidden md:block px-2 py-1 rounded border"
                    >
                        <option value="">----</option>
                        <option value="Transversal">Transversal</option>
                        <option value="Fundamental">Fundamental</option>
                        <option value="Professional">Professional</option>
                    </select>
                    <div className="hidden md:block col-span-2">
                        <Select
                            defaultValue={([...apiLecturer, ...apiAdmin]
                                .filter((d: EdgeCustomUser) => parseInt(decodeUrlID(d.node.id)) === item?.assignedToId)
                                .map((item: EdgeCustomUser) => { return { value: `${parseInt(decodeUrlID(item.node.id))}`, label: item.node.fullName } })
                            )}
                            isMulti={false}
                            name="assignedToId"
                            options={[...apiLecturer, ...apiAdmin].map((item: EdgeCustomUser) => { return { value: `${parseInt(decodeUrlID(item.node.id))}`, label: item.node.fullName } })}
                            onChange={(e: { value: string, label: string } | null) => { updateField(item.mainCourseId, 'assignedToId', parseInt(e?.value || "0")) }}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            required
                        />
                    </div>
                </motion.div>
            ))}

            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {page === 2 && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPage(1)}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl shadow-md flex items-center gap-2"
                    >
                        <FaPlus /> Add More
                    </motion.button>
                )}

                {page === 2 && (
                    loading ? (
                        <MyButtonLoading title="Saving ..." />
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={submit}
                            className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2 rounded-xl shadow-md flex items-center gap-2"
                        >
                            Confirm And Save <FaRightLong />
                        </motion.button>
                    )
                )}
            </div>
        </div>
    );
};

export default List;



const query = gql`
  mutation Create(
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