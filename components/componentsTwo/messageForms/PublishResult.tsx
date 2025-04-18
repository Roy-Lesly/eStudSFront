"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ActionEdit } from "@/serverActions/actionGeneral";
import { SchemaCreateEditPublish } from "@/Domain/schemas/schemas";
import { PublishUrl } from "@/Domain/Utils-H/appControl/appConfig";
import { protocol } from "@/config";

const SchemaCreate = z.object({
  domain_id: z.coerce.number().optional(),
  academic_year: z.string().optional(),
  level_id: z.coerce.number().optional(),
  specialty_id: z.coerce.number().int(),
  program_id: z.coerce.number().int(),
  session: z.enum(["Morning", "Evening"]),
});

type Inputs = z.infer<typeof SchemaCreate>;

const PublishResult = ({
  type,
  data,
  extra_data,
  setOpen,
  params,
}: {
  type: "update" | "delete" | any;
  data: any;
  extra_data: { publish_type: "ca" | "exam" | "resit" };
  setOpen?: any;
  params?: any;
}) => {

  const router = useRouter();
  const [clicked, setClicked] = useState<boolean>(false);

  const onSubmit = () => {
    setClicked(true)
    if (extra_data.publish_type) {
      let newPublishState = {};
      if (extra_data.publish_type === "ca") newPublishState = { ca: true };
      if (extra_data.publish_type === "exam") newPublishState = { exam: true };
      if (extra_data.publish_type === "resit") newPublishState = { resit: true };

      const newData = { ...data, ...newPublishState, specialty_id: data.specialty_id, semester: data.semester };
      console.log(newData, "newData")
      const call = async () => {
        const response = await ActionEdit(newData, data.id.toString(), SchemaCreateEditPublish, `${protocol}api${params.domain}${PublishUrl}`, params.domain);
        console.log(response)
        if (response.id === data.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pagePublish?success=Published Successfully`);
        }
        setOpen(false);
        setClicked(false)
      };
      call();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-black bg-opacity-50 fixed flex inset-0 items-center justify-center p-4 z-50"
      >
        <div className="bg-white dark:bg-gray-800 max-w-md p-6 rounded-lg shadow-lg space-y-4 w-full">
          <h2 className="dark:text-gray-200 font-bold text-2xl text-center text-gray-800">
            Publish {extra_data.publish_type.toUpperCase()}
          </h2>

          <div className="space-y-4">
            <div className="dark:text-gray-300 space-y-2 text-gray-700">
              <p className="flex justify-between"><span className="font-semibold">Class:</span> {data.specialty_name}</p>
              <p className="flex justify-between"><span className="font-semibold">Academic Year:</span> {data.academic_year}</p>
              <p className="flex justify-between"><span className="font-semibold">Level:</span> {data.level}</p>
              <p className="flex justify-between"><span className="font-semibold">Semester:</span> {data.semester}</p>
            </div>

            {clicked ?
              <div className="flex items-center justify-center text-center w-h-full">
                <div className="animate-spin border-4 border-primary border-solid border-t-transparent h-10 rounded-full w-10"></div>
              </div> :
              <div className="flex flex-row gap-4 justify-between">
                <button
                  onClick={() => setOpen(false)}
                  className="bg-slate-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 duration-200 font-medium hover:bg-gray-300 py-2 rounded-lg text-gray-800 transition w-full"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onSubmit()}
                  type="submit"
                  className="bg-blue-600 duration-200 font-medium hover:bg-blue-700 py-2 rounded-lg text-white transition w-full"
                >
                  Confirm
                </button>
              </div>}
          </div>


        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PublishResult;
