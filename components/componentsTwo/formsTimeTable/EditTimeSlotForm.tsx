"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GetCourseInter } from "@/Domain/Utils-H/appControl/appInter";
import { getWeekRangeOfMonth } from "@/functions";
import { TimeSlotsList } from "@/constants";
import { GetTimeSlotInter, GetTimeTableWeekInter, TimeSlotInter } from "@/Domain/Utils-H/timeControl/timeInter";
import { FaDeleteLeft } from "react-icons/fa6";
import { ConfigData } from "@/config";


export const SchemaCreate = z.object({
  course_id: z.coerce.number(),
  start: z.string(),
})
type Inputs = z.infer<typeof SchemaCreate>;

const EditTimeSlotForm = ({
  type,
  data,
  setOpen,
  params,
  extra_data
}: {
  type: "update";
  extra_data: { day: string, week: string, apiCourses: GetCourseInter[], slots: TimeSlotInter[] | any };
  data?: GetTimeSlotInter[];
  setOpen?: any;
  params?: any;
}) => {
  const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({
    resolver: zodResolver(SchemaCreate),
  });

  const thisYear = new Date().getFullYear()
  const thisMonth = new Date().getMonth() + 1
  const router = useRouter();
  const [count, setCount] = useState<number>(0);
  const [clicked, setClicked] = useState<boolean>(false);
  const [selectedMonthID, setSelectedMonthID] = useState<number>();
  const [selectedWeek, setSelectedWeek] = useState<string>();
  const [mondaysData, setMondaysData] = useState<any>();

  useEffect(() => {
    if (count == 1 && selectedMonthID) {
      setClicked(true)
      var r = getWeekRangeOfMonth(selectedMonthID, thisYear, "join")
      setMondaysData(r);
      setCount(2);
      setClicked(false)
    }
    if (count == 2 && selectedWeek && selectedMonthID && data) {
      setClicked(true)
      var r = getWeekRangeOfMonth(selectedMonthID, thisYear, "join")
      // const getTBW = async () => {
      //   var tbw = await getData(protocol + "api" + params.domain + GetTimeTableWeekUrl, { nopage: true, year_week: selectedWeek, specialty__id: data?.id })
      //   if (tbw && tbw.length) { setTimeTableWeek(tbw[0]) }
      //   else { setTimeTableWeek({}) }
      //   setClicked(false)
      // }
      // getTBW();
      setMondaysData(r);
      setCount(2);
    }
  }, [count, selectedMonthID, selectedWeek, params, thisYear, data])

  const onSubmit = handleSubmit((formVals) => {
    const newData = {
      month: parseInt(formVals.course_id.toString()),
      start: formVals.start,
    }
    // if (data && data.id && type === "update" && newData.month && newData.week && newData.session) {
    //   setClicked(true);
    //   if (timetableweek && timetableweek.id) {
    //     router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/${data.id}/edit?weekNo=${newData.week}&session=${newData.session}&tbw=${timetableweek.id}`);
    //   } else {
    //     router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/${data.id}?weekNo=${newData.week}&session=${newData.session}`)
    //   };
    // }
  });

  return (
    <form className="bg-slate-300 flex flex-col gap-1 p-2 rounded text-black" onSubmit={onSubmit}>
      {/* <h1 className="font-medium">Week: {extra_data.week}</h1> */}
      <h1 className="font-medium text-lg">Update</h1>
      <h1 className="font-semibold italic text-lg">{extra_data.day} {extra_data.slots.length ? extra_data.slots[0].timetableday__date : null}</h1>

      <div className="flex flex-col gap-4 justify-between mb-4 w-full">

        {ConfigData[params.domain].higher.timeslots.map((timeslot: string) => {
          let dataItem = extra_data.slots?.filter((item: GetTimeSlotInter) => item.time == timeslot)
          if (dataItem && dataItem.length) return <div className="flex gap-1 text-[14px] w-full" key={dataItem[0].id}>
            <select name={timeslot} className="px-1 rounded w-1/3" defaultValue={dataItem[0].time}>
              {ConfigData[params.domain].higher.timeslots.map((ts: string) => <option key={ts}>{ts}</option>)}
            </select>
            <input name="course_id" className="p-2 rounded w-full" defaultValue={dataItem[0].title} />
            <input name="id" className="hidden" defaultValue={dataItem[0].id} />
            <button className="border flex h-10 items-center justify-center mx-1 rounded-full w-16"><FaDeleteLeft size={20} color="red"/></button>
            {/* <input type="date" defaultValue={dataItem[0].start} /> */}
          </div>
          return null
        })}

      </div>

    </form>
  );
};


export default EditTimeSlotForm