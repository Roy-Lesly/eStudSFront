import { EdgePublish, EdgeResult, EdgeSchoolFees, NodeSchoolFees } from '@/Domain/schemas/interfaceGraphql'
import getApolloClient, { calcTotalandGrade, capitalizeFirstLetter, errorLog } from '@/functions';
import { gql } from '@apollo/client';
// import React, { useState } from 'react'
import { FaMinus } from 'react-icons/fa';
import { GrClose, GrStatusGood } from 'react-icons/gr';
import EncouragementMessage from './EncouragementMessage';
import initTranslations from '@/initTranslations';
import ResultSlip from '../ResultSlip';
import { FaArrowRightLong } from 'react-icons/fa6';
import PaymentStatus from './PaymentStatus';



const ResultDisplay = async (
  { params, resultType, title }
    :
    { params: any, resultType: "ca" | "exam" | "resit" | "result", title: string }
) => {
  const p = await params;
  const { t } = await initTranslations(p.locale, ['common'])

  const client = getApolloClient(p.domain);
  let data;

  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        first: 40,
        userprofileId: p.userprofile_id,
        specialtyId: p.specialty_id,
      },
    });
    data = result.data;
  } catch (error: any) {
    errorLog(error)
    data = null;
  }

  const schoolFees: NodeSchoolFees = data ? data.allSchoolFees?.edges[0].node : null
  const platform = data ? data.allSchoolFees.edges[0].node.platformPaid : 0
  const tuition = data ? data.allSchoolFees.edges[0].node.userprofile.specialty.tuition : 0
  const balance = data ? data.allSchoolFees.edges[0].node.balance : 0
  const paidAmount = tuition - balance
  const feeCheckList = data ? data.allSchoolFees.edges[0].node.userprofile.specialty.school.schoolfeesControl.split(",").map((num: any) => parseFloat(num.trim())) : []
  const pubI: EdgePublish[] = data && data.allPublishes.edges?.filter((item: EdgePublish) => item?.node.semester === "I")
  const pubII: EdgePublish[] = data && data.allPublishes.edges?.filter((item: EdgePublish) => item?.node.semester === "II")
  // const [showModalType, setShowModalType] = useState<"id" | "platform" | "moratoire" | null>(null)

  return (
    <div className='flex flex-col gap-4 min-h-screen mb-4 pb-16'>
      {/* Main Content */}
      <div className='h-screen mx-1 my-16 p-1 rounded text-black'>

        <div className='flex font-semibold items-center justify-center mb-2 text-xl uppercase'>
          {t(title)} - {t("result")}
        </div>



        <div className='flex-grow h-full'>
          {data ? (
            data.allSchoolFees.edges[0].node.platformPaid ? (
              data.allResults ? (
                <>

                  {
                    (
                      (resultType == "ca" && paidAmount > ((feeCheckList[0] - 0.01) * tuition)) ||
                      (resultType == "exam" && paidAmount > ((feeCheckList[1] - 0.01) * tuition)) ||
                      (resultType == "resit" && paidAmount > ((feeCheckList[2] - 0.01) * tuition))
                    ) && pubI.length > 0 ?
                      <CaExamResit
                        semester='I'
                        resultType={resultType}
                        data={data.allResults.edges.filter((item: EdgeResult) => item.node.course.semester === 'I')}
                        fees={data.allSchoolFees.edges}
                        publish={pubI[0]}
                        platform={platform}
                        params={p}
                      />
                      :
                      (resultType == "result" && paidAmount > ((feeCheckList[2] - 0.01) * tuition)) ?
                        <Result
                          locale={p.locale}
                          semester='I'
                          schoolFees={schoolFees}
                          examPublished={pubI[0]?.node?.exam}
                          resitPublished={pubI[0]?.node?.resit}
                          data={data.allResults.edges.filter((item: EdgeResult) => item.node.course.semester === 'I')}
                        />
                        :
                        (resultType == "result" ?
                          <Notification
                            semester='I'
                            platform={platform}
                            fees={paidAmount > ((feeCheckList[2] - 0.01) * tuition)}
                            publish={pubI[0]?.node.resit}
                            t={t}
                          />
                          :
                          <Notification
                            semester='I'
                            platform={platform}
                            fees={resultType === "ca" && paidAmount > ((feeCheckList[0] - 0.01) * tuition) || resultType === "exam" && paidAmount > ((feeCheckList[1] - 0.01) * tuition) || resultType === "resit" && paidAmount > ((feeCheckList[2] - 0.01) * tuition)}
                            publish={resultType === "ca" && pubI[0]?.node.ca || resultType === "exam" && pubI[0]?.node.exam || resultType === "resit" && pubI[0].node.resit}
                            t={t}
                          />)
                  }

                  {
                    (
                      (resultType == "ca" && paidAmount > ((feeCheckList[3] - 0.1) * tuition)) ||
                      (resultType == "exam" && paidAmount > ((feeCheckList[4] - 0.1) * tuition)) ||
                      (resultType == "resit" && paidAmount > ((feeCheckList[5] - 0.1) * tuition))
                    ) && pubII.length > 0 ?
                      <CaExamResit
                        semester='II'
                        resultType={resultType}
                        data={data.allResults.edges.filter((item: EdgeResult) => item.node.course.semester === 'II')}
                        fees={data.allSchoolFees.edges}
                        publish={pubII[0]}
                        platform={platform}
                        params={p}
                      />
                      :
                      (resultType == "result" && paidAmount > ((feeCheckList[5] - 0.01) * tuition)) ?
                        <Result
                          locale={p?.locale}
                          semester='II'
                          schoolFees={schoolFees}
                          examPublished={pubII[0]?.node?.exam}
                          resitPublished={pubII[0]?.node?.resit}
                          data={data.allResults.edges.filter((item: EdgeResult) => item?.node?.course.semester === 'II')}
                        />
                        :
                        (resultType == "result" ?
                          <Notification
                            semester='II'
                            platform={platform}
                            fees={paidAmount > ((feeCheckList[5] - 0.01) * tuition)}
                            publish={pubII[0]?.node.resit}
                            t={t}
                          />
                          :
                          <Notification
                            semester='II'
                            platform={platform}
                            fees={resultType === "ca" && paidAmount > ((feeCheckList[3] - 0.01) * tuition) || resultType === "exam" && paidAmount > ((feeCheckList[4] - 0.01) * tuition) || resultType === "resit" && paidAmount > ((feeCheckList[5] - 0.01) * tuition)}
                            publish={resultType === "ca" && pubII[0]?.node.ca || resultType === "exam" && pubII[0]?.node.exam || resultType === "resit" && pubII[0]?.node.resit}
                            t={t}
                          />)
                  }
                </>
              ) : (
                <div>{t("No Data")} {t("Results")}</div>
              )
            ) : 
            <PaymentStatus
              params={params}
              apiSchoolFees={data.allSchoolFees?.edges[0]}
              school={schoolFees?.userprofile?.specialty?.school}
            />
          ) : (
            <div className="flex flex-col items-center justify-center my-20 p-6 rounded-lg bg-red-100 border border-red-400 text-red-800 shadow-md max-w-lg mx-auto">
              <p className="text-2xl text-center">🚫 {t("No Data Available")}.</p>
            </div>
          )}
        </div>

        {data && <EncouragementMessage data={data.allSchoolFees.edges[0].node} />}


      </div>
    </div>
  )
}

