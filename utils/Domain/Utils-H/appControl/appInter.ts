import { UserProfileInter } from "@/serverActions/interfaces";
import { CustomUserInter } from "../userControl/userInter";


export type CampusInter = {
  id: number;
  name: string;
  region: string;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
}

export type SchoolInfoInter = {
  id: number;
  campus: CampusInter;
  main_school: boolean;
  school_identification__platform_charges: number;
  school_name: string;
  school_name_short: string;
  school_type: string;
  country: string;
  po_box: string;
  email: string;
  niu: string;
  telephone: string;
  town: string;
  website: string;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type SysCategoryInter = {
  id: number;
  name: string;
};

export type SysConstantInter = {
  id: number;
  name: string;
  sys_category__id: number;
  sys_category__name: string;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type DomainInter = {
  id: number;
  domain_name: string;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type FieldInter = {
  id: number;
  field_name: string;
  domain: DomainInter;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type MainSpecialtyInter = {
  id: number;
  specialty_name: string;
  field: FieldInter;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type SpecialtyInter = {
  id: number;
  school: SchoolInfoInter;
  main_specialty: MainSpecialtyInter;
  academic_year: string;
  level: LevelInter;
  tuition: number;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type MainCourseInter = {
  id: number;
  course_name: string;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type CourseInter = {
  id: number;
  main_course: MainCourseInter;
  specialty: SpecialtyInter;
  course_code: string;
  course_type: string;
  semester: string;
  course_credit: string;
  completed: boolean;
  assigned: boolean;
  paid: boolean;
  hours: number;
  hours_left: number;
  date_assigned: string;
  assigned_to?: CustomUserInter;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type LevelInter = {
  id: number;
  level: string | number;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type ResultInter = {
  id: number;
  student: UserProfileInter;
  course: CourseInter;
  ca: string;
  exam: string;
  resit: string;
  average: string;
  validated: boolean;
  publish_ca: boolean;
  publish_exam: boolean;
  publish_resit: boolean;
  closed: boolean;
  active: boolean;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};

export type PublishInter = {
  id: number;
  specialty: SpecialtyInter;
  semester: string;
  ca: boolean;
  exam: boolean;
  resit: boolean;
  created_by?: CustomUserInter;
  created_at: string;
  updated_by?: CustomUserInter;
  updated_at: string;
};







export type GetSchoolIdentificationInter = {
  id: number;
  name: string;
  platform_charges: string;
  front_end: string;
  back_end: string;
  school_type: string;
  status: string;
  created_by__full_name?: string;
  created_at: string;
  updated_by__full_name?: string;
  updated_at: string;
};


export type GetSchoolInfoInter = {
  id: number,
  school_identification_id: number,
  director: string,
  school_name: string,
  main_school: boolean;
  address: string,
  town: string,
  region: string,
  country: string,
  po_box: string,
  email: string,
  niu: string,
  ca_limit: number,
  exam_limit: number,
  resit_limit: number,
  telephone_one: string,
  telephone_two: string,
  latitude: number,
  longitude: number,
  website: string,
  bg_logo_transcript: string,
  bg_logo_slip: string,
  logo: string,
  colors: string,
  version: string,
  platform_charges: number,
  short_name: string,
  school_type: string,
  campus: string,
  telephone: string;

  created_at: string,
  updated_at: string,
  created_by_id: number,
  updated_by_id: number,
  created_by_full_name: string,
  updated_by_full_name: string,
};

export type GetSysCategoryInter = {
  id: number;
  name: string;
};

export type GetSysConstantInter = {
  id: number;
  name: string;
  sys_category_id: number;
  sys_category_name: string;
  created_by_id?: number;
  updated_by_id?: number;
  created_by_full_name?: string;
  updated_by_full_name?: string;
};

export type GetDomainInter = {
  id: number;
  domain_name: string;
  created_by_id?: number;
  updated_by_id?: number;
  created_by_full_name?: string;
  updated_by_full_name?: string;
};

export type GetFieldInter = {
  id: number;
  field_name: string;
  domain_id: number;
  domain_name: string;
  created_by_id?: number;
  updated_by_id?: number;
  created_by_full_name?: string;
  updated_by_full_name?: string;
};


export type GetMainSpecialtyInter = {
  id: number;
  field_id: number;
  field_name: string;
  domain_id: number;
  domain_name: string;
  specialty_name: string;
  specialty_name_short: string;
  created_by_id?: number;
  updated_by_id?: number;
  created_by_full_name?: string;
  updated_by_full_name?: string;};


export type GetSpecialtyInter = {
  id: number;
  main_specialty_id: number;
  domain_id: number;
  domain_name: string;
  field_id: number;
  field_name: string;
  specialty_id: number;
  specialty_name: string;
  specialty_name_short: string;
  level_id: number;
  level: number;
  school_id: number;
  school_name: string;
  campus: string;
  region: string;

  academic_year: string;
  tuition: number;
  registration: number;
  payment_one: number;
  payment_two: number;
  payment_three: number;
  created_by_id?: number;
  updated_by_id?: number;
  created_by_full_name?: string;
  updated_by_full_name?: string;
};


export type GetMainCourseInter = {
  id: number;
  field_id: number;
  field_name: string;
  domain_id: number;
  domain_name: string;
  course_name: string;
  created_by_full_name?: string;
};


export type GetCourseInter = {
  id: number;
  student_id: number;
  user_id: number;
  main_course_id: number;
  matricle: string;
  full_name: string;
  course_name: string;
  specialty_id: number;
  specialty_name: string;
  domain_name: string;
  academic_year: string;
  level: number;
  campus: string;
  course_code: string;
  course_type: string;
  semester: string;
  course_credit: string;
  completed: boolean;
  assigned: boolean;
  paid: boolean;
  assigned_to_id?: string;
  region?: string;
  assigned_to_full_name?: string;
  hours: number;
  hours_left: number;
  date_assigned: string;
  created_by_full_name?: string;
};


export type GetResultInter = {
  id: number,
  user_id: number;
  domain_id: number,
  domain_name: string,
  field_id: number,
  field_name: string, 
  specialty_id: number, 
  specialty_name: string, 
  level_id: number,
  level: number,
  course_id: number, 
  course_name: string, 
  academic_year: string, 
  school_id: number, 
  campus: string, 
  region: string,
  course_code: string, 
  semester: string, 
  course_credit: number,
  course_type: string,
  student_id: number, 
  first_name: string, 
  full_name: string, 
  assigned_to_id: number,
  assigned_to_full_name: string, 
  info: any,
  ca: number,
  exam: number, 
  resit: number, 
  average: number, 
  validated: boolean, 
  publish_ca: boolean, 
  publish_exam: boolean, 
  publish_resit: boolean, 
  closed: boolean, 
  active: boolean, 
  created_by_id: number,
  updated_by_id: number,
  created_by_full_name: string,
  updated_by_full_name: string,
  school_name: string;
};


export type GetLevelInter = {
  id: number;
  level: number;
  created_by_full_name?: string;
  updated_at?: string;
};


export type GetPublishInter = {
  id: number;
  domain_id: number;
  domain_name: string;
  specialty_id: number;
  specialty_name: string;
  school_id: number;
  campus: string;
  region: string;
  level: number;
  academic_year: string;
  semester: string,
  ca: boolean;
  exam: boolean;
  resit: boolean;
  portal_ca: boolean;
  portal_exam: boolean;
  portal_resit: boolean;
  created_by_id: number;
  updated_by_id: number;
  created_by_full_name: string;
  updated_by_full_name: string;
};