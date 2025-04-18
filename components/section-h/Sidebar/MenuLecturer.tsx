import React from "react";
import { FaCog, FaUserShield, FaChartPie } from "react-icons/fa"; // Example icons

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

// Function to generate menu dynamically
export const getMenuLecturer = (params: { school_id: string, domain: string, pageTitle: string, lecturer_id: string }): MenuSection[] => {
  return [

    {
      name: "MENU",
      menuItems: [

        {
          icon: <FaChartPie />,
          label: "Dashboard",
          route: `/${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageDashboard`,
        },
        
        {
          icon: <FaChartPie />,
          label: "My Courses",
          route: `/${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageMyCourses`,
        },

        {
          icon: <FaChartPie />,
          label: "Mark Upload",
          route: `/${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageMarksEntry`,
        },

        {
          icon: <FaChartPie />,
          label: "Time Table",
          route: `/${params.domain}/Section-H/pageLecturer/${params.school_id}/${params.lecturer_id}/pageMyTimeTable`,
        },

      ],
    },

   
  ];
};
