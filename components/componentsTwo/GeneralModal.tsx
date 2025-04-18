"use client";
import MyLoadingModal from "@/section-h/common/MyButtons/MyLoadingModal";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

// USE LAZY LOADING
const ModalExpiredSession = dynamic(() => import("./messageForms/ModalExpiredSession"), { loading: () => <MyLoadingModal /> });

const modals: {
  [key: string]: (type: "general" | "update" | "delete" | "custom" | any, params: any, setOpen: any, data?: any, extra_data?: any ) => JSX.Element;
} = {
  expired_session: (type, params, setOpen, open, extra_data) => <ModalExpiredSession params={params} open={open} setOpen={setOpen} />,
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
    | "publish_result"
  type: "general";
  icon: React.ReactNode;
  params?: any;
  buttonTitle?: string;
  customClassName?: string;
  data?: any;
  extra_data?: any;
  id?: number;
  formClassName?: string;
}) => {

  const [open, setOpen] = useState(false);

  const Modal = () => {
    return type === "general" ? (
      modals[table](type, params, setOpen, data, extra_data)
    ) : (
      <div>Modal not found!</div>
    );
  };

  return (
    <>
      {open && (
        <div className="absolute bg-black bg-opacity-60 flex h-screen items-center justify-center left-0 top-0 w-full z-50">
          <div className={`${formClassName ? formClassName : "bg-white m-20 md:w-[60%] sm:w-[75%] w-[90%] xl:w-[45%]"}  mx-auto p-4 relative rounded-md `}>
            <Modal />
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
