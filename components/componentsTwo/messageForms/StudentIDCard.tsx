"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MutableRefObject } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { EdgeSchoolFees } from "@/Domain/schemas/interfaceGraphql";


const SchemaCreate = z.object({
  userprofile_id: z.coerce.number().int().gte(1),
})

type Inputs = z.infer<typeof SchemaCreate>;

const StudentIDCard = ({
  type,
  params,
  data,
  setOpen,
  extra_data,
}: {
  type: "custom";
  params?: any;
  data: EdgeSchoolFees;
  setOpen?: any;
  extra_data?: any;
}) => {
  const { register, formState: { errors }, } = useForm<Inputs>({
    resolver: zodResolver(SchemaCreate),
  });

  const router = useRouter()
  const [loading, setLoading] = useState(true);
  const idCardRef = useRef<HTMLDivElement | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>();
  const [selectedPhoto, setSelectedPhoto] = useState<string>();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (data) {
      setLoading(false);
      setSelectedPhoto("https://apitest.e-conneq.com/media/" + data.node.userprofile.customuser.photo)
    }
  }, [data])


  const downloadPDF = (idCardRef: MutableRefObject<HTMLDivElement | null>) => {
    if (!idCardRef.current) return;
    if (!selectedPhoto) return;
    if (!selectedColor) return;

    html2canvas(idCardRef.current, {
      scale: 3,
      useCORS: true,
      scrollY: -window.scrollY,
    }).then((canvas) => {
      const imgData: string = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85, 54],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 85, 54);
      pdf.save(`ID-${data?.node.userprofile.customuser.fullName}.pdf`);
      setLoading(true)
      router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/`)
    });
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className={`font-bold mb-4 text-blue-600 text-xl`}>Student ID Card Generator</h2>

      <select
        className="border mb-4 p-2 rounded"
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
      >
        {data.node.userprofile.specialty.school?.colors.split(/,\s*/).map((color: string, index: number) => (
          <option key={index} value={color}>
            {color}
          </option>
        ))}
      </select>

      <div
        ref={idCardRef}
        className="bg-white border border-gray-200 flex flex-col h-[54mm] rounded-lg shadow-lg text-black w-[85mm]"
      >
        {/* Header Section */}
        {selectedColor ? <div className={` ${selectedColor} flex h-[13mm] items-start px-2 rounded-t-lg text-white`}>
          <div className="flex font-bold items-center justify-center pt-[1mm] rounded w-[19mm]">
            <Image
              src={data.node.userprofile.specialty.school.schoolIdentification.logo ? `https://api${params.domain}.e-conneq.com/media/` + data.node.userprofile.specialty.school.schoolIdentification.logo : ""}
              alt="Profile"
              className="border border-gray h-[10mm] object-cover rounded-md w-[10mm]"
            />
          </div>
          <div className="font-semibold leading-snug m-0 text-[12px] text-center uppercase w-[62mm]">
            {data.node.userprofile.specialty.school.schoolName}
          </div>
        </div>
          :
          null
        }

        {/* Content Section */}
        <div className="bg-slate-100 flex flex-row h-[41mm] pt-[1mm] px-[1mm]">
          <div className="flex flex-col items-center">
            <img
              src={data?.node.userprofile.customuser.photo ? selectedPhoto : ""}
              alt="Profile"
              className={`bg-white ${selectedPhoto ? "border-white" : "border-black opacity-10"} border  h-[23mm] object-cover rounded-md w-[23mm]`}
            />
            <img
              src={data?.node.userprofile.code ? "https://apitest.e-conneq.com/media/" + data?.node.userprofile.code : ""}
              alt="Profile"
              className={`${data?.node.userprofile.code ? data?.node.userprofile.code : "opacity-90"} border-gray-100 h-[14mm] mt-[1mm] object-cover rounded-md w-[14mm]`}
            />
          </div>

          <div className="bg-center border-blue-900 border-l-2 flex flex-col justify-center mb-2 ml-2 px-[1mm] relative rounded-r-lg shadows text-[10px] text-black w-[57mm]">
            <div
              style={{
                backgroundImage: `url(${data?.node.userprofile.specialty.school.schoolIdentification.logo ? "https://apitest.e-conneq.com/media/" + data?.node.userprofile.specialty.school.schoolIdentification.logo : ""})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                width: '100%',
                height: '100%',
                opacity: 0.2,
              }}
              className="absolute h-full left-0 rounded-r-lg top-0 w-full z-0"
            />

            <div className="relative z-10">
              <p className="flex items-center mb-[1mm]">
                <span className="flex flex-col italic leading-none text-[8px] text-black text-gray-950 w-[20mm]">
                  <span className="h-[3mm]">Full Name:</span>
                  <span className="h-[3mm]">Nom et Prenom:</span>
                </span>
                {data?.node.userprofile.customuser.fullName && <span className={`m-0 leading-snug font-semibold italic text-blue-950 w-[35mm] whitespace-normal ${data.node.userprofile.customuser.fullName.length > 25 ? "text-[11px]" : "text-14px"}`}>{(data.node.userprofile.customuser.fullName ? data.node.userprofile.customuser.fullName.length : 0) > 34 ? data.node.userprofile.customuser.fullName.slice(0, 34) + "." : data.node.userprofile.customuser.fullName}</span>}
              </p>

              <p className="flex h-[5mm] items-center mb-[1mm]">
                <span className="italic text-[8px] text-black text-gray-950 w-[31mm]">Matricule:</span>
                <span className="font-semibold italic text-blue-950 text-left w-full">{data?.node.userprofile.customuser.matricle}</span>
              </p>
              <p className="flex items-center">
                <span className="flex flex-col italic leading-none text-[7px] text-black text-gray-950 w-[20mm]">
                  <span className="h-[3mm] text-black">Date & Place of Birth:</span>
                  <span className="h-[3mm] text-black">Date & Lieu de N:</span>
                </span>
                <span className="font-semibold italic leading-snug m-0 text-[8px] text-blue-950 text-center tracking-wider">{data?.node.userprofile.customuser.dob}, {data?.node.userprofile.customuser.pob.slice(0, 27)}</span>
              </p>
              <p className="flex items-center">
                <span className="italic text-[8px] text-black text-gray-950 w-[31mm]">Filiere/Specialty:</span>
                <span className="font-semibold italic leading-snug m-0 text-blue-950">{data?.node.userprofile.specialty.mainSpecialty.specialtyName}</span>
              </p>
              <div className="flex gap-2 items-center">
                <p className="flex items-center justify-center">
                  <span className="italic text-[8px] text-black text-gray-950">Year/Annee:</span>
                  <span className="font-semibold italic ml-1 text-blue-950">{data?.node.userprofile.specialty.academicYear}</span>
                </p>
                <p className="flex items-center justify-center">
                  <span className="italic text-[8px] text-black text-gray-950">Level/Niveau:</span>
                  <span className="font-semibold italic ml-1 text-blue-950">{data?.node.userprofile.specialty.level.level}</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-center mt-6">
        <input
          type="file"
          onChange={handleImageUpload}
          accept="image/*"
          className="bg-white border border-gray-300 cursor-pointer md:px-4 md:py-2 rounded-md shadow-sm"
        />
      </div>
      {selectedColor ? <div className="flex items-center mt-4">
        <button
          onClick={() => downloadPDF(idCardRef)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md shadow text-white"
        >
          Download as PDF
        </button>
      </div> : null}
    </div>
  );
};

export default StudentIDCard;
