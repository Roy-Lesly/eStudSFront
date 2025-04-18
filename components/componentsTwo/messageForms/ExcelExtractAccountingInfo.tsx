"use client";
import MyButtonModal from "@/section-h/common/MyButtons/MyButtonModal";
import { GetSchoolFeesInter } from "@/Domain/Utils-H/feesControl/feesInter";
import React, { useState, useEffect } from 'react';
import * as XLSX from "xlsx";
import { GrClose, GrStatusGood } from "react-icons/gr";
import { FaDownload } from "react-icons/fa6";

const ExcelExtractAccountingInfo = ({
  type,
  params,
  data,
  setOpen,
  extra_data,
}: {
  type: "custom";
  params?: any;
  data: any[];
  setOpen: any;
  extra_data: {
    searchParams: any,
    type: "analyses_students" | "analyses_specialties" | "analyses_domains",
    export_title: string,
    worksheet_name: string,
  };
}) => {

  const [loading, setLoading] = useState(false);
  const [download, setDownload] = useState<boolean>(false);


  const onGetExporProduct = async () => {
    try {
      setLoading(true);
      if (extra_data.searchParams, data && Array.isArray(data)) {
        let dataToExport: any = []

        if (extra_data?.type == "analyses_domains") {
          dataToExport = await data.map((item: any) => ({
            domain: item.domain_name,
            year: item.year,
            total: item.total,
            paid: item.paid,
            balance: item.balance,
            students: item.count,
          }))
        };

        if (extra_data?.type == "analyses_specialties") {
          dataToExport = await data.map((item: any) => ({
            class: item.specialty_name,
            year: item.year,
            level: item.level,
            tuition: item.total,
            paid: item.paid,
            balance: item.balance,
            students: item.count,
          }))
        };
        
        if (extra_data?.type == "analyses_students") {
          dataToExport = await data.map((item: GetSchoolFeesInter) => ({
            name: item.full_name,
            class: item.specialty_name,
            year: item.academic_year,
            level: item.level,
            tuition: item.tuition,
            paid: item.tuition - item.balance,
            balance: item.balance,
          }))
        };

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils?.json_to_sheet(dataToExport);
        XLSX.utils.book_append_sheet(workbook, worksheet, extra_data.worksheet_name);
        XLSX.writeFile(workbook, `${extra_data?.export_title}-${new Date().toISOString().slice(0, 10)}.xlsx`);
        setLoading(false);
        setDownload(true)
      } else {
        setDownload(false)
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      console.log("#==================Export Error", error.message);

    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="font-bold my-4 text-center text-xl tracking-widest">Export Financial Analyses To Excel
        <h1>({extra_data?.export_title} Analyses)</h1>
      </div>

      {download ?

        <div className="flex flex-col gap-6 items-center justify-center p-10 text-lg">
          <div className="flex gap-4 items-center justify-between">
            <span>Exported</span>
            <span><GrStatusGood size={50} color="green" /></span>
          </div>
        </div>

        :

        <div className="flex items-center justify-center w-full">
          {/* Export To Excel */}
          <button onClick={() => onGetExporProduct()} className="bg-blue-950 border-2 border-blue-300 group hover:bg-blue-400 overflow-hidden px-4 py-4 relative rounded-full text-neutral-50 transition">
            <span className="relative">
              {loading ? "Loading..." : <FaDownload />}
            </span>
            <div className="-top-[20px] absolute animate-shine-infinite blur-[12px] flex h-[calc(100%+40px)] inset-0 justify-center w-full">
              <div className="bg-white/30 h-full relative w-8">
              </div>
            </div>
          </button>
        </div>}
    </div>
  );
};

export default ExcelExtractAccountingInfo;
