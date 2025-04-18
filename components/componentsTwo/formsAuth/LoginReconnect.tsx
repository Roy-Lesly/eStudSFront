"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useEffect, useState } from "react";
import { protocol } from "@/config";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";"@/schemas-user";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { LoginUrl } from "@/Domain/configDom";
import { ActionLogin } from "@/serverActions/AuthActions";


const LoginReconnect = ({
  params,
}: {
  params: any;
}) => {


  const SchemaCreate = z.object({
    matricle: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum" }),
    password: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum" })
  })

  type Inputs = z.infer<typeof SchemaCreate>;



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(SchemaCreate),
  });

  const router = useRouter();
  const thisYear = new Date().getFullYear();
  const [clicked, setClicked] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(true);
  const [user, setUser] = useState<any>();

  useEffect(() => {
    const access = localStorage.getItem("session")

    if (!user && access) {
      const us = jwtDecode(access)
      setUser(us)
    }
  }, [user]);


  const onSubmit = handleSubmit((formVals) => {
    setClicked(true);
    
    const newData = {
      matricle: formVals.matricle?.toString(),
      password: formVals.password?.toString(),
    }
    console.log(newData, 62)
    const call = async () => {
      // Pre-Inscription
      const response = await ActionLogin(newData, protocol + "api" + params.domain + LoginUrl)
      console.log("LoginReconnect", response)
      if (response?.access) {
        localStorage.setItem('session', response.access);
        localStorage.setItem('ref', response.refresh);
        setOpen(false);
      }

      setClicked(false)
    }
    call()

  });

  console.log(user, 81)

  return (
    <div className="absolute bg-black bg-opacity-60 flex h-screen items-center justify-center left-0 top-0 w-full z-50">
      <div className="bg-white m-2 mx-auto relative rounded-md sm:w-[80%] w-[75%] xl:w-[45%]">
        <>
          <form className="flex flex-col gap-4 items-center justify-center my-6" onSubmit={onSubmit}>
            <h1 className="font-semibold items-center justify-center text-xl">Session Expired</h1>


            {user ? <div className="">
              <div className="flex flex-col gap-2 w-full">

                <InputField
                  label=""
                  name="matricle"
                  defaultValue={user?.matricle}
                  register={register}
                  error={errors.matricle}
                  readOnly={true}
                />
                <InputField
                  label="Password"
                  name="password"
                  defaultValue={user?.password}
                  register={register}
                  error={errors.password}
                  type="password"
                />

                <div className="flex items-center justify-center mt-10">
                  <MyButtonModal type='update' title="Login" clicked={clicked} />
                </div>

              </div>
            </div>
              :
              <div></div>
            }
          </form>


        </>
        {/* <div
        className="absolute cursor-pointer right-4 top-4"
        onClick={() => setOpen(false)}
      >
        <Image src="/icons/close.png" alt="" width={14} height={14} />
      </div> */}
      </div>
    </div>

  );
};

export default LoginReconnect;
