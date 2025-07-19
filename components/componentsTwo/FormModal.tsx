"use client";

import MyLoadingModal from "@/section-h/common/MyButtons/MyLoadingModal";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

// USE LAZY LOADING
const UsersForm = dynamic(() => import("./formsProfiles/UsersForm"), { loading: () => <MyLoadingModal />, });
const LecturersForm = dynamic(() => import("./formsProfiles/LecturersForm"), { loading: () => <MyLoadingModal />, });
const StudentsForm = dynamic(() => import("./formsProfiles/StudentsForm"), { loading: () => <MyLoadingModal />, });
const AdminsForm = dynamic(() => import("./formsProfiles/AdminsForm"), { loading: () => <MyLoadingModal />, });
const DomainForm = dynamic(() => import("./formSettings/DomainForm"), { loading: () => <MyLoadingModal /> });
const FieldForm = dynamic(() => import("./formSettings/FieldForm"), { loading: () => <MyLoadingModal /> });
const MainSpecialtyForm = dynamic(() => import("./formSettings/MainSpecialtyForm"), { loading: () => <MyLoadingModal /> });
const SpecialtyForm = dynamic(() => import("./formSettings/SpecialtyForm"), { loading: () => <MyLoadingModal /> });
const MainCourseForm = dynamic(() => import("./formSettings/MainCourseForm"), { loading: () => <MyLoadingModal /> });
const CourseForm = dynamic(() => import("./formSettings/CourseForm"), { loading: () => <MyLoadingModal /> });
const SysCategoryForm = dynamic(() => import("./formsAdmin/SysCategoryForm"), { loading: () => <MyLoadingModal /> });
const SysConstantForm = dynamic(() => import("./formsAdmin/SysConstantForm"), { loading: () => <MyLoadingModal /> });
const AccountCreateForm = dynamic(() => import("./formsUtility/account/AccountCreateForm"), { loading: () => <MyLoadingModal /> });
const DepartmentForm = dynamic(() => import("./formsAdmin/DepartmentForm"), { loading: () => <MyLoadingModal /> });
const AccountForm = dynamic(() => import("./formsAdmin/AccountForm"), { loading: () => <MyLoadingModal /> });
const LevelForm = dynamic(() => import("./formSettings/LevelForm"), { loading: () => <MyLoadingModal /> });
const ProgramForm = dynamic(() => import("./formSettings/ProgramForm"), { loading: () => <MyLoadingModal /> });
const CreateFeePreselectForm = dynamic(() => import("./formAccounting/CreateFeePreselectForm"), { loading: () => <MyLoadingModal /> });
const PayPlatFormAndIdCardForm = dynamic(() => import("./formsUtility/PayPlatFormAndIdCardForm"), { loading: () => <MyLoadingModal /> });
const PayPlatFormAndIdCardFormSec = dynamic(() => import("./formsUtility/PayPlatFormAndIdCardFormSec"), { loading: () => <MyLoadingModal /> });
const PayPlatFormAndIdCardFormPrim = dynamic(() => import("./formsUtility/PayPlatFormAndIdCardFormPrim"), { loading: () => <MyLoadingModal /> });
const PayFeesForm = dynamic(() => import("./formsAdmin/PayFeesForm"), { loading: () => <MyLoadingModal /> });
const AssignStudentToSpecialtyForm = dynamic(() => import("./formsProfiles/AssignStudentToSpecialtyForm"), { loading: () => <MyLoadingModal /> });
const AdmitStudentFromPreInscriptionForm = dynamic(() => import("./formsProfiles/AdmitStudentFromPreInscriptionForm"), { loading: () => <MyLoadingModal /> });
const TimeTableSelectMonth = dynamic(() => import("./formsTimeTable/TimeTableSelectMonth"), { loading: () => <MyLoadingModal /> });
const ClockInOutForm = dynamic(() => import("./formsTimeTable/ClockInOutForm"), { loading: () => <MyLoadingModal /> });
const TimeTableEditTimeSlotForm = dynamic(() => import("./formsTimeTable/TimeTableEditTimeSlotForm"), { loading: () => <MyLoadingModal /> });


