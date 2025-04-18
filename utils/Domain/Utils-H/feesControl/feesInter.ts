

export type GetAccountInter = {
  id: number;
  name: string;
  number: string;
  year: string;
  balance: number;
  status: string;
  
}


export type GetSchoolFeesInter = {
  id: number,
  code: string,
  user_id: number,
  userprofile_id: number,
  full_name: string,
  matricle: string,
  dob: string,
  pob: string,
  username: string,
  photo: string,
  specialty_id: number,
  specialty_name: string,
  level: number,
  academic_year: string,
  tuition: number,
  payment_one: number,
  payment_two: number,
  payment_three: number,
  domain_id: number,
  domain_name: string,
  school_id: number,
  campus: string,
  version: string,
  platform_charges: number,
  logo: string,
  platform_paid: boolean,
  balance: number,
  created_at: string,
  updated_at: string,
  created_by_id: number,
  updated_by_id: number,
  created_by_full_name: string,
  updated_by_full_name: string,

  school_identification_id: number,
  director: string,
  school_name: string,
  school_name_short: string,
  school_type: string,
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
  colors: string,
  telephone: string;
};

export type GetTransactionsInter = {
  id: number;
  payment_method: string;
  ref: string;
  reason: string;
  account: string;
  operation_type: string;
  amount: number;
  telephone: string;
  payer_name: string;
  status: string;
  operator: string;
  created_at: string;
  userprofile__id: number;
  full_name: string;
  username: string;
  role: string;
  matricle: string;
  specialty_name: string;
  academic_year: string;
  level: string;
  tuition: number;
  payment_one: number;
  payment_two: number;
  payment_three: number;
  schoolfees__balance: number;
  from_account_id: number;
  from_account_name: string;
  to_account_id: number;
  to_account_name: string;
  created_by_id?: number;
  updated_by_id?: number;
  created_by_full_name?: string;
  updated_by_full_name?: string;
};


export type GetTranscriptApplicationInter = {
  id: number;
  status: string;
  created_by__full_name: string;
  updated_by__full_name: string;
  created_at: string;
  userprofile_id: number;
  full_name: string;
  matricle: string;
  telephone: string;
  specialty_name: string;
  academic_year: string;
  level: string;
  tuition: number;
  payment_one: number;
  payment_two: number;
  payment_three: number;
  print_count: number;
  approved_by_id: number;
  approved_by_full_name: string;
  approved_at: string;
  printed_by_id: number;
  printed_by_full_name: string;
  printed_at: string;
};


export type GetPaymentMethodInter = {
  id: number;
  name: string;
  account_name: string;
  description: string;
  created_by_id?: number;
  updated_by_id?: number;
  created_by_full_name?: string;
  updated_by_full_name?: string;
};


