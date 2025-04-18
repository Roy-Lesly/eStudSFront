import React from 'react'

const page = () => {
  return (
    <div className='flex font-bold items-center justify-center text-2xl'>Coming Soon ...</div>
  )
}

export default page


// import { getData } from "@/functions";
// import { GetNotificationUrl } from "@/Domain/Utils-H/notiControl/notiConfig";
// import { GetNotificationInter } from "@/Domain/Utils-H/notiControl/notiInter";
// import { GetUserProfileUrl } from "@/Domain/Utils-H/userControl/userConfig";
// import { protocol } from "@/config";
// import NotificationError from "@/section-h/common/NotificationError";

// const page = async ({
//   params,
//   searchParams,
// }: {
//   params: { userprofile_id: string, domain: string, specialty_id: string };
//   searchParams?: { [key: string]: string | string[] | undefined };
// }) => {

//   const profile: any = await getData(protocol + "api" + params.domain + GetUserProfileUrl, { id: params.userprofile_id, }, params.domain);

//   const apiNotiSchool: any = await getData(protocol + "api" + params.domain + GetNotificationUrl, { target: "school", schools: profile[0].school_id, status: true, }, params.domain);
//   const apiNotiDomain: any = await getData(protocol + "api" + params.domain + GetNotificationUrl, { target: "domain", domains: profile.results[0].domain_id, status: true, }, params.domain);
//   const apiNotiSpecialty: any = await getData(protocol + "api" + params.domain + GetNotificationUrl, { target: "specialty", specialty: profile[0].specialty_id, status: true, }, params.domain);

//   const removeDuplicates = () => {
//     var arr: any = [...apiNotiSchool.results, ...apiNotiDomain.results, ...apiNotiSpecialty.results]
//     const ids = arr.map((item: GetNotificationInter) => item.id);
//     const filtered = arr.filter((item: GetNotificationInter, index: number) => !ids.includes(item.id, index + 1));
//     return filtered;
//   }

//   const notifications = removeDuplicates()


//   return (
//     <main className="flex flex-col mt-[64px]">

//       {searchParams && <NotificationError errorMessage={searchParams} />}


//       <section className="mx-2">
//         <div className='gap-3 grid grid-cols-1 grid-rows-4 pb-4 rounded-[16px]'>
//           {notifications.map((noti: GetNotificationInter, index: number) => {
//             return (
//               <div key={noti.id} className="bg-blue-100 gap-4 p-2 rounded text-black">
//                 <span className="capitalize font-semibold tracking underline">{noti.noti_type}</span>:
//                 <span className="font-medium italic"> {noti.message_one}</span>,
//                 <span className="font-medium italic"> {noti.message_two}</span>
//               </div>
//             )
//           })}
//         </div>
//       </section>
//     </main>
//   );
// }

// export default page;
