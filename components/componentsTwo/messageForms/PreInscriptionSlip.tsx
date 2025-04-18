"use client";
import { ConfigData } from "@/config";
import { useRef, useState } from "react";
import { FaDownload } from "react-icons/fa6";
import { useReactToPrint } from "react-to-print";
import generatePDF, { Resolution, Margin, Options } from 'react-to-pdf';
import { GetPreInscriptionInter } from "@/Domain/Utils-H/userControl/userInter";


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

const PreInscriptionSlip = ({
  type,
  params,
  data,
  setOpen,
  extra_data,
}: {
  type: "custom";
  params?: any;
  data?: GetPreInscriptionInter;
  setOpen?: any;
  extra_data?: any;
}) => {

  const [show, setShow] = useState<boolean>(false)
  const contentToPrint = useRef(null);
  // const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});
  const targetRef = () => document.getElementById("slip")

  const handlePrint = useReactToPrint({
    documentTitle: `${extra_data[0]} - ${data ? data.full_name : ""}`,
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
            {data && data.id ?
              <div className="font-bold h-[20%] items-center ml-20 pt-4 text-center">
                {/* <h1 className="flex h-[27%] items-center justify-center text-[18px] text-center tracking-widest">{data[0].student__specialty__school__school_name}</h1> */}
                <h1 className="flex h-[30%] items-center justify-center text-[20px] tracking-wide">{data.full_name}</h1>
                {/* <h1 className="flex h-[19%] italic items-center justify-center text-[15px]">{data[0].student__specialty__main_specialty__specialty_name} {data[0].student__specialty__academic_year} {data[0].student__specialty__level__level}</h1> */}
                <h1 className="flex h-[20%] italic items-center justify-center text-[18px]">{extra_data[0]} / Pre-Inscription SLIP</h1>
                <h1 className="flex h-[10%] items-center justify-center text-[10px] text-center tracking-widest"></h1>
              </div> : null}


            <div className="border flex flex-col h-[75%] items-center justify-center p-4">
              {data && data.id &&
                <div key={data.id} className={`h-full flex flex-col mx-10 px-10 text-[16px] text-black w-full`}>
                  <div className="flex gap-4">
                    <span className="w-5/12">No Pre-Inscription:</span>
                    <span className="font-semibold italic w-7/12">{data.registration_number}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-5/12">Full Name (Nom et Prenom):</span>
                    <span className="font-semibold italic w-7/12">{data.full_name}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-5/12">Date and Place of Birth:</span>
                    <span className="font-semibold italic w-7/12">{data.dob} - {data.pob}</span>
                  </div>
                  <div className="flex gap-4 w-full">
                    <div className="flex gap-4 w-1/2">
                      <span className="w-5/12">Gender (Sexe):</span>
                      <span className="font-semibold italic w-7/12">{data.sex}</span>
                    </div>
                    <div className="flex gap-4 w-1/2">
                      <span className="w-5/12">Address:</span>
                      <span className="font-semibold italic w-7/12">{data.address}</span>
                    </div>
                  </div>


                  <div className="flex gap-4 w-full">
                    <div className="w-1/2">
                      <div className="flex gap-4">
                        <span className="w-5/12">Telephone:</span>
                        <span className="font-semibold italic w-7/12">{data.telephone}</span>
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div className="flex gap-4">
                        <span className="w-5/12">Email:</span>
                        <span className="font-semibold italic w-7/12">{data.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full">
                    <div className="w-1/2">
                      <div className="flex gap-4">
                        <span className="w-5/12">Program:</span>
                        <span className="font-semibold italic w-7/12">{data.program}</span>
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div className="flex gap-4">
                        <span className="w-5/12">Session:</span>
                        <span className="font-semibold italic w-7/12">{data.session}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full">
                    <div className="w-5/12">
                      <div className="flex gap-4">
                        <span className="w-5/12">1-Specialty:</span>
                        <span className="font-semibold italic w-7/12">{data.specialty_one}</span>
                      </div>
                    </div>
                    <div className="w-4/12">
                      <div className="flex gap-4">
                        <span className="w-5/12">2-Specialty:</span>
                        <span className="font-semibold italic w-7/12">{data.specialty_one}</span>
                      </div>
                    </div>
                    <div className="w-3/12">
                      <div className="flex gap-4">
                        <span className="w-5/12">Level (Niveau):</span>
                        <span className="font-semibold italic w-7/12">{data.level}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full">
                    <div className="w-full">
                      <div className="flex gap-4">
                        <span className="w-5/12">Academic Year (Annee Academique):</span>
                        <span className="font-semibold italic w-7/12">{data.academic_year}</span>
                      </div>
                    </div>

                  </div>


                  <div className="flex gap-4">
                    <span className="w-5/12">Location:</span>
                    <span className={`font-semibold italic text-center w-7/12`}>
                      {ConfigData[params.domain]["higher"].campus.filter((item: any) => item.name == data?.campus)[0]["location"]}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-5/12">Admission Status:</span>
                    <span className={`${data.status == "ADMITTED" ? "text-green-600" : "text-red"} font-semibold italic text-center w-7/12`}>{data.status}</span>
                  </div>
                </div>
              }
            </div>

            <div className="flex h-[5%] italic items-start justify-center mb-2 text-[12px] text-center w-full">Designed By e-conneq Systems</div>
          </div>
        </div>
      </div>

      {data?.id ? (
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

export default PreInscriptionSlip;
