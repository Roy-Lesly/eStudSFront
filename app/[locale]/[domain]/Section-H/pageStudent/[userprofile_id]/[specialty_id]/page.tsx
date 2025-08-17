import { ConfigData, protocol, RootApi } from "@/config";
import Image from "next/image";
import Link from "next/link";
import initTranslations from "@/initTranslations";
import { gql } from "@apollo/client";
import { capitalizeFirstLetter, decodeUrlID } from "@/utils/functions";
import { queryServerGraphQL } from "@/utils/graphql/queryServerGraphQL";


const page = async (
  { params }
  : 
  { 
    params: any;
  searchParams: any;
}) => {

  const p = await params;

  const { t } = await initTranslations(p.locale, ['common']);

    const data = await queryServerGraphQL({
      domain: p?.domain,
      query: GET_PROFILE,
      variables: {
          id: p?.userprofile_id
      },
    });


  const menuList = [
    { id: 1, link: "CA", label: `${t("CA")}`, icon: "/images/ca.svg", notification: false },
    { id: 2, link: "Exam", label: `${t("Exam")}`, icon: "/images/resit.svg", notification: false },
    { id: 3, link: "Resit", label: `${t("Resit")}`, icon: "/images/exam.svg", notification: false },
    { id: 4, link: "Result", label: `${t("Result")}`, icon: "/images/course.svg", notification: false },
    { id: 5, link: "Fees", label: `${t("Fees")}`, icon: "/images/fees.svg", notification: false },
    { id: 6, link: "Courses", label: `${t("Courses")}`, icon: "/images/news.svg", notification: false },
    // { id: 6, link: "", label: t.TimeTable, icon: "/images/news.svg", notification: false },
    { id: 7, link: "Transcript", label: `${t("Transcript")}`, icon: "/images/course.svg", notification: true },
    // { id: 8, link: "News", label: `${t("News")}`, icon: "/images/news.svg", notification: true },
    { id: 8, link: "More", label: `${t("More")}`, icon: "/images/news.svg", notification: true },
  ]

  return (
    <main className="mb-20 mt-[70px]">
      {data && data?.allUserProfiles?.edges.length == 1 && <section className="my-6 px-3">

        <div className="bg-blue-950 h-[176px] px-5 py-2 rounded-lg w-full">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <span className="font-bold">{data?.allUserProfiles?.edges[0].node.customuser?.fullName}</span>
              <div className="flex flex-col mt-2">
                <div className="flex gap-2 justify-between">
                  <span className="font-bold">{data?.allUserProfiles?.edges[0].node.specialty?.mainSpecialty.specialtyName}</span>
                </div>

                <div className="flex flex-row gap-2">
                  <div className="flex gap-2 justify-between">
                    <span className="font-bold"> {data?.allUserProfiles?.edges[0].node.specialty?.academicYear}</span> | <span className=""> {data?.allUserProfiles?.edges[0].node.specialty.level.level}</span>
                  </div>    
                </div>

                <div className="flex flex-row gap-2">
                  <div className="flex gap-2 justify-between">
                  {capitalizeFirstLetter(t("Matricle"))}: <span className="font-old italic tracking-widest">{data?.allUserProfiles?.edges[0].node.customuser.matricle}</span>
                  </div>    
                </div>

              </div>
            </div>

            <Link href={`/${p.domain}/pageAuthentication/pageSelectProfile/?user=${decodeUrlID(data?.allUserProfiles?.edges[0].node.customuser?.id)}&role="student"`}>
              <Image
                width={72}
                height={72}
                src={data?.allUserProfiles?.edges[0]?.node?.customuser?.photo ? `${protocol}api${p?.domain}${RootApi}/media/${data?.allUserProfiles?.edges[0]?.node?.customuser?.photo}` : "/images/user/user-01.png"}
                alt="."
                className="rounded-full bg-white"
              />
            </Link>

          </div>

          <div className="mt-2">
            <div className="flex justify-between text-white">
              <p className="text-[12px]">{capitalizeFirstLetter(t("Overall Performance"))}</p>
              <p className="text-[12px]">70%</p>
            </div>
            <div className="before:absolute before:bg-white before:h-[4px] before:left-0 before:rounded-lg before:top-0 before:w-[70%] bg-[#D9D9D9] h-[4px] relative rounded-lg w-full"></div>
          </div>
        </div>

        <div className='gap-3 grid grid-cols-2 grid-rows-3 mt-3 p-3 pb-16 rounded-[16px]'>
          {menuList.map((list: any, index: number) => {
            return (
              <Link href={`/${p.domain}/Section-H/pageStudent/${p.userprofile_id}/${p.specialty_id}/${list.link}`} key={list.id} className='bg-white flex flex-col h-[86px] items-center justify-center rounded-[20px] shadow-3xl w-full'>
                <div className="flex relative">
                  <Image src={list.icon} alt={list.label} width={40} height={40} />
                </div>
                <span className="font-bold text-black">{list.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="flex flex-col px-6 text-sm tracking-widest">
          <Link href={'https://forms.gle/HCTB8EXXAQUQJRA5A'} passHref target="_blank" className="font-medium italic text-blue-800 text-center w-full">
            {capitalizeFirstLetter(t("Feed Back"))}
          </Link>
          <Link href={`https://wa.me/+237${ConfigData.help_number}`} passHref target="_blank" className="font-medium italic text-blue-800 text-center w-full">
            {capitalizeFirstLetter(t("Online Help"))}
          </Link>
        </div>

      </section>}
    </main>
  );
}

export default page;




const GET_PROFILE = gql`
 query GetAllData (
  $id: ID!
 ) {
  allUserProfiles (
    id: $id
  ) {
    edges {
      node {
        id
        customuser { id matricle fullName photo }
        specialty { id academicYear 
          level { level} 
          mainSpecialty { specialtyName}
        }
      }
    }
  }
}
`;