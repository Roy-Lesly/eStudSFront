'use client';
import { EdgePublish, EdgeResult, EdgeSchoolFees, EdgeTranscriptApplications } from '@/Domain/schemas/interfaceGraphql';
import { motion } from 'framer-motion';
import { GrClose, GrStatusGood } from 'react-icons/gr';
import { gql, useMutation } from '@apollo/client';
import getApolloClient, { decodeUrlID } from '@/functions';
import { useMemo, useState } from 'react';


interface GetDataResponse {
    allSchoolFees: {
        edges: EdgeSchoolFees[]
    }
    allResults: {
        edges: EdgeResult[]
    }
    allPublishes: {
        edges: EdgePublish[]
    }
    allTranscriptApplications: {
        edges: EdgeTranscriptApplications[]
    }
}

const CREATE_TRANSCRIPT_APPLICATION = gql`
  mutation CreateTranscriptApplication($input: TranscriptApplicationInput!) {
    createTranscriptApplication(input: $input) {
      transcriptApplication {
        id
        status
        printCount
        userprofile { specialty { academicYear level { level} mainSpecialty { specialtyName}} user { fullName matricle}}
      }
    }
  }
`;

const UPDATE_TRANSCRIPT_APPLICATION = gql`
  mutation UpdateTranscriptApplication($input: TranscriptApplicationInput!) {
    updateTranscriptApplication(input: $input) {
      transcriptApplication {
        id
        status
        printCount
        userprofile { specialty { academicYear level { level} mainSpecialty { specialtyName}} user { fullName matricle}}
      }
    }
  }
`;

const DisplayPage = ({ data, params }: { data: GetDataResponse | null, params: { domain: string } }) => {
    const [loading, setLoading] = useState(false);
    const client = useMemo(() => getApolloClient(params.domain), [params.domain]);


    const checkAllResults = (result: EdgeResult[]) => {
        var response = false;
        if (result && result.length) {
            for (let index = 0; index < result.length; index++) {
                if (!result[index].node.average || result[index].node.average < 0 || result[index].node.average > 100) { response = false; break; };
            }
        }
        return response;
    };

    const [createTranscriptApplication, { loading: creatingLoading, error: errorCreating, data: createdData }] = useMutation(
        CREATE_TRANSCRIPT_APPLICATION,
        { client }
    );
    const [updateTranscriptApplication, { loading: updatingLoading, error: errorUpdating, data: updatedData }] = useMutation(
        UPDATE_TRANSCRIPT_APPLICATION,
        { client }
    );


    const handleApplyClick = async () => {
        if (!data?.allSchoolFees) return;
        setLoading(true);
        try {
            const result = await createTranscriptApplication({
                variables: {
                    input: {
                        userprofileId: parseInt(decodeUrlID(data?.allSchoolFees.edges[0].node.userprofile.id.toString() || "")), // Replace with appropriate value
                        printCount: 0,
                        status: "PENDING",
                    },
                },
            });

            console.log("71 Mutation result:", result);
            alert("Application submitted successfully!");
        } catch (err) {
            console.error("74 Mutation error:", err);
            if (typeof errorCreating == "object" && errorCreating.name) { }
            alert("Failed to submit application. Please try again.");
        } finally {
            setLoading(false);
        }

    };
    const handleUpdateClick = async () => {
        if (!data?.allTranscriptApplications || data?.allTranscriptApplications.edges.length < 1) return;
        setLoading(true);
        try {
            const result = await updateTranscriptApplication({
                variables: {
                    input: {
                        id: `${decodeUrlID(data?.allTranscriptApplications.edges[0].node.id.toString())}`,  // Ensure the ID is correctly decoded
                        userprofileId: parseInt(decodeUrlID(data?.allSchoolFees.edges[0].node.userprofile.id.toString())), // Replace with appropriate value
                        printCount: data.allTranscriptApplications.edges[0].node.printCount + 1,
                        status: "PENDING",
                    },
                },
            });

            console.log("71 Mutation result:", result);
            alert("Application submitted successfully!");
        } catch (err) {
            console.error("74 Mutation error:", err);
            if (err instanceof Error) {
                alert(err.message);
            }
            if (typeof errorUpdating == "object" && errorUpdating.name) { }
            alert("Failed to submit application. Please try again.");
        } finally {
            setLoading(false);
        }

    };

    return (<>
        {client ?
            <motion.div
                className="h-screen mb-20 mt-16 mx-1 p-1 rounded text-black"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="flex font-semibold items-center justify-center mb-6 mt-4 text-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    TRANSCRIPT REQUEST
                </motion.div>
                {data ? (
                    <>
                        {data.allSchoolFees.edges.length == 1 ? (
                            <Comp status={data.allSchoolFees.edges[0].node.platformPaid} title={"Account Status"} />
                        ) : (
                            <motion.div>No School Fees Information</motion.div>
                        )}
                        {data.allSchoolFees.edges.length == 1 ? (
                            <Comp status={data.allSchoolFees.edges[0].node.balance < 1} title={"Tuition Status"} />
                        ) : null}
                        {data.allPublishes.edges ? (
                            <Comp status={data.allPublishes.edges.length == 2} title={"Results Published"} />
                        ) : (
                            <motion.div>No Publish Information</motion.div>
                        )}
                        {data.allResults.edges ? (
                            <Comp status={checkAllResults(data.allResults.edges)} title={"Written All Results"} />
                        ) : (
                            <motion.div>No Result Information</motion.div>
                        )}
                        {data.allTranscriptApplications.edges.length > 0 ? (
                            <TranscriptApplicationTable data={data.allTranscriptApplications.edges} />
                        ) : (
                            <Comp status={data.allTranscriptApplications.edges.length > 0} title={"Transcript Application"} />
                        )}
                    </>
                ) : (
                    <motion.div>Error Occurred</motion.div>
                )}

                {data && data.allSchoolFees.edges.length == 1 && checkAllResults(data.allResults.edges) && data.allPublishes.edges.length == 2 && data.allTranscriptApplications.edges.length < 1 ? <div className='flex items-center justify-center my-4 py-4'>
                    <button
                        onClick={handleApplyClick}
                        disabled={loading || creatingLoading}
                        className="bg-blue-500 disabled:bg-gray-400 px-4 py-2 rounded text-white"
                    >
                        {loading || creatingLoading ? 'Applying...' : 'Apply'}
                    </button>
                </div> : null}

                {data && data.allSchoolFees.edges.length == 1 && data.allPublishes.edges.length == 2 && data.allTranscriptApplications.edges.length > 0 ? <div className='flex items-center justify-center my-4 py-4'>
                    <button
                        onClick={handleUpdateClick}
                        disabled={loading || updatingLoading}
                        className="bg-blue-500 disabled:bg-gray-400 px-4 py-2 rounded text-white"
                    >
                        {loading || updatingLoading ? 'Applying...' : 'Apply Again'}
                    </button>
                </div> : null}

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