const forms: {
  [key: string]: (type: "create" | "update" | "delete" | "custom" | any, params: any, setOpen: any, data?: any, extra_data?: any) => JSX.Element;
} = {
  users: (type, params, setOpen, data, extra_data) => <UsersForm type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
  admins: (type, params, setOpen, data) => <AdminsForm type={type} data={data} params={params} setOpen={setOpen} />,
  lecturer: (type, params, setOpen, data) => <LecturersForm type={type} data={data} params={params} setOpen={setOpen} />,
  student: (type, params, setOpen, data, extra_data) => <StudentsForm type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
  domain: (type, params, setOpen, data) => <DomainForm type={type} data={data} params={params} setOpen={setOpen} />,
  field: (type, params, setOpen, data) => <FieldForm type={type} data={data} params={params} setOpen={setOpen} />,
  main_specialty: (type, params, setOpen, data,) => <MainSpecialtyForm type={type} data={data} params={params} setOpen={setOpen} />,
  specialty: (type, params, setOpen, data, extra_data) => <SpecialtyForm type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
  main_course: (type, params, setOpen, data) => <MainCourseForm type={type} data={data} params={params} setOpen={setOpen} />,
  course: (type, params, setOpen, data, extra_data) => <CourseForm type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
  level: (type, params, setOpen, data) => <LevelForm type={type} data={data} params={params} setOpen={setOpen} />,
  program: (type, params, setOpen, data) => <ProgramForm type={type} data={data} params={params} setOpen={setOpen} />,

  admit_student_from_preinscription: (type, params, setOpen, data, extra_data) => <AdmitStudentFromPreInscriptionForm type={type} data={data} params={params} setOpen={setOpen} extra_data={extra_data} />,
  assign_student_to_specialty: (type, params, setOpen, data, extra_data) => <AssignStudentToSpecialtyForm type={type} data={data} params={params} setOpen={setOpen} extra_data={extra_data} />,
  sys_constant: (type, params, setOpen, data) => <SysConstantForm type={type} data={data} params={params} setOpen={setOpen} />,
  sys_category: (type, params, setOpen, data) => <SysCategoryForm type={type} data={data} params={params} setOpen={setOpen} />,
  accounts_create: (type, params, setOpen, data, extra_data) => <AccountCreateForm type={type} data={data} params={params} setOpen={setOpen} extra_data={extra_data} />,
  department: (type, params, setOpen, data) => <DepartmentForm type={type} data={data} params={params} setOpen={setOpen} />,
  account: (type, params, setOpen, data) => <AccountForm type={type} data={data} params={params} setOpen={setOpen} />,
  pay_fees: (type, params, setOpen, data, extra_data,) => <PayFeesForm type={type} params={params} data={data} setOpen={setOpen} extra_data={extra_data} />,
  platform_and_id_card: (type, params, setOpen, data, extra_data) => <PayPlatFormAndIdCardForm type={type} params={params} setOpen={setOpen} data={data} extra_data={extra_data} />,
  platform_and_id_card_sec: (type, params, setOpen, data, extra_data) => <PayPlatFormAndIdCardFormSec type={type} params={params} setOpen={setOpen} data={data} extra_data={extra_data} />,
  platform_and_id_card_prim: (type, params, setOpen, data, extra_data) => <PayPlatFormAndIdCardFormPrim type={type} params={params} setOpen={setOpen} data={data} extra_data={extra_data} />,
  create_fees_preselect: (type, params, setOpen, data) => <CreateFeePreselectForm apiDomains={data} params={params} setOpen={setOpen} />,
  timetable_select_month: (type, params, setOpen, data) => <TimeTableSelectMonth data={data} type={type} params={params} setOpen={setOpen} />,
  timetable_clock_in_form: (type, params, setOpen, data, extra_data) => <ClockInOutForm data={data} type={type} params={params} setOpen={setOpen} />,
  timetable_edit_timeslot_form: (type, params, setOpen, data, extra_data) => <TimeTableEditTimeSlotForm data={data} type={type} params={params} setOpen={setOpen} extra_data={extra_data} />,
};

const FormModal = ({
  table,
  type,
  data,
  extra_data,
  icon,
  params,
  buttonTitle,
  customClassName,
  formClassName,
}: {
  table:
  | "login_reconnect"
  | "users"
  | "admins"
  | "lecturer"
  | "student"
  | "domain"
  | "field"
  | "main_course"
  | "course"
  | "main_specialty"
  | "specialty"
  | "level"
  | "program"
  | "pay_fees"
  | "transcript_application"

  | "admit_student_from_preinscription"
  | "assign_student_to_specialty"
  | "create_fees_preselect"
  | "create_fees"
  | "transaction_details"

  | "platform_charge"
  | "platform_and_id_card"
  | "platform_and_id_card_sec"
  | "platform_and_id_card_prim"
  | "parent"
  | "subject"
  | "class"
  | "lesson"
  | "exam"
  | "assignment"
  | "result"
  | "attendance"
  | "announcement"
  | "pending_activation"
  | "department"
  | "account"
  | "sys_category"
  | "sys_constant"
  | "accounts_update"
  | "accounts_create"

  //Timetable Higher
  | "timetable_select_month"
  | "timetable_clock_in_form"
  | "timetable_edit_timeslot_form";
  type: "create" | "update" | "delete" | "custom" | "custom";
  icon: React.ReactNode;
  params?: any;
  buttonTitle?: string;
  customClassName?: string;
  data?: any;
  extra_data?: any;
  id?: number;
  formClassName?: string;
}) => {
  const size = type === "create" ? "md:w-10 md:h-10 w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-green-400"
      : type === "update"
        ? "bg-blue-400"
        : "bg-red";

  const [open, setOpen] = useState(false);

  const Form = () => {
    return type === "create" || type === "update" || type === "delete" || type === "custom" ? (
      forms[table](type, params, setOpen, data, extra_data)
    ) : (
      <div>Form not found!</div>
    );
  };

  return (
    <>

      <span
        className={` ${type === "custom" ? customClassName : `${size} ${bgColor} rounded-full`} gap-2 flex items-center justify-center `}
        onClick={() => setOpen(true)}
      >
        {buttonTitle}
        {icon}
      </span>
      {open && (
        <div className="absolute bg-black bg-opacity-60 flex h-screen items-center justify-center left-0 top-0 w-full z-50">
          <div className={`${formClassName ? formClassName : "bg-white m-20 md:w-[60%] sm:w-[75%] w-[90%] xl:w-[45%]"}  mx-auto p-4 relative rounded-md `}>
            <Form />
            <div
              className="absolute cursor-pointer right-4 top-4"
              onClick={() => setOpen(false)}
            >
              <Image src="/icons/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
