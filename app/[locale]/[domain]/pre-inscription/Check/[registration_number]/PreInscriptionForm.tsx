'use client';
import MessageModal from "@/componentsTwo/MessageModal";
import { ConfigData } from "@/config";
import { GetPreInscriptionInter } from "@/Domain/Utils-H/userControl/userInter";
import { FaDownload } from "react-icons/fa6";

const PreInscriptionForm = ({ data, params }: { params: any, data?: GetPreInscriptionInter | any }) => {
  // return <>T</>
  const backgroundImageStyle = {
    backgroundImage: `url(${ConfigData[params.domain].bg.transcript})`,
    height: "100vh",
    margin: 0,
    padding: 2,
    alignItems: "center",
  };

  // return <div style={backgroundImageStyle} className="bg-slate-100 border-4 h-full rounded w-[793px]">
  <div className='border-teal-700 h-full rounded w-full'>
    <span>{data.registration_number}</span>
    <span>{data.full_name}</span>
    <span>{data.telephone}</span>
    <span>{data.sex}</span>
  </div>
  return (
    <Form data={data} params={params} />
  )
}


export default PreInscriptionForm

const Form = ({ data, params }: any) => {

  const backgroundImageStyle = {
    backgroundImage: `url(${ConfigData[params.domain].bg.transcript})`,
    height: "100vh",
    margin: 0,
    padding: 2,
    alignItems: "center",
  };

  // return <div style={backgroundImageStyle} className="bg-slate-100 border-4 h-full rounded w-[793px]">
  return <div className="bg-white flex flex-col gap-4 h-full items-center justify-center lg:p-20 md:border-2 md:p-10 rounded text-lg w-full">
    {/* <div className='border-4 border-teal-700 h-full rounded w-full' > */}
    <div className="flex flex-col gap-[1px] w-full">
      <div className="bg-slate-900 border flex flex-col font-semibold italic items-center justify-center md:flex-row p-2 rounded text-white w-full">
        <span className="flex justify-center md:py-2 md:w-1/3 w-full">Registration / Pre-Inscription No</span>
        <span className="flex font-bold justify-center md:w-2/3 text-4xl text-teal-300 w-full">{data.registration_number}</span>
      </div>
      <div className="bg-slate-200 border flex flex-col font-semibold italic items-center justify-center md:flex-row p-2 rounded w-full">
        <span className="flex justify-center md:py-2 md:w-1/3 w-full">Full Name / Nom et Prenom</span>
        <span className="flex font-bold justify-center md:w-2/3 text-2xl text-teal-800 w-full">{data.full_name}</span>
      </div>
      <div className="bg-slate-200 border flex flex-col font-semibold italic items-center justify-center md:flex-row md:p-2 p-1 rounded w-full">
        <span className="flex justify-center md:py-2 md:w-1/3 w-full">Telephone</span>
        <span className="flex font-bold justify-center md:w-2/3 text-2xl text-teal-800 w-full">{data.telephone}</span>
      </div>
      <div className="bg-slate-200 border flex flex-col font-semibold italic items-center justify-center md:flex-row md:p-2 p-1 rounded w-full">
        <span className="flex justify-center md:py-2 md:w-1/3 w-full">Gender / Sexe</span>
        <span className="flex font-bold justify-center md:w-2/3 text-2xl text-teal-800 w-full">{data.sex}</span>
      </div>
      <div className="bg-slate-200 border flex flex-col font-semibold italic items-center justify-center md:flex-row md:p-2 p-1 rounded w-full">
      <span className="flex justify-center md:py-2 md:w-1/3 w-full">Date of Birth / Date de Naissance</span>
      <span className="flex font-bold justify-center md:w-2/3 text-2xl text-teal-800 w-full">{data.dob}</span>
      </div>
      <div className="bg-slate-200 border flex flex-col font-semibold italic items-center justify-center md:flex-row md:p-2 p-1 rounded w-full">
        <span className="flex justify-center md:py-2 md:w-1/3 w-full">Place of Birth / Lieu de Naissance</span>
        <span className="flex font-bold justify-center md:w-2/3 text-2xl text-teal-800 w-full">{data.pob}</span>
      </div>
      <div className="bg-slate-200 border flex flex-col font-semibold italic items-center justify-center md:flex-row md:p-2 p-1 rounded w-full">
        <span className="flex justify-center md:py-2 md:w-1/3 w-full">Campus</span>
        <span className="flex font-bold justify-center md:w-2/3 text-2xl text-teal-800 w-full">{ConfigData[params.domain]["higher"].campus.filter((item: any) => item.name== data.campus)[0]["location"]}</span>
      </div>
      <div className="bg-slate-200 border flex flex-col font-semibold italic items-center justify-center md:flex-row md:p-2 p-1 rounded w-full">
        <span className="flex font-bold justify-center md:py-2 md:w-1/3 w-full">STATUS</span>
        <span className="flex font-bold justify-center md:w-2/3 text-2xl text-teal-800 w-full">{data.status}</span>
      </div>
      <div className="items-center justify-center mt-4 p-2 text-center text-sm">
        <span>Please Save this information as you will need it to check your admission status </span>
      </div>
      <div className='flex items-center justify-center mt-4'>
        <MessageModal table="preinscription_slip" type="custom" customClassName='rounded-full border-teal-700 border p-2' params={params} data={data} icon={<FaDownload size={20} />} extra_data={["Pre-Enrollment"]} />
      </div>
    </div>

  </div>

}