'use client';
import { decodeUrlID } from '@/functions';
import PasswordResetModal from '@/PasswordModal';
import React, { useState } from 'react'
import { FaCheckCircle, FaTimesCircle, FaUserCircle } from "react-icons/fa";



const List = (
    { data, params }
        :
        { data: any, params: any }
) => {
    const [passwordState, setPasswordState] = useState<"reset" | "change" | null>(null);
    console.log(passwordState)
    return (
        <main className="bg-gradient-to-br flex from-blue-500 items-center justify-center min-h-screen pt-20 px-2 pb-20 to-purple-600">
            <div className="animate-fadeIn bg-white max-w-3xl p-4 rounded-lg shadow-xl w-full">

                {/* <div
                    style={{
                        paddingRight: 2,
                        paddingLeft: 2,
                        backgroundImage: `url(${data?.allUserProfiles.edges[0].node.specialty.school.schoolIdentification.logo
                            ? `https://api${params.domain}.e-conneq.com/media/${data?.allUserProfiles.edges[0].node.specialty.school.schoolIdentification.logo}`
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
                /> */}

                {data?.allUserProfiles.edges?.length === 1 && (
                    <div className="flex flex-col items-center mb-4">
                        <div className="bg-slate-200 border-1 border-slate-300 h-32 overflow-hidden rounded-lg w-32">
                            <div className="bg-blue-300 border-slate-300 flex h-32 items-center justify-center overflow-hidden p-1 rounded-lg w-32">
                                {data?.allUserProfiles.edges[0].node.user?.photo ? (
                                    <img
                                        // src={data?.allUserProfiles.edges[0].node.user.photo}
                                        src={`https://api${params.domain}.e-conneq.com/media/${data?.allUserProfiles.edges[0].node.user.photo}`}
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
                <h2 className="font-semibold mb-1 text-center text-slate-800 text-lg">
                    MY PROFILE
                </h2>
                {data?.allUserProfiles.edges.length === 1 ? (<>
                    <div className="flex flex-col gap-3 justify-center items-center text-center">
                        <div className="flex flex-col">
                            <p className=" text-slate-600">Full Name / Nom et Prenom:</p>
                            <p className="text-black font-semibold">{data?.allUserProfiles.edges[0].node.user?.fullName}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="font-medium text-slate-600">Matricle:</p>
                            <p className="text-black font-bold text-2xl">{data?.allUserProfiles.edges[0].node.user?.matricle}</p>
                        </div>

                        <div className="flex w-full">
                            <div className="flex flex-col w-1/2">
                                <p className="font-medium text-slate-600">Date of Birth / Naissance:</p>
                                <p className="text-black font-bold">{data?.allUserProfiles.edges[0].node.user?.dob}</p>
                            </div>
                            <div className="flex flex-col w-1/2">
                                <p className="font-medium text-slate-600">Place of Birth / Naissance:</p>
                                <p className="text-black font-bold">{data?.allUserProfiles.edges[0].node.user?.pob}</p>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <p className="font-medium text-slate-800">Specialty / Filiere:</p>
                            <p className="text-black font-bold">{data?.allUserProfiles.edges[0].node.specialty?.mainSpecialty?.specialtyName}</p>
                        </div>
                        <div className="flex w-full">
                            <div className="flex flex-col w-1/2">
                                <p className="font-medium text-slate-600">Year / Annee:</p>
                                <p className="text-black font-bold">{data?.allUserProfiles.edges[0].node.specialty?.academicYear}</p>
                            </div>
                            <div className="flex flex-col w-1/2">
                                <p className="font-medium text-slate-600">Level / Niveau:</p>
                                <p className="text-black font-bold">{data?.allUserProfiles.edges[0].node.specialty?.level.level}</p>
                            </div>
                        </div>

                        <br />

                        <div className="flex w-full">
                            <div className="flex flex-col w-1/2">
                                <p className="font-medium text-slate-600">Nationality:</p>
                                <p className="text-black font-bold">{data?.allUserProfiles.edges[0].node.user.nationality || "?"}</p>
                            </div>
                            <div className="flex flex-col w-1/2">
                                <p className="font-medium text-slate-600">Region Of Origin:</p>
                                <p className="text-black font-bold">{data?.allUserProfiles.edges[0].node.user.regionOfOrigin || "?"}</p>
                            </div>
                        </div>
                        <div className="flex w-full">
                            <div className="flex flex-col w-1/2">
                                <p className="font-medium text-slate-600">Highest Certificate:</p>
                                <p className="text-black font-bold">{data?.allUserProfiles.edges[0].node.user.highestCertificate || "?"}</p>
                            </div>
                            <div className="flex flex-col w-1/2">
                                <p className="font-medium text-slate-600">Year Obtained:</p>
                                <p className="text-black font-bold">{data?.allUserProfiles.edges[0].node.user.yearObtained || "?"}</p>
                            </div>
                        </div>

                        <hr />
                        <br />
                        <h2 className="font-bold">Parent Information</h2>

                        <div className="flex w-full justify-center">
                            <div className="flex flex-col">
                                <p className="font-medium text-slate-600">Parent Name / Nom du Parent:</p>
                                <p className="text-black font-bold">{data?.allUserProfiles.edges[0].node.user.parent || "?"}</p>
                            </div>
                        </div>
                        <div className="flex w-full">
                            <div className="flex flex-col w-full">
                                <p className="font-medium text-slate-600">Telephone:</p>
                                <p className="text-black font-bold">{data?.allUserProfiles.edges[0].node.user.parentTelephone || "?"}</p>
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center justify-center'>
                        <button
                            onClick={() => { setPasswordState("change"); console.log("object dd") }}
                            type='button'
                            className='cursor-pointer text-lg font-semibold bg-teal-800 text-white tracking-wider rounded-lg border px-4 py-2 mb-4'
                        >
                            Change Password
                        </button>
                    </div>

                    <br />
                    <hr className="py-2" />

                    <div className="flex flex-col items-center justify-center">
                        <FaCheckCircle className="h-10 text-green-500 w-10" />
                        <p className="font-semibold mt-2 text-green-500">Verified</p>
                    </div>
                </>
                ) : (<div className="py-20 hidden">
                    <div className="flex flex-col items-center justify-center mt-4">
                        <FaTimesCircle className="h-12 text-red w-12" />
                        <p className="font-semibold mt-4 text-teal-700 text-xl">No Student Data Available</p>
                    </div>
                </div>
                )}

            </div>

            <PasswordResetModal
                action={passwordState}
                onClose={() => setPasswordState(null)}
                id={parseInt(decodeUrlID(data?.allUserProfiles.edges[0].node?.user?.id))}
            />

        </main>
    )
}

export default List
