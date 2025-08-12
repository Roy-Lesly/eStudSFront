'use client';
import { EdgePublish, EdgeResult, EdgeSchoolFees, EdgeTranscriptApplications } from '@/Domain/schemas/interfaceGraphql';
import { motion } from 'framer-motion';
import { GrClose, GrStatusGood } from 'react-icons/gr';
import { gql } from '@apollo/client';
import { decodeUrlID } from '@/functions';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiFactory } from '@/utils/graphql/ApiFactory';
import { useRouter } from 'next/navigation';
import PaymentStatus from '../PaymentStatus';
import getApolloClient from '@/utils/graphql/GetAppolloClient';


const DisplayPage = ({ data, params }: { data: any, params: { domain: string, userprofile_id: string } }) => {

    const school = data?.allSchoolFees.edges[0]?.userprofile?.specialty?.school ?? null;

    const { t } = useTranslation("common");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const client = useMemo(() => getApolloClient(params.domain), [params.domain]);


    const checkAllResults = (result: EdgeResult[]) => {
        var response = false;
        if (result && result.length) {
            for (let index = 0; index < result.length; index++) {
                const info = typeof result[index].node.infoData === "string" ? JSON.parse(result[index].node.infoData) : {};
                if (!info.average || info.average < 0 || info.average > 100) { response = false; break; };
            }
        }
        return response;
    };

    const handleSubmit = async () => {

        setLoading(true);

        let newData: any = {
            userprofileId: params.userprofile_id,
            printCount: data?.allTranscriptApplications?.edges.length ? data?.allTranscriptApplications?.edges[0].node.printCount + 1 : 0,
            status: "PENDING",
            delete: false,
        }

        if (data?.allTranscriptApplications.edges.length) {
            newData = {
                ...newData,
                id: decodeUrlID(data?.allTranscriptApplications.edges[0].node.id.toString())
            }
        }

        await ApiFactory({
            newData: newData,
            editData: newData,
            mutationName: "createUpdateDeleteTranscriptApplication",
            modelName: "transcriptapplication",
            successField: "id",
            query,
            router,
            params,
            redirect: false,
            reload: true,
            redirectPath: ``,
            actionLabel: "processing",
        });
        setLoading(false)

    };

    return (<>
        {client ?
            <motion.div
                className="min-h-screen mb-20 mt-16 mx-1 px-1 pt-1 pb-28 rounded text-black"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="flex font-semibold items-center justify-center mt-6 text-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {t("TRANSCRIPT REQUEST")}
                </motion.div>
                {data ? (
                    <>
                        {data.allSchoolFees.edges.length == 1 ? (
                            <Comp status={data.allSchoolFees.edges[0].node.platformPaid} title={t("Account Status")} />
                        ) : (
                            <motion.div>{t("No School Fees Information")}</motion.div>
                        )}
                        {data.allSchoolFees.edges.length == 1 ? (
                            <Comp status={data.allSchoolFees.edges[0].node.balance < 1} title={t("Tuition Status")} />
                        ) : null}
                        {data.allPublishes.edges ? (
                            <Comp status={data.allPublishes.edges.length == 2} title={t("Results Published")} />
                        ) : (
                            <motion.div>{t("No Publish Information")}</motion.div>
                        )}
                        {data.allResults.edges ? (
                            <Comp status={checkAllResults(data.allResults.edges)} title={t("Written All Results")} />
                        ) : (
                            <motion.div>{t("No Result Information")}</motion.div>
                        )}
                        {data.allTranscriptApplications.edges.length > 0 ? (
                            <TranscriptApplicationTable data={data.allTranscriptApplications.edges} />
                        ) : (
                            <Comp status={data.allTranscriptApplications.edges.length > 0} title={t("Transcript Application")} />
                        )}
                    </>
                ) : (
                    <motion.div>{t("Error Occurred")}</motion.div>
                )}

                {/* {data && data.allSchoolFees.edges.length == 1 && checkAllResults(data.allResults.edges) && data.allPublishes.edges.length == 2 && data.allTranscriptApplications.edges.length < 1 ? <div className='flex items-center justify-center my-4 py-4'> */}
                {data && data.allSchoolFees.edges[0].node.platformPaid ?
                    data.allSchoolFees.edges.length == 1 && data.allTranscriptApplications.edges.length < 1 ? <div className='flex items-center justify-center my-4 py-4'>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-blue-500 disabled:bg-gray-400 px-4 py-2 rounded text-white"
                        >
                            {loading ? 'Applying...' : 'Apply'}
                        </button>
                    </div>
                        :
                        null
                    :
                    <PaymentStatus
                        apiSchoolFees={data?.allSchoolFees.edges[0].node}
                        params={params}
                        school={school}
                    />
                }


            </motion.div>
            : <motion.div>Loading...</motion.div>
        }</>
    );
};

const Comp = ({ status, title }: { status: boolean, title: string }) => {
    return (
        <motion.div
            className="bg-gray-100 flex items-center justify-between mb-4 px-6 py-4 rounded shadow-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="font-semibold text-lg">{title}</div>
            <div className="flex gap-2 items-center">
                {status ? (
                    <GrStatusGood className="text-green-600" size={22} />
                ) : (
                    <GrClose className="text-red-600" size={20} />
                )}
            </div>
        </motion.div>
    );
};

const TranscriptApplicationTable = ({ data }: { data: EdgeTranscriptApplications[] }) => {
    return (
        <motion.div
            className="bg-white overflow-hidden rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="bg-gray-200 font-semibold px-6 py-4 text-gray-800 text-lg">
                Transcript Application Status
            </div>
            <div className="px-1">
                <table className="border-collapse table-auto w-full">
                    <thead>
                        <tr className="bg-gray border-b grid grid-cols-12 text-left">
                            <th className="col-span-5 font-medium pr-1 py-2 text-gray-600">Class</th>
                            <th className="col-span-4 font-medium py-2 text-gray-600">Year / Lev</th>
                            <th className="col-span-3 font-medium pl-1 py-2 text-center text-gray-600">State</th>
                        </tr>
                    </thead>
                    <motion.tbody>
                        {data.map((item: EdgeTranscriptApplications, index: number) => (
                            <motion.tr
                                key={index}
                                className={`border-b grid grid-cols-12 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <td className="col-span-5 pr-1 py-2 text-gray-700 text-sm">
                                    {item.node.userprofile.specialty.mainSpecialty.specialtyName}
                                </td>
                                <td className="col-span-4 flex items-center py-2 text-gray-700 text-sm">
                                    {item.node.userprofile.specialty.academicYear} - {item.node.userprofile.specialty.level.level}
                                </td>
                                <td
                                    className={`flex col-span-3 pl-1 py-2 text-sm italic items-center justify-center font-medium text-center ${item.node.status == "PENDING" ? "text-red" : item.node.status == "APPROVED" ? "text-yellow-600" : "text-green-600"}
                                        }`}
                                >
                                    {item.node.status}
                                </td>
                            </motion.tr>
                        ))}
                    </motion.tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default DisplayPage;



const query = gql`
  mutation CreatUpdate(
    $id: ID
    $userprofileId: ID!
    $printCount: Int!
    $status: String!
    $delete: Boolean!
  ) {
    createUpdateDeleteTranscriptApplication(
        id: $id
        userprofileId: $userprofileId
        printCount: $printCount
        status: $status
        delete: $delete
    ) {
        transcriptapplication {
            id
        }
    }
  }
`;
