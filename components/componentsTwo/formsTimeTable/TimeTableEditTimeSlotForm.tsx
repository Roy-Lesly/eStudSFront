"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GetCourseInter } from "@/Domain/Utils-H/appControl/appInter";
import { getWeekRangeOfMonth } from "@/functions";
import { GetTimeSlotInter, EditTimeSlotInter, TimeSlotInter } from "@/Domain/Utils-H/timeControl/timeInter";
import { ConfigData, protocol } from "@/config";
import { GrClose } from "react-icons/gr";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { CircularProgressbar } from "react-circular-progressbar";
import { ActionEdit } from "@/serverActions/actionGeneral";
import { SchemaCreateEditTimeSlot } from "@/Domain/schemas/schemas";
import { TimeSlotUrl } from "@/Domain/Utils-H/timeControl/timeConfig";

interface UpdateTimeSlots extends EditTimeSlotInter {
  status: boolean
}

export const SchemaCreate = z.object({
  course_id: z.coerce.number(),
  start: z.string(),
})
type Inputs = z.infer<typeof SchemaCreate>;

const TimeTableEditTimeSlotForm = ({
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
  const [clickedSelected, setClickedSelected] = useState<{ id: number, slotType: "start" | "end" | "course" }>();
  const [dataToUpdate, setDataToUpdate] = useState<UpdateTimeSlots[]>();
  const [processingLevel, setProcessingLevel] = useState<number>(0);

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
      setMondaysData(r);
      setCount(2);
    }
  }, [count, selectedMonthID, selectedWeek, params, thisYear, data])

  const onUpdate = () => {
    if (dataToUpdate?.length) {
      setClicked(true)
      setProcessingLevel(2)
      for (let index = 0; index < dataToUpdate.length; index++) {
        var data_for_timeslot = {
          ...dataToUpdate[index],
          status: "PENDING",
          action: "PENDING",
        }
        const call = async () => {
          var responseSlot = await ActionEdit(data_for_timeslot, dataToUpdate[index].id, SchemaCreateEditTimeSlot, protocol + "api" + params.domain + TimeSlotUrl, params.domain)

          if (responseSlot && responseSlot.id) {
            setProcessingLevel(index + 1 * 100 / dataToUpdate.length)
            if (index == dataToUpdate.length - 1) {
              setClicked(false)
              router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/${params.specialty_id}/list/?updated=Operation Successful&&time=${new Date()}`)
            }
          }
        }
        call()
      }
    }
  };

  const onChange = (newTime: string) => {
    if (newTime && clickedSelected?.id) {
      var fil = data?.filter((item: GetTimeSlotInter) => item.id == clickedSelected.id)[0]
      if (dataToUpdate && fil) {
        if (dataToUpdate.filter((item: UpdateTimeSlots) => item.id === clickedSelected.id).length) {
          setDataToUpdate(dataToUpdate.map((item: UpdateTimeSlots) =>
            item.id === clickedSelected.id ? {
              id: item.id,
              title: clickedSelected.slotType == "course" ? newTime : item.title, 
              course_id: clickedSelected.slotType == "course" ? parseInt(newTime) : item.course_id,
              start: clickedSelected.slotType == "start" ? item.start.slice(0, 11) + newTime + ":00" : item.start,
              end: clickedSelected.slotType == "end" ? item.end.slice(0, 11) + newTime + ":00" : item.end,
              timetableday_id: item.timetableday_id,
              status: true,
              hours: item.hours, start_time: item.start_time, end_time: item.end_time, session: item.session
            }
              :
              item
          ))
        }
        else {
          setDataToUpdate([
            ...dataToUpdate,
            {
              id: fil.id,
              title: clickedSelected.slotType == "course" ? extra_data.apiCourses.filter((item: GetCourseInter) => item.id == parseInt(newTime))[0].course_name : fil.title, 
              course_id: clickedSelected.slotType == "course" ? parseInt(newTime) : fil.course_id,
              start: clickedSelected.slotType == "start" ? fil.start.slice(0, 11) + newTime + ":00" : fil.start,
              end: clickedSelected.slotType == "end" ? fil.end.slice(0, 11) + newTime + ":00" : fil.end,
              timetableday_id: fil.timetableday_id,
              status: true,
              hours: fil.hours, start_time: fil.start_time, end_time: fil.end_time, session: fil.session
            }])
        }
      }
      if (!dataToUpdate && fil) {
        setDataToUpdate([{
          id: fil.id,
          title: clickedSelected.slotType == "course" ? extra_data.apiCourses.filter((item: GetCourseInter) => item.id == parseInt(newTime))[0].course_name : fil.title,
          course_id: clickedSelected.slotType == "course" ? parseInt(newTime) : fil.course_id,
          start: clickedSelected.slotType == "start" ? fil.start.slice(0, 11) + newTime + ":00" : fil.start,
          end: clickedSelected.slotType == "end" ? fil.end.slice(0, 11) + newTime + ":00" : fil.end,
          timetableday_id: fil.timetableday_id,
          status: true,
          hours: fil.hours, start_time: fil.start_time, end_time: fil.end_time, session: fil.session
        }])
      }
    }
  }


  const onDelete = (item: GetTimeSlotInter) => {
    alert("About To Delete Time Slot -" + item.title)
    console.log(item)
    // if (data && data.id && type === "update" && newData.month && newData.week && newData.session) {
    //   setClicked(true);
    //   if (timetableweek && timetableweek.id) {
    //     router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/${data.id}/edit?weekNo=${newData.week}&session=${newData.session}&tbw=${timetableweek.id}`);
    //   } else {
    //     router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/${data.id}?weekNo=${newData.week}&session=${newData.session}`)
    //   };
    // }
  };

  console.log(data)
  console.log(extra_data.apiCourses)


  return (
    <div className="bg-slate-300 flex flex-col gap-1 p-2 rounded text-black">
      {/* <h1 className="font-medium">Week: {extra_data.week}</h1> */}
      <h1 className="font-medium text-lg">Update</h1>
      <h1 className="font-semibold italic text-lg">{extra_data.day} {extra_data.slots.length ? extra_data.slots[0].timetableday__date : null}</h1>

      <div className="flex flex-col gap-4 justify-between mb-4 w-full">

        {data && data.map((time: GetTimeSlotInter) => <div key={time.id} className="flex flex-row font-medium gap-1 items-start justify-start text-[14px] w-full">
          <div className="text-[13px] tracking-tight w-[9%]">{time.start.slice(11, 16)}</div>
          <div className="text-[13px] tracking-tight w-[9%]">{time.end.slice(11, 16)}</div>
          <div className="italic text-wrap w-[52%]">
            <select name="course_id" defaultValue={time.course_id} className="w-full" onClick={() => setClickedSelected({ id: time.id, slotType: "course" })} onChange={(e) => onChange(e.target.value)}>
              {/* <option value="">{time.title}</option> */}
              {extra_data.apiCourses.map((cou: GetCourseInter) => <option key={cou.id} value={cou.id}>{cou.course_name}</option>)}
            </select>
          </div>
          <div className="flex flex-row gap-2 w-[30%]">
            <select name="start_time" className="w-full" onClick={() => setClickedSelected({ id: time.id, slotType: "start" })} onChange={(e) => onChange(e.target.value)}>
              <option value="">--</option>
              <option value="08:00">8H</option>
              <option value="10:00">10H</option>
              <option value="13:00">13H</option>
              <option value="15:00">15H</option>
              <option value="17:00">17H</option>
              <option value="19:00">19H</option>
            </select>
            <select name="end_time" className="w-full" onClick={() => setClickedSelected({ id: time.id, slotType: "end" })} onChange={(e) => onChange(e.target.value)}>
              <option value="">--</option>
              <option value="10:00">10H</option>
              <option value="12:00">12H</option>
              <option value="15:00">15H</option>
              <option value="17:00">17H</option>
              <option value="19:00">19H</option>
              <option value="21:00">21H</option>
            </select>
            <button className="font-bold text-red" onClick={() => onDelete(time)}>
              <GrClose color="red" />
            </button>
          </div>
        </div>)}

        {dataToUpdate?.length ?
          <div className="flex gap-4 items-center justify-center">
            <button onClick={() => { onUpdate() }} className="bg-blue-400 font-semibold px-4 py-2 rounded text-[16px]">Update</button>
            {processingLevel ? <div className="flex h-16 items-center justify-center w-16">{true ? <CircularProgressbar value={processingLevel} text={`${processingLevel}%`} /> : null}</div> : null}

          </div> : null}

      </div>

    </div>
  );
};


export default TimeTableEditTimeSlotForm