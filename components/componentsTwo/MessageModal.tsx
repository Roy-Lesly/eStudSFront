"use client";
import MyLoadingModal from "@/section-h/common/MyButtons/MyLoadingModal";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

// USE LAZY LOADING
const ConfirmTranscriptApply = dynamic(() => import("./messageForms/ConfirmTranscriptApply"), { loading: () => <MyLoadingModal />, });
const ConfirmTranscriptApprove = dynamic(() => import("./messageForms/ConfirmTranscriptApprove"), { loading: () => <MyLoadingModal />, });
const ConfirmTranscriptPreview = dynamic(() => import("./messageForms/ConfirmTranscriptPreview"), { loading: () => <MyLoadingModal />, });
const ConfirmTranscriptPrint = dynamic(() => import("./messageForms/ConfirmTranscriptPrint"), { loading: () => <MyLoadingModal />, });
const ResultSlip = dynamic(() => import("./messageForms/ResultSlip"), { loading: () => <MyLoadingModal />, });
const ExcelExtract = dynamic(() => import("./messageForms/ExcelExtract"), { loading: () => <MyLoadingModal />, });
const ExcelExtractProfiles = dynamic(() => import("./messageForms/ExcelExtractProfiles"), { loading: () => <MyLoadingModal />, });
const ExcelExtractAccountingInfo = dynamic(() => import("./messageForms/ExcelExtractAccountingInfo"), { loading: () => <MyLoadingModal />, });
const AdmittedPreincriptionStudentDetails = dynamic(() => import("./messageForms/AdmittedPreincriptionStudentDetails"), { loading: () => <MyLoadingModal />, });
const TransactionDetailsForm = dynamic(() => import("./formsUtility/TransactionDetailsForm"), { loading: () => <MyLoadingModal />, });
const StudentIDCard = dynamic(() => import("./messageForms/StudentIDCard"), { loading: () => <MyLoadingModal /> });
const PortalPublishResult = dynamic(() => import("./messageForms/PortalPublishResult"), { loading: () => <MyLoadingModal /> });
const TranscriptOneYear = dynamic(() => import("./messageForms/TranscriptOneYear"), { loading: () => <MyLoadingModal /> });
const TranscriptTwoYear = dynamic(() => import("./messageForms/TranscriptTwoYear"), { loading: () => <MyLoadingModal /> });
const TranscriptThreeYear = dynamic(() => import("./messageForms/TranscriptThreeYear"), { loading: () => <MyLoadingModal /> });

const forms: {
  [key: string]: (type: "create" | "update" | "delete" | "custom" | any, params: any, setOpen: any, data?: any, extra_data?: any ) => JSX.Element;
} = {
  portal_publish_result: (type, params, setOpen, data, extra_data) => <PortalPublishResult type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
  confirm_apply_transcript: (type, params, setOpen, data, extra_data) => <ConfirmTranscriptApply type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
  confirm_approve_transcript: (type, params, setOpen, data, extra_data) => <ConfirmTranscriptApprove type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
  confirm_preview_transcript: (type, params, setOpen, data, extra_data) => <ConfirmTranscriptPreview type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
  confirm_print_transcript: (type, params, setOpen, data, extra_data) => <ConfirmTranscriptPrint type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
  result_slip: (type, params, setOpen, data, extra_data) => <ResultSlip type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
  excel_extract: (type, params, setOpen, data, extra_data) => <ExcelExtract type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
  excel_profiles: (type, params, setOpen, data, extra_data) => <ExcelExtractProfiles type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
  excel_accounting_info: (type, params, setOpen, data, extra_data) => <ExcelExtractAccountingInfo type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
  admitted_preincription_student_details: (type, params, setOpen, data, extra_data) => <AdmittedPreincriptionStudentDetails type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen} />,
  transaction_details: (type, params, setOpen, data, extra_data, ) => <TransactionDetailsForm type={type} params={params} data={data} setOpen={setOpen} extra_data={extra_data} />,
  student_id_card: (type, params, setOpen, data) => <StudentIDCard type={type} data={data} params={params} setOpen={setOpen} />,
  transcript_one_year: (type, params, setOpen, data, extra_data) => <TranscriptOneYear type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen}  />,
  transcript_two_year: (type, params, setOpen, data, extra_data) => <TranscriptTwoYear type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen}  />,
  transcript_three_year: (type, params, setOpen, data, extra_data) => <TranscriptThreeYear type={type} data={data} extra_data={extra_data} params={params} setOpen={setOpen}  />,
};

const MessageModal = ({
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
    | "portal_publish_result"
    | "confirm_apply_transcript"
    | "confirm_approve_transcript"
    | "confirm_preview_transcript"
    | "confirm_print_transcript"
    | "result_slip"
    | "excel_extract"
    | "excel_profiles"
    | "excel_accounting_info"
    | "admitted_preincription_student_details"
    | "transaction_details"
    | "student_id_card"
    | "transcript_one_year"
    | "transcript_two_year"
    | "transcript_three_year"
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
  const size = type === "custom" ? "md:w-12 md:h-12 w-10 h-10" : "w-7 h-7";
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
        className={` ${type === "custom" ? customClassName : `${size} flex rounded-full` } items-center justify-center `}
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

export default MessageModal;
