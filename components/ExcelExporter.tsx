import flattenData from '@/Domain/schemas/flattenData';
import React from 'react';
import { FaDownload } from 'react-icons/fa';
import * as XLSX from 'xlsx';

interface ExcelExporterProps {
    data: Record<string, any>[] | any;
    title: string;
    page: "list_user_profile" | "list_custom_user" | "list_main_specialty" | "list_specialty" | "list_main_course" | 
    "list_course" | "list_student_specialty" | "list_student_domain" |
    "extraction_specialty_payment_single";
    type: "UserProfile" | "CustomUser" | "MainSpecialty" | "Specialty" | "MainCourse" | "Course" | "SchoolFees" | "Payment";
    searchParams?: any;
}

const ExcelExporter: React.FC<ExcelExporterProps> = (
    { data, title, page, type, searchParams }
) => {

    let dataToExport: any = []
    let sheetName = "Sheet1"

    // ==============================================================
    let canDownload = false;
    if (page === "list_user_profile" && (searchParams?.academicYear && searchParams?.specialtyName && searchParams?.level) || searchParams?.name) { canDownload = true, sheetName = `${data[0]?.node?.specialty?.mainSpecialty?.specialtyName}-${data[0]?.node?.specialty?.level?.level}` || searchParams.name }
    if (page === "list_student_specialty" && searchParams?.academicYear && searchParams?.specialtyName && searchParams?.level) { canDownload = true, sheetName = data[0]?.node?.specialty.mainSpecialty?.specialtyName }
    if (page === "list_main_specialty" && searchParams?.name) { canDownload = true, sheetName = searchParams?.name }
    if (page === "list_specialty" && searchParams?.academicYear && searchParams?.domainName) { canDownload = true, sheetName = searchParams?.domainName }
    if (page === "list_main_course" && searchParams?.name) { canDownload = true, sheetName = searchParams?.name }
    if (page === "list_course" && searchParams?.academicYear && searchParams?.domainName) { canDownload = true, sheetName = searchParams?.domainName }
    if (page === "extraction_specialty_payment_single") { canDownload = true, sheetName = "Sheet 1" }

    if (type === "SchoolFees"){ dataToExport = flattenData(data, "SchoolFees") } 
    if (type === "UserProfile"){ dataToExport = flattenData(data, "UserProfile") } 
    if (type === "MainSpecialty"){ dataToExport = flattenData(data, "MainSpecialty") } 
    if (type === "Specialty"){ dataToExport = flattenData(data, "Specialty") } 
    if (type === "MainCourse"){ dataToExport = flattenData(data, "MainCourse") } 
    if (type === "Course"){ dataToExport = flattenData(data, "Course") } 
    if (type === "Payment"){ dataToExport = data } 


    const handleExport = () => {

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "sheet1");

        XLSX.writeFile(workbook, `${title.slice(0, 32)}.xlsx`);
    };

    return (
        <div className='flex items-center justify-center mx-1'>
            {canDownload && (
                <button
                    onClick={handleExport}
                    className="bg-red hover:bg-yellow p-3 rounded-full text-white"
                >
                    <FaDownload size={20} />
                </button>
            )}
        </div>
    );
};

export default ExcelExporter;
