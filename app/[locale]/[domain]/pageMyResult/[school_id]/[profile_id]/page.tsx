import React, { Suspense } from "react";
import { getDataNotProtected } from "@/functions";
import { Metadata } from "next";
import { GetUserProfileUrl } from "@/Domain/Utils-H/userControl/userConfig";
import { protocol } from "@/config";
import { GetUserProfileInter } from "@/Domain/Utils-H/userControl/userInter";
import { FaCheckCircle, FaTimesCircle, FaUserCircle } from "react-icons/fa";
import { gql } from "@apollo/client";
import getApolloClient, { errorLog } from "@/utils/graphql/GetAppolloClient";

export const metadata: Metadata = {
    title: "Transcript",
    description: "This is the Transcript Page",
};

const page = async ({
    params,
    searchParams
}: {
    params: any;
    searchParams: any;
}) => { const p = await params; const sp = await searchParams;

    const apiStudentInfo: GetUserProfileInter[] = await getDataNotProtected(
        `${protocol}api${p.domain}${GetUserProfileUrl}`,
        { id: p.profile_id, nopage: true },
        p.domain
    );

    const client = getApolloClient(p.domain);
    let data;
    try {
        const result = await client.query<any>({
            query: GET_DATA,
            variables: {
                id: p.profile_id,
                schoolId: p.school_id,
                timestamp: new Date().getTime()
            },
            fetchPolicy: 'no-cache'
        });
        data = result.data;
    } catch (error: any) {
        errorLog(error);
        if (error.networkError && error.networkError.result) {
        }
        data = null;
    }

    return (
        <main className="bg-gradient-to-br flex from-blue-500 items-center justify-center min-h-screen p-4 to-purple-600">
            <div className="animate-fadeIn bg-white max-w-3xl p-6 rounded-lg shadow-xl w-full">

                <div
                    style={{
                        backgroundImage: `url(${data.allSchoolInfos.edges[0]?.node.schoolIdentification.logo
                                ? `https://api${params.domain}.e-conneq.com/media/${data.allSchoolInfos.edges[0]?.node.schoolIdentification.logo}`
                                : ""
                            })`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        width: '100%',
                        height: '100%',
                        opacity: 0.1,
                    }}
                    className="absolute h-full left-0 rounded-r-lg top-0 w-full z-0"
                />


                {/* Header */}
                {apiStudentInfo.length === 1 && (
                    <div className="flex flex-col items-center mb-2">
                        <h1 className="font-bold mb-2 text-3xl text-center text-slate-800">
                            {apiStudentInfo[0].school_name}
                        </h1>
                        <p className="text-slate-800">{apiStudentInfo[0].campus}</p>
                    </div>
                )}

                {/* Student Photo and Barcode */}
                {apiStudentInfo.length === 1 && (
                    <div className="flex flex-col items-center mb-4">
                        <div className="bg-slate-200 border-1 border-slate-300 h-32 overflow-hidden rounded-lg w-32">
                            <div className="bg-blue-300 border-slate-300 flex h-32 items-center justify-center overflow-hidden pt-1 rounded-lg w-32">
                                {apiStudentInfo[0].photo ? (
                                    <img
                                        src={apiStudentInfo[0].photo}
                                        alt="Student Photo"
                                        className="h-full object-cover w-full"
                                    />
                                ) : (
                                    <FaUserCircle size={40} className="h-24 text-slate-500 w-24" /> 
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Student Information */}
                <h2 className="font-semibold mb-4 text-center text-slate-800 text-xl">
                    Student Information
                </h2>
                {data.allUserProfiles.edges.length === 1 ? (<>
                    <div className="gap-2 grid grid-cols-1 md:grid-cols-2">
                        <div className="flex flex-col">
                            <p className="font-semibold text-slate-500">Full Name / Nom et Prenom:</p>
                            <p className="text-black font-semibold">{data.allUserProfiles.edges[0].node.customuser?.fullName}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="font-semibold text-slate-500">Matricle:</p>
                            <p className="text-black font-semibold">{data.allUserProfiles.edges[0].node.customuser?.matricle}</p>
                        </div>

                        <div className="flex flex-col">
                            <p className="font-semibold text-slate-500">Specialty / Filiere:</p>
                            <p className="text-black font-semibold">{data.allUserProfiles.edges[0].node.specialty?.mainSpecialty?.specialtyName}</p>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex flex-col">
                                <p className="font-semibold text-slate-500">Year / Annee:</p>
                                <p className="text-black font-semibold">{data.allUserProfiles.edges[0].node.specialty?.academicYear}</p>
                            </div>
                            <div className="flex flex-col">
                                <p className="font-semibold text-slate-600">Level / Niveau:</p>
                                <p className="text-slate-800">{data.allUserProfiles.edges[0].node.specialty?.level?.level}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center mt-4">
                        <FaCheckCircle className="h-10 text-green-500 w-10" />
                        <p className="font-semibold mt-2 text-green-500">Verified</p>
                    </div>
                </>
                ) : (<div className="py-20">
                    <div className="flex flex-col items-center justify-center mt-4">
                        <FaTimesCircle className="h-12 text-red w-12" />
                        <p className="font-semibold mt-4 text-teal-700 text-xl">No Student Data Available</p>
                    </div>
                </div>
                )}

            </div>
        </main>
    );
};

export default page;




const GET_DATA = gql`
 query GetData(
    $id: ID!
    $schoolId: ID!
) {
    allSchoolInfos(
      id: $schoolId
    ) {
      edges {
        node {
          id campus telephone email
          schoolIdentification { name logo}
        }
      }
    }
    allUserProfiles(
        id: $id,
        isActive: true
    ){
        edges {
        node {
            id user { fullName matricle} specialty { academicYear level { level} mainSpecialty { specialtyName}}
        }
    }
  }
}
`;
