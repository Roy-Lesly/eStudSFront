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
              label: `${t("PageSideBar.Management")}`,
              route: "#",
              children: [
                { label: `${t("PageSideBar.Dashboard")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageManagement/pageDashboard`, icon: <FaCog /> },
                { label: `${t("PageSideBar.User Management")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageManagement/pageUserManagement`, icon: <FaCog /> },
                { label: `${t("PageSideBar.Audit Finance")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageManagement/pageFinancial`, icon: <FaCog /> },
                { label: `${t("PageSideBar.Audit Results")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageManagement/pageResultAudit`, icon: <FaCog /> },
                { label: `${t("PageSideBar.System Updates")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageManagement/pageSystemUpdates`, icon: <FaCog /> },
              ],
            },
          ]
          : []),

        {
          icon: <FaChartPie />,
          label: `${t("PageSideBar.Dashboard")}`,
          route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageDashboard`,
        },

        ...((user?.page.map((item: string) => item.toUpperCase()).includes("RESULT") || user?.is_staff)
          ? [
            {
              icon: <FaCog />,
              label: `${t("PageSideBar.Result")}`,
              route: "#",
              children: [
                // { label: "School Performance", route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/Performance`, icon: <FaCog /> },
                { label: `${t("PageSideBar.Publish Control")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pagePublish`, icon: <FaCog /> },
                { label: `${t("PageSideBar.Portal Control")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pagePortals`, icon: <FaCog /> },
                { label: `${t("PageSideBar.Promotion")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pagePromote`, icon: <FaCog /> },
              ],
            },
          ]
          : []),


        ...((user?.page.map((item: string) => item.toUpperCase()).includes("DOCUMENT") || user?.is_staff)
          ? [
            {
              icon: <FaCog />,
              label: `${t("PageSideBar.Documents")}`,
              route: "#",
              children: [
                { label: `${t("PageSideBar.Transcript")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pageTranscript`, icon: <FaCog /> },
                { label: `${t("PageSideBar.ID Card")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageResult/pageIDCard`, icon: <FaCog /> },
              ],
            },
          ]
          : []),

        {
          icon: <FaCog />,
          label: `${t("PageSideBar.Batch Operations")}`,
          route: "#",
          children: [

            ...(user?.is_staff || user?.page.map((item: string) => item.toUpperCase()).includes("MARKENTRY") ?
              [
                { label: `${t("PageSideBar.Marks Entry")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry`, icon: <FaCog /> },
              ]
              :
              []),
            { label: `${t("PageSideBar.Course Assignment")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageCourseAssignment/`, icon: <FaCog /> },
            { label: `${t("PageSideBar.Time Table")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable`, icon: <FaCog /> },
            { label: `${t("PageSideBar.Import")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageImport`, icon: <FaCog /> },
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
          label: `${t("PageSideBar.Lecturers")}`,
          route: "#",
          children: [
            { label: `${t("PageSideBar.View")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageLecturers`, icon: <FaCog /> },
          ],
        },
        {
          icon: <FaCog />,
          label: `${t("PageSideBar.Students")}`,
          route: "#",
          children: [
            { label: `${t("PageSideBar.View")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents`, icon: <FaCog /> },
            // { label: `${t("PageSideBar.Un-Assigned")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/UnAssigned`, icon: <FaCog /> },
            { label: `${t("PageSideBar.Pre-Enrollment")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/PreInscription`, icon: <FaCog /> },
            ...(user?.is_staff || user?.page.map((item: string) => item.toUpperCase()).includes("MORATOIRE") ?
              [
                { label: `${t("PageSideBar.Moratoire")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/Moratoire`, icon: <FaCog /> },
              ]
              :
              []),
            { label: `${t("PageSideBar.Duplicates")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/Duplicates`, icon: <FaCog /> },
          ],
        },

        ...(user?.is_staff || user?.page.map((item: string) => item.toUpperCase()).includes("USER") ?
          [
            {
              icon: <FaChartPie />,
              label: `${t("PageSideBar.Users")}`,
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
          label: `${t("PageSideBar.Settings")}`,
          route: "#",
          children: [
            { label: `${t("PageSideBar.Domains")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains`, icon: <FaCog /> },
            { label: `${t("PageSideBar.Fields")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageFields`, icon: <FaCog /> },
            { label: `${t("PageSideBar.Classes")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties`, icon: <FaCog /> },
            { label: `${t("PageSideBar.Courses")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses`, icon: <FaCog /> },
            { label: `${t("PageSideBar.Levels")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pageLevels`, icon: <FaCog /> },
            { label: `${t("PageSideBar.Programs")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageSettings/pagePrograms`, icon: <FaCog /> },
            { label: `${t("PageSideBar.Halls")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/pageHalls`, icon: <FaCog /> },
          ],
        },
        {
          icon: <FaCog />,
          label: `${t("PageSideBar.Utility")}`,
          route: "#",
          children: [
            { label: `${t("PageSideBar.Fees Transactions")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/pageFeeTransactions`, icon: <FaCog /> },
            { label: `${t("PageSideBar.Activation")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation`, icon: <FaCog /> },
            { label: `${t("PageSideBar.Password Tokens")}`, route: `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageUtilities/pageResetTokens`, icon: <FaCog /> },
          ],
        },
      ],
    },
  ];
};
