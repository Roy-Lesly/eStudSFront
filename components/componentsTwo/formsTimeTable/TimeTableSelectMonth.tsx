"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import SelectField from "@/componentsTwo/SelectField";
import { GetSpecialtyInter } from "@/Domain/Utils-H/appControl/appInter";
import { getData, getWeekRangeOfMonth } from "@/functions";
import { MonthList } from "@/constants";
import { GetTimeTableWeekInter } from "@/Domain/Utils-H/timeControl/timeInter";
import { protocol } from "@/config";
import { GetTimeTableWeekUrl } from "@/Domain/Utils-H/timeControl/timeConfig";


export const SchemaCreate = z.object({
  month: z.coerce.number(),
  week: z.string(),
  session: z.string(),
  interval: z.string(),
})
type Inputs = z.infer<typeof SchemaCreate>;

const TimeTableSelectMonth = ({
  type,
  data,
  setOpen,
  params,
}: {
  type: "update";
  // extra_data: { levels: GetLevelInter[] };
  data?: GetSpecialtyInter;
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
  const [timetableweek, setTimeTableWeek] = useState<GetTimeTableWeekInter | any>();
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
      const getTBW = async () => {
        var tbw = await getData(protocol + "api" + params.domain + GetTimeTableWeekUrl, { nopage: true, year_week: selectedWeek, specialty__id: data?.id }, params.domain)
        if (tbw && tbw.length) { setTimeTableWeek(tbw[0]) }
        else { setTimeTableWeek({}) }
        setClicked(false)
      }
      getTBW();
      setMondaysData(r);
      setCount(2);
    }
  }, [count, selectedMonthID, selectedWeek, params, thisYear, data])

  const onSubmit = handleSubmit((formVals) => {
    const newData = {
      month: parseInt(formVals.month.toString()),
      week: parseInt(formVals.week.toString()),
      session: formVals.session,
      interval: formVals.interval,
    }
    if (data && data.id && type === "update" && newData.month && newData.week && newData.session && newData.interval) {
      setClicked(true);
      if (timetableweek && timetableweek.id){
        router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/${data.id}/edit?weekNo=${newData.week}&session=${newData.session}&tbw=${timetableweek.id}&interval=${newData.interval}`);
      } else {
      router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/${data.id}?weekNo=${newData.week}&session=${newData.session}&interval=${newData.interval}`)
    };
    }
  });

  const SelectMonths = MonthList.filter((item: { id: number, value: string }) => [thisMonth, thisMonth + 1].includes(item.id))
  const intervals = [ 
    { name: "2H (8-10, 10-12 ...)", value: 2}, 
    { name: "4H (8-12, 13-17 ...)", value: 4 },
    { name: "3H (8-11, 13-16 ...)", value: 3 },
    // { name: "1H (8-9, 9-10, 10-11 ...)", value: 1 }, 
  ]

  return (
    <form className="bg-slate-300 flex flex-col gap-4 p-4 rounded text-black" onSubmit={onSubmit}>
      <h1 className="font-semibold text-xl">Select Period</h1>

      <div className="flex flex-wrap gap-4 justify-between mb-4">
        <SelectField
          label="Select Month"
          name="month"
          register={register}
          error={errors?.month}
          display={{ name: "value", value: "id" }}
          data={SelectMonths}
          functions={[setCount, setSelectedMonthID, 1]}
        />
        <SelectField
          label="Period"
          name="week"
          register={register}
          error={errors?.week}
          display={{ name: "week", value: "weekNo" }}
          data={mondaysData}
          functions={[setCount, setSelectedWeek, 2]}
        />
        <SelectField
          label="Session"
          name="session"
          register={register}
          error={errors?.week}
          data={["Morning", "Evening"]}
        />
        <SelectField
          label="Time Interval"
          name="interval"
          register={register}
          error={errors?.interval}
          display={{ name: "name", value: "value" }}
          data={intervals}
        />
      </div>

      {
        timetableweek ? timetableweek?.id ?
          <MyButtonModal type={"Update"} clicked={clicked} className="bg-blue-800 font-semibold tracking-widest" />
          :
          <MyButtonModal type={"Next"} clicked={clicked} className="bg-green-800 font-semibold tracking-widest" />
          :
          <>{selectedMonthID && <button className={`p-2 rounded-md text-white flex items-center justify-center`}>
            <span className="animate-spin border-6 border-t-transparent flex h-[34px] rounded-full w-[34px]">.</span>
          </button>}</>
      }

    </form>
  );
};


export default TimeTableSelectMonth