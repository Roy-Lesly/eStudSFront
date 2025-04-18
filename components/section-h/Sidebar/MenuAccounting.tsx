import { jwtDecode } from "jwt-decode";
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

export const getMenuMenuAccounting = (params: { school_id: string; domain: string; pageTitle: string }): MenuSection[] => {
  if (typeof window === "undefined") {
    return [];  // Return empty array or handle server-side logic here
  }
  
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode<{ page: string[] }>(token) : null;

  console.log(user)

  return [
    {
      name: "MENU",
      menuItems: [

        // ...(user?.page.map((item: string) => item.toUpperCase()).includes("ACCOUNTING")
        //   ? [
        //     {
        //       icon: <FaCog />,
        //       label: "Management",
        //       route: "#",
        //       children: [
        //         { label: "Login Performance", route: `/${params.domain}/Section-H/pageAccounting/${params.school_id}/pageManagement/pageLogins`, icon: <FaCog /> },
        //         { label: "Payment Status", route: `/${params.domain}/Section-H/pageAccounting/${params.school_id}/pageManagement/pagePayments`, icon: <FaCog /> },
        //         { label: "Portal Control", route: `/${params.domain}/Section-H/pageAccounting/${params.school_id}/pageManagement/pagePayments`, icon: <FaCog /> },
        //       ],
        //     },
        //   ]
        //   : []),

        {
          icon: <FaChartPie />,
          label: "Dashboard",
          route: `/${params.domain}/Section-H/pageAccounting/${params.school_id}/pageDashboard`,
        },

        {
          icon: <FaChartPie />,
          label: "System Counts",
          route: `/${params.domain}/Section-H/pageAccounting/${params.school_id}/AnalysisSystemCounts`,
        },

        {
          icon: <FaChartPie />,
          label: "Income Domain",
          route: `/${params.domain}/Section-H/pageAccounting/${params.school_id}/AnalysisSystemIncomeDomain`,
        },

        {
          icon: <FaChartPie />,
          label: "Income Specialty",
          route: `/${params.domain}/Section-H/pageAccounting/${params.school_id}/AnalysisSystemIncomeSpecialty`,
        },

      ],
    },

  ];
};
