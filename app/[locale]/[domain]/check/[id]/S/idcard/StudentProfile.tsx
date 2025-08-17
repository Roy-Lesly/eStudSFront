'use client';
import { protocol, RootApi } from "@/utils/config";
import { NodeSchoolHigherInfo } from "@/utils/Domain/schemas/interfaceGraphql";
import { Calendar, MapPin, GraduationCap, School } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import Footer from "../../../Footer";
import { NodeUserProfileSec } from "@/utils/Domain/schemas/interfaceGraphqlSecondary";

export default function StudentProfile(
  { data, p }:
    { data: NodeUserProfileSec, p: any }
) {

  const schoolInfo: NodeSchoolHigherInfo = data?.classroomsec?.school

  const { t } = useTranslation("common")

  return (
    <div className="min-h-screen p-2 bg-teal-50 flex flex-col justify-between space-y-4 shadow">

      

      <div className="w-full p-4 md:p-6 md:mt-6 bg-white shadow-lg rounded-xl space-y-6">
        {schoolInfo && schoolInfo?.id ?
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
            <Image
              src={`${protocol}api${p?.domain}${RootApi}/media/${schoolInfo?.logoCampus}`}
              alt=""
              width={100}
              height={100}
              className="w-20 md:w-30 h-20 md:h-30 rounded-full object-cover border-4 border-blue-800"
            />
            <div className="w-full text-teal-900 font-medium">
              <h1 className="text-2xl md:text-4xl md:tracking-wider font-bold md:my-4 text-center">{schoolInfo?.schoolName}</h1>
            </div>
          </div>
          :

          <div></div>
        }
      </div>


      <div className="w-full p-10 md:p-8 md:mt-8 bg-white shadow-lg rounded-xl space-y-10">
        {data && data?.id ?
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-16">
            <Image
              src={`${protocol}api${p?.domain}${RootApi}/media/${data?.customuser?.photo}`}
              alt=""
              width={150}
              height={150}
              className="w-40 md:w-60 h-40 md:h-60 rounded-full object-cover border-4 border-blue-800"
            />
            <div className="w-full text-teal-900 font-medium">
              <h1 className="text-2xl font-bold text-gray-800 my-2 md:my-6 text-center">{data?.customuser?.fullName}</h1>
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
                  <span className="font-medium">{t("Classroom")}:</span> {data?.classroomsec?.level} - {data?.classroomsec?.classType}
                </div>
                <div className="flex items-center gap-2">
                  <School className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{t("Address")}:</span> {data?.customuser?.address}
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{t("Academic Year")}:</span> {data?.classroomsec?.academicYear}
                </div>
              </div>
            </div>
          </div>
          :
          <div>{t("No Data Found")} !!!</div>
        }
      </div>


      <Footer />

    </div>
  );
}
