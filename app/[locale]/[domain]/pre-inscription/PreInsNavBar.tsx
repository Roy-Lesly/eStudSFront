import { ConfigData } from "@/config";
import { EdgeSchoolHigherInfo } from "@/Domain/schemas/interfaceGraphql";
import initTranslations from "@/initTranslations";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const PreInsNavBar = async ({
  // searchParams,
  params,
  page,
  info,
}: {
  // searchParams: any;
  params: { locale: string; domain: string };
  page: number;
  info: EdgeSchoolHigherInfo[];
}) => {
  // console.log(searchParams)
  const { t } = await initTranslations(params.locale, ["home", "common"]);

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 dark:from-gray-900 dark:to-gray-800 text-white flex flex-wrap items-center md:justify-between justify-center gap-2 px-4 py-3 shadow-md rounded-md w-full">
      {/* Left Section - Logo & School Name */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <Link href={`/${params.domain}/pre-inscription`} className="block">
          <Image
            width={70}
            height={70}
            src={ConfigData[params.domain]?.logo_main512}
            alt="Logo"
            className="rounded-full"
            priority
          />
        </Link>
        <span className="text-lg md:text-2xl font-semibold tracking-wide">
          {info?.[0]?.node?.schoolIdentification?.name}
        </span>
      </div>
    </nav>
  );
};

export default PreInsNavBar;

export const metadata: Metadata = {
  title: "Pre-Inscription Page",
  description: "Pre-Inscription Page",
};
