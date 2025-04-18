import { protocol } from '@/config';
import { GetSpecialtyInter } from '@/Domain/Utils-H/appControl/appInter'
import { SchemaCreateEditSpecialty } from '@/Domain/schemas/schemas';
import { SpecialtyUrl } from '@/Domain/Utils-H/appControl/appConfig';
import { ActionCreate } from '@/serverActions/actionGeneral';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaArrowDown } from 'react-icons/fa6';

const SpecialtyTable = ({ params, thisYear, existingYearSpecialties, setExistingYearSpecialties, toImportSpecialties }: GetSpecialtyInter[] | any) => {

    const router = useRouter();
    const [count, setCount] = useState<number>(0);
    const [addedSpecialties, setAddedSpecialties] = useState<GetSpecialtyInter[]>();
    const [copyExistingYearSpecialties, setCopyExistingYearSpecialties] = useState<GetSpecialtyInter[]>();
    const [addedSpecialtiesIDs, setAddedSpecialtiesIDs] = useState<number[]>();
    const [importClicked, setImportClicked] = useState<boolean>(false);
    const [newAdded, setNewAdded] = useState<boolean>(false);

    useEffect(() => {
        if (count == 0 && existingYearSpecialties){
            setCopyExistingYearSpecialties(existingYearSpecialties);
            setCount(1)
        }
        if (count == 1){

        }
    }, [existingYearSpecialties, count])


    const addSpecialty = (spec: GetSpecialtyInter) => {

        if (existingYearSpecialties) { 
            var found = existingYearSpecialties.find((item: GetSpecialtyInter) => (item.specialty_name == spec.specialty_name && item.level == spec.level))
            if (!found){
                setNewAdded(true)
                setExistingYearSpecialties([...existingYearSpecialties, spec])
            }
            var foundAdded = addedSpecialties?.find((item: GetSpecialtyInter) => (item.specialty_name == spec.specialty_name && item.level == spec.level))
            if (!foundAdded && addedSpecialties){
                setAddedSpecialties([...addedSpecialties, spec]);
            }
            if (!foundAdded && !addedSpecialties && !found){
                setAddedSpecialties([spec]);
            }
            if (!foundAdded && addedSpecialtiesIDs && !found){
                setAddedSpecialtiesIDs([...addedSpecialtiesIDs, spec.id]);
            }
            if (!foundAdded && !addedSpecialtiesIDs && !found){
                setAddedSpecialtiesIDs([spec.id]);
            }
        }
        else {
            setAddedSpecialties([spec]);
            setExistingYearSpecialties([spec])
            setAddedSpecialtiesIDs([spec.id]);
        }
    }

    const removeSpecialty = (spec: any) => {
        if (addedSpecialties && existingYearSpecialties) { 
            var found = addedSpecialties.find((item: GetSpecialtyInter) => item.id == spec.id)
            if (found){
                const filA = addedSpecialties.filter((item: GetSpecialtyInter) => item.id != spec.id);
                const filB = addedSpecialtiesIDs?.filter((item: number) => item != spec.id)
                setAddedSpecialties([...filA])

                console.log(filA)
                console.log(filB)
                console.log(existingYearSpecialties)
                console.log(addedSpecialties)
                console.log(addedSpecialtiesIDs)
                console.log(copyExistingYearSpecialties);

                if (filA && filA.length > 0){
                    setAddedSpecialties(filA);
                    setAddedSpecialtiesIDs(filB)
                    if (copyExistingYearSpecialties){ setExistingYearSpecialties([...copyExistingYearSpecialties, ...filA]) }
                    else { setExistingYearSpecialties(filA) }
                } else {
                    setAddedSpecialties(filA)
                    setAddedSpecialtiesIDs(filB)
                    if (copyExistingYearSpecialties){ setExistingYearSpecialties(copyExistingYearSpecialties) }
                }
            }
        }
    }

    console.log("========================================================================================")
    console.log(existingYearSpecialties)
    console.log(addedSpecialties)
    console.log(addedSpecialtiesIDs)
    console.log(copyExistingYearSpecialties);

    const importSpecialties = async () => {
        setImportClicked(true);
        if (addedSpecialties && addedSpecialties.length > 0) {
            await Promise.allSettled(addedSpecialties.map((item: GetSpecialtyInter, index: number) => {
                console.log(item)
                const data = {
                    school_id: params.school_id,
                    main_specialty_id: item.main_specialty_id,
                    academic_year: thisYear,
                    level_id: item.level_id,
                    tuition: item.tuition,
                    payment_one: item.payment_one,
                    payment_two: item.payment_two,
                    payment_three: item.payment_three,
                }
                return (
                    ActionCreate(data, SchemaCreateEditSpecialty, protocol + "api" + params.domain + SpecialtyUrl)
                )
            }))
                .then(res => {
                    console.log(10500, res)
                    if (res && res.length > 0) {
                        const t = res.map(item => item.status)
                        if (t[0] == "fulfilled") { router.push(`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageImport?updated=SUCCESSFULLY !!!`); }
                        else { router.push(`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageImport/pageImportSpecialties?error=${t[0]}`); }
                    }
                })
                .catch(err => {
                    console.log(98, err)
                })
            return
        } else {
            // console.log(103, "Not Logged In")
        }
    }

    return (
        <div className='flex flex-col gap-2 w-full'>
            <div className='flex flex-col gap-2 md:flex-row w-full'>

                <div className='flex flex-col w-2/5'>
                    <div className='bg-blue-800 font-medium grid grid-cols-12 px-2 py-1 rounded text-white w-full'>
                        <div className='col-span-1'>No</div>
                        <div className='col-span-9'>Specialty</div>
                        <div className='col-span-2'>Level</div>
                    </div>
                    {existingYearSpecialties && existingYearSpecialties.map((item: GetSpecialtyInter, index: number) => <div key={item.id} className='font-medium grid grid-cols-12 px-2 py-1 rounded w-full'>
                        <div className='col-span-1'>{index + 1}</div>
                        <div className='col-span-9'>{item.specialty_name}</div>
                        <div className='col-span-2'>{item.level}</div>
                    </div>)}
                </div>


                <div className='flex flex-col w-3/5'>
                    <div className='bg-blue-800 font-medium grid grid-cols-12 px-2 py-1 rounded text-white w-full'>
                        <div className='col-span-1'>No</div>
                        <div className='col-span-8'>Specialty</div>
                        <div className='col-span-1'>Level</div>
                        <div className='col-span-2 flex justify-center'>Action</div>
                    </div>
                    {toImportSpecialties && toImportSpecialties.map((item: GetSpecialtyInter, index: number) => <div key={item.id} className='font-medium grid grid-cols-12 px-2 py-1 rounded w-full'>
                        <div className='col-span-1'>{index + 1}</div>
                        <div className='col-span-8'>{item.specialty_name}</div>
                        <div className='col-span-1'>{item.level}</div>
                        <div className='col-span-2 flex justify-center'>
                            {!addedSpecialtiesIDs?.includes(item.id) ? <button onClick={() => addSpecialty(item)} className='bg-bluedark px-4 py-1 rounded text-white'>Select</button>
                                :
                                <button onClick={() => removeSpecialty(item)} className='bg-bluedark px-4 py-1 rounded text-white'>-</button>}
                        </div>
                    </div>)}
                </div>

            </div>

            <div className='flex items-center justify-center mb-4 mt-10'>
                {existingYearSpecialties && copyExistingYearSpecialties && (copyExistingYearSpecialties.length != existingYearSpecialties.length) && newAdded ?
                    !importClicked ?
                        <button onClick={() => importSpecialties()} className="bg-green-500 flex font-medium gap-4 items-center justify-center px-10 py-2 rounded text-lg text-white">
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

export default SpecialtyTable


