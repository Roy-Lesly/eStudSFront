"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { NodePublish } from "@/utils/Domain/schemas/interfaceGraphql";
import { decodeUrlID } from "@/utils/functions";
import { gql } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/utils/serverActions/interfaces";
import { ApiFactory } from "@/utils/graphql/ApiFactory";


const PortalPublishResult = ({
  type,
  data,
  extra_data,
  setOpen,
  params,
}: {
  type: "update" | "delete" | any;
  data: NodePublish;
  extra_data: {
    field_type: "ca" | "exam" | "resit" | "portalCa" | "portalExam" | "portalResit",
    action_on: "publish" | "portal",
    state: boolean
  };
  setOpen?: any;
  params?: any;
}) => {

  const token = localStorage.getItem("token");
  const user: JwtPayload | null = token ? jwtDecode(token) : null
  const [clicked, setClicked] = useState(false)


  const handleSubmit = async () => {
    setClicked(true)

    const newData: any = {
      id: parseInt(decodeUrlID(data.id.toString())),
      customuserId: user?.user_id,
      action: extra_data.action_on,
      [extra_data.field_type]: !extra_data.state,
      delete: false
    };

    await ApiFactory({
      newData: newData,
      editData: newData,
      mutationName: "createUpdateDeletePublish",
      modelName: "publish",
      successField: "id",
      query,
      router: null,
      params: params,
      redirect: false,
      reload: true,
      redirectPath: ``,
      actionLabel: "processing",
    });

    setClicked(false);
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
            {extra_data.action_on === "publish" ? "Publish" : !extra_data.state ? "Open" : "Close"} {extra_data.field_type.toUpperCase()}
          </h2>

          <div className="space-y-4">
            <div className="dark:text-gray-300 space-y-2 text-gray-700">
              <p className="flex justify-between"><span className="font-semibold">Class:</span> {data.specialty.mainSpecialty.specialtyName}</p>
              <p className="flex justify-between"><span className="font-semibold">Academic Year:</span> {data.specialty.academicYear}</p>
              <p className="flex justify-between"><span className="font-semibold">Level:</span> {data.specialty.level.level}</p>
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
                  onClick={() => handleSubmit()}
                  type="submit"
                  className="bg-blue-600 duration-200 font-medium hover:bg-blue-700 py-2 rounded-lg text-white transition w-full"
                >
                  {extra_data.action_on === "publish" ? "Publish" : !extra_data.state ? "Open" : "Close"}
                </button>
              </div>}
          </div>


        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PortalPublishResult;



const query = gql`
  mutation Action(
    $id: ID!,
    $ca: Boolean,
    $exam: Boolean,
    $resit: Boolean,
    $portalCa: Boolean,
    $portalExam: Boolean,
    $portalResit: Boolean,
    $delete: Boolean!,
  ) {
    createUpdateDeletePublish(
      id: $id,
      ca: $ca,
      exam: $exam,
      resit: $resit,
      portalCa: $portalCa,
      portalExam: $portalExam,
      portalResit: $portalResit,
      delete: $delete,
    ) {
      publish {
        id
      }
    }
  }
`;
