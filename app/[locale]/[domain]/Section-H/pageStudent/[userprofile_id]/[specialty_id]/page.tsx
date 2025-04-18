import { ConfigData, protocol } from "@/config";
import { capitalizeFirstLetter, getData } from "@/functions";
import { GetUserProfileUrl } from "@/Domain/Utils-H/userControl/userConfig";
import Image from "next/image";
import Link from "next/link";
import { GetUserProfileInter } from "@/Domain/Utils-H/userControl/userInter";
import initTranslations from "@/initTranslations";


const page = async (
  { params }
  : 
  { params: { locale: string, userprofile_id: string, domain: string, specialty_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const profile: GetUserProfileInter[] = await getData(protocol + "api" + params.domain + GetUserProfileUrl, { id: params.userprofile_id, nopage: true }, params.domain);

  const { t: trans } = await initTranslations(params.locale, ['common'])
  const t = trans("PageStudent").menu

  const menuList = [
    { id: 1, link: "CA", label: t?.CA, icon: "/images/ca.svg", notification: false },
    { id: 2, link: "Exam", label: t?.Exam, icon: "/images/resit.svg", notification: false },
    { id: 3, link: "Resit", label: t?.Resit, icon: "/images/exam.svg", notification: false },
    { id: 4, link: "Result", label: t?.Result, icon: "/images/course.svg", notification: false },
    { id: 5, link: "Fees", label: t?.Fees, icon: "/images/fees.svg", notification: false },
    { id: 6, link: "Courses", label: t?.Courses, icon: "/images/news.svg", notification: false },
    // { id: 6, link: "", label: t.menu.TimeTable, icon: "/images/news.svg", notification: false },
    { id: 7, link: "Transcript", label: t?.Transcript, icon: "/images/course.svg", notification: true },
    { id: 8, link: "News", label: t?.News, icon: "/images/news.svg", notification: true },
  ]

  return (
    <main className="mb-20 mt-[70px]">
      {profile && profile.length && profile.length == 1 && <section className="my-6 px-3">

        <div className="bg-blue-950 h-[176px] px-5 py-2 rounded-lg w-full">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <span className="font-bold">{profile[0].full_name}</span>
              <div className="flex flex-col mt-2">
                <div className="flex gap-2 justify-between">
                  <span className="font-bold">{profile[0].specialty_name}</span>
                </div>

                <div className="flex flex-row gap-2">
                  <div className="flex gap-2 justify-between">
                    <span className="font-bold"> {profile[0].academic_year}</span> | <span className=""> {profile[0].level}</span>
                  </div>    
                </div>

                <div className="flex flex-row gap-2">
                  <div className="flex gap-2 justify-between">
                  {capitalizeFirstLetter(t?.Matricle)}: <span className="font-old italic tracking-widest">{profile[0].matricle}</span>
                  </div>    
                </div>

              </div>
            </div>

            <Link href={`/${params.domain}/Section-H/pageStudent`}>
              <Image
                width={72}
                height={72}
                src={"/images/user/user-01.png"}
                style={{
                  width: "auto",
                  height: "auto",
                }}
                alt="User"
              />
            </Link>

          </div>

          <div className="mt-2">
            <div className="flex justify-between text-white">
              <p className="text-[12px]">{capitalizeFirstLetter(t["Overall Performance"])}</p>
              <p className="text-[12px]">70%</p>
            </div>
            <div className="before:absolute before:bg-white before:h-[4px] before:left-0 before:rounded-lg before:top-0 before:w-[70%] bg-[#D9D9D9] h-[4px] relative rounded-lg w-full"></div>
          </div>
        </div>

        <div className='gap-3 grid grid-cols-2 grid-rows-3 mt-3 p-3 pb-16 rounded-[16px]'>
          {menuList.map((list: any, index: number) => {
            return (
              <Link href={`/${params.domain}/Section-H/pageStudent/${params.userprofile_id}/${params.specialty_id}/${list.link}`} key={list.id} className='bg-white flex flex-col h-[86px] items-center justify-center rounded-[20px] shadow-3xl w-full'>
                <div className="flex relative">
                  {/* <div className={`${list.notification && notifications.length > 0 ? "bg-red" : ""} -translate-y-1/2 absolute animate-pulse  bottom-auto inline-block left-auto  p-1.5 right-0 rotate-0 rounded-full scale-x-100 scale-y-100 skew-x-0 skew-y-0 text-xs top-0 translate-x-2/4 z-10`}></div> */}
                  <Image src={list.icon} alt={list.label} width={40} height={40} />
                </div>
                <span className="font-bold text-black">{list.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="flex flex-col px-6 text-sm tracking-widest">
          <Link href={'https://forms.gle/HCTB8EXXAQUQJRA5A'} passHref target="_blank" className="font-medium italic text-blue-800 text-center w-full">
            {capitalizeFirstLetter(t?.Feedback)}
          </Link>
          <Link href={`https://wa.me/+237${ConfigData.help_number}`} passHref target="_blank" className="font-medium italic text-blue-800 text-center w-full">
            {capitalizeFirstLetter(t["Online Help"])}
          </Link>
        </div>

      </section>}
    </main>
  );
}

export default page;
