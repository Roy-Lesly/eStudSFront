import { protocol, RootApi } from '@/utils/config';
import { capitalizeFirstLetter, decodeUrlID } from '@/utils/functions';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Header = (
    { profile, p, role }:
    { profile: any, p: any, role: "student" | "parent" }
) => {

    const { t } = useTranslation("common");
    const tel = localStorage.getItem("tel")
    const specialty = profile?.specialty
    const classroomsec = profile?.classroomsec
    const classroomprim = profile?.classroomprim

    return (
        <div className="bg-blue-950 h-[176px] px-5 py-2 rounded-lg w-full">
            <div className="flex items-center justify-between">
                <div className="text-white">
                    <span className="font-bold">{profile?.customuser?.fullName}</span>
                    <div className="flex flex-col mt-2">
                        <div className="flex gap-2 justify-between">
                            <span className="font-bold">
                                {specialty?.mainSpecialty.specialtyName}
                                {classroomsec?.level}
                            </span>
                        </div>

                        <div className="flex flex-row gap-2">
                            <div className="flex gap-2 justify-between">
                                <span className="font-bold">
                                    {specialty?.academicYear}
                                    {classroomsec?.academicYear}
                                </span>
                                |
                                <span className="">
                                    {specialty?.level?.level}
                                    {classroomsec?.classType}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-row gap-2">
                            <div className="flex gap-2 justify-between">
                                {capitalizeFirstLetter(t("Matricle"))}: <span className="font-old italic tracking-widest">{profile?.customuser?.matricle}</span>
                            </div>
                        </div>

                    </div>
                </div>

                <Link
                    href={`/${p.domain}/pageAuthentication/pageSelectChildProfile/?tel=${tel}&role=${role}"`}
                >
                    <Image
                        width={72}
                        height={72}
                        src={profile?.customuser?.photo ? `${protocol}api${p?.domain}${RootApi}/media/${profile?.customuser?.photo}` : "/images/user/user-01.png"}
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
    );
}

export default Header;
