'use client';
import { MyButtonSubmitCreate } from '@/section-h/common/MyButtons/MyButtonSubmit';
import { GetDomainInter, GetSchoolInfoInter, GetSpecialtyInter } from '@/Domain/Utils-H/appControl/appInter';
import React, { useEffect, useState } from 'react';

const MultiSelect = ({ formFieldName, options, type }: any) => {

    const [count, setCount] = useState<number>(0)
    const [valueIDs, setValueIDs] = useState<string[]>([]);

    useEffect(() => {
        if (count == 0) {
            setCount(1)
        }
    }, [count])

    const onChange = (newValue: string) => {
        setCount(0)
        var remove = []
        if (valueIDs.includes(newValue)){
            remove = valueIDs.filter((item) => item != newValue)
            var r = [...new Set([...remove])]
            setValueIDs(r);
        } else {
            var r = [...new Set([...valueIDs, newValue])]
            setValueIDs(r);
        } 
    }

    console.log(options, 30)
    return (
        <div className='flex flex-col gap-2 w-full'>

            <div className='flex flex-col gap-2 justify-between md:flex-row md:gap-6 md:text-lg text-sm'>
                <div className='flex items-center justify-center md:w-1/2 w-full'>
                    <label className="block dark:text-white font-medium mb-2 md:w-full text-black w-1/3">
                        Select {formFieldName}
                    </label>
                    <select
                        multiple
                        name={formFieldName}
                        required={true}
                        defaultValue={valueIDs}
                        onChange={(e) => onChange(e.target.value)}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 md:px-10 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${true ? "text-black dark:text-white" : ""
                            }`}
                    >
                        <option value={0}>------------------</option>
                        {type == "schools" && options && options.map((item: GetSchoolInfoInter) => (<option key={item.id} value={item.id} className={`${valueIDs.includes(item.id.toString()) ? "bg-blue-200" : ""} dark:text-bodydark my-2 text-body`}>
                            {item.town} - {item.campus} - {item.school_name}
                        </option>)
                        )}
                        {type == "domains" && options && options.map((item: GetDomainInter) => (<option key={item.id} value={item.id} className={`${valueIDs.includes(item.id.toString()) ? "bg-blue-200" : ""} dark:text-bodydark my-2 text-body`}>
                            {item.domain_name}
                        </option>)
                        )}
                        {type == "specialty" && options && options.map((item: GetSpecialtyInter) => (<option key={item.id} value={item.id} className={`${valueIDs.includes(item.id.toString()) ? "bg-blue-200" : ""} dark:text-bodydark my-2 text-body`}>
                            {item.specialty_name} - {item.level} - {item.academic_year}
                        </option>)
                        )}
                    </select>
                </div>
            </div>

        </div>
    )
}

export default MultiSelect


export const SubmitAdmitStudentButton = () => {
    const [ submitClicked, setSubmitClicked ] = useState(false)

    return (
        <div className='flex items-center justify-center'>
        {submitClicked ? 
        <div className="animate-spin border-4 border-greenlight border-solid border-t-transparent h-10 mt-4 rounded-full w-10"></div>
        : 
        <div onClick={() => setSubmitClicked(true)}><MyButtonSubmitCreate /></div>
        }
    </div>
    )
}