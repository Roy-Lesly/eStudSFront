import { JwtPayload } from "@/serverActions/interfaces";
import { jwtDecode } from "jwt-decode";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaChartPie } from "react-icons/fa"; // Example icons


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


export const GetMenuLecturer = (params: { school_id: string, domain: string, pageTitle: string, lecturer_id: string }): MenuSection[] => {
  const { t } = useTranslation()
  const token = localStorage.getItem("token");
  const user: JwtPayload | null = token ? jwtDecode(token) : null;


  return [

    {
      name: "MENU",
      menuItems: [

        {
          icon: <FaChartPie />,
          label: `${t("Dashboard")}`,
          route: `/${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageDashboard`,
        },

        {
          icon: <FaChartPie />,
          label: `${t("My Profile")}`,
          route: `/${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageProfile`,
        },

        {
          icon: <FaChartPie />,
          label: `${t("My Courses")}`,
          route: `/${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageMyCourses`,
        },

        {
          icon: <FaChartPie />,
          label: `${t("Mark Upload")}`,
          route: `/${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageMarksEntry`,
        },

        {
          icon: <FaChartPie />,
          label: `${t("Time Table")}`,
          route: `/${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageMyTimeTable`,
        },

      ],
    },


  ];
};
