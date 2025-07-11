import { QrCodeBase64 } from '@/components/QrCodeBase64';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const mmToPx = (mm: number) => (mm * 96) / 25.4;

const SingleID = ({ student, isPdf = false }: { student: any; isPdf?: boolean }) => {
  const [qrCode, setQrCode] = useState<string>("");

  useEffect(() => {
    const protocol = "https://";
    const domain = "yourdomain.com";
    const RootApi = "/api";
    const url = `${protocol}${domain}${RootApi}/check/${student.id}/idcard/?n=1`;
    QrCodeBase64(url).then(setQrCode);
  }, [student.id]);

  return (
    <div
      className={`id-card relative font-sans text-[10px] text-black ${
        isPdf ? '' : 'border border-gray-400 rounded shadow'
      }`}
      style={{
        width: `${mmToPx(85)}px`,
        height: `${mmToPx(54)}px`,
        overflow: 'hidden',
        boxSizing: 'border-box',
        backgroundImage: `url('/images/idcards/id-background2.jpg')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        padding: isPdf ? '0' : '4px',
      }}
    >
      {student.logo && (
        <Image
          src={student.logo}
          alt="logo"
          width={50}
          height={50}
          className="absolute rounded-full top-[5px] left-[14px] w-[40px] h-[40px] object-contain"
        />
      )}

      {/* School Name */}
      <div className="absolute ml-[50px] top-[14px] left-1/2 transform -translate-x-1/2 text-[11px] font-bold text-center text-blue-900 w-[180px] leading-tight">
        {student.schoolName}
      </div>

      {/* Student Photo */}
      <Image
        src={student.photo}
        alt="Student Photo"
        width={64}
        height={64}
        className="absolute bg-slate-100 rounded top-[69px] left-[14px] w-[57px] h-[57px] object-cover"
      />

      {/* QR Code */}
      {qrCode && (
        <img
          src={qrCode}
          alt="QR Code"
          className="absolute top-[158px] right-[6px] w-[40px] h-[40px]"
        />
      )}

      {/* Matricule */}
      <div className="absolute left-[11px] top-[150px] text-[10px] font-bold text-black">
        {student.matricle}
      </div>

      {/* Labels + Data */}
      <div className="space-y-2 absolute left-[115px] top-[70px] text-[10px] leading-tight">
        <div><strong>Full Name:</strong> {student.name}</div>
        <div><strong>DOB:</strong> {student.dob}</div>
        <div><strong>POB:</strong> {student.pob}</div>
        <div><strong>Specialty:</strong> {student.specialty}</div>
        <div><strong>Level:</strong> {student.level}</div>
      </div>

      {/* Academic Year */}
      <div className="absolute bottom-[4px] left-[5px] text-[8px] font-semibold">
        Academic Year: {student.academicYear}
      </div>
    </div>
  );
};

export default SingleID;
