import FormModal from '@/componentsTwo/FormModal';
import { EdgePublish, EdgeResult, EdgeSchoolFees, NodeSchoolFees, NodeSchoolHigherInfo } from '@/Domain/schemas/interfaceGraphql'
import getApolloClient, { calcTotalandGrade, capitalizeFirstLetter } from '@/functions';
import { gql } from '@apollo/client';
import React from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa';
import { GrClose, GrStatusGood } from 'react-icons/gr';
import EncouragementMessage from './EncouragementMessage';
import initTranslations from '@/initTranslations';
import ResultSlip from '../ResultSlip';



const ResultDisplay = async (
  { params, resultType, title }
    :
    { params: { locale: string, userprofile_id: string, domain: string, specialty_id: string }, resultType: "ca" | "exam" | "resit" | "result", title: string }
) => {
  const { t } = await initTranslations(params.locale, ['common'])

  const client = getApolloClient(params.domain);
  let data;

  try {
    const result = await client.query<any>({
      query: GET_DATA,
      variables: {
        first: 40,
        userprofileId: params.userprofile_id,
        specialtyId: params.specialty_id,
      },
    });
    data = result.data;
  } catch (error: any) {
    console.log(error)
    data = null;
  }

  const schoolFees = data ? data.allSchoolFees?.edges[0].node : null
  const platform = data ? data.allSchoolFees.edges[0].node.platformPaid : 0
  const tuition = data ? data.allSchoolFees.edges[0].node.userprofile.specialty.tuition : 0
  const balance = data ? data.allSchoolFees.edges[0].node.balance : 0
  const paidAmount = tuition - balance
  const feeCheckList = data ? data.allSchoolFees.edges[0].node.userprofile.specialty.school.schoolfeesControl.split(",").map((num: any) => parseFloat(num.trim())) : []
  const pubI = data && data.allPublishes.edges?.filter((item: EdgePublish) => item?.node.semester === "I")
  const pubII = data && data.allPublishes.edges?.filter((item: EdgePublish) => item?.node.semester === "II")

  return (
    <div className='flex flex-col gap-4 min-h-screen pb-4'>
      {/* Main Content */}
      <div className='h-screen mx-1 my-16 p-1 rounded text-black'>

        <div className='flex font-semibold items-center justify-center mb-2 text-xl uppercase'>
          {t(title)} - {t("result")}
        </div>



        <div className='flex-grow'>
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
                        params={params}
                      />
                      :
                      (resultType == "result" && paidAmount > ((feeCheckList[2] - 0.01) * tuition)) ?
                        <Result
                          locale={params.locale}
                          semester='I'
                          schoolFees={schoolFees}
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
                        params={params}
                      />
                      :
                      (resultType == "result" && paidAmount > ((feeCheckList[5] - 0.01) * tuition)) ?
                        <Result
                          locale={params?.locale}
                          semester='II'
                          schoolFees={schoolFees}
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
                <div>No Data (Results)</div>
              )
            ) : (
              <div className='flex flex-col gap-10 items-center justify-center pt-40 text-[18px] text-black'>
                <div className="flex gap-2 items-center">
                  <span className='font-bold text-xl'>Status</span>
                  <span className="bg-red p-2 rounded-full"><GrClose size={28} color="white" width={10} /></span>
                </div>
                <span className='font-bold px-10 text-center text-xl'>Activate Account to Access Results</span>
                <FormModal
                  table='platform_and_id_card'
                  type='custom'
                  params={params}
                  icon={<FaPlus />}
                  data={data?.allSchoolFees.edges}
                  extra_data={{
                    url: `${params.domain}/Section-H/pageStudent/${params.userprofile_id}/${params.specialty_id}/CA`,
                    reason: 'platform_charges',
                  }}
                  buttonTitle={`${t('activate')}`}
                  customClassName='flex gap-2 border bg-bluedash px-6 py-2 rounded text-white font-medium capitalize cursor-pointer'
                />
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center my-20 mx-10 p-6 rounded-lg bg-red-100 border border-red-400 text-red-800 shadow-md max-w-lg mx-auto">
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
      (item) => item.node.ca + item.node.exam < 50 || item.node.resit > 0
    );
  }

  return (
    <>
      {(
        (resultType === "ca" && publish.node.ca) ||
        (resultType === "exam" && publish.node.exam) ||
        (resultType === "resit" && publish.node.resit)
      ) &&
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
                  const { info } = node;

                  const parsedInfo = typeof info === 'string' ? JSON.parse(info) : {};
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
      }
    </>
  );
};

const Result = async ({ schoolFees, data, semester, locale }: { schoolFees: NodeSchoolFees, data: EdgeResult[], semester: "I" | "II", locale: string }) => {

  const { t: trans } = await initTranslations(locale, ['common'])
  const t = trans("PageStudent")["Result"];

  return (
    <div className="mt-8 mb-4">
      <h2 className="font-semibold mb-4 text-2xl text-center">
        {t["Semester"]} {semester}
      </h2>

      <div className="overflow-x-aut">
        <table className="border border-collapse border-gray-200 min-w-full shadow-md table-auto">
          <thead>
            <tr className="bg-slate-200">
              <th className="border border-gray-300 font-semibold py-1 text-gray-700">{capitalizeFirstLetter(t["Course"])}</th>
              <th className="border border-gray-300 font-semibold py-1 text-gray-700">{t['ca']}</th>
              <th className="border border-gray-300 font-semibold py-1 text-gray-700">{t['exam']}</th>
              <th className="border border-gray-300 font-semibold py-1 text-gray-700">{t['resit']}</th>
              <th className="border border-gray-300 font-semibold py-1 text-gray-700">Tot</th>
              <th className="border border-gray-300 font-semibold py-1 text-gray-700">{t['grade']}</th>
            </tr>
          </thead>
          <tbody>

            {data.map((edge, index: number) => {
              const { node } = edge;
              const { info } = node;

              const parsedInfo = typeof info === 'string' ? JSON.parse(info) : {};
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
                  <td className="border border-gray-300 px-4 py-2">{resit}</td>
                  <td className="border border-gray-300 font-semibold gap-2 px-2 py-2">{resit && resit > -0.01 ? <span className="text-red">*</span> : null}<span className={`${validated ? "text-green-500" : "text-red"}`}>{calcTotalandGrade(ca, exam, resit).mark}</span></td>
                  <td className="border border-gray-300 font-semibold gap-2 px-2 py-2">{resit && resit > -0.01 ? <span className="text-red">*</span> : null}<span className={`${validated ? "text-green-500" : "text-red"}`}>{calcTotalandGrade(ca, exam, resit).grade}</span></td>
                </tr>
                // </motion.tr>
              );
            })}
          </tbody>
        </table>

        {data && data.length? <ResultSlip
          data={data}
          schoolFees={schoolFees}
          semester={semester}
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
  return <div className="flex flex-col items-center justify-center my-20 mx-10 p-6 rounded-lg bg-red-100 border border-red-400 text-red-800 shadow-md max-w-lg mx-auto">
    {/* <p className="text-2xl font-semibold underline mb-2">{t["Semester"]} {semester}</p> */}
    {!platform ? <p className="text-lg text-center">🚫 {t["Sorry, Your Account is not Activated Yet. Contact School Administrator"]}.</p>
      : !fees ? <p className="text-lg text-center">🚫 {t["Sorry, you cannot Access Results. Minimum Fee requirement not reached"]}.</p>
        : !publish ? <p className="text-lg text-center">🚫 {t["Sorry, Results Not Published Yet. Contact System Administrator"]}.</p>
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
            user { 
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
          id info course { semester mainCourse { courseName } }
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