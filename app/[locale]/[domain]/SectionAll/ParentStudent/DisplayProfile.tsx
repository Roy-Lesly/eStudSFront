'use client';
import PasswordResetModal from '@/components/PasswordResetModal';
import { decodeUrlID } from '@/functions';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaTimesCircle, FaUserCircle } from "react-icons/fa";

const DisplayProfile = (
  { data, params, section, role }:
  { data: any, params: any, section: "H" | "S" | "P", role: "Student" | "Parent" }
) => {
  const { t } = useTranslation("common");
  const specialty = section === "H" ? data?.specialty : null;
  const classroomsec = section === "S" ? data?.classroomsec : null;
  const classroomprim = section === "P" ? data?.classroomprim : null;


  console.log(data);
  console.log(specialty);
  console.log(classroomsec?.academicYear || classroomprim?.academicYear || specialty?.academicYear);

  const [passwordState, setPasswordState] = useState<"reset" | "change" | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-300 to-teal-300 pt-20 px-4 pb-16 flex items-start justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        
        
        <div className="bg-gradient-to-r from-teal-500 to-purple-500 p-6 flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <div className="flex-shrink-0">
            {data?.customuser?.photo ? (
              <img
                src={`https://api${params.domain}.e-conneq.com/media/${data?.customuser.photo}`}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
              />
            ) : (
              <FaUserCircle size={128} className="text-white opacity-90" />
            )}
          </div>
          <div className="text-center md:text-left text-white">
            <p className="text-lg font-medium opacity-90">{role}</p>
            <h1 className="text-2xl font-bold">{data?.customuser?.fullName || "—"}</h1>
            <p className="mt-2 opacity-75">{t("Matricle")}: <span className="font-semibold">{data?.customuser?.matricle}</span></p>
          </div>
        </div>

        {/* Profile Content */}
        {data ? (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 border-b pb-2 mb-4">{t("Personal Information")}</h2>
              <div className="space-y-2 text-slate-800">
                <InfoRow label={t("Date of Birth")} value={data?.customuser?.dob} />
                <InfoRow label={t("Place of Birth")} value={data?.customuser?.pob} />
                <InfoRow label={t("Nationality")} value={data?.customuser?.nationality || "?"} />
                <InfoRow label={t("Region Of Origin")} value={data?.customuser?.regionOfOrigin || "?"} />
                <InfoRow label={t("Highest Certificate")} value={data?.customuser?.highestCertificate || "?"} />
                <InfoRow label={t("Year Obtained")} value={data?.customuser?.yearObtained || "?"} />
              </div>
            </section>

            {/* Academic Info */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 border-b pb-2 mb-4">{t("Academic Information")}</h2>
              <div className="space-y-2 text-slate-800">
                {specialty ? <InfoRow label={t("Specialty")} value={specialty?.mainSpecialty?.specialtyName || "?"} /> : null}
                {classroomsec ? <InfoRow label={t("Classroom")} value={classroomsec?.level || "?"} /> : null}
                {classroomprim ? <InfoRow label={t("Classroom")} value={classroomprim?.level || "?"} /> : null}
                
                <InfoRow label={t("Academic Year")} value={specialty?.academicYear || classroomsec?.academicYear || classroomprim?.academicYear} />
                
                {specialty ? <InfoRow label={t("Level")} value={specialty?.level?.level || "?"} /> : null}
                {/* {classroomsec ? <InfoRow label={t("Series")} value={classroomsec?.classType || "?"} /> : null} */}
                {/* {classroomprim ? <InfoRow label={t("Level")} value={specialty?.level?.level || "?"} /> : null} */}
              </div>
            </section>

            {/* Parent Info */}
            <section className="md:col-span-2">
              <h2 className="text-xl font-semibold text-slate-800 border-b pb-2 mb-4">{t("Parent Information")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800">
                <InfoRow label={t("Father's Name")} value={data?.customuser?.fatherName || "?"} />
                <InfoRow label={t("Father's Telephone")} value={data?.customuser?.motherName || "?"} />
                <InfoRow label={t("Mother's Name")} value={data?.customuser?.fatherTelephone || "?"} />
                <InfoRow label={t("Mother's Telephone")} value={data?.customuser?.motherTelephone || "?"} />
              </div>
            </section>
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center">
            <FaTimesCircle className="h-16 w-16 text-red-500" />
            <p className="font-semibold mt-4 text-lg text-slate-700">{t("No Student Data Available")}</p>
          </div>
        )}

        {/* Footer Actions */}
        {data && (
          <div className="px-6 pb-6 flex flex-col items-center">
            <button
              onClick={() => setPasswordState("change")}
              type="button"
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg px-6 py-2 transition"
            >
              {t("Change Password")}
            </button>
            <div className="flex flex-col items-center mt-6">
              <FaCheckCircle className="h-10 w-10 text-green-500" />
              <p className="mt-2 text-green-600 font-semibold">{t("Verified")}</p>
            </div>
          </div>
        )}
      </div>

      <PasswordResetModal
        action={passwordState}
        onClose={() => setPasswordState(null)}
        id={parseInt(decodeUrlID(data?.customuser?.id))}
      />
    </main>
  );
};

const InfoRow = ({ label, value }: { label: string, value: any }) => (
  <div className="flex justify-between">
    <span className="text text-slate-500">{label}:</span>
    <span className="font-medium">{value || "—"}</span>
  </div>
);

export default DisplayProfile;
