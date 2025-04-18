"use client";
import { ConfigData } from "@/config";
import { GetResultInter } from "@/Domain/Utils-H/appControl/appInter";
import { calcTotalandGrade } from "@/functions";
import { useRef, useState } from "react";
import { FaDownload } from "react-icons/fa6";
import { useReactToPrint } from "react-to-print";
import generatePDF, { Resolution, Margin, Options } from 'react-to-pdf';


const options: Options = {
  // default is `save`
  method: 'save',
  // default is Resolution.MEDIUM = 3, which should be enough, higher values
  // increases the image quality but also the size of the PDF, so be careful
  // using values higher than 10 when having multiple pages generated, it
  // might cause the page to crash or hang.
  resolution: Resolution.MEDIUM,
  page: {
    // margin is in MM, default is Margin.NONE = 0
    margin: Margin.NONE,
    // default is 'A4'
    format: 'A5',
    // default is 'portrait'
    orientation: 'landscape',
  },
  canvas: {
    // default is 'image/jpeg' for better size performance
    mimeType: 'image/png',
    qualityRatio: 1
  },
  // Customize any value passed to the jsPDF instance and html2canvas
  // function. You probably will not need this and things can break, 
  // so use with caution.
  overrides: {
    // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
    pdf: {
      compress: true
    },
    // see https://html2canvas.hertzen.com/configuration for more options
    canvas: {
      useCORS: true
    }
  },
};

const ResultSlip = ({
  type,
  params,
  data,
  setOpen,
  extra_data,
}: {
  type: "custom";
  params?: any;
  data?: GetResultInter[];
  setOpen?: any;
  extra_data?: any;
}) => {

  const [show, setShow] = useState<boolean>(false)
  const contentToPrint = useRef(null);
  // const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});
  const targetRef = () => document.getElementById("slip")

  const handlePrint = useReactToPrint({
    documentTitle: `${extra_data[0]} - ${data ? data[0].full_name : ""}`,
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
  });

  const backgroundImageStyle = {
    backgroundImage: `url(${ConfigData[params.domain].bg.slip})`,
    height: "100vh",
    margin: 0,
    padding: 2,
    alignItems: "center",
  };

  return (
    <>
      {/* <div className={show ? "" : "hidden"}> */}
      <div className={show ? "" : ""}>
        <div
          id="slip"
          // ref={contentToPrint}
          // ref={targetRef}
          className="bg-white border-[4px] border-teal-800 flex flex-col h-[559px] p-2 rounded-lg text-black w-[793px]"
        >
          <div style={backgroundImageStyle} className="bg-slate-100 h-full">
            {data && data.length ?
              <div className="font-bold h-[19%] ml-10 text-center">
                <h1 className="flex h-[27%] items-center justify-center text-[18px] text-center tracking-widest">{data[0].school_name}</h1>
                <h1 className="flex h-[20%] items-center justify-center text-[16px] tracking-wide">{data[0].full_name}</h1>
                <h1 className="flex h-[19%] italic items-center justify-center text-[15px]">{data[0].specialty_name} {data[0].academic_year} {data[0].level}</h1>
                <h1 className="flex h-[18%] italic items-center justify-center text-[14px]">RESULT SLIP - {extra_data[0]}</h1>
                <h1 className="flex h-[16%] items-center justify-center text-[10px] text-center tracking-widest"></h1>
              </div> : null}

            <div className="flex flex-col h-[4%]">
              <div className="bg-slate-200 border-slate-300 flex flex-row font-medium h-[25px] items-end pb-[7px] px-1 rounded text-black text-lg tracking-wide w-full">
                <span className="w-7/12">Course</span>
                <span className="text-center w-1/12">CA</span>
                <span className="text-center w-1/12">Exam</span>
                <span className="text-center w-1/12">Resit</span>
                <span className="text-center w-1/12">Total</span>
                <span className="gap-2 text-center w-1/12">Grade</span>
              </div>
            </div>

            <div className="flex flex-col h-[73%] items-start">
              {data &&
                data.length &&
                data.map((item: GetResultInter) => (
                  <div key={item.id} className={`${data.length > 16 ? "h-[18px]" : data.length > 14 ? "h-[20px]" : data.length > 12 ? "h-[22px]" : "h-[26px]"} flex flex-row font-semibold mx-1 px-1 text-[15px] text-black w-full`}>
                    <span className="w-7/12">
                      {item.course_name}
                    </span>
                    <span className="text-center w-1/12">{item.ca ? item.ca : "-"}</span>
                    <span className="text-center w-1/12">{item.exam ? item.exam : "-"}</span>
                    <span className="text-center w-1/12">{item.resit ? item.resit : "-"}</span>
                    <span className="text-center w-1/12">{item.average ? item.average : "-"}</span>
                    <span className={`${calcTotalandGrade(item.ca, item.exam, item.resit).passed ? "text-green-600" : "text-red"} text-center w-1/12`}>{calcTotalandGrade(item.ca, item.exam, item.resit).grade} {calcTotalandGrade(item.ca, item.exam, item.resit).withResit ? <span className="text-red">*</span> : null}</span>
                  </div>
                ))}
            </div>

            <div className="flex h-[4%] italic items-start justify-center mb-2 text-[12px] text-center w-full">Designed By e-conneq Systems</div>
          </div>
        </div>
      </div>

      {data?.length ? (
        <div className="flex items-center justify-center mt-2">
          {/* <button onClick={() => { handlePrint(null, () => contentToPrint.current); setShow(true) }}><FaDownload size={25} /></button> */}
          <button onClick={() => { setShow(true); generatePDF(targetRef, options) }} className="flex items-center justify-center mt-2"><FaDownload size={25} /></button>
          {/* <button onClick={() => { toPDF(); setShow(true) }} className="flex items-center justify-center mt-2"><FaDownload size={25} /></button> */}

        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default ResultSlip;
