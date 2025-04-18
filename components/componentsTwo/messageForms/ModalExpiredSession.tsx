"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { protocol } from "@/config";
import { LoginUrl } from "@/Domain/configDom";
import { ActionLogin } from "@/serverActions/AuthActions";
import InputField from "@/componentsTwo/InputField";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { motion, AnimatePresence } from "framer-motion";

const SchemaCreate = z.object({
  matricle: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum" }),
  password: z.string().trim().min(4, { message: "Must Contain 4 Characters Minimum" }),
});

type Inputs = z.infer<typeof SchemaCreate>;

const ModalExpiredSession = ({ params, open, setOpen }: { params: any; open: boolean; setOpen: any }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(SchemaCreate),
  });

  const router = useRouter();
  const [clicked, setClicked] = useState<boolean>(false);
  const [user, setUser] = useState<any>();

  useEffect(() => {
    const access = localStorage.getItem("session");
    if (!user && access) {
      const us = jwtDecode(access);
      setUser(us);
    }
  }, [user]);

  const onSubmit = handleSubmit((formVals) => {
    setClicked(true);

    const newData = {
      matricle: formVals.matricle?.toString(),
      password: formVals.password?.toString(),
    };

    const call = async () => {
      const response = await ActionLogin(newData, protocol + "api" + params.domain + LoginUrl);
      if (response?.access) {
        localStorage.setItem("session", response.access);
        localStorage.setItem("ref", response.refresh);
        router.back();
        setOpen(false);
      }
      setClicked(false);
    };
    call();
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="bg-black bg-opacity-60 fixed flex inset-0 items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white max-w-md p-6 rounded-md shadow-lg w-full"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="font-bold mb-6 text-2xl text-center">Session Expired</h1>

            <form className="flex flex-col gap-4" onSubmit={onSubmit}>
              {user && (
                <>
                  <InputField
                    label="Matricle"
                    name="matricle"
                    defaultValue={user?.matricle}
                    register={register}
                    error={errors.matricle}
                    readOnly={true}
                  />
                  <InputField
                    label="Password"
                    name="password"
                    register={register}
                    error={errors.password}
                    type="password"
                  />
                  <div className="flex items-center justify-center mt-6">
                    <MyButtonModal type="update" title="Login" clicked={clicked} />
                  </div>
                </>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalExpiredSession;
