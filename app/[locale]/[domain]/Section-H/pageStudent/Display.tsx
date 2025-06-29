'use client';

import { EdgeUserProfile } from '@/utils/Domain/schemas/interfaceGraphql';
import { decodeUrlID } from '@/utils/functions';
import { useRouter } from 'next/navigation';
import React from 'react';

const Display = ({ data, p }: { data: EdgeUserProfile[], p: any }) => {
    const router = useRouter();

    if (!data?.length) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-6 text-red-600 font-semibold text-base sm:text-lg">
                No profiles found. Please contact administration.
            </div>
        );
    }
    //                 <Link href={`/${params.domain}/Section-H/pageStudent/${item.id}/${item.specialty_id}`} key={item.id} className='rounded bg-blue-950 border-2 cursor-pointer dark:hover:bg-teal-300 dark:hover:text-black dark:text-teal-100 flex font-bold h-32 hover:animate-ping-once items-center justify-center lg:h-40 lg:w-[300px] md:h-40 md:text-2xl md:w-56 rounded text-lg text-white tracking-widest w-60'>

    return (
        <div
            className="mt-10 mb-10 flex flex-col gap-4 md:gap-6 px-4 py-6 sm:px-6 md:px-10 lg:px-20"
        >
            {data.map(({ node }) => (
                <div
                    key={node.id}
                    onClick={() => router.push(`/${p.domain}/Section-H/pageStudent/${decodeUrlID(node.id)}/${decodeUrlID(node.specialty.id)}`)}
                    className="rounded-2xl shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-lg transition duration-300"
                >
                    <div className="text-lg font-bold text-blue-700 dark:text-blue-200 mb-2">
                        {node.specialty?.mainSpecialty.specialtyName || 'No Specialty'}
                    </div>

                    <div className="text-sm text-gray-800 dark:text-gray-300 mb-1">
                        <span className="font-medium">Academic Year:</span> {node.specialty?.academicYear}
                    </div>

                    <div className="text-sm text-gray-800 dark:text-gray-300 mb-1">
                        <span className="font-medium">Level:</span> {node.specialty?.level?.level || 'N/A'}
                    </div>

                    <div className="text-sm text-gray-800 dark:text-gray-300">
                        <span className="font-medium">Program:</span> {node.program?.name || 'N/A'}
                    </div>
                </div>
            ))
            }
        </div >
    );
};

export default Display;

















// import { EdgeUserProfile } from '@/utils/Domain/schemas/interfaceGraphql';
// import React from 'react';

// const Display = (
//     { data }:
//         { data: EdgeUserProfile[] }
// ) => {
//     console.log(data);


//     return (
//         <div>
//             {/* <>
//       <div className='flex flex-col gap-4 h-screen items-center justify-center'>

//         <div className='flex flex-col font-semibold gap-10 items-center justify-center mb-4 md:mb-6 text-4xl text-center'>
//           <Link href={"/pageAuthentication/Logout"}><FaPowerOff color="red" /></Link>
//           <LanguageSwitcher currentLocale={currentLocale} />
//         </div>

//         <div className='font-semibold items-center justify-center md:mb-4 md:text-4xl text-center text-xl'>{t("Select Class")}</div>

//         <div className='bg-white px-6 rounded'>
//           {myProfiles && myProfiles.length > 0 ?
//             <div className='flex flex-col gap-4 lg:flex-cols-1 md:gap-6'>
//               {myProfiles.map((item: GetUserProfileInter) => (
//                 <Link href={`/${params.domain}/Section-H/pageStudent/${item.id}/${item.specialty_id}`} key={item.id} className='rounded bg-blue-950 border-2 cursor-pointer dark:hover:bg-teal-300 dark:hover:text-black dark:text-teal-100 flex font-bold h-32 hover:animate-ping-once items-center justify-center lg:h-40 lg:w-[300px] md:h-40 md:text-2xl md:w-56 rounded text-lg text-white tracking-widest w-60'>
//                   <div onClick={() => { localStorage.setItem("profile", item.id.toString()) }} className='flex flex-col items-center justify-center'>
//                     <span className='md:px-6 px-4 text-center text-wrap text-xl'>{item.specialty_name}</span>
//                     <span className='md:text-xl'>{item.academic_year}</span>
//                     <span className='md:text-xl'>{item.level}</span>
//                   </div>
//                 </Link>
//               ))}
//             </div>

//             :

//             <div className='flex flex-col font-medium gap-4 justify-center text-center text-lg tracking-wide w-full'>
//               <div className='flex items-center justify-center text-center text-red'>{t("No Class Assigned")} !!!</div>
//               <div className='flex items-center justify-center text-center'><code>{t("Contact Administration")}</code></div>
//             </div>

//           }
//         </div>

//         <div className="my-10">
//           <button onClick={() => { router.back() }} className='bg-greendark font-medium px-6 py-1 rounded text-lg text-white'>{t("Back")}</button>
//         </div>

//       </div>

//     </> */}
//         </div>
//     );
// }

// export default Display;
