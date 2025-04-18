'use client';
import { GetCustomUserInter } from "@/Domain/Utils-H/userControl/userInter";
import Link from "next/link";

const AdmissionForm = ({ data, params }: { params: any, data: GetCustomUserInter | any }) => {
  return <Form data={data} params={params} />;
};

export default AdmissionForm;

const Form = ({ data, params }: any) => {
  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-300 flex flex-col gap-2 items-center justify-center p-6 rounded-lg shadow-lg w-full">
      <div className="bg-slate-900 text-white text-center font-semibold italic p-2 rounded-lg w-full shadow-md">
        <span className="text-xl md:text-2xl">MATRICLE</span>
        <div className="text-teal-300 text-3xl font-bold tracking-widest mt-2">{data.matricle}</div>
      </div>
      <InfoRow label="Full Name / Nom et Prénom" value={data.full_name} />
      <InfoRow label="Telephone" value={data.telephone} />
      <InfoRow label="Gender / Sexe" value={data.sex} />
      <InfoRow label="Date of Birth / Date de Naissance" value={data.dob} />
      <div className="text-center text-sm text-gray-600 mt-4">
        <p>Please use your Matricle to Login or Setup your password.</p>
      </div>
      <div className="flex flex-row gap-6 mt-6">
        <Link href={`/${params.domain}/pageAuthentication/Login`} className="bg-teal-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-700 transition">
          Login
        </Link>
        <Link href={`/${params.domain}/pageAuthentication/CreatePassword?id=${data.id}&username=${data.full_name}`} className="bg-slate-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-800 transition">
          Set Password
        </Link>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="bg-white border-l-4 border-teal-500 shadow-sm flex flex-col md:flex-row font-medium italic items-center justify-between p-3 rounded-md w-full">
      <span className="text-gray-700 md:w-1/3 text-lg">{label}</span>
      <span className="text-gray-900 font-bold md:w-2/3 text-xl">{value}</span>
    </div>
  );
};
