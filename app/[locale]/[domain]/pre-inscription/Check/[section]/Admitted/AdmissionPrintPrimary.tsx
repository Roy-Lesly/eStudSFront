"use client";

import { EdgeUserProfile } from "@/utils/Domain/schemas/interfaceGraphql";
import { useTranslation } from "react-i18next";
import HeaderForm from "../../HeaderNav";


const AdmissionPrintPrimary = ({
  p, data, qrCodeDataUrl, componentRef
}: {
  p: any, data: EdgeUserProfile, qrCodeDataUrl: string, componentRef: any
}) => {

  const { t } = useTranslation("common");
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-slate-50 rounded-lg p-4 border shadow-lg space-y-3">
      <h3 className="bg-slate-300 text-lg font-semibold rounded p-1 text-slate-800 border-b pb-1">{title}</h3>
      {children}
    </div>
  );

  const Item = ({ label, value }: { label: string; value: string | boolean }) => (
    <div className="flex flex-col">
      <span className="text-sm text-gray-700 italic">{t(label)}</span>
      <span className="font-semibold text-blue-900 break-words">{value?.toString() || "-"}</span>
    </div>
  );

  return (
    <div className="flex justify-center items-center py-6">
      <div
        id="slip"
        ref={componentRef}
        className="bg-white border-4 border-teal-800 flex flex-col w-[210mm] h-[297mm] p-8 rounded-lg shadow-md"
      >
        <div className="h-full space-y-4">
          <HeaderForm
            p={p}
            page={t("Admission")}
            title={data?.node?.customuser?.matricle}
            titleName={t("Matricle")}
            qrCodeDataUrl={qrCodeDataUrl}
            logoCampus={data?.node?.specialty?.school?.logoCampus}
          />

          {/* Details */}
          <div className="grid grid-cols-2 gap-6 text-sm text-gray-700 pt-4">
            {/* Identity Info */}
            <Section title={t("Personal Information")}>
              <Item label={t("Full Name")} value={data?.node?.customuser.fullName} />
              <Item label={t("Sex")} value={data?.node?.customuser.sex} />
              <Item label={t("Date of Birth")} value={data?.node?.customuser.dob} />
              <Item label={t("Place of Birth")} value={data?.node?.customuser.pob} />
              <Item label={t("Nationality")} value={data?.node?.customuser.nationality} />
              <Item label={t("Region of Origin")} value={data?.node?.customuser.regionOfOrigin} />
            </Section>

            {/* Academic Info */}
            <div className='flex flex-col gap-4'>
              <Section title={t("Specialty Information")}>
                <Item label={t("Campus")} value={data?.node?.specialty.school?.campus.replace("_", "-")} />
                <Item label={t("Specialty Name")} value={data?.node?.specialty?.mainSpecialty?.specialtyName} />
                <div className='flex gap-10'>
                  <Item label={t("Academic Year")} value={data?.node?.specialty?.academicYear} />
                  <Item label={t("Level")} value={data?.node?.specialty?.level?.level} />
                </div>
              </Section>
              <Section title={t("Academic Background")}>
                <Item label={t("Highest Certificate")} value={data?.node?.customuser?.highestCertificate} />
                <Item label={t("Year Obtained")} value={data?.node?.customuser?.yearObtained} />
              </Section>
            </div>

            {/* Contact Info */}
            <Section title={t("Contact Information")}>
              <Item label={t("Telephone")} value={data?.node?.customuser?.telephone} />
              <Item label={t("Email")} value={data?.node?.customuser?.email} />
              <Item label={t("Address")} value={data?.node?.customuser?.address} />
            </Section>

            {/* Emergency Info */}
            <Section title={t("Parent/Tutor Information")}>
              <Item label={t("Father Name")} value={data?.node?.customuser.fatherName} />
              <Item label={t("Mother Name")} value={data?.node?.customuser.motherName} />
              <Item label={t("Father Telephone")} value={data?.node?.customuser.fatherTelephone} />
              <Item label={t("Mother Telephone")} value={data?.node?.customuser.motherTelephone} />
              <Item label={t("Parent Address")} value={data?.node?.customuser.parentAddress} />
            </Section>
          </div>

          <div className="mt-auto flex items-center justify-center text-xs italic text-gray-500 pt-6">
            Designed by e-conneq Systems
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionPrintPrimary;
