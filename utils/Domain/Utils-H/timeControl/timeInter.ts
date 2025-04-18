import { CourseInter, SpecialtyInter } from "../appControl/appInter";
import { CustomUserInter } from "../userControl/userInter";


export type TimeTableWeekInter = {
  id: number;
  specialty: SpecialtyInter;
  year_week: string;
  publish: boolean;
  created_by_id?: number;
  updated_by_id?: number;
  created_by_full_name?: string;
  updated_by_full_name?: string;
};

export type TimeTableDayInter = {
  id: number;
  date: string;
  day: string;
  timetableweek_: TimeTableWeekInter;
  created_by_id?: number;
  updated_by_id?: number;
  created_by_full_name?: string;
  updated_by_full_name?: string;
};

export type TimeSlotInter = {
  id: number;
  title: string;
  timetableday :TimeTableDayInter;
  course: CourseInter;
  start: string;
  end: string;
  start_time: string;
  end_time: string;
  hours: number;
  created_by_id?: number;
  updated_by_id?: number;
  created_by_full_name?: string;
  updated_by_full_name?: string;
};


export type GetTimeTableWeekInter = {
  id: number;
  domain_id: number;
  domain_name: string;
  specialty_id: number;
  specialty_name: string;
  academic_year: string;
  level: number;

  year_week: string;
  publish: boolean;
  created_by_full_name?: string;
};

export type GetTimeTableDayInter = {
  doamin__id: number;
  doamin_name: string;
  specialty_id: number;
  specialty_name: string;
  academic_year: string;
  level: number;
  timetableweek_id: number;
  year_week: string;
  publish: boolean;
  date: string;
  day: string;
  created_by_id?: number;
  updated_by_id?: number;
  created_by_full_name?: string;
  updated_by_full_name?: string;}


export type GetTimeSlotInter = {
  id: number;
  domain_id: number;
  domain_name: string;
  specialty_id: number;
  specialty_name: string;
  course_id: number;
  course_name: string;
  academic_year: string;
  level: number;

  timetableweek_id: number;
  year_week: number,
  timetableday_id: number;
  date: string;
  day: string;
  publish: boolean;
  title: string;
  start: string;
  end: string;
  start_time: string;
  end_time: string;
  time?: string;
  hours: number;
  session: string;
  status: string;

  created_by_id?: number;
  updated_by_id?: number;
  created_by_full_name?: string;
  updated_by_full_name?: string;
};

export type EditTimeSlotInter = {
  id: number;
  title: string;
  timetableday_id: number;
  course_id: number;
  start: string;
  end: string;
  start_time: string;
  end_time: string;
  hours: number;
  session: string;
};
