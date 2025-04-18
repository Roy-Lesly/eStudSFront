"use client";
import { z } from "zod";
import { SchemaCreateEditAccount, SchemaTranscriptApplicationEditPrint } from "@/Domain/schemas/schemas";
import { GrStatusGood } from "react-icons/gr";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

type Inputs = z.infer<typeof SchemaCreateEditAccount>;

const ConfirmTranscriptPreview = ({
  type,
  params,
  data,
  setOpen,
  extra_data,
}: {
  type: "custom" | "update" | "delete";
  params?: any;
  data?: any;
  setOpen?: any;
  extra_data?: any;
}) => {

  console.log(`${extra_data[0]}/${data.userprofile__id}`)

  return (
    <>
        <div className="flex flex-col gap-6 items-center justify-center p-10 text-lg">
          <div className="flex gap-4 items-center justify-center">
          <span>Approved</span>
          <span><GrStatusGood size={50} color="green" /></span>
          </div>
          <Link href={`${extra_data[0]}/${data.userprofile__id}`} className="border border-teal-600 flex gap-2 items-center justify-center mt-3 px-6 py-2 rounded">Preview<FaArrowRight size={20} /></Link>
        </div>
    </>
  );
};

export default ConfirmTranscriptPreview;
