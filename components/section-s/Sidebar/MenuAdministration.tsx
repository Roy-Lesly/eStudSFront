'use client';

import { JwtPayload } from "@/serverActions/interfaces";
import { jwtDecode } from "jwt-decode";
import { useParams } from "next/navigation";
import React from "react";
import {
  Home,
  Users,
  UserPlus,
  ClipboardList,
  BookOpenCheck,
  FileBarChart,
  LayoutDashboard,
  GraduationCap,
  FileText,
  CalendarDays,
  AlarmClock,
  FileSignature,
  Settings,
  Bell,
  MessageCircle,
  FileWarning,
  ClipboardCheck,
  BookOpen,
  FileCheck,
  School2,
  NotebookPen,
  BadgeCheck,
  MessageSquareCode,
  Cog,
  Image,
} from "lucide-react";
import { useTranslation } from "react-i18next";

// Define types for the menu structure
type MenuItem = {
  icon: JSX.Element;
  label: string;
  route: string;
  children?: MenuItem[];
};

type MenuSection = {
  name: string;
  menuItems: MenuItem[];
};

export const GetMenuAdministration = (): MenuSection[] => {
  const { t } = useTranslation("primary");
  const { locale, school_id, domain } = useParams();
  const token = localStorage.getItem("token");
  const user: JwtPayload | null = token ? jwtDecode(token) : null;

  return [
    {
      name: "MAIN MENU",
      menuItems: [
        {
          icon: <LayoutDashboard />, label: t("Dashboard"), route: "#", children: [
            { label: t("Overview"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/dashboard/overview`, icon: <LayoutDashboard /> },
            { label: t("Statistics"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/dashboard/statistics`, icon: <FileBarChart /> },
            { label: t("Notices & Events"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/dashboard/notices-events`, icon: <CalendarDays /> },
          ]
        },
        {
          icon: <Users />, label: t("Students"), route: "#", children: [
            { label: t("Student List"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageStudents`, icon: <Users /> },
            { label: t("New Admission"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageStudents/pageAdmission`, icon: <UserPlus /> },
            { label: t("Pre-Enrolment"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageStudents/PreInscription`, icon: <UserPlus /> },
            { label: t("Class Promotion"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageStudents/promotion`, icon: <BadgeCheck /> },
            { label: t("Attendance"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageStudents/attendance`, icon: <ClipboardList /> },
            { label: t("Moratorium"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageStudents/Moratoire`, icon: <FileWarning /> },
            { label: t("Disciplinary Records"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageStudents/discipline`, icon: <FileWarning /> },
          ]
        },
        {
          icon: <UserPlus />, label: t("Teachers"), route: "#", children: [
            { label: t("Teacher List"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageLecturers`, icon: <Users /> },
            { label: t("Add Teacher"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageLecturers/add`, icon: <UserPlus /> },
            { label: t("Subject Allocation"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageLecturers/allocation`, icon: <NotebookPen /> },
            { label: t("Timetable Assignment"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageLecturers/timetable`, icon: <CalendarDays /> },
            { label: t("Teacher Attendance"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageLecturers/attendance`, icon: <ClipboardCheck /> },
          ]
        },
        {
          icon: <Users />, label: t("User Management"), route: "#", children: [
            { label: t("Parent List"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageUsers/parents`, icon: <Users /> },
            { label: t("Users & Roles"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageUsers/roles`, icon: <UserPlus /> },
            { label: t("Permissions"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageUsers/permissions`, icon: <Settings /> },
            { label: t("Login History"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageUsers/history`, icon: <ClipboardList /> },
          ]
        },
        {
          icon: <School2 />, label: t("Academics"), route: "#", children: [
            { label: t("Manage Classes"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageAcademics/pageClassrooms`, icon: <School2 /> },
            { label: t("Manage Series"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageAcademics/series`, icon: <Users /> },
            // { label: t("Manage Sections"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageAcademics/sections`, icon: <Users /> },
            // { label: t("Seating Arrangement"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageAcademics/seating`, icon: <LayoutDashboard /> },
            // { label: t("Subjects by Grade"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageAcademics/subjects-grade`, icon: <BookOpen /> },
            { label: t("Syllabus Upload"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageAcademics/syllabus`, icon: <FileText /> },
            { label: t("Lesson Plans"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageAcademics/lesson-plans`, icon: <NotebookPen /> },
            { label: t("Weekly Topics"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageAcademics/topics`, icon: <BookOpenCheck /> },
          ]
        },
        {
          icon: <ClipboardCheck />, label: t("Batch Operations"), route: "#", children: [
            { label: t("Assign Class Teachers"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageBatchOperation/teachers`, icon: <UserPlus /> },
            { label: t("Assign Subjects"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageBatchOperation/subjects`, icon: <NotebookPen /> },
            { label: t("Import Subjects"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageBatchOperation/subjects`, icon: <NotebookPen /> },
          ]
        },
        // {
        //   icon: <AlarmClock />, label: t("Timetable"), route: "#", children: [
        //     { label: t("View Timetable"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/timetable/view`, icon: <AlarmClock /> },
        //     { label: t("Generate Timetable"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/timetable/generate`, icon: <CalendarDays /> },
        //     { label: t("Class-wise Timetable"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/timetable/class-wise`, icon: <CalendarDays /> },
        //     { label: t("Teacher-wise Timetable"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/timetable/teacher-wise`, icon: <CalendarDays /> },
        //   ]
        // },
        // {
        //   icon: <FileText />, label: t("Examinations"), route: "#", children: [
        //     { label: t("Exam Types"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/exams/types`, icon: <FileText /> },
        //     { label: t("Schedule Exam"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/exams/schedule`, icon: <CalendarDays /> },
        //     { label: t("Enter Scores"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/exams/scores`, icon: <ClipboardList /> },
        //     { label: t("Grade Setup"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/exams/grades`, icon: <BadgeCheck /> },
        //     { label: t("Report Cards"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/exams/reports`, icon: <FileCheck /> },
        //   ]
        // },
        // {
        //   icon: <FileBarChart />, label: t("Fees & Payments"), route: "#", children: [
        //     { label: t("Fee Structure"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/fees/structure`, icon: <FileBarChart /> },
        //     { label: t("Collect Fees"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/fees/collect`, icon: <ClipboardCheck /> },
        //     { label: t("Payment History"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/fees/history`, icon: <FileText /> },
        //     { label: t("Debtors Report"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/fees/debtors`, icon: <FileWarning /> },
        //     { label: t("Generate Invoice"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/fees/invoice`, icon: <FileSignature /> },
        //   ]
        // },
        // {
        //   icon: <BookOpenCheck />, label: t("Library & Store"), route: "#", children: [
        //     { label: t("Manage Supplies"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/store/supplies`, icon: <BookOpen /> },
        //     { label: t("Distribution Log"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/store/distribution`, icon: <ClipboardList /> },
        //     { label: t("Stock Alert"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/store/stock-alert`, icon: <FileWarning /> },
        //     { label: t("Book List"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/library/books`, icon: <BookOpenCheck /> },
        //     { label: t("Issue Book"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/library/issue`, icon: <ClipboardCheck /> },
        //     { label: t("Return Book"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/library/return`, icon: <ClipboardCheck /> },
        //     { label: t("Library Members"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/library/members`, icon: <Users /> },
        //   ]
        // },
        // {
        //   icon: <Bell />, label: t("Events & Notifications"), route: "#", children: [
        //     { label: t("Send Bulk SMS"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/events/sms`, icon: <MessageSquareCode /> },
        //     { label: t("Internal Messaging"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/events/messages`, icon: <MessageCircle /> },
        //     { label: t("Announcements"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/events/announcements`, icon: <Bell /> },
        //     { label: t("Email Alerts"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/events/emails`, icon: <MessageSquareCode /> },
        //     { label: t("School Calendar"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/events/calendar`, icon: <CalendarDays /> },
        //     { label: t("Events Management"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/events/management`, icon: <CalendarDays /> },
        //     { label: t("Holiday Setup"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/events/holidays`, icon: <CalendarDays /> },
        //   ]
        // },
        {
          icon: <Settings />, label: t("Settings"), route: "#", children: [
            { label: t("School Profile"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageSettings/pageSchoolInfo`, icon: <School2 /> },
            // { label: t("Academic Year Settings"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageSettings/academic-year`, icon: <CalendarDays /> },
            // { label: t("Term/Session Management"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageSettings/terms`, icon: <CalendarDays /> },
            { label: t("Subject List"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageSettings/pageMainSubjects`, icon: <BookOpen /> },
            // { label: t("Class/Grade Levels"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageSettings/pageLevels`, icon: <School2 /> },
            { label: t("Halls"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageSettings/pageHalls`, icon: <School2 /> },
            // { label: t("Theme Preferences"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageSettings/theme`, icon: <Cog /> },
            // { label: t("SMS/Email Settings"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageSettings/notifications`, icon: <MessageCircle /> },
            // { label: t("Backup & Restore"), route: `/${locale}/${domain}/Section-S/pageAdministration/${school_id}/pageSettings/backup`, icon: <FileCheck /> },
          ]
        }
      ]
    }
  ];
};
