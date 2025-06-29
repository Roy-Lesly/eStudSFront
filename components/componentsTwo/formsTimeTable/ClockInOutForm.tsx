"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { GetCourseInter, GetSchoolInfoInter } from "@/Domain/Utils-H/appControl/appInter";
import { getData, getDistanceBetweenTwoPoints } from "@/functions";
import { ConfigData, protocol } from "@/config";
import { TimeSlotUrl } from "@/Domain/Utils-H/timeControl/timeConfig";
import { GetCourseUrl, GetSchoolInfoUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { ActionEdit } from "@/serverActions/actionGeneral";
import { SchemaCreateEditTimeSlot } from "@/Domain/schemas/schemas";
import { GetTimeSlotInter } from "@/Domain/Utils-H/timeControl/timeInter";


export const SchemaCreate = z.object({
  // status: z.string(),
})
type Inputs = z.infer<typeof SchemaCreate>;

const ClockInOutForm = ({
  type,
  data,
  setOpen,
  params,
}: {
  type: "update";
  // extra_data: { levels: GetLevelInter[] };
  data?: GetTimeSlotInter;
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
  const [courseData, setCourseData] = useState<GetCourseInter | any>();
  const [distance, setDistance] = useState<any>();
  const [campus, setCampus] = useState<GetSchoolInfoInter | any>();
  const [accuracy, setAccuracy] = useState<number>();

  useEffect(() => {
    if (count == 0 && data) {
      setClicked(true)
      const getCourseAndCampus = async () => {
        var course = await getData(protocol + "api" + params.domain + GetCourseUrl, {
          nopage: true, id: data.course_id, }, params.domain)
        if (course && course.length) { setCourseData(course[0]) }
        else { setCourseData({}) }
        var campus = await getData(protocol + "api" + params.domain + GetSchoolInfoUrl, {
          nopage: true, id: params.school_id,  }, params.domain)
        if (campus && campus.length) { setCampus(campus[0]) }
        else { setCampus({}) }
        setClicked(false)
      }
      getCourseAndCampus();
      setCount(1);
    }
    if (count == 1 && data && campus) {
      var myCampusCords = ConfigData[params.domain].higher.campus.filter((item: any) => item.name == campus.campus__name)[0].geolocation
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
        });
        navigator.geolocation.getCurrentPosition(({ coords }) => {
          const { latitude, longitude, accuracy } = coords;
          var d = getDistanceBetweenTwoPoints(latitude, longitude, myCampusCords[0], myCampusCords[1])

          setAccuracy(accuracy)
          setDistance(d)
        })
      }
      setCount(2);
      setClicked(false)

    }
  }, [count, selectedMonthID, selectedWeek, params, thisYear, data, campus])

  const onSubmit = handleSubmit((formVals) => {
    setClicked(true);
    const newData = {
      course_id: data?.course_id,
      timetableday_id: data?.timetableday_id,
      status: data?.status == "PENDING" ? "CHECKED-IN" : "CHECKED-OUT",
      action: data?.status == "PENDING" ? "IN" : "OUT",
      start: data?.start,
      end: data?.end,
      start_time: data?.status == "PENDING" ? new Date().toISOString() : data?.start_time,
      end_time: data?.status == "CHECKED-IN" ? new Date().toISOString() : data?.end_time,
      session: data?.session,
    }
    if (data && data.id && type === "update" && newData.status) {
      const save = async () => {
        var response = await ActionEdit(newData, data.id, SchemaCreateEditTimeSlot, protocol + "api" + params.domain + TimeSlotUrl, params.domain)
        console.log(response)
        if (response && response.id) {
          router.push(`/${params.domain}/Section-H/pageLecturer/${params.school_id}/MyTimeTable/${params.lecturer_id}?customsuccess=CLOCKED ${data?.status == "PENDING" ? "IN" : "OUT"} SUCCESS`)
        }
        setClicked(false);
      }
      save()
    }
  });

  return (
    <form className="bg-slate-300 flex flex-col gap-4 p-4 rounded text-black" onSubmit={onSubmit}>

      <div className="flex font-semibold gap-2 items-center justify-between text-xl">
        <span>{data?.status == "PENDING" ? "Clock In" : "Clock Out"} </span>
        <span className="text-[14px] text-black text-opacity-20">{distance && distance < 100 ? `${distance}` + "m" : null}</span>
      </div>
      {courseData && data ? <div className="border flex flex-col w-full">
        <div className="border flex p-1 w-full"><span className="w-1/4">Course</span><span className="w-3/4">{courseData.main_course__course_name}</span></div>
        <div className="border flex p-1 w-full"><span className="w-1/4">Class</span><span className="w-3/4">{courseData.specialty__main_specialty__specialty_name}</span></div>
        <div className="border flex justify-between p-1 w-full">
          <span className="w-3/12">Year</span>
          <span className="w-5/12">{courseData.specialty__academic_year}</span>
          <span className="w-4/12">Level: {courseData.specialty__level__level}</span>
        </div>
        <div className="border flex p-1 w-full"><span className="w-1/4">Total</span><span className="w-3/4">{courseData.hours} Hours</span></div>
        <div className="border flex p-1 w-full"><span className="w-1/4">Left</span><span className="w-3/4">{courseData.hours_left} Hours</span></div>
        <div className="border flex p-1 w-full"><span className="w-1/4">Hours</span><span className="w-3/4">{data.hours}</span></div>
        <div className="border flex p-1 w-full"><span className="w-1/4">Status</span><span className="w-3/4">{data.status}</span></div>
      </div> : null}

      {distance && distance < ConfigData[params.domain].higher.campus[params.school_id - 1].radius ?
        courseData ?
          data ?
            data.status == "PENDING" ?
              data?.date == new Date().toISOString().slice(0, 10) ?
                <MyButtonModal type={"Clock In"} clicked={clicked} className="bg-green-700 font-semibold tracking-widest" />
                :
                <div className={`p-2 rounded-md text-teal-800 text-lg tracking-widest flex items-center justify-center`}>
                  Not Allowed
                </div>
              :
              data.status == "CHECKED-IN" ?
                data?.date == new Date().toISOString().slice(0, 10) ?
                  <MyButtonModal type={"Clock Out"} clicked={clicked} className="bg-blue-800 font-semibold tracking-widest" />
                  :
                  <div className={`p-2 rounded-md text-teal-800 text-lg tracking-widest flex items-center justify-center`}>
                    Not Allowed
                  </div>
                :
                null
            :
            null
          :
          <div className={`p-2 rounded-md text-white flex items-center justify-center`}>
            <span className="animate-spin border-6 border-t-transparent flex h-[34px] rounded-full w-[34px]">.</span>
          </div>
        :
        <div className={`p-2 border border-black bg-teal-800 text-white rounded flex items-center justify-center`}>
          Not In Range
        </div>
      }

    </form>
  );
};


export default ClockInOutForm