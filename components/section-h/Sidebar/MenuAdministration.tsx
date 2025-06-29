'use client';
import { JwtPayload } from "@/serverActions/interfaces";
import { jwtDecode } from "jwt-decode";
import { useParams } from "next/navigation";
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

export const GetMenuAdministration = () => {
  const { t } = useTranslation();
  const { school_id, domain } = useParams();
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
                { label: `${t("Dashboard")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageManagement/pageDashboard`, icon: <FaCog /> },
                { label: `${t("User Management")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageManagement/pageUserManagement`, icon: <FaCog /> },
                { label: `${t("Audit Finance")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageManagement/pageFinancial`, icon: <FaCog /> },
                { label: `${t("Audit Results")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageManagement/pageResultAudit`, icon: <FaCog /> },
                { label: `${t("System Updates")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageManagement/pageSystemUpdates`, icon: <FaCog /> },
              ],
            },
          ]
          : []),

        {
          icon: <FaChartPie />,
          label: `${t("Dashboard")}`,
          route: `/${domain}/Section-H/pageAdministration/${school_id}/pageDashboard`,
        },

        ...((user?.page.map((item: string) => item.toUpperCase()).includes("RESULT") || user?.is_staff)
          ? [
            {
              icon: <FaCog />,
              label: `${t("Result")}`,
              route: "#",
              children: [
                // { label: "School Performance", route: `/${domain}/Section-H/pageAdministration/${school_id}/pageResult/Performance`, icon: <FaCog /> },
                { label: `${t("Publish Control")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageResult/pagePublish`, icon: <FaCog /> },
                { label: `${t("Portal Control")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageResult/pagePortals`, icon: <FaCog /> },
                { label: `${t("Promotion")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageResult/pagePromote`, icon: <FaCog /> },
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
                { label: `${t("Transcript")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageResult/pageTranscript`, icon: <FaCog /> },
                { label: `${t("ID Card")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageResult/pageIDCard`, icon: <FaCog /> },
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
                { label: `${t("Marks Entry")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageBatchOperation/pageMarksEntry`, icon: <FaCog /> },
              ]
              :
              []),
            { label: `${t("Course Assignment")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageBatchOperation/pageCourseAssignment/`, icon: <FaCog /> },
            { label: `${t("Time Table")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageBatchOperation/pageTimeTable`, icon: <FaCog /> },
            { label: `${t("Import")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageBatchOperation/pageImport`, icon: <FaCog /> },
          ],
        },

        // {
        //   icon: <FaCog />,
        //   label: "Notifications",
        //   route: "#",
        //   children: [
        //     { label: "Announcements", route: `/${domain}/Section-H/pageAdministration/${school_id}/BatchOperations/pageNotifications/pageAnnouncements`, icon: <FaCog /> },
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
            { label: `${t("View")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageLecturers`, icon: <FaCog /> },
          ],
        },
        {
          icon: <FaCog />,
          label: `${t("Students")}`,
          route: "#",
          children: [
            { label: `${t("View")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageStudents`, icon: <FaCog /> },
            // { label: `${t("Un-Assigned")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageStudents/UnAssigned`, icon: <FaCog /> },
            { label: `${t("Pre-Enrollment")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageStudents/PreInscription`, icon: <FaCog /> },
            ...(user?.is_staff || user?.page.map((item: string) => item.toUpperCase()).includes("MORATOIRE") ?
              [
                { label: `${t("Moratoire")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageStudents/Moratoire`, icon: <FaCog /> },
              ]
              :
              []),
            { label: `${t("Duplicates")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageStudents/Duplicates`, icon: <FaCog /> },
          ],
        },

        ...(user?.is_staff || user?.page.map((item: string) => item.toUpperCase()).includes("USER") ?
          [
            {
              icon: <FaChartPie />,
              label: `${t("Users")}`,
              route: `/${domain}/Section-H/pageAdministration/${school_id}/pageUsers`,
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
            { label: `${t("Domain")}s`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageSettings/pageDomains`, icon: <FaCog /> },
            { label: `${t("Field")}s`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageSettings/pageFields`, icon: <FaCog /> },
            { label: `${t("Classe")}s`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageSettings/pageSpecialties`, icon: <FaCog /> },
            { label: `${t("Course")}s`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageSettings/pageCourses`, icon: <FaCog /> },
            { label: `${t("Level")}s`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageSettings/pageLevels`, icon: <FaCog /> },
            { label: `${t("Program")}s`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageSettings/pagePrograms`, icon: <FaCog /> },
            { label: `${t("Hall")}s`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageUtilities/pageHalls`, icon: <FaCog /> },
          ],
        },
        {
          icon: <FaCog />,
          label: `${t("Utility")}`,
          route: "#",
          children: [
            { label: `${t("Fees Transactions")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageUtilities/pageFeeTransactions`, icon: <FaCog /> },
            { label: `${t("Activation")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageUtilities/pagePlatformActivation`, icon: <FaCog /> },
            { label: `${t("ID Cards")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageUtilities/pageIDPLAT/ID`, icon: <FaCog /> },
            { label: `${t("Platform")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageUtilities/pageIDPLAT/PLATFORM`, icon: <FaCog /> },
            { label: `${t("Password Tokens")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageUtilities/pageResetTokens`, icon: <FaCog /> },
          ],
        },
      ],
    },
  ];
};
