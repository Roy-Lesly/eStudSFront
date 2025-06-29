'use client';
import InputField from "../InputField";
import SelectField from "../SelectField";
import { zodResolver } from "@hookform/resolvers/zod";
import { SchemaCreateEditCustomUser } from "@/schemas-user";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ActionEdit } from "@/serverActions/actionGeneral";
import { CustomUserUrl } from "@/Domain/Utils-H/userControl/userConfig";
import { protocol } from "@/config";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TabsStudents from "../TabsProfiles/TabsStudents";
import MessageModal from "../MessageModal";
import { FaArrowRight } from "react-icons/fa";
import { EdgeProgram, EdgeSchoolFees, EdgeUserProfile } from "@/Domain/schemas/interfaceGraphql";

const SchemaUpdate = z.object({
  first_name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
  last_name: z.string().trim().min(2, { message: "Must Contain 2 Characters Minimum" }),
  sex: z.enum(["Male", "Female"]),
  email: z.string().email(),
  telephone: z.coerce.number().int().gte(610000000).lte(699999999),
  title: z.enum(["Prof", "Dr", "Mr", "Mrs", "Miss", "Engr"]),
  address: z.string().optional(),
  pob: z.string().optional(),
  dob: z.string().optional(),
  parent: z.string().optional(),
  parent_telephone: z.string().optional(),
  about: z.string().optional(),
})

type Inputs = z.infer<typeof SchemaUpdate>;

const ListStudsInfoPage = ({ params, data, apiProgram }: { params: any, data: EdgeSchoolFees, apiProgram: EdgeProgram[] }) => {
  const { register, handleSubmit, formState: { errors }, } = useForm<Inputs>({
    resolver: zodResolver(SchemaUpdate),
  });

  const router = useRouter();
  const [clicked, setClicked] = useState<boolean>(false);


  const onSubmit = handleSubmit((formVals) => {
    setClicked(true);
    const newData = {
      // name: formVals["name"] ? formVals["name"].toUpperCase() : "",
      // sys_category_id: formVals.sys_category_id
    }
    const call = async () => {
      const response = await ActionEdit(newData, data.node.userprofile.customuser.id, SchemaCreateEditCustomUser, protocol + "api" + params.domain + CustomUserUrl, params.domain)
      if (response && response.id) {
        router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/Info?updated="SUCCESSFULLY (${response.id}) !!!`);
      }
      setClicked(false)
    }
    call()
  })


  return (
    <div className="bg-white flex-1 m-2 mt-1 p-2 rounded-md">

      <TabsStudents page={1} params={params} />

      <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
        <div className='md:p-6'>
          <div className="gap-6 grid grid-cols-1">
            <div className="flex flex-col gap-4 md:gap-8">
              {/* <!-- Input Fields --> */}
              <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

                <form className="bg-slate-300 flex flex-col gap-2 md:gap-4 md:p-6 p-2 text-black" onSubmit={onSubmit}>

                  <div className="flex flex-col gap-4 md:flex-row md:gap-10 w-full">
                    <div className="flex flex-row gap-2 w-1/3">
                      <h1>Student&apos;s ID Card</h1>
                      <MessageModal table="student_id_card" type="create"
                        params={params} icon={<FaArrowRight />} data={data}
                        extra_data={ {link: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${params.student_id}/Fees`}}
                      />
                    </div>
                    <InputField
                      label="Matricle"
                      name="matricle"
                      defaultValue={data?.node.userprofile.customuser.matricle}
                      register={register}
                      readOnly={true}
                    />
                  </div>

                  <div className="flex flex-col gap-4 md:flex-row md:gap-10 w-full">
                    <InputField
                      label="First Name"
                      name="first_name"
                      defaultValue={data?.node.userprofile.customuser.firstName}
                      register={register}
                      error={errors?.first_name}
                      readOnly={true}
                    />
                    <InputField
                      label="Last Name"
                      name="last_name"
                      defaultValue={data?.node.userprofile.customuser.lastName}
                      register={register}
                      error={errors?.last_name}
                      readOnly={true}
                    />
                  </div>

                  <div className="flex flex-col gap-4 md:flex-row md:gap-10 w-full">
                    <InputField
                      label="Gender"
                      name="sex"
                      defaultValue={data?.node.userprofile.customuser.sex}
                      register={register}
                      error={errors?.sex}
                      readOnly={true}
                    />
                    <InputField
                      label="Date of Birth"
                      name="dob"
                      defaultValue={data?.node.userprofile.customuser.dob}
                      register={register}
                      error={errors?.dob}
                      readOnly={true}
                    />
                    <InputField
                      label="Date of Birth"
                      name="pob"
                      defaultValue={data?.node.userprofile.customuser.pob}
                      register={register}
                      error={errors?.pob}
                      readOnly={true}
                    />
                  </div>

                  <div className="flex flex-col gap-4 md:flex-row md:gap-10 w-full">
                    <InputField
                      label="Telephone"
                      name="telephone"
                      defaultValue={data?.node.userprofile.customuser.telephone}
                      register={register}
                      error={errors?.telephone}
                    />

                    <InputField
                      label="Email"
                      name="email"
                      defaultValue={data?.node.userprofile.customuser.email}
                      register={register}
                      error={errors?.email}
                    />
                  </div>

                  <div className="flex flex-row gap-4 md:gap-10 w-full">
                    <SelectField
                      label="Program"
                      name="program"
                      defaultValue={data?.node.userprofile.program.id}
                      defaultName={data?.node.userprofile.program.name}
                      register={register}
                      data={apiProgram}
                      display={{ name: "name", value: "id" }}
                    />

                    <SelectField
                      label="Session"
                      name="session"
                      defaultValue={data?.node.userprofile.session}
                      defaultName={data?.node.userprofile.session}
                      register={register}
                      data={["Morning", "Evening"]}
                    />
                  </div>

                  <div className="flex flex-row gap-4 md:gap-10 w-full">
                    <InputField
                      label="Parent Name"
                      name="parent"
                      defaultValue={data?.node.userprofile.customuser.parent}
                      register={register}
                      error={errors?.parent}
                    />

                    <InputField
                      label="Parent Telephone"
                      name="parent_telephone"
                      defaultValue={data?.node.userprofile.customuser.parentTelephone}
                      register={register}
                      error={errors?.parent_telephone}
                    />
                  </div>

                  <div className="flex flex-row gap-4 md:gap-10 w-full">

                    <InputField
                      label="About Me"
                      name="about"
                      defaultValue={data?.node.userprofile.customuser.about}
                      register={register}
                      error={errors?.about}
                    />
                  </div>

                  {/* <MyButtonModal type={"update"} clicked={clicked} /> */}

                </form>

              </div>


            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ListStudsInfoPage;
