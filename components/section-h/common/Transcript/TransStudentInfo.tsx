import React from 'react'

const TransStudentInfo = ({ studentInfo }: any) => {

  return (
    <div className="flex flex-col gap-6 h-[90px] pb-2 px-4">
      <div className='flex flex-row gap-6'>

        <div className='flex flex-col gap-0 w-full'>
          <div className="gap-4 grid grid-cols-12 h-[18px] w-full">
            <div className='col-span-3'>Matricle:</div>
            <div className='col-span-5 flex font-medium italic justify-end text-black'>{studentInfo.user__matricle}</div>
            <div className='col-span-2'>Program:</div>
            <div className='col-span-2 flex font-medium italic justify-end text-black'>{studentInfo.program__name}</div>
          </div>
          <div className="gap-0 grid grid-cols-10 h-[19px] w-full">
            <div className='col-span-1'>Name:</div>
            <div className='col-span-9 flex font-medium italic justify-end text-black text-md'>{studentInfo.user__full_name}</div>
          </div>
          <div className="gap-4 grid grid-cols-3 h-[18px] w-full">
            <div className='col-span-1'>Date Of Birth:</div>
            <div className='col-span-2 flex font-medium italic justify-end text-black'>{studentInfo.user__dob}</div>
          </div>
          <div className="gap-4 grid grid-cols-3 h-[18px] w-full">
            <div className='col-span-1'>Place Of Birth:</div>
            <div className='col-span-2 flex font-medium italic justify-end text-black'>{studentInfo.user__pob}</div>
          </div>
        </div>

        <div className='flex flex-col gap-0 w-full'>  
        <div className="gap-4 grid grid-cols-3 h-[18px] w-full">
            <div className='col-span-1'>Domain:</div>
            <div className='col-span-2 flex font-medium italic justify-end text-black'>{studentInfo.specialty__main_specialty__field__domain__domain_name}</div>
          </div>        
          <div className="gap-4 grid grid-cols-12 h-[18px] w-full">
            <div className='col-span-2'>Field:</div>
            <div className='col-span-10 flex font-medium italic justify-end text-[13px] text-black'>{studentInfo.specialty__main_specialty__field__field_name}</div>
          </div>

          <div className="gap-4 grid grid-cols-10 h-[18px] w-full">
            <div className='col-span-2'>Specialty:</div>
            <div className='col-span-8 flex font-medium italic justify-end text-[13px] text-black'>{studentInfo.specialty__main_specialty__specialty_name}</div>
          </div>
          <div className="gap-4 grid grid-cols-6 h-[18px] w-full">
            <div className='col-span-2'>Academic Year:</div>
            <div className='col-span-2 flex font-medium italic justify-end text-black'>{studentInfo.specialty__academic_year}</div>
            <div className='col-span-1'>Level:</div>
            <div className='col-span-1 flex font-medium italic justify-end text-black'>{studentInfo.specialty__level__level}</div>
          </div>
          <div className="gap-4 grid grid-cols-8 h-[18px] w-full">
            </div>
        </div>

      </div>
    </div>
  )
}

export default TransStudentInfo