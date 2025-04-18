"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { ActionCreate, ActionDelete, ActionEdit } from "@/serverActions/actionGeneral";
import { protocol } from "@/config";
import { useRouter } from "next/navigation";
import { MainCourseUrl } from "@/Domain/Utils-H/appControl/appConfig";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { useState } from "react";
import { SchemaCreateEditMainCourse } from "@/Domain/schemas/schemas";
import { handleResponseError } from "@/functions";

type Inputs = z.infer<typeof SchemaCreateEditMainCourse>;

const MainCourseForm = ({
  type,
  data,
  setOpen,
  params,
}: {
  type: "create" | "update" | "delete";
  data?: any;
  setOpen?: any;
  params?: any;
}) => {
  const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({
    resolver: zodResolver(SchemaCreateEditMainCourse),
  });

  const router = useRouter();
  const [clicked, setClicked] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0)

  const onSubmit = handleSubmit((formVals) => {
    setClicked(true);

    const newVals = {
      course_name: formVals.course_name.toUpperCase(),
    }

    if (type === "create") {
      const call = async () => {
        const response = await ActionCreate(newVals, SchemaCreateEditMainCourse, protocol + "api" + params.domain + MainCourseUrl)
        const t = await handleResponseError(response, ["course_name"]);
        if (t == "" && response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses/MainCourses?created="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "update") {
      const call = async () => {
        const response = await ActionEdit(newVals, data.id, SchemaCreateEditMainCourse, protocol + "api" + params.domain + MainCourseUrl, params.domain)
        if (response && response.id) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses/MainCourses?updated="SUCCESSFULLY (${response.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }
    if (type === "delete") {
      const call = async () => {
        const response = await ActionDelete(protocol + "api" + params.domain + MainCourseUrl, data.id)
        if (response && response.success) {
          router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses/MainCourses?deleted="DELETED (${data.id}) !!!`);
          setOpen(false)
        }
        setClicked(false)
      }
      call()
    }

  });

  return (
    <form className="bg-slate-300 flex flex-col gap-4 p-2 rounded" onSubmit={onSubmit}>
      {type === "create" && <h1 className="font-semibold text-xl">Create Course Title</h1>}
      {type === "update" && <h1 className="font-semibold text-xl">Update Course Title</h1>}
      {type === "delete" && <h1 className="font-semibold text-xl">Delete Course Title</h1>}

      <div className="flex flex-wrap gap-4 justify-between">
        <InputField
          label="Course Name"
          name="course_name"
          defaultValue={data?.course_name}
          register={register}
          error={errors?.course_name}
        />
      </div>

      <MyButtonModal type={type} clicked={clicked} />

    </form>
  );
};

export default MainCourseForm;
