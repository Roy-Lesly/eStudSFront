import { capitalizeFirstLetter } from '@/functions';
import { gql } from '@apollo/client';
import initTranslations from '@/initTranslations';
import PaymentStatus from '../../Section-S/pageParent/[userprofilesec_id]/[classroomsec_id]/PaymentStatus';
import { EdgeResultSecondary, NodeSchoolFeesSec } from '@/utils/Domain/schemas/interfaceGraphqlSecondary';
import EncouragementMessage from '@/app/[locale]/[domain]/SectionAll/EncouragementMessage';
import { queryServerGraphQL } from '@/utils/graphql/queryServerGraphQL';



const ResultDisplaySecondary = async (
  { params, resultType, title }
    :
    { params: any, resultType: "First" | "Second" | "Third" | "all", title: string }
) => {

  const p = await params;
  const { t } = await initTranslations(p.locale, ['common'])

  const data = await queryServerGraphQL({
    domain: p.domain,
    query: GET_DATA,
    variables: {
      first: 40,
      userprofilesecId: p.userprofilesec_id,
      classroomsecId: p.classroomsec_id,
    },
  });


  const schoolFees: NodeSchoolFeesSec = data ? data.allSchoolFeesSec?.edges[0].node : null
  const platformPaid = data ? data?.allSchoolFeesSec?.edges[0].node.platformPaid : 0
  const tuition = data ? data?.allSchoolFeesSec?.edges[0].node.userprofilesec.classroomsec.tuition : 0
  const balance = data ? data?.allSchoolFeesSec?.edges[0].node.balance : 0
  const paidAmount = tuition - balance
  const feeCheckList = data ? data?.allSchoolFeesSec?.edges[0]?.node.userprofilesec.classroomsec.school.schoolfeesControl.split(",").map((num: any) => parseFloat(num.trim())) : []
  const publish: any = data && JSON.parse(data?.allPublishSec?.edges[0]?.node?.publishSeq || "{}")

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>

      <div className='text-center font-semibold text-xl uppercase my-6'>
        {t(title)} - {t("result")}
      </div>


      <div className='flex-grow px-2 mb-24'>
        {data ? (
          platformPaid ? (
            data.allResultsSec ? (
              <>
                {
                  (
                    (resultType == "First" && paidAmount > ((feeCheckList[0] - 0.01) * tuition)) ||
                    (resultType == "Second" && paidAmount > ((feeCheckList[1] - 0.01) * tuition)) ||
                    (resultType == "Third" && paidAmount > ((feeCheckList[2] - 0.01) * tuition)) ||
                    (resultType == "all" && paidAmount > ((feeCheckList[3] - 0.01) * tuition))
                  ) && publish ?
                    <TermResultResit
                      resultType={resultType}
                      data={data?.allResultsSec?.edges}
                      fees={schoolFees}
                      publish={publish}
                      platform={platformPaid}
                      p={p}
                    />
                    :
                    <Notification
                      platform={platformPaid}
                      fees={
                        resultType === "First" && paidAmount > ((feeCheckList[0] - 0.01) * tuition) ||
                        resultType === "Second" && paidAmount > ((feeCheckList[1] - 0.01) * tuition) ||
                        resultType === "Third" && paidAmount > ((feeCheckList[2] - 0.01) * tuition)
                      }
                      publish={
                        resultType === "First" && publish?.term_1 ||
                        resultType === "Second" && publish?.term_2 ||
                        resultType === "Third" && publish?.term_3
                      }
                      t={t}
                    />

                }
              </>
            ) : (
              <div className="text-center text-red-600 text-lg mt-10">{t("No Data")} {t("Results")}</div>
            )
          ) : (
            <PaymentStatus
              params={params}
              apiSchoolFees={data.allSchoolFeesSec?.edges[0]}
              school={schoolFees?.userprofilesec?.classroomsec?.school}
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center my-20 p-6 rounded-lg bg-red-100 border border-red-400 text-red-800 shadow-md max-w-lg mx-auto">
            <p className="text-2xl text-center">🚫 {t("No Data Available")}.</p>
          </div>
        )}
      </div>


      {data ?
        <div className="sticky bottom-10 bg-white shadow-inner pt-2 px-2 z-20 border-t">
          <EncouragementMessage
            profile={data?.allSchoolFeesSec?.edges[0].node?.userprofilesec}
            source='S'
          />
        </div>
        :
        null}

    </div>
  );

}

export default ResultDisplaySecondary


