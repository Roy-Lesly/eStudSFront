"use client";
import { GetSchoolFeesInter } from "@/Domain/Utils-H/feesControl/feesInter";
import React, { useState } from 'react';
import * as XLSX from "xlsx";
import { GrStatusGood } from "react-icons/gr";
import { FaDownload } from "react-icons/fa6";
import { GetUserProfileInter } from "@/Domain/Utils-H/userControl/userInter";

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
    type: "profiles_students" | "profiles_teachers" | "profiles_admins",
    export_title: string,
    worksheet_name: string,
    campus_id?: string | number,
  };
}) => {

  const [loading, setLoading] = useState(false);
  const [download, setDownload] = useState<boolean>(false);


  const onGetExporProduct = async () => {
    let workSheetName: string | null = null
    try {
      setLoading(true);
      if (extra_data.searchParams, data && Array.isArray(data)) {
        let dataToExport: any = []
        let ArrangeName = () => {
          if (extra_data.searchParams && Object.keys(extra_data.searchParams).length){
            let keys: string[] | any = Object.keys(extra_data.searchParams)
            let checkStud: string[] = ["specialty__main_specialty__specialty_name", "specialty__level__level", "specialty__academic_year"]
            let checkLect: string[] = ["full_name"]
            let checkAdmin: string[] = ["full_name"]
            
            if (checkStud.every((el: any) => keys.includes(el)) && extra_data?.type == "profiles_students"){
              workSheetName = extra_data.searchParams["specialty__main_specialty__specialty_name"]
              return `ClassList-${extra_data.searchParams["specialty__main_specialty__specialty_name"]}-${extra_data.searchParams["specialty__academic_year"]}-${extra_data.searchParams["specialty__level__level"]}`
            }
            if (checkLect.every((el: any) => keys.includes(el)) && extra_data?.type == "profiles_teachers"){
              // workSheetName = extra_data.searchParams["specialty__main_specialty__specialty_name"]
              return `LecturerList-${extra_data.campus_id}`
            }
            if (checkAdmin.every((el: any) => keys.includes(el)) && extra_data?.type == "profiles_admins"){
              // workSheetName = extra_data.searchParams["specialty__main_specialty__specialty_name"]
              return `AdminList-${extra_data.campus_id}`
            }
          }
          return null
        }
        let name = await ArrangeName()

        if (extra_data?.type == "profiles_admins") {
          dataToExport = await data.map((item: any) => ({
            username: item.matricle,
            name: item.full_name,
            sex: item.sex,
            telephone: item.telephone,
            address: item.address,
            title: item.title,
            email: item.email,
          }))
        };

        if (extra_data?.type == "profiles_teachers") {
          dataToExport = await data.map((item: any) => ({
            username: item.matricle,
            name: item.full_name,
            sex: item.sex,
            telephone: item.telephone,
            address: item.address,            
            email: item.email,
            title: item.title,
          }))
        };
        
        if (extra_data?.type == "profiles_students") {
          dataToExport = await data.map((item: GetUserProfileInter) => ({
            matricle: item.matricle,
            name: item.full_name,
            sex: item.sex,
            telephone: item.telephone,
            address: item.address,
            email: item.email,
          }))
        };

        console.log(dataToExport)
        console.log(name)
        // return

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils?.json_to_sheet(dataToExport);
        XLSX.utils.book_append_sheet(workbook, worksheet, workSheetName ? workSheetName : extra_data.worksheet_name);
        XLSX.writeFile(workbook, `${name ? name : extra_data.export_title}-${new Date().toISOString().slice(0, 10)}.xlsx`);
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
      <div className="font-bold my-4 text-center text-xl tracking-widest">Export To Excel
        <h1>({extra_data?.export_title} Profiles)</h1>
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
              {loading ? "Loading..." : <FaDownload size={25} />}
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
