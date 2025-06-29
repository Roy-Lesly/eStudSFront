'use client';
import { protocol, RootApi } from "@/utils/config";
import { NodeUserProfile } from "@/utils/Domain/schemas/interfaceGraphql";
import { Calendar, MapPin, GraduationCap, Phone, Mail, Info, Newspaper, Megaphone, School } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import Footer from "../../Footer";

export default function StudentProfile(
  {data, p}: 
  {data: NodeUserProfile, p: any}
) {

  const { t } = useTranslation("common")

  return (
    <div className="min-h-screen p-2 bg-teal-50 flex flex-col justify-between">

      <div className="w-full p-10 md:p-8 md:mt-8 bg-white shadow-lg rounded-xl">
        {data && data.id ? <div className="flex flex-col md:flex-row items-center gap-6 md:gap-16">
          <Image
            // src={student.image}
            src={`${protocol}api${p?.domain}${RootApi}/media/${data?.customuser?.photo}`}
            alt=""
            width={150}
            height={150}
            className="w-40 md:w-60 h-40 md:h-60 rounded-full object-cover border-4 border-blue-800"
          />
          <div className="w-full text-teal-900 font-medium">
            <h1 className="text-2xl font-bold text-gray-800 my-2 md:my-6 text-center">{data?.customuser?.fullName}</h1>
            {/* <h1 className="text-xl font-bold text-gray-800 mb-2">{data?.customuser?.matricle}</h1> */}
            <div className="flex items-center gap-2 my-4">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="text-xl font-bold text-gray-800 mb-2">{t("Matricle")}: <span className="text-2xl font-bold">{data?.customuser?.matricle}</span></span>
    
              </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{t("Date of Birth")}:</span> {data?.customuser?.dob}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{t("Place of Birth")}:</span> {data?.customuser?.pob}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 text-blue-500">♀️</span>
                <span className="font-medium">{t("Sex")}:</span> {data?.customuser?.sex}
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{t("Specialty")}:</span> {data?.specialty?.mainSpecialty?.specialtyName}
              </div>
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{t("Level")}:</span> {data?.specialty?.level?.level}
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{t("Academic Year")}:</span> {data?.specialty?.academicYear}
              </div>
            </div>
          </div>
        </div>
        
      :
      
      <div>No Data Found !!!</div>
      }
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