const TermResultResit = async (
  { resultType, data, fees, publish, p }
    :
    { platform: boolean, resultType: "First" | "Second" | "Third" | "all", data: EdgeResultSecondary[], fees: NodeSchoolFeesSec, publish: any, p: any }
) => {

  const seqLim = fees ? fees?.userprofilesec.classroomsec.school.seqLimit / 2 : 0;

  const { t } = await initTranslations(p.locale, ['common'])

  return (
    <>
      {(
        (resultType === "First" && (publish?.seq_1 || publish?.seq_2)) ||
        (resultType === "Second" && (publish?.seq_3 || publish?.seq_4)) ||
        (resultType === "Third" && (publish?.seq_5 || publish?.seq_6)) ||
        (resultType === "all" && (publish?.term_1 && publish?.term_2 && publish?.term_3))
      ) ? (
        <div className="mt-6">
          <h2 className="font-semibold mb-4 text-2xl text-center">
            {t(resultType)} {t("Term")}
          </h2>

          <div className="overflow-x-auto border">
            <table className="border-collapse rounded-lg shadow-md table-auto w-full">
              <thead className="bg-blue-950 text-white">
                <tr>
                  <th className="px-1 py-2 text-left w-6/12">{t("Subject")}</th>
                  <th className="py-2 text-center w-2/12">
                    {resultType === "First" && t("Seq 1")}
                    {resultType === "Second" && t("Seq 3")}
                    {resultType === "Third" && t("Seq 5")}
                    {resultType === "all" && t("1")}
                  </th>
                  <th className="py-2 text-center w-2/12">
                    {resultType === "First" && t("Seq 2")}
                    {resultType === "Second" && t("Seq 4")}
                    {resultType === "Third" && t("Seq 6")}
                    {resultType === "all" && t("2")}
                  </th>
                  {resultType === "all" ?
                    <th className="py-2 text-center w-2/12">
                      {t("3")}
                    </th> : null}
                  <th className="px-1 py-2 text-center w-1/12">{t("Av")}</th>
                  <th className="px-1 py-2 text-center w-1/12">{t("Grade")}</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {data.map((edge: EdgeResultSecondary) => {
                  const { node } = edge;
                  const { infoData } = node;

                  const parsedInfo = typeof infoData === "string" ? JSON.parse(infoData) : {};
                  const {
                    seq_1 = "-", seq_2 = "-", av_term_1 = "-", grade_1 = "-",
                    seq_3 = "-", seq_4 = "-", av_term_2 = "-", grade_2 = "-",
                    seq_5 = "-", seq_6 = "-", av_term_3 = "-", grade_3 = "-",
                    av_annual = "-", grade_annual = "-",
                  } = parsedInfo;

                  // determine which sequences to show
                  let firstVal: any = "-";
                  let secondVal: any = "-";
                  let thirdVal: any = "-";
                  let grade: string = "-";
                  let av_term: any = 0;

                  if (resultType === "First") {
                    firstVal = publish?.seq_1 ? seq_1 : "-";
                    secondVal = publish?.seq_2 ? seq_2 : "-";
                    av_term = publish?.term_1 ? av_term_1 : "-";
                    grade = publish?.term_1 ? grade_1 : "-";
                  } else if (resultType === "Second") {
                    firstVal = publish?.seq_3 ? seq_3 : "-";
                    secondVal = publish?.seq_4 ? seq_4 : "-";
                    av_term = publish?.term_2 ? av_term_2 : "-";
                    grade = publish?.term_2 ? grade_2 : "-";
                  } else if (resultType === "Third") {
                    firstVal = publish?.seq_5 ? seq_5 : "-";
                    secondVal = publish?.seq_6 ? seq_6 : "-";
                    av_term = publish?.term_3 ? av_term_3 : "-";
                    grade = publish?.term_3 ? grade_3 : "-";
                  } else if (resultType === "all") {
                    firstVal = publish?.term_1 ? av_term_1 : "-";
                    secondVal = publish?.term_2 ? av_term_2 : "-";
                    thirdVal = publish?.term_3 ? av_term_3 : "-";
                  }

                  return (
                    <tr
                      key={node.id}
                      className="border-gray-200 border-t hover:bg-gray-100"
                    >
                      <td className="px-1 py-1 text-slate-800 font-medium">
                        {node.subjectsec?.mainsubject?.subjectName}
                      </td>
                      <td className="py-1 text-center text-slate-800">
                        {firstVal}
                      </td>
                      <td className="py-1 text-center text-slate-800">
                        {secondVal}
                      </td>
                      {resultType === "all" ?
                      <td className="py-1 text-center text-slate-800">
                        {thirdVal}
                      </td> : null}
                      <td className="py-1 text-center text-slate-800">
                        {resultType !== "all" ? av_term : av_annual}
                      </td>
                      <td className={`py-1 text-center flex justify-center items-center gap-1 font-medium ${(resultType !== "all" ? av_term : av_annual) < (seqLim / 2) ? "text-red" : "text-green-600"}`}>
                        {grade}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 items-center text-center justify-center text-2xl my-20 md:my-40 py-10 border rounded-xl">
          <div className="font-bold tracking-widest">
            {t(resultType)} {t("Term")}
          </div>
          <div className="font-semibold text-red italic">{t("Not Available Yet")} !!!</div>
        </div>
      )}
    </>

  );
};


const Notification = (
  { fees, platform, publish, t }
    :
    { fees: boolean, platform: boolean, publish: boolean, t: any }
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
    $userprofilesecId: Decimal,
    $classroomsecId: Decimal,
  ) {
    allSchoolFeesSec(
      first: $first, 
      userprofilesecId: $userprofilesecId
    ) {
      edges {
        node {
          id
          balance
          platformPaid
          idPaid
          userprofilesec {
            id
            session
            customuser { 
              id matricle firstName lastName fullName
            }
            classroomsec { 
              id
              academicYear
              level
              tuition
              school { 
                schoolfeesControl
                schoolIdentification { platformCharges logo }
                caLimit examLimit resitLimit
                campus logoCampus schoolName town telephone address caLimit examLimit resitLimit
              }
            }
            programsec
          }
        }
      }
    }
    allResultsSec(first: 40, studentId: $userprofilesecId) {
      edges {
        node {
          id infoData subjectsec { mainsubject { subjectName } }
        }
      }
    }
    allPublishSec(
      first: 4, classroomsecId: $classroomsecId
    ) {
      edges {
        node {
          id 
          classroomsec { id level }
          publishSeq
          portalSeq
        }
      }
    }
    
  }`;