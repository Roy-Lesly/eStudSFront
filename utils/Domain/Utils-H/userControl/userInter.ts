

export type CustomUserInter = {
  id: number;
  matricle: string;
  username: string;
  full_name: string;
  first_name: string;
  last_name: string;
  address: string;
  sex: string;
  dob: string;
  pob: string;
  role: string;
  dept: string[];
  password: string;
  password_set: boolean;
  telephone: string;
  email: string;
  email_confirmed: boolean;
  is_active: boolean;
  last_login: string;
  created_at: string;
  updated_at: string;
};


export type ProgramInter = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};


export type DeptInter = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};


export type AppearanceInter = {
  id: number;
  user: CustomUserInter;
  dark_mode: string;
  lang: string;
};





export type GetDepartmentInter = {
  id: number;
  name: string;
}


export type GetCustomUserInter = {
  id: number;
  matricle: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  age: string;
  sex: string;
  address: string;
  telephone: string;
  email: string;
  title: string;
  is_active: boolean;
  is_superuser: boolean;
  last_login?: string;
};


export type GetPreInscriptionInter = {
  id: number;
  registration_number: string;
  first_name: string;
  last_name: string;
  full_name: string;
  sex: string;
  email: string;
  telephone: string;
  address: string;
  pob: string;
  dob: string;
  status: string;
  emergency_name: string;
  emergency_town: string;
  emergency_number: string;
  academic_year: string;
  program: string;
  level: number;
  session: string;
  specialty_one: string;
  specialty_two: string;
  campus: string;
};


export type GetUserProfileInter = {
  id: number;
  code: string;
  photo: string;
  user_id: number;
  matricle: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  age: string;
  sex: string;
  address: string;
  telephone: string;
  email: string;
  title: string;
  domain_id: number;
  domain_name: string;
  school_id: number;
  campus: string;
  specialty_id: number;
  specialty_name: string;
  school_name: string;
  academic_year: string;
  level: number;
  tuition: number;
  payment_one: number;
  payment_two: number;
  payment_three: number;
  program__id: number;
  session: string;
  is_active: boolean;
  is_superuser: boolean;
};

export type GeAppearanceInter = {
  id: number;
  matricle: string;
  username: string;
  first: string;
  full_name: string;
  age: string;
  sex: string;
  address: string;
  telephone: string;
  email: string;
  title: string;
  is_active: boolean;
  dark_mode: string;
  lang: string;
};

export type GetProgramInter = {
  id: number;
  name: string;
  description: string;
};