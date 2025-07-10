import { ConfigData, protocol, RootApi } from "@/config";
import { EdgeSchoolIdentification } from "@/Domain/schemas/interfaceGraphql";
import initTranslations from "@/initTranslations";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const PreInsNavBar = async ({
  params,
  page,
  info,
}: {
  params: any;
  page: number;
  info: EdgeSchoolIdentification;
}) => {

  const p = await params;

  const { t } = await initTranslations(p.locale, ["home", "common"]);

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-indigo-950 dark:from-gray-900 dark:to-gray-800 text-white flex flex-wrap items-center md:justify-between justify-center gap-2 px-4 py-3 shadow-md rounded-md w-full">

      <div className="flex items-center gap-4 w-full justify-between">
        <>
        <Link href={`/${p.domain}/pre-inscription`} className="block">
          <Image
            width={70}
            height={70}
            src={`${protocol}api${p.domain}${RootApi}/media/${info?.node?.logo}`}
            alt="Logo"
            className="rounded-full bg-white p-2"
            priority
          />
        </Link>
        <span className="text-lg md:text-2xl font-semibold tracking-wide">
          {info?.node?.name}
        </span>
        </>
        <Link
          href={"/"}
          className="text-lg md:text-xl font-semibold tracking-wide justify-end"
        >
          Home
        </Link>
      </div>
    </nav>
  );
};

export default PreInsNavBar;

export const metadata: Metadata = {
  title: "Pre-Inscription Page",
  description: "Pre-Inscription Page",
};
