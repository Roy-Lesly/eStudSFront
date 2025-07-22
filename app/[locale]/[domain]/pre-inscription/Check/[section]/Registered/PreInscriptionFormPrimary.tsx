"use client";

import { useEffect, useRef, useState } from "react";
import { FaDownload } from "react-icons/fa6";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { EdgePreInscription, EdgeSchoolHigherInfo, EdgeMainSpecialty } from "@/utils/Domain/schemas/interfaceGraphql";
import { useTranslation } from "react-i18next";
import { decodeUrlID } from "@/utils/functions";
import { protocol, RootApi } from "@/utils/config";
import { QrCodeBase64 } from "@/components/QrCodeBase64";
import HeaderForm from "../../HeaderNav";
import PreInscriptionPrintPrimary from "./PreInscriptionPrintPrimary";

const PreInscriptionFormPrimary = ({
  p,
  data,
  dataMainSpecialties,
  dataSchool
}: {
  p: any;
  data: EdgePreInscription;
  dataMainSpecialties: EdgeMainSpecialty[];
  dataSchool: EdgeSchoolHigherInfo[];
}) => {

  const { t } = useTranslation("common");
  const [showPrint, setShowPrint] = useState<boolean>(false);
  const specialtyOne = dataMainSpecialties?.filter((sp: EdgeMainSpecialty) => decodeUrlID(sp.node.id) == decodeUrlID(data?.node?.specialtyOne.id))[0]
  const specialtyTwo = dataMainSpecialties?.filter((sp: EdgeMainSpecialty) => decodeUrlID(sp.node.id) == decodeUrlID(data?.node?.specialtyTwo.id))[0]
  const school = dataSchool?.filter((item: EdgeSchoolHigherInfo) => decodeUrlID(item.node.id) === decodeUrlID(data?.node?.campus.id))[0]
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  useEffect(() => {
    if (showPrint) {
      handleDownload();
    }
    const url = `${protocol}${p.domain}${RootApi}/check/${data?.node?.id}/preinscription`;
    QrCodeBase64(url).then(setQrCodeDataUrl);
  }, [showPrint])

  const componentRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!componentRef.current) return;

    const canvas = await html2canvas(componentRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`pre-enrolment-${data.node.fullName.replace(/\s+/g, "_")}.pdf`);
    setShowPrint(false)
  };

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
    <>
      <div className="flex justify-center items-center py-6">
        <div className="bg-white border-4 border-teal-800 flex flex-col w-full md:w-[210mm] md:h-[297mm] h-full p-2 md:p-8 rounded-lg shadow-md">
          <div className="h-full space-y-4">
            <HeaderForm
              p={p}
              page={t("Pre-Enrolment")}
              title={data?.node.registrationNumber}
              titleName={t("Registration Number")}
              qrCodeDataUrl={qrCodeDataUrl}
              logoCampus={school?.node?.logoCampus}
            />

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700 pt-4">
              {/* Identity Info */}
              <Section title={t("Personal Information")}>
                <Item label={t("Full Name")} value={data?.node?.fullName} />
                <Item label={t("Sex")} value={data?.node?.sex} />
                <Item label={t("Date of Birth")} value={data?.node?.dob} />
                <Item label={t("Place of Birth")} value={data?.node?.pob} />
                <Item label={t("Nationality")} value={data?.node?.nationality} />
                <Item label={t("Region of Origin")} value={data?.node?.regionOfOrigin} />
              </Section>

              {/* Academic Info */}
              <div className='flex flex-col gap-4'>
                <Section title={t("Specialty Information")}>
                  <Item label={t("Campus")} value={school?.node?.campus.replace("_", "-")} />
                  <Item label={t("Specialty Name")} value={specialtyOne?.node?.specialtyName} />
                  <Item label={t("Specialty Name")} value={specialtyTwo?.node?.specialtyName} />
                  <div className='flex gap-10'>
                    <Item label={t("Academic Year")} value={data?.node?.academicYear} />
                    <Item label={t("Level")} value={data?.node?.level.replace("A_", "")} />
                  </div>
                </Section>
                <Section title={t("Academic Background")}>
                  <Item label={t("Highest Certificate")} value={data?.node?.highestCertificate} />
                  <Item label={t("Year Obtained")} value={data?.node?.yearObtained} />
                </Section>
              </div>

              {/* Contact Info */}
              <Section title={t("Contact Information")}>
                <Item label={t("Telephone")} value={data?.node?.telephone} />
                <Item label={t("Email")} value={data?.node?.email} />
                <Item label={t("Address")} value={data?.node?.address} />
              </Section>

              {/* Emergency Info */}
              <Section title={t("Parent/Tutor Information")}>
                <Item label={t("Father Name")} value={data?.node?.fatherName} />
                <Item label={t("Mother Name")} value={data?.node?.motherName} />
                <Item label={t("Father Telephone")} value={data?.node?.fatherTelephone} />
                <Item label={t("Mother Telephone")} value={data?.node?.motherTelephone} />
                <Item label={t("Parent Address")} value={data?.node?.parentAddress} />
              </Section>
            </div>

            <div className="flex items-center justify-center py-6">
              <button
                onClick={() => { setShowPrint(true) }}
                className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white"
              >
                <FaDownload />
                {t("Download PDF")}
              </button>
            </div>

            <div className="mt-auto flex items-center justify-center text-xs italic text-gray-500 pt-6">
              Designed by e-conneq Systems
            </div>
          </div>
        </div>

        {showPrint ?
          <PreInscriptionPrintPrimary
            p={p}
            qrCodeDataUrl={qrCodeDataUrl}
            data={data}
            school={school}
            specialtyOne={specialtyOne}
            specialtyTwo={specialtyTwo}
            componentRef={componentRef}
          />
          :
          null
        }
      </div>
    </>
  );
};

export default PreInscriptionFormPrimary;
