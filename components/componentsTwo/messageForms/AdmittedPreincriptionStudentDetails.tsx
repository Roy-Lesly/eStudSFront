"use client";
import { ConfigData } from "@/config";
import { useState } from "react";
import { GetPreInscriptionInter } from "@/Domain/Utils-H/userControl/userInter";


const AdmittedPreincriptionStudentDetails = ({
  type,
  params,
  data,
  setOpen,
  extra_data,
}: {
  type: "custom";
  params?: any;
  data?: GetPreInscriptionInter;
  setOpen?: any;
  extra_data?: any;
}) => {

  const [show, setShow] = useState<boolean>(false)

  const backgroundImageStyle = {
    backgroundImage: `url(${ConfigData[params.domain].bg.slip})`,
    height: "100vh",
    margin: 0,
    padding: 2,
    alignItems: "center",
  };

  return (
    <>
      <div className={show ? "" : ""}>
        <div
          id="slip"
          className="bg-white border-[4px] border-teal-800 flex flex-col h-[559px] p-2 rounded-lg text-black w-[703px]"
        >
          <div style={backgroundImageStyle} className="bg-slate-100 h-full">
            {data && data.id ?
              <div className="font-bold h-[17%] items-center ml-20 pt-4 text-center">
                <h1 className="flex h-[40%] items-center justify-center text-[20px] tracking-wide">{data.full_name}</h1>
                <h1 className="flex h-[25%] italic items-center justify-center text-[18px]">Pre-Enrolement / Pre-Inscription SLIP</h1>
                <h1 className="flex h-[10%] items-center justify-center text-[10px] text-center tracking-widest"></h1>
              </div> : null}


            <div className="border flex flex-col h-[80%] items-center justify-center p-2">
              {data && data.id &&
                <div key={data.id} className={`h-full flex flex-col gap-3 mx-10 px-10 text-[16px] text-black w-full`}>
                  <div className="flex gap-4">
                    <span className="w-5/12">No Pre-Inscription:</span>
                    <span className="font-semibold italic w-7/12">{data.registration_number}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-5/12">Full Name (Nom et Prenom):</span>
                    <span className="font-semibold italic w-7/12">{data.full_name}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-5/12">Date and Place of Birth:</span>
                    <span className="font-semibold italic w-7/12">{data.dob} - {data.pob}</span>
                  </div>
                  <div className="flex gap-4 w-full">
                    <div className="flex gap-4 w-1/2">
                      <span className="w-5/12">Gender (Sexe):</span>
                      <span className="font-semibold italic w-7/12">{data.sex}</span>
                    </div>
                    <div className="flex gap-4 w-1/2">
                      <span className="w-5/12">Address:</span>
                      <span className="font-semibold italic w-7/12">{data.address}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full">
                    <div className="w-1/2">
                      <div className="flex gap-4">
                        <span className="w-5/12">Telephone:</span>
                        <span className="font-semibold italic w-7/12">{data.telephone}</span>
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div className="flex gap-4">
                        <span className="w-5/12">Email:</span>
                        <span className="font-semibold italic w-7/12">{data.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full">
                    <div className="w-1/2">
                      <div className="flex gap-4">
                        <span className="w-5/12">Program:</span>
                        <span className="font-semibold italic w-7/12">{data.program}</span>
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div className="flex gap-4">
                        <span className="w-5/12">Session:</span>
                        <span className="font-semibold italic w-7/12">{data.session}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full">
                  <div className="w-1/2">
                      <div className="flex gap-4 w-full">
                        <span className="w-4/12">1-Specialty:</span>
                        <span className="font-semibold italic w-8/12">{data.specialty_one}</span>
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div className="flex gap-4 w-full">
                        <span className="w-4/12">2-Specialty:</span>
                        <span className="font-semibold italic w-8/12">{data.specialty_one}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full">
                    <div className="w-1/2">
                      <div className="flex gap-4 w-full">
                        <span className="w-8/12">Academic Year (Annee Academique):</span>
                        <span className="flex font-semibold italic items-center w-4/12">{data.academic_year}</span>
                      </div>
                    </div>
                    <div className="w-1/1">
                      <div className="flex gap-4 w-full">
                        <span className="w-8/12">Level (Niveau):</span>
                        <span className="flex font-semibold italic items-center w-4/12">{data.level}</span>
                      </div>
                    </div>
                  </div>


                  <div className="flex gap-4">
                    <span className="w-5/12">Campus:</span>
                    <span className={`font-semibold italic w-7/12`}>
                      {ConfigData[params.domain]["higher"].campus.filter((item: any) => item.name == data?.campus)[0]["location"]}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-5/12">Admission Status:</span>
                    <span className={`${data.status == "ADMITTED" ? "text-green-600" : "text-red"} font-semibold italic w-7/12`}>{data.status}</span>
                  </div>
                </div>
              }
            </div>

            <div className="flex h-[3%] italic items-start justify-center mb-2 text-[12px] text-center w-full">Designed By e-conneq Systems</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdmittedPreincriptionStudentDetails;
