import React from 'react'

const TranscriptSemester = async ({ semResults }: any) => {
  const getNum = (n: number) => {
    var h = 20
    var t = 16
    if (n > 9){ h = 20, t = 16}
    if (n > 11){ h = 18, t = 14}
    if (n > 14) { h = 16, t = 12}
    return [h, t]
  }
  var num = await getNum(semResults.count);

  const checkResit: any = (av: number, resit: number | null) => {
    if (resit){ 
      if (av){ return <span className={`${av < 50 ? "text-red font-medium" : ""}`}><b className={` mr-2 text-red`}>*</b>{av.toFixed(1)}</span>}
      return "-"
    } else {
      if (av){ return <span className='ml-4'>{av.toFixed(1)}</span>}
      return <span className='ml-4'>-</span>
    }
  }

  return (
    <div className='border-2 gap-0 w-full'>

      <div className={`bg-teal-700 font-medium grid grid-cols-12 px-2 text-white text-[13px]`}>
        <div className='col-span-2'>CODE</div>
        <div className='col-span-5'>COURSE NAME</div>
        <div className='col-span-1 flex items-center justify-center'>CV</div>
        <div className='col-span-1 flex items-center justify-center'>Marks</div>
        <div className='col-span-1 flex items-center justify-center'>WP</div>
        <div className='col-span-1 flex items-center justify-center'>GP</div>
        <div className='col-span-1 flex items-center justify-center'>GD</div>
      </div>    

      {/* {semResults && semResults.results.map((item: GetResultInter) =>  */}
      {semResults && semResults.results.map((item: any) => 
      <div key={item.id} className={`font-medium grid grid-cols-12 h-[${num[0]}px] items-center justify-center odd:bg-teal-50 px-2 text-[${num[1]}px] text-black`}>
        <div className='col-span-2'>{item.course_code}</div>
        <div className={`${item.course_name.length < 36 ? "text-[14px]" 
          : item.course_name.length < 41 ? "text-[13px]" 
            : item.course_name.length < 43 ? "text-[12px]" 
              : item.course_name.length < 45 ? "text-[11px]" 
                : "text-[10px]"} col-span-5 row-span-3 text-wrap`}>{item.course_name}</div>
        <div className='col-span-1 flex items-center justify-center'>{item.course_credit}</div>
        <div className='col-span-1 flex items-center justify-center'>{checkResit(item.average, item.resit)}</div>
        {/* <div className='col-span-1 flex items-center justify-center'>{calcWP(item.course__course_credit, item.average, item.average, item.ca, item.exam)}</div> */}
        <div className='col-span-1 flex items-center justify-center'>{item.wp}</div>
        <div className='col-span-1 flex items-center justify-center'>{item.gp}</div>
        {/* <div className='col-span-1 flex items-center justify-center'>{calcGP(item.average, item.ca, item.exam)}</div> */}
        {/* <div className='col-span-1 flex items-center justify-start pl-6'>{calcGD(item.average)}</div> */}
        <div className='col-span-1 flex items-center justify-start pl-6'>{item.gd}</div>
      </div> )}

      <div className='flex flex-row font-medium gap-6 items-end justify-end mt-1 px-2 py-1 text-[13px]'>
        <div>Total Credit: {semResults.total_credit}</div>
        <div>Attemted Credit: {semResults.total_credit_attempted}</div>
        <div>Credit Earned: {semResults.total_credit_earned}</div>
        <div>GPA: {semResults.gp.toFixed(2)}</div>
      </div>      
    </div>
  )
}

export default TranscriptSemester