export default ResultDisplay


const CaExamResit = async (
  { resultType, data, semester, fees, publish, params }
    :
    { platform: boolean, resultType: "ca" | "exam" | "resit" | "result", data: EdgeResult[], fees: EdgeSchoolFees[], semester: "I" | "II", publish: EdgePublish, params: any }
) => {
  const caLim = fees ? fees[0].node.userprofile.specialty.school.caLimit / 2 : 0;
  const examLim = fees ? fees[0].node.userprofile.specialty.school.examLimit / 2 : 0;
  const resitLim = fees ? fees[0].node.userprofile.specialty.school.resitLimit / 2 : 0;
  const { t } = await initTranslations(params.locale, ['common'])
  if (resultType === "resit") {
    data = data.filter(
      (item) => {
        const info = JSON.parse(item.node.infoData);
        return (Math.round(+(parseFloat(info.ca) + parseFloat(info.exam)) * 10) / 10) < 50 || info.resit > 0;      }
    );
  }

  return (
    <>
      {(
        (resultType === "ca" && publish.node.ca) ||
        (resultType === "exam" && publish.node.exam) ||
        (resultType === "resit" && publish.node.resit)
      ) ?
        <div className="mt-8">
          <h2 className="font-semibold mb-4 text-2xl text-center">
            {t("Semester")} {semester}
          </h2>

          <div className="overflow-x-auto">
            <table className="border-collapse rounded-lg shadow-md table-auto w-full">
              <thead className="bg-blue-950 text-white">
                <tr>
                  <th className="px-1 py-2 text-left w-8/12">{t("Course")}</th>
                  <th className="px-1 py-2 text-center w-2/12">{t(resultType)?.toUpperCase()}</th>
                  <th className="px-1 py-2 text-center w-2/12">{t("Status")}</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {data.map((edge: EdgeResult) => {
                  const { node } = edge;
                  const { infoData } = node;

                  const parsedInfo = typeof infoData === 'string' ? JSON.parse(infoData) : {};
                  const { ca = "-", exam = "-", resit = "-", validated = false, average = "-" } = parsedInfo;


                  return <tr
                    key={edge.node.id}
                    className="border-gray-200 border-t hover:bg-gray-100"
                  >
                    <td className="px-1 py-1 text-gray-800">{edge.node.course.mainCourse.courseName}</td>
                    <td className="px-1 py-1 text-center text-gray-700">
                      {resultType === "ca"
                        ? ca
                        : resultType === "exam"
                          ? exam
                          : resultType === "resit"
                            ? resit
                            : "None"}
                    </td>
                    <td className="flex items-center justify-center px-1 py-1 text-center">
                      {resultType === "ca" && (ca == null ? (
                        <FaMinus size={20} className="text-gray-500" />
                      ) : ca > caLim - 0.01 ? (
                        <GrStatusGood size={20} className="text-green-500" />
                      ) : (
                        <GrClose size={18} className="text-red" />
                      ))}

                      {resultType === "exam" && (exam == null ? (
                        <FaMinus size={20} className="text-gray-500" />
                      ) : exam > examLim - 0.01 ? (
                        <GrStatusGood size={20} className="text-green-500" />
                      ) : (
                        <GrClose size={18} className="text-red" />
                      ))}

                      {resultType === "resit" && (resit == null ? (
                        <FaMinus size={20} className="text-gray-500" />
                      ) : resit > resitLim - 0.01 ? (
                        <GrStatusGood size={20} className="text-green-500" />
                      ) : (
                        <GrClose size={18} className="text-red" />
                      ))}
                    </td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>

        </div>

        :

        <div className='flex flex-col gap-4 items-center text-center justify-center text-2xl my-20 md:my-40 py-10 border rounded-xl'>
          <div className='font-bold tracking-widest'>Semester {semester}</div>
          <div className='font-semibold text-red italic'>{t("Not Available Yet")} !!!</div>
        </div>
      }
    </>
  );
};

const Result = async (
  { schoolFees, data, semester, examPublished, resitPublished, locale }:
    { schoolFees: NodeSchoolFees, data: EdgeResult[], examPublished: boolean, resitPublished: boolean, semester: "I" | "II", locale: string }
) => {

  const { t: trans } = await initTranslations(locale, ['common'])
  const t = trans("PageStudent")["Result"];

  return (
    <div className="mt-8 mb-4">
      <h2 className="font-semibold mb-4 text-2xl text-center">
        {trans("Semester")} {semester}
      </h2>

      <div className="overflow-x-aut">
        {examPublished ? <table className="border border-collapse border-gray-200 min-w-full shadow-md table-auto">
          <thead>
            <tr className="bg-slate-200">
              <th className="border border-gray-300 font-semibold py-1 text-gray-700">{capitalizeFirstLetter(trans("Course"))}</th>
              <th className="border border-gray-300 font-semibold py-1 text-gray-700">{trans('ca')}</th>
              <th className="border border-gray-300 font-semibold py-1 text-gray-700">{trans('exam')}</th>
              <th className="border border-gray-300 font-semibold py-1 text-gray-700">{trans('resit')}</th>
              <th className="border border-gray-300 font-semibold py-1 text-gray-700">Tot</th>
              <th className="border border-gray-300 font-semibold py-1 text-gray-700">{trans('grade')}</th>
            </tr>
          </thead>
          <tbody>

            {data.map((edge, index: number) => {
              const { node } = edge;
              const { infoData } = node;

              const parsedInfo = typeof infoData === 'string' ? JSON.parse(infoData) : {};
              const { ca = "-", exam = "-", resit = "-", validated = false, average = "-" } = parsedInfo;

              return (
                // <motion.tr
                <tr
                  key={edge.node.id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-200 text-center`}
                >
                  <td className="border border-gray-300 font-medium px-4 py-2 text-sm uppercase">{edge.node.course?.mainCourse?.courseName || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{ca}</td>
                  <td className="border border-gray-300 px-4 py-2">{exam}</td>
                  <td className="border border-gray-300 px-4 py-2">{resitPublished ? resit : "/"}</td>
                  <td className="border border-gray-300 font-semibold gap-2 px-2 py-2">{resitPublished ? resit && resit > -0.01 ? <span className="text-red">*</span> : null : null}<span className={`${resitPublished ? validated ? "text-green-500" : "text-red" : ""}`}>{resitPublished ? calcTotalandGrade(ca, exam, resit).mark : (ca + exam)}</span></td>
                  <td className="border border-gray-300 font-semibold gap-2 px-2 py-2">{resitPublished ? resit && resit > -0.01 ? <span className="text-red">*</span> : null : null}<span className={`${resitPublished ? validated ? "text-green-500" : "text-red" : ""}`}>{calcTotalandGrade(ca, exam, resitPublished ? resit : null).grade}</span></td>
                </tr>
                // </motion.tr>
              );
            })}
          </tbody>
        </table> : <div className='font-semibold text-red italic'>{trans("Not Available Yet")} !!!</div>}

        {data && data.length && resitPublished ? <ResultSlip
          data={data}
          schoolFees={schoolFees}
          semester={semester}
          resitPublished={resitPublished}
        /> : null}


      </div>

    </div>
  );
};


const Notification = (
  { fees, platform, publish, t }
    :
    { semester: "I" | "II", fees: boolean, platform: boolean, publish: boolean, t: any }
) => {
  return <div className="flex flex-col items-center justify-center my-20 p-6 rounded-lg bg-red-100 border border-red-400 text-red-800 shadow-md max-w-lg mx-auto">
    {!platform ? <p className="text-lg text-center">🚫 {t("Sorry, Your Account is not Activated Yet. Contact School Administrator")}.</p>
      : !fees ? <p className="text-lg text-center">🚫 {t("Sorry, you cannot Access Results. Minimum Fee requirement not reached")}.</p>
        : !publish ? <p className="text-lg text-center">🚫 {t("Sorry, Results Not Published Yet. Contact System Administrator")}.</p>
          : null}
  </div>
}




const GET_DATA = gql`
 query GetAllData(
    $first: Int,
    $userprofileId: Decimal,
    $specialtyId: Decimal!,
  ) {
    allSchoolFees(
      first: $first, 
      userprofileId: $userprofileId
    ) {
      edges {
        node {
          id
          balance
          platformPaid
          idPaid
          userprofile {
            id
            session
            code
            customuser { 
              id matricle firstName lastName fullName
            }
            specialty { 
              id
              academicYear
              mainSpecialty { specialtyName }
              level { level }
              tuition
              school { 
                schoolfeesControl
                schoolIdentification { platformCharges logo }
                caLimit examLimit resitLimit
                campus schoolName town telephone address caLimit examLimit resitLimit
              }
            }
            program { id name }
          }
        }
      }
    }
    allResults(first: 40, studentId: $userprofileId) {
      edges {
        node {
          id infoData course { semester mainCourse { courseName } }
        }
      }
    }
    allPublishes(
      first: 4, specialtyId: $specialtyId
    ) {
      edges {
        node {
          id semester ca exam resit 
          specialty { id mainSpecialty { specialtyName}}
        }
      }
    }
  }`;