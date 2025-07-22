"use client";

import { useRef } from "react";
import html2pdf from "html2pdf.js";
import { EdgeSchoolFees } from "@/utils/Domain/schemas/interfaceGraphql";
import Image from "next/image";
import QrCodeGenerator from "@/components/QrCodeGenerator";
import { decodeUrlID } from "@/utils/functions";

const StudentIDCard2 = (
  { data, params, imageSource }: 
  { data: EdgeSchoolFees, params: any, imageSource: string }
) => {
  const school = data?.node?.userprofile?.specialty?.school
  const student = data?.node?.userprofile
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (cardRef.current) {
      // Wait until all images inside the cardRef are loaded
      const images = cardRef.current.querySelectorAll("img");
      const allImagesLoaded = Array.from(images).every((img) => img.complete);

      if (!allImagesLoaded) {
        const promises = Array.from(images).map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) return resolve(true);
              img.onload = () => resolve(true);
              img.onerror = () => resolve(true);
            })
        );

        Promise.all(promises).then(() => {
          generatePDF();
        });
      } else {
        generatePDF();
      }
    }
  };

  const generatePDF = () => {
    const opt = {
      margin: 0,
      filename: `${student.customuser.fullName}.pdf`,
      image: { type: "png", quality: 1 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: "mm", format: [86, 54], orientation: "landscape" },
    };
    html2pdf().set(opt).from(cardRef.current!).save();
  };

  return (
    <div className="flex flex-col p-0 items-center justify-center">
      {student ?
        <div
          ref={cardRef}
          className="relative w-[86mm] h-[54mm] overflow-hidden rounded-lg"
        >
          {/* Background Image */}
          <Image
            // src="/images/logo/id-background.png"
            src={imageSource}
            alt="."
            layout="fill"
            objectFit="cover"
            quality={100}
            className="z-0"
          />
          {/* Content Overlay */}
          <div className="absolute top-0 left-0 w-full h-full text-black text-xs font-medium">

            <div className="flex justify-center gap-4">
              <Image
                alt=""
                src={`${student?.specialty?.school?.schoolIdentification?.logo}` ?
                  `https://api${params.domain}.e-conneq.com/media/${student?.specialty?.school?.schoolIdentification?.logo}`

                  :
                  "/images/logo/LogoEconneq.png"
                }
                width={70}
                height={70}
                className="w-[14mm] h-[14mm] rounded object-cover mt-[0.5mm] ml-[3mm]"
              />
              <div className="w-full pb-[2.7mm] flex flex-col justify-center items-center">
                <span className="text-center pl-[10mm] capitalize text-white text-[4mm] tracking-wide font-medium italic">
                  {school?.schoolName}
                </span>
              </div>
            </div>

            <div className="flex flex-row pl-[3mm]">
              <div className="pt-[8mm] pb-[4mm] w-[30mm] ">
                <Image
                  src={`${student?.customuser?.photo}` ?
                    `https://api${params.domain}.e-conneq.com/media/${student?.customuser?.photo}`
                    :
                    "/id-photo.jpg"
                  }
                  alt=""
                  className="w-[21mm] h-[21mm] rounded-lg object-cover "
                  width={200}
                  height={200}
                />
              </div>

              <div className="flex flex-col pl-[22mm] w-full  gap-[1mm]">
                <div className=""><span className="text-[3mm] font-semibold ">{student.customuser?.matricle}</span></div>
                <div className=""><span className="text-[2mm] mb-[1mm] text-wrap font-semibold ">{(student.customuser?.fullName)?.slice(0, 30)}</span></div>
                <div className=""><span className="text-[2mm] mt-[1mm] font-semibold gap-3">{student.customuser?.dob} at {student.customuser?.pob}</span></div>
                <div className=""><span className="text-[2mm] font-semibold ">{student.specialty?.mainSpecialty.specialtyName}</span></div>
                <div className=""><span className="text-[2mm] font-semibold ">{student.specialty?.academicYear}</span></div>
                <div className=""><span className="text-[2mm] font-semibold ">{student.specialty?.level.level}</span></div>
              </div>

              {/* <QrCodeServerSVG
                url={`${protocol}${params.domain}${RootApi}/check/${decodeUrlID(params.student_id)}/idcard`}
              /> */}


              <QrCodeGenerator
            data={
              {
                id: parseInt(decodeUrlID(params.student_id)),
                section: "H",
                type: "idcard",
                domain: params.domain,
                size: 63
              }
            }
          />

            </div>

          </div>



        </div>
        :
        null
      }

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download
      </button>
    </div>
  );
};

export default StudentIDCard2;
