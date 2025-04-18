import { CourseInter } from "../appControl/appInter";


export type NotificationInter = {
  id: number;
  specialty_id: number;
  specialty_name: string;
  year_week: string;
  created_by_id?: number;
  updated_by_id?: number;
  created_by_full_name?: string;
  updated_by_full_name?: string;
};

export type ComplainInter = {
  id: number;
  day: string;
  period_0812: CourseInter;
  period_1317: CourseInter;
  period_1721: CourseInter;
  assigned: string;
  signed_in: string;
  signed_our: string;
  created_by_id?: number;
  updated_by_id?: number;
  created_by_full_name?: string;
  updated_by_full_name?: string;
};

export type UserActivityInter = {
  id: number;
  day: string;
  created_by_id?: number;
  updated_by_id?: number;
  created_by_full_name?: string;
  updated_by_full_name?: string;
};


export type GetNotificationInter = {
  id: number;
  message_one: string;
  message_two?: string;
  target?: string;
  noti_type: string;
  status: boolean;
  created_at?: string;
  ending_at?: string;
  created_by_id?: number;
  updated_by_id?: number;
  created_by_full_name?: string;
  updated_by_full_name?: string;
};

export type GetComplainInter = {
  id: number;
  specialty_id: number;
  created_by_id?: number;
  updated_by_id?: number;
  created_by_full_name?: string;
  updated_by_full_name?: string;
};

export type GetUserActivityInter = {
  id: number;
  specialty_id: number;
  created_by_id?: number;
  updated_by_id?: number;
  created_by_full_name?: string;
  updated_by_full_name?: string;
};

