'use client';
import { JwtPayload } from "@/serverActions/interfaces";
import { jwtDecode } from "jwt-decode";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaCog, FaChartPie } from "react-icons/fa"; // Example icons

// Define types for the menu structure
type MenuItem = {
  icon: JSX.Element;
  label: string;
  route: string;
  children?: MenuItem[]; // Optional children for nested menus
};

type MenuSection = {
  name: string;
  menuItems: MenuItem[];
};

export const getMenuAdministration = (params: { school_id: string; domain: string; pageTitle: string }): MenuSection[] => {
  const { t } = useTranslation()
  const token = localStorage.getItem("token");
  const user: JwtPayload | null = token ? jwtDecode(token) : null;

  return [
    {
      name: "MENU",
      menuItems: [

          ...(user?.page.map((item: string) => item.toUpperCase()).includes("MANAGEMENT")
          ? [
            {
              icon: <FaCog />,
              label: `${t("Management")}`,
              route: "#",
              children: [
                { label: `${t("Dashboard")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageManagement/pageDashboard`, icon: <FaCog /> },
                { label: `${t("User Management")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageManagement/pageUserManagement`, icon: <FaCog /> },
                { label: `${t("Audit Finance")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageManagement/pageFinancial`, icon: <FaCog /> },
                { label: `${t("Audit Results")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageManagement/pageResultAudit`, icon: <FaCog /> },
                { label: `${t("System Updates")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageManagement/pageSystemUpdates`, icon: <FaCog /> },
              ],
            },
          ]
          : []),

        {
          icon: <FaChartPie />,
          label: `${t("Dashboard")}`,
          route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageDashboard`,
        },

        ...((user?.page.map((item: string) => item.toUpperCase()).includes("RESULT") || user?.is_staff)
          ? [
            {
              icon: <FaCog />,
              label: `${t("Result")}`,
              route: "#",
              children: [
                // { label: "School Performance", route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/Performance`, icon: <FaCog /> },
                { label: `${t("Publish Control")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pagePublish`, icon: <FaCog /> },
                { label: `${t("Portal Control")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pagePortals`, icon: <FaCog /> },
                { label: `${t("Promotion")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pagePromote`, icon: <FaCog /> },
              ],
            },
          ]
          : []),


        ...((user?.page.map((item: string) => item.toUpperCase()).includes("DOCUMENT") || user?.is_staff)
          ? [
            {
              icon: <FaCog />,
              label: `${t("Documents")}`,
              route: "#",
              children: [
                { label: `${t("Transcript")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pageTranscript`, icon: <FaCog /> },
                { label: `${t("ID Card")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pageIDCard`, icon: <FaCog /> },
              ],
            },
          ]
          : []),

        {
          icon: <FaCog />,
          label: `${t("Batch Operations")}`,
          route: "#",
          children: [

            ...(user?.is_staff || user?.page.map((item: string) => item.toUpperCase()).includes("MARKENTRY") ?
              [
                { label: `${t("Marks Entry")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry`, icon: <FaCog /> },
              ]
              :
              []),
            { label: `${t("Course Assignment")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageCourseAssignment/`, icon: <FaCog /> },
            { label: `${t("Time Table")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable`, icon: <FaCog /> },
            { label: `${t("Import")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageImport`, icon: <FaCog /> },
          ],
        },

        // {
        //   icon: <FaCog />,
        //   label: "Notifications",
        //   route: "#",
        //   children: [
        //     { label: "Announcements", route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/BatchOperations/pageNotifications/pageAnnouncements`, icon: <FaCog /> },
        //   ],
        // },
      ],
    },
    {
      name: "PROFILES",
      menuItems: [
        {
          icon: <FaCog />,
          label: `${t("Lecturers")}`,
          route: "#",
          children: [
            { label: `${t("View")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageLecturers`, icon: <FaCog /> },
          ],
        },
        {
          icon: <FaCog />,
          label: `${t("Students")}`,
          route: "#",
          children: [
            { label: `${t("View")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents`, icon: <FaCog /> },
            // { label: `${t("Un-Assigned")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/UnAssigned`, icon: <FaCog /> },
            { label: `${t("Pre-Enrollment")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/PreInscription`, icon: <FaCog /> },
            ...(user?.is_staff || user?.page.map((item: string) => item.toUpperCase()).includes("MORATOIRE") ?
              [
                { label: `${t("Moratoire")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/Moratoire`, icon: <FaCog /> },
              ]
              :
              []),
            { label: `${t("Duplicates")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/Duplicates`, icon: <FaCog /> },
          ],
        },

        ...(user?.is_staff || user?.page.map((item: string) => item.toUpperCase()).includes("USER") ?
          [
            {
              icon: <FaChartPie />,
              label: `${t("Users")}`,
              route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUsers`,
            },]
          :
          []),
      ],
    },
    {
      name: "CONFIGS",
      menuItems: [
        {
          icon: <FaCog />,
          label: `${t("Settings")}`,
          route: "#",
          children: [
            { label: `${t("Domains")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains`, icon: <FaCog /> },
            { label: `${t("Fields")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageFields`, icon: <FaCog /> },
            { label: `${t("Classes")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties`, icon: <FaCog /> },
            { label: `${t("Courses")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses`, icon: <FaCog /> },
            { label: `${t("Levels")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageLevels`, icon: <FaCog /> },
            { label: `${t("Programs")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pagePrograms`, icon: <FaCog /> },
            { label: `${t("Halls")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/pageHalls`, icon: <FaCog /> },
          ],
        },
        {
          icon: <FaCog />,
          label: `${t("Utility")}`,
          route: "#",
          children: [
            { label: `${t("Fees Transactions")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/pageFeeTransactions`, icon: <FaCog /> },
            { label: `${t("Activation")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation`, icon: <FaCog /> },
            { label: `${t("Password Tokens")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/pageResetTokens`, icon: <FaCog /> },
          ],
        },
      ],
    },
  ];
};
