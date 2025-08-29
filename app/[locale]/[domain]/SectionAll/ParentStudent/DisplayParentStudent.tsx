'use client';
import { ConfigData } from '@/utils/config';
import { capitalizeFirstLetter } from '@/utils/functions';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from './Header';

const DisplayParentStudent = (
    { profile, section, role, p }:
        { profile: any, section: "H" | "S" | "P", role: "student" | "parent", p: any }
) => {

    const { t } = useTranslation("common");

    const menuListHigher = [
        { id: 1, link: "CA", label: `${t("CA")}`, icon: "images/ca.svg", notification: false },
        { id: 2, link: "Exam", label: `${t("Exam")}`, icon: "images/resit.svg", notification: false },
        { id: 3, link: "Resit", label: `${t("Resit")}`, icon: "images/exam.svg", notification: false },
        { id: 4, link: "Result", label: `${t("Result")}`, icon: "images/course.svg", notification: false },
        { id: 5, link: "Fees", label: `${t("Fees")}`, icon: "images/fees.svg", notification: false },
        { id: 6, link: "Courses", label: `${t("Courses")}`, icon: "images/news.svg", notification: false },
        // { id: 6, link: "", label: t.TimeTable, icon: "/images/news.svg", notification: false },
        { id: 7, link: "Transcript", label: `${t("Transcript")}`, icon: "images/course.svg", notification: true },
        // { id: 8, link: "News", label: `${t("News")}`, icon: "/images/news.svg", notification: true },
        { id: 8, link: "More", label: `${t("More")}`, icon: "images/news.svg", notification: true },
    ]

    const menuListSecondary = [
        { id: 1, link: "Term1", label: `${t("Term")} 1`, icon: "images/ca.svg", notification: false },
        { id: 2, link: "Term2", label: `${t("Term")} 2`, icon: "images/ca.svg", notification: false },
        { id: 3, link: "Term3", label: `${t("Term")} 3`, icon: "images/ca.svg", notification: false },
        { id: 4, link: "Result", label: `${t("Result")}`, icon: "images/course.svg", notification: false },
        { id: 5, link: "Fees", label: `${t("Fees")}`, icon: "images/fees.svg", notification: false },
        { id: 6, link: "Attendance", label: `${t("Attendance")}`, icon: "images/resit.svg", notification: false },
        { id: 7, link: "Subjects", label: `${t("Subjects")}`, icon: "images/notepad.svg", notification: false },
        { id: 8, link: "Report Card", label: `${t("Report Card")}`, icon: "images/record.svg", notification: true },
        { id: 9, link: "More", label: `${t("More")}`, icon: "images/news.svg", notification: true },
    ]

    const menuListPrimary = [
        { id: 1, link: "Term1", label: `${t("Term")} 1`, icon: "images/ca.svg", notification: false },
        { id: 2, link: "Term2", label: `${t("Term")} 2`, icon: "images/ca.svg", notification: false },
        { id: 3, link: "Term3", label: `${t("Term")} 3`, icon: "images/ca.svg", notification: false },
        { id: 4, link: "Result", label: `${t("Result")}`, icon: "images/course.svg", notification: false },
        { id: 5, link: "Fees", label: `${t("Fees")}`, icon: "images/fees.svg", notification: false },
        { id: 6, link: "Attendance", label: `${t("Attendance")}`, icon: "images/resit.svg", notification: false },
        { id: 7, link: "Subjects", label: `${t("Subjects")}`, icon: "images/notepad.svg", notification: false },
        { id: 8, link: "Report Card", label: `${t("Report Card")}`, icon: "images/record.svg", notification: true },
        { id: 9, link: "More", label: `${t("More")}`, icon: "images/news.svg", notification: true },
    ]

    const List = section === "H" ? menuListHigher : section === "S" ? menuListSecondary : section === "P" ? menuListPrimary : []

    const prefix = section === "H" ? `/Section-H/pageParent/${p.userprofile_id}/${p.specialty_id}` :
        section === "S" ? `/Section-S/pageParent/${p.userprofilesec_id}/${p.classroomsec_id}` :
            section === "P" ? `/Section-p/pageParent/${p.userprofileprim_id}/${p.classroomprim_id}` : []

    return (
        <>
            {profile && <section className="my-6 px-3">

                <Header
                    profile={profile}
                    p={p}
                    role={role}
                />

                <div className='gap-3 grid grid-cols-2 grid-rows-3 mt-3 p-3 pb-16 rounded-[16px]'>
                    {List.map((list: any, index: number) => {
                        return (
                            <Link href={`${prefix}/${list.link}`} key={list.id} className='bg-white flex flex-col h-[86px] items-center justify-center rounded-[20px] shadow-3xl w-full'>
                                <div className="flex relative">
                                    <Image
                                        src={`/${list.icon}`}
                                        alt={list.label}
                                        width={40}
                                        height={40}
                                    />
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
        </>
    );
}

export default DisplayParentStudent;
