"use client";

import { FaDownload } from "react-icons/fa6";
import { EdgeUserProfile } from "@/utils/Domain/schemas/interfaceGraphql";
import { useTranslation } from "react-i18next";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useRef, useState } from "react";
import { protocol, RootApi } from "@/utils/config";
import { QrCodeBase64 } from "@/components/QrCodeBase64";
import HeaderForm from "../../HeaderNav";
import AdmissionPrintPrimary from "./AdmissionPrintPrimary";


const AdmissionFormPrimary = ({
  data, p
}: {
  data: EdgeUserProfile, p: any
}) => {

  const { t } = useTranslation("common");
  const [showPrint, setShowPrint] = useState<boolean>(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");


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

  useEffect(() => {
    if (showPrint) {
      handleDownload();
    }
    const url = `${protocol}${p.domain}${RootApi}/check/${data?.node?.id}/P/admission`;
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
    pdf.save(`admission-${data.node.customuser.fullName.replace(/\s+/g, "_")}.pdf`);
    setShowPrint(false)
  }

  return (
    <>
      <div className="flex justify-center items-center md:py-6">
        <div className="bg-white border-4 border-teal-800 flex flex-col w-full md:w-[210mm] md:h-[297mm] h-full p-2 md:p-8 rounded-lg shadow-md">
          <div className="h-full space-y-4">

            <HeaderForm
              p={p}
              page={"Admission"}
              title={data?.node?.customuser?.matricle}
              titleName={"Matricle"}
              qrCodeDataUrl={qrCodeDataUrl}
              logoCampus={data?.node?.specialty?.school?.logoCampus}
            />

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700 pt-4">
              {/* Identity Info */}
              <Section title="Personal Information">
                <Item label="Full Name" value={data?.node?.customuser.fullName} />
                <Item label="Sex" value={data?.node?.customuser.sex} />
                <Item label="Date of Birth" value={data?.node?.customuser.dob} />
                <Item label="Place of Birth" value={data?.node?.customuser.pob} />
                <Item label="Nationality" value={data?.node?.customuser.nationality} />
                <Item label="Region of Origin" value={data?.node?.customuser.regionOfOrigin} />
              </Section>

              {/* Academic Info */}
              <div className='flex flex-col gap-4'>
                <Section title="Specialty Information">
                  <Item label="Campus" value={data?.node?.specialty.school?.campus.replace("_", "-")} />
                  <Item label="Specialty Name" value={data?.node?.specialty?.mainSpecialty?.specialtyName} />
                  <div className='flex gap-10'>
                    <Item label="Academic Year" value={data?.node?.specialty?.academicYear} />
                    <Item label="Level" value={data?.node?.specialty?.level?.level} />
                  </div>
                </Section>
                <Section title="Academic Background">
                  <Item label="Highest Certificate" value={data?.node?.customuser?.highestCertificate} />
                  <Item label="Year Obtained" value={data?.node?.customuser?.yearObtained} />
                </Section>
              </div>

              {/* Contact Info */}
              <Section title="Contact Information">
                <Item label="Telephone" value={data?.node?.customuser?.telephone} />
                <Item label="Email" value={data?.node?.customuser?.email} />
                <Item label="Address" value={data?.node?.customuser?.address} />
              </Section>

              {/* Emergency Info */}
              <Section title="Parent/Tutor Information">
                <Item label="Father Name" value={data?.node?.customuser.fatherName} />
                <Item label="Mother Name" value={data?.node?.customuser.motherName} />
                <Item label="Father Telephone" value={data?.node?.customuser.fatherTelephone} />
                <Item label="Mother Telephone" value={data?.node?.customuser.motherTelephone} />
                <Item label="Parent Address" value={data?.node?.customuser.parentAddress} />
              </Section>
            </div>

            <div className="flex items-center justify-center py-6">
              <button
                onClick={() => { setShowPrint(true) }}
                className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white"
              >
                <FaDownload />
                Download PDF
              </button>
            </div>

            <div className="mt-auto flex items-center justify-center text-xs italic text-gray-500 pt-6">
              Designed by e-conneq Systems
            </div>
          </div>
        </div>

        {showPrint ?
          <AdmissionPrintPrimary
            p={p}
            data={data}
            qrCodeDataUrl={qrCodeDataUrl}
            componentRef={componentRef}
          />
          :
          null
        }


      </div>


    </>
  );
};

export default AdmissionFormPrimary;
